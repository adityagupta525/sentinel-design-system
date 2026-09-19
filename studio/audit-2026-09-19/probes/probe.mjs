/* Nia's audit probe — 19 Sep 2026.
   Measures the LIVE DOM of the 13 audited surfaces. Writes JSON to stdout or --json <file>.

   Nothing here touches product code. Everything it reports is a measurement, and every gate in it
   is proven able to fail against the fixtures in this directory (see prove.mjs).

   Gates:
     fonts     — CDP CSS.getPlatformFontsForNode: the face the ENGINE rasterised, never the declared
                 stack. Plus glyph coverage for the marks this product actually uses.
     names     — D1 · every enabled button/link/[role=button] with no accessible name.
     nested    — D2 · an interactive control inside another interactive control.
     targets   — D3 · the real hit box, found by walking elementFromPoint outward from the centre, so
                 it counts the ::before extension AND notices when a neighbour eats it.
     contrast  — proposed D5 · every distinct (role, ink, resolved background) pair, with its ratio.

   Usage: node probe.mjs --port 4322 [--pages a,b] [--json out.json] [--gate fonts,names,...]
*/
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer as probePort } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { chromium } = require(join(REPO, 'node_modules', 'playwright'));

const arg = (f, d = null) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : d; };
/* The server is spawned as a CHILD here, the way check-previews.mjs does it, on a port asked for
   rather than assumed. A detached server does not survive in this environment, and a probe that
   points at a server someone else started is a probe that can silently audit a different tree. */
const PORT = arg('--port') || await new Promise((res, rej) => {
  const s = probePort(); s.once('error', rej);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(String(port))); });
});
const server = spawn(process.execPath, [join(REPO, 'tools', 'preview-server.mjs')],
  { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch {} });
await new Promise((r) => setTimeout(r, 1400));
const BASE = arg('--base', `http://localhost:${PORT}`);
const JSON_OUT = arg('--json');
const ONLY_GATES = (arg('--gate') || 'fonts,names,nested,targets,contrast').split(',');

const DEFAULT_PAGES = [
  'screens/journey-a/risk-profile.html',
  'screens/journey-b/01-home.html',
  'screens/journey-b/03-thread-answer.html',
  'screens/journey-b/05-decide.html',
  'screens/journey-c/funds.html',
  'screens/journey-d/proposal.html',
  'screens/journey-e/rebalance.html',
  'screens/journey-f/review.html',
  'screens/thread/ledger.html',
  'screens/thread/refusals.html',
  'screens/thread/going-back.html',
  'screens/shell/drawer.html',
  'screens/prototype.html',
];
const PAGES = (arg('--pages') ? arg('--pages').split(',') : DEFAULT_PAGES).map((s) => s.trim());

/* ── The marks this product uses. Codepoints, not glyphs: quoting a missing character in a report
      about missing characters re-fails the gate you are reporting. ───────────────────────────────── */
const MARKS = [
  ['U+20B9', '₹', 'rupee — every figure in the product'],
  ['U+2192', '→', 'right arrow — "→ consequence", the voice rule'],
  ['U+2193', '↓', 'down arrow'],
  ['U+2191', '↑', 'up arrow'],
  ['U+2194', '↔', 'left-right arrow — the switch rows on the fund screen'],
  ['U+00B7', '·', 'middle dot — the meta chain separator'],
  ['U+2014', '—', 'em dash — the pivot'],
  ['U+2013', '–', 'en dash'],
  ['U+2039', '‹', 'single left angle quote'],
  ['U+203A', '›', '› open'],
  ['U+2248', '≈', 'approximately'],
  ['U+2264', '≤', 'less than or equal'],
  ['U+2265', '≥', 'greater than or equal'],
  ['U+2713', '✓', 'check — "Shortlisted ✓"'],
  ['U+2716', '✖', 'heavy multiplication x'],
  ['U+2715', '✕', 'multiplication x — the removable chip'],
  ['U+2026', '…', 'ellipsis'],
  ['U+2039', '‹', 'left angle'],
  ['U+25CF', '●', 'black circle'],
  ['U+2605', '★', 'star'],
];

