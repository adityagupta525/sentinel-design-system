#!/usr/bin/env node
/* EVERY var(--token) MUST RESOLVE. (F-52, 19 Sep 2026)

   `--type-row-strong-font` was referenced by seven files — including ConfirmSheet.jsx, a system
   component, and ConfirmSheet's own spec page, which listed it in its TOK array — and was never
   published. CSS does not warn: a `font:` shorthand with an undefined variable is an INVALID
   declaration, so fourteen elements silently fell back to `400 16px/normal`, a size, weight and
   leading on no line of the ramp and LARGER than the body text beside them. It shipped for weeks.
   
   Nothing could have caught it. The adherence lint reads JS, not CSS custom properties; the preview
   gate renders a page and a wrong-but-present font renders fine. This does the one thing that works:
   collect every token the tokens/ files DEFINE, collect every var() the components, pages and screens
   REFERENCE, and fail on the difference.

   The one legitimate exception is a property a component sets at runtime and reads back in CSS —
   Pressable writes --hit-x / --hit-y inline and MotionGuard's stylesheet reads them. Those are
   declared below by name, so the exception is a list somebody has to edit rather than a rule that
   quietly forgives anything. */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
/* Set inline by a component and read back in the stylesheet. Pressable writes --hit-x / --hit-y and
   Pill writes --hit, each per instance, because the hit-area extension differs by control size. Named
   here so the exception is a list somebody edits, not a rule that quietly forgives anything. */
const RUNTIME_SET = new Set(['--hit-x', '--hit-y', '--hit']);

const walk = async (dir, exts, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
};

const defined = new Set();
for (const f of await walk(join(REPO, 'design-system', 'tokens'), ['.css'])) {
  for (const m of (await readFile(f, 'utf8')).matchAll(/(--[a-z0-9-]+)\s*:/g)) defined.add(m[1]);
}

const used = new Map();
const roots = [
  /* Tokens reference tokens — --display-24 lives inside --type-figure-font and nowhere else. Leaving
     tokens/ out of this sweep made the unused report claim 38 dead tokens when most were composing
     the ramp. A debt list that over-reports is a debt list nobody reads. */
  [join(REPO, 'design-system', 'tokens'), ['.css']],
  [join(REPO, 'design-system', 'components'), ['.jsx']],
  [join(REPO, 'design-system', 'pages'), ['.html', '.jsx']],
  [join(REPO, 'design-system', 'guidelines'), ['.html']],
  [join(REPO, 'screens'), ['.jsx', '.html']],
];
for (const [dir, exts] of roots) {
  let files = [];
  try { files = await walk(dir, exts); } catch { continue; }
  for (const f of files) {
    for (const m of (await readFile(f, 'utf8')).matchAll(/var\((--[a-z0-9-]+)\)/g)) {
      if (!used.has(m[1])) used.set(m[1], new Set());
      used.get(m[1]).add(relative(REPO, f));
    }
  }
}

const ghosts = [...used.entries()].filter(([t]) => !defined.has(t) && !RUNTIME_SET.has(t));
console.log(`tokens: ${defined.size} defined, ${used.size} referenced, ${ghosts.length} undefined.`);
if (ghosts.length) {
  console.log('\n  REFERENCED AND NEVER DEFINED — every one of these is an invalid declaration that falls back silently:');
  for (const [t, files] of ghosts.sort((a, b) => b[1].size - a[1].size)) {
    console.log(`\n    ${t}  (${files.size} file${files.size > 1 ? 's' : ''})`);
    for (const f of [...files].sort().slice(0, 6)) console.log(`      ${f}`);
    console.log(`::error::${t} is referenced in ${files.size} file(s) and defined nowhere in design-system/tokens/`);
  }
  process.exit(1);
}
/* The other direction is a report, not a failure: a token nobody uses is debt, not a defect. */
const unused = [...defined].filter((t) => !used.has(t)).sort();
if (unused.length) console.log(`\n  ${unused.length} defined and referenced nowhere (debt, not a defect):\n    ${unused.join(', ')}`);
