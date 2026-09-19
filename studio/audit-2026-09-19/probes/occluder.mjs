/* For a control whose ::before floor is present but whose MEASURED reach is short, name the element
   that wins the hit test just outside it. "A neighbour eats it" is a hypothesis until the neighbour
   is named. */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createServer as probePort } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { chromium } = require(join(REPO, 'node_modules', 'playwright'));
const PORT = await new Promise((res, rej) => { const s = probePort(); s.once('error', rej); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); }); });
const server = spawn(process.execPath, [join(REPO, 'tools', 'preview-server.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch {} });
await new Promise((r) => setTimeout(r, 1400));

const PAGES = process.argv.slice(2).length ? process.argv.slice(2)
  : ['screens/thread/ledger.html', 'screens/journey-c/funds.html', 'screens/journey-b/03-thread-answer.html', 'screens/journey-f/review.html'];

const browser = await chromium.launch();
for (const rel of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 2600 } });
  await page.goto(`http://localhost:${PORT}/${rel}`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction(() => (document.getElementById('root') || document.body).innerHTML.length > 200, null, { timeout: 30000 });
  await page.waitForTimeout(1200);
  const d = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
  await page.setViewportSize({ width: Math.max(1400, d.w), height: Math.min(12000, Math.max(800, d.h)) });
  await page.waitForTimeout(600);

  const out = await page.evaluate(() => {
    const SEL = 'button, a[href], [role="button"], [role="link"], input:not([type="hidden"]), select, textarea';
    const describe = (el) => {
      if (!el) return 'null';
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return `<${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''}> ${Math.round(r.width)}x${Math.round(r.height)} z=${cs.zIndex} pos=${cs.position} pe=${cs.pointerEvents} "${(el.textContent || '').trim().slice(0, 24)}"`;
    };
    const hits = (el, x, y) => { const t = document.elementFromPoint(x, y); if (!t) return false; if (t === el || el.contains(t)) return true; const n = t.closest && t.closest(SEL); return n === el; };
    const res = [];
    for (const el of document.querySelectorAll(SEL)) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.height >= 44) continue;
      if (el.disabled || el.getAttribute('tabindex') === '-1') continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
      const hitVar = cs.getPropertyValue('--hit').trim() || cs.getPropertyValue('--hit-y').trim();
      if (!hitVar) continue;
      const want = parseFloat(hitVar);
      if (!(want > 0)) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (!hits(el, cx, cy)) continue;
      /* how far does it really reach up and down, and WHO is there when it stops */
      const probe = (dir) => {
        let d = 0;
        while (d < want + 4 && hits(el, cx, cy + dir * (r.height / 2 + d + 0.5))) d += 0.5;
        const blocker = document.elementFromPoint(cx, cy + dir * (r.height / 2 + d + 0.5));
        return { reached: d, want, blocker: describe(blocker) };
      };
      const up = probe(-1), down = probe(1);
      const total = r.height + up.reached + down.reached;
      if (total >= 43.5) continue;
      res.push({ name: (el.getAttribute('aria-label') || (el.textContent || '').trim()).slice(0, 34),
                 box: `${r.width.toFixed(1)}x${r.height.toFixed(1)}`, wantPad: want,
                 gotUp: up.reached, gotDown: down.reached, total: +total.toFixed(1),
                 blockUp: up.blocker, blockDown: down.blocker });
      if (res.length > 14) break;
    }
    return res;
  });
  if (!out.length) { console.log(`\n=== ${rel} === no short-reach extended control found`); continue; }
  console.log(`\n=== ${rel} ===`);
  for (const o of out) {
    console.log(`  "${o.name}"  box ${o.box}  wants ±${o.wantPad}  got up ${o.gotUp} / down ${o.gotDown}  total ${o.total}`);
    if (o.gotUp < o.wantPad) console.log(`      blocked ABOVE by ${o.blockUp}`);
    if (o.gotDown < o.wantPad) console.log(`      blocked BELOW by ${o.blockDown}`);
  }
}
await browser.close();
try { server.kill(); } catch {}
