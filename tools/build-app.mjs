/* THE APP, AS ONE FILE (21 Sep 2026).
   `npm run build:artifact` stages the design system — 131 pages, the specifications, the foundations.
   This stages the product alone, for a link someone opens on a phone: `screens/app.html` with its
   JSX compiled, its stylesheet inlined and the component bundle inlined, so the whole app is a
   single HTML document and the only things it fetches are React and ReactDOM.

   Three differences from the site build, each for the phone rather than the desk:

   1. **React ships production, not development.** The repository's pages load the development builds
      on purpose — the warnings are worth having while you work. On a phone over mobile data they are
      1.1 MB of download to be told nothing, so this build asks for the minified ones.
   2. **The bundle is inlined.** One request instead of two, and nothing to go missing.
   3. **The `file://` guard is stripped**, exactly as the site build strips it, because this copy is
      the one that does not need a compiler.

   Output: `app/index.html` and `app/vercel.json`. Deploy it by running `npx vercel --prod` from
   inside `app/` — it is its own project, with no build step and nothing to install. */
import { mkdir, rm, writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app');
const { precompilePage } = await import('./precompile-jsx.mjs');

/* KEEP `.vercel/`. This script rebuilds the folder from scratch, and the first time it ran after a
   deployment it deleted `app/.vercel/project.json` with everything else — so the next
   `npx vercel --prod` had no link and asked which project to deploy to, with the design-system
   project sitting at the top of the list as the default. A build step that can quietly point a
   deployment at the wrong project is a defect, not an inconvenience. */
const LINK = join(OUT, '.vercel');
const keep = existsSync(LINK) ? await readdir(LINK).then(async (fs) => {
  const held = [];
  for (const f of fs) held.push([f, await readFile(join(LINK, f))]);
  return held;
}) : null;

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

if (keep) {
  await mkdir(LINK, { recursive: true });
  for (const [f, buf] of keep) await writeFile(join(LINK, f), buf);
  console.log(`kept app/.vercel/ — ${keep.length} file(s), so the deployment link survives the rebuild`);
}

let html = await readFile(join(ROOT, 'screens', 'app.html'), 'utf8');

/* Compile the JSX against the page's real location, so `src="./proto.jsx"` still resolves. */
const { html: compiled, compiled: n } = precompilePage(html, join(ROOT, 'screens', 'app.html'));
html = compiled;

/* React, minified. Same version, same behaviour, without the development warnings. */
html = html
  .replace(/react@([\d.]+)\/umd\/react\.development\.js/, 'react@$1/umd/react.production.min.js')
  .replace(/react-dom@([\d.]+)\/umd\/react-dom\.development\.js/, 'react-dom@$1/umd/react-dom.production.min.js')
  .replace(/https:\/\/unpkg\.com\/react@([\d.]+)\/umd\//g, 'https://cdnjs.cloudflare.com/ajax/libs/react/$1/umd/')
  .replace(/https:\/\/unpkg\.com\/react-dom@([\d.]+)\/umd\//g, 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/$1/umd/');

/* The theme, in the page. Same five files in the same order `styles.css` imported them. */
const TOKENS = ['fonts.css', 'colors.css', 'typography.css', 'spacing.css', 'effects.css'];
let css = '';
for (const f of TOKENS) {
  css += (await readFile(join(ROOT, 'design-system', 'tokens', f), 'utf8'))
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]+/gm, '').replace(/\n{2,}/g, '\n').trim() + '\n';
}
html = html.replace(/<link rel="stylesheet" href="[^"]*styles\.css"\s*\/?>/, `<style>${css}</style>`);

/* The components, in the page. A script element's text may not contain `</script>`. */
const bundle = await readFile(join(ROOT, 'design-system', '_ds_bundle.js'), 'utf8');
html = html.replace(
  /<script src="[^"]*_ds_bundle\.js"><\/script>/,
  `<script>${bundle.replace(/<\/script/gi, '<\\/script')}</script>`,
);

await writeFile(join(OUT, 'index.html'), html);

/* The home-screen files sit beside the page rather than inside it: a manifest has to be its own
   document for a browser to read it, and an icon has to be a real file for iOS to put on a home
   screen. Four small files; the app is still one HTML document. */
const { copyFile } = await import('node:fs/promises');
const ASSETS = join(ROOT, 'screens', 'app-assets');
let assets = 0;
for (const f of await readdir(ASSETS)) {
  if (f.startsWith('.') || f.endsWith('.svg')) continue; // the svg is the source the pngs come from
  await copyFile(join(ASSETS, f), join(OUT, f));
  assets += 1;
}
/* AND THE EXPLORER'S ART, WHICH THE PAGE ASKS FOR BY PATH (23 Sep 2026). `window.__EXPLORER_ART` is
   `./explorer/art`, and the funnel builds `<img src>` from it for the four asset textures, the eight
   client faces and the lattice. Inlining them is not an option the way the bundle was: they are
   referenced as URLs from inside compiled JSX, not imported. So they are copied, the way the home-
   screen icons already are. Measured before this ran: `app/` shipped ZERO of them, so every tile and
   every face in the deployed app was a broken image — the build's own boot check never caught it
   because a 404 on an <img> is not a console error and the page renders around it.

   A build that silently drops what the page asks for is the failure this whole file exists to avoid,
   so the count is asserted rather than reported: no art, no build. */
const ART_SRC = join(ROOT, 'screens', 'explorer', 'art');
let art = 0;
if (existsSync(ART_SRC)) {
  const walkArt = async (dir, rel = '') => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const from = join(dir, e.name);
      const to = join(OUT, 'explorer', 'art', rel, e.name);
      if (e.isDirectory()) { await mkdir(to, { recursive: true }); await walkArt(from, join(rel, e.name)); }
      else { await mkdir(dirname(to), { recursive: true }); await copyFile(from, to); art += 1; }
    }
  };
  await walkArt(ART_SRC);
}
if (!art) { console.error('app/: the explorer art did not copy — every tile and face would be a broken image'); process.exit(1); }

await writeFile(join(OUT, 'vercel.json'), JSON.stringify({
  $schema: 'https://openapi.vercel.sh/vercel.json',
  cleanUrls: false,
  trailingSlash: false,
  headers: [{ source: '/(.*)', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] }],
}, null, 2) + '\n');

const left = [
  ['un-compiled JSX', /type="text\/babel"/.test(html)],
  ['the file:// guard', /data-ds-file-guard/.test(html)],
  ['a stylesheet link', /<link rel="stylesheet"/.test(html)],
  /* Look for the TAG, not the name: the bundle's own code contains the string `_ds_bundle.js`, in
     the message a spec page prints when the build is behind it, so a bare name match is always true
     once the bundle is inlined and the check fails on the very thing it is meant to confirm. */
  ['an un-inlined bundle', /<script src="[^"]*_ds_bundle\.js"/.test(html)],
  ['a development React', /development\.js/.test(html)],
];
const bad = left.filter(([, present]) => present).map(([what]) => what);
if (bad.length) { console.error(`app/index.html still carries ${bad.join(', ')}`); process.exit(1); }

console.log(`app/index.html: ${(html.length / 1024).toFixed(0)} KB, ${n} JSX blocks compiled in, plus ${assets} home-screen files and ${art} explorer art files`);
console.log('check it boots:  npm run check:app');
console.log('deploy it with:  cd app && npx vercel --prod');
