/* Where do the falling-back marks actually appear — inside a 375x812 phone (the product), or in the
   board's annotation prose around it (documentation chrome)? The two have different severities and
   conflating them would either overstate the defect or hide it. */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createServer as probePort } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { chromium } = require(join(REPO, 'node_modules', 'playwright'));
const PORT = await new Promise((res, rej) => { const s = probePort(); s.once('error', rej); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); }); });
const server = spawn(process.execPath, [join(REPO, 'tools', 'preview-server.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch {} });
await new Promise((r) => setTimeout(r, 1400));

const PAGES = ['screens/journey-a/risk-profile.html', 'screens/journey-b/01-home.html', 'screens/journey-b/03-thread-answer.html',
  'screens/journey-b/05-decide.html', 'screens/journey-c/funds.html', 'screens/journey-d/proposal.html',
  'screens/journey-e/rebalance.html', 'screens/journey-f/review.html', 'screens/thread/ledger.html',
  'screens/thread/refusals.html', 'screens/thread/going-back.html', 'screens/shell/drawer.html', 'screens/prototype.html'];

/* The marks proven to fall back, by codepoint. Never quoted as glyphs in the report. */
const WATCH = ['₹', '✓', '✕', '✖', '●', '★', '⋯', '≈', '≤', '≥'];

const browser = await chromium.launch();
const totals = {};
for (const rel of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 2600 } });
  await page.goto(`http://localhost:${PORT}/${rel}`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction(() => (document.getElementById('root') || document.body).innerHTML.length > 200, null, { timeout: 30000 });
  await page.waitForTimeout(1200);
  const out = await page.evaluate((WATCH) => {
    const phones = [...document.querySelectorAll('div')].filter((d) => {
      const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
      return Math.round(r.width) === 375 && Math.round(r.height) === 812 && cs.overflow.includes('hidden');
    });
    const inPhone = (n) => phones.some((p) => p.contains(n));
    const res = {};
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement;
      if (!p || ['STYLE', 'SCRIPT'].includes(p.tagName)) continue;
      const mono = /mono|courier/i.test(getComputedStyle(p).fontFamily);
      for (const ch of WATCH) {
        let c = 0; for (const x of n.nodeValue) if (x === ch) c++;
        if (!c) continue;
        const cp = 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
        res[cp] = res[cp] || { phone: 0, board: 0, mono: 0, samples: [] };
        if (inPhone(p)) { res[cp].phone += c; if (res[cp].samples.length < 3) res[cp].samples.push({ where: 'PHONE', text: n.nodeValue.trim().slice(0, 44), size: getComputedStyle(p).fontSize, weight: getComputedStyle(p).fontWeight }); }
        else { res[cp].board += c; if (mono) res[cp].mono += c; }
      }
    }
    /* how much of the board's prose is monospace — the Courier question, counted not guessed */
    let monoRuns = 0, monoChars = 0, monoInPhone = 0;
    const w2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    let m;
    while ((m = w2.nextNode())) {
      const p = m.parentElement; if (!p || ['STYLE', 'SCRIPT'].includes(p.tagName)) continue;
      if (!/mono|courier/i.test(getComputedStyle(p).fontFamily)) continue;
      monoRuns++; monoChars += m.nodeValue.trim().length;
      if (inPhone(p)) monoInPhone++;
    }
    return { res, phones: phones.length, monoRuns, monoChars, monoInPhone };
  }, WATCH);
  totals[rel] = out;
  await page.close();
}
await browser.close();
try { server.kill(); } catch {}

const agg = {};
let monoRuns = 0, monoInPhone = 0, monoChars = 0;
for (const [rel, o] of Object.entries(totals)) {
  monoRuns += o.monoRuns; monoInPhone += o.monoInPhone; monoChars += o.monoChars;
  for (const [cp, v] of Object.entries(o.res)) {
    agg[cp] = agg[cp] || { phone: 0, board: 0, pages: [], samples: [] };
    agg[cp].phone += v.phone; agg[cp].board += v.board;
    if (v.phone) agg[cp].pages.push(rel.replace('screens/', ''));
    for (const s of v.samples) if (agg[cp].samples.length < 4) agg[cp].samples.push({ ...s, page: rel.replace('screens/', '') });
  }
}
console.log('mark      in PHONE (product)   in board prose   pages affected');
console.log('-'.repeat(92));
for (const [cp, v] of Object.entries(agg).sort((a, b) => b[1].phone - a[1].phone)) {
  console.log(cp.padEnd(9), String(v.phone).padEnd(20), String(v.board).padEnd(16), v.pages.length ? v.pages.join(', ').slice(0, 60) : '—');
  for (const s of v.samples.filter((x) => x.where === 'PHONE').slice(0, 2)) console.log('          e.g. ' + s.page + ' · ' + s.size + '/' + s.weight + ' · ' + JSON.stringify(s.text));
}
console.log('-'.repeat(92));
console.log(`monospace text runs across the 13 boards: ${monoRuns} (${monoChars} chars) — of which INSIDE a phone: ${monoInPhone}`);
