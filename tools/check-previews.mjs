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
const ATTR = (s, k) => (new RegExp(`${k}="([^"]*)"`).exec(s) || [])[1];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (e.name.endsWith('.html')) yield p;
  }
}

const { readFile } = await import('node:fs/promises');
const pages = [];
for (const [base, prefix] of [[DS, ''], [SCREENS, 'screens/']]) {
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
  pages.push({ rel, name: rel.replace(/\.html$/, '').replace(/[/]/g, '__'), w: w || 1200, h: h || 1400, structure });
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
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${p.name}.png`), fullPage: true }).catch(() => {});
  results.push({ ...p, errors, missing, mounted });
  await page.close();
}
await browser.close();
stop();

const bad = results.filter((r) => r.errors.length || r.missing.length || r.mounted < 200);
for (const r of results) {
  const flag = r.errors.length || r.missing.length ? 'FAIL' : r.mounted < 200 ? 'EMPTY' : 'ok';
  console.log(`${flag.padEnd(6)} ${r.rel.padEnd(44)} mounted=${String(r.mounted).padStart(7)}`);
  for (const e of [...r.errors, ...r.missing].slice(0, 4)) console.log(`         ↳ ${e}`);
}
if (JSON_OUT) await writeFile(JSON_OUT, JSON.stringify(results, null, 1));
console.log(`\n${results.length - bad.length}/${results.length} pages render clean.`);
process.exit(bad.length ? 1 : 0);
