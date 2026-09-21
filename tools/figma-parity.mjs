/* Gate B of the Figma parity gate: compares a rendered-product PNG against a Figma-exported PNG
   and reports the difference numerically, because "it looks the same" is not a measurement.

   See .claude/skills/sentinel-figma/references/parity.md for what this may and may not prove. The
   short version: 2% of pixels is the threshold, it is deliberately not zero because the browser and
   Figma hint text differently, and a diff under the threshold whose difference image shows a solid
   block rather than a halo of glyph edges is still a failure.

   The pixels are read in Chromium rather than through an image library, so this adds no dependency
   to a repository that keeps nine — Playwright is already here for every other harness.

   Usage:
     node tools/figma-parity.mjs <web.png> <figma.png> [--label Name] [--threshold 2] [--out dir]
     node tools/figma-parity.mjs --self-test          # proves the probe can fail

   Exit 0 when the difference is at or under the threshold, 1 when it is over or blocky, 2 on a
   usage error. */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(`--${n}`); return i === -1 ? d : argv[i + 1]; };
const has = (n) => argv.includes(`--${n}`);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('about:blank');

/* Everything below runs one function in the page: it decodes both PNGs, diffs them, and hands back
   the numbers plus two data URIs. Doing it in one evaluate keeps the pixel buffers in the browser
   instead of serialising a few million bytes per image across the bridge. */
async function diffPair(aDataUri, bDataUri, tol = 8) {
  return page.evaluate(async ([aSrc, bSrc, tolerance]) => {
    const load = (src) => new Promise((ok, no) => {
      const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('decode failed')); i.src = src;
    });
    const [a, b] = await Promise.all([load(aSrc), load(bSrc)]);
    const grab = (img) => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      return { w: c.width, h: c.height, d: c.getContext('2d').getImageData(0, 0, c.width, c.height).data };
    };
    const A = grab(a), B = grab(b);
    const w = Math.min(A.w, B.w), h = Math.min(A.h, B.h);

    const out = document.createElement('canvas'); out.width = w; out.height = h;
    const octx = out.getContext('2d');
    const img = octx.createImageData(w, h);
    const rows = new Int32Array(h), cols = new Int32Array(w);
    let differing = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const ia = (y * A.w + x) * 4, ib = (y * B.w + x) * 4, id = (y * w + x) * 4;
        const d = Math.max(
          Math.abs(A.d[ia] - B.d[ib]), Math.abs(A.d[ia + 1] - B.d[ib + 1]),
          Math.abs(A.d[ia + 2] - B.d[ib + 2]), Math.abs(A.d[ia + 3] - B.d[ib + 3]));
        if (d > tolerance) {
          differing++; rows[y]++; cols[x]++;
          img.data[id] = 180; img.data[id + 1] = 85; img.data[id + 2] = 47; img.data[id + 3] = 255;
        } else {                                    // the matching part, faded, so the diff has context
          const g = 255 - Math.round((255 - A.d[ia]) * 0.10);
          img.data[id] = img.data[id + 1] = img.data[id + 2] = g; img.data[id + 3] = 255;
        }
      }
    }
    octx.putImageData(img, 0, 0);

    const gap = 16;
    const sbs = document.createElement('canvas');
    sbs.width = w * 3 + gap * 2; sbs.height = h;
    const sctx = sbs.getContext('2d');
    sctx.fillStyle = '#f6f4f1'; sctx.fillRect(0, 0, sbs.width, sbs.height);   // --color-canvas
    sctx.drawImage(a, 0, 0); sctx.drawImage(b, w + gap, 0); sctx.drawImage(out, (w + gap) * 2, 0);

    const max = (arr) => { let i = 0; for (let k = 1; k < arr.length; k++) if (arr[k] > arr[i]) i = k; return i; };
    const wr = max(rows), wc = max(cols);
    let denseRows = 0; for (const n of rows) if (n > w * 0.5) denseRows++;

    return {
      w, h, aw: A.w, ah: A.h, bw: B.w, bh: B.h, differing,
      pct: (differing / (w * h)) * 100,
      worstRow: wr, worstRowPct: (rows[wr] / w) * 100,
      worstCol: wc, worstColPct: (cols[wc] / h) * 100,
      denseRows,
      diffPng: out.toDataURL('image/png'), sbsPng: sbs.toDataURL('image/png'),
    };
  }, [aDataUri, bDataUri, tol]);
}

const toDataUri = async (p) => 'data:image/png;base64,' + (await readFile(p)).toString('base64');
const fromDataUri = (uri) => Buffer.from(uri.split(',')[1], 'base64');