/* ── Contrast, computed properly ──────────────────────────────────────────────────────────────── */
const CONTRAST_FN = function () {
  const parse = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b); const hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

  /* Resolve the paint behind an element by walking ancestors until an opaque one is found.
     GRADIENTS: backgroundColor is transparent when a gradient paints the box, so every stop is
     extracted from backgroundImage and the WORST one is returned. This is the exact hole that
     passed a white label on a copper button at 3.49:1. */
  const gradientStops = (bgImage) => {
    if (!bgImage || bgImage === 'none') return [];
    const out = [];
    const re = /rgba?\([^)]+\)/g; let m;
    while ((m = re.exec(bgImage))) out.push(m[0]);
    return out;
  };
  const resolveBg = (el) => {
    let node = el; const layers = [];
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      const stops = gradientStops(cs.backgroundImage);
      if (stops.length) { for (const s of stops) { const p = parse(s); if (p) layers.push({ c: p, grad: true, el: node }); } if (stops.some((s) => (parse(s) || {}).a === 1)) break; }
      const bc = parse(cs.backgroundColor);
      if (bc && bc.a > 0) { layers.push({ c: bc, grad: false, el: node }); if (bc.a === 1) break; }
      node = node.parentElement;
    }
    if (!layers.length) { const b = parse(getComputedStyle(document.body).backgroundColor); return b ? [b] : [{ r: 255, g: 255, b: 255, a: 1 }]; }
    /* Composite from the deepest opaque layer upward, once per gradient stop, and return every
       candidate background so the caller can take the worst. */
    const base = layers[layers.length - 1].c.a === 1 ? layers[layers.length - 1].c : { r: 255, g: 255, b: 255, a: 1 };
    const grads = layers.filter((l) => l.grad);
    const solids = layers.filter((l) => !l.grad);
    const stack = (extra) => {
      let acc = base;
      for (let i = solids.length - 1; i >= 0; i--) acc = solids[i].c.a === 1 ? solids[i].c : over(solids[i].c, acc);
      if (extra) acc = extra.a === 1 ? extra : over(extra, acc);
      return acc;
    };
    if (!grads.length) return [stack(null)];
    return grads.map((g) => stack(g.c));
  };

  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = n.parentElement;
      if (!p || ['STYLE', 'SCRIPT', 'TITLE'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      const cs = getComputedStyle(p);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return NodeFilter.FILTER_REJECT;
      const r = p.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n;
  while ((n = walker.nextNode())) {
    const p = n.parentElement;
    const cs = getComputedStyle(p);
    const fg0 = parse(cs.color); if (!fg0) continue;
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const bgs = resolveBg(p);
    /* every candidate background; worst ratio wins */
    let worst = null;
    for (const bg of bgs) {
      const fg = fg0.a === 1 ? fg0 : over(fg0, bg);
      const rr = ratio(fg, bg);
      if (!worst || rr < worst.ratio) worst = { ratio: rr, fgHex: hex(fg), bgHex: hex(bg) };
    }
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    results.push({
      key: `${worst.fgHex}|${worst.bgHex}|${size}|${weight}`,
      fg: worst.fgHex, bg: worst.bgHex, size, weight, large,
      ratio: Math.round(worst.ratio * 100) / 100,
      need, pass: worst.ratio >= need,
      alpha: fg0.a,
      sample: n.nodeValue.trim().slice(0, 40),
      tag: p.tagName.toLowerCase(),
      cls: (p.className && typeof p.className === 'string') ? p.className.slice(0, 40) : '',
    });
  }
  return results;
};

/* ── Names + nesting + targets ─────────────────────────────────────────────────────────────────── */
const DOM_FN = function () {
  const SEL = 'button, a[href], [role="button"], [role="link"], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const accName = (el) => {
    const al = el.getAttribute('aria-label');
    if (al && al.trim()) return al.trim();
    const lb = el.getAttribute('aria-labelledby');
    if (lb) {
      const t = lb.split(/\s+/).map((id) => (document.getElementById(id) || {}).textContent || '').join(' ').trim();
      if (t) return t;
    }
    const ti = el.getAttribute('title');
    if (ti && ti.trim()) return ti.trim();
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt) return txt;
    /* an <img alt> or an <svg><title> inside counts */
    const img = el.querySelector('img[alt]'); if (img && img.alt.trim()) return img.alt.trim();
    const svgT = el.querySelector('svg > title'); if (svgT && svgT.textContent.trim()) return svgT.textContent.trim();
    const vl = el.querySelector('input[value]'); if (vl && vl.value) return vl.value;
    return '';
  };
  const isEnabled = (el) => !el.disabled && el.getAttribute('aria-disabled') !== 'true'
    && el.getAttribute('tabindex') !== '-1';
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };
  const path = (el) => {
    const bits = [];
    let n = el;
    for (let i = 0; n && i < 4; i++, n = n.parentElement) {
      bits.unshift(n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' && n.className.trim() ? '.' + n.className.trim().split(/\s+/)[0] : ''));
    }
    return bits.join(' > ');
  };
  /* Which phone frame is this in? Every screen board is a grid of 375x812 phones; naming the phone
     is what makes a finding findable. */
  const phones = [...document.querySelectorAll('div')].filter((d) => {
    const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
    return Math.round(r.width) === 375 && Math.round(r.height) === 812 && cs.overflow.includes('hidden');
  }).map((el, i) => ({ el, i, r: el.getBoundingClientRect() }));
  const phoneOf = (el) => {
    for (const p of phones) if (p.el.contains(el)) return p.i;
    return -1;
  };
  /* Phone captions: the board labels each phone. Take the nearest preceding heading-ish text. */
  const phoneLabel = (i) => {
    const p = phones[i]; if (!p) return '';
    let n = p.el;
    /* walk up to the figure/wrapper then look for a label sibling */
    for (let k = 0; k < 4 && n; k++, n = n.parentElement) {
      const t = (n.textContent || '').trim();
      const own = [...(n.parentElement ? n.parentElement.children : [])]
        .filter((c) => c !== n && !c.contains(p.el))
        .map((c) => (c.textContent || '').trim()).filter(Boolean);
      if (own.length) return own[0].slice(0, 60);
    }
    return '';
  };

  const all = [...document.querySelectorAll(SEL)];
  const out = { unnamed: [], nested: [], targets: [], counts: {} };
  let controlsChecked = 0;

  for (const el of all) {
    if (!visible(el)) continue;
    controlsChecked++;
    const enabled = isEnabled(el);
    const name = accName(el);
    const ph = phoneOf(el);
    const rec = { tag: el.tagName.toLowerCase(), name, enabled, phone: ph, phoneLabel: phoneLabel(ph), path: path(el) };

    if (enabled && !name) out.unnamed.push({ ...rec, rect: (() => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) }; })() });

    /* D2 — an interactive control whose ANCESTOR is also interactive. */
    let a = el.parentElement;
    while (a && a !== document.body) {
      if (a.matches && a.matches('button, a[href], [role="button"], [role="link"]')) {
        out.nested.push({ inner: rec, outer: { tag: a.tagName.toLowerCase(), name: accName(a), path: path(a) } });
        break;
      }
      a = a.parentElement;
    }
  }
  out.counts.controlsVisible = controlsChecked;
  out.counts.phones = phones.length;
  return out;
};

