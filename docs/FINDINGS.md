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

### F-38 · The concentration bar showed 100% for every fraction — *found by looking, fixed 19 Sep 2026*
`ConcentrationBar`'s fill carried an inline `transform: scaleX(fraction)` **and**
`animation: ds-grow … both`. `ds-grow` ends at `scaleX(1)` and `animation-fill-mode: both` holds a
keyframe's final value forever, so the moment the animation finished every bar was full — whatever it was
told. The component whose entire job is to show a fraction showed all of it, and had since it was written.
Found the first time a screen used it: Sharma's small-cap sleeve at 31% drew a full bar.

**This is the third time the same CSS fact has cost a figure.** F-27 was `ds-fade … both` holding a scrim
at opacity 1 over a declared 0.4; this is the transform half of it. The rule, now in the component's own
header where it will be read: **an animation with `both` owns the property it animates — do not also set
that property inline.** Every sibling already did it correctly (`AllocationCard`, `HeroNumberCard`,
`InfoCard`, `Dumbbell` all set the WIDTH and let `ds-grow` scale 0 → 1 of it), so this one now does too.
Measured after: 31% of its track, on the screen that found it.

### F-37 · A table's in-row detail was cut off by the table's own sideways scroll — *found by looking, fixed 19 Sep 2026*
`DataTable`'s expanded detail renders inside the horizontal scroller, so it inherited the table's
`max-content` width: on the fund screen a fund's page lost its sentence mid-word at the right edge
("No confirmed source for this fund's performance yet, s"). The rule this component exists to hold is
*"the row becomes expandable IN PLACE — never a modal"*, and a detail you cannot read is a modal with
extra steps.

The detail is now pinned left and given the scroller's own viewport width — the same trick the sticky
column already uses — so it stays whole wherever the columns are scrolled to. Measured with a
`ResizeObserver` rather than assumed, and it only applies when the table actually scrolls.

### F-36 · `InfoCard locked` blanked figures it had — *found by looking, fixed 19 Sep 2026*
Card-level `locked` means "the fund performance source is unconfirmed", and it also printed `——` over
every stat: on the fund screen the card blanked **"Held by your clients: 1"**, a fact read from the
advisor's own book, because something unrelated was unknown. Hiding something true because something
else is missing is the opposite of this system's stance everywhere else — state what you know, name what
you do not — and a stat with no owner already has its own per-stat `locked`, which is what that flag is
for. Card-level `locked` now governs the figure, the chart and the range row only.

### F-35 · phone-shot drew a defect that was not there — *found by looking, fixed 19 Sep 2026*
`tools/phone-shot.mjs` opened every page in a fixed 1400×2600 viewport and clipped the phone from it. A
screen page is taller than that — `screens/thread/going-back.html` is 3200 — so a phone below the fold was
clipped from outside the viewport and Chrome returned a **rotated, stretched frame**. Measured on phone 5
of 7. It is the second time a crop has invented a defect: the first was the padding one, where clipping at
the frame's exact bounds sliced its own 44pt corners and the owner reasonably read it as a radius bug.

The viewport is now grown to the document's own height (capped at 12000) before anything is measured. Both
defects were in the picture rather than the product, which is the argument for measuring geometry with
`getBoundingClientRect` and treating a crop as a second opinion, never as evidence on its own.

### F-34 · A `Dumbbell` label replaced its own number — *found by looking, fixed 19 Sep 2026*
`Dumbbell` rendered `actualLabel ?? \`${actual}%\`` and `targetLabel ?? \`${target}%\``, so a caller that
named its two ends got a chart with two dots and **no figures**. Found on the rebalance simulation, which
is the one place in the product where an advisor decides money from a picture: it read *"He is at now →
He agreed to"* with 71, 60 and 58 nowhere on it. Rule 4 — every figure direct-labelled, in tabular figures.

The labels now sit beside their values ("He is at 71%" · "→ He agreed to 60%"), and a call with no labels
renders exactly the strings it always did, so no existing board moves. Caught by cropping the phone, not by
any check: the chart rendered, the gutter passed, nothing truncated, and the numbers simply were not there.

### F-33 · Integrity failed on the calendar, not on a change — *found in CI, fixed 19 Sep 2026*
`pages/_index.json` carries `"generated": "<today>"`, CI runs `build:index` before `check:integrity`, and
the integrity check hashed the file whole. So from the day AFTER a baseline was recorded, that one line
differed and the run failed for a reason nobody caused.

It is not theoretical: **run 57 was green on 18 Sep, run 58 failed on 19 Sep with an identical tree** (its
only commit touched `tools/phone-shot.mjs`), and run 59 went green again only because the baseline had been
re-recorded that morning. A gate that fails on the calendar teaches people to ignore it, which is the
opposite of what this one is for — and it would have been read as "integrity is flaky" rather than as a
defect.

The index diff step in CI already masks the same line (`git diff -I '^ *"generated":'`); the fix is that
rule applied where the file is hashed. Proven both ways: with the stamp set to 2099-12-31 the tree still
reports intact, and with one `literals` value changed by hand it reports 1 file differing. Every row and
every count in the index still hashes exactly.

### F-31 · A locked `SegmentedRow` dimmed its selection away — *found by the review agent, fixed 19 Sep 2026*
`SegmentedRow`'s locked row passed `disabled` to `Pressable`, which renders at `opacity: 0.4`. Measured on
the drawer: **both** pills at 0.4, and Light's `--color-selected` composited through it matched the
unselected pill — so the row stopped showing which theme is on. That is the opposite of the component's own
header (*"a locked row renders inert, keeps its selection visible"*), of the drawer page's stated treatment
(*"selected keeps `--color-selected` and a bronze ring"*), and of `OverlapView`'s rule it was built from:
*the cap is stated when reached, never enforced by a disabled button with no explanation.* Same class as
F-27 — a page saying one number over a render doing another.

Fixed by making locked **inert rather than disabled**: no handler, `tabIndex={-1}`, and `aria-disabled` for
the announcement. `Pressable` now accepts and forwards `aria-disabled`, which is the difference between
"announced as unavailable" and "dimmed to 40%". Measured after: Light `opacity 1`, background
`rgb(235,212,195)` = `--color-selected`; Dark `opacity 1`, `--color-chip`. The selection is visible again
and neither pill can be tapped or tabbed to.

