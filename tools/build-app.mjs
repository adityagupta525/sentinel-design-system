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
import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app');
const { precompilePage } = await import('./precompile-jsx.mjs');

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

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

console.log(`app/index.html: one file, ${(html.length / 1024).toFixed(0)} KB, ${n} JSX blocks compiled in`);
console.log('deploy it with:  cd app && npx vercel --prod');
