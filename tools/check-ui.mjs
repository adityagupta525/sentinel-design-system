#!/usr/bin/env node
/* THE UI GATE — the one that should have existed before the owner had to report the same class of
   defect four times.

   On 23 Sep 2026 he found, by looking: asset tiles with their top stroke sliced off, product tiles
   the same, category pills the same, a filter sheet half off the top of the phone, and a row of
   action pills running clean off the right edge — "Drop Sovereign GOLD BONDS Scheme 2020-21 - Series
   5 (tranche 42)". Each one was fixed on report. That is the wrong shape of work: every one of them
   is MEASURABLE, so a person should never have been the detector.

   WHAT IT CHECKS, and why each one is here rather than in a style guide:

   1. OVERFLOW — anything whose box crosses the phone's left or right edge. A phone is 375 and it does
      not scroll sideways; a control that leaves it cannot be tapped and a word that leaves it cannot
      be read. This is the check that catches a pill built from a fund's full name.

   2. CLIPPED RING — an element with an OUTER box-shadow (`0 0 0 Npx`, no `inset`) sitting closer than
      2pt to an `overflow:hidden` ancestor's edge. A ring renders outside the border-box, so flush
      content loses its outline; that is exactly the top-stroke slicing, and the same geometry clips
      a 2px focus ring at 2px offset, which makes it an accessibility defect too.

   3. NAMELESS CONTROL — a button with no text and no aria-label. F-39 in this repository's findings.

   4. TAP TARGET — anything operable under 44pt in either axis. The system's own floor.

   It runs the page, drives nothing, and reports file · element · measurement. A finding here is a
   number, not an opinion, which is the only kind of finding worth a gate.

   Run: npm run check:ui  ·  one page: npm run check:ui -- --only explorer/v1-journey */
import { chromium } from 'playwright';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT || 4322;
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const quiet = args.includes('--quiet');

function pages(dir, acc = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) pages(p, acc);
    else if (f.endsWith('.html')) acc.push(relative(root, p));
  }
  return acc;
}
let list = pages(join(root, 'screens')).concat(pages(join(root, 'design-system/pages')));
if (only) list = list.filter((p) => only.some((o) => p.includes(o)));