### F-32 · A stopped trace kept saying "Working" — *found by the review agent, fixed 19 Sep 2026*
`ProgressTrace` had two header states, `Working · Ns` and `Thought for Ns`. A trace frozen mid-run is
neither, so `screens/journey-b/02-thread-trace.html` shipped two phones reading **"Working · 3s"** fourteen
points above **"Stopped. I kept what I'd worked out so far"** and **"I lost the connection…"**. Two
contradictory claims about one moment, on a product whose register is honesty — and the screen could not
fix it without hand-building a header, which the promotion rule forbids.

A third state, `stopped`, renders **"Stopped at Ns"**. Additive: every existing call site is unchanged, and
the two screen-2 phones now measure "Stopped at 3s". The same pass moved screen 2 onto the shared
`answer.jsx` copy, so its step 4 reads "Working out what moved" like screen 3's rather than "Attributing
the drift" — no figure changed, only the words (screens/README rule 14).

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

### F-39 · The app bar's two buttons had no accessible name — *found by driving the prototype, fixed 19 Sep 2026*

`TopBar` draws an icon-only menu disc and an icon-only new-thread disc, both `Pressable` with an icon
child and **no `label`**. A screen reader announced two unnamed buttons, and `TopBar` is on every screen
in the product — Home, every thread, the rail — so it is the same defect repeated everywhere rather than
one screen's mistake.

**How it was found, and why nothing caught it.** Driving `screens/prototype.html` in a browser to check
that the rail could be left, the live DOM answered with exactly two accessible names on the whole page,
`Attach a file` and `Send`. Both come from `Composer`, which was given names when **F-28** fixed its
Stop and Send buttons — and F-28 stopped there. The lesson is F-28's own, unlearned: a component whose
only child is an SVG has no accessible name unless something gives it one, and no gate in this repository
looks for that.

**Fix:** `label="Menu"` and `label="New thread"` on the two `Pressable`s (`TopBar.jsx:13`, `:17`).
Nothing moved a pixel — `Pressable` puts the label on `aria-label`, not on screen.

**Still open, deliberately:** no automated check looks for an icon-only control without a name. The
honest position is that `check-previews` renders the FIRST state of a page, so it cannot see most of
what a prototype does; this finding came from a person driving the thing, and that is what found it.

### F-40 · `report:parallel` under-reported because it read the quote style — *found 19 Sep 2026, fixed*

`tools/check-parallel.mjs` decided a component was on a screen if the page contained `<Name`, a
destructure off `window.SentinelDesignSystem`, or the literal `'Name'` — **single quotes only**. Every
page written by hand uses single quotes, so nothing caught it until two pages were generated with
`JSON.stringify` and came out double-quoted. Both under-reported: `parallel` printed **71 of 88** when
the true count was **73**, and `ResultCard` and `VersionRow` were listed as "on no screen" while an
advisor could see them on `screens/journey-d/proposal.html`.

The stray check on the other side had the same regex, so a page could also have named a component the
system does not export and been read as naming nothing — a defect the report exists to fail on.

**Fix:** both matchers accept either quote. The usage matcher also now recognises `<NAMESPACE.Name`,
which is how every screen module calls the system (`PROP_DS.ResultCard`), and which the old regex read
as no use at all.

**The lesson, and it is the second time this week:** a check that depends on how a literal is spelled
reports a number nobody can trust. This is the same shape as the pinned-chip exception matching a file
path by its spelling rather than resolving it — both were found within an hour of each other, and both
were fixed by comparing the thing rather than the text of the thing.

### F-41 · The parallel check called two real exports "strays" and failed CI — *19 Sep 2026, fixed*

`tools/check-parallel.mjs` answers "does a screen name something the system does not export?" by
comparing `__screenRequires` against `components` — which is **one name per FILE**, taken from
`pages/_index.json`. Several files ship more than one export: `ResultCard.jsx` also exports
`ResultActions` and `ResultPrimary`, and `design-system/index.js` exports all three. Journey D names
all three, so the check reported two strays and exited 1. **CI failed on a defect that did not exist.**

**Fix:** the stray set is now read from `design-system/index.js`, the only public entry, which is the
only honest answer to "does the system export this". The file list stays as the basis for the usage
count, where one name per component is what is wanted.

**Why it reached CI at all, which is the part worth keeping.** I ran the gate locally as
`node tools/check-parallel.mjs 2>&1 | head -1`. The strays print after the summary line, so `head`
discarded them — and piping through `head` also discards the exit code. The gate had failed on my own
machine and I read the one line that said it had not. **A gate's output is not a summary line, and a
gate run through `head` is a gate not run.** F-40 was the same class the same hour: a check that reads
the shape of a thing rather than the thing.

### F-42 · Every `ResultCard` ended in three invisible buttons — *found by driving Journey E, fixed 19 Sep 2026*

`ArtifactCard` rendered its hairline rule and its three-slot footer **unconditionally**
(`ArtifactCard.jsx:91`). A card given none of `onToggle`, `onWhy` or `onShare` therefore ended in a
divider, **44pt of dead space**, and three `<button>`s that were enabled, in the tab order, and had no
name, no text and nothing to do. `ResultCard` supplies none of the three — it is an end state the
advisor arrived at to read — so this was on **every proposal, review and rebalance card in the product**.

**Measured, not guessed.** On the live DOM of `screens/journey-e/rebalance.html`: card height 677px,
last child a 44px row, three `BUTTON` elements with `aria-label: null`, `textContent: ""`,
`disabled: false`. After the fix: 621px, zero unnamed buttons. The 56px is the row plus its rule and
the gap above it.

