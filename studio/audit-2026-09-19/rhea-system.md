# The system audit — drift, contract truth, duplication, coverage, dead surface

**19 Sep 2026 · Rhea, Design Systems Architect · Fable Design Studio**
Audited against `studio/audit-2026-09-19/parameters.md`. Every finding carries its parameter id.

---

## What was measured, before anything was judged

Numbers, not estimates. Each is reproducible from the command beside it.

| Measure | Count | How |
|---|---|---|
| Components in the index | **88** | `pages/_index.json` `rows.length` (89 `.jsx` on disk; `data/chartMath.jsx` is a maths module with no `.d.ts` and is correctly not a row) |
| Shipped (has a spec page) / building / specified | **45 / 43 / 0** | `_index.json` `counts` |
| Components with `literals: 0` | **35 of 88** | `_index.json` |
| Raw style literals, total | **303**, across **53** components | summed from `_index.json` |
| Components carrying a value off **every tier** of Sentinel's own scale | **9** | measured against `references/scale.md`'s three tiers, not a 4/8pt grid |
| Components that appear on a screen (transitive) | **74 of 88**; 14 do not; **4** of those 14 have a spec page | `node tools/check-parallel.mjs --list` |
| Page-less components that a screen already uses | **33 of 43** — **25** once `Icon*` is excluded per contradiction 46 | `_index.json` × the parallel graph |
| `.prompt.md` coverage | **85 of 88** | `ls components/*/*.prompt.md` |
| Pages rendering clean | **94 / 94** | `node tools/check-previews.mjs` (run 19 Sep; 5 pre-existing `TIGHT` copy warnings, no errors, no 404s, nothing failing to mount) |
| Renderers defined inside a single `screens/*.html` page | **59**, across 15 React pages | read, page by page |
| Rows in `guidelines/contradictions.md` | 60 numbered; **2 structurally malformed** | parsed |

**Four counts in `CLAUDE.md` are now stale** and understate the work done — recorded here so the next
session does not audit against them: `literals`-clean is **35 of 88**, not "33 of 86"; spec pages are
**45 of 88**, not "43 of 86"; `report:parallel` is **74 of 88**, not "44 of 86"; `check-previews` renders
**94** pages, not 82. `docs/FINDINGS.md` runs to **F-44**, not F-38.

---

## The three to fix first

Each is the same class the system itself named in contradiction 53: *a claim in a comment that the build
did not keep*. Each was rendered and measured, not read.

### 1 · Pill's loading spinner has no keyframe, so it does not spin — anywhere

**C6 · Blocker · `Pill` (26 screens, the most-placed component in the product)**

`design-system/components/actions/Pill.jsx:33` animates `ds-spin`:

```jsx
<span style={{ display: 'inline-flex', width: 13, height: 13, flexShrink: 0, animation: 'ds-spin 900ms linear infinite' }}>
```

The only definition of `@keyframes ds-spin` in the whole system is inside `IconSpinner`'s own local
`<style>` at `design-system/components/icons/IconSpinner.jsx:7`. `Pill` does not render `IconSpinner` —
it draws its own copy of the same Lucide `loader-circle` arc at `Pill.jsx:34`. And `IconSpinner` is on
**zero screens** (`check-parallel --list`), so in the product the keyframe is never in the document.

**Measured, not inferred.** On `pages/Pill.html`: `@keyframes ds-spin` defined **0 times**, three elements
declaring `animation-name: ds-spin`, `element.getAnimations().length === 0` on all three, `transform: none`.
Then on a built screen — `screens/thread/ledger.html`, tapping the Download control that
`DownloadAction.jsx:20` wires to `Pill loading` — the spinner renders, `getAnimations().length === 0`,
`transform: none`. The only keyframe name defined on that document is `ds-artifact`.

So the advisor taps Download and watches a frozen arc. This is `ArtifactCard`-class: the component blamed
was not the component at fault.

Three separate rules are broken at once:

- **`rules.md` — "A global rule does not live inside a component."** `ds-spin` is identical for every
  instance. Contradiction 55 fixed exactly this shape for `Pressable` and moved its rules to
  `tokens/effects.css`; `ds-spin` was not moved.
- **The cancelling rule is global while the defining rule is not.** `MotionGuard.jsx:20` ships a
  reduced-motion `ds-spin` override from the bundle. Under reduced motion `Pill` gets a defined (no-op)
  keyframe; under normal motion it gets nothing. That is backwards.
- **B6 · duplication.** The same arc path `M21 12a9 9 0 1 1-6.219-8.56` is drawn twice —
  `IconSpinner.jsx:9` at `strokeWidth 1.5` and `Pill.jsx:34` at `2.6` — with the same `900ms linear`.

**Fix.** Move `@keyframes ds-spin` and its reduced-motion redefinition into `tokens/effects.css` beside
`sentinel-shimmer` and `dot-pulse`, delete the local `<style>` from `IconSpinner.jsx:7`, and have `Pill`'s
`Spinner` render `<IconSpinner size={13} stroke={fg} />` rather than a second copy of the artwork. Then
re-measure `getAnimations().length` on `pages/Pill.html` and on `screens/thread/ledger.html`.

Separately, `900ms` and `linear` are both off-token — see finding 9.

### 2 · F-31 was closed on one component and is still live on its twin

**B7 · Blocker · `RangePills` (5 screens, shipped spec page)**

`docs/FINDINGS.md:683` records F-31 fixed on 19 Sep: a locked `SegmentedRow` passed `disabled` to
`Pressable`, `Pressable` renders `opacity: 0.4`, and `--color-selected` composited through 0.4 matched the
unselected pill — *"the row stopped showing which theme is on."* It was fixed by making locked **inert**:
no handler, `tabIndex={-1}`, `aria-disabled`.

