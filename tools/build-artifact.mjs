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
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'artifact');
const walk = async (dir, filter, acc = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, filter, acc);
    else if (filter(p)) acc.push(p);
  }
  return acc;
};
const rewrite = (s) => s
  .replace(/_ds_bundle\.js/g, 'ds_bundle.js')
  .replace(/_ds_manifest\.json/g, 'ds_manifest.json')
  .replace(/_index\.json/g, 'index-data.json');

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
/* the kits, redrawn on the built screens 20 Sep 2026 — they are the system's states, and the
   artifact carries them beside the screens they now match */
for (const p of await walk(join(ROOT, 'design-system/ui_kits'), (p) => /\.(html|jsx|md)$/.test(p))) {
  await copyText(relative(ROOT, p), relative(join(ROOT, 'design-system'), p));
}
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
/* THE COVER IS WRITTEN LAST, because this script starts by deleting `artifact/` — the first run
   wrote it before the rebuild and the rebuild ate it. `tools/artifact-cover.py` is the generator; it
   reads the component index from disk, so the cover's counts cannot claim more than exists. */
const { execFileSync } = await import('node:child_process');
execFileSync('python3', [join(ROOT, 'tools', 'artifact-cover.py')], { cwd: ROOT, stdio: 'inherit' });

const n = (await walk(OUT, () => true)).length;
console.log(`artifact/: ${n} files staged (limit 255)`);