The dead space is the lesser half. A keyboard user tabbed into three invisible controls — the same
class as **F-28** (Stop and Send unnamed) and **F-39** (the app bar's two discs), and the third time
this system has shipped a `Pressable` nobody could see or name.

**Fix:** the rule and the footer render only when at least one handler is supplied. The condition is on
the **props**, not on `filling`, so a card that has a toggle keeps its footer while it loads — the row
is about to be usable and removing it would make the card jump. Cards that use the footer are byte-for-byte
unchanged; verified on the drift artifact, which still shows its rule and `Expand ⌄`.

### F-43 · A filter chip's ✕ was a character in its name — *19 Sep 2026, fixed*

`screens/journey-c/funds.html` drew its removable query chips as `label={`${q.label}  ✕`}`. Two things
followed. A screen reader read the name as **"Flexi cap ✕"** — the glyph was part of the label, not an
affordance. And nothing distinguished a chip that removes itself from a chip that selects itself: both
were a `Pill` with an `onClick`, and the only difference was two spaces and a character.

**Fix:** `Pill` gains `removable`. It draws the ✕ in a trailing slot and names itself
**"Remove Flexi cap"**. It is deliberately **not** a nested button: `Pill` is a `<button>`, and a
control inside a control is the defect this repository shipped once already (`DownloadAction` inside
`ArtifactCard`). The pill stays the one target — which is correct, because removing itself is the
chip's whole job.

Found while making the fund explorer chat-led, by reading the source of a screen I was about to change.

### F-44 · Padded on three sides, and a hit area worn as spacing — *found by the owner, 19 Sep 2026*

The owner sent two crops and one sentence: *"prompt and edit ke bich me jaada spacing hai"*, and
*"jaise dono side se padding hai waise hi bottom me bhi de sakte hai"* — then said it is not this screen,
it is everywhere.

**Both were real, and they are the same mistake twice: a 44pt target treated as if it were its ink.**

**(a) `MessageActions` — measured 19px, should be ~8.** The target is 44 and the visible line is
`--leading-16`, so each button overhangs its own text by `(44 − 16) / 2 = 14` top and bottom. The row
pulled back `-8px 0 -10px` — two numbers that were never the subtraction. The word *Edit* therefore sat
19px under the bubble on **every turn in the product**. It is now written as the arithmetic
(`OVERHANG = (TARGET − LINE) / 2`), so changing the target or the type moves it. Measured after:
**19 → 13**, target still 44.

**(b) `ArtifactCard` — bottom padding 0.** Both bodies ended in `14px 0` and relied on the footer for
the bottom space. **F-42 stopped rendering the footer** when a card has no handlers — so on the same
day, every `ResultCard` began ending flush against its own edge with 14 either side: padded on three
sides, open on the fourth. Now `padBottom = hasFooter ? 0 : 14`, so a card that had a footer does not
move by a pixel.

**The gate: `BOTTOM-FLUSH`, a warning in `check-previews`.** The rule it settled on is one sentence —
**nothing sits within 8px of a card's bottom edge** — and it took **four rewrites** to get there,
because every cleverer measure over-reported or went blind:

1. **box-to-box** called a correct **confirm sheet** a defect: its 20px lives inside the commit row.
2. **counting the child's padding** then called a correct **artifact card** a defect: its last child is
   a 44pt footer with a centred label.
3. **top-vs-bottom ink** flagged three correct cards — the concentration card, the client list, the
   drawer — because a container whose first child is a graphic (a bar, an avatar) has no ink at the top,
   so the top reads as huge. All three were measured by hand and are balanced.
4. **reading `paddingLeft`** made it **blind**. On `ArtifactCard` the shadow and radius are on the outer
   card (`padding: 0`) and the 14 is on an inner transparent div, so the outer box was skipped for
   having no padding and the inner one for not looking like a box. It also skipped `overflow: hidden`,
   which `ArtifactCard` uses to clip its own radius. **The gate went silent across all 94 pages and I
   was about to report the product clean on it** — it only surfaced because the fix was reverted to
   watch the gate fail.

**Proven in both directions before it was trusted:** with `padBottom` forced to 0 it reports
*"only 1px under the last line (top is 15)"*; with the fix in place it is **silent across all 94
pages**. So the honest answer to *"yeh har jagah hai"* is: the two the owner found were the two that
existed, and there is now a check that says so.

**Three the earlier draft reported and I did NOT change, because measurement cleared them:** the
drawer's `See all` (its 44pt target sits exactly inside a 44pt row), the client list, and the
concentration card. The Home rows card also looked bottom-flush to me in a crop — measured, it is 13
at the top and 14 at the bottom. Nothing was "fixed" on a hunch.
  mistake as (a), in a different component.
- **The client list** — ink 21 from the top, 15 from the bottom.
- **The concentration card** (*"Small cap 31% — the sleeve ceiling is 25%"*) — ink 28 from the top,
  14 from the bottom.

### F-45 · The rail's composer was a drawing of a composer — *found by Aarav, 19 Sep 2026*

Every step of the journey rail places a composer that says **"or type your answer"**. It was
`value=""` with a no-op `onChange` and a no-op `onSend` (`rail.jsx:190`) — **inert on journeys A, D, E
and F**, four of the six. An advisor could tap it, and nothing they typed appeared.

This is the `DEAD PAPERCLIP` rule applied to the composer, and the gate only knew to look at the
paperclip. **It is also the second time:** the thread's composer had exactly this and was fixed on the
same day for `screens/prototype.html` — and the rail was not looked at.

**Fix:** `RailAsk` is a component with its own state, and `LiveRail` treats what is typed as the answer
to that step, through the same `advance()` a chip takes. Typing is not a second-class answer.
`MoneyComposer` keeps only `onSend`, because it owns its own value and hands back a formatted rupee
string — passing it `value`/`onChange` would have invented a contract it does not have.
Verified in a browser: the field held `"38 years"`; before the fix it was permanently empty.

### F-46 · Four found by the studio audit, each measured — *19 Sep 2026*

**(a) The client note told a comfortable lie.** `CLIENT_NOTE` — the only copy in this product that
reaches a client — said *"No exit load and no tax"* about a pair the same screen costs at **₹11,200**.
True of the SIP redirect, false of the switch, and the note attributed it to both. A note sent under
the advisor's own ARN saying the client paid nothing when he paid ₹11,200 is the worst sentence this
repository could ship. The figure now leads. *(Meher M-1 / Anaya A-3, blocker.)*

**(b) The confirm sheet called a SIP change a switch.** *"These two switches run under your ARN"* — one
is a switch and one is a SIP redirect, and they are different acts: the switch sells units and is
taxable, the redirect changes a future instruction and is not. *(A-10.)*

**(c) `ds-spin` was defined inside a component and cancelled globally.** The keyframe lived only in
`IconSpinner.jsx`'s local `<style>`, while `MotionGuard` ships the *cancelling* rule for every page. So
on any page without an IconSpinner mounted — which is all of them, it is on no screen — `Pill loading`
carried an animation name with **no keyframe** and stood still. Measured by Rhea on `pages/Pill.html`
and `screens/thread/ledger.html`: keyframe defined 0 times, `getAnimations().length === 0`,
`transform: none`. The system's own rule is that a global rule does not live inside a component; the
cancelling half obeyed it and the defining half did not. Now both ship from `MotionGuard`.

**(d) F-31, one component over.** `RangePills.jsx:25` still passed `disabled={locked}`, which dims to
0.4 and composites the selected pill's `--color-selected` away — so an advisor cannot see which range is
locked in. That is F-31 exactly, found and fixed on `SegmentedRow` on 19 Sep and left live here, while
`RangePills.d.ts` promised *"renders inert"*. Now `aria-disabled` + `tabIndex={-1}`, which is what
`Pressable` forwards for precisely this.

**Also fixed in the same pass:** `Composer.jsx` still defaulted to the placeholder its own `.d.ts`
records deleting on 19 Sep (contradiction 37, logged as a duplication and since become a disagreement);
the **riskometer** is now beside the return on the fund page — it has been on every row of `FUNDS` since
the book was written and appeared on no screen, and a return shown without it is the number an advisor
is least allowed to show alone; and the **AMFI line** joins the past-performance caveat.

**The router, corrected twice in one pass.** `act` read `sell|redeem|switch|buy` followed by
`all|everything|full`, so *"Sell all of Sharma's Quant Small Cap"* was caught and **"Sell 2 lakh of
Quant Small Cap" fell through to bucket 4** — the ordinary phrasing, missed by the rule whose whole
stated purpose is to catch an instruction before the fund search reads it as a browse. And `drift`
matched a bare `sharma`, so **"Review Sharma" and "Review Sharma's portfolio" both opened a drift
trace** and a bare name never reached disambiguation. Both fixed and verified across eight sentences.

### F-47 · The rupee sign is not in either of our typefaces — *found by Nia, 19 Sep 2026* · **RULED, 19 Sep: keep the fallback**

`U+20B9` **falls back to Helvetica in both shipped faces**. Measured with CDP's
`getPlatformFontsForNode`, which reports the font the renderer actually used per text run — not the
declared stack:

```
"₹89,400 cr"  →  Helvetica x1 · Urbanist x9
```

Nia counted **230 occurrences inside phones, on all 13 surfaces**, including the 24px display figure.
Neither Urbanist nor Darker Grotesque contains the glyph; both come from `fonts.gstatic.com` and
nothing is vendored. Also `U+22EF` (the ⋯ menu) → PingFang SC ×24 and `U+2713` (✓) → Lucida Grande ×2.

**Rule A4 is "Indian grouping and provenance", and the mark that makes a number Indian is the one
neither face has.** Every screen in this product shows money.

**I checked this by eye earlier the same day and passed it.** Zoomed to 3× the ₹ sits correctly on the
baseline, so I reported it as fine and deliberately did not "fix" it. It looks fine because Helvetica's
₹ is a competent glyph — it is simply a different typeface, at a different weight and width, inside
every rupee figure we draw. `document.fonts.check('16px Urbanist', '₹')` also returns **true**, because
that API tests the declared `unicode-range` (`U+0-10FFFF`) and whether a matching face is loaded, not
whether the file contains the glyph. **Two instruments said yes and the renderer said no.**

**THE OWNER'S RULING, 19 Sep 2026: keep Helvetica.** *"sab helvetica hi rehne do, ab bahut bada change
karna ho jayega."* Vendoring a donor face would change the width and weight of every rupee figure on
every screen at a point where the visual language is settled and six journeys are built on it — a
larger change than the defect. **This is now a deliberate, documented choice, not a gap.**

What that means in practice, written down so nobody "fixes" it later:

- `U+20B9` renders in **Helvetica**, `U+22EF` in **PingFang SC**, `U+2713` in **Lucida Grande**. All
  three are system faces present on every target device; none is a download and none can fail to load.
- The fallback is **only ever one glyph inside a run** — the digits beside it stay in Urbanist, so
  grouping, tabular alignment and the type ramp are untouched. Rule A4 is about the grouping and the
  provenance, and both hold.
- **If a donor face is ever revisited**, it is `tokens/fonts.css`, scoped by `unicode-range` to
  `U+20B9` at one weight, and it is a visual change that needs its own ruling.

Recorded rather than closed silently, because the next audit will measure it again and should find the
decision instead of the finding.

### F-48 · The fifth nameless `Pressable`, and a focus trap that counted it — *19 Sep 2026, fixed*

**(a) `ArtifactCard`'s footer slots.** F-42 made the *whole footer* conditional and stopped there, so a
card given **one** handler still rendered **three** `Pressable`s — two of them enabled, unnamed, 105×44
and reachable by keyboard. Nia measured **45 across the product**. That is the **fifth** time this
system has shipped a nameless `Pressable` (F-28, F-39, F-42, F-43), and F-42 was mine. An empty slot is
now a plain `div` of the same width, so the row's layout does not move. Verified: 0 on every page.

**(b) The focus trap counted a `tabindex="-1"` button.** All three traps selected `button` bare, so a
button deliberately taken out of the tab order still counted as a stop — `active === last` never fired
and **focus walked out of an `aria-modal` dialog**. Proven live on the drawer: the trap believed the
last stop was "Appearance: Dark" (`tabindex -1`) while the browser's was "Back to home". One line in
`Drawer.jsx:47`, `ConfirmSheet.jsx:62`, `ExplainerSheet.jsx:48`.

**It was exposed by F-46's own fix** — giving locked `RangePills` `tabIndex={-1}` is what made the trap
miscount. A correct fix in one component found a latent defect in three others.

### F-49 · Two contracts described a feature nobody had built — *19 Sep 2026, built*

Building the WHO step made two existing contracts true, and corrected a third that was simply wrong.

**(a) `ClientChip` said it was "composer-resident" and had nowhere to live.** Its doc, since v9: *"the
drawer's client tap and a journey's client picker produce the same chip in the same place; typing a name
resolves to the same state, so selection and typing are one flow, not two."* `Composer` had **no slot
for it**, so the chip was on no screen and the sentence was a promise with nowhere to land. `Composer`
now takes `bound`; omit it and the composer renders exactly as before.

**(b) `SearchField` was documented as "what a `List searchable` renders".** **`List` has no `searchable`
prop and never did.** The doc described a feature that did not exist, and any consumer reading it would
have gone looking for a prop. Corrected: the caller composes a `SearchField` above a `List`.

**(c) The picker's subtitle was a flag.** The first cut used `flags[0]`, and Amit's is *"KYC in process
— nothing can be executed until it clears"*: 292px of sentence in a 243px row, caught by the truncation
gate. A row in a picker answers *is this the right person*; the shortest true answer is what they hold,
or why they hold nothing. The full flag belongs on the journey it blocks, where there is room to say
what to do about it.

**The step itself.** Six journeys are about a client and could not start without one. `"risk profiling"`
landed in bucket 4 — honest and useless, because the router **did** follow: it had half the sentence.
The rule is **not** "always ask": it is **ask only for what the advisor has not already said**.
Verified in the prototype: `"risk profiling"` produces the picker; `"Start Meera's risk profile"`
produces **no picker at all** and opens the rail directly.

It also answers the audit's biggest persona hole. Every screen in this product assumes an established
ARN holder with 512 clients; **`WhoEmpty` is the only place a new one exists**, and it says the book is
empty, says one client is enough to make everything work, and offers the two real ways to start.

### F-50 · Two end labels landed on each other — *found by looking, 19 Sep 2026, fixed*

`ChartLine` places each series' end label from **its own line's direction**: a line arriving from below
puts its label above the endpoint, and vice versa. Independently, and that is the bug. When both series
rise and end close together — **a fund and its benchmark ending ₹184 apart on a ₹21,500 scale, which is
the normal case for an index fund** — both wanted the same slot and **overprinted**: `₹21,368` on top of
`₹21,552`, `Nifty 50 TRI` on top of `This fund`, neither readable.

It could not appear before today, because `ChartLine` had never been on a screen: the system's own
rule — *nothing in the system that is on no screen* — is what found it.

**Fix:** two passes. Place both the old way, then push the **second** series clear of the first. The
primary never moves, so the series the advisor came for keeps the slot its own line earned, and the
benchmark — already the muted, dashed one — is the one that yields. If the push would leave the plot,
it goes the other way rather than clamping back into the clash.

**Also fixed in the same pass, and it is a composition finding rather than a component one:** the fund
card put the chart in **both** states. At the 96pt peek the headline plus a plot does not fit, so
`ArtifactCard` clipped the plot and left the chart's end label floating alone under the sentence — a
number with no picture. **The peek is now the headline alone.** The peek answers the question (*what
would ₹10,000 be*); the chart is the evidence, and evidence is what expanding is for.

### F-51 · `ChartLine` and `InfoCard`, found the day they first carried real data — *19 Sep 2026*

`ChartLine` had never been on a screen and `InfoCard` had only ever been shown `locked`. Putting a real
five-year rupee series into them found four things in one afternoon. **Three fixed, one open.**

**(a) FIXED · `InfoCard` composed `ChartLine` and passed none of its formatters.** It called
`<ChartLine series={series} width={311} run={false} />`, so the chart's **defaults** labelled every
card — a percentage on the value, a raw number on the x. Hand it a rupee series and the end label reads
**"21368.0%"** over a five-year NAV curve and the axis reads **"0 … 60"** for the months. `valueFormat`
and `xFormat` are passed through now: a card that composes a chart owns the chart's labels too.

**(b) FIXED · the end label reserved one line for a name and Indian benchmark names are long.**
`h` was 30 — a value plus **one** line. *"Nifty Smallcap 250 TRI"* wrapped to three, overflowed the
reserved box, and the plot's own stroke ran through the words. Now two lines are reserved and clamped
at two; a third is a name to shorten, not a layout to stretch. The contract says so, and the caller
should pass the **role** (`"Benchmark"`) when the card has already named the benchmark in a sentence
above — the same fact twice is the repeated data the owner has objected to more than once.

**(c) FIXED · two end labels landed on each other.** Recorded as F-50.

**(d) OPEN · a label can still sit on its own stroke.** The placement rule is *"a line arriving from
below leaves the space above its end empty, so the label goes to the empty side."* That reads **one
segment**. On a sixty-point monthly series that climbs through most of the plot over the label's own
width, neither side is empty and the rule has nothing true to say.

Three attempts today, each measured and each insufficient: look back over the label's width instead of
one segment; stack both labels on one side when the endpoints are close; take the side with more room
when neither fits. Measured after the third, on `screens/journey-c/funds.html`: the label box sits at
**top 81.5, height 29, in a 180px plot** — the middle, with the stroke across it.

**Left open deliberately.** This is a label-placement routine and it wants its own pass with a proper
test — a set of series shapes (rising, falling, V, spike at the end, two lines crossing) rendered and
checked — not a fourth guess made inside a screen task. The current state is better than the start:
rupees instead of percentages, real axis labels, and the two labels no longer overprint each other.

### F-52 · A token seven files used was never defined — *found by the hand-built audit, 19 Sep 2026, fixed*

**`--type-row-strong-font` does not exist.** Seven files ask for it, including
`design-system/components/cards/ConfirmSheet.jsx` — a system component — and `pages/ConfirmSheet.html`,
which lists it in its own `TOK` array. The ramp already believed it existed.

**CSS does not warn.** A `font:` shorthand containing an undefined variable is an **invalid
declaration**, so every call site silently fell back to the initial value. Measured live on
`screens/journey-e/rebalance.html`: **14 elements at `400 16px/normal`** — a size, weight and leading on
no line of this ramp, and **larger than the body text beside them**. Inside one card the row *label*
rendered at 16px while *"Costs him ₹11,200"* rendered at 13px: the cost figure was the smallest text in
its own card.

**Nothing could have caught it.** The adherence lint reads JS, not CSS custom properties. The preview
gate renders the page, and a wrong-but-present font renders perfectly well. It shipped for weeks.

**Fix:** defined the way the ramp already pairs strong with plain — `--type-body-font` and
`--type-body-strong-font` differ by one weight step and nothing else, so row and row-strong do too:
`semibold 13/18`. This completes the ramp rather than adding to it. Verified: all 14 now render
`600 13px/18px`.

**The gate — `npm run check:tokens`, now in CI.** It collects every token `tokens/*.css` defines and
every `var()` the components, pages, guidelines and screens reference, and fails on the difference.
Proven both ways: it fires on an injected ghost and is silent on the fix.

Three things it found on its first run that I had not:

- **`--type-h2-font`** on `pages/ScreenStack.html` — **mine**, written four days ago on the spec page
  for the component I promoted. Now `--type-title-font`.
- **`--hit`**, read by `.ds-pill::before` in `effects.css` and set per instance by `Pill`. A legitimate
  runtime property, now named in the script's exception list — so the exception is a list somebody
  edits rather than a rule that quietly forgives anything.
- **30 tokens defined and referenced nowhere.** Reported as debt, not failed on: a token nobody uses is
  not a defect. The first count was 38 and wrong, because the sweep did not read `tokens/` itself and
  `--display-24` lives inside `--type-figure-font` and nowhere else. A debt list that over-reports is a
  debt list nobody reads.

### F-53 · Fourteen cards and not one of them was simply a card — *`Surface` added 20 Sep 2026*

`components/cards/` held fourteen components and every one of them **meant** something: `ArtifactCard`
carries peek/expand and provenance, `InfoCard` is the fund's page, `ResultCard` is the end of a journey.
None of them was just a box. So nine screens and six system components hand-wrote one.

**Measured across the repository:** **38 hand-written surfaces**. And one intent — a hairline ring —
written **three ways**: `inset 0 0 0 var(--border-1) var(--color-line)`, `0 0 0 1px var(--color-line)`,
and the same without `inset`. Two inset and one not; one carrying a raw `1px` where the system has
`--border-1`. `screens/journey-b/moves.jsx:62` was **byte-for-byte** `InfoCard.jsx:69`.

**Every default is the repository's own most-used value, not a preference**, so `<Surface>` with no
props draws the box this system already draws most often:

| | most used | of 38 |
|---|---|---|
| radius | **16** | 18 |
| padding | **14** | 8 of the 28 that set one |
| ground | **surface** | 31 |

**Four elevations, because those are the four things a box means here** — `raised` the card the thread
scrolls past (10) · `soft` a quieter card inside a panel (3) · `ring` a block inset into a card (9,
written three ways) · `flat` a box that groups without lifting (11). A fifth would be a new visual
decision and belongs to the owner, not to a caller.

The ring is **inset** and at `--border-1`. The hand-written versions disagreed on both: an outset ring
sits *outside* the box and eats the gap to its neighbour, and `--border-hairline` is for row dividers
and card edges, never for a ring that has to read as an edge of its own (`spacing.css:56`).

**It adds no visual decision.** It names the four that were already being made, and stops the fifth
being made by accident. It is **not** a replacement for the cards that mean something — reach for it
when the box is only a box.

Migrated first: the byte-identical one. Rendered before and after — same radius, same shadow, same
padding, nothing moved.

### F-54 · Thirteen turns, 35 spacers, and a grammar nobody had written down — *`SentinelTurn` added 20 Sep 2026*

Nine screen modules hand-built **thirteen Sentinel turns**, and between their parts sat **35 spacer
divs**. The values were never arbitrary — measured across `screens/*.jsx` they spell a rule the
screens were already following:

| between | value | vote |
|---|---|---|
| a sentence and the next sentence | `--space-10` | 5 of 6 |
| the lead sentence and the body | `--space-12` | 7 of 8 |
| the body and a sentence after it | `--space-12` | **5 of 5** |
| the block and its chips | `--space-12` | **7 of 7** |
| anything and its provenance | `--space-10` | the system's own two placements |

The provenance gap is the one the screens split on — `rail.jsx:156` at 10, `answer.jsx:130` at 8 — so
the tie is broken by `InfoCard.jsx:119` and `OverlapView.jsx:201`, which are both 10, rather than by a
preference. And `--stack` (12px) between the turn's own parts is what all eight hand-built turn
wrappers already used; the seven turns that instead nested their chips *inside* the block at
`--space-12` spell the same 12px, so the two idioms draw the same picture.

**Ten of the thirteen turns migrated with zero pixels moving**, proved by rendering each affected page
before and after and differencing the shots: `refusals` · `who` · `rebalance` · `review` ·
`05-decide` · `journey-b/prototype` · `prototype` all came back **byte-identical**, and
`risk-profile` differs only in the phase of `SentinelThinking`'s pulse (max channel delta **15** of
255 — a geometric shift of that text measured 237).

