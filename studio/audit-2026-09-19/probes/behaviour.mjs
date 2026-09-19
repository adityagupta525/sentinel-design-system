/* GATE 0b — behaviour truth. Runtime properties a still cannot show.

   Twelve of the thirteen audited surfaces are BOARDS: a grid of 375x812 stills, each one a state.
   A still has no keyboard, no scroll and no focus history, so a trap or a focus return is
   UNAUDITABLE there, not merely unaudited — and saying so by name is the point of this gate.
   `screens/prototype.html` is the one live surface, so every runtime contract is proven there,
   across two rendered states, or reported by name with its reason.

   --break <n> injects a defect so each assertion is seen to fail:
     1 = disarm the sheet trap   2 = drop the drawer's opener   3 = remove the composer's tab stop
*/
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createServer as probePort } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { chromium } = require(join(REPO, 'node_modules', 'playwright'));
const arg = (f, d = null) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : d; };
const BREAK = Number(arg('--break', '0'));
const PORT = await new Promise((res, rej) => { const s = probePort(); s.once('error', rej); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); }); });
const server = spawn(process.execPath, [join(REPO, 'tools', 'preview-server.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch {} });
await new Promise((r) => setTimeout(r, 1400));

const results = [];
const check = (id, pass, detail) => { results.push({ id, pass, detail }); console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${id} — ${detail}`); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 2600 } });
page.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 160)));
await page.goto(`http://localhost:${PORT}/screens/prototype.html`, { waitUntil: 'domcontentloaded', timeout: 40000 });
await page.waitForFunction(() => document.getElementById('root').innerHTML.length > 200, null, { timeout: 30000 });
await page.waitForTimeout(1500);

/* The active element's name must be the one the ENGINE computes. My first run reported the composer
   as an unnamed tab stop because this helper read aria-label/textContent only; an <input> takes its
   PLACEHOLDER as a last-resort accessible name, so the composer was named all along and the finding
   was mine. Placeholder is included here, and flagged, so the weak-name point can still be made
   without being dressed up as a missing name. */
const active = () => page.evaluate(() => {
  const a = document.activeElement;
  if (!a) return 'null';
  const nm = a.getAttribute('aria-label')
    || (a.getAttribute('placeholder') ? `«placeholder» ${a.getAttribute('placeholder')}` : '')
    || (a.textContent || '').trim().slice(0, 22);
  return `${a.tagName.toLowerCase()}${a.className && typeof a.className === 'string' ? '.' + a.className.trim().split(/\s+/)[0] : ''}[${nm}]`;
});
const openDialog = () => page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return null;
  const r = d.getBoundingClientRect();
  return { label: d.getAttribute('aria-label'), modal: d.getAttribute('aria-modal'), w: Math.round(r.width), h: Math.round(r.height) };
});

if (BREAK) {
  await page.evaluate((b) => {
    if (b === 3) { const i = document.querySelector('.ds-composer-input'); if (i) i.setAttribute('tabindex', '-1'); }
    if (b === 1 || b === 2) {
      /* swallow the component's keydown trap / focus return by stopping the event before it reaches
         the document-level listener the components install */
      window.__niaBreak = b;
      document.addEventListener('keydown', (e) => { if (window.__niaBreak === 1 && e.key === 'Tab') e.stopImmediatePropagation(); }, true);
      if (b === 2) { const orig = HTMLElement.prototype.focus; HTMLElement.prototype.focus = function () { if (this.tagName === 'BUTTON' && /Menu/.test(this.getAttribute('aria-label') || '')) return; return orig.apply(this, arguments); }; }
    }
  }, BREAK);
  console.log(`  [--break ${BREAK} injected]\n`);
}

console.log(`\n=== 0b.1 · Focus order on the live prototype (state: Home) ===`);
const order = [];
await page.evaluate(() => { document.body.focus(); if (document.activeElement) document.activeElement.blur(); });
for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); order.push(await active()); }
console.log('   ' + order.join('\n   '));
const composerIdx = order.findIndex((o) => /ds-composer-input/.test(o));
const menuIdx = order.findIndex((o) => /Menu/.test(o));
check('0b.1 focus order reaches the composer', composerIdx > -1, composerIdx > -1 ? `composer is tab stop #${composerIdx + 1} of ${order.length} sampled` : 'the composer is NOT reachable by Tab in the first 14 stops');
check('0b.1 focus order reaches the app bar', menuIdx > -1, menuIdx > -1 ? `Menu is tab stop #${menuIdx + 1}` : 'Menu not reached in 14 stops');
const dupes = order.filter((o, i) => o && order.indexOf(o) !== i && /\[\]$/.test(o));
check('0b.1 no unnamed stop in the first 14', !order.some((o) => /\[\]$/.test(o)), order.some((o) => /\[\]$/.test(o)) ? `unnamed stops: ${[...new Set(order.filter((o) => /\[\]$/.test(o)))].join(', ')}` : 'every sampled stop announces a name');

