#!/usr/bin/env node
/* THE PARALLEL REPORT — the owner's rule, 18 Sep 2026:
     "me aisi cheez nei chahta design system me jo screen par na ho —
      screen and design system 100% parallel hone chahiye."

   A component that exists, has a contract and a spec page, and appears on NO screen, is a component
   nobody has had to make work. Two of them bit on 18 Sep: `MessageActions` had offered Edit since v1
   with nowhere to go, and `FileUpload` had carried its staged parse since v7 with no way in — the
   composer's paperclip was a <div>. Both were found by the owner looking at a screen, not by any check.

   So this prints the gap in both directions:
     · SYSTEM WITHOUT A SCREEN — built, specified, and never placed. The backlog this rule creates.
     · SCREEN WITHOUT THE SYSTEM — a name a screen uses that the system does not export. That one is a
       defect today, so it exits non-zero; the first list is a report, because only 5 of 7 journey
       screens are built and the rule is a destination, not today's state.

   Usage: node tools/check-parallel.mjs [--list]                 (report)
          node tools/check-parallel.mjs --max-unused <n>         (fails above n, for CI later) */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const INDEX = join(REPO, 'design-system', 'pages', '_index.json');
const SCREENS = join(REPO, 'screens');

const args = process.argv.slice(2);
const LIST = args.includes('--list');
const maxUnused = args.includes('--max-unused') ? Number(args[args.indexOf('--max-unused') + 1]) : null;

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue; // .DS_Store and friends are not content
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (['.html', '.jsx'].includes(extname(e.name))) out.push(p);
  }
  return out;
}

const index = JSON.parse(await readFile(INDEX, 'utf8'));
/* Every exported component, from the generated index — never a hand-kept list, which is how a rule
   about parity would itself drift. */
const components = index.rows.map((r) => r.name);

const files = await walk(SCREENS);
const sources = await Promise.all(files.map(async (f) => [f.slice(REPO.length + 1), await readFile(f, 'utf8')]));

/* A component counts as USED when a screen names it as a JSX tag, destructures it from the namespace,
   or lists it in __screenRequires. Prose in a note does not count — `<code>FileUpload</code>` in a
   paragraph is a screen talking about a component, not using one. So the match is deliberately
   syntactic. */
const used = new Map();
for (const [rel, src] of sources) {
  const stripped = src
    .replace(/<Note[\s\S]*?<\/Note>/g, '')
    .replace(/note="[^"]*"/g, '')
    .replace(/sub="[^"]*"/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  for (const c of components) {
    /* EITHER QUOTE STYLE. The requires list is hand-written on most pages with single quotes and was
       generated with double quotes on two of them (19 Sep) — and this matcher only read single, so both
       pages under-reported their components and `parallel` printed 71 when it was 73. A checker that
       depends on how a literal is spelled is a checker that reports a number nobody can trust. */
    const re = new RegExp(`(<${c}[\\s/>])|(<[A-Z][A-Za-z0-9_]*\\.${c}[\\s/>])|(\\b${c}\\b\\s*[,}].*?=\\s*window\\.SentinelDesignSystem)|(['"]${c}['"])`, 's');
    if (re.test(stripped)) { if (!used.has(c)) used.set(c, []); used.get(c).push(rel); }
  }
}

/* TRANSITIVE, because a screen that places `Drawer` is exercising `List`, `ListRow` and `Pill` whether
   it names them or not — and a rule that counted only the names a screen types would report a component
   as unused while an advisor is looking at it. The graph is read from the components' own imports, so it
   cannot drift from the code. */
const graph = new Map();
for (const row of index.rows) {
  try {
    const src = await readFile(join(REPO, 'design-system', row.file), 'utf8');
    const deps = [...src.matchAll(/from '\.[^']*\/([A-Za-z0-9_]+)\.jsx'/g)].map((m) => m[1]).filter((n) => n !== row.name);
    graph.set(row.name, deps);
  } catch { graph.set(row.name, []); }
}
const reached = new Set();
const walkDeps = (name, via) => {
  if (reached.has(name)) return;
  reached.add(name);
  for (const d of graph.get(name) || []) { if (!used.has(d)) used.set(d, [`${via} (through ${name})`]); walkDeps(d, via); }
};
for (const [c, where] of [...used]) { reached.clear(); walkDeps(c, where[0]); }

const unused = components.filter((c) => !used.has(c)).sort();
const shipped = new Set(index.rows.filter((r) => r.status === 'shipped').map((r) => r.name));
const unusedShipped = unused.filter((c) => shipped.has(c));

/* The other direction: a screen naming something the system does not export.
   READ FROM THE BARREL, not from the component list. `components` is one name per FILE, and several
   files ship more than one export — ResultCard.jsx also exports ResultActions and ResultPrimary, and
   Journey D names all three. Checking against the file names called two real exports strays and failed
   CI on 19 Sep for a defect that did not exist. `design-system/index.js` is the only public entry, so
   it is the only honest answer to "does the system export this". */
const barrel = await readFile(join(REPO, 'design-system', 'index.js'), 'utf8');
const exported = new Set(components);
for (const m of barrel.matchAll(/export\s*\{([^}]*)\}/g)) {
  for (const raw of m[1].split(',')) {
    const name = raw.split(/\s+as\s+/).pop().trim();
    if (name) exported.add(name);
  }
}
const strays = [];
for (const [rel, src] of sources) {
  const req = src.match(/__screenRequires\s*=\s*\[([^\]]*)\]/);
  if (req) for (const m of req[1].matchAll(/['"]([^'"]+)['"]/g)) if (!exported.has(m[1])) strays.push(`${rel}: ${m[1]}`);
}

console.log(`parallel: ${components.length - unused.length} of ${components.length} components appear on a screen; ${unused.length} do not (${unusedShipped.length} of them have a spec page).`);
if (LIST || unused.length) {
  const show = LIST ? unused : unusedShipped;
  const label = LIST ? 'not on any screen' : 'specified, shipped, and on no screen';
  if (show.length) console.log(`\n  ${label}:\n    ${show.join(', ')}`);
  if (!LIST && unused.length !== unusedShipped.length) console.log(`\n  (${unused.length - unusedShipped.length} more are still building; --list shows them too)`);
}
if (strays.length) {
  console.log(`\n  A SCREEN NAMES WHAT THE SYSTEM DOES NOT EXPORT — this is a defect, not a backlog:`);
  for (const s of strays) console.log(`    ${s}`);
  process.exit(1);
}
if (maxUnused != null && unused.length > maxUnused) {
  console.log(`\n  ${unused.length} unused exceeds --max-unused ${maxUnused}.`);
  process.exit(1);
}
