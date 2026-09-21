/* Gate B of the Figma parity gate: compares a rendered-product PNG against a Figma-exported PNG
   and reports the difference numerically, because "it looks the same" is not a measurement.

   See .claude/skills/sentinel-figma/references/parity.md for what this may and may not prove. The
   short version: a pixel is allowed to move by one (--slack, default 1) because the browser and
   Figma round glyph origins differently; beyond that, 2% of pixels is the threshold, and a diff
   under the threshold whose difference image shows a solid block rather than a halo of glyph edges
   is still a failure.

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
async function diffPair(aDataUri, bDataUri, tol = 8, slackPx = 1) {
  return page.evaluate(async ([aSrc, bSrc, tolerance, slack]) => {
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
    let differing = 0, interior = 0;
    /* POSITION TOLERANCE. A pixel counts as matching when an equal pixel exists within `slack` in
       the other image. The browser and Figma distribute letter-spacing and round glyph origins
       differently, which shifts every glyph by about a pixel: on a 359x88 card that scored 0.34%
       and on an 87x18 badge the same difference scored 10%, because the text is most of the badge.
       A fixed area threshold is therefore meaningless across sizes. Tolerating a one-pixel shift
       removes exactly that class of noise and still catches what matters — a wrong colour has no
       matching neighbour at any offset, and a 2px shift or a missing element fails. */
    const at = (I, x, y) => { const i = (y * I.w + x) * 4; return [I.d[i], I.d[i + 1], I.d[i + 2], I.d[i + 3]]; };
    const near = (I, x, y, px, tol) => {
      for (let dy = -slack; dy <= slack; dy++) {
        for (let dx = -slack; dx <= slack; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= I.w || ny >= I.h) continue;
          const q = at(I, nx, ny);
          if (Math.max(Math.abs(q[0] - px[0]), Math.abs(q[1] - px[1]), Math.abs(q[2] - px[2]), Math.abs(q[3] - px[3])) <= tol) return true;
        }
      }
      return false;
    };
    /* EDGE MASK. Where a difference sits matters more than how much of it there is. At 10px the
       two rasterisers disagree on the antialiasing of every glyph, which on an 87x18 badge came to
       4.6% of the image while the geometry was provably identical — same box, same position, and
       the zoom showed the letters in the same places. A difference in the INTERIOR of a flat
       region is the opposite: a wrong fill, a missing element, a shifted block. So the gate counts
       the two separately and only the interior ones fail. */
    const isGround = (I, x, y) => {
      const g = at(I, 0, 0), q = at(I, x, y);
      return Math.max(Math.abs(q[0] - g[0]), Math.abs(q[1] - g[1]), Math.abs(q[2] - g[2]), Math.abs(q[3] - g[3])) <= tolerance;
    };
    const edge = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        /* An edge pixel has a neighbour of a materially different colour IN THE SAME image — that
           is what an antialiased boundary is, whether it is a glyph, a radius or a hairline. */
        const c0 = at(A, x, y);
        let isEdge = false;
        for (let dy = -1; dy <= 1 && !isEdge; dy++) {
          for (let dx = -1; dx <= 1 && !isEdge; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= A.w || ny >= A.h) continue;
            const q = at(A, nx, ny);
            if (Math.max(Math.abs(q[0] - c0[0]), Math.abs(q[1] - c0[1]), Math.abs(q[2] - c0[2])) > tolerance) isEdge = true;
          }
        }
        edge[y * w + x] = isEdge ? 1 : 0;
      }
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const ia = (y * A.w + x) * 4, ib = (y * B.w + x) * 4, id = (y * w + x) * 4;
        let d = Math.max(
          Math.abs(A.d[ia] - B.d[ib]), Math.abs(A.d[ia + 1] - B.d[ib + 1]),
          Math.abs(A.d[ia + 2] - B.d[ib + 2]), Math.abs(A.d[ia + 3] - B.d[ib + 3]));
        if (d > tolerance && slack > 0) {
          /* Symmetric: the pixel must be findable in the other image AND vice versa, so a shift is
             forgiven but an added or removed mark is not. */
          if (near(B, x, y, at(A, x, y), tolerance) && near(A, x, y, at(B, x, y), tolerance)) d = 0;
        }
        if (d > tolerance) {
          differing++; rows[y]++; cols[x]++;
          const inter = !edge[y * w + x];
          if (inter) interior++;
          /* danger for an interior difference, bronze for an edge one — the image says which. */
          img.data[id] = inter ? 180 : 214; img.data[id + 1] = inter ? 85 : 179;
          img.data[id + 2] = inter ? 47 : 151; img.data[id + 3] = 255;
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

    /* INKED BOUNDING BOX. The area metric is blind to a shifted solid shape: displacing a 160x80
       block by 3px changes only two 3px strips, which came to 1.98% and passed. The bbox of
       everything that is not the ground colour is the direct measure of where the component sits
       and how big it is, and it catches a 1px size change the percentage never would. The ground
       is read from the top-left pixel, which the bleed guarantees is background. */
    const bbox = (I) => {
      const g = at(I, 0, 0);
      let x0 = I.w, y0 = I.h, x1 = -1, y1 = -1;
      for (let y = 0; y < I.h; y++) {
        for (let x = 0; x < I.w; x++) {
          const q = at(I, x, y);
          const dd = Math.max(Math.abs(q[0] - g[0]), Math.abs(q[1] - g[1]), Math.abs(q[2] - g[2]), Math.abs(q[3] - g[3]));
          if (dd > tolerance) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
        }
      }
      return x1 < 0 ? null : { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    };
    const ba = bbox(A), bb = bbox(B);
    const box = (ba && bb) ? { a: ba, b: bb,
      d: { left: bb.x0 - ba.x0, top: bb.y0 - ba.y0, right: bb.x1 - ba.x1, bottom: bb.y1 - ba.y1,
           w: bb.w - ba.w, h: bb.h - ba.h } } : null;

    const max = (arr) => { let i = 0; for (let k = 1; k < arr.length; k++) if (arr[k] > arr[i]) i = k; return i; };
    const wr = max(rows), wc = max(cols);
    let denseRows = 0; for (const n of rows) if (n > w * 0.5) denseRows++;

    return {
      w, h, aw: A.w, ah: A.h, bw: B.w, bh: B.h, differing,
      pct: (differing / (w * h)) * 100,
      worstRow: wr, worstRowPct: (rows[wr] / w) * 100,
      worstCol: wc, worstColPct: (cols[wc] / h) * 100,
      denseRows, box, interior,
      diffPng: out.toDataURL('image/png'), sbsPng: sbs.toDataURL('image/png'),
    };
  }, [aDataUri, bDataUri, tol, slackPx]);
}

