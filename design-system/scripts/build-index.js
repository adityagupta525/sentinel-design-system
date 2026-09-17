/* Regenerates pages/_index.json by scanning the tree. Run it after adding, renaming or deleting a
   component or a page; the index page renders nothing but this file.
   The index is generated from what is on disk, never from a hand-kept list, so it cannot tell us a
   component is there when it isn't: a row exists because <Name>.jsx and <Name>.d.ts both exist, and
   `shipped` requires pages/<Name>.html to exist too — a component with no page is not in the system.
   `specified` rows are the one exception and they are marked as such: they have no source file by
   definition, so they carry the document that specifies them instead of a path.

   Usage: paste into the project's script runner (it uses ls / readFile / saveFile), or adapt the three
   helpers to node:fs. Scanning + reading 70 sources exceeds a 30s budget in one pass, so it runs in
   three steps and writes pages/_index.json at the end. */
const DIRS = ['actions', 'cards', 'chat', 'composer', 'data', 'forms', 'icons', 'lists', 'shell', 'text'];
const GROUP_BY_DIR = { actions: 'Input', forms: 'Input', cards: 'Chat', chat: 'Chat', composer: 'Chat', data: 'Data', icons: 'Foundations', lists: 'Navigation', shell: 'Foundations', text: 'Foundations' };
/* Where the directory is the wrong answer. Groups are v10 §2.4: Foundations (tokens, type, motion) ·
   Chat (thread, composer, dock, artifact card) · Data (charts, table, overlap, stat tiles) ·
   Input (pill, chip, search, upload) · Navigation (drawer, sheet, rail). */
const OVERRIDE = { ArtifactCard: 'Chat', AllocationCard: 'Data', DataTableCard: 'Data', HeroNumberCard: 'Data', MoveCard: 'Data', Badge: 'Data', ConstraintCallout: 'Chat', RejectCallout: 'Chat', DisclosureBlock: 'Chat', ExplainerSheet: 'Navigation', Dock: 'Chat', TopBar: 'Navigation', ScrollToBottomButton: 'Chat', CanvasHeader: 'Navigation', ProgressRail: 'Navigation', ProgressTrace: 'Chat', StatTile: 'Data', ClientChip: 'Input', SearchField: 'Input', SelectionMark: 'Input', MotionGuard: 'Foundations' };
/* The backlog: specified in a document, no component on disk. Every row here is visible debt. */
const SPECIFIED = [
  { name: 'FileUpload', group: 'Input', spec: 'Component request spec · Part 2' },
  { name: 'DownloadAction', group: 'Input', spec: 'Component request spec · Part 2 — a Pill wrapper, unblocked now Pill has loading' },
  { name: 'ResultCard', group: 'Chat', spec: 'Component request spec · Part 4, re-pointed by v9 §1.1' },
  { name: 'InfoCard', group: 'Data', spec: 'Component request spec · Part 6' },
  { name: 'DataTable', group: 'Data', spec: 'Component request spec · Part 7, nudge added by v9 §1.3' },
  { name: 'OverlapView', group: 'Data', spec: 'Component request spec · Part 8 — pairs mode' },
];
const ORDER = ['Foundations', 'Chat', 'Data', 'Input', 'Navigation'];

export async function buildIndex({ ls, readFile, saveFile, today }) {
  /* The token vocabulary, read from tokens/ rather than assumed — the filter below is only honest if
     this set is the real one. */
  const defined = new Set();
  for (const f of (await ls('tokens')).filter((n) => /\.css$/.test(n))) {
    const css = await readFile('tokens/' + f);
    (css.match(/--[a-z0-9-]+\s*:/gi) || []).forEach((d) => defined.add(d.replace(/\s*:$/, '')));
  }
  const listing = {};
  for (const d of DIRS) { try { listing[d] = await ls('components/' + d); } catch (e) { listing[d] = []; } }
  const pageFiles = (await ls('pages')).filter((f) => /\.html$/.test(f));
  const rows = [];
  for (const dir of DIRS) {
    const files = listing[dir] || [];
    for (const f of files) {
      const m = /^([A-Z][A-Za-z0-9]*)\.jsx$/.exec(f);
      if (!m || !files.includes(m[1] + '.d.ts')) continue;   /* no .d.ts, no contract, no row */
      const name = m[1];
      const src = await readFile(`components/${dir}/${f}`);
      const referenced = Array.from(new Set((src.match(/var\(--[a-z0-9-]+\)/g) || []).map((t) => t.slice(4, -1)))).sort();
      /* Split what the source references into tokens and component-local custom properties. The column
         is headed "tokens it consumes", so it may only contain names that `tokens/` actually defines;
         a local like Pill's `--hit` (the ≥44px hit-area variable) is real but is not a token, and
         listing it there would be the index claiming something the token layer does not hold. */
      const tokens = referenced.filter((t) => defined.has(t));
      const locals = referenced.filter((t) => !defined.has(t));
      const page = pageFiles.includes(name + '.html') ? `${name}.html` : null;
      rows.push({ name, group: OVERRIDE[name] || GROUP_BY_DIR[dir], status: page ? 'shipped' : 'building', page, file: `components/${dir}/${f}`, tokens, locals });
    }
  }
  for (const s of SPECIFIED) rows.push({ ...s, status: 'specified', page: null, file: null, tokens: [] });
  rows.sort((a, b) => ORDER.indexOf(a.group) - ORDER.indexOf(b.group) || a.name.localeCompare(b.name));
  const counts = rows.reduce((o, r) => (o[r.status] = (o[r.status] || 0) + 1, o), {});
  const out = { generated: today, generator: 'scripts/build-index.js', counts, rows };
  await saveFile('pages/_index.json', JSON.stringify(out, null, 1));
  return out;
}
