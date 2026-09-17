# Findings

Craft and correctness debt found by looking at the system, not by reading about it. Every page was
rendered in a real browser at the viewport its own `@dsCard` marker declares
(`node tools/check-previews.mjs`); 44 of 47 render clean.

This file is for things that are **wrong**. Things that are *deliberately inconsistent* live in
`design-system/guidelines/contradictions.md`, which the system keeps about itself — check there first.

Nothing here proposes a visual change. Fixing these makes the system do what it already says it does.

---

## P0 — the page is dead

### F-1 · `pages/StepTrace.html` does not run — *fixed*
A template placeholder was never interpolated, so the file ships the literal characters `${req}`:

```jsx
<PageShell name="StepTrace" group="Chat" status="shipped" requires={${req}}
```

Babel throws `Unexpected token, expected "}"` at 25:71, nothing mounts, and the page is blank. The
component itself is fine — only its spec page is broken.

**Fix.** Replace `${req}` with the array the page's own destructure already names, matching every
other page (`requires={['Pill','Badge',…]}`).

### F-2 · `pages/VersionRow.html` does not run — *fixed*
Identical cause at 14:72. Same fix. Both pages now render; `check-previews` went 44/47 → 46/47.

> Both are listed `shipped` in `pages/_index.json`, because the generator checks that
> `pages/<Name>.html` **exists** — not that it runs. Worth closing that gap too: `npm run check`
> now renders every page, so CI catches this class of failure from here on.

## P1 — invalid markup, real accessibility cost

### F-3 · `ArtifactCard` puts a `<button>` around anything you give it — *fixed*
First recorded against `DownloadAction`, which is where React reports it. That was the wrong address.
The full stack reads bottom-up:

```
validateDOMNesting(...): <button> cannot appear as a descendant of <button>
  at Pill → at DownloadAction → at div → at div → at Pressable
```

`DownloadAction` is four lines and renders a single `Pill`; it nests nothing. The wrapper is
`ArtifactCard`, which in its `peek` state wraps the **whole body — eyebrow, title, `children` and
provenance — in a `Pressable`** so that tapping anywhere expands the card:

```jsx
{expanded
  ? <div style={{ padding: '2px 14px 0' }}>{body}</div>
  : <Pressable onClick={toggle} style={{ display: 'block', width: '100%', … }}>{body}</Pressable>}
```

So it is not one page's mistake. **Any interactive child of a peeking `ArtifactCard` is a button inside
a button** — a Pill, a DownloadAction, an InfoDot, a chart with a tappable point. Browsers recover by
unnesting, so the rendered DOM is not the one the component describes; assistive technology announces a
control inside a control; and the inner control's ≥44pt extension lands inside another target instead
of beside it.

It also duplicates an affordance the card already has: the footer carries an explicit `Expand ▾`
`Pressable` wired to the same `toggle`.

**This one needs a decision, not a patch** — it is about how a peeking card behaves, which is product,
not craft:

- **(a) The body stops being a button.** `peek` renders `body` in a plain `div`; expanding happens
  through the footer `Expand ▾` that already exists, and through the title row if it should stay
  tappable. Correct markup, smaller tap target.
- **(b) Peek holds no interactive children.** Keep tap-anywhere, and say in the contract that `children`
  in `peek` are a preview — sparkline, stat row, three table rows — never controls. That matches what
  the component's own header already says (*"PEEK IS 96px, FIXED — recognition, not reading"*), and
  makes `pages/DownloadAction.html` block 5 the thing that needs changing, not the card.

**Fixed as neither, because a third answer keeps both halves.** The press target is now a *sibling
behind* the content rather than an ancestor of it: an absolutely positioned `Pressable` fills the peek
area, the content sits above it with `pointer-events: none`, and the `children` slot alone turns pointer
events back on. So the card's own chrome — eyebrow, title, provenance — passes its clicks through and
expands the card, while a control in the preview acts as itself. Tap-anywhere survives, the markup is
valid, and the contract does not have to forbid anything.

The overlay is `aria-hidden` and `tabIndex={-1}`: the footer's `Expand ▾` is the same action and is the
keyboard path, and two tab stops for one action is noise.

## P2 — the system misreports itself

### F-4 · `scripts/build-index.js` reports three built components as unbuilt — *fixed, but see F-8*
Its `SPECIFIED` backlog constant still lists `FileUpload`, `DownloadAction` and `InfoCard`, all three
of which now exist on disk with sources, contracts and pages. Regenerating the index today produces
**88 rows with 6 specified** — the three real gaps plus three phantoms, each component appearing
twice, once as `shipped` and once as `specified`.

The committed `pages/_index.json` is correct (85 rows, 3 specified), so it was corrected by hand or by
a later version of the script. Either way the generator and its output currently disagree, and the
generator is the one that gets run next.

Its own header states the invariant it is built to keep:

> the index is generated from what is on disk … so it cannot tell us a component is there when it
> isn't

The converse fails: it tells us a component is *not* there when it is.

**Fix.** Skip a `SPECIFIED` row whose name already produced a row from disk. One condition, and the
backlog list can then be left alone as components land.

**Fixed** — built wins over specified, so the backlog constant needs no editing as components arrive.
With it, the generator produces 85 rows and 3 specified, matching the committed index exactly.

**But the regenerated file is still not committed**, because running the generator today would lose a
column. See F-8.

