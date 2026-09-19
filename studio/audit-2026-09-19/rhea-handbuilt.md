# What is hand-built under `screens/`

**Rhea · Design Systems Architect · 19 Sep 2026**

A specification pass. No product code was changed. Every visual claim here was rendered at 375×812 and
looked at; every code claim cites `path:line`. `screens/journey-c/funds.*` was being edited by another
session while I read it — I read it as it stood at 17:58 and say so where it matters.

Measured against `.claude/skills/sentinel-craft/references/scale.md` and `references/rules.md`, not
against a generic grid. 11.5px type, 42px rows and 14px card padding are the product and are never
flagged here.

---

## 0 · The headline

Forty-eight renderers are declared under `screens/`. Most of them are honest screen composition. The
rule was broken in four places outright, and in a further eight places the screens are *sharing a
visual decision the system never made* — which is the same failure one layer up: the drift is already
there, it just has not been given a name yet.

The two findings I would act on before any of the classification work:

- **`--type-row-strong-font` does not exist.** Nine call sites ask for it — six screen files, plus
  `design-system/components/cards/ConfirmSheet.jsx:99`, and `pages/ConfirmSheet.html:13` even lists it
  in its own `TOK` array. It is defined nowhere in `design-system/tokens/*.css`. Measured on
  `screens/journey-e/rebalance.html`: 14 elements resolve to `400 16px/normal Urbanist`. See D-1.
- **The rail scrolls to the bottom, which `Thread` documents as the wrong answer** and fixes.
  `rail.jsx:85` is a two-line copy of the behaviour `thread.jsx:16-45` exists to replace. See A-4.

| Class | Count |
| --- | --- |
| **A · duplicate** — the system (or a sibling file) already does this | **4** |
| **B · should be a component** — new, wanted by ≥2 screens, carries a decision | **8** |
| **C · legitimately local** — one screen's arrangement, no new decision | **36** |

---

## 1 · The inventory

`✓` = C, fine as it is. Renderers are listed in file order.

| File | Renderer | Class | Verdict |
| --- | --- | --- | --- |
| `screens/data/book.jsx` | *(no renderers — data only)* | ✓ | The one place a fund or client is written down. Exactly right. |
| `screens/screen-kit.jsx` | `ScreenShell` | ✓ | The board around the phone, not the product. Raw type is a drift (D-4), not a component. |
| | `Section` `State` `StateRow` `Note` `Table` `MotionTable` `ProvenanceTable` | ✓ | Spec-board chrome. Never ships. |
| `screens/journey-a/rail.jsx` | `Rail` | **B-1** | Third copy of the screen shell. Also carries A-4. |
| | `AnsweredList` | ✓ | `QAPair` + `ParseNote` + `MessageActions`, one journey's arrangement. |
| | `StepTurn` | **B-2** | The Sentinel turn, hand-built for the sixth time. |
| | `RiskResult` | ✓ | Becomes trivial once B-2 and B-5 exist. |
| | `RailAsk` | ✓ | Picks `Composer` vs `MoneyComposer` from `step.money`. A screen's job. |
| | `LiveRail` | ✓ | The journey's state machine. |
| `screens/journey-b/home.jsx` | `Home` | **B-1** | Second copy of the screen shell; also hand-builds a card surface at `:57` (B-3). |
| `screens/journey-b/thread.jsx` | `Thread` | **B-1** | The canonical shell. Its scroll-anchor logic is the one worth keeping. |
| | `AskTurn` | ✓ | `UserBubble` + `MessageActions` + edit state. One surface. |
| | `AttachedTurn` | ✓ | One surface. |
| `screens/journey-b/answer.jsx` | `DriftPeek` `DriftExpanded` `DriftTable` | ✓ | Data bound into `ChartBar` / `AttributionChart` / `DataTableCard`. Textbook. |
| | `AnswerActions` | **B-5** | Chips + one dark CTA. Third copy. |
| | `AnswerTurn` | ✓ | One screen's turn; hand-builds a card surface at `:127` (B-3). |
| `screens/journey-b/moves.jsx` | `MovesSimulation` | **B-3**, **B-4** | Card shell copied byte-for-byte from `InfoCard.jsx:69`; a figure row hand-drawn inside it. |
| | `MovesBody` `MovesTurn` | ✓ | One body, two frames. The right call, stated in the file. |
| | `MovesActions` | **B-5** | Chips + dark CTA. |
| | `ExecutionTurn` | ✓ | `StepTrace` bound to four outcomes. |
| | `SuccessTurn` | ✓ | Two more hand-built surfaces at `:206` and `:217` (B-3). |
| `screens/journey-c/funds.jsx` | `FundDetail` | **A-1** | Near-identical twin of `FundInfo` in the same file. |
| | `FundResults` | ✓ | `ArtifactCard` + `DataTable`. |
| | `FundInfo` | ✓ | The de-duplicated one. This is what the rule looks like when it is kept. |
| `screens/journey-d/proposal.jsx` | `PropDetail` | ✓ | A row's detail sentence. |
| | `ProposalBlockers` | **B-7** | label + `Badge` + consequence note. `ConfirmSheet` draws the same row. |
| | `ProposalResult` | ✓ | `ResultCard` + `ResultActions` + `ResultPrimary`. All three are the system's. |
| `screens/journey-e/rebalance.jsx` | `TargetRow` | **B-4** | Two hand-drawn figure rows, both on the broken token. |
| | `UncostedTurn` | ✓ | Collapses into B-2. |
| | `RebalanceResult` | ✓ | The Result stack again. |
| `screens/journey-f/review.jsx` | `ReviewShape` | **B-4** | Contains the figure row. |
| | `ReviewFacts` | ✓ | 2×2 `StatTile` grid — but see D-6, the system has two stat-box treatments. |
| | `ReviewEnding` | ✓ | Collapses into B-2. |
| | `ReviewResult` | ✓ | Deliberately has no `ResultPrimary`, and says why. Good. |
| `screens/thread/refusals.jsx` | `RefusalTurn` | **B-2** | The purest instance of the turn. |
| | `CapabilitiesTurn` | ✓ | `FollowUpRow` bound to five capabilities. |
| `screens/thread/ledger.jsx` | `LedgerDetail` | ✓ | Three type roles in a stack; one is broken (D-1). |
| | `LedgerArtifact` | ✓ | `ArtifactCard` + `DataTable` + `RangePills` + `DownloadAction`. |
| `screens/shell/menu.jsx` | `MenuFooterTheme` | **A-2** | Its `SegmentedRow` is inlined a second time in `MenuFooter`. |
| | `MenuFooter` | **A-2** | Also hand-assembles a type role from three axes (D-5). |
| `screens/shell/who.jsx` | `WhoPicker` | **B-8** | `SearchField` filtering a `List` by hand. `List` has no `searchable`. |
| | `WhoEmpty` | ✓ | Collapses into B-2. |
| | `WhoBound` | ✓ | One line over `ClientChip`. |
| `screens/**/*.html` | `Ask` ×10 | **A-3** | Seven byte-identical copies, three variants. |
| | `Scene` ×11, `LiveScene` ×7 | ✓ | Per-page state harness. Each is genuinely different. |
| | `Answer` (`going-back.html:42`) | ✓ | One page's turn. |
| | `Trace` (`03-thread-answer.html:22`) | ✓ | One-line `ProgressTrace` binding. |
| | `Proto` `Bridge` `ControlPanel` `EventPanel` `App` (`prototype.html`) | ✓ | The designer's board beside the phone. Never ships. `panelCard` at `:453` is a B-3 instance. |

