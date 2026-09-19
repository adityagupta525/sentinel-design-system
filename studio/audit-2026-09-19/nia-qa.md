# QA & accessibility audit — 13 screen surfaces · 19 Sep 2026

**Nia, QA & Accessibility Auditor · Fable Design Studio**
Audited against `studio/audit-2026-09-19/parameters.md`. Every finding carries its parameter id.
Measured on the live DOM at the viewport each page's own `@dsCard` declares, through Playwright and
CDP. Nothing in this run changed product code.

> **The scale question, settled first.** Sentinel's own values — 11.5px type, 42px rows, 14px card
> padding, 96px peek, press 0.98 — are the product. Nothing below is reported for failing a generic
> 4/8pt grid. Where a number is flagged, it is flagged against **this system's own written rule**:
> `--h-touch: 44px` is published by `tokens/spacing.css` as *"the floor. Pressable expands to it;
> nothing operable is smaller"*, and `references/scale.md` repeats it. A 42px row is correct; a 42px
> **target** contradicts the token's own sentence. That distinction is the whole basis of section D.

---

## Verdicts

| Gate | Result |
| --- | --- |
| **0 · Render truth (fonts, glyphs, currency)** | **FAIL — 1 blocker.** 10 platform faces rasterised; 6 outside the shipped set. `U+20B9` falls back in **both** shipped faces, 230 times inside phones, on all 13 surfaces. |
| **1 · Render truth (mount, console, 404)** | **PASS.** 94/94 pages render clean. 0 console errors, 0 404s, 0 pages mounting nothing. 5 `TIGHT` warnings. |
| **0b · Behaviour truth** | **FAIL — 1 major, 2 named unaudited.** Drawer opens modal, moves focus in, Escape closes, focus returns to opener — all proven. **Tab escapes the modal drawer.** Confirm-sheet trap and scroll anchoring reported **unaudited/unauditable by name**, not passed. |
| **3 · Measured correctness** | 972 controls measured · **45 unnamed (D1)** · **0 nested (D2 — clean)** · 958 targets hit-tested, **262 under 44 (D3)** · 3,975 text runs in 99 role pairs, **11 pairs fail AA**. |
| **4 · Craft read at 1×** | Done — 6 phones read at 375×812. The product reads as considered and honest. Three things are visible at 1× that no probe flagged; one apparent defect was measured and cleared. **Gate B incomplete** — no side-by-side, no ruling from Ashish. |
| **5 · State inventory** | 89 phones across 13 surfaces. `ideal` 12/13 · `error` 8/13 · `loading` 7/13 · `partial` 7/13 · `empty` **2/13** · **`offline` 0/13.** |

**Counts by severity: 1 blocker · 6 majors · 8 minors · 1 observation (G1/G3) · 2 notes.**

---

## Probe hygiene — every gate was seen to fail before it was believed

Fixtures live beside the probes. `fixture-broken.html` carries one instance of each defect;
`fixture-ok.html` is the same markup with each one fixed.

