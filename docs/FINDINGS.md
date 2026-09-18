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

### F-11 · `StickyCTA` is dead, superseded, and still public — *deleted 18 Sep 2026*
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

~~**Open question for the owner:** delete it before the dev handover, or keep it deprecated for a
release?~~ **Deleted, on the owner's ruling.** The argument for keeping it — an API break under a
consuming team — did not survive a look at `package.json`: `"private": true`, never published, so there
is no consuming team, and nothing inside this repository imported it (0 references in components, kits,
pages or specs). The deprecation step still earned its place: it made the removal a decision with a
name on it instead of a file that vanished. Gone with it: the `.jsx`, `.d.ts` and `.prompt.md`, its
adherence rule and `replaces` entry in `_adherence.oxlintrc.json`, its manifest row, and its name from
the eight group boards' destructures. Barrel, bundle and index regenerated: **84 components**, 41
shipped / 43 building, 108 → 107 exports. Breaking entry in `CHANGELOG.md`; the replacement is one line
in `HANDOVER.md` → Removed.

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

### F-15 · `SentinelThinking.prompt.md` described motion the component does not have — *fixed*
The prompt file, which is what an agent building a screen reads:

> the short (≈620ms) wait state: shimmering sparkle label + three 6px bronze dots **bouncing 3px**

The component pulses opacity over 1200ms and has never bounced. `readme.md` states the reasoning in
the opposite direction — *"no bounce, because a 6px dot hopping beside text reads as jitter"* — so the
prompt file was not merely stale, it instructed the exact thing the spec rejects, at half the duration.

Rewritten from the source. Found while adding `verb`; the lesson is the same as F-14 — the `.prompt.md`
files are a third contract surface beside the `.d.ts` and the spec, and nothing checks them.

### F-16 · The wait state could not say what it was waiting on — *new capability, opt-in*
Not a defect. `SentinelThinking` rendered three pulsing dots under the label "Sentinel", which says
"wait" and nothing else. Six of six AI assistants surveyed pair the wait with a named verb; none ships
a bare pulse.

`SentinelThinking` now takes **`verb`**, which replaces the label — "Reading his Q3 statement…". The
motion is byte-identical with it and without it, and omitting it gives exactly the previous render, so
every existing call site is unchanged. `SentinelBlock` already had the `label` prop; nothing new was
invented to carry it.

The constraint is in the contract, not the style guide: **the verb must be true and checkable**,
because it names the source the answer will cite. A wait that says "Reading his Q3 statement…" and
then produces a figure from somewhere else has broken rule 4 before the figure arrives. There is no
rotating list of verbs, and no "Thinking…".

### F-17 · `MoneyComposer` had no focus indicator at all — *fixed*
Found while writing its spec page, and confirmed by focusing the field in a real browser and looking
at it rather than by reading the source: **nothing changed.** The input carries `outline: none`
inline, the card had no focus state, and the two together leave a keyboard user tabbing into the
amount field looking at the card they were already looking at. WCAG 2.4.7, failed outright.

`Composer` — the same slot in the same dock — has had the treatment since v1: bronze hairline plus
`--focus-ring`, transitioned over `--dur-press`. `MoneyComposer` now takes it, same tokens, same
duration, nothing new invented.

**Carried on the box-shadow, not a border.** `Composer` paints its hairline with a real
`1px solid` border; this card has always painted its with a box-shadow. Copying `Composer`'s border
would have made the card 2pt taller and its field 2pt narrower — a layout change, in a component
whose whole argument is that the ₹ sits in a fixed slot — as the price of a focus ring. The shadow
form renders identically and moves nothing.

### F-18 · A pasted scheme code escaped the bubble — *fixed*
Found by putting one in a `UserBubble` on its new spec page and looking at the render: an unbroken
identifier — no hyphen, no space — does not wrap. It runs past the 280pt cap and out of the bubble's
own peach background, with the tail of the token sitting on the canvas.

