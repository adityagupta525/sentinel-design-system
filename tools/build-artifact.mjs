/* build-artifact — stages a shareable artifact of the whole product.
 *
 * The owner, 20 Sep 2026: the artifact's navigation looked complex, and it is going to a team. The
 * previous one published the page TREE, so the first thing a reader met was a directory. This one
 * publishes a cover that is grouped the way the work is grouped — drive it, the six journeys, the
 * system, the foundations, the rules — and the tree sits behind it.
 *
 * Output: `artifact/` (gitignored, a build output). Publish the staged index.html with the rest as
 * supporting files.
 *
 * THREE UNDERSCORE FILES ARE RENAMED in staging and their references rewritten, because a leading
 * underscore is not servable: _ds_bundle.js, _ds_manifest.json, pages/_index.json.
 */
import { cp, mkdir, rm, writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'site');
const walk = async (dir, filter, acc = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue; // .DS_Store and friends are not content
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, filter, acc);
    else if (filter(p)) acc.push(p);
  }
  return acc;
};
/* THE ARTIFACT CSP DOES NOT ALLOW unpkg, AND EVERY PAGE LOADED REACT FROM IT (20 Sep 2026).
   The published cover rendered — it is plain HTML with no scripts — and every page behind it came up
   blank, because React, ReactDOM and Babel were blocked before they ran. Found by the owner opening
   the link, which is the only place it could be found: `check:artifact` served the staged copy from
   this repository's own dev server, where those URLs resolve. A gate that cannot see the environment
   it is a gate for is not a gate, and `check:artifact` runs under the real CSP now.

   `cdnjs.cloudflare.com` is the host the CSP prefers and it carries all three at the same versions.
   The `integrity` hashes were computed against unpkg's bytes, so they go with the host — a hash for a
   file you are no longer fetching blocks the file you are. jsdelivr's `/npm/` is allowed, so d3 is
   untouched. */
