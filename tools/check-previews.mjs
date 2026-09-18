/* Renders every preview page in the design system and reports what actually happened.

   A design system whose pages throw is worse than one with no pages: the spec says the component
   exists and the page silently shows nothing. So this fails on a console error, on a page that
   mounts nothing, and on a request that 404s — the three ways a preview lies.

   Usage: node tools/check-previews.mjs [--shots <dir>] [--only <substring>] [--json <file>] */
import { spawn } from 'node:child_process';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer as probe } from 'node:net';

const HERE = dirname(fileURLToPath(import.meta.url));
const DS = join(HERE, '..', 'design-system');
/* screens/ is a second tree, walked the same way and served by the same server's repository-root
   fallback. Its pages are prefixed so a screen and a spec page can never collide on a shot name. */
const SCREENS = join(HERE, '..', 'screens');
/* --self-test runs the guard against two fixtures instead of the repository: one that breaks the
   right gutter by exactly the mistake that got past 75/75, and the same markup with box-sizing put
   back. A guard that has never been seen to fail is not a guard. */
const FIXTURES = join(HERE, 'fixtures');
const SELF_TEST = process.argv.includes('--self-test');
/* A free port, asked for rather than assumed. A fixed one meant two runs at once shared a server, and
   whichever finished first killed it out from under the other — which reports every remaining page as
   a failure that never happened. A harness that can invent failures is worse than no harness. */
const PORT = Number(process.env.PORT) || await new Promise((resolve, reject) => {
  const s = probe();
  s.once('error', reject);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); });
});
const arg = (f) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : null; };
const SHOTS = arg('--shots');
const ONLY = arg('--only');
const JSON_OUT = arg('--json');

/* Viewport comes from the page's own @dsCard marker where it has one — the card says how wide the
   design is meant to be seen, and shooting it at some other width measures nothing. */
const CARD = /<!--\s*@dsCard([^>]*?)-->/;
const GUTTER = /<!--\s*@gutter([^>]*?)-->/;
/* ── The gutter guard ──────────────────────────────────────────────────────────────────────────────
   check-previews asks "did it render and did it throw". It never asked "is it inside the screen", so
   a card that ran 8pt past the right edge passed 75/75 while being visibly clipped by the phone.
   Found 18 Sep 2026 on screens/journey-b/01-home.html: a width:100% child with its own 12px padding
   and no box-sizing renders 367 wide inside a 343 box.

   What it checks: inside every phone frame (375x812, overflow hidden, a large radius), an element must
   sit at least `min` points from both edges.

   What it does not check, and why:
   · FULL-BLEED, by geometry — left 0 AND right 0. The backdrop, the status bar, the top bar, the
     greeting row, the dock and the home indicator are all deliberately edge to edge. The page names
     them in its own @gutter marker so the exemption is readable rather than implied.
   · CLIPPED, by an ancestor between the element and the phone whose overflow-x is hidden/auto/scroll/
     clip. ScreenBackdrop's two aura blobs sit at left:-93 and right:-120 inside an overflow:hidden
     box; they cannot break a gutter they cannot reach. The phone itself is excluded from that scan on
     purpose — the phone clipping something IS the bug.
   · EDGE-ANCHORED, declared per element with data-gutter="edge". A drawer slides in from the left and
     is flush to it on purpose: left 0, right 75. Geometry cannot tell that apart from a card that
     overran, so the element says so itself, one element at a time — and its DESCENDANTS are still
     checked, so the content inside a drawer still owes both gutters. The count of skipped elements is
     printed with the result, because an escape hatch nobody can see is an escape hatch that gets used.
   · Anything with no area.
   Run `node tools/check-previews.mjs --self-test` to watch it fail on tools/fixtures/gutter-broken.html
   and pass on gutter-ok.html. */
