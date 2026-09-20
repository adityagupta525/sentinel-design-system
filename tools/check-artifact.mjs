/* check-artifact — follow every link on the staged cover and prove each destination MOUNTS.
 *
 * A published artifact is a link sent to people who cannot ask why a page is blank, so "it returned
 * 200" is not the test. This opens every page the cover points at and waits for it to render.
 *
 * THE TRAP THIS TOOL FELL INTO FIRST, kept because the next version of it will fall in too: these
 * pages compile their JSX in the browser AFTER the network goes quiet, so `networkidle` is not
 * "rendered". The first run reported ten pages dead that were perfectly fine — it had sampled once,
 * immediately. It polls now. A page with no `#root` (the small static guideline pages) is measured on
 * its body instead, and 200 bytes of real content is enough for one of those.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import net from 'node:net';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
if (!existsSync(join(ROOT, 'artifact', 'index.html'))) {
  console.error('artifact/ is not staged — run `npm run build:artifact` first');
  process.exit(2);
}
const PORT = await new Promise((res, rej) => {
  const s = net.createServer(); s.once('error', rej);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); });
});
/* ITS OWN SERVER, NOT THE REPOSITORY'S (20 Sep 2026). `preview-server.mjs` rewrites CDN URLs to
   node_modules copies when a CDN is unreachable — which is exactly right for a laptop and exactly
   wrong for this check, because it made every page pass here while every page was blank when
   published. This serves the staged files verbatim, and sends the ARTIFACT'S OWN
   Content-Security-Policy, so a script the artifact host would block is blocked here too. */
const CSP = [
  "default-src 'self' data: blob:",
  // NO 'unsafe-eval'. The pages ship precompiled (tools/precompile-jsx.mjs), so a page that still
  // needed a compiler would fail here rather than in the published copy, where we cannot look.
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net/npm/ https://cdn.tailwindcss.com https://code.jquery.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://cdn.jsdelivr.net/npm/",
].join('; ');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jsx': 'text/plain; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.ts': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml' };
const { createServer } = await import('node:http');
const { readFile } = await import('node:fs/promises');
const { extname, normalize } = await import('node:path');
const srv = createServer(async (req, res) => {
  const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, 'artifact', rel);
  try {
    const buf = await readFile(file);
    const ext = rel.endsWith('.d.ts') ? '.ts' : extname(rel);
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Content-Security-Policy': CSP });
    res.end(buf);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); }
}).listen(PORT, '127.0.0.1');
process.on('exit', () => { try { srv.close(); } catch {} });
await new Promise((r) => setTimeout(r, 300));

const require = createRequire(import.meta.url);
const { chromium } = require(join(ROOT, 'node_modules', 'playwright', 'index.js'));
const browser = await chromium.launch();

const cover = await browser.newPage();
await cover.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
const links = [...new Set(await cover.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))))];
await cover.close();

const missing = [];
const dead = [];
for (const href of links) {
  const probe = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const res = await probe.request.get(`http://127.0.0.1:${PORT}/${href}`);
  if (!res.ok()) { missing.push(`${res.status()} ${href}`); await probe.close(); continue; }
  if (!href.endsWith('.html')) { await probe.close(); continue; }
  const errs = [];
  probe.on('pageerror', (e) => errs.push(String(e).split('\n')[0]));
  probe.on('console', (m) => { if (/Content Security Policy|Refused to load/i.test(m.text())) errs.push('CSP: ' + m.text().slice(0, 90)); });
  probe.on('requestfailed', (r) => errs.push(`blocked ${r.url().replace(/^https?:\/\//, '').slice(0, 60)}`));
  await probe.goto(`http://127.0.0.1:${PORT}/${href}`, { waitUntil: 'networkidle' }).catch(() => {});
  let size = 0;
  for (let waited = 0; waited < 12000; waited += 250) {
    size = await probe.evaluate(() => {
      const r = document.getElementById('root');
      return r ? r.innerHTML.length : document.body.innerHTML.length;
    }).catch(() => 0);
    if (size > 200) break;
    await probe.waitForTimeout(250);
  }
  if (size <= 200 || errs.length) dead.push(`${href}  mounted=${size}  ${errs[0] || ''}`);
  await probe.close();
}
await browser.close();

console.log(`artifact: ${links.length} links on the cover, ${links.length - missing.length - dead.length} resolve and mount`);
if (missing.length) console.log('\nNOT FOUND:\n  ' + missing.join('\n  '));
if (dead.length) console.log('\nDID NOT MOUNT:\n  ' + dead.join('\n  '));
process.exit(missing.length + dead.length ? 1 : 0);
