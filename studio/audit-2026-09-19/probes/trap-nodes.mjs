/* WHICH nodes the trap counts as its last, and which of them the browser will actually Tab to.
   "The trap's node list is wrong" is a deduction until the two lists are printed side by side. */
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
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 2600 } });
await page.goto(`http://localhost:${PORT}/screens/prototype.html`, { waitUntil: 'domcontentloaded', timeout: 40000 });
await page.waitForFunction(() => document.getElementById('root').innerHTML.length > 200, null, { timeout: 30000 });
await page.waitForTimeout(1500);
await page.locator('button[aria-label="Menu"]').first().click();
await page.waitForTimeout(600);
const out = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  /* exactly the component's own selector and filter */
  const nodes = Array.prototype.filter.call(
    d.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    (n) => !n.disabled && n.getAttribute('aria-hidden') !== 'true');
  const desc = (n, i) => {
    const cs = getComputedStyle(n), r = n.getBoundingClientRect();
    const ti = n.getAttribute('tabindex');
    const reallyTabbable = ti !== '-1' && !n.disabled && cs.visibility !== 'hidden' && cs.display !== 'none' && r.width > 0 && r.height > 0;
    return { i: i + 1, tag: n.tagName.toLowerCase(), tabindex: ti, w: Math.round(r.width), h: Math.round(r.height),
      vis: cs.visibility, disp: cs.display, reallyTabbable,
      name: (n.getAttribute('aria-label') || (n.textContent || '').trim()).slice(0, 26) };
  };
  const all = nodes.map(desc);
  return { total: all.length, lastCounted: all[all.length - 1],
           lastReallyTabbable: [...all].reverse().find((x) => x.reallyTabbable),
           tail: all.slice(-5) };
});
console.log('the trap counts', out.total, 'nodes.');
console.log('\nlast five nodes the trap counted:');
for (const t of out.tail) console.log('  #' + t.i, t.tag, 'tabindex=' + t.tabindex, t.w + 'x' + t.h, 'vis=' + t.vis, 'display=' + t.disp, '| browser will Tab to it:', t.reallyTabbable, '|', JSON.stringify(t.name));
console.log('\ntrap thinks LAST is        : #' + out.lastCounted.i, JSON.stringify(out.lastCounted.name), 'tabbable=' + out.lastCounted.reallyTabbable);
console.log('the browser\'s real last is : #' + out.lastReallyTabbable.i, JSON.stringify(out.lastReallyTabbable.name));
console.log('\n=> Tab from #' + out.lastReallyTabbable.i + ' never satisfies `active === last`, so the trap does not fire and focus leaves the dialog.');
await browser.close(); try { server.kill(); } catch {}
