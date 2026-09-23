/* THE EXPLORER'S ART, AS DATA URIs — one function, because two builds need the same answer and a
   second copy of it would drift (23 Sep 2026).

   The funnel builds its `<img src>` from `window.__EXPLORER_ART`, a path. That path survives the dev
   server and a checkout, and it survives neither of the two things the owner actually looks at:

     · THE ARTIFACT serves the page at a URL with no trailing slash, so `./explorer/art/equity.webp`
       resolves one directory too high. The thirteen files were published at exactly the right paths
       and not one of them could be reached — four broken-image glyphs on the asset tiles and a
       broken face on every client row, which is how the owner found it.
     · THE SITE BUILD never staged them at all: `screens/explorer/*.html` went into the design-system
       artifact pointing at `./art`, a directory with nothing in it.

   So a build hands the bytes over instead of a path. `window.__EXPLORER_ART_MAP` is keyed relative to
   the art root — `equity.webp`, `avatars/m-turban.webp` — and the funnel's `artUrl()` prefers it and
   falls back to the path when it is absent, which is every case where a path works.

   Thirteen files, 72 KB, about 96 KB as base64. That is the price of a page that cannot lose its art
   to a URL it does not control. */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.avif': 'image/avif' };

/** Every file under `dir`, keyed by its path relative to `dir`, as a data URI. */
export function explorerArtMap(dir) {
  const out = {};
  if (!existsSync(dir)) return out;
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      if (name.startsWith('.')) continue;
      const p = join(d, name);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      /* `avatars/` IS NOT THE EXPLORER'S ANY MORE (23 Sep 2026). The eight faces moved into
         `ClientAvatar`, which carries them as data URIs so the drawer, the client picker and the
         composer's bound chip all get them; the files here are the source those were generated from.
         Shipping them in this map as well would put 16 KB of base64 in every page twice, and would
         leave two copies that could disagree about which face belongs to which name. */
      if (relative(dir, p).split(sep)[0] === 'avatars') continue;
      const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
      const type = TYPES[ext];
      if (!type) continue;
      out[relative(dir, p).split(sep).join('/')] = `data:${type};base64,${readFileSync(p).toString('base64')}`;
    }
  };
  walk(dir);
  return out;
}

/** The `<script>` tag to put in a page's head, BEFORE the explorer's own scripts run — the map is
 *  read at module scope, so a tag placed after them arrives too late to be used. */
export function explorerArtScript(dir) {
  const map = explorerArtMap(dir);
  const n = Object.keys(map).length;
  /* `</script` inside a script element ends it; base64 cannot contain one, but the key names come
     from disk, so the whole literal is escaped rather than trusted. */
  const json = JSON.stringify(map).replace(/<\/script/gi, '<\\/script');
  return { n, script: `<script>window.__EXPLORER_ART_MAP = ${json};</script>` };
}