**Two regressions the render caught and source alone would not have.**

1. A bare `AnswerChip` handed to the turn's flex column became a flex item, and `align-items: stretch`
   pulled the pill across the full 343. Measured on `05-decide`, the partial-execution turn. Every
   hand-built turn wrapped its chips in a plain `<div>` — block layout, intrinsic width — so that div
   is kept.
2. Dropping the first part's wrapper `<div>` for a Fragment left `scrollTop` **1px short of the
   bottom** on `risk-profile`. Every child height measured identical and `scrollHeight` was 1039 both
   ways: nothing in the layout moved, but the shot did. A component that replaces hand-written markup
   has to produce the same **tree**, not merely the same box.

**Three sites dissent and were NOT migrated**, because each is a visible 2–4px and therefore the
owner's call:

| site | gap | what the other sites do |
|---|---|---|
| `screens/journey-d/proposal.jsx:141` | 8 between two sentences | 10 (5 sites) |
| `screens/journey-b/answer.jsx:127` | 8 before the concentration card | 12 (7 sites) |
| `screens/journey-b/answer.jsx:130` | 8 before provenance | 10 (`InfoCard`, `OverlapView`, `rail`) |

`WhoPicker` (`who.jsx:75`, the client list 10 after the search field) is the one thing-after-thing gap
in the repository with no second instance to vote against it; it stays hand-written until there is.