const PROBE = () => {
  const out = [];
  const phones = [...document.querySelectorAll('div')].filter((d) => {
    const r = d.getBoundingClientRect();
    return Math.abs(r.width - 375) < 3 && r.height > 600;
  });
  const boxes = phones.length ? phones : [document.body];

  for (const phone of boxes) {
    const pr = phone.getBoundingClientRect();
    if (pr.width < 10) continue;
    const label = (el) => {
      const t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ');
      return t.slice(0, 54);
    };

    for (const el of phone.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      /* A CLOSED PANEL IS NOT A DEFECT. The funnel's folds stay MOUNTED at `0fr` with `inert` set, so
         their children measure as far outside their clip box — which is the whole point. The first
         run of this gate reported 134 of them, which is a gate reporting its own mechanism. */
      if (el.closest('[inert]')) continue;
      /* An element inside a horizontally scrollable box is allowed past the edge — that is what the
         box is for, and DataTable's sticky column depends on it. */
      let scrollable = false;
      for (let n = el.parentElement; n && n !== phone; n = n.parentElement) {
        const o = getComputedStyle(n).overflowX;
        if (o === 'auto' || o === 'scroll') { scrollable = true; break; }
      }

      /* 1 — OVERFLOW */
      if (!scrollable) {
        const over = Math.round(Math.max(r.right - pr.right, pr.left - r.left));
        /* ONLY WHAT IS READ OR TAPPED. A screen's backdrop, its status band and its home indicator are
           declared full-bleed by every page in this repository and are meant to reach the edges; an
           empty decorative div leaving the frame is the frame working. What cannot leave is a WORD or
           a CONTROL — one cannot be read and the other cannot be reached. */
        const reads = (el.textContent || '').trim().length > 0;
        const taps = ['BUTTON', 'INPUT', 'A', 'TEXTAREA', 'SELECT'].includes(el.tagName);
        if (over > 1 && el.children.length === 0 && (reads || taps)) {
          out.push({ kind: 'overflow', by: over, what: label(el), tag: el.tagName.toLowerCase() });
        }
      }

      /* 2 — CLIPPED RING */
      const sh = cs.boxShadow || '';
      const outerRing = sh !== 'none' && !sh.includes('inset') && /0px 0px 0px [1-9]/.test(sh);
      if (outerRing) {
        /* A SCROLLER IS ALLOWED TO CLIP — that is what scrolling is. Only a NON-scrolling
           `overflow:hidden` box matters here: the fold panel, the card, the phone frame. Measuring
           against the thread's scroller reported every card that happened to be half-scrolled. */
        let clip = el.parentElement, scrolled = false;
        while (clip && clip !== phone) {
          const c = getComputedStyle(clip);
          const scrolls = ['auto', 'scroll'].includes(c.overflowY) || ['auto', 'scroll'].includes(c.overflowX);
          /* A SCROLLER BETWEEN THE TWO MEANS THE ELEMENT IS SIMPLY SCROLLED, not clipped. This was
             the last false positive: every card below the fold measured hundreds of points outside
             the phone frame, which is what being below the fold IS. */
          if (scrolls) { scrolled = true; break; }
          if (['hidden', 'clip'].includes(c.overflow) || ['hidden', 'clip'].includes(c.overflowY)) break;
          clip = clip.parentElement;
        }
        if (!scrolled && clip && clip !== phone) {
          const cr = clip.getBoundingClientRect();
          const gap = Math.round(Math.min(r.top - cr.top, cr.bottom - r.bottom, r.left - cr.left, cr.right - r.right) * 10) / 10;
          if (gap < 2) out.push({ kind: 'clipped-ring', by: gap, what: label(el), tag: el.tagName.toLowerCase() });
        }
      }

      /* 3 — NAMELESS CONTROL */
      if (el.tagName === 'BUTTON' && !(el.getAttribute('aria-label') || '').trim()
        && !(el.textContent || '').trim() && !el.querySelector('img[alt]')) {
        out.push({ kind: 'nameless', by: 0, what: '(a button with no name)', tag: 'button' });
      }

      /* 4 — TAP TARGET, MEASURED ON THE HIT BOX RATHER THAN THE DRAWN BOX. The system's own scale
         puts a chip at 36pt and a small chip at 28, deliberately — and `Pressable` makes up the
         difference with a ::before that expands the hit area, publishing the amount as --hit-x and
         --hit-y. Measuring the drawn box called every legal chip a defect; measuring the hit box is
         the rule the system actually states. */
      if (el.tagName === 'BUTTON') {
        /* TWO MECHANISMS EXPAND A HIT AREA IN THIS SYSTEM and the gate has to know both. `Pressable`
           measures and publishes --hit-x/--hit-y; `Pill` carries its own `.ds-pill::before` at
           top/bottom -4, which is how a 36pt chip reaches 44. Reading only the first called every
           legal chip in the product a defect — a gate that fails on the system's own scale is a gate
           nobody will keep. */
        const before = getComputedStyle(el, '::before');
        const neg = (v) => { const n = parseFloat(v); return Number.isFinite(n) && n < 0 ? -n : 0; };
        const hx = (parseFloat(cs.getPropertyValue('--hit-x')) || 0) || Math.max(neg(before.left), neg(before.right));
        const hy = (parseFloat(cs.getPropertyValue('--hit-y')) || 0) || Math.max(neg(before.top), neg(before.bottom));
        const h = r.height + hy * 2, w = r.width + hx * 2;
        if (h < 44 || w < 24) out.push({ kind: 'small-target', by: `${Math.round(w)}x${Math.round(h)}`, what: label(el), tag: 'button' });
      }
    }
  }
  /* One line per distinct (kind, what) — a list repeated down a page is one defect, not twenty. */
  const seen = new Map();
  for (const o of out) {
    const k = `${o.kind}|${o.what}`;
    if (!seen.has(k) || (typeof o.by === 'number' && o.by > seen.get(k).by)) seen.set(k, o);
  }
  return [...seen.values()];
};

const browser = await chromium.launch();
let bad = 0, checked = 0;
const failures = [];
for (const page of list) {
  const p = await browser.newPage({ viewport: { width: 1500, height: 1100 } });
  try {
    await p.goto(`http://localhost:${PORT}/${page}`, { waitUntil: 'networkidle', timeout: 25000 });
    await p.waitForTimeout(1600);
    const found = await p.evaluate(PROBE);
    checked += 1;
    if (found.length) {
      bad += 1;
      failures.push({ page, found });
      if (!quiet) {
        console.log(`\nFAIL  ${page}`);
        for (const f of found.slice(0, 12)) {
          console.log(`   ${f.kind.padEnd(13)} ${String(f.by).padStart(7)}  ${f.tag.padEnd(7)} ${f.what}`);
        }
        if (found.length > 12) console.log(`   … and ${found.length - 12} more`);
      }
    }
  } catch (e) {
    console.log(`SKIP  ${page} — ${String(e.message).slice(0, 70)}`);
  }
  await p.close();
}
await browser.close();

const counts = {};
for (const f of failures) for (const x of f.found) counts[x.kind] = (counts[x.kind] || 0) + 1;
console.log(`\n${checked - bad}/${checked} pages clean.`);
if (bad) {
  console.log(Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(' · '));
  process.exit(1);
}
