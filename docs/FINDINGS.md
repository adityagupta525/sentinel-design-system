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

### F-8 · `scripts/build-index.js` is older than the index it produced — *resolved by re-derivation*
The committed `pages/_index.json` carries a **`literals`** key on every row. The generator in
`scripts/` never writes one — it emits `tokens` and `locals` only. So the file in the repo was produced
by a later version of the script than the one that shipped with the bundle.

Running the generator today therefore *removes* a column: same 85 rows, same names, same statuses, but
every row loses its `literals` list. That is a silent data loss dressed as a regeneration, which is why
`npm run build:index` is not part of `npm run check` and the regenerated file is not committed.

**Not recovered — re-derived, and the difference matters.** The original rule is not written down
anywhere. Five reconstructions were tested against the committed numbers; the closest matched **13 of
82 rows**, so guessing was abandoned rather than dressed up.

The column is now defined in the script, in words a reader can check: *how many raw style values a
component still hardcodes instead of taking from a token* — a bare number handed to a style prop, plus
raw hex, raw px and raw `font-family`. That is the per-component version of what
`_adherence.oxlintrc.json` forbids project-wide. SVG path data, `viewBox` and shape attributes are
excluded, because drawing geometry is artwork rather than a style decision; `0` and `1` are excluded as
identity values.

The definition validates on the one case that has an obvious right answer: **every `Icon*` component
now reads 0**, which is what an icon that draws itself correctly should read.

Counts differ from the file this replaces. That is intended, and `npm run build:index` is back in
`npm run check` and in CI.

First reading: **28 of 82 components are fully token-clean.** The most hardcoded are `ArtifactCard` 21,
`List` 15, `StatusSpacer` 14, `ProgressTrace` 13, `ClientChip` 13, `Pill` 13.

### F-9 · The 11.5px debt was not paid, it spread — and it is no longer alone
First output of the `sentinel-craft` scale pass: 11 distinct off-token values across 32 uses in 82
components. Most are correct and are listed under *Considered and rejected* below. Two are not.

`guidelines/contradictions.md` line 22 already logs this one:

> | 22 | One-off value | Home jump rows, Drawer, FundExplorer, Offer | `11.5px` font size — only
> non-integer size in the system |

Both halves of that row are now out of date.

**It moved.** None of the four surfaces it names still carry it. Today `fontSize: 11.5` sits in
`chat/MessageActions.jsx:13`, `data/ChartLegend.jsx:18`, `data/ChartLegend.jsx:19`,
`data/ChartLine.jsx:102`, `data/ChartLine.jsx:139`, `forms/SearchField.jsx:15`,
`lists/ListRow.jsx:37` and `lists/ListRow.jsx:49` — eight uses across five components, and the chart
family, which was built after the contradiction was logged, inherited it. `readme.md:231` even
specifies it for the legend: *"optional value right-aligned in `--color-muted`, 11.5px"*.

**It is not the only one.** `data/ChartLine.jsx:103` renders the series name under the end label at
`fontSize: 10.5`, a second non-integer size.

**The two documents disagree, and that is the root cause.** `readme.md:44` lists the sizes as
*"10, 11, 11.5, 12, 13, 14, 15, 16, 18"* — 11.5 among them, legitimate. `contradictions.md` 22 calls it
a one-off to remove. `tokens/typography.css` publishes neither 11.5 nor 10.5, so every use hardcodes a
number, which is exactly what the ramp's own header forbids: *"a component now asks for a role instead
of a number."*

**This needs a ruling, not a patch.** Either 11.5 is a real step and the token layer publishes
`--text-11-5` with a role, and 10.5 is snapped to it or to `--text-10`; or it is debt and the eight
uses move to `--text-11` or `--text-12`. The second changes how five components look, so it is a
decision, not a fix. Until then nothing here is *wrong* — it is undocumented in the one place a
component reads.

### F-10 · Two dimensions the vocabulary does not carry — *fixed*
`spacing.css` publishes a named height for every box in the product — 32 filter chip, 36 chip, 42 icon
button, 44 touch floor, 46/52/56 rows, 48 CTA. Two boxes are outside it:

- `actions/ClientChip.jsx:9` — `height: 28`
- `chat/ResponseFeedback.jsx:32,36` — `width: 28, height: 28`

and one inset is off all three spacing tiers:

- `cards/DataTableCard.jsx:20,25` — `padding: '9px 0'`

**`--h-chip-sm: 28px` published**, and both components ask for it. No visual change. The target is
still 44: `ClientChip`'s own header says so, and both thumbs sit inside `Pressable`. Verified, not
assumed.

**The `9px` inset was worse than it looked, and only measuring showed it.** The guess was that 9
produced a named row height. Rendered, `DataTableCard` rows measured **57–58px** — outside the row
vocabulary entirely (42 / 46 / 52 / 56) and off every spacing tier, so nothing in the system said how
tall a table row is. At `--space-8` they land on **56 = `--h-row-md`**, the height `ListRow` already
uses for a one-line row, and the inset joins the scale. Two pixels per row, and two values that were
outside the system are now inside it.

> One row still measures 55 against its siblings' 56. That is content-driven, not the padding, and it
> is left recorded rather than chased.