### F-55 · Three shells that happened to agree, and the bug that lived in the gap — *`ScreenScaffold` added 20 Sep 2026*

Rule 3 is **"the composer is on every screen."** Until today it was kept by three hand-built shells —
`thread.jsx:45-63`, `rail.jsx:87-105`, `home.jsx:45-83` — across **16 pages and 37 instances**
(`<Thread>` 24 · `<Rail>` 5 · `<Home>` 8). Diffed with the design-system prefix normalised away, the
thread's and the rail's shells are the **same nineteen lines**, and differ in exactly three:

1. the rail hardcodes `StatusSpacer time="10:12"` where the thread takes a prop;
2. the rail has a `ProgressRail` between the bar and the body;
3. **the rail scrolls to the bottom.**

The third is the finding. `rail.jsx:85` was `e.scrollTop = e.scrollHeight` — precisely the behaviour
`thread.jsx:17-45` exists to reject, and measured there: *"the answer turn is ~500pt in a 462pt
thread, so sticking to the bottom scrolled the sentence off while it was being read."* The rail's copy
of the shell was written without it.

**Looked at, not reasoned about.** `screens/journey-e/rebalance` opened on the middle of a list of
targets: Sentinel's question — *"'Rebalance' is not an instruction until someone says how far"* —
scrolled off the top, and the first target card cut in half. After: the rail opens on the question
with the first target fully readable. Two shells agreeing by hand is how a fixed bug comes back in the
copy.