A hyphenated code (`HDFC-LIQUID-DIRECT-GROWTH-INF179K01WK5`) wraps on its own, which is why this went
unseen: the realistic-looking example is the one that works. An ISIN pasted alone is the one that does
not, and an advisor pastes ISINs.

`overflowWrap: 'anywhere'` on `UserBubble`'s paragraph and on `QAPair`'s answer, which is the same
bubble one step down. Prose never reaches the rule — it breaks at spaces long before — so nothing else
in the thread renders differently. `QAPair`'s question needed nothing: it is already one ellipsised
line.

Both the before and the after are on `pages/UserBubble.html`, block 4, as a state rather than a note.

### F-19 · Two thirds of the allocation palette was never defined — *fixed*
`AllocationCard`'s contract has said the same thing since v1:

> Use `var(--color-alloc-equity)` / `-debt` / `-cash` — never a new hue.

Only `--color-alloc-debt` exists in `tokens/colors.css`. So `components/cards/cards.card.html`, which
passes exactly the three tokens the contract names, has been rendering its stacked bar with **the
Equity and Cash segments invisible** — a card whose entire job is allocation showing only the debt
band, 24% of a bar, on a group board in the handover.

Seen, not reasoned about: it is in the rendered board, first card, top left. The running app never hit
it because `ui_kits/sentinel-app/data.jsx` passes `--color-bronze` and `--color-bubble-edge` by hand
instead of the tokens its own contract names — which is also why nobody noticed.

`--color-alloc-track` is the same defect one page over: `guidelines/motion.html` paints its bar rail
with it, and the rail has simply not been there.

**Aliased, not invented.** `--color-alloc-equity: var(--color-bronze)`,
`--color-alloc-cash: var(--color-bubble-edge)`, `--color-alloc-track: var(--color-track)` — the values
the app already used. Nothing that rendered correctly before renders differently now; the things that
were invisible are visible. Still one hue in three depths, and every band is named and printed as a
percentage above the bar, so rule 1 is untouched.

### F-20 · A token written for a component, which that component never used — *fixed*
`spacing.css` carries `--h-row: 42px` with the comment *"SuggestionRow, AllocationCard rows"*.
`AllocationCard` set `height: 42`. The token was written **for** this component and this component
hardcoded the number beside it.

Same pixel, one fewer raw value. Found while checking a claim on the new spec page — the page first
said "there is no --h-row token at 42", which was wrong, and checking it turned up the real defect.

### F-21 · The tallest row in the product has no name — *fixed 18 Sep 2026*
`spacing.css` claims to publish a named height for every box, and F-10 closed the two it had missed by
enumerating the row vocabulary as **42 / 46 / 52 / 56**. That enumeration is incomplete.
`ListRow` is **72px** whenever a subtitle is present — the height of every client row, every thread row
in the drawer, every fund row in a picker. It is the most common row in the product and the only one
with no token:

```
lists/ListRow.jsx:24   const h = (size || (subtitle ? 'lg' : 'md')) === 'lg' ? 72 : 56;
```

There is a second, sharper problem in the same line. `--h-row-lg` already exists and is **46px**.
`ListRow`'s `size='lg'` is 72. Two different things in this system are called a large row, and they
differ by 26 pixels.

Not fixed here, because both candidate fixes change something that is not a gap:

- Publishing `--h-row-2l: 72px` adds a fifth row height and leaves `--h-row-lg` meaning 46 while
  `size='lg'` means 72 — the collision survives.
- Renaming the token is an API break for anything already consuming `--h-row-lg`.

**Recommendation:** publish `--h-row-2l: 72px`, point `ListRow` at it, and record the `lg` collision in
`contradictions.md` rather than renaming. That closes the literal without breaking a consumer, and the
naming clash becomes logged debt instead of a trap. Nothing renders differently either way — this is
about whether the system can describe itself.