console.log(`\n=== 0b.2 · The drawer: opens, moves focus in, traps Tab, returns focus to its opener ===`);
const menuBtn = page.locator('button[aria-label="Menu"]').first();
const hasMenu = await menuBtn.count();
if (!hasMenu) { check('0b.2 drawer', false, 'no button[aria-label="Menu"] on the prototype — UNAUDITED'); }
else {
  await menuBtn.focus();
  const opener = await active();
  await menuBtn.click();
  await page.waitForTimeout(500);
  const d1 = await openDialog();
  check('0b.2a drawer opens as a modal dialog', !!d1 && d1.modal === 'true', d1 ? `role=dialog aria-modal=${d1.modal} label=${JSON.stringify(d1.label)} ${d1.w}x${d1.h}` : 'no [role=dialog] after clicking Menu');
  const inside = await page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); return !!(d && d.contains(document.activeElement)); });
  check('0b.2b focus moved INTO the drawer', inside, `activeElement after open: ${await active()}`);
  /* the trap: Tab from the last control must come back to the first, never escape */
  const n = await page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); return d ? d.querySelectorAll('button:not([disabled]),a[href],input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])').length : 0; });
  let escaped = null;
  const trail = [];
  for (let i = 0; i < n + 3; i++) {
    await page.keyboard.press('Tab');
    const st = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const a = document.activeElement;
      const nodes = d ? [...d.querySelectorAll('button:not([disabled]),a[href],input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])')] : [];
      return { inside: !!(d && d.contains(a)), idx: nodes.indexOf(a), total: nodes.length };
    });
    trail.push(`${await active()}${st.inside ? ` (#${st.idx + 1}/${st.total})` : ' OUTSIDE'}`);
    if (!st.inside) { escaped = { at: i + 1, where: await active(), trailTail: trail.slice(-4) }; break; }
  }
  check('0b.2c Tab is trapped inside the drawer', escaped === null,
    escaped ? `focus escaped on Tab #${escaped.at} of ${n + 3} to ${escaped.where} — last four stops: ${escaped.trailTail.join(' → ')}`
            : `${n} focusable controls, Tab cycled ${n + 3} times and never left`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const closed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
  check('0b.2d Escape closes the drawer', closed, closed ? 'no [role=dialog] after Escape' : 'the dialog is still in the DOM after Escape');
  const back = await active();
  check('0b.2e focus returned to the opener', back === opener, `opener was ${opener}; focus is now ${back}`);
}

console.log(`\n=== 0b.3 · The confirm sheet: does it trap, and is the composer really absent (rule A3) ===`);
/* Drive the router the way the advisor does. My first run typed into the composer, found a
   [role=dialog] still labelled "Menu" — the DRAWER — and passed itself. A dialog is not a confirm
   sheet because it is a dialog; the check now names which one it found. */
const rowNames = await page.evaluate(() => [...document.querySelectorAll('button')].map((b) => (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 44)).filter(Boolean));
let reached = { sheet: null, how: null };
for (const want of ["Why did Sharma's portfolio drift", 'Approve', 'Place', 'Send', 'Confirm', 'Review portfolio']) {
  const btn = page.locator(`button:has-text("${want}")`).first();
  if (!(await btn.count())) continue;
  await btn.click({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(2200);
  const d = await page.evaluate(() => [...document.querySelectorAll('[role="dialog"]')].map((x) => x.getAttribute('aria-label')));
  const sheet = d.find((x) => x && x !== 'Menu');
  if (sheet) { reached = { sheet, how: want }; break; }
}
console.log('   buttons offered on the live surface:', rowNames.slice(0, 10).join(' | '));
if (!reached.sheet) {
  check('0b.3a the confirm sheet is reachable on the live surface', false,
    'no [role=dialog] other than the drawer could be driven to from Home in one step — the confirm sheet\'s trap and its A3 composer exception are UNAUDITED on the live surface, not passing');
} else {
  check('0b.3a the confirm sheet is reachable on the live surface', true, `reached ${JSON.stringify(reached.sheet)} via ${JSON.stringify(reached.how)}`);
  const trapOk = await page.evaluate(async () => {
    const d = [...document.querySelectorAll('[role="dialog"]')].find((x) => x.getAttribute('aria-label') !== 'Menu');
    return !!(d && d.contains(document.activeElement));
  });
  check('0b.3b focus moved into the confirm sheet', trapOk, `activeElement: ${await active()}`);
  const noComposer = await page.evaluate(() => {
    const d = [...document.querySelectorAll('[role="dialog"]')].find((x) => x.getAttribute('aria-label') !== 'Menu');
    return d ? d.querySelectorAll('.ds-composer-input').length === 0 : null;
  });
  check('0b.3c rule A3 — the confirm sheet is the one documented composer exception', noComposer === true, `composer inputs inside the sheet: ${noComposer === true ? 0 : 'present'}`);
}

console.log(`\n=== 0b.4 · Scroll anchoring: is there a scroll container, and does the composer stay put ===`);
const scrollInfo = await page.evaluate(() => {
  const phones = [...document.querySelectorAll('div')].filter((d) => { const r = d.getBoundingClientRect(), cs = getComputedStyle(d); return Math.round(r.width) === 375 && Math.round(r.height) === 812 && cs.overflow.includes('hidden'); });
  if (!phones.length) return null;
  const ph = phones[0];
  const scrollers = [...ph.querySelectorAll('*')].filter((e) => { const cs = getComputedStyle(e); return /auto|scroll/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 4; });
  /* THE DOCK, not the phone. `find(e => e.querySelector('.ds-composer-input'))` returns the OUTERMOST
     ancestor that contains the composer — which is the 812px phone, and my first run duly reported a
     "dock height" of 812. The dock is the innermost ancestor that still contains the composer and is
     wider than it: walk up from the input instead. */
  const input = ph.querySelector('.ds-composer-input');
  let dock = null;
  if (input) { dock = input.parentElement; while (dock && dock !== ph && dock.getBoundingClientRect().height < 56) dock = dock.parentElement; }
  const dockBox = dock && dock !== ph ? dock.getBoundingClientRect() : null;
  return {
    scrollers: scrollers.map((s) => ({ cls: (typeof s.className === 'string' ? s.className : '').slice(0, 24), h: Math.round(s.clientHeight), sh: Math.round(s.scrollHeight), padBottom: getComputedStyle(s).paddingBottom, anchor: getComputedStyle(s).overflowAnchor })),
    dock: dockBox ? { top: Math.round(dockBox.top), h: Math.round(dockBox.height), pos: getComputedStyle(dock).position } : null,
  };
});
console.log('   ', JSON.stringify(scrollInfo));
if (!scrollInfo || !scrollInfo.scrollers.length) {
  check('0b.4 scroll anchoring', false, 'no overflowing scroll container inside the phone — scroll anchoring and the derived bottom padding are UNAUDITABLE on this surface, not passing');
} else {
  const s = scrollInfo.scrollers[0];
  const dockH = scrollInfo.dock ? scrollInfo.dock.h : 0;
  const pad = parseFloat(s.padBottom) || 0;
  check('0b.4a the thread scroller carries bottom padding ≥ the dock it sits under', pad >= dockH - 1, `scroller padding-bottom ${pad}px vs measured dock height ${dockH}px`);
  /* two states: top and bottom of the scroll, the dock must not move */
  const before = scrollInfo.dock ? scrollInfo.dock.top : null;
  await page.evaluate(() => { const phones = [...document.querySelectorAll('div')].filter((d) => { const r = d.getBoundingClientRect(); return Math.round(r.width) === 375 && Math.round(r.height) === 812; }); const ph = phones[0]; const sc = [...ph.querySelectorAll('*')].find((e) => /auto|scroll/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 4); if (sc) sc.scrollTop = sc.scrollHeight; });
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => { const phones = [...document.querySelectorAll("div")].filter((d) => { const r = d.getBoundingClientRect(); return Math.round(r.width) === 375 && Math.round(r.height) === 812; }); const ph = phones[0]; const input = ph.querySelector(".ds-composer-input"); let dock = input ? input.parentElement : null; while (dock && dock !== ph && dock.getBoundingClientRect().height < 56) dock = dock.parentElement; return dock && dock !== ph ? Math.round(dock.getBoundingClientRect().top) : null; });
  check('0b.4b the composer box is identical at the top and the bottom of the scroll', before === after, `dock top ${before} -> ${after}`);
}

await browser.close();
try { server.kill(); } catch {}
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} behaviour assertions pass` + (BREAK ? '  [with --break ' + BREAK + ' injected]' : ''));