**Home is the one real variant, and naming it was the point.** It has no scroller at all: a greeting,
a card of ready prompts, and a spacer that pushes the Dock to the floor. That is `body="page"`; every
other screen is `body="thread"` (32 of the 37 instances).

**What the render proved.** All 18 screen pages shot before and after and differenced, then each
changed page re-shot against itself to separate a real change from render flake:

| page | diff | same-code re-render | verdict |
|---|---|---|---|
| rebalance | 739,932 px | **0** | **the fix** |
| risk-profile | 350,977 px | 2,918 | one frame rests 1px higher — the result turn's `✦ Sentinel` is now fully on screen |
| refusals · review | 68,697 / 358,308 px | **68,697 / 358,308** | flake, not this change |
| 03-thread-answer · 05-decide | max delta 3 / 4 | same | `ArtifactCard` shimmer and `SentinelThinking` dot phase |
| drawer · ledger | 25,508 / 38 px | **25,508 / 12** | flake |
| flow · index · 01-home · 02-thread-trace · journey-b/prototype · funds · proposal · prototype · who · going-back | — | — | **identical** |

Re-shooting a changed page against its own output is the only way to tell a 1px regression from the
renderer's own noise, and on this change it moved four pages out of the "changed" column.

**The Dock is not the caller's to place.** That is what turns rule 3 from a convention into a
structure: a fourth screen written tomorrow cannot omit it.

