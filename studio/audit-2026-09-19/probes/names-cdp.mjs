/* D1, measured with the ENGINE's own accessible-name computation (CDP Accessibility domain), not a
   hand-rolled one. My first pass reimplemented accname and reported 134 unnamed controls; two of the
   shapes were mine, not the product's — an <input> takes its placeholder as a last-resort name, which
   my version did not implement. A probe that reimplements a spec reports its own gaps as defects.

   Also reports, separately, the controls whose only name comes from a PLACEHOLDER — a real name by
   the spec, and a weak one in practice because it vanishes the moment the advisor types. */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createServer as probePort } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { chromium } = require(join(REPO, 'node_modules', 'playwright'));
const arg = (f, d = null) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : d; };
const PORT = await new Promise((res, rej) => { const s = probePort(); s.once('error', rej); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); }); });
const server = spawn(process.execPath, [join(REPO, 'tools', 'preview-server.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
process.on('exit', () => { try { server.kill(); } catch {} });
await new Promise((r) => setTimeout(r, 1400));

const DEFAULT = ['screens/journey-a/risk-profile.html', 'screens/journey-b/01-home.html', 'screens/journey-b/03-thread-answer.html',
  'screens/journey-b/05-decide.html', 'screens/journey-c/funds.html', 'screens/journey-d/proposal.html',
  'screens/journey-e/rebalance.html', 'screens/journey-f/review.html', 'screens/thread/ledger.html',
  'screens/thread/refusals.html', 'screens/thread/going-back.html', 'screens/shell/drawer.html', 'screens/prototype.html'];
const PAGES = arg('--pages') ? arg('--pages').split(',') : DEFAULT;

const browser = await chromium.launch();
const rows = [];
for (const rel of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 2600 } });
  await page.goto(`http://localhost:${PORT}/${rel}`, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForFunction(() => (document.getElementById('root') || document.body).innerHTML.length > 200, null, { timeout: 30000 });
  await page.waitForTimeout(1200);

  /* Tag every visible, enabled control so the AX node can be matched back to a DOM element. */
  const tagged = await page.evaluate(() => {
    const SEL = 'button, a[href], [role="button"], [role="link"], input:not([type="hidden"]), select, textarea';
    const phones = [...document.querySelectorAll('div')].filter((d) => {
      const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
      return Math.round(r.width) === 375 && Math.round(r.height) === 812 && cs.overflow.includes('hidden');
    });
    const out = []; let i = 0;
    for (const el of document.querySelectorAll(SEL)) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true' || el.getAttribute('tabindex') === '-1') continue;
      const id = '__ax' + (i++);
      el.setAttribute('data-ax', id);
      let ph = -1; for (let k = 0; k < phones.length; k++) if (phones[k].contains(el)) { ph = k; break; }
      out.push({ id, tag: el.tagName.toLowerCase(), phone: ph,
        placeholder: el.getAttribute('placeholder') || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
        cls: (typeof el.className === 'string' ? el.className : '').slice(0, 40),
        parentText: (el.parentElement ? (el.parentElement.textContent || '') : '').replace(/\s+/g, ' ').trim().slice(0, 60),
        rect: { w: +r.width.toFixed(1), h: +r.height.toFixed(1) } });
    }
    return out;
  });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
  for (const t of tagged) {
    const q = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-ax="${t.id}"]` }).catch(() => ({ nodeId: 0 }));
    if (!q.nodeId) continue;
    const ax = await cdp.send('Accessibility.getPartialAXTree', { nodeId: q.nodeId, fetchRelatives: false }).catch(() => null);
    const node = ax && ax.nodes && ax.nodes.find((n) => n.backendDOMNodeId !== undefined && n.name !== undefined) || (ax && ax.nodes && ax.nodes[0]);
    const name = node && node.name ? String(node.name.value || '').trim() : '';
    const role = node && node.role ? String(node.role.value || '') : '';
    const ignored = node ? !!node.ignored : false;
    const src = node && node.name && node.name.sources
      ? (node.name.sources.find((s) => s.value && String(s.value.value || '').trim()) || {}).type || '' : '';
    rows.push({ page: rel.replace('screens/', ''), ...t, axName: name, axRole: role, ignored, nameFrom: src });
  }
  await cdp.detach().catch(() => {});
  await page.close();
}
await browser.close();
try { server.kill(); } catch {}

const enabledVisible = rows.length;
const unnamed = rows.filter((r) => !r.ignored && !r.axName);
const placeholderOnly = rows.filter((r) => !r.ignored && r.axName && r.nameFrom === 'placeholder');
const ignored = rows.filter((r) => r.ignored);

console.log(`controls measured (visible, enabled): ${enabledVisible}`);
console.log(`  named by the engine            : ${rows.filter((r) => r.axName && !r.ignored).length}`);
console.log(`  NO accessible name             : ${unnamed.length}`);
console.log(`  name comes only from placeholder: ${placeholderOnly.length}`);
console.log(`  ignored by the a11y tree        : ${ignored.length}`);

const group = (list, label) => {
  if (!list.length) { console.log(`\n${label}: none`); return; }
  console.log(`\n${label}:`);
  const by = {};
  for (const r of list) {
    const k = `${r.tag}.${r.cls.split(' ')[0]} ${r.rect.w}x${r.rect.h} inPhone=${r.phone >= 0}`;
    (by[k] = by[k] || []).push(r);
  }
  for (const [k, v] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${String(v.length).padStart(4)} × ${k}`);
    console.log(`         pages: ${[...new Set(v.map((x) => x.page))].join(', ').slice(0, 96)}`);
    console.log(`         e.g. parent text: ${JSON.stringify(v[0].parentText.slice(0, 56))}  role=${v[0].axRole}`);
  }
};
group(unnamed, 'D1 · controls with NO accessible name');
group(placeholderOnly, 'named only by placeholder (a real name, a weak one)');
