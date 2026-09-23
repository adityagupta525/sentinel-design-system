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

/* THE EXPLORER'S ART, IN THE PAGE (23 Sep 2026). It was copied beside index.html first, and that is
   how the owner found the real problem: the copies were correct, and the ARTIFACT could not reach
   them, because it serves the page at a URL with no trailing slash and `./explorer/art/equity.webp`
   resolves one directory too high. Four broken-image glyphs on the asset tiles and a broken face on
   every client row. Thirteen files, 72 KB, inlined as data URIs — which also makes the promise at the
   top of this file true for the first time: the only things this page fetches are React and ReactDOM.

   BEFORE the compiled scripts, because `artUrl()` reads the map at module scope; a tag after them
   arrives too late. The page's own `__EXPLORER_ART` line is the hook, and it stays as the fallback
   for anything serving these from disk. */
const { explorerArtScript } = await import('./explorer-art.mjs');
const { n: artCount, script: artScript } = explorerArtScript(join(ROOT, 'screens', 'explorer', 'art'));
if (!artCount) { console.error('app/: no explorer art found — every tile and face would be a broken image'); process.exit(1); }
const artHook = /<script>window\.__EXPLORER_ART = "[^"]*";/;
if (!artHook.test(html)) { console.error('app/: screens/app.html no longer sets __EXPLORER_ART — the art cannot be injected'); process.exit(1); }
html = html.replace(artHook, (m) => `${artScript}\n${m}`);

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

console.log(`app/index.html: ${(html.length / 1024).toFixed(0)} KB, ${n} JSX blocks compiled in, ${artCount} explorer art files inlined, plus ${assets} home-screen files`);
console.log('check it boots:  npm run check:app');
console.log('deploy it with:  cd app && npx vercel --prod');