---

## 2 · The A list — duplicates, and what to call instead

### A-1 · `FundDetail` is `FundInfo` with two facts removed

`screens/journey-c/funds.jsx:68` and `:243`. Both are thin wrappers over `FUNDS_DS.InfoCard`, and
they pass the same nine props from the same three book lookups. The difference is only that
`FundDetail` adds `Held by your clients` to `stats` and omits `series` / `compare`.

The header at `:227-242` already records that the hand-built fund card was deleted this morning and
`InfoCard.compare` added to the system instead. That was the right move and it is the model for this
whole report. What it left behind is two functions where one would do.

> The prop that proves it: `funds.jsx:80` passes
> `stats={[{ label: 'Held by your clients', … }, { label: 'Exit load', … }]}` and `:261-266` passes the
> same `stats` array plus `Riskometer` / `Expense ratio` / `Fund size`. Same component, same shape,
> one branch apart.

**Call instead:** one `FundInfo({ id, period, heldBy, onPeriod, onExplain })`. Move the
`if (!p) → locked` branch inside it — `InfoCard` already takes `locked` and `lockReason`, so the
branch is three props, not a second function. `FundResults`' `expandable` then calls `FundInfo`.

*Caveat: another session is editing this file. Confirm the shape before acting.*

### A-2 · The menu draws its one theme control twice

`screens/shell/menu.jsx:32-34` declares `MenuFooterTheme`, whose whole body is one `SegmentedRow`.
`MenuFooter` at `:35-42` then inlines **the same `SegmentedRow` with the same five props again** at
`:40` rather than rendering `<MenuFooterTheme />`.

The comment directly above, at `:30-31`, says: *"One string, one control — the drawer's page used to
draw a second copy of this row for its 'light and dark' section, and two copies of a caption drift."*
The fix that comment describes was not completed; the second copy moved from the page into the
module.

**Call instead:** `MenuFooter` renders `<MenuFooterTheme />`. One line.

### A-3 · `Ask` exists ten times

Seven are byte-identical:

```jsx
const Ask = ({ onAttach }) => <Composer value="" onChange={() => {}} placeholder="Ask Sentinel" onSend={() => {}} onAttach={onAttach} />;
```

in `05-decide.html:19` · `funds.html:21` · `rebalance.html:20` · `proposal.html:19` ·
`review.html:19` · `ledger.html:22` · `going-back.html:24`. Three more differ by one prop:
`03-thread-answer.html:23` (`about` → "Ask about this"), `risk-profile.html:20` and
`refusals.html:20` (both branch to `MoneyComposer`).

This is an inert composer for a frozen specimen — the decision it encodes is *rule 3, drawn but not
wired*. **It does not belong in `design-system/`**: the system already ships `Composer`, and adding a
"pretend composer" would be a one-off component in a system that has a rule against those.