/* ── self-test: prove the probe can fail before trusting a pass ───────────── */

if (has('self-test')) {
  const swatch = (fill) => page.evaluate((f) => {
    const c = document.createElement('canvas'); c.width = 200; c.height = 120;
    const x = c.getContext('2d');
    x.fillStyle = '#f6f4f1'; x.fillRect(0, 0, 200, 120);
    x.fillStyle = f; x.fillRect(20, 20, 160, 80);
    return c.toDataURL('image/png');
  }, fill);

  const a = await swatch('#b69377');                 // --color-bronze
  const b = await swatch('#b69377');                 // the same component, exported twice
  const c = await swatch('#715035');                 // one token off: --color-bronze-deep
  const d = await swatch('#b59377');                 // one channel off by 1 — must NOT register

  const same = await diffPair(a, b);
  const wrong = await diffPair(a, c);
  const hair = await diffPair(a, d);
  await browser.close();

  const rows = [
    ['identical pair', `${same.pct.toFixed(2)}%`, 'must be 0.00', same.pct === 0],
    ['one token wrong (bronze → bronze-deep)', `${wrong.pct.toFixed(2)}%`, 'must exceed 2%', wrong.pct > 2],
    ['one channel off by 1', `${hair.pct.toFixed(2)}%`, 'must be 0.00 — rasteriser noise', hair.pct === 0],
    ['wrong pair is blocky', `${wrong.denseRows} dense rows`, 'must be over 2', wrong.denseRows > 2],
  ];
  for (const [what, got, want, ok] of rows) console.log(`${ok ? 'ok  ' : 'FAIL'}  ${what.padEnd(40)} ${got.padEnd(16)} ${want}`);
  const pass = rows.every((r) => r[3]);
  console.log(pass ? '\nOK — the probe passes what matches and fails what does not.'
    : '\nFAIL — the probe cannot tell them apart, so a pass from it means nothing.');
  process.exit(pass ? 0 : 1);
}

/* ── normal run ───────────────────────────────────────────────────────────── */

const pngs = argv.filter((a) => !a.startsWith('--') && /\.png$/i.test(a));
if (pngs.length !== 2) {
  await browser.close();
  console.error('usage: node tools/figma-parity.mjs <web.png> <figma.png> [--label Name] [--threshold 2] [--out dir]');
  console.error('       node tools/figma-parity.mjs --self-test');
  process.exit(2);
}
const [web, figma] = pngs.map((p) => resolve(p));
const label = flag('label', basename(web, '.png'));
const threshold = parseFloat(flag('threshold', '2'));
const outDir = resolve(flag('out', join(ROOT, 'scratchpad', 'parity')));

const r = await diffPair(await toDataUri(web), await toDataUri(figma));
await browser.close();

await mkdir(outDir, { recursive: true });
const sbsPath = join(outDir, `${label}-parity.png`);
const diffPath = join(outDir, `${label}-diff.png`);
await writeFile(sbsPath, fromDataUri(r.sbsPng));
await writeFile(diffPath, fromDataUri(r.diffPng));

console.log(label);
if (r.aw !== r.bw || r.ah !== r.bh) {
  console.log(`  SIZE MISMATCH      web ${r.aw}×${r.ah}, figma ${r.bw}×${r.bh} — compared over the ${r.w}×${r.h} overlap`);
  console.log('                     a size difference is itself a finding; fix it before reading the percentage');
}
console.log(`  differing          ${r.pct.toFixed(2)}%  (${r.differing} of ${r.w * r.h} px · threshold ${threshold}%)`);
console.log(`  worst row          y=${r.worstRow}, ${r.worstRowPct.toFixed(0)}% of it differs`);
console.log(`  worst column       x=${r.worstCol}, ${r.worstColPct.toFixed(0)}% of it differs`);
console.log(`  rows over half     ${r.denseRows}`);
console.log(`  side by side       ${sbsPath}`);
console.log(`  difference only    ${diffPath}`);

const over = r.pct > threshold;
const blocky = r.denseRows > 2;
if (blocky && !over) {
  console.log(`\nLOOK AT IT — under the threshold, but ${r.denseRows} rows differ by more than half.`);
  console.log('That is a shifted or recoloured block, not text hinting. Open the difference image.');
}
console.log(over ? '\nFAIL — over the threshold.' : blocky ? '\nUNPROVEN — see above.' : '\nOK');
process.exit(over || blocky ? 1 : 0);
