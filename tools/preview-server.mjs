/* Static server for design-system/. Zero dependencies on purpose: the previews already pull React,
   ReactDOM and Babel from a CDN and read _ds_bundle.js from disk, so all they need is something that
   serves files over http — opening them as file:// URLs breaks the relative script loads.

   Usage: npm run preview  (then open the printed URL) */
import { createServer } from 'node:http';
import { readFile, stat, access } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', 'design-system');
const PORT = Number(process.env.PORT || 4321);

/* The previews load React, ReactDOM, Babel and d3 from public CDNs. That is right for the published
   pages and wrong for a sandbox with no route to unpkg, so the server swaps those URLs for local
   copies ON THE WAY OUT. The HTML on disk is never touched — check:integrity would catch it if it
   were, and the pages must keep working unmodified wherever they are hosted.
   `integrity` is dropped along with the URL: the hash pins the CDN's bytes, not ours. */
const VENDOR = {
  'https://unpkg.com/react@18.3.1/umd/react.development.js': ['/__vendor/react.js', join(HERE, '..', 'node_modules/react/umd/react.development.js')],
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js': ['/__vendor/react-dom.js', join(HERE, '..', 'node_modules/react-dom/umd/react-dom.development.js')],
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': ['/__vendor/babel.js', join(HERE, '..', 'node_modules/@babel/standalone/babel.min.js')],
  'https://cdn.jsdelivr.net/npm/d3-scale@4/+esm': ['/__vendor/d3-scale.mjs', join(HERE, 'vendor/d3-scale.mjs')],
  'https://cdn.jsdelivr.net/npm/d3-shape@3/+esm': ['/__vendor/d3-shape.mjs', join(HERE, 'vendor/d3-shape.mjs')],
};
const BY_ROUTE = new Map(Object.values(VENDOR).map(([route, file]) => [route, file]));

let offline = false;
try { await access(join(HERE, '..', 'node_modules/react/umd/react.development.js')); offline = true; } catch { /* CDN it is */ }

function localise(html) {
  if (!offline) return html;
  for (const [cdn, [route]] of Object.entries(VENDOR)) html = html.split(cdn).join(route);
  return html.replace(/\s+integrity="[^"]*"/g, '').replace(/\s+crossorigin="[^"]*"/g, '');
}
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.jsx': 'text/babel; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.md': 'text/plain; charset=utf-8', '.ts': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (BY_ROUTE.has(path)) {
    const body = await readFile(BY_ROUTE.get(path));
    res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' });
    return res.end(body);
  }
  /* normalize() collapses any ../ before it is joined, so a request cannot escape ROOT. */
  let rel = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, rel);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end(`Not found: ${rel}`);
  }
  try {
    const ext = extname(file);
    const body = ext === '.html' ? localise(await readFile(file, 'utf8')) : await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[ext] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end(`Not found: ${rel}`);
  }
}).listen(PORT, () => {
  console.log(`Sentinel design system → http://localhost:${PORT}/pages/00-Index.html`);
  console.log(`              UI kit   → http://localhost:${PORT}/ui_kits/sentinel-app/index.html`);
  if (offline) console.log('React / Babel / d3 served from node_modules (CDN URLs rewritten in flight).');
});