**Call instead:** `screen-kit.jsx` — the screens' own shared layer, which already exists for exactly
this. `FrozenAsk({ about, money, onAttach })` beside `ScreenShell` and `State`. Ten call sites become
`<FrozenAsk />`.

### A-4 · `Rail` copied the scroll behaviour `Thread` exists to reject

```js
// screens/journey-a/rail.jsx:85-86
React.useLayoutEffect(() => { const e = el(); if (e) e.scrollTop = e.scrollHeight; }, [revision]);
```

`screens/journey-b/thread.jsx:17-45` is thirty lines of comment and code explaining why this is wrong,
ending: *"The archive's `useStickyScroll` always went to the bottom, and had the same problem."* The
problem it names is that a turn taller than the viewport has its opening sentence scrolled off while
it is being read.

**I rendered it.** `node tools/phone-shot.mjs screens/journey-e/rebalance.html 0` — journey E runs on
`Rail`, its one step renders three `TargetRow`s inside the turn, and the phone opens with Sentinel's
sentence (*"Sharma is at equity 71% against the 60% he agreed to"*) entirely off the top and the first
target card sliced through. The advisor arrives at the middle of an answer. This is not a prediction;
it is the default state of that page.

**Call instead:** `Rail` takes `Thread`'s anchor logic. Since B-1 merges both shells, this resolves
itself — which is the argument for B-1.

---

## 3 · The B list — proposed contracts, ranked by how many screens want them

Ranked by call sites, and each one states which *existing* components it composes. None of these
invents a visual value; every one of them takes a decision that is already made in five places and
writes it down once.

---

### B-1 · `ScreenScaffold` — the phone, with the composer guaranteed

**Wanted by 21 pages.** `Home` (4 pages) · `Thread` (13) · `Rail` (4).

Rule 3 is *"the composer is on every screen"*, and today it is kept by three hand-built shells that
happen to agree. A fourth screen written tomorrow can omit the `Dock` and nothing catches it. This is
the one component that turns a rule into a structure.

`Thread`, `Rail` and `Home` open with the same seven lines: a relative full-height column,
`ScreenBackdrop`, `StatusSpacer`, `TopBar`, the scroller, `Dock`, `HomeIndicator`. They differ in
three real ways: what sits between the top bar and the scroller (`ProgressRail`, nothing), how the
scroller rests (see A-4), and whether the content column is bottom-anchored.

```
design-system/components/shell/ScreenScaffold.jsx
design-system/components/shell/ScreenScaffold.d.ts
design-system/pages/ScreenScaffold.html
```

```ts
export interface ScreenScaffoldProps {
  /** The status bar's clock. Every specimen states a time; the live prototype passes its own. */
  time?: string;
  /** The top bar's title. One value in this product, and still a prop: a screen that needs a
   *  different one is a screen we have not designed yet, and it should have to say so. */
  title?: string;
  /** Opens the drawer. Required — the menu is one of the product's only two ways out of a surface
   *  (the other is a new thread), and a scaffold that lets a caller omit it builds a dead end. */
  onMenu: () => void;
  /** Starts a new thread. Required, for the same reason. */
  onNew: () => void;
  /** Sits between the top bar and the scroller, outside it, so it does not scroll away.
   *  `ProgressRail` on a journey; a `DetourBanner` on a thread that went sideways. */
  header?: React.ReactNode;
  /** The turns. The scaffold owns the gutter and the `--stack` gap between them; a caller that
   *  sets its own margins here is re-deciding something the thread already decided. */
  children: React.ReactNode;
  /** Where the scroller rests when `revision` changes.
   *   'newest'  the newest turn STARTS on screen, and ends on screen too when it fits. The default,
   *             and the reason this prop exists — see thread.jsx's own note: sticking to the bottom
   *             scrolls the sentence off while it is being read.
   *   'bottom'  the end of the thread, for a specimen of a thread already read.
   *   number    that turn at the top, for a turn re-opened in place.
   *   ref       that ELEMENT at the top — what ArtifactCard's contract asks for on expand. */
  anchor?: 'newest' | 'bottom' | number | React.RefObject<HTMLElement>;
  /** Bumped by the caller when the turns changed. The anchor fires on this and never on every
   *  render, so the caller's own expand/collapse scrolls are not fought. */
  revision?: number;
  /** Lets a caller drive the scroller it does not own. */
  scrollRef?: React.RefObject<HTMLDivElement>;
  /** Bottom-anchors the content column, so a short screen's turns sit above the Dock rather than
   *  under the top bar. Home's ready-prompts card is the case that needs it off. */
  anchorBottom?: boolean;
  /** Chips above the composer, in the Dock's own slot. Home's starters live here. */
  chips?: React.ReactNode;
  /** The composer. REQUIRED, and it is the whole point: rule 3 says nothing replaces it, and a
   *  required prop is how a rule survives the next screen. Which composer is the caller's
   *  decision — a rail step with `money` wants MoneyComposer. */
  composer: React.ReactNode;
}
```

**Composes:** `ScreenBackdrop` · `StatusSpacer` · `TopBar` · `Dock` · `HomeIndicator`.
**Tokens:** `--gutter` · `--stack` · `--space-8` · `--space-16` · `--space-24`. No new value.