/* ── D3 · the real hit box, by elementFromPoint ──────────────────────────────────────────────────
   Walked outward from the centre in 1px steps. A point counts as inside the target when
   elementFromPoint returns the element, a descendant of it, or an element whose closest interactive
   ancestor is it. That counts the ::before (a pseudo-element hit-tests as its originating element),
   and it correctly STOPS when a neighbour is painted on top — which is the thing a computed-style
   read cannot see. Probed at fractional offsets so a hit box computed from a fractional y does not
   round short. */
const TARGET_FN = function () {
  const SEL = 'button, a[href], [role="button"], [role="link"], input:not([type="hidden"]), select, textarea';
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };
  const isEnabled = (el) => !el.disabled && el.getAttribute('aria-disabled') !== 'true' && el.getAttribute('tabindex') !== '-1';
  const accName = (el) => (el.getAttribute('aria-label') || (el.textContent || '').replace(/\s+/g, ' ').trim() || '').slice(0, 40);
  const phones = [...document.querySelectorAll('div')].filter((d) => {
    const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
    return Math.round(r.width) === 375 && Math.round(r.height) === 812 && cs.overflow.includes('hidden');
  });
  const phoneOf = (el) => { for (let i = 0; i < phones.length; i++) if (phones[i].contains(el)) return i; return -1; };

  const hits = (el, x, y) => {
    const t = document.elementFromPoint(x, y);
    if (!t) return false;
    if (t === el || el.contains(t)) return true;
    /* the ::before of a pressable returns the button itself; a child span returns the child. Also
       accept when the hit element's nearest interactive ancestor IS el. */
    const near = t.closest && t.closest(SEL);
    return near === el;
  };

  const out = [];
  let offscreen = 0, coveredAtCentre = 0, unreachable = 0, checked = 0;
  const VW = window.innerWidth, VH = window.innerHeight;

  for (const el of document.querySelectorAll(SEL)) {
    if (!visible(el) || !isEnabled(el)) continue;
    const r = el.getBoundingClientRect();
    /* The hit test only works where the element is actually in the viewport. Anything outside is
       reported as OFFSCREEN, never as a pass and never as a fail — the failure mode this probe was
       written to avoid (a viewport shorter than the sheet reports everything below it as covered). */
    if (r.left < 0 || r.top < 0 || r.right > VW || r.bottom > VH) { offscreen++; continue; }
    checked++;
    const base = { name: accName(el), tag: el.tagName.toLowerCase(), phone: phoneOf(el),
                   box: { w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
                   dataHit: el.hasAttribute('data-hit'),
                   hitVars: { x: getComputedStyle(el).getPropertyValue('--hit-x').trim(), y: getComputedStyle(el).getPropertyValue('--hit-y').trim() },
                   cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 30) : '' };

    /* Find a point that actually belongs to this control. The centre is tried first, but the
       sibling-behind-the-content pattern (ArtifactCard's press target) is deliberately covered at
       its centre and perfectly reachable at its edges — calling that "occluded" would manufacture a
       finding. So a small grid is tried before giving up. */
    let anchor = null;
    const cands = [[0.5, 0.5], [0.12, 0.5], [0.88, 0.5], [0.5, 0.12], [0.5, 0.88], [0.12, 0.12], [0.88, 0.88]];
    for (const [fx, fy] of cands) {
      const x = r.left + r.width * fx, y = r.top + r.height * fy;
      if (hits(el, x, y)) { anchor = { x, y, centre: fx === 0.5 && fy === 0.5 }; break; }
    }
    if (!anchor) { unreachable++; out.push({ ...base, hit: null, unreachable: true }); continue; }
    if (!anchor.centre) coveredAtCentre++;

    /* The boundary, by BINARY SEARCH on a fractional coordinate rather than by counting 1px steps.
       Counting steps overstates the span by about a pixel (a 42px box measured 43), and a probe that
       overstates by one is a probe that passes a 43pt target as 44. Resolution 0.25px. */
    const edge = (dx, dy) => {
      let lo = 0, hi = 1;
      if (!hits(el, anchor.x + dx * 0.5, anchor.y + dy * 0.5)) return 0;
      while (hi < 64 && hits(el, anchor.x + dx * hi, anchor.y + dy * hi)) { lo = hi; hi *= 2; }
      if (hi >= 64 && hits(el, anchor.x + dx * 64, anchor.y + dy * 64)) return 64;
      for (let i = 0; i < 9; i++) { const mid = (lo + hi) / 2; if (hits(el, anchor.x + dx * mid, anchor.y + dy * mid)) lo = mid; else hi = mid; }
      return lo;
    };
    const up = edge(0, -1), down = edge(0, 1), left = edge(-1, 0), right = edge(1, 0);
    const hitH = +(up + down).toFixed(1), hitW = +(left + right).toFixed(1);
    out.push({
      ...base,
      hit: { w: hitW, h: hitH, up: +up.toFixed(1), down: +down.toFixed(1), left: +left.toFixed(1), right: +right.toFixed(1) },
      anchoredAtCentre: anchor.centre,
      /* 43.5 rather than 44: the span is sampled to 0.25px and measured between two interior points,
         so it reads up to half a pixel short of the true box. Anything at or above 43.5 is a 44. */
      ok: hitW >= 43.5 && hitH >= 43.5,
    });
  }
  return { targets: out, checked, offscreen, coveredAtCentre, unreachable, viewport: { VW, VH } };
};

