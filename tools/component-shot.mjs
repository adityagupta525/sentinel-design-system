/* The web half of Gate B: render ONE component, with given props, at its natural size, and write
   a PNG of exactly its box — nothing around it.

   The Figma half is an export of the matching node; `tools/figma-parity.mjs` compares the two.
   Shooting a spec page instead would compare the page's chrome as well as the component, which is
   how a parity number gets quietly diluted by the 90% of pixels that are canvas.

   It loads the same two things a spec page loads — styles.css and _ds_bundle.js — so what it
   measures is what the product renders, not a re-implementation. Run `npm run build:bundle` first
   if a component changed; the bundle is what this reads.

   Usage:
     node tools/component-shot.mjs Badge out.png --props '{"variant":"status","tone":"over"}' --children 'OVER CEILING'
     node tools/component-shot.mjs Surface out.png --width 343 --children-html '<div style="height:40px"></div>'
     node tools/component-shot.mjs --list                     # what the bundle exports

   --width sets the container width (a card is width:100%, so it needs one). Default 343, which is
   375 minus the 16px gutter on each side — the width a card actually has on this product's screen.
   --scale defaults to 2, matching every other shot harness here.

   --ground (default var(--color-canvas)) is what the component is composited onto. A shadow is
   only visible against something, and a transparent PNG compared against a Figma export on canvas
   scores a false failure across every shadowed pixel. Parity is always measured on a stated ground.

   --bleed (default 8) captures that many CSS pixels OUTSIDE the element's box. A ring drawn with
   box-shadow and every one of the eight drop shadows lives outside the border box, and an element
   screenshot clips exactly there — so without bleed, shadow parity is untestable and a missing
   shadow scores 0%. The Figma export must be taken with the same bleed. */
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import { chromium } from 'playwright';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i === -1 ? d : argv[i + 1]; };
const has = (n) => argv.includes(`--${n}`);

const PORT = Number(process.env.PORT || 4322);
const BASE = `http://127.0.0.1:${PORT}`;

const up = () => new Promise((ok) => {
  const s = net.connect(PORT, '127.0.0.1');
  s.on('connect', () => (s.destroy(), ok(true)));
  s.on('error', () => ok(false));
});

let child = null;
if (!(await up())) {
  child = spawn(process.execPath, [join(HERE, 'preview-server.mjs')],
    { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore', detached: false });
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 100));
  if (!(await up())) { console.error(`no preview server on ${PORT} — run: PORT=${PORT} npm run preview`); process.exit(2); }
}
const stop = () => { if (child) try { child.kill(); } catch { /* already gone */ } };

/* A page with the product's stylesheet and bundle, and nothing else on it. `#stage` is transparent
   so a component's own background is what the PNG shows; `#box` is the measured width. */
const HTML = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/styles.css">
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="/_ds_bundle.js"></script>
<style>html,body{margin:0;padding:0;background:GROUND}
/* The 48px gutter is not decoration: the clip rect is the element's box grown by --bleed, and
   clamping it at 0 would have put the whole bleed on the right and bottom while Figma insets the
   instance on all four sides. That offset read as a 21% parity failure with the entire perimeter
   differing — the first real Gate B run found it. */
#stage{display:inline-block;background:GROUND;padding:48px}</style>
</head><body><div id="stage"><div id="box"></div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: Number(flag('scale', '2')) });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const ground = flag('ground', 'var(--color-canvas)');
await page.route('**/__component-shot', (r) => r.fulfill({ contentType: 'text/html', body: HTML.split('GROUND').join(ground) }));
await page.goto(`${BASE}/__component-shot`, { waitUntil: 'load' });
await page.waitForFunction(() => window.SentinelDesignSystem_0682a2 && window.React && window.ReactDOM, { timeout: 10000 });

if (has('list')) {
  const names = await page.evaluate(() => Object.keys(window.SentinelDesignSystem_0682a2).sort());
  await browser.close(); stop();
  console.log(names.join('\n'));
  console.log(`\n${names.length} exports`);
  process.exit(0);
}

const name = argv.find((a) => !a.startsWith('--') && !/\.png$/i.test(a));
const out = argv.find((a) => /\.png$/i.test(a));
if (!name || !out) {
  await browser.close(); stop();
  console.error("usage: node tools/component-shot.mjs <Component> <out.png> [--props '{...}'] [--children '…'] [--children-html '<…>'] [--width 343] [--scale 2]");
  process.exit(2);
}

const props = JSON.parse(flag('props', '{}'));
const width = Number(flag('width', '343'));
const children = flag('children', null);
const childrenHtml = flag('children-html', null);

const info = await page.evaluate(async ([name, props, width, children, childrenHtml]) => {
  const DS = window.SentinelDesignSystem_0682a2;
  const C = DS[name];
  if (!C) return { error: `no export named ${name}` };
  const box = document.getElementById('box');
  box.style.width = width + 'px';
  let kids = null;
  if (children != null) kids = children;
  else if (childrenHtml != null) kids = window.React.createElement('div', { dangerouslySetInnerHTML: { __html: childrenHtml } });
  const el = window.React.createElement(C, props, kids);
  await new Promise((done) => window.ReactDOM.createRoot(box).render(
    window.React.createElement(function Probe() { window.React.useEffect(done, []); return el; })));
  /* Two frames, so layout and any mount-time measurement have both settled — several components
     here measure their own box on mount (Pressable expands its target from the rendered height). */
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const el0 = box.firstElementChild;
  if (!el0) return { error: 'the component rendered nothing' };
  const r = el0.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height), tag: el0.tagName.toLowerCase() };
}, [name, props, width, children, childrenHtml]);

if (info.error) { await browser.close(); stop(); console.error(info.error); process.exit(1); }

const bleed = Number(flag('bleed', '8'));
const rect = await page.evaluate((b) => {
  const r = document.querySelector('#box > *').getBoundingClientRect();
  if (r.left < b || r.top < b) throw new Error(`element is ${r.left},${r.top} from the viewport edge; the bleed of ${b} would be clipped`);
  return { x: r.left - b, y: r.top - b, width: r.width + b * 2, height: r.height + b * 2 };
}, bleed);
await mkdir(dirname(resolve(out)), { recursive: true });
await page.screenshot({ path: resolve(out), clip: rect });
await browser.close(); stop();

console.log(`${name}  ${info.w}×${info.h} box, ${Math.round(rect.width)}×${Math.round(rect.height)} with ${bleed}px bleed on ${ground}  (${info.tag})  → ${out}`);
if (Object.keys(props).length) console.log(`  props ${JSON.stringify(props)}`);
if (errors.length) { console.log(`  ${errors.length} console/page error(s):`); for (const e of errors.slice(0, 3)) console.log('    ' + e); }
process.exit(errors.length ? 1 : 0);
