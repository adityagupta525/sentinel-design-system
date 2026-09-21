// Boots the built app (app/index.html, or a URL) on a 375×812 phone and asserts what a frame
// strip cannot: that the splash actually unmounts, and that the composer underneath takes a tap.
// F-80 shipped a splash that faded to opacity 0 and stayed mounted at z-index 40 over the whole
// app; every screenshot looked right and nothing in it could be tapped.
//   node tools/check-app-boot.mjs                 # app/index.html
//   node tools/check-app-boot.mjs https://…       # a deployed copy
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const target = process.argv[2] || 'file://' + resolve('app/index.html');
if (target.startsWith('file://') && !existsSync(target.slice(7))) { console.error('no app/index.html — npm run build:app first'); process.exit(2); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const t0 = Date.now();
await page.goto(target, { waitUntil: 'load' });
const mountedAt = await page.waitForSelector('.ds-splash', { state: 'attached', timeout: 5000 }).then(() => Date.now() - t0, () => null);
const goneAt = await page.waitForSelector('.ds-splash', { state: 'detached', timeout: 8000 }).then(() => Date.now() - t0, () => null);

const top = await page.evaluate(() => {
  const el = document.elementFromPoint(187, 300);
  return el ? el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') : null;
});
const composer = await page.$('.ds-composer textarea, .ds-composer input, textarea, input');
let typed = null;
if (composer) {
  // A short timeout on purpose: Playwright refuses to tap through an element that intercepts
  // pointer events, and that refusal is the finding, not a flake to wait out.
  const tapped = await composer.tap({ timeout: 2000 }).then(() => true, (e) => (errors.push('tap refused: ' + String(e.message).split('\n').find((l) => l.includes('intercepts')) || 'composer tap failed'), false));
  if (tapped) { await page.keyboard.type('q'); typed = await composer.inputValue().catch(() => null); }
}
await browser.close();

const rows = [
  ['splash mounted', mountedAt !== null ? `${mountedAt}ms` : 'never'],
  ['splash unmounted', goneAt !== null ? `${goneAt}ms` : 'STILL MOUNTED after 8s'],
  ['element under the centre', top],
  ['composer took a keystroke', typed === 'q' ? 'yes' : `no (${typed})`],
  ['console/page errors', errors.length ? errors.slice(0, 3).join(' | ') : 'none'],
];
for (const [k, v] of rows) console.log(k.padEnd(28), v);
const ok = mountedAt !== null && goneAt !== null && top !== 'div.ds-splash' && typed === 'q' && errors.length === 0;
console.log(ok ? '\nOK — the app boots and is tappable' : '\nFAIL');
process.exit(ok ? 0 : 1);