**Fixed as recommended, with one correction to the reasoning above.** The owner ruled: publish
`--h-row-2l: 72px`, point `ListRow` at it, log the `lg` collision (contradiction 57) — and do not rename.
But the reason not to rename is **not** an external consumer: `package.json` says `"private": true`, the
package has never been published, and there is no one outside this repository to break. The real reason
is F-24's pattern one more time: `--h-row-lg` (46) and `--h-row-xl` (52) had **no consumers in the
components at all** — their actual consumers were three raw `46`s (Jump-back-in rows in `journey-b`
and `sentinel-app/home`, every row in `sentinel-app/drawer`) and two raw `52`s (`ComplianceCard` and
the cost-comparison rows in `journey-b`) sitting in `ui_kits`. All five now read their token, in this
commit, so the two tokens finally have the consumers their comments name. `--h-row-xl`'s comment gained
"figure-comparison rows", because the cost rows are neither holdings nor compliance and the comment
should not pretend otherwise. `ListRow`'s `56` went to `--h-row-md` in the same expression, which is
what F-24 was waiting for.

**Proven a no-op, not asserted.** All 73 pages were screenshotted before and after and compared by
hash: 62 byte-identical; `pages/ListRow` and `00-Index` differ by intent (the page's own text about
F-21, and the index's token column); the other nine were pixel-diffed. Seven of the nine
(`cards`, `chat` and `iconography` boards, `HeroNumberCard`, `ProgressTrace`, `StepTrace`, `journey-b`)
also differ between **two renders of the unchanged tree**, so they are animation phase, not layout;
with each one's animation bounding box masked, `journey-b`, `cards` and `chat` are identical
before→after. The remaining four (`List`, `SentinelBlock`, `SentinelThinking`, `motion`) were cropped
and looked at: a skeleton shimmer and the thinking dots at a different point in their 1.2s pulse.
`sentinel-app` and the `lists` board were byte-identical outright. Then measured rather than inferred,
because the drawer is closed in every screenshot: with the app kit's drawer opened in Playwright, all
16 rows bound to `--h-row-lg` render at 46px; the 4 home rows at 46; `pages/ListRow`'s 13 `--h-row-2l`
rows at 72. `journey-b`'s `--h-row-xl` rows measure 52 and 68 — the 68s are `ComplianceCard` rows
whose `minHeight` is 52 and whose two-line content is taller, as before.

### F-22 · A frozen trace could not be finished, and a finished one printed its clock twice — *fixed*
Two defects in `ProgressTrace`, one hiding the other, both found by building its spec page and looking
at what the page actually rendered rather than at what the props suggested.

**`autoplay={false}` could not reach the done state.** `done` was only ever set by the autoplay timer,
so a frozen trace — the form used in every specimen and artboard — showed `Working · 4s` with every
circle already filled, and could never render `reasoning`, which only appears once done. The most
useful state to put in front of a reviewer was the one state the component could not hold still.

Fixed without a new prop: a trace frozen **past** its last step (`initialActive >= steps.length`) is a
finished trace. Every existing frozen call site passes `initialActive={1}` against three or four steps,
so nothing that renders today changes.

**Then the header read `Thought for 4s · 4s`.** The template was
`` {done ? `Thought for ${secs}s` : 'Working'} · {secs}s `` — the seconds are inside the done string
*and* appended after it. This was never specimen-only: in the product the collapsed trace reads
`Thought for 4s`, and the moment an advisor taps it open, the expanded header says it twice.

It survived because the expanded-done state is only reachable by finishing a run and then reopening it,
which no page rendered and no reviewer waited for.

### F-23 · Five spec pages shipped a duplicated `<body>` and rendered blank once published — *fixed*
`pages/MoneyComposer.html`, `SentinelThinking.html`, `UserBubble.html`, `QAPair.html` and
`SentinelText.html` each carried the document head's `<body><div id="root">` **twice**, with the
page-kit script loaded twice after it. The five were assembled by splicing a head fragment taken from
an existing page, and the fragment was cut one line too long.

`check-previews` passed all five. Chrome here parsed the second `<body>` away, kept both `#root`
divs, rendered into the first, and reported `mounted=51468`. The published copies came up **blank**.

That is the whole lesson: **a clean render is not evidence the document is well formed.** The harness
asks "did something appear", and something did.

Fixed in the five pages, and guarded so the class cannot return: `check-previews` now counts `<body>`,
`id="root"` and `page-kit.jsx` statically before the browser is started. Verified against a fixture
carrying the exact duplication, which it fails.

The guard's own first run failed all 17 guideline pages — they render straight into `<body>` and have
no `#root` at all, and the rule asked for exactly one rather than at most one. Recorded because it is
the same mistake one level up: a check written from what the five broken pages looked like rather than
from what every page in the system looks like.

### F-24 · Four tokens written FOR a component, which that component then ignored — *fixed*
F-20 found `AllocationCard` hardcoding `42` beside `--h-row: 42px`, whose own comment names
`AllocationCard`. That looked like one slip. It is a pattern, and a scan of every token whose comment
names a component found three more:

| Token | Its own comment | The component |
|---|---|---|
| `--display-24` | *"MoveCard numeral"* | `MoveCard` set `font-display / weight-medium / 24 / 1` by hand |
| `--display-40` | *"AttributionChart total"* | `AttributionChart` did the same at 40 |
| `--h-row` | *"SuggestionRow, AllocationCard rows"* | `SuggestionRow` set `height: 42` |
| `--h-topbar` | — (44px) | `TopBar` set `height: 44` |

Each has an in-system precedent doing it right: `HeroNumberCard` takes `--type-display-font`,
`GreetingDivider` takes `--type-greeting-font`, `InfoCard` and `StatTile` take `--type-figure-font`.
The two display cases are not even about the size — the whole four-property block is already a **type
role**, so the fix is `font: var(--type-figure-font)` rather than swapping one number for one token.

**Proven a no-op, not assumed.** The four boards that render these components — `cards.card.html`,
`data.card.html`, `actions.card.html`, `shell.card.html` — plus `ui_kits/sentinel-app` were screenshotted
before and after and compared by hash. **All five byte-identical.**

Two cases were left alone on purpose:

- `Pressable` hardcodes `44` inside `Math.max(0, (44 - box.height) / 2)`. That is JavaScript
  arithmetic on a measured box, not a style value; reading `--h-touch` out of the computed style to
  feed it would cost a layout read per instance to remove one literal.
- `ListRow` hardcodes `56` beside `--h-row-md: 56px`, but in the same expression as the `72` that has
  no token at all. Substituting one and not the other would make the line read as though 72 were the
  deliberate exception. It waited on **F-21**, which closed it.

### F-25 · The bottom sheet was not a dialog, and a keyboard could barely leave it — *fixed*
Measured in a browser while writing the spec page, because none of it is visible:

| | Before |
|---|---|
| `role` on the sheet | `null` — an anonymous `<div>` |
| `aria-modal`, `aria-label` | `null`, `null` |
| Focus when it opens | stays on the control that opened it, **outside the scrim** |
| Escape | does nothing — sheet count 7 before, 7 after |
| The scrim | a `<div onClick>`, so not a keyboard exit either |

The only way out with a keyboard was to Tab forward until "Got it" came round. It survived twelve
versions because every one of those facts is invisible in a screenshot.

Now: `role="dialog"`, `aria-modal="true"`, `aria-label={title}`, Escape closes, focus moves into the
sheet on open and **returns to whatever opened it** on close — all four verified in the browser after
the change, including the focus restore.

Two details that were decisions rather than defaults:

- Focus moves on the `false → true` **transition** only, never on mounting already-open. The spec page
  renders six open specimens; each grabbing focus on mount would fight the others and scroll the page.
- **No `outline: none` on the dialog root.** A programmatic `.focus()` on `tabIndex={-1}` does not
  satisfy `:focus-visible`, so no ring is painted anyway — verified rendered — and switching the
  browser's indicator off with nothing in its place is the exact mistake `Pressable` was corrected for
  in v11.

~~**Open:** Tab is not trapped~~ — **closed 18 Sep 2026, on the owner's ruling: trap, and wrap at the
boundary.** The argument for it was sharper than "a trap needs a decision": `aria-modal="true"` already
told assistive technology there was nothing outside the sheet, while a keyboard could walk straight out
of it. A contract the component announces and does not keep is worse than one it does not announce.

Measured before, on the spec page, with Playwright driving the live specimen: open the sheet with
Enter, focus lands on the dialog root; Tab → "Got it"; Tab → **"Got it" in the anatomy specimen** (a
different sheet); Tab → **"Got it" in the "Exit load" specimen**; Shift+Tab × 3 → back out to **"Open
the sheet"**, the opener, with the sheet still open. Focus left the modal in both directions.

Now: Tab on the last control goes to the first, Shift+Tab on the first — or on the dialog root, where
focus lands on open — goes to the last. With one control, both keys keep "Got it". Measured after, same
script: Tab, Tab, Tab, Shift+Tab, Shift+Tab, Shift+Tab all report `"Got it" INSIDE sheet "Capacity and
tolerance"`; Escape returns focus to the opener as before.

One design decision inside the fix, because the spec page forced it — and the first cut got it wrong.
The page renders **six** open specimens, each a `role="dialog"` with its own keydown listener. The
first cut trapped whenever focus was inside a sheet; the same script then showed that after Escape,
four Tabs on the page reached **one** element: focus had walked into the anatomy specimen's "Got it"
and that specimen — a picture, mounted open, never opened — had swallowed the page's keyboard. So the
trap is **armed by the same `false → true` transition that moves focus in**, and a sheet mounted
already open never traps. Same rule the focus move already followed in v12, for the same reason. Re-run:
the live sheet still holds Tab and Shift+Tab six times over, and after Escape four Tabs reach four
distinct elements.

### F-26 · Tier 1 is complete, and `Composer` had no page — *closed*
Worth recording because of how it was nearly missed. `pages/Dock.html` is titled **"Dock & Composer"**
and covers four composer states, so the component felt done. The index disagreed: it counts a page
only at `pages/<Name>.html`, and `pages/Composer.html` did not exist — so the component that **rule 3
is about** sat in the `building` column, correctly, while a human reading the page list would have
said it was covered.

The index was right and the impression was wrong. `Composer` now has its own page, and so do the four
remaining chat-spine components — `SentinelBlock`, `MessageActions`, `ParseNote`, `DetourBanner`.

**Tier 1 is closed at 41 of 85.** The definition, stated so the next tier is not argued about: every
component that *carries one of the four rules*, or that the chat spine is *built from*. What is left
is Tier 2 — chips, buttons, marks, icons, shells — components whose contract is short and whose
behaviour is visible on a group board.

One drift fixed on the way: `Composer.d.ts` listed its context placeholders as
`… · canvas "Ask about this" · sheet …`. That surface was removed from the product in v5 and the
placeholder outlived its name, exactly as the motion guideline outlived `--dur-canvas` (F-13). It is
`artifact` now — which is where that placeholder actually appears.

---

### F-30 · The artifact peek reserved 96px instead of capping at it, and three bars ended 4pt apart — *found by the owner, fixed 18 Sep 2026*
The owner looked at an artifact peek and said the space between the chart and "As of 30 Sep" was being
wasted. Measured on `screens/journey-b/03-thread-answer.html`: the preview box was `height: 96` while the
three-row bar chart measured **62**, so **34pt of empty card** sat between them and the declared 10pt gap
rendered as **44**. `height` → `maxHeight` in both of `ArtifactCard`'s peek paths: the rule is unchanged —
the preview is still clipped at 96 and still hidden rather than scrollable — but a shorter preview now takes
its own height. The card fell 243 → **209**, and the gap is **10**. The `filling` skeleton keeps a fixed 96
on purpose: there the block *is* the content, and a shimmer that shrinks would be a wait lying about its size.

In the same screenshot the three bar tracks did not share a right edge — 177 / 173 / 174, ending 4pt apart —
because `ChartBar`'s value span sized to its own text ("+6.1" measured 19, "+2.0" 22) while the track is
`flex: 1`. Three bars that do not share a right edge read as a drawing rather than a scale. The value column
now carries `minWidth: '4ch'` — four tabular figures, no px literal — and all three tracks end at **334**.

Both are in the system, so every screen and every board gets them. **Not fixed, and reported instead:** the
widget the owner was looking at is `ui_kits/journey-b/b-parts.jsx`'s own `AttributionPreview`, a hand-drawn
copy inside the imported kit that does not use `ArtifactCard` or `ChartBar` at all — it hardcodes a 108pt
label column and draws no track. The kits are the import record and are not edited without the owner's word;
it is the same open question as the kit's stale Home.

### F-27 · Every scrim in the product renders at 100% ink, not 40% — *found 18 Sep 2026, fixed the same day*
Found while promoting the Drawer, by measuring rather than looking — a 100% scrim and a 40% scrim are
both "dark" in a screenshot. `ExplainerSheet.jsx:64` sets `opacity: 0.4` and
`animation: 'ds-fade 300ms var(--ease) both'`. `ds-fade` ends at `opacity: 1`, and `animation-fill-mode:
both` keeps the keyframe's final value after it finishes. So the declared 0.4 is overridden the moment the
fade completes, and the scrim sits at **opacity 1**. Measured with `getComputedStyle` on the live spec page:
`opacity: "1"`. The readme says sheets carry the scrim at 40% (`readme.md:206`), and the sheet's own page
says *"held at 0.4"*. Neither has been true since the animation was added.

The Drawer inherited the identical line and the identical result (`computed opacity 1` against a declared
`--scrim-drawer` of 0.25), which is how it was caught.

**Fixed in both.** `tokens/effects.css` gains `ds-scrim` — a keyframe with a `from` and no `to`, so it fades
to the element's *own* opacity — and two tokens name the values, `--scrim-sheet: 0.4` and
`--scrim-drawer: 0.25`. The Drawer measured 0.25 first. `ExplainerSheet` was left for a day because the change
is visible; then screen 3's live state rendered the sheet over a **fully black phone**, which is not a look
anyone chose — it is the component failing to be what its own page says it is. `ExplainerSheet.jsx` now uses
`ds-scrim` on `--scrim-sheet` and measures **0.4** (Playwright, `getComputedStyle`, on `screens/journey-b/
03-thread-answer.html` and `prototype.html`). Every sheet specimen is lighter than yesterday; that is the
documented value arriving, not a restyle.

### F-28 · The two most important buttons on the screen had no name — *found and fixed 18 Sep 2026*
`composer/Composer.jsx:16-18`: the send slot holds a `<button>` with an arrow glyph and, while streaming, a
`<button>` with a 13px square. Neither had text or an `aria-label`, so a screen reader announced "button" for
Send and for Stop. Found by a Playwright probe that could not find Stop by name. `aria-label="Send"` and
`aria-label="Stop"`, the square marked `aria-hidden`. Nothing visible changes. The attach disc beside them is a
`<div>`, not a control at all — it was drawn that way in the archive and is recorded here, not changed.

### F-29 · The status bar's wifi glyph was drawn half — *found by the owner, fixed 18 Sep 2026*
`shell/StatusSpacer.jsx`: the wifi path drew only the right half of each arc (`M8 2.5 → 13 4.6`, `M8 6 → 10.5 7`)
and a chevron for the dot, so on every phone, board and spec page the icon read as cut off at its left edge.
The owner saw it on the screens. Redrawn as two arcs symmetric about x=8 and a dot, same 16×12 box, same
1.3 stroke, same colour — the stroke stays inside the box (1.85 … 14.15). Looked at, at 3×, after the change.

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
