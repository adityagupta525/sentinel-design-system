/* GATE 5 — the state inventory, read from the boards themselves rather than from a spec.
   Each screen board captions every phone. The caption IS the state the screen claims to have drawn,
   so the inventory is the captions, and the gap is what F1 names minus what the captions cover. */
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
const PAGES = ['screens/journey-a/risk-profile.html','screens/journey-b/01-home.html','screens/journey-b/03-thread-answer.html',
 'screens/journey-b/05-decide.html','screens/journey-c/funds.html','screens/journey-d/proposal.html',
 'screens/journey-e/rebalance.html','screens/journey-f/review.html','screens/thread/ledger.html',
 'screens/thread/refusals.html','screens/thread/going-back.html','screens/shell/drawer.html','screens/prototype.html'];
/* F1's six. A caption is matched to a state by the words the product itself uses for it. */
const LAW = {
  ideal:   /typical|ideal|the answer|what is this for|normal|default|resting|the way in|end to end/i,
  empty:   /empty|nothing yet|no .*(yet|data)|first|day one|never|none/i,
  loading: /loading|working|thinking|in flight|in-flight|filling|waiting|streaming|skeleton|parsing|sent/i,
  partial: /partial|some|only|missing|uncosted|not costed|incomplete|unconfirmed|locked|short|one of/i,
  error:   /error|fail|failed|refus|reject|cannot|can.t|blocked|over the|ceiling|stopped|lost|wrong|no source/i,
  offline: /offline|no connection|lost the connection|disconnect|network|retry|reconnect/i,
};
const browser = await chromium.launch();
const table = [];
for (const rel of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 2600 } });
  await page.goto(`http://localhost:${PORT}/${rel}`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction(() => (document.getElementById('root')||document.body).innerHTML.length > 200, null, { timeout: 30000 });
  await page.waitForTimeout(1300);
  const caps = await page.evaluate(() => {
    const phones = [...document.querySelectorAll('div')].filter((d) => {
      const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
      return Math.round(r.width) === 375 && Math.round(r.height) === 812 && cs.overflow.includes('hidden') && parseFloat(cs.borderTopLeftRadius) > 20;
    });
    /* the caption is the small uppercase label the board paints above each phone; find the nearest
       preceding element that is not inside any phone and carries short text */
    const out = [];
    for (const ph of phones) {
      let n = ph, label = '';
      for (let up = 0; up < 5 && n && !label; up++, n = n.parentElement) {
        const sibs = n.parentElement ? [...n.parentElement.children] : [];
        for (const s of sibs) {
          if (s === n || s.contains(ph)) continue;
          const t = (s.textContent || '').trim();
          if (t && t.length < 70) { label = t; break; }
        }
      }
      out.push(label || '(uncaptioned)');
    }
    return out;
  });
  table.push({ rel: rel.replace('screens/', ''), caps });
  await page.close();
}
await browser.close(); try { server.kill(); } catch {}

console.log('surface                              phones  states the board draws (its own captions)');
console.log('='.repeat(118));
const totals = { ideal:0, empty:0, loading:0, partial:0, error:0, offline:0 };
for (const t of table) {
  console.log(`\n${t.rel.padEnd(36)} ${String(t.caps.length).padEnd(7)}`);
  for (const c of t.caps) console.log('        · ' + c.slice(0, 92));
  const hit = {};
  for (const [k, re] of Object.entries(LAW)) { hit[k] = t.caps.some((c) => re.test(c)); if (hit[k]) totals[k]++; }
  console.log('        F1: ' + Object.entries(hit).map(([k, v]) => `${v ? '+' : '-'}${k}`).join('  '));
}
console.log('\n' + '='.repeat(118));
console.log('surfaces (of 13) drawing each F1 state:');
for (const [k, n] of Object.entries(totals)) console.log(`   ${k.padEnd(9)} ${n}/13`);