`RangePills` has the identical `locked` prop and still does the old thing.
`design-system/components/actions/RangePills.jsx:25`:

```jsx
<Pressable key={r} onClick={locked ? undefined : () => onChange && onChange(r)} disabled={locked} pressed={on} …>
```

**Measured on the shipped `pages/RangePills.html`.** Both locked rows: every pill `opacity: 0.4`,
`disabled: true`, `aria-disabled: null`. The selected pill's background is `rgb(235,212,195)` —
`--color-selected` — rendered through 0.4. Bit for bit F-31's measurement, one component over.

The contract says the opposite in two places: `RangePills.d.ts:7-8` — *"The row renders inert and says why"*
— and `Pressable.d.ts:19-20`, which defines the word: *"Renders INERT rather than disabled … WITHOUT the
0.4 dimming `disabled` carries."* `SegmentedRow.jsx:14-18` carries the record of this defect being fixed
there. So the system holds the correct pattern, the correct word and the correct measurement, and this
component uses none of them.

**Fix.** Copy `SegmentedRow`'s shape exactly: `onClick={locked ? undefined : …}`,
`tabIndex={locked ? -1 : undefined}`, `aria-disabled={locked || undefined}`, drop `disabled`. Re-measure
the selected pill at `opacity: 1`, `rgb(235,212,195)`. Then reopen F-31 in `docs/FINDINGS.md` with the twin
named, so "none open" means it.

### 3 · Composer's default placeholder is the string the 19 Sep ruling deleted

**G1 / B6 · High · `Composer` (17 screens)**

`design-system/components/composer/Composer.d.ts:1-4` records the ruling and dates it:

> *HOME SHORTENED 19 Sep 2026: it read "Ask Sentinel about a client, a fund, or a plan", which is three
> examples sitting 55pt under three starter chips that are the same three examples … The chips carry the
> examples; the placeholder names the product once.*

`design-system/components/composer/Composer.jsx:9` still ships it as the default:

```jsx
export function Composer({ value = '', onChange, onFocus, onSend, placeholder = 'Ask Sentinel about a client, a fund, or a plan', … })
```

Every caller that omits `placeholder` renders the retired copy. `screens/journey-b/home.jsx:65` escapes it
only by passing the short string by hand — which is the duplication contradiction 37 logged
(*"the default duplicates the map's `home` entry"*). **What is new is that the two no longer merely
duplicate — they now disagree**, because the map moved on 19 Sep and the default did not follow. Row 37
described a redundancy; today it is a contradiction.

**Fix.** Set the `.jsx` default to `'Ask Sentinel'`, then amend contradiction 37 to say the default is now
`COMPOSER_PLACEHOLDER.home`'s value rather than a second copy of it.

---

## Pass 1 · DRIFT (C5) — the literals, and which already have a token

303 literals across 53 components. Ranked by **screens the component is on**, because a literal on 26
screens is 26 chances to drift and a literal on 3 is 3.

### 1A · A literal with a token that already exists — this is the finding

| Sev | Component | Screens | file:line | The literal | The token that exists |
|---|---|---|---|---|---|
| High | **Pill** | **26** | `actions/Pill.jsx:4` | `{ md: { h: 36, px: 13, font: 12, lh: 18 }, sm: { h: 32, px: 12, font: 12, lh: 16 } }` | **all seven**: `--h-chip` 36 · `--h-filter-chip` 32 · `--space-13` · `--space-12` · `--text-12` · `--leading-18` · `--leading-16` |
| High | **TopBar** | 18 | `shell/TopBar.jsx:12,14` | `padding '12px 16px'` | `--space-12`, `--gutter` |
| High | **Composer** | 17 | `composer/Composer.jsx:15,16` | `width: 42, height: 42` ×2 | `--h-icon-btn` (42px) |
| High | **StatusSpacer** | 17 | `shell/StatusSpacer.jsx:11` | `height: 44`, `padding '0 24px 0 6px'` | `--h-status` (44px — the token is named for this component) · `--space-24` · `--space-6` |
| High | **ArtifactCard** | 16 | `cards/ArtifactCard.jsx:30,57` | `height: 44`, `width: 44, height: 44` | `--h-touch` |
| High | **ArtifactCard** | 16 | `:47,55,61,75,82,95,107,108` | `10px` · `'12px 6px 12px 14px'` · `'0 14px'` · `'2px 14px'` · `'14px 14px'` · `'12px 14px 0'` · `'0 14px'` | `--space-10 / -12 / -6 / -14 / -2` — every one |
| High | **UserBubble** | 14 | `chat/UserBubble.jsx:25` | `borderRadius: editing ? 'var(--radius-20)' : '20px 20px 6px 20px'` | `--radius-20`, `--radius-6` — **the same line uses the token in one branch and the literal in the other**, and `--radius-6`'s own comment reads *"bubble tail corner"* |
| High | **QAPair** | 6 | `chat/QAPair.jsx:10` | `borderRadius: '20px 20px 6px 20px'` | same pair, second copy |
| Med | **ExplainerSheet** | 10 | `cards/ExplainerSheet.jsx:69` | `zIndex: 30`, `borderRadius: '24px 24px 0 0'`, `padding '12px 20px 28px'` | `--z-modal` (30) · `--radius-24` (*"bottom sheet top corners"*) · `--space-12`, `--space-20` |
| Med | **ExplainerSheet** | 10 | `:71` | `height: 5, width: 44` | `--space-5`, `--h-touch` — `ConfirmSheet.jsx:83` writes the identical grabber as `var(--space-5)` / `var(--h-touch)` |
| Med | **List** | 3 | `lists/List.jsx:21,49,15,41` | `minHeight: 56` · `minHeight: 44` · `height: 0.5` · `'0 0 0 1px'` | `--h-row-md` (56px, *"ListRow, one line"*) · `--h-touch` · `--border-hairline` · `--border-1` |
| Med | **ProgressTrace** | 4 | `chat/ProgressTrace.jsx:49,60` | `bottom: 8, top: 8` · `'1px solid'` | `--space-8` · `--border-1` |
| Low | **SearchField** | 1 | `forms/SearchField.jsx` | 5 literals | see `_index.json` |

