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
/* MEASURED AFTER THE PHONES ARE FOUND, NOT BEFORE (20 Sep 2026). These pages compile their JSX in the
   browser, so `scrollHeight` right after networkidle is the height of an empty document. The viewport
   was grown to that stale figure and a phone two thirds down the real page then sat outside it, and
   the screenshot failed with "clipped area is outside the resulting image" — on the risk kit, whose
   sixteen artboards mount well after the network goes quiet. The polling loop above already waits for
   a real frame; everything about the page's size is read after it.

   GROW THE VIEWPORT TO THE PAGE (19 Sep 2026). The viewport was a fixed 1400x2600 and a screen page is
   3200 tall, so a clip computed for a phone below the fold fell outside the viewport and Chrome returned
   a rotated, stretched frame — a picture of a defect that is not in the screen. Measured on
   screens/thread/going-back.html, phone 5 of 7. Resize to the document's own height (capped, so a runaway
   page cannot ask for a gigapixel), then let the layout settle before measuring anything. */
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

/* MEASURED FROM THE PHONES, NOT FROM THE DOCUMENT. `documentElement.scrollWidth` reported 1400 on
   journey-b, whose eleven artboards run out to x=4182 — the board's overflow lives on an inner
   element, so the document never grew. The frames are the thing being shot, so their own extent is
   what the viewport has to cover; the document's figure is kept as a floor for pages whose content
   runs past the last phone. */
const extent = boxes.reduce((m, b) => ({ w: Math.max(m.w, b.x + b.width), h: Math.max(m.h, b.y + b.height) }), { w: 0, h: 0 });
const docH = Math.max(await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight)), Math.ceil(extent.h) + PAD);
/* AND THE BOARD IS WIDE, NOT TALL (20 Sep 2026). Every screens/ page stacks its phones down the page,
   so this tool only ever grew the viewport vertically. The UI kits do the opposite: journey-a-risk is
   ONE ROW of sixteen artboards, 6,632px across and 2,600 down, and a clip at x=6257 in a 1400-wide
   viewport fails the same way a clip below the fold does. Nobody had shot a kit board past its third
   phone. Both axes are read and both are grown.

   THE CAP WAS 12000 AND A PAGE OUTGREW IT. journey-c/funds is past 16,000 tall with the commands and
   the scores on it, and raising the cap again is not available: 16,384 is Chrome's own texture limit
   and past it the shot comes back blank. Above the cap the viewport stays put and the PAGE is
   scrolled to the phone instead. Playwright's `clip` is viewport-relative — settled by measuring,
   because a document-coordinate clip on a scrolled page fails outright — and the two paths were then
   proved byte-identical on the same phone. `PHONE_SHOT_CAP` exercises the scrolled path on a short
   page. */
const docW = Math.max(await page.evaluate(() => Math.ceil(document.documentElement.scrollWidth)), Math.ceil(extent.w) + PAD);
const CAP = Number(process.env.PHONE_SHOT_CAP || 16000);
const scrolled = docH + 40 > CAP || docW + 40 > CAP;
if (!scrolled && (docH > 2600 || docW > 1400)) {
  await page.setViewportSize({ width: Math.max(1400, docW + 40), height: Math.max(2600, docH + 40) });
  await page.waitForTimeout(400);
}

const b = boxes[idx];
const clip = { x: Math.max(0, b.x - PAD), y: Math.max(0, b.y - PAD), width: b.width + PAD * 2, height: b.height + PAD * 2 };
if (scrolled) {
  const at = await page.evaluate(([x, y]) => { window.scrollTo(x, y); return [window.scrollX, window.scrollY]; },
    [Math.max(0, clip.x - 200), Math.max(0, clip.y - 200)]);
  await page.waitForTimeout(400);
  clip.x -= at[0]; clip.y -= at[1];
}
await page.screenshot({ path: out, clip });
console.log(`${out}  phone ${idx + 1}/${boxes.length}  ${Math.round(b.width)}x${Math.round(b.height)}${PAD ? ` +${PAD}pt board` : '  tight'}${scrolled ? '  (scrolled)' : ''}${REDUCED ? '  (reduced motion)' : ''}`);
await browser.close();
process.exit(0);
