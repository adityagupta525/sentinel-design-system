/* A BLANK PAGE THAT EXPLAINS ITSELF (20 Sep 2026).
   The owner opened `screens/index.html` from a downloaded folder. It rendered — it is plain HTML —
   and every link on it led to a blank page, because those pages compile their JSX in the browser and
   a `file://` origin cannot fetch the source to compile. `site/` is the answer, but a person who has
   not been told that gets no clue at all: no error, no message, just nothing.

   This injects one plain script into the pages that break, and into the two index pages that link to
   them. It does nothing over http, so `npm run preview`, `check:previews` and the published copies
   are untouched. It is written into the source rather than added by a build step, because these
   pages are source; `check-previews.mjs` fails a page that is missing it, so a new page cannot
   quietly reintroduce the trap.

   Run: node tools/add-file-guard.mjs [--check] */
import { readFile, writeFile } from 'node:fs/promises';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MARK = 'ds-file-guard';

const walk = (d, out = []) => {
  for (const f of readdirSync(d)) {
    if (f.startsWith('.')) continue;
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p, out) : p.endsWith('.html') && out.push(p);
  }
  return out;
};

/** Which page under `site/` is the built copy of this one — or the cover, when `site/` does not carry
    it. `ui_kits/` is the case that matters: it is left out of `site/` for the 255-file limit, so those
    pages can only point at the front door. */
function builtCopy(abs) {
  const rel = relative(ROOT, abs);
  const inSite = rel.startsWith('design-system/') ? rel.slice('design-system/'.length)
    : rel.startsWith('screens/') ? rel
      : null;
  if (!inSite) return null;
  const up = '../'.repeat(rel.split('/').length - 1);
  return `${up}site/${existsSync(join(ROOT, 'site', inSite)) ? inSite : 'index.html'}`;
}

const GUARD = (await readFile(join(ROOT, 'tools', 'file-guard.js'), 'utf8'))
  .split('\n')
  .filter((l) => !l.trim().startsWith('/*') && !l.trim().startsWith('replaced') && !l.trim().startsWith('is precompiled'))
  .join('\n');

const snippet = (href) => `<script data-${MARK}>${GUARD.replace('__HREF__', JSON.stringify(href))}</script>`;

/* Exactly the pages the gate in `check-previews.mjs` requires it on: the ones that compile JSX. A
   page that renders straight into <body> with no compiler cannot go blank this way and is left alone. */
const all = [...walk(join(ROOT, 'design-system')), ...walk(join(ROOT, 'screens'))];
const targets = [];
for (const abs of all) {
  if ((await readFile(abs, 'utf8')).includes('text/babel')) targets.push(abs);
}
const check = process.argv.includes('--check');
let missing = 0, added = 0;

for (const abs of targets) {
  const href = builtCopy(abs);
  if (!href) continue;
  const html = await readFile(abs, 'utf8');
  if (html.includes(`data-${MARK}`)) continue;
  if (check) { missing += 1; console.error(`  missing the file:// guard: ${relative(ROOT, abs)}`); continue; }
  await writeFile(abs, html.replace('<body>', `<body>${snippet(href)}`));
  added += 1;
}

if (check) {
  if (missing) { console.error(`${missing} page(s) would be silently blank when opened from a file:// URL`); process.exit(1); }
  console.log(`file:// guard: present on all ${targets.length} pages`);
} else {
  console.log(`file:// guard: added to ${added} of ${targets.length} pages`);
}