---

### B-2 · `SentinelTurn` — what Sentinel says, and what it offers

**Wanted by 6 renderers across 5 files**, and `SentinelBlock` appears in 22 files.

`StepTurn` (`rail.jsx:147`) · `RefusalTurn` (`refusals.jsx:75`) · `UncostedTurn`
(`rebalance.jsx:82`) · `ReviewEnding` (`review.jsx:90`) · `WhoEmpty` (`who.jsx:88`) ·
`CapabilitiesTurn` (`refusals.jsx:90`) are one shape six times: a `SentinelBlock` holding one or more
`SentinelText` lines where the first is Medium and the rest are Regular, an optional slot, an optional
`Provenance`, and an optional `ChipRow` of `AnswerChip`.

The spacing between those parts is currently a hand-written `<div style={{ marginTop: 'var(--space-N)' }}>`
wrapper. **There are 59 of them across `screens/`**, and they do not agree: 39 use `--space-12`,
9 use `--space-10`, 3 use `--space-8`, 1 uses `--space-6`. Nobody decided that; it accumulated.

```ts
export interface SentinelTurnProps {
  /** What Sentinel says. The FIRST line is Medium and the rest are Regular — the product's own
   *  emphasis pattern, kept here so six screens cannot each re-decide it. Pass one string for the
   *  common case. */
  lines: string | string[];
  /** Sits under the last line and above the provenance: the rail's three sized targets, a
   *  HeroNumberCard, a ConstraintCallout. A slot, not a feature — the turn decides where things
   *  sit, never what they are. */
  children?: React.ReactNode;
  /** Rule 4: provenance under every figure. When the turn states a figure this is not optional,
   *  and the spec page says so. Rendered with the system's Provenance. */
  provenance?: string;
  /** What the advisor is offered, INSIDE the turn (the ruling of 18 Sep: nothing pinned above the
   *  composer). A chip that outlives the turn that offered it makes the screen a toolbar. */
  chips?: Array<{ label: string; tone?: 'primary' | 'tertiary' | 'muted' | 'outline' }>;
  onChip?: (chip: { label: string; tone?: string }) => void;
  /** One full-width dark CTA under the chips. At most one — see B-5. */
  cta?: { label: string; onClick: () => void };
  /** The trace above already signed this turn '✦ Sentinel'. Passes straight to SentinelBlock so the
   *  name does not appear twice for one thing Sentinel said. */
  continued?: boolean;
  /** Plays ds-rise on enter. The live prototype passes it; a frozen specimen does not. */
  enter?: boolean;
}
```

**Composes:** `SentinelBlock` · `SentinelText` · `Provenance` · `ChipRow` · `AnswerChip` ·
`DarkButton`.
**Tokens:** `--stack` · `--space-10` · `--space-12` · `--dur-enter` · `--ease`.
**Open decision for the owner:** the gap between Sentinel's lines. 39 sites say 12, 9 say 10. Pick
one; I would take 10 between lines of one utterance and 12 before the chips, because that is what the
majority of the *line* cases already do and what the majority of the *chip* cases already do.

---

### B-3 · `Surface` — the plain card, which the system never named

**Wanted by 9 instances across 7 files.** This is the clearest gap in the whole system.

`design-system/components/cards/` holds fourteen cards — `ArtifactCard`, `InfoCard`, `ResultCard`,
`MoveCard`, `HeroNumberCard`, `DataTableCard`, `AllocationCard` … — and **not one plain white card**.
So every screen that needs "content on the product's card surface" writes the declaration out. Here is
`moves.jsx:62` and `InfoCard.jsx:69`, side by side:

```jsx
// screens/journey-b/moves.jsx:62          (hand-built)
{ width:'100%', borderRadius:'var(--radius-16)', background:'var(--color-surface)', boxShadow:'var(--shadow-card)', padding:'var(--space-14)', boxSizing:'border-box' }
// design-system/components/cards/InfoCard.jsx:69   (the system)
{ width:'100%', borderRadius:'var(--radius-16)', background:'var(--color-surface)', boxShadow:'var(--shadow-card)', padding:'var(--space-14)', boxSizing:'border-box' }
```

Byte for byte. The other seven copies did not stay identical — see D-2 and D-3 for the five paddings
and four elevations they drifted into.

```ts
export interface SurfaceProps {
  /** The card's own elevation. Sentinel's rule: 5% ink at 1–2px, OR a 1px ring — never both heavy.
   *   'card'  --shadow-card, the default and what InfoCard/ResultCard/MoveCard use.
   *   'soft'  --shadow-card-soft, for a card that sits directly on the canvas under a greeting.
   *   'ring'  an inset 1px --color-line and no shadow, for a card inside another card.
   *   'none'  flat, for a card already inside a SentinelBlock which carries its own edge. */
  elevation?: 'card' | 'soft' | 'ring' | 'none';
  /** The bad-news surface. Rule 2: --color-danger is text and eyebrow colour only, never a fill, so
   *  a card carrying a caveat or a refusal takes --color-bubble here and colours its WORDS. */
  tone?: 'surface' | 'bubble' | 'canvas';
  /** 14 is the product's card padding and the default. 16 is the drawer's. 'rows' is 0/12 — for a
   *  card whose children are 42px SuggestionRows that carry their own height (home.jsx:57), which is
   *  the ONLY reason a Sentinel card has no vertical padding. Nothing else. */
  pad?: 14 | 16 | 'rows';
  children: React.ReactNode;
}
```