const CDN = [
  [/https:\/\/unpkg\.com\/react@([\d.]+)\/umd\//g, 'https://cdnjs.cloudflare.com/ajax/libs/react/$1/umd/'],
  [/https:\/\/unpkg\.com\/react-dom@([\d.]+)\/umd\//g, 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/$1/umd/'],
  [/https:\/\/unpkg\.com\/@babel\/standalone@([\d.]+)\//g, 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/$1/'],
];
const rewrite = (s) => {
  let out = s
    .replace(/_ds_bundle\.js/g, 'ds_bundle.js')
    .replace(/_ds_manifest\.json/g, 'ds_manifest.json')
    .replace(/_index\.json/g, 'index-data.json');
  for (const [re, to] of CDN) out = out.replace(re, to);
  /* Drop the integrity + crossorigin pair on the three rewritten script tags only. */
  out = out.replace(/(<script src="https:\/\/cdnjs\.cloudflare\.com[^"]*")[^>]*?(><\/script>)/g, '$1 crossorigin="anonymous"$2');
  return out;
};

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const copyText = async (from, to) => {
  await mkdir(dirname(join(OUT, to)), { recursive: true });
  await writeFile(join(OUT, to), rewrite(await readFile(join(ROOT, from), 'utf8')));
};
const copyBin = async (from, to) => {
  await mkdir(dirname(join(OUT, to)), { recursive: true });
  await cp(join(ROOT, from), join(OUT, to));
};

/* the system's own files the pages fetch at runtime */
await copyText('design-system/_ds_bundle.js', 'ds_bundle.js');
await copyBin('design-system/styles.css', 'styles.css');
if (existsSync(join(ROOT, 'design-system/_ds_manifest.json'))) await copyText('design-system/_ds_manifest.json', 'ds_manifest.json');
for (const f of await readdir(join(ROOT, 'design-system/tokens'))) await copyBin(`design-system/tokens/${f}`, `tokens/${f}`);
for (const f of await readdir(join(ROOT, 'design-system/pages'))) {
  if (f === '_index.json') { await copyText('design-system/pages/_index.json', 'pages/index-data.json'); continue; }
  if (f.endsWith('.html') || f.endsWith('.jsx')) await copyText(`design-system/pages/${f}`, `pages/${f}`);
}
for (const f of await readdir(join(ROOT, 'design-system/guidelines'))) await copyText(`design-system/guidelines/${f}`, `guidelines/${f}`);
/* The contracts are staged so the precompile step can inline each one into the page that fetches it;
   the 111 separate copies are then folded into a single `contracts.d.ts` further down. */
for (const p of await walk(join(ROOT, 'design-system/components'), (p) => p.endsWith('.d.ts'))) {
  await copyText(relative(ROOT, p), relative(join(ROOT, 'design-system'), p));
}
/* THE KITS ARE NOT IN THE ARTIFACT, and the reason is a hard limit rather than a judgement: an
   artifact publishes at most 255 files, and with every component specified the system's own pages
   and contracts take 254 of them. The kits were redrawn on the built screens on 20 Sep, so the
   screens are the current thing and the kits are the record of where they came from — which is the
   half that belongs in the repository rather than in a link sent to a team. */
/* the readme and the skill: the specification travels with the pages that implement it */
for (const f of ['design-system/readme.md', 'design-system/SKILL.md']) {
  if (existsSync(join(ROOT, f))) await copyText(f, f.split('/').pop());
}
/* screens: the pages, their modules, and the one fixture.

   `screens/app.html` is left out, and the reason is a limit rather than a judgement: an artifact
   version may carry 255 files and this is 255. app.html is the product with the documentation taken
   off, for a phone — `npm run build:app` stages it as one self-contained file with its own
   deployment, so it is not missing, it is elsewhere. `screens/prototype.html` is the same product
   with its documentation, and that is the one this site is for. */
for (const p of await walk(join(ROOT, 'screens'), (p) => p.endsWith('.html') || p.endsWith('.jsx'))) {
  const rel = relative(ROOT, p);
  if (rel === 'screens/app.html') continue;
  await copyText(rel, rel);
}
/* the screen pages reach the bundle with ../../design-system/_ds_bundle.js — repoint to the root copy */
for (const p of await walk(join(OUT, 'screens'), (p) => p.endsWith('.html'))) {
  let s = await readFile(p, 'utf8');
  s = s.replace(/(\.\.\/)+design-system\/ds_bundle\.js/g, (m) => '../'.repeat((relative(OUT, p).match(/\//g) || []).length) + 'ds_bundle.js');
  s = s.replace(/(\.\.\/)+design-system\/styles\.css/g, (m) => '../'.repeat((relative(OUT, p).match(/\//g) || []).length) + 'styles.css');
  await writeFile(p, s);
}
/* THE TOKENS GO INTO THE PAGE (20 Sep 2026).
   The owner opened site/index.html and got the cover with no theme at all: serif type, blue default
   links, no cards. Measured — the page's own inline CSS had applied and `styles.css` had not, so
   every `var(--color-…)` fell back to nothing. Chromium and WebKit both load it correctly over
   `file://`, so this is not a browser: it is a viewer that renders one file without its siblings,
   which macOS Quick Look and an in-app preview pane both do.

   Calling `site/` self-contained while every page still fetched five stylesheets was simply wrong.
   The five token files are 23 KB, 9 KB without their comments; inlining them in the order
   `styles.css` imported them costs about 1 MB across 131 pages and removes the last thing a page
   needs before it can draw itself correctly. `ds_bundle.js` stays external — 239 KB on 111 pages is
   not worth it, and a page that needs JavaScript wants a browser anyway. */

/* Now that every path is final, compile the pages' JSX into the pages. See
   `tools/precompile-jsx.mjs` for why the artifact may not carry a compiler. */
/* The staging does not carry `design-system/assets/` — there is no room under the 255-file limit and
   one page uses one file from it. Over http the published copy still resolved it, because a file
   published once is kept; a downloaded folder has no such luck and showed a broken image. The svg
   goes into the page instead of into the tree, which costs no file slot. */
let assetsInlined = 0;
for (const p of await walk(OUT, (p) => p.endsWith('.html'))) {
  let s = await readFile(p, 'utf8');
  const next = s.replace(/(?:\.\.\/)*assets\/([\w/.-]+\.svg)/g, (m, rel) => {
    const src = join(ROOT, 'design-system', 'assets', rel);
    if (!existsSync(src)) return m;
    assetsInlined += 1;
    return `data:image/svg+xml;base64,${readFileSync(src).toString('base64')}`;
  });
  if (next !== s) await writeFile(p, next);
}
console.log(`inlined ${assetsInlined} asset reference(s) as data URIs`);

const { precompilePage, inlineFetches } = await import('./precompile-jsx.mjs');
let tags = 0, pagesTouched = 0, cached = 0;
for (const p of await walk(OUT, (p) => p.endsWith('.html'))) {
  const before = await readFile(p, 'utf8');
  const { html, compiled } = precompilePage(before, p);
  const withCache = inlineFetches(html, p, OUT);
  /* Write when anything changed, not when something compiled. Keyed on `compiled` alone, two pages
     that only needed their `file://` guard removed were skipped and shipped it. */
  if (withCache.html === before) continue;
  await writeFile(p, withCache.html);
  tags += compiled; cached += withCache.inlined; if (compiled) pagesTouched += 1;
}
console.log(`precompiled ${tags} JSX blocks across ${pagesTouched} pages — no compiler ships`);
/* Once compiled in, the .jsx sources have no reader here: no page fetches them (precompile inlined
   them) and the Props block reads .d.ts, not .jsx. They stay in the repository and the handoff zip.
   Sixteen files, and the artifact has 255 slots — the brand group needed three of them. */
let dropped = 0;
for (const p of await walk(OUT, (p) => p.endsWith('.jsx'))) { await rm(p); dropped += 1; }
console.log(`dropped ${dropped} compiled-in .jsx sources from the staging`);

/* THE CONTRACTS, FOLDED INTO ONE DOCUMENT (23 Sep 2026) — and this runs HERE, after the inline step,
   for the reason the .jsx drop does. At 111 components the per-component `.d.ts` took 111 of the
   artifact's 255 slots and the staging reached 276, which is unpublishable; the header at the top of
   this file predicted exactly that. Folding them costs one slot and loses nothing, because each page
   already carries its own contract: the step above inlines the file the page fetches.

   Doing it BEFORE that step was tried and looked fine — `check:artifact` still reported 142 of 142
   links resolving and mounting, because the page renders around a failed fetch. Serving the staged
   folder and opening one showed the truth: `404 components/actions/AnswerChip.d.ts`, and the count
   of inlined files had quietly fallen from 112 to 1. A gate that passes on a page missing its
   contract is a gate measuring the wrong thing; looking at it is what found it. */
const contracts = [];
for (const p of await walk(OUT, (p) => p.endsWith('.d.ts'))) {
  contracts.push(`/* ${'='.repeat(94)}\n   ${relative(OUT, p)}\n   ${'='.repeat(94)} */\n\n${await readFile(p, 'utf8')}`);
  await rm(p);
}
await writeFile(join(OUT, 'contracts.d.ts'),
  `/* EVERY COMPONENT CONTRACT IN THE SENTINEL DESIGN SYSTEM — ${contracts.length} of them, in one file.\n`
  + `   Each is the hand-written .d.ts that ships beside its .jsx, and the doc comments carry the\n`
  + `   reasoning, which is the half of this system a rendered page cannot show you. Every component's\n`
  + `   own page already has its contract inlined; this is the copy you can read end to end. In the\n`
  + `   repository they are separate files at design-system/components/<group>/<Name>.d.ts. */\n\n`
  + contracts.join('\n\n'));
console.log(`folded ${contracts.length} contracts into contracts.d.ts — each page already carries its own`);
console.log(`inlined ${cached} fetched files, so a downloaded folder opens without a server`);

/* THE COVER IS WRITTEN LAST, because this script starts by deleting `artifact/` — the first run
   wrote it before the rebuild and the rebuild ate it. `tools/artifact-cover.py` is the generator; it
   reads the component index from disk, so the cover's counts cannot claim more than exists. */
const { execFileSync } = await import('node:child_process');
execFileSync('python3', [join(ROOT, 'tools', 'artifact-cover.py')], { cwd: ROOT, stdio: 'inherit' });

/* AFTER the cover, because the cover is generated last and was the one page left still fetching
   a stylesheet — which is exactly the page the owner opened and found unthemed. */
const TOKEN_ORDER = ['fonts.css', 'colors.css', 'typography.css', 'spacing.css', 'effects.css'];
let css = '';
for (const f of TOKEN_ORDER) {
  css += (await readFile(join(ROOT, 'design-system', 'tokens', f), 'utf8'))
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim() + '\n';
}
let inlinedCss = 0;
for (const p of await walk(OUT, (p) => p.endsWith('.html'))) {
  const before = await readFile(p, 'utf8');
  const after = before.replace(/<link rel="stylesheet" href="[^"]*styles\.css"\s*\/?>/g, () => {
    inlinedCss += 1;
    return `<style>${css}</style>`;
  });
  if (after !== before) await writeFile(p, after);
}
console.log(`inlined the token stylesheet into ${inlinedCss} pages — no page fetches CSS any more`);

const n = (await walk(OUT, () => true)).length;
console.log(`site/: ${n} files staged (limit 255)`);