### F-6 · `Pill` ships a `<style>` element inside its `<button>`, once per instance — *fixed*
`Pill` renders its ≥44pt hit-area rule as a `<style>` child of the button it draws:

```jsx
<button className="ds-pill" …>
  <style>{'.ds-pill::before{content:"";position:absolute;…}'}</style>
```

`Pressable` had exactly this and fixed it, and its header says why in the system's own words:

> a `<style>` child of `<button>` is an invalid content model and duplicated once per instance
> (53 copies on the RangePills page). They are global and identical for every instance, so the
> stylesheet is where they belong.

The rule is global and identical for every Pill too, and `pages/RangePills.html` alone draws dozens.

**Fixed.** `.ds-pill::before` now sits in `tokens/effects.css` beside `.ds-pressable[data-hit]::before`.
`Pill` still sets `--hit` inline, so each instance still extends by its own amount.

### F-7 · The fund chart did not line up with its own card — *fixed*
Reported from the product side: on `InfoCard` the line chart and its value did not sit on the card's
edges, and the value took its own column instead of sitting on the chart.

Three separate causes, all in `ChartLine`:

**a · A reserved gutter made the plot narrower than everything around it.** `padR` (34 at peek, 62
expanded) was subtracted from the drawing width and applied as `paddingRight` to both the plot and the
axis band, so the line, the baseline and the x labels all stopped 62px short of the card's right edge —
while the title, the range pills and the stat tiles ran the full width. Two stray edges in one card, and
the chart read as something pasted in rather than part of it.

The plot now runs the full width. The end label sits **on** the plot at the line's end, which is what
the code comment above it always claimed: *"End labels sit AT the end of each line, inside the plot
box"*. Which side of the endpoint it takes is read from the line itself — a line arriving from below
leaves the space above its end empty, so the label goes there and never lies across the stroke it
labels.

**b · The chart printed a raw float.** The default formatter was `` (v) => `${v}%` ``, so a computed
series rendered **`14.60000000000000075%`** on the card. Every figure in this product carries one
decimal — 18.4%, 12.1%, −14.2% — and an advisor cannot read seventeen of them to a client. The default
is now one decimal, and `InfoCard` no longer overrides it with the raw one.

**c · The x-axis label count was set by the y axis.** The expanded branch mapped over
`ticks(d0, d1, 2)` — the *y* domain's ticks — to decide how many *x* labels to draw. When that returned
a single tick the trailing label silently disappeared, which is why the fund card's chart started at 1
and ended nowhere. It now draws first-x and last-x directly, the way the peek branch beside it already
did.

### F-8 · `scripts/build-index.js` is older than the index it produced
The committed `pages/_index.json` carries a **`literals`** key on every row. The generator in
`scripts/` never writes one — it emits `tokens` and `locals` only. So the file in the repo was produced
by a later version of the script than the one that shipped with the bundle.

Running the generator today therefore *removes* a column: same 85 rows, same names, same statuses, but
every row loses its `literals` list. That is a silent data loss dressed as a regeneration, which is why
`npm run build:index` is not part of `npm run check` and the regenerated file is not committed.

**Fix.** Recover the literals scan. It is almost certainly the same shape as the token scan already in
the file — collect the raw hex, px and font-family literals a component still contains, which is exactly
what `_adherence.oxlintrc.json` forbids — so the index can report adherence per component. Until then,
treat `pages/_index.json` as hand-maintained and do not regenerate it.

---

## Resolved

### F-5 · The public entry point did not exist — *fixed*
`_adherence.oxlintrc.json` warns on every import reaching into `components/` with the message
*"Import design-system components from 'index.js', not component internals"*, and exempts `**/index.js`
from its own rule. No `index.js` was ever shipped, so the entry point the rule names did not exist and
there was no non-warning way to consume the system.

Generated now by `tools/build-barrel.mjs` from what is on disk: 83 modules, 103 exports.

---

## Structural constraints — not bugs, but they shape the work

### C-1 · The preview pages cannot see a source change — *resolved*
The pages do not import `components/`. They load `_ds_bundle.js`, which publishes everything onto
`window.SentinelDesignSystem_0682a2`. That bundle is compiled by Claude Design, not by this repository.
`page-kit.jsx` says so itself when a component is missing:

> The bundle recompiles from source at the end of a turn — reload then. The page is not broken; the
> build is behind it.

`tools/build-bundle.mjs` now builds it here. Same namespace, same single global, React resolved to the
one the page already loaded. Its output renders `ui_kits/sentinel-app` to a **byte-identical
screenshot** against the imported bundle, and all 47 pages behave the same, so it is a drop-in.

The constraint that remains is a habit, not a blocker: **run `npm run build:bundle` after a component
change or you are looking at the previous build.** CI fails when the committed bundle is stale.

### C-2 · The icon set has two origins
Six glyphs from the product's Figma source (grids of 17.33 / 18 / 15 / 12.37 / 13.33 / 12.58, strokes
1.33–1.5) and four from Lucide (24px grid, stroke 1.5, rendered at 20). Normalised, the source six read
1.8–2.0px against Lucide's 1.5 — visibly heavier beside a 1px hairline.

Already logged by the system as contradiction 38, with the reasoning: redrawing the six would change
every screen in the product, so the debt was taken deliberately and scheduled for the next visual
refresh. Recorded here only so it is not rediscovered as new.