**Composes:** nothing. This is a foundation, and it belongs in
`design-system/components/shell/Surface.jsx` beside `ScreenBackdrop`.
**Tokens:** `--radius-16` · `--color-surface` · `--color-bubble` · `--color-canvas` ·
`--shadow-card` · `--shadow-card-soft` · `--border-1` · `--color-line` · `--space-14` ·
`--space-16` · `--space-12`.

> Worth saying plainly: the four enum values above are not a proposal. They are the four things the
> nine hand-built copies already do. The component makes them choosable instead of retyped.

---

### B-4 · `FigureRow` — a label and its figure on one baseline

**Wanted by 4 instances across 3 files**, and it is where the broken token does most of its damage.

`moves.jsx:68` (*What it costs him* · ₹11,200) · `rebalance.jsx:30` (*Clear the fund ceiling* ·
Equity 58%) · `rebalance.jsx:34` (the rule · *Moves ₹1,85,000 · 13 points*) · `review.jsx:46`
(*The other 29 funds* · ₹3,68,000 · 20%).

All four are the same declaration — `display:flex, alignItems:'baseline',
justifyContent:'space-between', gap:'var(--space-8)'` — and all four set
`fontVariantNumeric:'tabular-nums'` by hand on the right-hand span. Rule 4 requires tabular figures on
anything that changes; a component is how that stops being remembered.

```ts
export interface FigureRowProps {
  /** The thing being measured, on the left. */
  label: string;
  /** The figure, on the right, on the same baseline. Tabular figures are set HERE and not by the
   *  caller: rule 4 asks for them on anything that changes, and four call sites remembering
   *  independently is four chances to forget. Indian grouping and one decimal are the caller's —
   *  the book's `inr()` does it. */
  value: string;
  /** A second, quieter pair under the first — the rule under the target, the average under the
   *  total. Same baseline treatment, caption weight. */
  sub?: { label: string; value: string };
  /** 'strong' for the row that carries the answer, 'quiet' for the one that qualifies it. The two
   *  are a pair; a card with two strong rows has not decided what it is saying. */
  weight?: 'strong' | 'quiet';
  /** Rule 2. A figure the product cannot stand behind — an uncosted move — states its reason in
   *  --color-status-over-fg TEXT, on the peach surface, never as a fill. */
  tone?: 'ink' | 'over';
}
```

**Composes:** nothing.
**Tokens:** `--space-8` · `--type-row-strong-font` *(see D-1 — it must be defined first)* ·
`--type-caption-font` · `--color-ink` · `--color-muted` · `--color-status-over-fg`.

---

### B-5 · `TurnOffer` — the chips and the one CTA

**Wanted by 3 instances.** `AnswerActions` (`answer.jsx:99`) · `MovesActions` (`moves.jsx:107`) ·
`RiskResult`'s tail (`rail.jsx:176-180`). All three: a column at `--space-10`, a `ChipRow`, and
`<DarkButton full arrow>`.

The decision it carries is the one the 18 Sep ruling made and that is easiest to lose: **at most one
dark CTA per turn**, and it sits under the chips, inside the turn, never in the Dock. A component can
enforce "at most one"; three hand-built copies can only agree.

If B-2 ships, this is `SentinelTurn`'s `chips` + `cta` and needs no separate component. **Build B-2
first and re-check whether this is still wanted** — `RiskResult` is the only one of the three that is
not already inside a `SentinelTurn`-shaped thing.

```ts
export interface TurnOfferProps {
  chips?: Array<{ label: string; tone?: 'primary' | 'tertiary' | 'muted' | 'outline' }>;
  onChip?: (label: string) => void;
  /** At most one. Two dark buttons in a turn is two primary actions, and the advisor cannot tell
   *  which one the turn was for. The type says one; the spec page's don't-pair shows two. */
  cta?: { label: string; onClick: () => void };
  /** Staggers the chips in. ChipRow owns the 60ms; this only says whether it runs. */
  animate?: boolean;
}
```

**Composes:** `ChipRow` · `AnswerChip` · `DarkButton`. **Tokens:** `--space-10`.

---

### B-6 · `FrozenAsk` → `screen-kit.jsx`, not the system

**Wanted by 10 pages.** Full detail under A-3. Listed here because it is a real shared thing that
needs a home; the judgement is that its home is the screens' kit, not `design-system/`. Putting a
deliberately inert control into the system would contradict the dead-paperclip rule that
`rail.jsx:120-126` records as F-45.

---

### B-7 · `BlockerRow` — a constraint, its state, and what it costs

**Wanted by 2 surfaces.** `ProposalBlockers` (`proposal.jsx:85-102`) draws label + `Badge` + note.
`ConfirmSheet.jsx:95-100` draws label + value with a `required` tone. They are the same row — "here is
a rule, here is where you stand against it, here is what it means" — and the proposal's version is the
more complete one because it carries the consequence line.