**The sharpest one is `Pill`.** Seven values, seven tokens, one line, and the component with the widest
blast radius in the system. Two of those tokens — `--h-chip: 36px` and `--h-filter-chip: 32px` — were
*named after this component's two sizes*, and this component is the one place that does not read them.
Contradiction 15 resolved seven pill implementations into this one; the resolution did not reach the
`SIZES` table.

**Already logged — do not re-report as new:** `ExplainerSheet`'s raw `20 / 30 / 0.4` is named in
`tokens/spacing.css:41`. But **that comment is now half stale**: `--z-scrim` and `--scrim-sheet` *are*
wired at `ExplainerSheet.jsx:68`; only `zIndex: 30` remains. Correct the comment in the same commit
(documentation finding, G1, Low).

### 1B · A literal with **no** token — these are token proposals, not findings

| Proposal | Value | Where it is written raw | Why it needs a name |
|---|---|---|---|
| `--h-peek` | `96px` | `cards/ArtifactCard.jsx:44,45,92,93` (4 sites) | Peek is a **contract**, not a measurement: `rules.md` — *"Peek is 96px, fixed"*, and contradiction 54 ruled the two-segment `ChartShare` budget off it (measured 29px inside 96). The one number the chart family is designed against is a bare `96` in four places. |
| `--w-bubble-max` | `280px` | `chat/UserBubble.jsx:47`, `chat/QAPair.jsx:10` | Two components, one bubble width, no name. `--w-drawer` was added for exactly this reason (*"so a screen cannot drift it to 280 without saying so"*). |
| `--z-raised` | `10` | `shell/StatusSpacer.jsx:11`, `shell/TopBar.jsx:12`, `chat/ProgressTrace.jsx:53` | The layer vocabulary stops at `--z-scrim: 20` / `--z-modal: 30`. Three components need a content layer below the scrim and each invents `10`. `tokens/spacing.css` says the vocabulary exists *"so a component can be written with zero raw values"* — it is one step short. |
| `--dur-pulse` | `1200ms` | `SentinelThinking.jsx:15`, `StepTrace.jsx:27`, `SentinelBlock.jsx:13`, `List.jsx:22`, `ArtifactCard.jsx:45,93`, `DataTable.jsx:164,166` (8 sites) | `rules.md` specifies it — *"the thinking dots pulse 0.28 → 1 across 1.2s"* — and no duration token carries it. |
| `--dur-spin` | `900ms` | `IconSpinner.jsx:6`, `Pill.jsx:33` | Off every duration token; see finding 9. |
| — (declare as artwork) | `-93 / -105 / -120 / -40 / 320` | `shell/ScreenBackdrop.jsx:7-8` | Two aura blobs, 8 literals, **17 screens**. These are not spacing and never will be. `build-index.js` already exempts SVG drawing geometry; these are `<div>`s doing the same job. Either state in the component header that they are artwork co-ordinates — which makes them documented and no longer a finding — or move the blobs to SVG so the index stops counting them. |

### 1C · Values off **every tier** of Sentinel's own scale (C5, real drift)

Measured against `references/scale.md`'s three tiers — the scale (4·8·12·16·20·24), the tolerated
in-betweens (6·10), the named exceptions (2·3·5·13·14). Nine components carry something outside all three;
these four matter:

| Sev | Value | Where | Note |
|---|---|---|---|
| Med | **`18`** | `cards/ExplainerSheet.jsx:74` `marginTop: 18` · `lists/List.jsx:43` `padding: '18px 2px'` | **Invented twice, independently.** A tenth spacing value with no tier, no name and no justification. `tokens/spacing.css` is explicit: *"a new component may not reach for one without saying why."* Fix: `--space-16` or `--space-20`, whichever holds the render. |
| Med | **`11`** | `actions/AnswerChip.jsx:15` `padding: '11px 14px'` | **19 screens, no spec page.** An off-scale vertical padding on one of the most-placed chips in the product, with nothing for a consumer to read that explains it. Fix: `--space-10` or `--space-12`. |
| Low | **`9`** | `chat/ProgressTrace.jsx:49` · `chat/StepTrace.jsx:50`, both `left: 9` | Same magic number, two components — the rail centred under a 16px dot. **C2's shape**: *"overhang written as arithmetic, not as two numbers."* Fix: write it as the arithmetic (`calc(50% - var(--border-1) / 2)` off the dot), in one shared place. |
| Low | `1.5` ×3, `-0.5` | `shell/StatusSpacer.jsx:22` · `data/ChartBar.jsx:32` | Defensible (battery inset, baseline overlap) but **undocumented** — which by the skill's own test makes each a documentation finding, not a defect. One sentence in each component header closes both. |

---

## Pass 2 · CONTRACT TRUTH — where the `.d.ts` misleads a consumer

All **88** trios read (54 A–L, 34 M–Z). Every "not implemented" claim was checked against the full
destructure; **no component in the system uses a `...rest` spread**, so a prop absent from the destructure
is genuinely unreachable.

### Would mislead worst