/* ── main ──────────────────────────────────────────────────────────────────────────────────────── */
const browser = await chromium.launch();
const report = { base: BASE, when: new Date().toISOString(), pages: {} };

for (const rel of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 2600 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(`${BASE}/${rel}`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction(() => (document.getElementById('root') || document.body).innerHTML.length > 200, null, { timeout: 30000 });
  await page.waitForTimeout(1500);

  /* Grow the viewport to the whole document BEFORE measuring, so elementFromPoint can reach every
     phone on the board. A hit test in a viewport shorter than the sheet reports everything below
     the fold as covered — the exact false-clean this probe must not produce.
     Geometry is measured here, before any screenshot: a full-page screenshot resizes the viewport
     and two runs then disagree. */
  const dims = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
  await page.setViewportSize({ width: Math.min(2000, Math.max(1400, dims.w)), height: Math.min(12000, Math.max(800, dims.h)) });
  await page.waitForTimeout(700);
  const dims2 = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, vw: innerWidth, vh: innerHeight }));

  const rec = { errors, dims: dims2 };

  if (ONLY_GATES.includes('fonts')) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
    /* Sample real product text: one node per distinct computed font shorthand, plus the display
       numerals, plus any node containing a mark. */
    const handles = await page.evaluate(() => {
      const seen = new Map();
      const marks = '₹→↓↑↔·—–›≈≤≥✓✕✖…●';
      const out = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
      let n, idx = 0;
      while ((n = w.nextNode())) {
        const p = n.parentElement;
        if (!p || ['STYLE', 'SCRIPT'].includes(p.tagName)) continue;
        const r = p.getBoundingClientRect(); if (r.width < 1) continue;
        const cs = getComputedStyle(p);
        const key = `${cs.fontFamily}|${cs.fontSize}|${cs.fontWeight}`;
        const hasMark = [...n.nodeValue].some((c) => marks.includes(c));
        if (!seen.has(key) || hasMark) {
          const id = `__nia_${idx++}`;
          p.setAttribute('data-nia', id);
          out.push({ id, key, fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
                     text: n.nodeValue.trim().slice(0, 40), hasMark,
                     marks: [...new Set([...n.nodeValue].filter((c) => marks.includes(c)))].map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')) });
          seen.set(key, true);
        }
        if (out.length > 160) break;
      }
      return out;
    });
    const faces = [];
    for (const h of handles) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-nia="${h.id}"]` }).catch(() => ({ nodeId: 0 }));
      if (!nodeId) continue;
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId }).catch(() => ({ fonts: [] }));
      faces.push({ ...h, platform: fonts.map((f) => ({ family: f.familyName, glyphs: f.glyphCount, custom: f.isCustomFont })) });
    }
    /* Glyph coverage, per mark, measured the only honest way: a node containing ONLY that character,
       in the product's own stack, asked what the engine actually used. */
    const markIds = await page.evaluate((marks) => {
      const host = document.createElement('div');
      host.id = '__nia_marks';
      host.setAttribute('style', 'position:absolute;left:0;top:0;opacity:0.01;pointer-events:none;z-index:-1');
      document.body.appendChild(host);
      const made = [];
      for (const [cp, ch, why] of marks) {
        for (const [role, fam] of [['ui', "var(--font-ui)"], ['display', "var(--font-display)"]]) {
          const s = document.createElement('span');
          s.textContent = ch;
          s.setAttribute('data-niamark', `${cp}-${role}`);
          s.setAttribute('style', `font-family:${fam};font-size:24px;font-weight:${role === 'display' ? 500 : 400}`);
          host.appendChild(s);
          made.push({ cp, role, why, sel: `${cp}-${role}` });
        }
      }
      return made;
    }, MARKS);
    const coverage = [];
    for (const m of markIds) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-niamark="${m.sel}"]` }).catch(() => ({ nodeId: 0 }));
      if (!nodeId) continue;
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId }).catch(() => ({ fonts: [] }));
      coverage.push({ ...m, platform: fonts.map((f) => f.familyName) });
    }
    await page.evaluate(() => { const h = document.getElementById('__nia_marks'); if (h) h.remove(); });
    rec.fonts = { faces, coverage };
    await cdp.detach().catch(() => {});
  }

  if (ONLY_GATES.includes('names') || ONLY_GATES.includes('nested')) {
    rec.dom = await page.evaluate(`(${DOM_FN.toString()})()`);
  }
  if (ONLY_GATES.includes('targets')) {
    rec.targets = await page.evaluate(`(${TARGET_FN.toString()})()`);
  }
  if (ONLY_GATES.includes('contrast')) {
    rec.contrast = await page.evaluate(`(${CONTRAST_FN.toString()})()`);
  }

  report.pages[rel] = rec;
  process.stderr.write(`· ${rel}\n`);
  await page.close();
}
await browser.close();
try { server.kill(); } catch {}

const text = JSON.stringify(report, null, 1);
if (JSON_OUT) { await writeFile(JSON_OUT, text); process.stderr.write(`wrote ${JSON_OUT} (${(text.length / 1024).toFixed(0)} KB)\n`); }
else process.stdout.write(text);