const GUTTER_PROBE = (min) => {
  const phones = [...document.querySelectorAll('div')].filter((d) => {
    const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
    return Math.round(r.width) === 375 && Math.round(r.height) === 812
      && cs.overflow.includes('hidden') && parseFloat(cs.borderTopLeftRadius) > 20;
  });
  const bad = [];
  let anchored = 0;
  /* Recursive, because the gutter is measured against the FRAME an element sits in. The phone is the
     first frame; an element that declares data-gutter="edge" becomes the frame for its own subtree.
     That is what makes a 300pt drawer work: the panel is flush to the phone's left on purpose, and the
     rows inside it owe their 16 to the panel, not to the phone. */
  const walk = (el, frame) => {
    for (const child of el.children) {
      const r = child.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (child.dataset && child.dataset.gutter === 'edge') { anchored++; walk(child, r); continue; }
      const L = Math.round(r.left - frame.left), R = Math.round(frame.right - r.right);
      if (!(L === 0 && R === 0) && (L < min || R < min)) {
        bad.push(`<${child.tagName.toLowerCase()}> left ${L} right ${R} width ${Math.round(r.width)} — "${(child.textContent || '').trim().slice(0, 32)}"`);
      }
      /* A box that clips is checked itself and then closes the question for everything inside it:
         whatever sits in there cannot be seen outside it, so it cannot break a gutter. That is what
         exempts ScreenBackdrop's two aura blobs at left:-93 and right:-120. */
      if (/hidden|auto|scroll|clip/.test(getComputedStyle(child).overflowX)) continue;
      walk(child, frame);
    }
  };
  for (const phone of phones) walk(phone, phone.getBoundingClientRect());
  return { phones: phones.length, anchored, bad: [...new Set(bad)] };
};

const ATTR = (s, k) => (new RegExp(`${k}="([^"]*)"`).exec(s) || [])[1];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (e.name.endsWith('.html')) yield p;
  }
}

const { readFile } = await import('node:fs/promises');
const pages = [];
for (const [base, prefix] of (SELF_TEST ? [[FIXTURES, 'tools/fixtures/']] : [[DS, ''], [SCREENS, 'screens/']])) {
 let any = false;
 try { for await (const _ of walk(base)) { any = true; break; } } catch { continue; }
 if (!any) continue;
 for await (const p of walk(base)) {
  const rel = prefix + relative(base, p).split(sep).join('/');
  if (rel === 'thumbnail.html') continue;
  if (ONLY && !rel.includes(ONLY)) continue;
  const text = await readFile(p, 'utf8');
  const card = CARD.exec(text.slice(0, 400))?.[1] ?? '';
  const [w, h] = (ATTR(card, 'viewport') || '1200x1400').split('x').map(Number);
  /* A static structure check before the browser sees it. Five spec pages shipped with a duplicated
     <body> and a second <div id="root">, from a shared head fragment that carried one line too many.
     Chrome tolerated it here and the published copies came up BLANK, so a clean render is not on its
     own evidence that the document is well formed. Counted, not parsed: these three are exactly the
     duplications that produced it. */
  const count = (re) => (text.match(re) || []).length;
  const structure = [];
  if (count(/<body[\s>]/g) !== 1) structure.push(`<body> appears ${count(/<body[\s>]/g)}\u00d7 — must be exactly 1`);
  /* At MOST one, not exactly one: the guideline pages render straight into <body> and have no #root
     at all. Requiring exactly one failed all 17 of them the first time this check ran. */
  if (count(/id="root"/g) > 1) structure.push(`id="root" appears ${count(/id="root"/g)}\u00d7 — must be at most 1`);
  if (count(/page-kit\.jsx/g) > 1) structure.push(`page-kit.jsx loaded ${count(/page-kit\.jsx/g)}\u00d7 — must be at most 1`);
  const gutterMark = GUTTER.exec(text.slice(0, 900))?.[1] ?? '';
  const gutterMin = Number(ATTR(gutterMark, 'min') || 16);
  const fullBleed = ATTR(gutterMark, 'fullBleed') || '';
  pages.push({ rel, name: rel.replace(/\.html$/, '').replace(/[/]/g, '__'), w: w || 1200, h: h || 1400, structure,
               gutter: prefix === 'screens/' || rel.startsWith('ui_kits/') || rel.startsWith('tools/'), gutterMin, fullBleed });
 }
}
pages.sort((a, b) => a.rel.localeCompare(b.rel));