### F-56 · Three duplicates, and a dead control the merge found — *20 Sep 2026, fixed*

The three remaining items on the hand-built audit's A-list. Each is one decision written more than
once; none of them changed a pixel, and one of them turned out to be hiding a defect.

**A-2 · the menu drew its one theme control twice.** `menu.jsx:32` declares `MenuFooterTheme`, whose
whole body is one `SegmentedRow`. `MenuFooter` at `:40` then inlined **the same `SegmentedRow` with
the same five props again** rather than rendering it. The comment two lines above says the drawer's
page used to draw a second copy of exactly this row and that "two copies of a caption drift" — the fix
that comment describes was never finished; the second copy had moved from the page into the module.
`MenuFooter` renders `<MenuFooterTheme />`. One line.

**A-3 · `Ask` existed eleven times, not ten.** The audit counted ten `const Ask = …` declarations;
there is an eleventh, written inline at `03-thread-answer.html:96` rather than named, byte-identical
in behaviour to the seven. Seven were byte-for-byte identical, three branch (`about` →
"Ask about this"; `money` → `MoneyComposer` twice). All eleven are one decision — **rule 3 drawn but
not wired**, because a frozen specimen has nothing to send to.

It went to `screens/screen-kit.jsx`, the screens' own shared layer, and **not** to `design-system/`:
the system already ships `Composer`, and a "pretend composer" beside it would be a one-off component
in a system that has a rule against those. `FrozenAsk({ about, money, placeholder, onAttach })`, 19
call sites. It reads the namespace through a uniquely-named const rather than destructuring, because
ten of those pages already declare `const { Composer, … }` at their own top level and every page
compiles into **one** Babel scope — a second declaration of that name renders the page blank.

**A-1 · two fund cards, and the second one's range row was dead.** `FundDetail` (`funds.jsx:68`) was
`FundInfo` with the series and the ₹10,000 framing removed, `Held by your clients` added, and a
`locked` branch for a fund with no figures: nine of the same props from the same three book lookups,
one branch apart. All three differences are props `InfoCard` already takes, so they are props now.

The merge found this: **the period was controlled or it was not, and the two callers wanted the other
one.** The table's row detail cannot hold state — `expandable` is a render callback — so it needs the
card to own it. The thread's five call sites passed neither `period` nor `onPeriod`, which made
`onRange` a no-op. **Driven, not read:** on `funds.html`, clicking `1Y` on the last fund card gave
`₹14,157 → ₹14,157` before and `₹14,157 → 7.8%` after. Five fund cards carried a range row that did
nothing, which is F-45's rule — a control that invites a tap and drops it — applied to `RangePills`.

**Nothing moved.** All 13 touched pages shot before and after and differenced: `funds` · `prototype` ·
`05-decide` · `proposal` · `rebalance` · `going-back` came back **identical**, and the five that
differed matched their own same-code re-render signature to the pixel (`review` 358,308 · `refusals`
68,697 · `drawer` 25,508 · `03-thread-answer` 120,498 · `risk-profile` ~2,900), which is the
renderer's noise and not this change.

### F-57 · The four verbs, and Compare — *20 Sep 2026*

The owner, 19 Sep: a fund card must let an advisor *"compare kar paaye / rebalance me attach kar paaye
/ review ke liye bhej paaye / proposal me add kar paaye."* Three of the four are **hand-offs** to
journeys that already exist, which is the point — the Fund Explorer is not a silo, it is where D, E
and F are entered from with a fund already chosen. Only Compare is new work.

**`CompareTable` — the transpose of `DataTable`, and it is a different read.** `DataTable` is many
entities with one kind per *column*, sorted and expandable in place. A comparison is few entities with
one kind per *row*, read sideways — an advisor asks "what does each of these charge", not "sort by
cost". Forcing a comparison through `DataTable` makes every fund column `text`, which throws away the
tabular figures and the row's own meaning.

**The v2 spec says "differences bolded", and taken literally that bolds almost every cell** — two
funds differ on nearly everything. Inverted it is useful: a row where every fund says the same thing
is **muted**, so the eye lands where they actually part. A de-emphasis, not a claim. `better` is the
one claim and only where direction is a fact: a lower expense ratio is cheaper, which is arithmetic; a
fund's *size* has no better and is never marked. A tie marks nothing.