| Sev | Component | Class | The discrepancy |
|---|---|---|---|
| High | **StatTile** | implemented, undocumented | `data/StatTile.jsx:9` destructures `onExplain` and `caveat` and renders both (`:14`, `:19`). `data/StatTile.d.ts:1-12` stops at `locked`. **Both carry rules**: `readme.md:152` — *"a `caveat` prop on `ChartBar`, `ChartShare`, `StatTile` and `InfoCard`"* and *"Any figure an advisor must defend carries an ⓘ"*. `InfoCard.d.ts:51,53` documents the identical pair. A consumer typing against `StatTileProps` cannot reach the compliance affordance. **Fix:** add `onExplain?: () => void;` and `caveat?: string;` — note StatTile calls `onOpen={onExplain}` with no argument, unlike InfoCard's `(label: string)`. |
| High | **ResultPrimary** | code contradicts contract | `cards/ResultCard.d.ts:48` — *"1 gives 'Approve the move', 2 gives 'Approve both moves', 3+ 'Approve all 3 moves'"*. `cards/ResultCard.jsx:86` hardcodes `journey === 'rebalance' ? 'Both moves approved' : …` with `moves` unread in that branch. A three-move advisor reads *"Approve all 3 moves"*, presses, and is told *"Both moves approved"*. **Fix:** derive the success line from `moves`, as `PRIMARY.rebalance` (`:29`) already does. |
| High | **Pressable** | contract defect | `actions/Pressable.d.ts:4` and `:26-27` both declare `style?: React.CSSProperties;`. A duplicate member is **TS2300** for any consumer that type-checks, and only the second carries the load-bearing *"Anything except `outline`"* warning that contradiction 53(a) was written to enforce. On **27 screens** and with **no spec page**. **Fix:** delete line 4. |
| High | **ChartBar** | documented, inert in one orientation | `data/ChartBar.d.ts:17-18` documents `caveat` unconditionally. `data/ChartBar.jsx:60` renders it only in the horizontal branch; the vertical branch returns at `:26-40` and never reads it. `orientation="vertical"` — the documented choice for a time series — **silently drops the compliance qualifier**. **Fix:** render it in both, or document it as horizontal-only. |
| Med | **VersionRow** | documented as a callback, is a boolean | `chat/VersionRow.d.ts:17` — `onSelect?: (id: string) => void;`. `chat/VersionRow.jsx:14` destructures it; its only use is `:35` — `{isCurrent && onSelect && <span…>current</span>}`. It prints a word. No row is clickable; no id is ever returned. **Fix:** wire it, or retype as `showCurrentLabel?: boolean`. |
| Med | **ChartLine** | documented, never read | `data/ChartLine.d.ts:16-17` — `target?: { value: number; label?: string }`. `data/ChartLine.jsx:73` reads `target.value` only. A named target line ("Agreed 60%") renders anonymous — **in the product whose first rule is that every mark is direct-labelled** (A1). **Fix:** render the label at the line's end, or drop it from the type. |
| Med | **ChartLine** | prose ≠ behaviour | `ChartLine.d.ts:21` — *"Ignored at peek."* `ChartLine.jsx:68` gates only the readout on `scrub && !peek`; `:57-58` (`onMove`) and `:84` (the crosshair) have no peek guard. At `density="peek"` with `scrub`, a crosshair tracks the finger inside a 96px card **with no number to explain it** — A1 again. **Fix:** add `&& !peek` to the crosshair and `onMove`. |
| Med | **RangePills** | prose ≠ behaviour | `.d.ts:7-8` says *"renders inert"*; `.jsx:25` passes `disabled`. See finding 2 — this is the contract half of it. |
| Med | **MessageActions** | default mismatch | `chat/MessageActions.d.ts:6` — `role: 'user' \| 'assistant';` (required, no stated default). `chat/MessageActions.jsx:16` — `role = 'assistant'`. **Fix:** `role?:` with *"Default 'assistant'."* |
| Med | **Pill** | doc names consumers that cannot use it | `actions/Pill.d.ts:21-22` — *"`DownloadAction`, `FileUpload`'s retry and `ResultCard`'s primary all wait on this state."* Only `DownloadAction.jsx:20` passes `loading`. `forms/FileUpload.jsx:23` builds a plain Pill with no loading; `cards/ResultCard.jsx:95` renders `DarkButton`, which has **no `loading` prop at all** (`actions/DarkButton.jsx:4`). **Fix:** cut the sentence to `DownloadAction`, or wire the two. (And note: per finding 1, the one real consumer's spinner does not move.) |
| Med | **StepTrace** | the rule quoted belongs to another component | `chat/StepTrace.d.ts:27-28` — *"Only the active step is at full opacity; pending steps sit at 40%."* `chat/StepTrace.jsx:52` — `const inactive = s.state === 'pending'`, so `done`, `failed` and `running` are all full. `ProgressTrace.jsx:53` is the component that really dims everything but the active step. **Fix:** *"Pending steps sit at 40%; every other state is at full opacity."* |
| Med | **ResultCard** | the two files contradict each other | `cards/ResultCard.jsx:13` — *"THREE EXPORTS, BECAUSE THE SPEC PUTS THE ACTIONS IN THE DOCK, NOT IN THE CARD"*; `:19-20` — *"for the Dock's `chips` slot"* / *"for the Dock's `cta` slot"*. `ResultCard.d.ts:36-40, 59-60` say the opposite and date it: *"since the ruling of 18 Sep 2026 — NOT in the Dock either: they go in the turn."* **The contract was corrected and the source comment beside it was not.** This is the exact drift the brief named. **Fix:** rewrite the `.jsx` header to match the `.d.ts`. |
| Low | **Drawer** | undocumented coupling | `shell/Drawer.d.ts:28-29` documents `search` unconditionally; `shell/Drawer.jsx:91` renders it as `{search && !failed.clients && …}`. A `failed.clients` drawer also loses its search field, against `Drawer.d.ts:22-24` — *"the drawer never blanks."* **Fix:** state the coupling, or keep the field on failure. |
| Low | **ArtifactCard** | retired name in its own doc | `cards/ArtifactCard.d.ts:26` — *"Toggles collapsed ⇄ expanded"* — against `:14` in the same file: *"There is no 'collapsed'."* **Fix:** *"Toggles peek ⇄ expanded in place."* |
| Low | **CanvasHeader** | documents a removed surface | `shell/CanvasHeader.jsx:3` — *"A2 artifact-canvas header — ‹ Back to chat"*. Contradiction 40 removed the canvas and deprecated this component; `ArtifactCard.d.ts:2` — *"There is no canvas."* `CanvasHeader.d.ts:1` carries no prose, so it misleads by omission. On **0 screens**. See pass 5. |

**Checked and clean:** every other stated `@default` (35 in A–L) matched its `.jsx`; no class-2 findings in
A–L; 27 M–Z components showed no divergence.

---

## Pass 3 · DUPLICATION (B6)

**59 renderers live inside a single `screens/*.html` page**, across 15 React pages. The house rule is
"one copy of a renderer, not two". Ranked by how many pages already want the copy.

| Sev | What is duplicated | Copies | Proposed shared home |
|---|---|---|---|
| **High** | **`Ask`** — the composer wrapper. **Byte-identical in 7 pages:** `journey-b/05-decide.html:19` · `journey-c/funds.html:21` · `journey-d/proposal.html:19` · `journey-e/rebalance.html:20` · `journey-f/review.html:19` · `thread/ledger.html:22` · `thread/going-back.html:24`. Three near-identical variants: `journey-b/03-thread-answer.html:23` (an `about` flag) · `thread/refusals.html:20-22` (a `money` flag) · `journey-a/risk-profile.html:20-22`. | **10** | `screens/journey-b/thread.jsx`, beside `AskTurn` — **all ten pages already load it.** One `ThreadAsk({ placeholder, about, money, step, onAttach })` covers every call site. |
| **High** | **The dialog focus-trap** — the four refs, the arm/disarm effect and the ~18-line `onKey` Tab/Escape block, **identical** in `cards/ExplainerSheet.jsx:26-63` · `cards/ConfirmSheet.jsx:35-74` · `shell/Drawer.jsx:33-55`, plus the scrim `<div>` at `:68` / `:79` / `:67`. `ConfirmSheet.jsx:31-41` says out loud that it was **copied**, and that copying the shape without `React.useRef(open)` reintroduced F-25. | **3**, inside the design system itself | `design-system/components/shell/useDialog.js` — `useDialog(open, onClose) → ref`, plus `<Scrim tone="sheet\|drawer" />`. Three consumers exist today; any fourth modal will copy it again, and the repo has already paid for that once. |
| **High** | **The `Thread` / `AskTurn` / `AttachedTurn` scene frame** — 7 copies over 6 pages: `journey-d/proposal.html:35-46` · `journey-e/rebalance.html:34-45` and `:50-59` · `journey-f/review.html:29-39` · `journey-c/funds.html:86-95` · `thread/ledger.html:25-34` · `thread/refusals.html:24-33`. Only four values vary: `ask`, `costNote`, `caption`, the result node. | **7** | `screens/journey-b/thread.jsx` as `Scene({ ask, costNote, caption, anchor, revision, children })`. Every one of the six pages already loads it. |
| **High** | **The phone spine** — `ScreenBackdrop` → `StatusSpacer` → `TopBar` → banner → scroller → `Dock` → `HomeIndicator`. The scroller div and its inner column are **character-identical** between `journey-b/thread.jsx:51-52` and `journey-a/rail.jsx:101-102`; `journey-b/home.jsx:45-48` opens with the same four lines; the `el()` scroll helpers at `thread.jsx:32-33` and `rail.jsx:84-85` match too. | **3** | A `PhoneShell({ time, banner, composer, scrollRef, children })`. The same argument that promoted `ScreenStack` applies, and it now has three consumers. |
| Med | **`RailAsk` re-declared verbatim** — `journey-a/risk-profile.html:20-22` re-writes `journey-a/rail.jsx:190-192` line for line, differing only in the namespace prefix. The page already loads `rail.jsx:11` and `RailAsk` is on `window` (`rail.jsx:250`). `proposal.html:26`, `rebalance.html:28` and `review.html:23` already import it correctly. | 2 | **Pure dead duplication — delete the page copy.** |
| Med | **`EventPanel` + the log harness** — `prototype.html:407-427` vs `journey-b/prototype.html:149-169`, **already drifted**: `44px` vs `48px` grid column; one wraps in a hardcoded `width: 375` div, the other uses the shared `panelHead`/`panelCard`; only one has `maxHeight: 520`. `reduced()`, `STEP_MS`, `FILL_MS` and the `onEvent` closure are duplicated with it. | 2 | `screens/screen-kit.jsx` (both pages load it) — `EventPanel`, `useEventLog`, `reduced`, `STEP_MS`, `FILL_MS`. |
| Med | **The Journey-B `stop` / `resume` / stopped-turn state machine** — `journey-b/prototype.html:58-71` vs `prototype.html:170-180`, identical code, **already drifted in copy**: *"I was partway through attributing Sharma's drift."* vs *"…attributing his drift."* | 2 | `screens/journey-b/answer.jsx` as `useDriftRun({ onEvent })` + `StoppedTurn`. |
| Med | **The artifact expand/collapse scroll choreography** — `ArtifactCard`'s caller-owned scroll contract implemented three times: `journey-b/03-thread-answer.html:50-60` · `journey-b/prototype.html:72-87` · `prototype.html:182-194`. Already drifted: only the spec page subtracts `- 16` and resets `view` to `'chart'`. | 3 | `screens/journey-b/answer.jsx` as `useArtifactToggle(scrollRef, cardRef)`. |
| Med | **The ledger turn** — the same `SentinelBlock` wrapper **and the same sentence**, three times in one file: `thread/ledger.html:43-46`, `:75`, `:78`. The sentence hardcodes two numbers (*"Five instructions … Four are confirmed; one is still out"*) that must track `LEDGER`'s contents — and `ledger.jsx:51,54` already computes `items.length - unsettled`. `prototype.html:233` renders `LedgerArtifact` with **no sentence at all**: the drift is already here. | 3 + 1 | `screens/thread/ledger.jsx` as `LedgerTurn({ openRow, onDownload })`. **E-family risk**: a figure in prose that the book can answer. |
| Med | **`RefineTurn` / `QueryTurn`** — a character-for-character identical six-line chip block and a near-identical count block, twice in one file: `journey-c/funds.html:33-52` and `:60-83`. `funds.jsx:205-206` says `fundsFor` exists precisely *"so the count beside the chips and the rows in the table can never disagree"* — and the count **renderer** was left in the page. | 2 | `screens/journey-c/funds.jsx` as `QueryChips({ query, shelf, onToggle, onShelf, results, tense })`. |
| Med | **`ProposalResult` / `RebalanceResult` / `ReviewResult`** — identical outer div, identical `ResultCard → ResultActions → ResultPrimary` order and prop shape: `journey-d/proposal.jsx:117-148` · `journey-e/rebalance.jsx:106-117` · `journey-f/review.jsx:114-131`. | 3 | A `ResultFrame(...)` — either `screens/data/result.jsx`, or promoted beside `ResultCard`. |
| Med | **Indian grouping and one-decimal percent, re-implemented** | `inr` is defined once at `screens/data/book.jsx:372` and re-implemented inline at `journey-c/funds.jsx:94`. One-decimal percent is written out at five sites — `journey-d/proposal.jsx:65,66` · `journey-c/funds.jsx:87` · `journey-b/answer.jsx:64,82` — while the system names the same rule twice more: `data/ChartLine.jsx:21` (`oneDecimal`) and `data/AttributionChart.jsx:16`. | **A4 risk.** Rule 4 is *one decimal on every figure*, and this repo has already shipped `14.60000000000000075%`. Eight implementations of a four-rule law is eight places for it to fail. **Fix:** `pct(n)` and `signedPts(n)` beside `inr` in `book.jsx:369-372`; point `ChartLine`'s `oneDecimal` and `AttributionChart`'s inline formatter at one shared formatter in `components/data/`. |
| Low | **`Step` (the frozen rail specimen)** — `journey-d/proposal.html:22-31` · `journey-e/rebalance.html:26-32` · `journey-f/review.html:21-27` | 3 | `screens/journey-a/rail.jsx` as `FrozenStep({ steps, i, total, answered, extra })`. |
| Low | **`Targets`** — `journey-e/rebalance.html:21-23` vs the same map inlined at `prototype.html:311-314` | 2 | `screens/journey-e/rebalance.jsx`, beside `TargetRow` (`:119`). |

---

## Pass 4 · COVERAGE — the ranked backlog

**43 of 88 have no spec page. 33 of those are already on a screen** — a consumer exists and has nothing
to read. Excluding `Icon*`, which contradiction 46 exempts by design, the real backlog is **25**.

**Tier 1 is not finished.** The roadmap defines it as *"every component that carries one of the four rules,
or that the chat spine is built from."* Four rule-carriers have no page:

| Rank | Component | Screens | Which rule it carries | Why it is first |
|---|---|---|---|---|
| **1** | **Pressable** | **27** | Operability — *"`Pressable` carries both guarantees so thirty component files inherit them"* | The base of the system. Three contradictions were written about it (49, 53, 55) and F-49's measured focus numbers (1.22 vs 6.59/7.24) live only in a contradiction row. **It also ships a duplicate `style` declaration** (pass 2). The component that defines what "operable" means in Sentinel has nothing a consumer can read. |
| **2** | **ChipRow** | 21 (21 direct) | The chat spine — the row every answer's chips sit in | Most *directly named* page-less component in the product. |
| **3** | **Provenance** | 19 | **A4** — *"Provenance under every figure"* | Rule 4's renderer. Contradiction 16 logs it against `DemoFooter` and `StandingDisclosure` as three disclaimers with three leadings, unresolved. |
| **4** | **StandingDisclosure** | 19 | **H1** — *"Sentinel assists an advisor · not investment advice"* | The compliance line. Contradiction 52(b) parks *disclosure depth* as an open compliance call with no page to state today's answer on. |
| **5** | **AnswerChip** | 19 | — | Also carries an off-scale `11px` padding (pass 1C) and contradiction 35's unresolved `text-bronze-deep/60` against the *"warm grey carries de-emphasis"* rule. Two live questions, nowhere to answer them. |
| **6** | **Badge** | 18 | **A1 / A2** — the reserved status family | Contradiction 52(a) records a **known, accepted 3.90 contrast** on this component, whose trigger is *"if the Badge label ever rises to 12px+"*. That acceptance is invisible to anyone reading Badge. |
| 7 | DarkButton | 17 | — | The dark gradient, one of exactly three places it may appear. |
| 8 | StatusSpacer | 17 | — | 14 literals, most in the system after ArtifactCard/List/Pill. |
| 9 | ScreenBackdrop | 17 | — | 8 literals, all artwork (pass 1B). |
| 10 | PhoneFrame | 16 | — | |
| 11–25 | DrawnCheck (9) · ConcentrationBar (7) · InlineActionRow (7) · ProgressRail (6) · AttributionChart (5) · GreetingDivider (4) · Dumbbell (4) · SelectionMark (4) · SuggestionRow (4) · RejectCallout (3) · DataTableCard (3) · StatTile (3) · HomeIndicator (17) · Eyebrow (22) · SearchField (1) | | | |

**Also missing, and inconsistent:** `ResultCard`, `DataTable` and `OverlapView` are the only three
components of 88 without a `.prompt.md`. They are three of the four the request spec named. The trio
definition in `sentinel-craft/SKILL.md` counts `.jsx` + `.d.ts` + page; the repo's own practice is 85/88
with a prompt. **Fix:** write the three, or state in the SKILL that `.prompt.md` is optional. (G1, Low.)

---

## Pass 5 · DEAD SURFACE (B7 / G1)

### Components on no screen: 14 of 88

**Specified, shipped, and on no screen — the sharpest form of the owner's rule (4):**

| Sev | Component | Note |
|---|---|---|
| Med | **ChartTooltip** | 9 literals. Contradiction 47 records v9 §2.6 **ruling a floating tooltip out on a phone**. A shipped, specified component for an interaction the system decided against. Either name the surface it is for, or retire it. |
| Med | **ChartShare** | Contradictions 48 and 54 were both written about it and both ruled on its behaviour; nothing places it. |
| Med | **ChartLegend** | 4 literals. Contradiction 45 renamed it from `Legend` and gave it two new rules; its one caller was the group card. |
| Med | **DisclosureBlock** | Contradiction 18 lists it as one of four competing peach callouts. |

**Building and on no screen (10):**

| Sev | Component | Note |
|---|---|---|
| High | **CanvasHeader** | 8 literals. **Deprecated by contradiction 40** and its header still describes the removed canvas (pass 2). Still exported from the barrel. This is a dead export the system has already ruled dead — the same shape as `StickyCTA`, which F-11 deleted on 18 Sep for exactly this. **Fix: delete it**, and record the deletion the way row 19 recorded StickyCTA's. |
| Med | **ClientChip** | **12 literals, 0 screens** — the most literal-heavy dead component. `OverlapView.jsx:63` renders a chip that is line-for-line the same idea at 0 literals. Contradiction 15 collapsed seven pill implementations and left this one standing. **B6 + B7 together.** |
| Med | **DecisionsStrip** | 7 literals. Contradiction 15 **excluded it by decision** from the pill collapse; it is now on no screen either. |
| Med | **ScrollToBottomButton** | 6 literals. One of the four callers F-53(a) found silently losing its focus ring. |
| Low | **DemoFooter** · **EyebrowDivider** | Contradiction 16 (three disclaimers) and 8 respectively. |
| Low | **IconCheckCircle** · **IconDownload** | Icons — exempt from pages, not from the parallel rule. |
| Low | **IconSpinner** | On 0 screens **and it owns the keyframe `Pill` needs** (finding 1). Do not delete it before that keyframe moves to `tokens/effects.css`. |
| — | **MotionGuard** | **Not a finding — declare it.** It ships from the bundle by design and can never be "on a screen". `check-parallel.mjs` should exempt it the way it exempts nothing today, or the tool's own output should say why it is listed. |

### Props no caller passes

Measured across `screens/`, `design-system/pages/`, `design-system/components/` and `design-system/ui_kits/`,
including JSX boolean shorthand. **Eight props are passed by nobody, anywhere:**

| Sev | Prop | Declared at | Note |
|---|---|---|---|
| Med | `ChartLine.scrub` | `data/ChartLine.jsx:22` | Never exercised — **and it is the prop whose documented peek behaviour the code does not implement** (pass 2). An unexercised prop that also lies. |
| Med | `ResponseFeedback.reasons` | `chat/ResponseFeedback.jsx:24` | The "why was this wrong" path, on no screen and no page. |
| Med | `AttributionChart.skeleton` | `data/AttributionChart.jsx:27` | A loading state nothing renders — **F1**: a state that exists only in code is a state nobody has seen. |
| Low | `StepTrace.dense` | `chat/StepTrace.jsx:31` | |
| Low | `ConfirmSheet.dismissLabel` | `cards/ConfirmSheet.jsx:34` | |
| Low | `UserBubble.editLabel` | `chat/UserBubble.jsx:24` | |
| Low | `DataTable.filters` | `cards/DataTable.jsx:81` | Only on `cards.card.html`, a group card — not a page and not a screen. |
| — | `ProgressTrace.stopped`, `SentinelBlock.shimmer` | | **Not findings** — passed as boolean shorthand at `screens/journey-b/02-thread-trace.html` and `pages/SentinelBlock.html`. Recorded because a `prop=` grep misses them. |

Each is either wired to a screen, demonstrated on a spec page, or deleted. B7: *a prop that does nothing
does not exist.*

---

## Findings outside the five passes

### 9 · Motion that is off-token or off-easing (C6)

| Sev | Where | What |
|---|---|---|
| **High** | `cards/ExplainerSheet.jsx:69` vs `cards/ConfirmSheet.jsx:81` | **The same keyframe runs at two speeds.** `ds-sheet` is `300ms` raw in one sheet and `var(--dur-screen)` (320ms) in the other. `300ms` is on no duration token. Two bottom sheets, one product, two slide speeds. **Fix:** `var(--dur-screen)` in both. |
| Med | `data/ChartLine.jsx:81` | `animation: 'ds-draw-on 600ms cubic-bezier(0.2,0.8,0.2,1) both'` — **the only place in the system that writes the easing out instead of `var(--ease)`**. If `--ease` ever moved, one animation would not follow. `600ms` is `--dur-count`. **Fix:** `var(--dur-count) var(--ease)`. |
| Med | `icons/IconSpinner.jsx:6`, `actions/Pill.jsx:33` | `900ms linear`. `rules.md`: *"One easing … There is no second curve."* A spinner at `linear` is defensible — but it is written **nowhere**: not in `readme.md`, not in a header, not in contradictions. **Deliberate and undocumented is a documentation finding.** Fix: one sentence naming the spinner as the stated exception, plus `--dur-spin`. |
| Low | `SentinelBlock.jsx:13`, `ArtifactCard.jsx:45,93`, `DataTable.jsx:164,166` | `sentinel-shimmer 1200ms **ease-in-out**` — 5 sites — while `lists/List.jsx:22` runs the same keyframe on `var(--ease)`. **Already logged** (contradiction 29). **What is new:** `DataTable` — one of the four components built this pass — added **two fresh copies** of it. Contradiction 50's rule is *"the literal count falls monotonically; any pass that leaves it flat is the rule being broken."* New code inherited logged debt instead of the correct value. |

### 10 · `guidelines/contradictions.md` is structurally malformed (G1, Med)

The system's own list of known inconsistencies does not parse as a table.

- **Row 45 has no row.** Its entire cell — the `Legend` → `ChartLegend` rename and its two new rules
  (left-aligned to the plot; ordered by value descending) — is swallowed **inside row 38's cell** at
  `guidelines/contradictions.md:48`. Rendered, rows 38 and 45 merge into one.
- **`contradictions.md:60` is an orphan** — a two-cell fragment, `| components/icons/*, assets/icons/* | Documented on the Iconography card |`, whose row head is gone. It renders as a stray row belonging to nothing.
- Numbered rows present: 1–44, 46–61. **45 is missing as a row and present as text.**

The brief's rule is *"check contradictions.md before reporting something as new."* Two of its rows cannot
be read that way today. **Fix:** re-split rows 38 and 45, and restore the head of the orphan at `:60`.

### 11 · A token comment documents a different token (G1, Low)

`design-system/tokens/spacing.css:41`. The comment attached to `--scrim-sheet` / `--scrim-drawer` is not
about scrims — it is about a 28px box:

> *"v12 · ClientChip's box and ResponseFeedback's thumb targets. Both were setting 28 by hand, the only box
> in the product outside this vocabulary. The visual box is 28; the TARGET is still 44…"*

That documents `--h-chip-sm: 28px`, declared nine lines earlier at `:38`, which `ResponseFeedback.jsx:32,36`
and `ClientChip.jsx:9` do consume. The block was attached to the wrong declaration. The token file is the
system's own source of truth about which values are deliberate; a comment on the wrong line is the same
class as a doc comment describing behaviour the code does not have. **Fix:** move it to `:38`, and — in the
same commit — correct the *"ExplainerSheet still writes 20 / 30 / 0.4 raw"* half of the same file that is
now two-thirds done (pass 1A).

---

## Deliberate and documented — checked, not reported

Recorded so the next audit does not spend its budget here.

- **11.5px type, 42px rows, 14px card padding.** All three are the product. `--text-11-5` and
  `--type-meta-font` are named tokens (contradiction 22); `--h-row: 42px` and `--space-14` are declared
  with their reasons in `tokens/spacing.css`.
- **Press at 0.98 / 0.94, one easing, no blur, no images.** Verified against `references/scale.md`.
- **No raw hex anywhere in rendered code.** Two matches repo-wide (`chartMath.jsx:76`, `Pressable.jsx:29`)
  and both are inside comments quoting measured contrast values. Contradictions 1–5 are `ui.tsx`-era rows
  about the Figma Make archive, not the built system.
- **Peek at 96px, `ChartShare` at two segments, `ArtifactCard` taking natural height.** Contradictions 54
  and 40; all three hold in the source.
- **No dark mode.** Contradiction 58, open with a stated trigger.
- **`Dock.chips` / `Dock.cta`.** Contradiction 60, enforced in `check-previews.mjs:181-184`, Home carve-out
  matched on the resolved path.
- **Single-fund 25% vs sleeve 25%.** Contradiction 32; both live, different rules, not to be merged.
- **`--h-row-lg` 46 vs `ListRow size='lg'` 72.** Contradiction 57, open by decision.
- **94/94 pages render clean**, 5 `TIGHT` copy warnings (`journey-c/funds.html` ×2, `shell/drawer.html` ×3),
  no console errors, no 404s, nothing failing to mount.

---

## The order to work in

1. **Findings 1, 2, 3** — the frozen spinner, F-31's live twin, the retired placeholder. All three are the
   build failing to keep a claim the system wrote down.
2. **`Pill.jsx:4`** — seven values, seven existing tokens, 26 screens. The single highest-leverage drift
   fix in the system, and it touches nothing visual.
3. **Contract truth: `StatTile`, `ResultPrimary`, `Pressable`, `ChartBar`** — four contracts a consumer
   would act on and be wrong.
4. **`useDialog` and `ThreadAsk`** — 3 and 10 copies. The focus trap is the one where a copy has already
   cost a defect (F-25), by `ConfirmSheet`'s own admission.
5. **The `Pressable` spec page** — the base of the operability law, on 27 screens, with nothing to read.
6. **`contradictions.md`'s two broken rows** — it is the file every later audit is told to check first.

Every fix above is a gap, a correctness error or a consistency error. **Nothing here asks for a change to
colour, type, radii, shadow or motion character.** The one motion change proposed — `ExplainerSheet`'s
`300ms` → `var(--dur-screen)` — makes a sheet match the sheet beside it; it does not invent a value. Every
change under `design-system/` still needs `npm run check:integrity -- --update` in the same commit.