const server = spawn(process.execPath, [join(HERE, 'preview-server.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
const stop = () => { try { server.kill(); } catch {} };
process.on('exit', stop);
await new Promise((r) => setTimeout(r, 1200));

const require = createRequire(import.meta.url);
let chromium;
for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright/index.js']) {
  try { ({ chromium } = require(id)); break; } catch {}
}
if (!chromium) { console.error('playwright not found — npm i -D playwright && npx playwright install chromium'); stop(); process.exit(1); }

if (SHOTS) await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
const results = [];

for (const p of pages) {
  const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: p.w, height: p.h }, deviceScaleFactor: SHOTS ? 2 : 1 });
  const errors = [...p.structure], missing = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
  page.on('response', (r) => r.status() >= 400 && missing.push(`${r.status()} ${r.url()}`));
  /* Not networkidle: 00-Index prefetches every component page, so the network never goes quiet and a
     page that rendered in 300ms would be reported as a 45s timeout. Wait for the thing we actually
     care about instead — Babel compiling the inline JSX and React putting something in #root. */
  try {
    await page.goto(`http://localhost:${PORT}/${p.rel}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => (document.getElementById('root') || document.body).innerHTML.length > 200, null, { timeout: 20000 });
    await page.waitForTimeout(1200);
  } catch (e) { errors.push('DID NOT MOUNT ' + e.message.slice(0, 120)); }
  const mounted = await page.evaluate(() => (document.getElementById('root') || document.body).innerHTML.length).catch(() => 0);
  /* The gutter guard, on screens only: a spec page is a specimen board and has no screen edges. */
  let gutter = null;
  if (p.gutter) {
    gutter = await page.evaluate(`(${GUTTER_PROBE.toString()})(${p.gutterMin})`).catch(() => null);
    if (gutter && gutter.bad.length) for (const b of gutter.bad) errors.push(`GUTTER ${b}`);
  }
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${p.name}.png`), fullPage: true }).catch(() => {});
  results.push({ ...p, errors, missing, mounted, gutter });
  await page.close();
}
await browser.close();
stop();

const bad = results.filter((r) => r.errors.length || r.missing.length || r.mounted < 200);
for (const r of results) {
  const flag = r.errors.length || r.missing.length ? 'FAIL' : r.mounted < 200 ? 'EMPTY' : 'ok';
  console.log(`${flag.padEnd(6)} ${r.rel.padEnd(44)} mounted=${String(r.mounted).padStart(7)}${r.gutter ? `  gutter>=${r.gutterMin} on ${r.gutter.phones} phone${r.gutter.phones === 1 ? '' : 's'}${r.gutter.anchored ? `, ${r.gutter.anchored} edge-anchored` : ''}` : ''}`);
  if (r.gutter && r.fullBleed) console.log(`         full-bleed by design: ${r.fullBleed}`);
  for (const e of [...r.errors, ...r.missing].slice(0, 4)) console.log(`         ↳ ${e}`);
}
if (JSON_OUT) await writeFile(JSON_OUT, JSON.stringify(results, null, 1));

if (SELF_TEST) {
  const broken = results.find((r) => r.rel.includes('gutter-broken'));
  const ok = results.find((r) => r.rel.includes('gutter-ok'));
  const brokeCount = broken ? broken.errors.filter((e) => e.startsWith('GUTTER')).length : -1;
  const okCount = ok ? ok.errors.filter((e) => e.startsWith('GUTTER')).length : -1;
  console.log(`\nself-test · gutter-broken reported ${brokeCount} gutter error(s) — expected at least 1`);
  console.log(`self-test · gutter-ok     reported ${okCount} gutter error(s) — expected 0`);
  const pass = brokeCount >= 1 && okCount === 0;
  console.log(pass ? '\nself-test PASSED — the guard fails on the defect and passes on the fix.'
                   : '\nself-test FAILED — a guard that cannot fail is not a guard.');
  process.exit(pass ? 0 : 1);
}

console.log(`\n${results.length - bad.length}/${results.length} pages render clean.`);
process.exit(bad.length ? 1 : 0);