```ts
export interface BlockerRowProps {
  /** The rule, in the product's own words: 'Compliance shelf', 'CKYC', 'Nominee on file'. */
  label: string;
  /** Where the client stands. Rendered as a Badge, never as a fill — rule 2. */
  value: string;
  /** True when this rule STOPS something. A blocking row takes the 'over' tone and its note is
   *  --color-status-over-fg; a row that is merely a caveat takes 'under' and --color-muted, and
   *  does NOT borrow the blocking tone to look serious. That borrowing is the failure this prop
   *  exists to prevent. */
  blocking?: boolean;
  /** What it means for the advisor — the consequence, not a restatement. 'Nothing can be placed
   *  until it clears' rather than 'KYC is in process'. */
  note?: string;
}
```

**Composes:** `Badge`. **Tokens:** `--space-2` · `--space-6` · `--space-8` ·
`--type-row-strong-font` · `--type-caption-font` · `--color-status-over-fg` · `--color-muted`.

---

### B-8 · `List searchable` — an amendment, not a new component

**Wanted by 1 screen, and it is a contract correction.** `WhoPicker` (`who.jsx:61-86`) holds a query
in state, filters `clients` by hand, and renders a `SearchField` above a `List` with its own
`emptyState`. The comment at `:58-60` records that `SearchField`'s doc once claimed `List` had a
`searchable` prop and that it never did.

This is the smallest item here and I would not build a `SearchableList`. I would add to `List`:

```ts
  /** Filters the rows by title as the advisor types, and swaps in a search-specific empty state.
   *  The pool when the field is empty is the caller's — `items` is already 'the four most recent'
   *  on the who-picker, and a search that widens to 512 clients on the first keystroke is a
   *  different surface. */
  search?: { value: string; onChange: (v: string) => void; placeholder: string; emptyState: EmptyState };
```

---

## 4 · Visual drift

Where a hand-built thing left the system's own language. Every value cited is from
`references/scale.md` or `references/rules.md`.

### D-1 · `--type-row-strong-font` is not a token — **Block**

**Nine call sites ask for a custom property that `design-system/tokens/*.css` never defines.**

| Where | |
| --- | --- |
| `design-system/components/cards/ConfirmSheet.jsx:99` | the sheet's row values, including the `required` one |
| `design-system/pages/ConfirmSheet.html:13` | lists it in `TOK` as though it exists |
| `screens/journey-b/answer.jsx:82` | the drift table's points column |
| `screens/journey-b/moves.jsx:70` | **₹11,200** — the cost figure |
| `screens/journey-d/proposal.jsx:91` | the blocker labels |
| `screens/journey-e/rebalance.jsx:31`, `:32` | every target's name and its landing figure |
| `screens/journey-f/review.jsx:47`, `:48` | the long-tail row and its total |
| `screens/thread/ledger.jsx:41` | the client's name on every ledger row |

Measured, in the live page, not inferred:

```
$ probe screens/journey-e/rebalance.html
  --type-row-strong-font : (UNDEFINED)
  --type-row-font        : 500 13px/18px 'Urbanist',sans-serif
  14 elements asked for it. All 14 compute to:  400 16px/normal Urbanist
```

An unresolvable `var()` inside a `font:` shorthand makes the whole declaration invalid at
computed-value time, so it is dropped and the element inherits. The result is **16px at weight 400
with `normal` leading** — a combination that is on no line of the type table. The ramp has no 16px
regular role, and `normal` is not among the leadings (14·15·16·17·18·19·20·22·24).

**And it inverts the hierarchy.** I rendered `journey-e/rebalance.html` and looked: inside one card,
the row *label* "Clear the fund ceiling" renders at 16px while "Costs him ₹11,200" — which correctly
asks for `--type-row-font` — renders at 13px. The cost is the number the advisor has to defend to a
client, and it is the smallest text in its own card. On `journey-f/review.html` the same fault makes
"The other 29 funds / ₹3,68,000 · 20%" compete with the `StatTile` figures above it.

**This is not restyling to fix. It is a token that was specified and never written.** Two ways to
close it, and it is the owner's call:

1. **Define it**, next to `--type-row-font` in `tokens/typography.css`:
   `--type-row-strong-font: var(--weight-semibold) var(--text-13)/var(--leading-18) var(--font-ui);`
   Nine call sites and a spec page already name it, `--type-body-strong-font` is the exact same
   relationship one step up the ramp (`--type-body-font` 400 → `--type-body-strong-font` 500), and
   every value used is already on the ramp. **This is what I would do.**
2. **Retire it** and point all nine at `--type-body-strong-font` (500 14/20). Fewer tokens, but it
   makes a row read at body size, and `ConfirmSheet` would change appearance.

Either way `npm run build:scale` regenerates `references/scale.md`, and option 1 takes the type-role
count from 13 to 14.

### D-2 · Card padding, five answers to one question

`rules.md`: *"Cards: white, radius 16, padding 14–16."*

| Where | Padding | |
| --- | --- | --- |
| `moves.jsx:62`, `:206`, `:217` · `answer.jsx:127` | `--space-14` | correct, and identical to `InfoCard.jsx:69` |
| `drawer.html:116` | `16` | correct, but a raw number where `--space-16` exists |
| `prototype.html:453` | `10px 14px` | **10 is under the floor**, and both are raw px |
| `journey-b/prototype.html:158` | `4px 14px` | **4 is well under**, and raw px |
| `home.jsx:57` | `0 var(--space-12)` | 0 is deliberate — `SuggestionRow` carries `--h-row` 42px itself — but 12 horizontal is not 14 or 16 |
| `screen-kit.jsx:67` | `14` | board chrome; raw number |

