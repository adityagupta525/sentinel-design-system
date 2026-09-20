/* Renders every preview page in the design system and reports what actually happened.

   A design system whose pages throw is worse than one with no pages: the spec says the component
   exists and the page silently shows nothing. So this fails on a console error, on a page that
   mounts nothing, and on a request that 404s — the three ways a preview lies.

   Usage: node tools/check-previews.mjs [--shots <dir>] [--only <substr,substr>] [--quiet] [--json <file>] */
import { spawn } from 'node:child_process';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer as probe } from 'node:net';

const HERE = dirname(fileURLToPath(import.meta.url));
const DS = join(HERE, '..', 'design-system');
/* screens/ is a second tree, walked the same way and served by the same server's repository-root
   fallback. Its pages are prefixed so a screen and a spec page can never collide on a shot name. */
const SCREENS = join(HERE, '..', 'screens');
/* --self-test runs the guard against two fixtures instead of the repository: one that breaks the
   right gutter by exactly the mistake that got past 75/75, and the same markup with box-sizing put
   back. A guard that has never been seen to fail is not a guard. */
const FIXTURES = join(HERE, 'fixtures');
const SELF_TEST = process.argv.includes('--self-test');
/* A free port, asked for rather than assumed. A fixed one meant two runs at once shared a server, and
   whichever finished first killed it out from under the other — which reports every remaining page as
   a failure that never happened. A harness that can invent failures is worse than no harness. */
const PORT = Number(process.env.PORT) || await new Promise((resolve, reject) => {
  const s = probe();
  s.once('error', reject);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); });
});
const arg = (f) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : null; };
const SHOTS = arg('--shots');
/* --only takes a COMMA-SEPARATED list (18 Sep 2026). It took one substring, and a component edit whose
   blast radius is five pages meant five runs or one substring broad enough to sweep in pages nobody
   changed — which is how a targeted run quietly becomes a full one. */
const ONLY = arg('--only');
const ONLY_LIST = ONLY ? ONLY.split(',').map((x) => x.trim()).filter(Boolean) : null;
/* --quiet prints failures and the tally only. A clean full sweep is 82 lines that all say the same
   thing; only the failures and the count carry information, and reading the rest costs context. */
const QUIET = process.argv.includes('--quiet');
const JSON_OUT = arg('--json');

/* Viewport comes from the page's own @dsCard marker where it has one — the card says how wide the
   design is meant to be seen, and shooting it at some other width measures nothing. */
const CARD = /<!--\s*@dsCard([^>]*?)-->/;
const GUTTER = /<!--\s*@gutter([^>]*?)-->/;
/* ── The gutter guard ──────────────────────────────────────────────────────────────────────────────
   check-previews asks "did it render and did it throw". It never asked "is it inside the screen", so
   a card that ran 8pt past the right edge passed 75/75 while being visibly clipped by the phone.
   Found 18 Sep 2026 on screens/journey-b/01-home.html: a width:100% child with its own 12px padding
   and no box-sizing renders 367 wide inside a 343 box.

   What it checks: inside every phone frame (375x812, overflow hidden, a large radius), an element must
   sit at least `min` points from both edges.

   What it does not check, and why:
   · FULL-BLEED, by geometry — left 0 AND right 0. The backdrop, the status bar, the top bar, the
     greeting row, the dock and the home indicator are all deliberately edge to edge. The page names
     them in its own @gutter marker so the exemption is readable rather than implied.
   · CLIPPED, by an ancestor between the element and the phone whose overflow-x is hidden/auto/scroll/
     clip. ScreenBackdrop's two aura blobs sit at left:-93 and right:-120 inside an overflow:hidden
     box; they cannot break a gutter they cannot reach. The phone itself is excluded from that scan on
     purpose — the phone clipping something IS the bug.
   · EDGE-ANCHORED, declared per element with data-gutter="edge". A drawer slides in from the left and
     is flush to it on purpose: left 0, right 75. Geometry cannot tell that apart from a card that
     overran, so the element says so itself, one element at a time — and its DESCENDANTS are still
     checked, so the content inside a drawer still owes both gutters. The count of skipped elements is
     printed with the result, because an escape hatch nobody can see is an escape hatch that gets used.
   · Anything with no area.
   Run `node tools/check-previews.mjs --self-test` to watch it fail on tools/fixtures/gutter-broken.html
   and pass on gutter-ok.html. */
