/* Builds design-system/_ds_bundle.js from the components on disk.

   Why this exists: the preview pages do not import the source. They load the bundle, which publishes
   every component onto window.SentinelDesignSystem_0682a2, and Claude Design compiled it upstream. So
   a fix made here was invisible in the pages it was supposed to fix — you could not look at your own
   work. This closes that loop.

   The output matches the upstream shape deliberately: same namespace, same `import React from 'react'`
   resolving to the page's single React, same one-global surface. The header comment carries the same
   @ds-bundle manifest the app writes, regenerated from disk.

   Usage: npm run build:bundle */
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const HERE = dirname(fileURLToPath(import.meta.url));
const DS = join(HERE, '..', 'design-system');
const NS = 'SentinelDesignSystem_0682a2';
const DIRS = ['actions', 'cards', 'chat', 'composer', 'data', 'forms', 'icons', 'lists', 'shell', 'text'];
const NAMED = /^export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z_$][\w$]*)/gm;

const modules = [];
for (const dir of DIRS) {
  for (const file of (await readdir(join(DS, 'components', dir))).filter((f) => f.endsWith('.jsx')).sort()) {
    const rel = `components/${dir}/${file}`;
    const names = [...(await readFile(join(DS, rel), 'utf8')).matchAll(NAMED)].map((m) => m[1]);
    if (names.length) modules.push({ rel, names, name: file.replace(/\.jsx$/, '') });
  }
}

const entry = join(DS, '.bundle-entry.jsx');
await writeFile(entry, modules.map((m) => `export { ${m.names.join(', ')} } from './${m.rel}';`).join('\n') + '\n');

const header = '/* @ds-bundle: ' + JSON.stringify({
  format: 4, namespace: NS,
  components: modules.map((m) => ({ name: m.name, sourcePath: m.rel })),
  builtBy: 'tools/build-bundle.mjs',
}) + ' */';

try {
  const out = join(DS, '_ds_bundle.js');
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'iife',
    globalName: '__ds_out',
    outfile: out,
    alias: { react: join(HERE, 'react-global.js') },
    jsx: 'transform',           /* React.createElement, as the upstream bundle emits */
    target: ['es2020'],
    legalComments: 'none',
    banner: { js: header },
    /* Merge onto the namespace, then take the scratch global away again: the page's contract is one
       global, and a second one would quietly become something callers depend on. */
    footer: { js: `Object.assign(window.${NS} = window.${NS} || {}, __ds_out); try { delete window.__ds_out; } catch (e) { window.__ds_out = undefined; }` },
  });
  const { size } = await import('node:fs').then((fs) => fs.promises.stat(out));
  console.log(`_ds_bundle.js: ${modules.length} modules, ${modules.reduce((n, m) => n + m.names.length, 0)} exports, ${(size / 1024).toFixed(0)} KB`);
} finally {
  await unlink(entry).catch(() => {});
}
