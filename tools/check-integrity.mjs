/* Guards the promise that this repo carries the Claude Design project verbatim.

   baseline/design-system.sha256 records the hash of every file imported from the bundle. This script
   re-hashes the tree and reports drift. Generated files (index.js, index.d.ts) are excluded — they are
   rebuilt from source by tools/build-barrel.mjs and checked by rebuilding, not by hashing.

   Polish work WILL change these files. That is fine and expected: the point is that a change can never
   be silent. Run `npm run check:integrity -- --update` in the same commit that makes the change, so the
   baseline diff shows exactly which design files moved and the review has something to look at. */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DS = join(ROOT, 'design-system');
const BASELINE = join(ROOT, 'baseline', 'design-system.sha256');
const GENERATED = new Set(['index.js', 'index.d.ts']);

/* THE DATE STAMP IS NOT DRIFT (19 Sep 2026). `pages/_index.json` carries `"generated": "<today>"`, and CI
   runs `build:index` before this check — so from the day after a baseline is recorded, that one line
   differs and integrity fails on every run for a reason nobody caused. It happened: run 57 was green on
   18 Sep, run 58 failed on 19 Sep with the identical tree, and run 59 went green again only because the
   baseline had been re-recorded that morning. A gate that fails on the calendar teaches people to ignore
   it, which is the opposite of what this one is for.
   The index diff check in CI already masks the same line (`git diff -I '^ *"generated":'`); this is that
   rule, applied where the file is hashed. Everything else in the file — every row, every literal count —
   still hashes exactly, so a real change to the index is still caught. */
const STAMP = /("generated":\s*)"[^"]*"/;
const normalise = (rel, buf) => (rel === 'pages/_index.json'
  ? Buffer.from(buf.toString('utf8').replace(STAMP, '$1"<stamp>"'), 'utf8')
  : buf);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const current = new Map();
for await (const p of walk(DS)) {
  const rel = relative(DS, p).split(sep).join('/');
  if (GENERATED.has(rel)) continue;
  current.set(rel, createHash('sha256').update(normalise(rel, await readFile(p))).digest('hex'));
}

const lines = [...current].sort(([a], [b]) => a.localeCompare(b)).map(([p, h]) => `${h}  ${p}`);

if (process.argv.includes('--update')) {
  await writeFile(BASELINE, lines.join('\n') + '\n');
  console.log(`baseline updated: ${lines.length} files`);
  process.exit(0);
}

let recorded;
try { recorded = await readFile(BASELINE, 'utf8'); }
catch { console.error('No baseline. Run: npm run check:integrity -- --update'); process.exit(1); }

const want = new Map(recorded.split('\n').filter(Boolean).map((l) => {
  const i = l.indexOf('  ');
  return [l.slice(i + 2), l.slice(0, i)];
}));

const changed = [...current].filter(([p, h]) => want.has(p) && want.get(p) !== h).map(([p]) => p);
const added = [...current.keys()].filter((p) => !want.has(p));
const removed = [...want.keys()].filter((p) => !current.has(p));

for (const [label, list] of [['modified', changed], ['added', added], ['removed', removed]]) {
  for (const p of list) console.log(`  ${label.padEnd(8)} ${p}`);
}
const total = changed.length + added.length + removed.length;
console.log(total
  ? `\n${total} file(s) differ from the imported bundle across ${current.size} tracked files.\nIf deliberate, re-run with --update in the same commit.`
  : `design-system intact: ${current.size} files match the imported bundle.`);
process.exit(total ? 1 : 0);