const GUTTER_PROBE = (min) => {
  const phones = [...document.querySelectorAll('div')].filter((d) => {
    const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
    return Math.round(r.width) === 375 && Math.round(r.height) === 812
      && cs.overflow.includes('hidden') && parseFloat(cs.borderTopLeftRadius) > 20;
  });
  const bad = [];
  let anchored = 0;
  /* Recursive, because the gutter is measured against the FRAME an element sits in. The phone is the
     first frame; an element that declares data-gutter="edge" becomes the frame for its own subtree.
     That is what makes a 300pt drawer work: the panel is flush to the phone's left on purpose, and the
     rows inside it owe their 16 to the panel, not to the phone. */
  const walk = (el, frame) => {
    for (const child of el.children) {
      const r = child.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (child.dataset && child.dataset.gutter === 'edge') { anchored++; walk(child, r); continue; }
      const L = Math.round(r.left - frame.left), R = Math.round(frame.right - r.right);
      if (!(L === 0 && R === 0) && (L < min || R < min)) {
        bad.push(`<${child.tagName.toLowerCase()}> left ${L} right ${R} width ${Math.round(r.width)} — "${(child.textContent || '').trim().slice(0, 32)}"`);
      }
      /* A box that clips is checked itself and then closes the question for everything inside it:
         whatever sits in there cannot be seen outside it, so it cannot break a gutter. That is what
         exempts ScreenBackdrop's two aura blobs at left:-93 and right:-120. */
      if (/hidden|auto|scroll|clip/.test(getComputedStyle(child).overflowX)) continue;
      walk(child, frame);
    }
  };
  for (const phone of phones) walk(phone, phone.getBoundingClientRect());
  return { phones: phones.length, anchored, bad: [...new Set(bad)] };
};

const ATTR = (s, k) => (new RegExp(`${k}="([^"]*)"`).exec(s) || [])[1];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue; // .DS_Store and friends are not content
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (e.name.endsWith('.html')) yield p;
  }
}