**Three amendments rather than three new components.**

| wanted | built | why not a new component |
|---|---|---|
| a searchable picker for funds | **`List.search`** | `SearchField`'s own header has said since v9 that it is "the search field a `searchable` List renders", and the prop never existed — so `who.jsx` did it by hand and the fund picker was about to do it a second time. `who.html` re-rendered **byte-identical** after the migration. |
| a comparable gap on the dumbbell | **`Dumbbell.min`** | Two flexi caps at 23.1% and 21.6% against a 16.8% benchmark put both dumbbells in the right quarter of a 0–25 track, and the 1.5-point difference between the gaps — the whole reason the chart is there — came out at **19px of 315**. `chartMath.niceDomain` is already "never a raw data min/max" and `ChartLine` already scales to its data, so a baseline is this system's existing practice rather than a new decision. Default 0, so every caller before this is unchanged. |
| manager tenure in the comparison | **a `MANAGERS` fixture** | `InfoCard kind='manager'` was built in v12 for exactly this and has been on no screen, because nothing here knew who runs a fund. Invented on PERF's terms, with its own provenance line. |

**Two bugs the render caught.** `CompareTable`'s cells had no `boxSizing: 'border-box'`, so
`minWidth: 104` was the *content* width and each cell became 125 — two funds needed 354 in a 315pt
card and the second column clipped mid-word. And `Dumbbell`'s connector width ran through the position
function, so once `min` existed the bar was drawn shorter than the two dots it joins: **a position and
a length are not the same conversion.**

**The reading is the product.** The v2 spec: *"a table anyone can build; the reading is what the
advisor is paying for."* `compareVerdict()` builds it from the data — shelf first (the only row that
is a constraint rather than a preference), then cost, then the gap to each fund's own benchmark, then
the manager, then whether the two are even the same job. A clause with no fact behind it does not
appear, and when **both** managers are recent both are named, because naming one would read as an
endorsement of the other.

**Driven, not described.** On `screens/prototype.html`: type a fund search → open Parag Parikh →
Compare with… → pick HDFC → the comparison, the gap labels and the reading → Add a third → the cap
stated. And "Add to a proposal" with no client bound lands on the WHO step — *"Who is the proposal
for? Here are the four you worked on most recently — or search the other 508."* — because the fund
explorer is the one surface that does not already know who, and the verbs do not each invent a picker.

### F-58 · The three hand-offs, and the audit's A/B list closed out — *20 Sep 2026*

**The three verbs were doors that dropped what you carried through them.** "Add to a proposal" opened
Journey D and the fund was gone. Fixed by `LiveRail.lead` — a slot **above** the first question, not
inside it, because the carried fund is not part of the question: it is Sentinel saying what it already
has and what it will do with it, and it stays visible as the advisor answers.

The sentence is each journey's own (`propCarriedLines`, `rebCarriedLines`, `revCarriedLines`), because
what a carried fund MEANS is different in each and a shared sentence would be vague in all three:

| journey | what the fund changes | and the honest half |
|---|---|---|
| **D · proposal** | names its share of the mix | **it cannot re-build the split.** `PROPOSAL_SPLIT` is a fixture, not an allocation engine. In the mix → its %; not in it → says so and offers the swap as a decision; off-shelf → refuses |
| **E · rebalance** | names the **destination** — the half the three targets never carried | the shelf is a harder stop here than on a proposal, because a rebalance moves money under the advisor's own ARN. Refused in the first sentence, not at the confirm |
| **F · review** | answers the reverse lookup — does she already hold it | a review is about a client's book; a fund cannot change its facts. Off-shelf → an investment case cannot be written whatever the audience |

**One signature on arrival.** The lead and the first question are one thing Sentinel said, so the
question does not sign itself again eleven points below (the 18 Sep ruling). The moment an answer
lands an `AnsweredList` sits between them and two signatures are correct again — **driven and
photographed both ways.**

#### The audit's A and B lists, closed out

| item | outcome |
|---|---|
| **B-4 `FigureRow`** | **Built.** Four hand-written rows across three screens, all the same declaration and all four remembering `tabular-nums` by hand. `rebalance.jsx`'s two rows became ONE `FigureRow` with a `sub`, which is the thing two hand-written rows could not state: the second is the quiet half. |
| **B-5 `TurnOffer`** | **Closed by `SentinelTurn.cta`**, not by a component. The audit said to re-check after B-2 shipped; re-checked, and what was left was only "at most one dark CTA", which a typed slot enforces and three copies could only agree on. `actions` stays free for the artifact and `MessageActions`. |
| **B-7 `BlockerRow`** | **Not built, and the measurement is why.** The two surfaces are not the same row: `ProposalBlockers` is a two-line block (label + Badge, then a consequence) and `ConfirmSheet`'s rows are single-line 48pt list rows with a coloured word, inside a divided card. One is a screen, one is internal to a system component with its own contract. **One hand-built site is not a duplicate**, and building for one caller is what this system has a rule against. |
| **B-8 `List.search`** | Done (F-57). |
| **D-5 · `menu.jsx:38`** | **Fixed.** It composed 13px semibold out of three axes, and F-52 then defined exactly that as `--type-row-strong-font` — *the same missing token seen from two directions.* The label sits **1px higher**, because the role carries `--leading-18` and the hand-written one inherited: the ramp being applied, photographed before and after. |
| **D-6 · two stat-box treatments** | **Logged as contradiction 62.** A decision about the product's vocabulary, not a fix: a *figure tile* and a *footnote stat* that were never given two names. |
| **D-7 · `InfoDot` on the review's figures** | **Logged as contradiction 63.** Not fixed because the fix is content — four explainer bodies, and they are claims about somebody's money. |

**Two things the render caught in `FigureRow`.** `textAlign: 'end'` on the value (which none of the
hand-written rows had) changed a value's width, wrapped a row and moved the rebalance rail's whole
scroll — **262,499 px of diff from one property that `space-between` already did.** Removing it left
2,588 px at max 55: a single text run shaping differently from the three adjacent text nodes
`{inr(x)} · {pct}%` used to produce. That one is the string being more correct, not less.