The two prototype boards are the designer's own panels and never ship, so they are a nit. `home.jsx`
is the interesting one: the vertical 0 is justified and the horizontal 12 is not — every other card in
the product insets its content by 14. **Cite `MoveCard` and `InfoCard` as the reference.** B-3's
`pad` enum is how this stops recurring.

### D-3 · Four elevations for one kind of card

Same nine surfaces: `--shadow-card` (`moves.jsx:62`, `:206`) · `--shadow-card-soft` (`home.jsx:57`,
`drawer.html:116`, `prototype.html:453`, `journey-b/prototype.html:158`) · **no shadow at all**
(`answer.jsx:127`) · a `--color-bubble-edge` ring (`moves.jsx:217`).

None of these breaks the rule — *"5% ink at 1–2px, or a 1px ring, never both heavy"* is satisfied by
all four. The finding is that **nobody chose**: the same unit reads at three different depths on
adjacent screens because four authors each picked. `answer.jsx:127` is the one I would look at first —
a card on the canvas with no shadow and no ring has no edge at all.

### D-4 · `screen-kit.jsx` sets raw sizes, three of them off the ramp

The ramp is 10 · 11 · 11.5 · 12 · 13 · 14 · 15 · 16 · 18, display 24 · 27 · 40 · 64.

| Line | Value | |
| --- | --- | --- |
| `screen-kit.jsx:19` | `fontSize: 26` | **off-ramp.** 27 is the display step; 24 is the figure step |
| `screen-kit.jsx:9` | `fontSize: 12.5` | **off-ramp.** 12 or 13 |
| `screen-kit.jsx:79` | `fontSize: 10.5` | **off-ramp.** 10 or 11 |
| `:18` `:20` `:27` `:39` `:53` `:68` `:75` | 11 · 11.5 · 15 · 12 · 10 | on the ramp, but assembled from raw axes |

Every one of these hand-assembles `fontFamily` + `fontWeight` + `fontSize` + `lineHeight` separately
rather than asking for a role. `scale.md`: *"A component asks for a role, never a number… A component
reaching past both is a finding."*

This is the specimen board, not the product, so it is a **Minor** — but it is the surface the owner
looks at most, and `:18`'s eyebrow, `:53`'s state pill and `:68`'s note title are all re-creating
`--type-eyebrow-font` by hand.

### D-5 · `menu.jsx:38` builds a type role out of three axes

```jsx
{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-13)', color: 'var(--color-bronze-deep)' }
```

Every value is a token, so this does not break the scale — but it reaches past both axes to compose a
role that the ramp does not have (13px semibold; `--type-row-font` is 13px **medium**). Either use
`--type-row-font`, or this is a second vote for defining a 13px-semibold role, which is exactly what
D-1 proposes to call `--type-row-strong-font`. **These two findings are the same missing token seen
from two directions.**

### D-6 · The system has two stat-box treatments

Not a screen's fault — I found it while checking whether `ReviewFacts` duplicated `InfoCard`. It does
not, and the reason it does not is itself the finding:

| | `InfoCard` stat box `:123-129` | `StatTile` `:11-19` |
| --- | --- | --- |
| background | `--color-canvas` | `--color-surface` |
| ring | `inset 0 0 0 1px --color-line` | `0 0 0 1px --color-line` *(outset)* |
| padding | `--space-10` | `--space-10 var(--space-12)` |
| label | `--type-caption-font` (11/15) | `--type-label-font` + weight override (12/16) |
| value | `--type-row-font` + weight-bold — **13px, ink** | `--type-figure-font` — **24px display, bronze** |
| `InfoDot` | always | only when `onExplain` is passed |

The same idea — a labelled figure in a rounded box — renders at 13px ink in one component and 24px
bronze in the other. I rendered `journey-f/review.html` and the four `StatTile`s read as the loudest
thing on the screen; `InfoCard`'s stats on the fund card read as a quiet footer. Both are defensible
in isolation. Having both, unnamed, is how a screen author picks the wrong one.

**Not in `guidelines/contradictions.md`.** It should be, whatever is decided — and the honest framing
is that these are two different components (a *figure* tile and a *footnote* stat) that have never
been given two different names.

### D-7 · `InfoDot` is on no screen

`InfoDot` is `shipped` and specified, and appears **0 times** across every `.jsx` and `.html` under
`screens/`. It reaches screens only transitively, through `InfoCard`'s stats and `StatTile`'s
`onExplain`. `ReviewFacts` (`review.jsx:67-70`) passes no `onExplain` to any of its four tiles, so
the review's figures — including the locked one, which is the review's actual finding — have no door
to an explanation. That is worth a look against the owner's parallel rule.

### D-8 · Things I checked and found correct

Worth stating, so the next pass does not re-open them.

