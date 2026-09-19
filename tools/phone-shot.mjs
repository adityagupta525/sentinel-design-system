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
const argv = process.argv.slice(2);
const REDUCED = argv.includes('--reduced');
/* PAD THE CROP, ALWAYS (19 Sep 2026, the owner: "screen ka radius match nei ho raha … pehle wala frame
   jaada clean tha"). A clip taken exactly at the frame's bounding box cuts through its own 44px corners,
   so the phone renders with its corners sliced off and reads as a square-cornered screen — a defect in
   the picture, not in the screen. Measured on 01-home: the frame is radius 44, overflow hidden, one
   shadow, and correct. Leaving 24pt of the board around it puts the corners and the shadow back where
   the eye expects them. `--tight` restores the old exact-bounds crop for measuring an edge. */
const PAD = argv.includes('--tight') ? 0 : 24;
const [rel, idxArg, outArg] = argv.filter((a) => !a.startsWith('--'));
if (!rel) { console.error('usage: phone-shot.mjs <page.html> [phoneIndex] [out.png] [--reduced] [--tight]'); process.exit(2); }
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
/* --reduced shoots the page as a viewer with prefers-reduced-motion set, which is the only honest way
   to check the reduced-motion column of a screen's own motion table. */
const page = await browser.newPage({ viewport: { width: 1400, height: 2600 }, deviceScaleFactor: 1, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
await page.goto(`http://127.0.0.1:${PORT}/${rel}`, { waitUntil: 'networkidle' }).catch(() => {});

/* WAIT FOR THE PHONE, DO NOT SLEEP AT IT. A fixed 500ms was a race: these pages compile JSX in the
   browser with Babel from a CDN, and a slow fetch meant zero frames and a confusing "no phone frame"
   on a page that is perfectly fine. Poll instead — first frame usually inside a second, and a page that
   really has none still fails, just honestly. */
const findBoxes = () => page.evaluate(() => [...document.querySelectorAll('div')].filter((d) => {
  const r = d.getBoundingClientRect(); const cs = getComputedStyle(d);
  return Math.round(r.width) === 375 && Math.round(r.height) === 812
      && cs.overflow !== 'visible' && parseFloat(cs.borderRadius) > 20;
}).map((d) => { const r = d.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; }));
let boxes = [];
for (let waited = 0; waited < 20000; waited += 250) {
  boxes = await findBoxes();
  if (boxes.length) { await page.waitForTimeout(400); boxes = await findBoxes(); break; }
  await page.waitForTimeout(250);
}

if (!boxes.length) { console.error(`no 375x812 phone frame on ${rel}`); await browser.close(); process.exit(1); }
if (idx >= boxes.length) { console.error(`page has ${boxes.length} phone(s); asked for index ${idx}`); await browser.close(); process.exit(1); }
const b = boxes[idx];
const clip = { x: Math.max(0, b.x - PAD), y: Math.max(0, b.y - PAD), width: b.width + PAD * 2, height: b.height + PAD * 2 };
await page.screenshot({ path: out, clip });
console.log(`${out}  phone ${idx + 1}/${boxes.length}  ${Math.round(b.width)}x${Math.round(b.height)}${PAD ? ` +${PAD}pt board` : '  tight'}${REDUCED ? '  (reduced motion)' : ''}`);
await browser.close();
process.exit(0);