const toDataUri = async (p) => 'data:image/png;base64,' + (await readFile(p)).toString('base64');
const fromDataUri = (uri) => Buffer.from(uri.split(',')[1], 'base64');

/* ── self-test: prove the probe can fail before trusting a pass ───────────── */

if (has('self-test')) {
  const swatch = (fill, dx = 0) => page.evaluate(([f, ox]) => {
    const c = document.createElement('canvas'); c.width = 200; c.height = 120;
    const x = c.getContext('2d');
    x.fillStyle = '#f6f4f1'; x.fillRect(0, 0, 200, 120);
    x.fillStyle = f; x.fillRect(20 + ox, 20, 160, 80);
    return c.toDataURL('image/png');
  }, [fill, dx]);

  const a = await swatch('#b69377');                 // --color-bronze
  const b = await swatch('#b69377');                 // the same component, exported twice
  const c = await swatch('#715035');                 // one token off: --color-bronze-deep
  const d = await swatch('#b59377');                 // one channel off by 1 — must NOT register

  /* The slack must forgive a one-pixel shift and refuse a three-pixel one. Without both, a
     tolerance added to silence letter-spacing noise could be silently hiding a real misalignment. */
  const shift1 = await swatch('#b69377', 1);
  const shift3 = await swatch('#b69377', 3);

  const same = await diffPair(a, b);
  const wrong = await diffPair(a, c);
  const hair = await diffPair(a, d);
  const one = await diffPair(a, shift1);
  const three = await diffPair(a, shift3);
  await browser.close();

  const rows = [
    ['identical pair', `${same.pct.toFixed(2)}%`, 'must be 0.00', same.pct === 0],
    ['one token wrong (bronze → bronze-deep)', `${wrong.pct.toFixed(2)}%`, 'must exceed 2%', wrong.pct > 2],
    ['one channel off by 1', `${hair.pct.toFixed(2)}%`, 'must be 0.00 — rasteriser noise', hair.pct === 0],
    ['wrong pair is blocky', `${wrong.denseRows} dense rows`, 'must be over 2', wrong.denseRows > 2],
    ['shifted 1px — pixels', `${one.pct.toFixed(2)}%`, 'must be 0.00 — forgiven', one.pct === 0],
    ['shifted 1px — box', `left ${one.box.d.left}`, 'must be within 1', Math.abs(one.box.d.left) <= 1],
    ['shifted 3px — box', `left ${three.box.d.left}`, 'must exceed 1 — caught by the box, not the %', Math.abs(three.box.d.left) > 1],
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

const slack = Number(flag('slack', '1'));
const r = await diffPair(await toDataUri(web), await toDataUri(figma), 8, slack);
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
console.log(`  of which interior  ${r.interior}  (a difference away from any edge — a wrong fill, not a rasteriser)`);
console.log(`  rows over half     ${r.denseRows}`);
if (r.box) {
  const d = r.box.d;
  console.log(`  inked box          web ${r.box.a.w}×${r.box.a.h} at ${r.box.a.x0},${r.box.a.y0}  ·  figma ${r.box.b.w}×${r.box.b.h} at ${r.box.b.x0},${r.box.b.y0}`);
  console.log(`  box shift          left ${d.left >= 0 ? '+' : ''}${d.left}  top ${d.top >= 0 ? '+' : ''}${d.top}  right ${d.right >= 0 ? '+' : ''}${d.right}  bottom ${d.bottom >= 0 ? '+' : ''}${d.bottom}`);
} else {
  console.log('  inked box          one side is entirely ground — nothing rendered');
}
console.log(`  side by side       ${sbsPath}`);
console.log(`  difference only    ${diffPath}`);

const blocky = r.denseRows > 2;
/* An edge of the inked box may move by the slack and no more. This is what catches a shifted or
   resized component, which the area percentage cannot see on a solid shape. */
const misplaced = !r.box || Math.max(...Object.values(r.box.d).map(Math.abs)) > slack;
/* The threshold applies to INTERIOR differences. Edge differences are the two rasterisers
   disagreeing about antialiasing, which no component can fix and which scales with how much text
   a component has rather than with how right it is. */
const interiorPct = (r.interior / (r.w * r.h)) * 100;
const overInterior = interiorPct > threshold;
if (blocky && !overInterior) {
  console.log(`\nLOOK AT IT — under the threshold, but ${r.denseRows} rows differ by more than half.`);
  console.log('That is a shifted or recoloured block, not text hinting. Open the difference image.');
}
if (misplaced && !overInterior) console.log(`\nMISPLACED — the inked box moved more than the ${slack}px slack. Size or position differs.`);
if (overInterior) console.log(`\nINTERIOR DIFFERENCE — ${interiorPct.toFixed(2)}% of the image differs away from any edge.`);
const fail = overInterior || blocky || misplaced;
console.log(fail ? '\nFAIL — see above.' : `\nOK — box exact, ${r.interior} interior difference(s), ${r.differing - r.interior} edge pixels (rasteriser).`);
process.exit(fail ? 1 : 0);
