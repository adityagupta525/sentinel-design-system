/* phone-shot — shoot ONE phone frame, not the whole 1400x2600 board.
   A board shot is ~1.5 MB of mostly empty canvas; a phone is 375x812 and ~60 KB.
   Looking costs context, so look at the smallest thing that can carry the answer.
     node tools/phone-shot.mjs screens/journey-b/01-home.html 0 out.png          */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const HERE = dirname(fileURLToPath(import.meta.url));
const [rel, idxArg, outArg] = process.argv.slice(2);
if (!rel) { console.error('usage: phone-shot.mjs <page.html> [phoneIndex] [out.png]'); process.exit(2); }
const idx = Number(idxArg ?? 0);
const out = outArg || 'phone.png';

const PORT = await new Promise((res, rej) => {
  const s = net.createServer(); s.once('error', rej);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); });
});
const server = spawn(process.execPath, [join(HERE, 'preview-server.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch {} });
await new Promise((r) => setTimeout(r, 1200));

const require = createRequire(import.meta.url);
let chromium;
for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright/index.js']) { try { ({ chromium } = require(id)); break; } catch {} }
if (!chromium) { console.error('playwright not found'); process.exit(1); }

const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 2600 }, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/${rel}`, { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(500);

const boxes = await page.evaluate(() => [...document.querySelectorAll('div')].filter((d) => {
  const r = d.getBoundingClientRect(); const cs = getComputedStyle(d);
  return Math.round(r.width) === 375 && Math.round(r.height) === 812
      && cs.overflow !== 'visible' && parseFloat(cs.borderRadius) > 20;
}).map((d) => { const r = d.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; }));

if (!boxes.length) { console.error(`no 375x812 phone frame on ${rel}`); await browser.close(); process.exit(1); }
if (idx >= boxes.length) { console.error(`page has ${boxes.length} phone(s); asked for index ${idx}`); await browser.close(); process.exit(1); }
await page.screenshot({ path: out, clip: boxes[idx] });
console.log(`${out}  phone ${idx + 1}/${boxes.length}  ${Math.round(boxes[idx].width)}x${Math.round(boxes[idx].height)}`);
await browser.close();
process.exit(0);