- **`Badge` tones are consistent and rule-compliant.** `ledger.jsx:16` maps
  `placed/settled → ok`, `rejected → over`, `sent → under`; `funds.jsx:49` maps `onShelf → ok/over`;
  `proposal.jsx:88` maps `blocking → over/under`. Every one is a reserved status token used **with a
  word beside it**, never as a series colour. Rule 1 and the status-family reservation hold.
- **Rule 2 holds everywhere I looked.** `rebalance.jsx:43` puts the uncosted refusal in
  `--color-status-over-fg` **text**; `review.jsx:70`'s locked tile uses `--color-chip` as its
  surface. No red fill anywhere in `screens/`.
- **No raw hex under `screens/`.** The only match is a comment in `answer.jsx:27` explaining why the
  archive's three hexes became `--color-alloc-*`. That is the record working as intended.
- **The figure/caption baseline pairing is `InfoCard`'s and is not duplicated.** The hand-built rows
  in B-4 are a *label/figure* pair, which is a different mark — `InfoCard.jsx:88-90` sets figure and
  `figureNote` on one baseline, and no screen re-draws that.
- **Provenance placement.** Screens place it once per turn rather than under each figure, which reads
  correctly on the phone — `rebalance.html` renders the turn's provenance below the chips. This is a
  reasonable reading of rule 4 and I am not calling it a finding; flagging only that the rule says
  "under every figure" and the practice is "once per turn", and the two should be reconciled in
  `readme.md` rather than in the screens.

---

## 5 · The order I would fix them in

Foundation before polish, and nothing that changes what something looks like without a ruling.

| # | Item | Why here | Touches |
| --- | --- | --- | --- |
| **1** | **D-1 — define `--type-row-strong-font`** | Nine call sites and a system component are rendering at an off-ramp size *today*. It is one line in `tokens/typography.css`, it needs the owner's yes because it changes what `ConfirmSheet` looks like, and B-4 and B-7 both depend on it. | `tokens/typography.css` · `build:scale` · `check:integrity` |
| **2** | **A-2 — `MenuFooter` renders `MenuFooterTheme`** | One line. The comment already says what the fix is. Do it while the file is open. | `screens/shell/menu.jsx` |
| **3** | **A-4 — the rail's scroll anchor** | A real defect on four pages, visible on load. Fix it *inside B-1* rather than patching `rail.jsx` — otherwise the copy is repaired and the duplication that caused it is kept. | folds into #4 |
| **4** | **B-1 — `ScreenScaffold`** | The largest reach (21 pages), it makes rule 3 structural instead of conventional, and it absorbs A-4. Build it, then migrate `Thread` → `Home` → `Rail` in that order, re-rendering after each. | new component + 3 screen files |
| **5** | **B-3 — `Surface`** | Second-largest reach, closes D-2 and D-3 together, and it is the most clearly missing thing in `components/`. Small and self-contained. | new component + 7 screen files |
| **6** | **B-2 — `SentinelTurn`** | Biggest simplification (6 renderers, ~59 spacer divs), but it needs the owner's ruling on the 10-vs-12 gap first, so it waits for a conversation the earlier items do not need. | new component + 5 screen files |
| **7** | **A-1 — merge `FundDetail` into `FundInfo`** | Held until the concurrent session lands `journey-c/funds.*`. Confirm the shape first. | `screens/journey-c/funds.jsx` |
| **8** | **B-4 — `FigureRow`** | Blocked on #1. Trivial once the token exists. | new component + 3 screen files |
| **9** | **A-3 / B-6 — `FrozenAsk` into `screen-kit.jsx`** | Ten copies, zero risk, no system change. Good work for a short session. | `screen-kit.jsx` + 10 HTML pages |
| **10** | **D-6 — the two stat-box treatments** | Needs a decision, not a fix: are these one component or two? Log it in `guidelines/contradictions.md` the same day either way, so it stops being invisible. | `guidelines/contradictions.md` |
| **11** | **B-5 · B-7 · B-8 · D-4 · D-5 · D-7** | Re-assess after #6. `TurnOffer` may disappear into `SentinelTurn`; `menu.jsx`'s raw role is answered by #1; `screen-kit`'s off-ramp sizes are board chrome. | — |

Every item under `design-system/` needs `npm run build:bundle` before anything is looked at, and
`npm run check:integrity -- --update` in the same commit.

---

### Method

`npm run preview` was already running on 4322. Renders: `tools/phone-shot.mjs` on
`journey-e/rebalance.html 0`, `journey-f/review.html 1`, `journey-b/05-decide.html 0`,
`journey-b/01-home.html 0`, looked at individually. Computed styles read from the live DOM with
Playwright against the preview server. All 15 `.jsx` files under `screens/` read in full; all 18
`.html` files swept for renderer declarations, raw values and duplicate helpers, and read in full
wherever the sweep hit something (`prototype.html`, `journey-b/prototype.html`, `going-back.html`,
`03-thread-answer.html`, `drawer.html`). Plus `InfoCard.jsx`, `StatTile.jsx`, `ConfirmSheet.jsx`,
`ResultCard.jsx`, `tokens/*.css` and `pages/_index.json`. `docs/FINDINGS.md` (F-1…F-51) and `guidelines/contradictions.md` checked for each
finding before it was written down; **D-1 and D-6 appear in neither.**