| Gate | On the broken fixture | On the ok fixture |
| --- | --- | --- |
| D1 unnamed | **1** | 0 |
| D2 nested | **1** | 0 |
| D3 targets | **3** (42×42 unextended → 42.9; 20×20 → 21; **28px with its `::before` present but eaten by an overlay → 27**) | 0 — and the 28px control with its floor intact measures **44.9**, so the probe is proven to *credit* the `::before` rather than read the box |
| contrast | **2**, including **white on a gradient at 1.35:1** — a probe reading `backgroundColor` scores that against the white card and passes it | 0 |
| 0b focus order | `--break 3` → "composer is NOT reachable by Tab" | passes |
| 0b focus return | `--break 2` → "opener was Menu; focus is now Restart" | passes |
| gutter (repo's own) | `--self-test` → 2 errors on `gutter-broken.html` | 0 on `gutter-ok.html` |

**The render is current.** `npm run build:bundle` reproduced `_ds_bundle.js` **byte-identical**
(89 modules, 111 exports, 215 KB; `git status` clean afterwards). The pages read the bundle, so this
is the proof that what I measured is what the source says — not a stale build.

### My own authoring errors, kept separate from the findings

Five things in my first pass described my probe rather than the design. All are corrected above and
restated here, because a corrected probe must restate everything it produced.

1. **"134 unnamed controls" was wrong; the number is 45.** I had reimplemented accessible-name
   computation and omitted the `placeholder` fallback, so 89 composer inputs — which *do* have a
   name — were reported as having none. Re-measured with CDP `Accessibility.getPartialAXTree`, the
   engine's own answer. The placeholder point survives, as a separate and weaker observation.
2. **"Hit box 43×43 for a 42px control."** I counted 1px steps outward from the centre, which
   overstates the span by about a pixel — and a probe that overstates by one passes a 43pt target as
   44. Replaced with a binary search to 0.25px, and the pass threshold set at 43.5 to account for
   sampling between interior points.
3. **"Occluded" on the sibling-behind press target.** `ArtifactCard`'s tap target is deliberately
   covered at its centre and perfectly reachable at its edges. Probing only the centre manufactured a
   finding; the probe now tries a 7-point grid and reports `coveredAtCentre` (11 instances) as
   information, not a defect.
4. **"Dock height 812px" and "a dialog was reached".** My dock selector returned the outermost
   ancestor containing the composer — the phone. And my confirm-sheet check accepted any
   `[role=dialog]`, so it passed itself on the **drawer**. Both fixed; the second now reports the
   sheet as unaudited, which is the honest answer.
5. **The D2 fixture did not test D2.** Written literally, the HTML parser *unnests* a `<button>`
   inside a `<button>` and the defect vanishes before any probe sees it — which is why this is a
   React warning, not a parse error. The fixture now builds the nesting with `appendChild`, the way
   React does, and the gate fires.

---

## Blocker

### N-1 · The rupee mark is not in either shipped face — every figure in the product borrows Helvetica
**Parameter A4** (Indian grouping on every defensible figure) · **blocker** · all 13 surfaces

Measured with CDP `CSS.getPlatformFontsForNode` — the face the engine **rasterised**, not the declared
stack. `getComputedStyle().fontFamily` reports `Urbanist, sans-serif` everywhere and is worthless as
evidence here.

A span containing only `U+20B9`, in the product's own stacks:

| stack | resolved face |
| --- | --- |
| `var(--font-ui)` → `'Urbanist', sans-serif` | **Helvetica** |
| `var(--font-display)` → `'Darker Grotesque', sans-serif` | **Helvetica** |

And in real product text, e.g. `screens/journey-a/risk-profile.html`:

```
"₹1,80,000"   declared Urbanist 13px/600   rastered  Helvetica(1) + Urbanist SemiBold(8)
"₹"           declared Urbanist 16px/600   rastered  Helvetica(1)
"₹18,40,000"  declared Darker Grotesque 24px/500 (journey-f)
                                          rastered  Helvetica(1) + Darker Grotesque Medium(9)
```

**Count: 230 occurrences of `U+20B9` inside 375×812 phones**, across all 13 surfaces — plus 52 more in
board prose. Every single one is one glyph of Helvetica set beside Urbanist digits. The display
figure on `journey-f/review.html`, which the system calls its one display moment, does it too.

This is not cosmetic. Rule 4 is *"Indian number grouping, always"* and the mark that carries the rule
is the one mark neither shipped face contains. The currency symbol and its digits come from different
type designs, at different weights and widths, in a product whose entire subject is money.

**Fix.** Scope a donor face for `U+20B9` with `unicode-range`, vendored in-repo, in
`design-system/tokens/fonts.css:4-8`. Two engineering constraints, both of which have cost a cycle
elsewhere: **Chromium resolves family and weight before applying `unicode-range`**, so declare the
donor at **one weight only** or it becomes the best match for every run at that weight and drops
whole runs to a system face; and **re-measure platform fonts after adding it**. Show the donor's `₹`
beside Urbanist digits at 11, 13, 14, 16 and 24px before accepting it. Today the faces are fetched
from `fonts.gstatic.com` and **nothing is vendored** — `find design-system -name "*.woff*" -o -name
"*.ttf"` returns nothing — so a CDN failure silently drops the whole product to `sans-serif` with no
gate to notice. Vendor both faces in the same change.
**Owner: Rhea (design system) with Dev (iconography) on the donor choice.**

**Related, minor — the same class, smaller blast radius (N-8 below):** `U+22EF` and `U+2713`.

---

## Majors

### N-2 · Two of every artifact footer's three slots are enabled, unnamed, empty buttons
**Parameter D1** (every control has an accessible name) · **major** · 4 surfaces, 45 instances

F-42 fixed the case where a card supplies **none** of `onToggle`/`onWhy`/`onShare`. It did not fix the
case where a card supplies **one** — which is the common case, and is every card with `Expand`.

`design-system/components/cards/ArtifactCard.jsx:37`

```js
const hasFooter = !!(onToggle || onWhy || onShare);   // an OR — one handler renders all three slots
```

`ArtifactCard.jsx:112-113` then render the other two unconditionally:

```jsx
<Pressable onClick={onWhy}   style={slot}>{onWhy   ? label('Why?')  : null}</Pressable>
<Pressable onClick={onShare} style={slot}>{onShare ? label('Share') : null}</Pressable>
```

With `onWhy`/`onShare` undefined, `Pressable` still renders `<button disabled={false}>` with no child.

**Measured** (CDP `Accessibility.getPartialAXTree`, the engine's own name computation): **45 buttons,
role=button, accessible name empty, enabled, in the tab order**, each **105×44** — which is
`(343 − 28) / 3`, the three equal flex slots of a card. Pages:
`journey-b/03-thread-answer.html`, `journey-c/funds.html`, `thread/ledger.html`,
`thread/going-back.html`. Visible at 1× in `shots/funds-empty.png`: the footer reads `Collapse ⌃` in
its left third and the remaining two thirds are blank — those are the two controls.

This is the **fifth** time this system has shipped a `Pressable` nobody can see or name (F-28, F-39,
F-42, F-43).

**Fix.** Gate each slot on its own handler, not on the row:
```jsx
{onWhy   ? <Pressable onClick={onWhy}   style={slot}>{label('Why?')}</Pressable>  : <span style={slot} />}
{onShare ? <Pressable onClick={onShare} style={slot}>{label('Share')}</Pressable> : <span style={slot} />}
```
The `<span style={slot}>` keeps the flex geometry, so no card moves by a pixel. **Regenerate the
footer block rather than patching the two lines** — a regex over this markup is how containers break.
**Owner: Rhea.**

---

### N-3 · Tab escapes the modal drawer — and F-31's own fix is what broke it
**Parameter D4** (focus visible, keyboard path complete; *"the sheet traps, the drawer returns focus"*)
· **major** · `screens/prototype.html` (the live surface), and every screen that opens the drawer

Driven live. Focus order out of the open drawer:

```
#21/25  button "VS Vikram Shah"
#22/25  button "See all 10"
#23/25  button "Back to home"
→ Tab #24  button.ds-pill "Restart"   OUTSIDE THE DIALOG
```

**Cause, measured not deduced.** `design-system/components/shell/Drawer.jsx:47`:

```js
ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
```

`:not([tabindex="-1"])` qualifies **only the `[tabindex]` branch**. A `<button tabindex="-1">` matches
the bare `button` selector and is counted. The filter beside it excludes `disabled` and
`aria-hidden`, but not `tabindex="-1"`.

Printed side by side on the live drawer:

```
the trap counts 25 nodes.
  #24  button tabindex=-1  54x32  "Appearance: Light"   browser will Tab to it: false
  #25  button tabindex=-1  52x32  "Appearance: Dark"    browser will Tab to it: false
trap thinks LAST is        : #25 "Appearance: Dark"
the browser's real last is : #23 "Back to home"
```

So `active === last` is never true, the trap never fires, and focus walks out of an `aria-modal="true"`
dialog. **The `tabIndex={-1}` on those two pills is F-31's fix** — the locked `SegmentedRow` was made
*inert rather than disabled* precisely so it would keep its selection visible. That was right; this is
its unnoticed consequence.

**The same line exists in all three dialogs** — `ConfirmSheet.jsx:62` and `ExplainerSheet.jsx:48` are
character-identical. Measured on the boards, the confirm sheets currently have
`trapCounts == tabbable == 2`, so **the defect is latent there and only fires on the Drawer today**.
It will fire on any sheet that ever contains an inert control.

**Fix**, in all three files, in one change:
```js
const nodes = Array.prototype.filter.call(
  ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]'),
  (n) => !n.disabled && n.getAttribute('aria-hidden') !== 'true' && n.tabIndex >= 0);
```
`n.tabIndex >= 0` is the engine's own answer and covers the `button[tabindex="-1"]` case the selector
cannot. Add an assertion to the audit harness that the trap's `last` is the browser's last tabbable.
**Owner: Rhea. Regression test owner: me.**

---

### N-4 · The ask bar's text field is a 20px touch target, on every screen in the product
**Parameter D3** (targets ≥ 44pt, measured not declared) · **major** · all 13 surfaces, 89 phones

`design-system/components/composer/Composer.jsx:20-21` — the `<input>` carries no height and no
padding; it renders at its `--leading-20` line box. The wrapper has no click handler to focus it.

**Measured by `elementFromPoint`, binary-searched to 0.25px: box 317×20, effective hit 128⁺×21.**
(128 is the probe's search cap — width is fine.) The advisor's finger has a 20px band on the single
most-used control in a chat-led product; the 12px of composer padding around it does nothing, because
nothing routes those taps to the field.

**Fix.** Either give the input `minHeight: 'var(--h-touch)'` with the padding rebalanced so the
composer box does not grow, or — cheaper and with zero visual change — put
`onMouseDown={(e) => { e.preventDefault(); inputRef.current.focus(); }}` on the composer wrapper so
the whole 44⁺pt bar focuses the field. The second is what the drawn design already implies.
**Owner: Rhea.**

---

### N-5 · The paperclip is 42×42 and explicitly opts out of the hit extension
**Parameter D3** · **major** · all 13 surfaces, 75 instances

`design-system/components/composer/Composer.jsx:31`

```jsx
<Pressable onClick={…} label={attachLabel} expand="none" style={disc}>
```

`disc` is `width: 42, height: 42`, and `expand="none"` switches off the one mechanism that would take
it to 44. **Measured 42.9 × 42.9** — 1.1pt short in both axes, on every screen.

The Send and Stop buttons beside it are raw `<button>`s at the same 42×42 (`Composer.jsx:41,43`), not
`Pressable`s, so they have no extension either.

B2 is otherwise clean and worth saying with its number: **84 live paperclips, 0 inert** across the 89
phones — F-16's `DEAD PAPERCLIP` gate is holding.

**Fix.** Drop `expand="none"` from `Composer.jsx:31`; `Pressable` computes `(44 − 42)/2 = 1` and the
disc still *draws* at 42. For Send/Stop, wrap them in `Pressable` or give them the same
`::before`. Nothing moves visually.
**Owner: Rhea.**

---

### N-6 · The standing compliance disclosure measures 2.52:1 — it is present, and it is not legible
**Parameter H1** (*"present and legible, not buried"*), and **proposed parameter D5** · **major** ·
all 13 surfaces, 92 runs

`design-system/components/text/StandingDisclosure.jsx:8` sets
`color: var(--color-data-deemph)` `#a39a91` at `--text-11` on `--color-canvas` `#f6f4f1`.

**Measured 2.52:1. WCAG 2.2 AA needs 4.5:1 for 11px text.** It is the most-repeated element in the
product — one line under the composer on every artboard — and it is the line that says *"Sentinel
assists an advisor · not investment advice"*. Visible at 1× in every shot in `shots/`: it reads as a
watermark.

Its own source also says `[PLACEHOLDER — compliance to supply]`, so H1's wording is still open.

**Fix.** `--color-muted` on canvas measures above 4.5:1 at this size; changing the *token reference*
in `StandingDisclosure.jsx:8` is a legibility fix, not a restyle, but it does change what the line
looks like — so it is **a ruling for the owner, not a patch**. Put both renderings in front of him.
**Owner: Ashish to rule; Rhea to land.**

---

### N-7 · No surface draws an offline state
**Parameter F1** (ideal · empty · loading · partial · error · offline, on the current design) ·
**major** · 0 of 13 surfaces

Read from the boards' own phone captions — 89 phones, the state each screen claims to have drawn.
Full inventory in the appendix.

**How to read this table.** Mapping a caption to one of F1's six is *my* reading, and the
`ideal`/`partial` boundary in particular is arguable — *"only one has a cost"* is a partial answer and
also the screen working correctly. The counts below are therefore given with the caption that earns
each one, so the reading can be checked. **Only one row is unambiguous, and it is the finding:
`offline` is 0.**

| state | surfaces | the captions that earn it |
| --- | --- | --- |
| ideal | 12/13 | *typical* · *the review itself* · *the ledger* · *the four rows* · *the standing answer* · *how far?* — all but `going-back`, whose every phone is a correction state |
| error | 8/13 | *artifact failed* · *above the mandate ceiling* · *one section failed* · *a rejected row, opened* · *the ceiling, stated* · *book unavailable* · *marked wrong* |
| loading | 7/13 | *filling* · *committing* · *in flight* · *thinking, between two questions* · *loading* · *sent* · *the query, before the results* |
| partial | 7/13 | *the mix, and what is missing* · *asking for the uncosted one* · *only one has a cost* · *the finding is a missing figure* · *the overlap, unavailable* · *three revisions, one of them sent* |
| empty | 2/13 | `drawer` *first run* · `funds` *nothing matches* |
| **offline** | **0/13** | — |

`empty` at 2/13 is worth a second look on its own (**F3**: *empty says what to do, not "no data"*).
Both drawn instances pass it well — `funds` reads *"Nothing matches every filter. / Drop one and I
will widen the search."* (`shots/funds-empty.png`), which is an instruction, not a shrug. The gap is
that nine surfaces never draw the advisor's first day at all.

The nearest neighbours are `05-decide` *"sent, and no answer"* and `03-thread-answer` *"artifact
failed"*. Both are **failure of response**, not **loss of connectivity** — and for this product they
are not the same thing. R2 and E4 make the distinction the whole point: an advisor who has tapped
Approve and then lost the network needs to know whether the instruction reached the exchange. "Sent,
and no answer" answers that; "you are offline" does not exist anywhere.

Journey B and E move real money, so this is where it matters.

**Fix.** Draw `offline` on `journey-b/05-decide.html` and `journey-e/rebalance.html` first — the two
surfaces that place money — and say in the copy which side of *sent* the advisor is on.
**Owner: Aarav (states) with Meher (copy).**

---

## Minors

### N-8 · Three more marks fall back, two of them inside phones
**Parameter A4 / Gate 0 mark inventory** · **minor** · 2 surfaces

Codepoints, not glyphs, deliberately.

| mark | in `--font-ui` | in `--font-display` | inside phones | drawn by |
| --- | --- | --- | --- | --- |
| `U+22EF` | 蘋方-簡 (PingFang SC) | 蘋方-簡 | **24** | `lists/ListRow.jsx:54`, `cards/ArtifactCard.jsx:58` — typed as text at `--text-16`/bold |
| `U+2713` | Lucida Grande | Lucida Grande | **2** | `screens/journey-c/funds.html:42,71` — `'On your shelf ✓'` |
| `U+2715` | Zapf Dingbats | Zapf Dingbats | 0 (board prose only) | `Pill removable` (F-43) — not in a rendered state on these 13 surfaces |
| `U+2248` `U+2264` `U+2265` | Urbanist ✓ | **Helvetica** | 0 | display face only |

`U+22EF` is the artifact-card and row **menu affordance** — it is an icon wearing a font glyph's
clothes, and it currently renders in a CJK face. The system's own rule (`Pressable.prompt.md:4`) is
*"glyph → label required"*; the mark inventory rule is that every non-ASCII mark is ruled **font
glyph or drawn icon** before components consume it.

**Fix.** Rule `U+22EF` a **drawn icon** — a 3-dot SVG in `components/icons/`, 16×16, matching the
family's stroke — and replace both call sites. Rule `U+2713` the same way, or scope it to the donor
face from N-1. `U+2248/2264/2265` only matter if the display face ever sets them; today it does not.
**Owner: Dev (iconography).**

### N-9 · `SuggestionRow` is a 42px target, and the token file says it should not be
**Parameter D3** · **minor** · 3 surfaces, 15 instances

`design-system/components/actions/SuggestionRow.jsx:9` is a raw `<button>` with
`height: 'var(--h-row)'` (42px) and no `Pressable`, so no `::before`. **Measured 319 × 42.**

The 42 is deliberate and documented — `--h-row` is published as *"SuggestionRow, AllocationCard
rows"*. What is not documented is the target being 42: the same file publishes `--h-touch: 44px` as
*"the floor. **Pressable** and **Pill** extend to 44 with a pseudo-element"*, naming the two
mechanisms and asserting this row uses one. It does not. These are the three rows on Home — the first
thing the advisor touches.

**Fix.** Wrap in `Pressable` (it computes `(44 − 42)/2 = 1`), or add
`className="ds-pressable" data-hit` with `--hit-y: 1px`. The row still draws at 42.
**Owner: Rhea.**

### N-10 · `Edit` is a 23px-wide target, and its 44pt height is nominal
**Parameter D3, and C2** (*a 44pt target is not spacing*) · **minor** · 6 surfaces, 28 instances

`design-system/components/chat/MessageActions.jsx:22` sets `minHeight: TARGET` (44) and
`padding: ${OVERHANG}px 2px` — correct vertically, and **no `minWidth`**. "Edit" measures
**23.3 wide**.

And the 44 is nominal: `MessageActions.jsx:19` pulls the row back with `margin: -14px 0`, so each
button's 44pt box **overlaps its neighbours** and whichever paints later wins the hit test.
**Measured effective heights: 42, 39.6, 39, 33** across the six surfaces — never 44.

This is C2's own lesson one turn further on. F-44 correctly made the overhang arithmetic; the
arithmetic assumed nothing else would claim the overlap.

**Fix.** `minWidth: TARGET` on the button, and let the row's `gap: var(--space-16)` absorb it — the
ink does not move, because the label stays centred. For the vertical overlap, give the row
`position: relative; z-index: 1` so its targets win over the bubble above, or reduce the negative
margin to the point where the boxes stop overlapping the neighbours' targets.
**Owner: Rhea.**

### N-11 · `Pressable` measures its box once and never again — two identical rows, two different floors
**Parameter D3** · **minor** · systemic

`design-system/components/actions/Pressable.jsx:38-42` computes the pad in a `useEffect` with deps
`[expand, children]`. Nothing re-measures on reflow, so a control whose height changes after mount
keeps a pad computed for the old height.

**Measured on `screens/journey-c/funds.html`, two instances of the same component on the same page:**

```
"HDFC Flexi Cap — details"          box 148x18   --hit-y 13.36px   → total reach 40.5
"Parag Parikh Flexi Cap — details"  box 148x18   --hit-y  4.72px   → total reach 28.0
```

Same component, same size, two different floors. `4.72` is `(44 − 34.5)/2` — the pad for a box that
was 34.5 tall at mount and is 18 now.

**Fix.** Re-measure with a `ResizeObserver` on `ref.current`, the way `DataTable` already does for its
scroller (F-37). Or compute the floor in CSS and stop measuring in JS:
`min-height: var(--h-touch)` on the `::before` is a floor that cannot go stale.
**Owner: Rhea.**

### N-12 · A 14px control can never reach 44 wide, by construction
**Parameter D3** · **minor** · `journey-c/funds.html`, 4 instances

`design-system/components/actions/Pressable.jsx:43`

```js
setPad({ y: Math.max(0, (44 - box.height) / 2),
         x: Math.max(0, Math.min(12, (44 - box.width) / 2)) });
```

The **x pad is capped at 12**. A 14×14 `InfoDot` therefore reaches `14 + 24 = 38` at best.
**Measured 38.9 × 45.5** on *"How is Expense ratio worked out?"* and three siblings — height fine,
width 5pt short, and no amount of correct authoring can fix it from outside.

The cap exists for a reason — an unbounded horizontal expansion on a wide row would swallow its
neighbours. But at 14px it makes the guarantee unkeepable while the component reports success.

**Fix.** Keep the cap, and make the component **say so**: when `(44 − box.width)/2 > 12`, warn in
development that the caller must give the control a wider box. Then give `InfoDot` a 20px box, which
reaches 44 within the cap.
**Owner: Rhea.**

### N-13 · Where the floor is present, neighbours eat it — 52 controls
**Parameter D3** · **minor** · 3 surfaces

The `::before` is there and the reach is still short, because an adjacent element is painted over it.
Named, not inferred:

| control | wants | got up / down | total | who takes it |
| --- | --- | --- | --- | --- |
| `Switch — details` (ledger rows) | ±13.36 | 14 / 8.5 | **40.5** | the next row — `<button.ds-pressable> 104x18 "SIP change"` |
| `Period: Sep` · `Q2` · `FY 26-27` | ±6.64 | 0.5 / 1.5 | **34** | a later sibling `<div> 315x411` painted over the pill row |
| `Time range: 1Y` · `3Y` · `5Y` | ±6.64 | 0.5 / 1.5 | **34** | a later sibling `<div> 287x425` |
| `Remove Flexi cap` | ±6 | 6.5 / 1 | **39.5** | the next pill — `<button.ds-pill> "On your shelf ✓"` |
| `This answer was right` (28×28) | ±8 | — | **40 wide** | its own twin beside it |

The rule this needs, and the system does not yet have: **a row of extended controls needs a gap of at
least 2 × the extension, or the control is 44.** Two 18px rows with a 13.36 floor need 26.7 between
them; they have less, so they split the overlap.

**Fix.** Two changes, both small. Give the extended control `z-index: 0` relative to its siblings so a
later plain `<div>` cannot paint over its `::before` (the pill-row cases — 9 controls at 34). And for
stacked rows, set the row gap to `calc(2 * var(--hit-y))` or make the row itself 44.
**Owner: Rhea, with me to add the gap assertion to `check-previews`.**

### N-14 · Danger ink on the peach status surface is 3.9:1 — rule A2's own pairing fails AA
**Proposed parameter D5**, and **A2** · **minor** · 4 surfaces, 10 runs

`--color-danger` `#b4552f` at 10px/700 on `--color-status-over-bg` `#f3e2da` = **3.9:1**; 10px text
needs 4.5. Sample: *"artifact failed"*. Rule 2 is right — a red fill would be a lie about the stakes —
but the eyebrow that carries it does not clear AA at 10px.

Also measured, and a hair rather than a finding: `--color-danger` on `--color-canvas` at 11–13px =
**4.47:1** against a 4.5 requirement, 26 runs, including *"Not costed. I need the purchase dates"* on
`journey-e`. It misses by **0.03**.

**Fix.** Darken `--color-danger` by the smallest step that clears 4.5 on both surfaces, or promote the
10px eyebrow to 11px bold. The first is a token change and a ruling; the second is not.
**Owner: Ashish to rule; Rhea to land.**

### N-15 · Five strings have 0px of slack
**Parameter C4** (no text clipped or truncated unless declared) · **minor** · 2 surfaces

From the repo's own `TIGHT` warning — reported here because it is a finding, not noise. CI renders on
Linux, where this face measures wider than on macOS, so 0px here is a truncation there.

```
journey-c/funds.html   "HDFC Flexi Cap"                        83 in 83
journey-c/funds.html   "Parag Parikh Flexi Cap ↔ HDFC Flexi…"  251 in 251
shell/drawer.html      "₹25 L proposal"                        91 in 91
shell/drawer.html      "R. Sharma"                             64 in 64
shell/drawer.html      "Mr. Amit Aggrawal"                     117 in 117
```

**Fix.** Shorten the copy or widen the box before CI does it for you. **Owner: Meher (copy).**

---

## Gate 4 · The craft read at 1× — what looking found that measuring did not

Six phones shot at 375×812 with `tools/phone-shot.mjs` and read at full size. Probes measure; they do
not look. Only what I could actually see is below.

**The two-second read, in plain words:** *this is a careful colleague, not a dashboard.* The register
is unusually honest for a money product — `rebalance` phone 3 says **"I can size it and I cannot cost
it… I will not put a figure on it, and I will not let you approve it without one"**, and offers *Ask
the RTA for the dates* beside *Take the one I can cost*. That is E1 and E5 done properly, and it is
the best thing on these thirteen surfaces. `05-decide` phone 5 separates **sent** from **placed** per
move — *"Sent · waiting for the exchange"*, Move 1 filled, Move 2 pending — which is E4 drawn rather
than described. The typography is consistent, the cards share one edge, nothing is decorative.

Three things are visible at 1× that no probe reported:

1. **The standing disclosure genuinely reads as a watermark.** N-6 measures it at 2.52:1; at 1× it is
   the thing you have to hunt for on every single shot. Seeing it is what makes the number a finding
   rather than a number.
2. **The `⋯` menu reads in a different face.** On `shots/funds-empty.png` the three dots sit wider
   and rounder than the Urbanist text beside them — that is N-8's PingFang SC fallback, visible.
   And on the same card the footer reads `Collapse ⌃` in its left third with the right two thirds
   blank: that blankness *is* N-2's two unnamed buttons.
3. **`journey-f/review.html` phone 1 shows "QUESTION 1 OF 1".** A progress rail counting one of one
   is a progress indicator with nothing to progress through. No parameter covers it — it is a
   **G1/G3 observation** (*why does this exist; what does the advisor do next*), not a defect. Worth
   a ruling: either suppress the rail at a single step, or say what the second question would be.
   **Owner: Ashish.**

**One thing I deliberately did not report.** Every thread phone carries a large empty band above the
turn — roughly 200–310px of bare canvas on Home and on `review` phone 1. It looks like wasted space
and it is not: the thread is bottom-anchored to the composer, so a short conversation sits low by
design, and on Home there is no conversation at all. Measured before judging, as F-44's four rewrites
taught. Not a finding.

**Gate B is not complete.** The side-by-side against `refs/ashish/` has not been built and Ashish has
not ruled on it, so the craft verdict is **mine only, and provisional**. An auditor cannot pass a
craft audit alone.

---

## Notes, stated with their numbers so they are not re-reported

- **Courier is board chrome, not the product.** 118 monospace text runs (1,481 characters) across the
  13 boards, and **0 of them inside a phone**. The annotation prose sets `monospace` for file paths
  and token names; the engine resolves it to Courier. The system ships no mono face, so this is the
  boards' own typography and is outside the product. Worth one line in the board stylesheet binding
  `code` to `--font-ui` with tabular figures, if the boards are ever shown to a client.
- **`CLAUDE.md` says 82 pages; the tree renders 94.** `check-previews` reports `94/94`. The roadmap
  line in `CLAUDE.md` ("82/82 pages render clean (75 system + 7 screens)") is stale.

---

## Gates that are clean — with the measurement, because a clean gate is worth as much as a finding

| Parameter | Measurement |
| --- | --- |
| **D2 · no control inside a control** | **0 nested interactive controls in 972 visible controls** across 13 surfaces. `ArtifactCard`'s sibling-behind press target works exactly as its header claims — 11 controls are covered at their centre and fully reachable at their edges. |
| **A3 · a composer on every screen** | **89 of 89 phones carry a composer.** The documented exception holds: both confirm sheets (`Approve · R. Sharma` 375×622, `Send · Mr. Amit Aggrawal` 375×570) contain **0** composer inputs, and both are `role="dialog" aria-modal="true"`. |
| **B2 · the paperclip is real** | **84 live, 0 inert** across 89 phones. |
| **B5 · nothing pinned above the composer** | `PINNED CHIPS` / `PINNED CTA` gate silent across all 94 pages. |
| **C1 · a card is padded on four sides** | `BOTTOM-FLUSH` silent across all 94 pages — F-44's fix holding. |
| **C3 · gutter ≥ 16** | Clean on every screen; 5 edge-anchored elements declared on `shell/drawer.html`, 1 declared truncation. |
| **F-27 · the scrim** | Measured `opacity: 0.4` on both live confirm sheets — the declared `--scrim-sheet`, not the 1.0 that F-27 found. |
| **D4 · focus return** | Drawer: opener `button[aria-label="Menu"]` → focus moved into the dialog → Escape removed it → **focus returned to `Menu`**. Proven across two rendered states. |
| **D4 · focus order** | On the live prototype: `Screens › · Menu · New thread · 3 suggestion rows · 3 chips · composer · Attach · Restart`. Every one of the first 14 stops announces a name. Composer is stop #10, Menu #2. |
| **Render currency** | `_ds_bundle.js` rebuilt byte-identical. |

---

## Properties these probes could not see — named, with an owner

Silence is not a pass. Each of these is an open item, not a caveat.

1. **The confirm sheet's Tab trap is UNAUDITED on a live surface.** Twelve of the thirteen surfaces
   are **boards** — grids of stills — and a still has no keyboard, so a trap is *unauditable* there,
   not merely unaudited. On `screens/prototype.html`, the one live surface, no confirm sheet could be
   driven to from Home in one step. What I can say from the boards is narrower and worth having: both
   sheets' trap node lists contain exactly the 2 nodes the browser will Tab to, so **N-3's defect is
   latent rather than live in them**. **Owner: me — drive the sheet from the prototype's router next
   run.**
2. **Scroll anchoring and the derived bottom padding are UNAUDITABLE on these surfaces.** No phone on
   any of the 13 contains an overflowing scroll container; the board scrolls, the phone does not.
   Measured: the one candidate carries `class="noscroll"`. So "the thread carries the scroll" and
   "the scroller's bottom padding ≥ the dock's measured height" are claims no artboard can settle.
   Do **not** retrofit a scroll model into a board to make this pass. **Owner: Vikram — prove it in
   the build.**
3. **Reflow at 130% / 200% text and at 320px was not run.** Out of scope for this pass; named because
   130% is the one that catches real phones, and N-15's five 0px-slack strings are exactly the
   population it would break first. **Owner: me.**
4. **Colour-blindness and sunlight simulations were not run.** A1 is satisfied structurally — every
   status carries a word — but that was read, not simulated. **Owner: me.**
5. **What this probe counts twice:** a text run inside an element that also contains an inline `<code>`
   is reported with *both* faces (`Urbanist(452) + Courier(9)`), because
   `CSS.getPlatformFontsForNode` reports the whole layout subtree. I separated product from prose by
   phone containment instead, which is why the in-phone counts (230 / 24 / 2 / 0) are the numbers to
   trust and the raw face tally is not.
6. **What this probe is still blind to:** anything below a board's fold is excluded from hit-testing
   rather than guessed at — this run had **0 offscreen controls** because the viewport is grown to the
   document before measuring, but the exclusion is the mechanism and it is worth knowing it is there.
   It also cannot see a state that is not drawn: N-7 is only visible because the boards caption
   themselves.

---

## Appendix — state inventory, read from the boards' own captions

| surface | phones | captions |
| --- | --- | --- |
| `journey-a/risk-profile` | 8 | live · run the whole journey · a question, with a smart chip · a money question · edit the last answer · a detour — she asked something else · an interjection · thinking, between two questions · the result |
| `journey-b/01-home` | 4 | typical · book unavailable · short name · long name |
| `journey-b/03-thread-answer` | 10 | typical · as the answer lands · typical · scrolled down · live · tap everything · expanded · the table view · filling · artifact failed · trace reopened · editing the question · a file the advisor attached |
| `journey-b/05-decide` | 9 | typical · live · decide it · the sheet, open · committing · in flight · one placed, one rejected · sent, and no answer · approved · the note, drafted |
| `journey-c/funds` | 6 | live · drop a filter, open a fund · the query, before the results · the table · a fund, opened in its row · nothing matches · the overlap, unavailable |
| `journey-d/proposal` | 11 | the amount · the ceiling, stated · the mix, and what is missing · draft · a fund, opened · saved · the four rows · the confirm · sent · the versions · live · run the four steps |
| `journey-e/rebalance` | 9 | how far? · only one has a cost · asking for the uncosted one · draft · saved · the confirm · in flight · placed · live · run it |
| `journey-f/review` | 8 | what is this for? · the review itself · the finding is a missing figure · her annual record · a meeting with her · before she invests more · saved to her file · live · pick an audience |
| `thread/ledger` | 3 | the ledger · a rejected row, opened · live · open a row, take the file |
| `thread/refusals` | 7 | above the mandate ceiling · an instruction that would act · not understood · out of scope · a name with no intent · the standing answer · live · miss twice and it offers itself |
| `thread/going-back` | 7 | not rated · marked wrong · follow-ups under the answer · both, together · three revisions, one of them sent · live · revert one · a journey, paused behind the conversation |
| `shell/drawer` | 6 | typical · at the top · live · opens the real way · first run · loading · one section failed · long client name |
| `prototype` | 1 | live |

---

## Fix list by owner

**Rhea (design system)** — N-1 (donor face + vendoring), N-2 (footer slots), N-3 (trap node list ×3
files), N-4 (composer field), N-5 (paperclip + send/stop), N-9 (SuggestionRow), N-10 (Edit width and
z-order), N-11 (stale pad), N-12 (x-cap warning + InfoDot box), N-13 (row gap and z-index).

**Dev (iconography)** — N-8: rule `U+22EF` and `U+2713` drawn icons; draw them.

**Aarav (states) + Meher (copy)** — N-7: offline on `05-decide` and `rebalance` first.

**Meher (copy)** — N-15: five strings at 0px slack.

**Ashish (rulings)** — N-6: the disclosure's colour is a legibility fix that changes how the line
looks. N-14: `--color-danger` darkened, or the 10px eyebrow promoted to 11.

**Me** — drive the confirm sheet from the router; reflow at 130/200/320; colour-blindness and sunlight
simulations; a `check-previews` assertion that a dialog's trap `last` is the browser's last tabbable,
and one that a row of extended controls has a gap ≥ 2× its extension.

---

## Freeze

**Refused.** Not close, and the specific unmet items are:

1. **Gate 0 fails** — N-1. A currency mark outside both shipped faces, and no face vendored at all.
2. **Every state audited on the current design** — `offline` is drawn on 0 of 13 surfaces (N-7).
3. **Behaviour truth unsettled** — the confirm sheet's trap and scroll anchoring are named unaudited,
   and the drawer's trap is a live defect (N-3).
4. **Gate A is not clean** — 1 blocker and 6 majors against a bar of zero blockers and ≤2 majors.
5. **Gate B is not accepted** — the 1× read is done, the side-by-side against Ashish's references has
   not been built and he has not ruled on it.

Probes, fixtures and shots: `studio/audit-2026-09-19/probes/`, `studio/audit-2026-09-19/shots/`.
Re-run: `node probes/probe.mjs --json real.json` · `node probes/names-cdp.mjs` ·
`node probes/behaviour.mjs` (`--break 2|3` to watch it fail) · `node probes/occluder.mjs` ·
`node probes/states.mjs` · `node probes/a3.mjs`.
