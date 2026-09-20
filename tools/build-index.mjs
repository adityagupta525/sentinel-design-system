/* Node runner for design-system/scripts/build-index.js.

   That script is the original from the Claude Design project and is left exactly as it was: it
   exports buildIndex({ ls, readFile, saveFile, today }) because it was written for a script runner
   that injected those three helpers. This file supplies them from node:fs so `npm run build:index`
   regenerates pages/_index.json. The scanning logic is not duplicated or reimplemented here. */
import { readdir, readFile as read, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DS = join(dirname(fileURLToPath(import.meta.url)), '..', 'design-system');
const { buildIndex } = await import(pathToFileURL(join(DS, 'scripts', 'build-index.js')));

const out = await buildIndex({
  ls: async (p) => (await readdir(join(DS, p))).filter((f) => !f.startsWith('.')),
  readFile: (p) => read(join(DS, p), 'utf8'),
  saveFile: (p, data) => writeFile(join(DS, p), data),
  today: new Date().toISOString().slice(0, 10),
});
console.log(`pages/_index.json: ${out.rows.length} rows`, out.counts);
