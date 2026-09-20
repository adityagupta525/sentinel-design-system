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
/* screens: the pages, their modules, and the one fixture */
for (const p of await walk(join(ROOT, 'screens'), (p) => p.endsWith('.html') || p.endsWith('.jsx'))) {
  const rel = relative(ROOT, p);
  await copyText(rel, rel);
}
/* the screen pages reach the bundle with ../../design-system/_ds_bundle.js — repoint to the root copy */
for (const p of await walk(join(OUT, 'screens'), (p) => p.endsWith('.html'))) {
  let s = await readFile(p, 'utf8');
  s = s.replace(/(\.\.\/)+design-system\/ds_bundle\.js/g, (m) => '../'.repeat((relative(OUT, p).match(/\//g) || []).length) + 'ds_bundle.js');
  s = s.replace(/(\.\.\/)+design-system\/styles\.css/g, (m) => '../'.repeat((relative(OUT, p).match(/\//g) || []).length) + 'styles.css');
  await writeFile(p, s);
}
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
  const { html, compiled } = precompilePage(await readFile(p, 'utf8'), p);
  const withCache = inlineFetches(html, p, OUT);
  if (!compiled && !withCache.inlined) continue;
  await writeFile(p, withCache.html);
  tags += compiled; cached += withCache.inlined; if (compiled) pagesTouched += 1;
}
console.log(`precompiled ${tags} JSX blocks across ${pagesTouched} pages — no compiler ships`);
console.log(`inlined ${cached} fetched files, so a downloaded folder opens without a server`);

/* THE COVER IS WRITTEN LAST, because this script starts by deleting `artifact/` — the first run
   wrote it before the rebuild and the rebuild ate it. `tools/artifact-cover.py` is the generator; it
   reads the component index from disk, so the cover's counts cannot claim more than exists. */
const { execFileSync } = await import('node:child_process');
execFileSync('python3', [join(ROOT, 'tools', 'artifact-cover.py')], { cwd: ROOT, stdio: 'inherit' });

const n = (await walk(OUT, () => true)).length;
console.log(`site/: ${n} files staged (limit 255)`);