### F-11 · `StickyCTA` is dead, superseded, and still public — *deprecated, not deleted*
Found by measuring where every component is actually rendered rather than by reading the list: 61 of
85 appear on a group board, 19 on a spec page, 2 only inside a UI kit, and three nowhere at all.

Two of the three are fine. `IconInfo` is internal to `InfoDot` and `MotionGuard` is internal to
`Pressable`; neither is a component a designer browses for.

`StickyCTA` is the third, and it is dead. Nothing imports it, nothing renders it, and its own header
has said so since v3:

> C17 · sticky primary CTA wrapper. **In v3+ the Dock's cta slot replaces this.**

It nevertheless ships in the barrel and in the bundle, so a team handed this library can find it and
use it — and what they would get is a wrapper that predates the dock law, with no chips row above and
no composer below, which is the layout rule 3 exists to prevent.

**Deprecated in both the source and the contract, not deleted.** Removing an export is an API break,
and it should be a decision someone takes on purpose rather than something that vanishes under a
consuming team. The `.d.ts` now carries `@deprecated` with the one-line replacement.

**Open question for the owner:** delete it before the dev handover, or keep it deprecated for a
release? Nothing depends on it either way.

### F-12 · The screen transition was specified for twelve versions and never named — *fixed*
`readme.md` has carried the same sentence since v1:

> Screens slide 100% in / −30% out at 320ms

`--dur-screen` existed and was used — by a chevron rotation, a rail, and four cards' entrance rise.
The transition the duration is *named after* had no keyframe anywhere in `tokens/`. The only
implementation in the repository was `kit-slide`, defined privately inside
`ui_kits/sentinel-app/index.html`, covering the incoming screen only; the −30% outgoing parallax was
never built at all.

So a team assembling a journey on this system had a documented transition, a token for its duration,
and nothing to reach for — which is how a screen ends up with an invented one.

**`ds-screen-in` and `ds-screen-out` now live in `tokens/effects.css`** with the documented values and
their reduced-motion redefinitions: `in` drops to a fade, `out` holds in place and lets the incoming
screen fade over it, so nothing is stranded at −30%. `guidelines/motion-screens.html` runs both live.

The app kit's private `kit-slide` was left alone: it renders three shipped prototypes and its values
are identical. Replacing it buys nothing and risks the one thing that must not break.

### F-13 · `guidelines/motion.html` advertised a duration deleted two versions earlier — *fixed*
The motion specimen listed **canvas · 380ms · scale .96 → 1, origin 40%**. The canvas was removed from
the product in v5 (contradiction 40) and `--dur-canvas` deleted in v11 for exactly that reason. The
guideline page went on selling it — and it is the page a developer reads *instead of* the 43 KB spec,
which makes a stale row here more expensive than a stale paragraph there.

Replaced with the treatment that actually superseded it — `artifact · 300ms · height to natural, in
place` — with a note recording what stood there and why it went, rather than a silent edit.

**This is the shared-element answer.** There is no smart-animate in this system: an artifact grows
where it sits and the thread keeps its scroll position. Named now so a screen team does not build one.

### F-14 · Both composers shipped the same one-line stylesheet inside themselves — *fixed*
`Composer` and `MoneyComposer` each rendered `<style>{'.ds-composer-input::placeholder{…}'}</style>`
as a child. Same class, same declaration, one copy per mounted instance — the same defect as F-6, in
two more places, and it survived F-6 because F-6 was fixed by reading `Pill`, not by searching for the
pattern. Moved to `tokens/effects.css` beside `.ds-pill::before`.

Unlike F-6 this one was never invalid markup — a `<style>` inside a `<div>` is legal — so it cost
duplication and nothing else. Recorded because the *search* is the lesson: a defect found by reading
one component should end with a grep for its shape.

---

## Considered and rejected

From the same pass. Each was measured, looked at, and deliberately left alone.

| Location | Candidate | Rejected because |
| --- | --- | --- |
| `cards/ArtifactCard.jsx:35,36,76,77` | `96` is off every spacing tier | It is the documented peek height. The component's own header: *"PEEK IS 96px, FIXED — recognition, not reading"*, with the reasoning for why a taller card would eat the thread |
| `chat/StepTrace.jsx:50`, `chat/ProgressTrace.jsx:33` | `left: 9` is off-scale | Optical alignment: it centres a 1px spine under a node. An offset that centres is not spacing, and rounding it would visibly misalign the trace |
| `shell/ScreenBackdrop.jsx:7,8` | `320`, `93`, `105`, `120` | Radii and offsets of the two soft auras. Decorative geometry, not a spacing relationship; the values are the gradient |
| `shell/HomeIndicator.jsx:5` | `134` | The iOS home indicator bar is 134pt wide. A platform constant, not ours to round |
| `shell/StatusSpacer.jsx:10` | `1.5`, `11`, `22` | Interior geometry of a 16×12 battery glyph drawn at sub-pixel precision. Icon drawing, not layout |
| `tokens/spacing.css` | Flatten `--space-2/3/5/13/14` onto 8pt | The file names them exceptions with stated uses — a 2px rail, a 13px pill inset, 14px card padding. Flattening restyles every card and every chip |
| `actions/Pressable.jsx` | Press at `scale(0.96)`, per common guidance | `--press-scale` is 0.98, `--press-scale-icon` 0.94, set in the token layer and documented in `readme.md` |

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