const { readFile } = await import('node:fs/promises');
const pages = [];
for (const [base, prefix] of (SELF_TEST ? [[FIXTURES, 'tools/fixtures/']] : [[DS, ''], [SCREENS, 'screens/']])) {
 let any = false;
 try { for await (const _ of walk(base)) { any = true; break; } } catch { continue; }
 if (!any) continue;
 for await (const p of walk(base)) {
  const rel = prefix + relative(base, p).split(sep).join('/');
  if (rel === 'thumbnail.html') continue;
  if (ONLY_LIST && !ONLY_LIST.some((o) => rel.includes(o))) continue;
  const text = await readFile(p, 'utf8');
  const card = CARD.exec(text.slice(0, 400))?.[1] ?? '';
  const [w, h] = (ATTR(card, 'viewport') || '1200x1400').split('x').map(Number);
  /* A static structure check before the browser sees it. Five spec pages shipped with a duplicated
     <body> and a second <div id="root">, from a shared head fragment that carried one line too many.
     Chrome tolerated it here and the published copies came up BLANK, so a clean render is not on its
     own evidence that the document is well formed. Counted, not parsed: these three are exactly the
     duplications that produced it. */
  const count = (re) => (text.match(re) || []).length;
  const structure = [];
  if (count(/<body[\s>]/g) !== 1) structure.push(`<body> appears ${count(/<body[\s>]/g)}\u00d7 — must be exactly 1`);
  /* At MOST one, not exactly one: the guideline pages render straight into <body> and have no #root
     at all. Requiring exactly one failed all 17 of them the first time this check ran. */
  if (count(/id="root"/g) > 1) structure.push(`id="root" appears ${count(/id="root"/g)}\u00d7 — must be at most 1`);
  if (count(/page-kit\.jsx/g) > 1) structure.push(`page-kit.jsx loaded ${count(/page-kit\.jsx/g)}\u00d7 — must be at most 1`);
  /* THE file:// GUARD, on any page that compiles JSX. Such a page is silently blank when it is opened
     from a downloaded folder rather than served — no error, no message, nothing — and that is how the
     owner met it. The guard says so and points at the built copy in `site/`; it is inert over http, so
     it changes nothing here. `node tools/add-file-guard.mjs` adds it to a page that is missing it. */
  if (count(/text\/babel/g) > 0 && count(/data-ds-file-guard/g) !== 1)
    structure.push('no file:// guard — this page compiles JSX and would be silently blank from a file; run `node tools/add-file-guard.mjs`');
  /* SHARED-SCOPE CHECK, static. Every text/babel script a page loads compiles into ONE global scope, so
     a `const { Dock }` in home.jsx and another in the page is a SyntaxError and the page renders nothing —
     which is exactly how screen 1's extraction and the drawer failed on first load (18 Sep 2026). Counted
     before the browser sees the page: every top-level const/let/function/class name across the page's
     loaded .jsx files and its inline script must be unique. */
  const scope = [];
  if (prefix === 'screens/') {
    const dir = dirname(p);
    const srcs = [...text.matchAll(/<script[^>]+type="text\/babel"[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    const inline = [...text.matchAll(/<script[^>]+type="text\/babel"(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    const sources = [];
    for (const s of srcs) { try { sources.push([s, await readFile(join(dir, s), 'utf8')]); } catch { structure.push(`babel src not found: ${s}`); } }
    for (const [i, s] of inline.entries()) sources.push([`<inline #${i + 1}>`, s]);
    const seen = new Map();
    for (const [name, src] of sources) {
      for (const m of src.matchAll(/^(?:const|let|var|function|class)\s+(\{[^}]*\}|[A-Za-z_$][\w$]*)/gm)) {
        const names = m[1].startsWith('{') ? m[1].slice(1, -1).split(',').map((x) => x.split(':').pop().trim()).filter(Boolean) : [m[1]];
        for (const n of names) { if (seen.has(n) && seen.get(n) !== name) scope.push(`\`${n}\` declared in ${seen.get(n)} and again in ${name} — one Babel scope, the page will render nothing`); else seen.set(n, name); }
      }
    }
  }
  /* THE PINNED-CHIP GATE (19 Sep 2026). The owner's ruling of 18 Sep: chips and the CTA live IN the turn
     that offered them and scroll away with it. `Dock.chips` / `Dock.cta` were deprecated in the contract
     and nothing enforced it, so the next screen could pin a chip again and no check would notice.
     They could not simply be DELETED: `design-system/ui_kits/` is the imported record, it passes both in
     several artboards, and it is not edited. So the ruling is enforced where it applies — screens/ — and
     the props survive only for the frozen kit. Home is the one exception and it is in the contract: a
     screen with no conversation has no message for its starters to sit under, and no scroll for them to
     outlive. The exception is the FILE, not the prop, so nothing else can claim it. */
  if (prefix === 'screens/') {
    const HOME_EXCEPTION = 'journey-b/home.jsx';
    const dir2 = dirname(p);
    const srcs2 = [...text.matchAll(/<script[^>]+type="text\/babel"[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    /* The src is matched on its RESOLVED path, not on the string the page wrote. Both `./home.jsx` and
       `../journey-b/home.jsx` are the same file, and an exception that reads the spelling is an exception
       any page can claim by spelling it differently. */
    const files = [[rel, rel, text]];
    for (const s of srcs2) { try { files.push([s, join(dir2, s), await readFile(join(dir2, s), 'utf8')]); } catch { /* reported above */ } }
    const seenFile = new Set();
    for (const [name, abs, src] of files) {
      if (seenFile.has(abs)) continue; seenFile.add(abs);
      for (const m of src.matchAll(/<Dock\b[\s\S]{0,600}?\/?>/g)) {
        const tag = m[0];
        /* `Dock.cta` was deleted on 20 Sep 2026 once the kits were redrawn, so passing it now does
           nothing at all — which is quieter, and worse, than the error this gate gives. It stays. */
        if (/\bcta=/.test(tag)) structure.push(`PINNED CTA — <Dock cta=…> in ${name}. The prop was deleted on 20 Sep 2026 and is silently ignored. A decision belongs under the thing it decides about (ruling, 18 Sep): use SentinelTurn cta.`);
        if (/\bchips=/.test(tag) && !abs.replace(/\\/g, '/').endsWith(HOME_EXCEPTION)) structure.push(`PINNED CHIPS — <Dock chips=…> in ${name}. Chips live in the turn that offered them and scroll with it (ruling, 18 Sep). Only ${HOME_EXCEPTION} may pin them, because Home has no conversation and no scroller.`);
      }
    }
  }
  const gutterMark = GUTTER.exec(text.slice(0, 900))?.[1] ?? '';
  const gutterMin = Number(ATTR(gutterMark, 'min') || 16);
  const fullBleed = ATTR(gutterMark, 'fullBleed') || '';
  const truncation = ATTR(gutterMark, 'truncation') || '';
  pages.push({ rel, name: rel.replace(/\.html$/, '').replace(/[/]/g, '__'), w: w || 1200, h: h || 1400, structure: [...structure, ...scope],
               gutter: prefix === 'screens/' || rel.startsWith('ui_kits/') || rel.startsWith('tools/'), gutterMin, fullBleed,
               truncationAllowed: truncation === 'allowed' });
 }
}
pages.sort((a, b) => a.rel.localeCompare(b.rel));

const server = spawn(process.execPath, [join(HERE, 'preview-server.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
const stop = () => { try { server.kill(); } catch {} };
process.on('exit', stop);
await new Promise((r) => setTimeout(r, 1200));

const require = createRequire(import.meta.url);
let chromium;
for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright/index.js']) {
  try { ({ chromium } = require(id)); break; } catch {}
}
if (!chromium) { console.error('playwright not found — npm i -D playwright && npx playwright install chromium'); stop(); process.exit(1); }

if (SHOTS) await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
const results = [];

for (const p of pages) {
  const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: p.w, height: p.h }, deviceScaleFactor: SHOTS ? 2 : 1 });
  const errors = [...p.structure], missing = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
  page.on('response', (r) => r.status() >= 400 && missing.push(`${r.status()} ${r.url()}`));
  /* Not networkidle: 00-Index prefetches every component page, so the network never goes quiet and a
     page that rendered in 300ms would be reported as a 45s timeout. Wait for the thing we actually
     care about instead — Babel compiling the inline JSX and React putting something in #root. */
  try {
    await page.goto(`http://localhost:${PORT}/${p.rel}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => (document.getElementById('root') || document.body).innerHTML.length > 200, null, { timeout: 20000 });
    await page.waitForTimeout(1200);
  } catch (e) { errors.push('DID NOT MOUNT ' + e.message.slice(0, 120)); }
  const mounted = await page.evaluate(() => (document.getElementById('root') || document.body).innerHTML.length).catch(() => 0);
  /* The gutter guard, on screens only: a spec page is a specimen board and has no screen edges. */
  let gutter = null;
  let tight = [];
  let bottomFlush = [];
  if (p.gutter) {
    gutter = await page.evaluate(`(${GUTTER_PROBE.toString()})(${p.gutterMin})`).catch(() => null);
    if (gutter && gutter.bad.length) for (const b of gutter.bad) errors.push(`GUTTER ${b}`);
    /* PADDED ON THREE SIDES (19 Sep 2026). The owner: "dono side se padding hai waise hi bottom me bhi
       de sakte hai" — a card whose last line sits flush against its bottom edge while its sides are
       padded. Two of them shipped: ArtifactCard's body ended in `14px 0` and relied on a footer that
       F-42 had just stopped rendering, and the Home row card did the same.
       MEASURED, not read: for every boxed element (a radius or a shadow) the space above its first
       child is compared with the space below its last child. A card is allowed to be tighter at the
       bottom by a hair — 2px covers a line box's descender — and anything past that is the defect. It
       is a WARNING, not a failure, because a deliberately bottom-anchored box exists (the dock) and a
       gate that fails those teaches people to silence it. */
    bottomFlush = await page.evaluate(() => {
      const bad = [];
      const px = (v) => Math.round(parseFloat(v) || 0);
      /* INK, NOT BOXES. Two rewrites got here. Box-to-box called a correct confirm sheet a defect,
         because its 20px sits inside the commit row; counting the child's padding then called a correct
         artifact card a defect, because its last child is a 44pt footer whose label is centred. What
         the owner is actually looking at is the last LINE OF TEXT and how far it sits from the edge.
         So the measure is the first and last text a person can see, against the container's own edges. */
      const inkRect = (root, last) => {
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) => {
            if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            const p = n.parentElement;
            if (!p || p.tagName === 'STYLE' || p.tagName === 'SCRIPT') return NodeFilter.FILTER_REJECT;
            const cs = getComputedStyle(p);
            if (cs.visibility === 'hidden' || cs.display === 'none' || px(cs.opacity * 100) === 0) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        let found = null;
        while (w.nextNode()) {
          const r = document.createRange(); r.selectNodeContents(w.currentNode);
          const b = r.getBoundingClientRect();
          if (b.height === 0) continue;
          found = b;
          if (!last) break;
        }
        return found;
      };
      for (const el of document.querySelectorAll('div,section,article')) {
        const r = el.getBoundingClientRect();
        if (r.width < 140 || r.height < 56) continue;
        /* NOT WHOLE PANELS. A drawer's ink starts 61px down because a status bar and an app bar are
           above it, which is structure and not a padding choice; measuring it reported a panel whose
           sides and bottom are in fact balanced at 16 and 17. Everything in this product is 375x812, so
           600 is the line: taller than that and it is a surface, not a card. `innerHeight` cannot be
           used — on a spec board the window is the BOARD, and an 812 panel inside a 1400 board passed. */
        if (r.height > 600) continue;
        const cs = getComputedStyle(el);
        const boxed = (cs.boxShadow !== 'none' || px(cs.borderTopLeftRadius) >= 12) && cs.backgroundColor !== 'rgba(0, 0, 0, 0)';
        /* overflow:hidden is a CLIPPING choice, not a scroller — ArtifactCard uses it so its radius cuts
           the content, and skipping it made this gate blind to the very card it was written for.
           Scrollers are caught by overflowY, which is the honest test. */
        if (!boxed || cs.overflowY === 'auto' || cs.overflowY === 'scroll') continue;
        /* THE RULE, AFTER FOUR REWRITES: NOTHING SITS WITHIN 8px OF A CARD'S BOTTOM EDGE.
           Everything cleverer over-reported. Top-vs-bottom flagged three correct cards, because a
           container whose first child is a graphic — a bar, an avatar — has no ink up there. Reading
           `paddingLeft` made it BLIND: on ArtifactCard the shadow and radius are on the outer card
           (padding 0) and the 14 is on an inner transparent div, so both were skipped, the gate went
           quiet across 94 pages and I nearly reported the product clean on it. Measuring the side inset
           from ink then counted a pill's own padding as the card's.
           A flat floor is the one thing that is unambiguous, and it is what the owner is actually
           asking for: a card is padded on four sides. The first ink must be 8 or more from the top —
           otherwise this is a flush-bleed layout, not a padded card, and the floor does not apply. */
        const a = inkRect(el, false), z = inkRect(el, true);
        if (!a || !z) continue;
        const top = Math.round(a.top - r.top);
        const bottom = Math.round(r.bottom - z.bottom);
        if (top >= 8 && bottom < 8) {
          const words = [...el.childNodes].map((n) => (n.nodeType === 3 ? n.nodeValue
            : (n.tagName === 'STYLE' || n.tagName === 'SCRIPT') ? '' : n.textContent)).join(' ');
          bad.push(`only ${bottom}px under the last line (top is ${top}) — ${words.trim().slice(0, 40).replace(/\s+/g, ' ')}`);
        }
      }
      return [...new Set(bad)].slice(0, 6);
    }).catch(() => []);

    /* TRUNCATION. A label that lost a third of itself to an ellipsis passed every check on 18 Sep until a
       human measured it. Any element inside a phone whose text is wider than its box is reported; it fails
       the page unless the page's @gutter marker says truncation="allowed" — the drawer's long-client-name
       state truncates on purpose, and says so. */
    const trunc = await page.evaluate(() => {
      const phones = [...document.querySelectorAll('div')].filter((d) => { const r = d.getBoundingClientRect(), cs = getComputedStyle(d); return Math.round(r.width) === 375 && Math.round(r.height) === 812 && cs.overflow.includes('hidden'); });
      const out = [];
      /* TIGHT, not yet truncated. CI renders on Linux, where this face measures wider than on macOS: a
         string with two pixels to spare here fails there, and run 64 is exactly that — 220px of text in a
         218px box that fitted locally. So anything inside 8px of its box is reported as a WARNING, with the
         real text width measured by a Range (scrollWidth is never less than clientWidth, so it cannot tell
         you how much room is left). It does not fail the page; it is the thing to fix before CI does. */
      const tight = [];
      for (const ph of phones) for (const el of ph.querySelectorAll('span,p,div,button')) {
        const cs = getComputedStyle(el);
        if (cs.textOverflow !== 'ellipsis' || el.clientWidth <= 40) continue;
        if (el.scrollWidth > el.clientWidth + 1) { out.push(`"${(el.textContent || '').trim().slice(0, 36)}" needs ${el.scrollWidth}px, has ${el.clientWidth}px`); continue; }
        const r = document.createRange(); r.selectNodeContents(el);
        const w = Math.ceil(r.getBoundingClientRect().width);
        const slack = el.clientWidth - w;
        if (slack >= 0 && slack < 8) tight.push(`"${(el.textContent || '').trim().slice(0, 36)}" has ${slack}px to spare (${w} in ${el.clientWidth})`);
      }
      window.__tight = [...new Set(tight)];
      return [...new Set(out)];
    }).catch(() => []);
    if (gutter) gutter.truncated = trunc.length;
    if (trunc.length && !p.truncationAllowed) for (const t of trunc) errors.push(`TRUNCATED ${t} — declare truncation="allowed" in @gutter if this is deliberate`);
    tight = await page.evaluate(() => window.__tight || []).catch(() => []);
    /* THE PAPERCLIP IS REAL EVERYWHERE, OR IT IS NOWHERE (19 Sep 2026, the owner: "attachment demo nei
       real hona chahiye har screen par"). Three screens passed `onAttach={() => {}}` — a picker that opens
       and drops the file on the floor. A control that is announced and does nothing is the defect class
       this repository keeps rediscovering (MessageActions' Edit, FileUpload's parse, the drawer's See all),
       so it is a gate now: every phone that carries a Composer must carry a real file input behind its
       attach button. The inert disc is still allowed — Composer renders it when no `onAttach` is given —
       but not on a screen, where the advisor can tap it. */
    const dead = await page.evaluate(() => {
      /* A PhoneFrame and its own inner flex column are BOTH 375x812, so a naive filter counts every phone
         twice — the first cut of this gate reported 8 phones on a page that has 4. Keep only the outermost. */
      const all = [...document.querySelectorAll('div')].filter((d) => { const r = d.getBoundingClientRect(); return Math.round(r.width) === 375 && Math.round(r.height) === 812; });
      const phones = all.filter((d) => !all.some((o) => o !== d && o.contains(d)));
      let n = 0;
      /* Composer marks its own disc: `live` when it has a real file input behind it, `inert` when it is the
         drawing the archive shipped. MoneyComposer draws no paperclip at all and is not a defect — the rule
         is "if the affordance is drawn on a screen it must work", not "every composer must take files". */
      for (const ph of phones) if (ph.querySelector('[data-attach="inert"]')) n += 1;
      return n;
    }).catch(() => 0);
    /* screens/ only. `ui_kits/` is the imported record — artboards of STATES, not screens an advisor taps,
       and the standing rule is not to edit them. A gate that fails the record for not behaving like the
       product would be a gate that gets switched off. */
    if (dead && p.rel.startsWith('screens/')) errors.push(`DEAD PAPERCLIP on ${dead} phone${dead === 1 ? '' : 's'} — a Composer on a screen must be given onAttach; a picker that drops the file is a drawing of a control`);
  }
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${p.name}.png`), fullPage: true }).catch(() => {});
  results.push({ ...p, errors, missing, mounted, gutter, tight, bottomFlush });
  await page.close();
}
await browser.close();
stop();

const bad = results.filter((r) => r.errors.length || r.missing.length || r.mounted < 200);
for (const r of results) {
  const flag = r.errors.length || r.missing.length ? 'FAIL' : r.mounted < 200 ? 'EMPTY' : 'ok';
  if (QUIET && flag === 'ok') continue;
  console.log(`${flag.padEnd(6)} ${r.rel.padEnd(44)} mounted=${String(r.mounted).padStart(7)}${r.gutter ? `  gutter>=${r.gutterMin} on ${r.gutter.phones} phone${r.gutter.phones === 1 ? '' : 's'}${r.gutter.anchored ? `, ${r.gutter.anchored} edge-anchored` : ''}${r.gutter.truncated ? `, ${r.gutter.truncated} truncated${r.truncationAllowed ? ' (allowed)' : ''}` : ''}` : ''}`);
  if (r.gutter && r.fullBleed) console.log(`         full-bleed by design: ${r.fullBleed}`);
  for (const e of [...r.errors, ...r.missing].slice(0, 4)) console.log(`         ↳ ${e}`);
  for (const t of (r.tight || []).slice(0, 3)) console.log(`         ⚠ TIGHT ${t} — CI's Linux metrics run wider; shorten it`);
  for (const t of (r.bottomFlush || []).slice(0, 3)) console.log(`         ⚠ BOTTOM-FLUSH ${t} — a card is padded on four sides`);
}
if (JSON_OUT) await writeFile(JSON_OUT, JSON.stringify(results, null, 1));

/* WHEN CI FAILS, SAY WHY WHERE IT CAN BE READ (19 Sep 2026). Run 63 failed on this step and the log is
   admin-only, so nobody without admin on the repository — including the agent that wrote the commit —
   could find out which page broke or how. GitHub's `::error::` lines become check-run annotations, and
   annotations ARE readable through the public API. So every failing page now names itself there.
   A gate whose failure cannot be read is a gate that gets ignored or, worse, guessed at. */
if (process.env.GITHUB_ACTIONS) {
  for (const r of bad) {
    const why = [...r.errors, ...r.missing].slice(0, 3).join(' · ') || `mounted only ${r.mounted} characters`;
    console.log(`::error file=${r.rel},title=${r.rel} did not render clean::${why.replace(/\n/g, ' ')}`);
  }
}

if (SELF_TEST) {
  const broken = results.find((r) => r.rel.includes('gutter-broken'));
  const ok = results.find((r) => r.rel.includes('gutter-ok'));
  const brokeCount = broken ? broken.errors.filter((e) => e.startsWith('GUTTER')).length : -1;
  const okCount = ok ? ok.errors.filter((e) => e.startsWith('GUTTER')).length : -1;
  console.log(`\nself-test · gutter-broken reported ${brokeCount} gutter error(s) — expected at least 1`);
  console.log(`self-test · gutter-ok     reported ${okCount} gutter error(s) — expected 0`);
  const pass = brokeCount >= 1 && okCount === 0;
  console.log(pass ? '\nself-test PASSED — the guard fails on the defect and passes on the fix.'
                   : '\nself-test FAILED — a guard that cannot fail is not a guard.');
  process.exit(pass ? 0 : 1);
}

console.log(`\n${results.length - bad.length}/${results.length} pages render clean.`);
process.exit(bad.length ? 1 : 0);
