# Screens — the plan, before anything is built

**Status: awaiting the owner's approval. Nothing under `screens/` exists yet.** This is Gate C: what
`docs/screens-source/` actually contains, what it is missing, what the design system will and will not
give it, and which journey to build first.

Read `docs/screens-source/README.md` first. Its rule governs everything below: **where the archive and
the design system disagree, the design system wins.** The archive is the mock the system was built
from, and the system has moved since.

---

## 0 · The one structural fact that reshapes the whole inventory

The archive has seven screens. Three of them are **canvases** — `Portfolio`, `Proposal`,
`FundExplorer` — mounted in a layer above the thread, entered through `CanvasHeader`'s
`‹ Back to chat` and animated `scale 0.96 → 1, origin center 40%` over 380ms
(`docs/screens-source/src/App.tsx:118`).

**That surface was removed from the product in v5** (contradiction 40). `--dur-canvas: 380ms` was
deleted in v11 for the same reason (contradiction 51), `CanvasHeader` is deprecated, and the rule that
replaced it is: an expanded `ArtifactCard` takes its content's natural height and **the thread carries
the scroll**. There is no `‹ Back to chat`, because there is nowhere to go back from.

So three of seven screens are not screens any more. They are artifacts in the thread. And the system is
already equipped for exactly that — the four components built in roadmap step 3 map onto them
one-to-one:

| Archive canvas | What it becomes | Component |
|---|---|---|
| `Proposal` — where ₹25 L goes | An artifact in the thread, always expanded | `ResultCard journey='proposal'` + `DataTable` |
| `Portfolio` — "Client review" | Same | `ResultCard journey='review'` + `DataTable` |
| `Chat`'s `AttributionCanvas` | The expanded state of the card already in the thread | `ArtifactCard` + `AttributionChart` |
| `FundExplorer`'s `CompareCanvas` | The fund comparison | `OverlapView mode='pairs'` |
| `FundExplorer`'s `OnePager` | The fund sheet | `InfoCard kind='manager'` |

`ResultCard.d.ts` says it outright: *"Always expanded: the advisor arrived here to read it, and the
thread carries the scroll."* The backlog the system carried since v9 was emptied for this.

---

## 1 · Screen inventory

Seven surfaces from the archive, plus five that are a screen's worth of work but live inside one.
"Without it" is the test: what can the advisor not do.

### The three conversation surfaces

| # | Screen | Its job | Journey | Without it the advisor cannot… |
|---|---|---|---|---|
| 1 | **Home** | The empty thread. Greeting, three capability suggestions, four "Jump back in" doors, three quick-action chips, composer. | Entry to all four | …find out what Sentinel can do. They would have to already know what to type. |
| 2 | **Thread** | The spine. Every answer arrives here; free text is routed through six buckets before anything happens. | All | …ask anything. Rule 3 exists to protect this surface. |
| 3 | **Journey rail** | One question at a time, with a progress rail, answer chips, a money composer and a detour banner. 22 steps: Risk 16, Proposal 4, Review 1, Rebalance 1. | Risk · Proposal | …profile a client's risk or build a proposal — the two things that need a sequence. |

### The overlay

| # | Screen | Its job | Journey | Without it the advisor cannot… |
|---|---|---|---|---|
| 4 | **Drawer** | Saved work, recent threads, the client roster, new chat — and a composer, because rule 3 has no exceptions but the confirm sheet. | All | …get back to yesterday's work, or reach a client without typing their name. |

### The three that stop being screens

| # | Was | Becomes | Journey | Without it the advisor cannot… |
|---|---|---|---|---|
| 5 | **Client review** (`Portfolio`) | `ResultCard journey='review'` in the thread | Review | …answer "what does she hold, and is it what we agreed?" |
| 6 | **Proposal** | `ResultCard journey='proposal'` in the thread | Proposal | …produce the document the client actually signs. |
| 7 | **Fund explorer** | A thread turn with removable query pills, then `DataTable`, then `OverlapView` | Funds | …choose a fund, or show a client why two funds are the same fund. |

### Five surfaces inside those

| Surface | Lives in | Note |
|---|---|---|
| **Confirm sheet** | Thread, before any action | The **single documented exception to rule 3** — the only surface in the product with no composer. Disclosure sits *above* the numbers; compliance is stated as rows, never implied. |
| **Success** | Thread, after approval | A drawn check, not confetti. Then the drafted note to the client — which this build **prepares and does not send**. |
| **Fund one-pager** | Fund explorer | A bottom sheet. Carries the reverse lookup: which of your clients already hold this fund. |
| **Offer / client match** | Thread | The Diwali-circular flow: locked offer terms, a client-match table, a drafted WhatsApp message. |
| **Journey result frames** | Journey rail | Risk → `HeroNumberCard`; Proposal/Review/Rebalance → `ResultCard`. |

**Not a screen, and my vote is not to build it:** `src/lib/Keyboard.tsx`. The archive draws its own
on-screen keyboard so a Figma frame looks like a phone. A real app uses the platform keyboard, and
`design-system/readme.md:258` already records that it was deliberately never recreated. If you want it
for the review artifact, say so and it goes in `screens/` only — never in the system.

---

## 2 · State matrix

Six states per screen. **Bold** = not in the archive and required in the real product. This is where
the Figma Make mock is weakest, which is the point of writing it down before building.

### 1 · Home

| State | In the archive | What it must be |
|---|---|---|
| empty | ✗ | **A first-run advisor has no saved work.** The archive hardcodes four "Jump back in" rows. **Vote: omit the whole section when it is empty** — a card with an empty state is a promise of content that is not there. The three capability suggestions stay, because they are capability, not history. |
| loading | ✗ | **"Jump back in" reads from a server.** Vote: render it only once resolved. **No skeleton** — a four-row skeleton for a section that may have zero rows tells a lie that lasts 400ms. |
| typical | ✓ | As the archive, minus the hardcoded greeting. |
| edge | ✗ | **A long client name; a fifth saved item (the archive hardcodes four); the greeting at 06:00 and at 23:00 — the archive hardcodes "Good afternoon, Ashish" and the advisor's name.** |
| refused | n/a | Home does not refuse; the composer hands everything to the thread. |
| error | ✗ | **Saved work fails to load.** Vote: omit the section and say so in one muted line, in the product's voice — never a red banner on the first screen of the day. |

### 2 · Thread

| State | In the archive | What it must be |
|---|---|---|
| empty | ✗ | **A thread reopened from the drawer, showing past turns.** The archive only ever enters `Chat` with a fresh seed. |
| loading | ✓ | `ProgressTrace` for real ordered steps; `SentinelThinking` with a **verb that names the source the answer will cite**. |
| typical | ✓ | Strong. Ten message kinds, all built. |
| edge | ✓ partly | A pasted scheme code (fixed, F-18); an 18-fund table at **96px peek — fixed, recognition not reading**: top three rows plus "+40 more", never a chart with axes. |
| refused | ✓ | The best part of the archive. Bucket 2 reject and hold, bucket 4 "I did not follow that", bucket 5 out of scope, bucket 6 action → confirm. Failure disclosure over invention, every time. |
| error | ✗ | **The answer fails mid-stream.** The archive has `aborted` — the advisor pressing Stop — but nothing for the connection dropping. Vote: same shape as `aborted`, different copy, a "Try again" chip. `SentinelBlock` + `AnswerChip`, no new component. |

### 3 · Journey rail

| State | In the archive | What it must be |
|---|---|---|
| empty | n/a | A journey always starts at a step. |
| loading | ✓ faked | A fixed 620ms `setTimeout`. Real waits vary; `SentinelThinking`'s verb must stay true. |
| typical | ✓ | Question, chips, money composer, callout, progress rail. |
| edge | ✓ partly | The detour (bucket 3) pauses and holds the place — good. **But there is no way to change an answer already given.** Twelve questions, no back. See §4. |
| refused | ✓ | `RejectCallout` holds position and keeps the advisor's text in the composer. Correct. |
| error | ✗ | **A step fails to load, or an answer fails to save.** Nothing in the archive. |

### 4 · Drawer

| State | In the archive | What it must be |
|---|---|---|
| empty | ✗ | **A new advisor: no saved work, no recent, an unloaded client book.** |
| loading | ✗ | **Three independent lists, three arrival times.** |
| typical | ✓ | Four saved, four recent, four clients. |
| edge | ✗ | **The copy says a 512-client book and the drawer lists four with no search.** `SearchField` exists in the system. See §4. |
| refused | n/a | |
| error | ✗ | **Any of the three lists fails.** Vote: fail per section, never blank the drawer — the "new chat" button must survive. |

### 5 · Client review · 6 · Proposal *(both `ResultCard`)*

| State | In the archive | What it must be |
|---|---|---|
| empty | ✗ | **A client with no holdings on file.** |
| loading | ✗ | The statement is being read. `ArtifactCard state='filling'` is built for this. |
| typical | ✓ | |
| edge | ✓ partly | 43 funds of which 29 are under 1.5%; the archive's own copy handles this well ("too small to move the needle, but they still cost her fees"). |
| refused | ✓ | The `LockedFigure` pattern — "Returns & TER — data to supply". **A number that is not available is stated, never zero.** `OverlapView` enforces the same rule in its contract. |
| error | ✗ | **The statement cannot be fetched.** |
| — | ✓ built | `ResultCard` already carries `draft → saved → sent`, and `sent` only after the confirm completes — never on the primary press. |

### 7 · Fund explorer

| State | In the archive | What it must be |
|---|---|---|
| empty | ✓ | "Nothing matches every filter. Drop a pill above to widen the search." Good as written. |
| loading | ✗ | **The search runs against 312 funds.** |
| typical | ✓ | |
| edge | ✓ partly | One fund shortlisted → "Pick 2 to compare". **`OverlapView` has a `maxFunds`; the ceiling needs a stated behaviour.** |
| refused | ✓ | `LockedFigure` again. |
| error | ✗ | **The fund service is down.** |

---

## 3 · Gap list

### Nothing is missing at the primitive level

The archive's screens use **47 components**. Four are not in the system — `Chip`, `FilterChip`,
`DeltaPill`, `KindTag` — and all four were **removed on purpose**, with their replacements recorded in
`design-system/readme.md:106`:

| Archive | Use instead |
|---|---|
| `Chip`, `FilterChip` | `Pill` (36 on a surface, 32 in a card; target always ≥44) |
| `DeltaPill` | `Badge variant='status' tone='over' \| 'under' \| 'ok'` — always beside a word |
| `KindTag` | `Badge variant='meta'` |

**Vote: no new component. Change the screens.** These are renames, not gaps.

### 25 of the 47 are Tier 2 — built, contracted, no spec page

`AnswerChip · AttributionChart · CanvasHeader · ChipRow · ConcentrationBar · DarkButton · DataTableCard ·
DecisionsStrip · DrawnCheck · Eyebrow · EyebrowDivider · GreetingDivider · HomeIndicator ·
IconChevronRight · IconPlus · IconSparkle · PhoneFrame · Pressable · ProgressRail · Provenance ·
RejectCallout · ScreenBackdrop · ScrollToBottomButton · StatusSpacer · SuggestionRow`

**Vote: do not stop to write 25 spec pages first.** Build the journey, and write a Tier 2 page the
moment a screen proves that component's contract is wrong or incomplete. That was the recommendation on
record in `CONTINUE-HERE.md` §7; it now has evidence behind it — every one of these 25 is visible on a
group board, and a page written from a guess is worth less than one written from a screen that broke.

### Six gaps that are real, each with a vote

| # | Gap | Vote |
|---|---|---|
| G1 | **Three screens are built on the removed canvas surface**, and use the deprecated `CanvasHeader`. | **Change the screens.** Rebuild as expanded `ArtifactCard` / `ResultCard` in the thread. No new component — the system built these for exactly this in step 3. |
| G2 | **`ExplainerSheet` is mounted already open** in all three archive mount sites (`Journey.tsx:226`, `Proposal.tsx:116`, `Chat.tsx:392` — each `{sheet && <ExplainerSheet open …>}`). Under the shipped component that means **no focus move and no Tab trap**, because both arm on the `false → true` transition (F-25). | **Change the screens.** Mount the sheet always, toggle `open`. Already recorded as a ruling in `CONTINUE-HERE.md` §4; it goes in `screens/README.md` and is **verified per screen with a keyboard**, not by looking. |
| G3 | **Two hooks the system does not ship** — `useStickyScroll`, `useInlineAsk`. `readme.md:102` lists them as deliberately not ported. | **Neither. They belong to `screens/`.** The system holds tokens, components and states; it does not hold screen behaviour. Write them in `screens/lib/`. |
| G4 | **The on-screen `Keyboard`.** | **Do not build it.** A prototype prop for a screenshot. Ask first if it is wanted for the review artifact. |
| G5 | **No way to change an answer already given** in a 12-question risk journey. The archive can only go forward. | **A product hole, not a component gap.** `QAPair` already collapses each answered turn, so the affordance has a home. Needs your call on the behaviour: re-ask from that point, or edit in place and recompute. |
| G6 | **A 512-client book behind a four-row list with no search.** `SearchField` is in the system, Tier 2. | **Extend the drawer, not the system.** Add `SearchField` above the client section once the roster is longer than fits. |

### Six content decisions only you can make

None of these is a design problem. Each is a fact the archive does not settle, and I will not guess one.

1. ~~**The single-fund ceiling: 15% or 25%?**~~ **LOCKED 18 Sep 2026: 25%.** The owner's ruling, and
   the reason is not preference — the design system has only ever shipped 25%, in words, on two pages:
   `pages/ConstraintCallout.html` says *"past the 25% ceiling on any single fund"* and
   `pages/ResultCard.html` says *"no fund crosses 25%"*. **15% appears nowhere in the system** — no
   page, no document, no token — outside the contradiction row that logged the conflict.
   `Portfolio.tsx:86` in the archive is the single outlier and flags itself in-code as NEEDS DECISION;
   `Reference_Review.png` in the same archive shows *single fund · held 31% · limit 25% · over by 6%*.
   Every screen built from here uses **25%**, and the archive's review screen is corrected when it is
   rebuilt. Logged as contradiction 32, resolved.
2. **`Reference_Proposal.png` answers "₹50 lakh" and returns a proposal headed "Where ₹25 lakh would
   go".** One of the two is the real number.
3. **`preview-drawing.png`** — your own markup on Home, a red circle around the three quick-action
   chips, with no note. **Deferred by you until you have seen the review artifact**, so the answer comes
   from looking at the current Home rather than from memory.
4. **The greeting** is hardcoded "Good afternoon, Ashish". Time-of-day bands, and where the advisor's
   name comes from.
5. **The three reference PNGs are dark with a green accent** — an earlier visual direction, not this
   one. I am reading them for **content and sequence only**, never for appearance. Say if that is wrong.
6. **"Jump back in" holds four fixed doors.** In the real product, is it the last four threads, the
   four unfinished ones, or a pinned set?

---

## 4 · Which screen first — Journey B, end to end

**Vote: Sharma's drift → attribution → rebalance → confirm → success → the drafted note.** Seven
screens, one commit each, in this order:

| | Screen | What it proves |
|---|---|---|
| 1 | Home, with the Sharma suggestion tapped | Entry, the composer, the dock |
| 2 | Thread — `ProgressTrace` running, Stop live | Real ordered steps, and the abort that keeps the partial |
| 3 | Thread — the answer, with the artifact at **96px peek** | Rule 1 (the chart labels identity, never hue), rule 4 (62 → 71, one decimal, provenance) |
| 4 | The artifact **expanded in place** | The rule that replaced the canvas: natural height, thread scrolls, no nested scroll |
| 5 | Thread — two `MoveCard`s | Rule 4 again: ₹1,85,000 · ₹11,200 |
| 6 | **Confirm sheet** | The single exception to rule 3, disclosure above the numbers |
| 7 | Success + the drafted note | A drawn check, and "this build drafts it, it doesn't send" |

Four reasons it is this one and not Meera's risk profile:

1. **It is the only flow that exercises all four rules in one pass** — the attribution chart (rule 1),
   the drift stated on the peach bubble rather than in red (rule 2), the composer surviving onto the
   expanded artifact and its one documented exception (rule 3), and Indian grouping with provenance
   under every figure (rule 4).
2. **It puts the riskiest structural change first.** The canvas removal is the biggest gap between
   archive and system, and Journey B is the one flow where the answer is already written down —
   `ui_kits/journey-b` artboard B/06 documents the expanded card and the no-nested-scroll contract.
3. **It is genuinely end-to-end.** Home to a shareable artifact, through entry, thread, artifact,
   confirm and success. Meera's risk profile is sixteen steps of one repeating pattern and ends in a
   number; it would prove the rail well and the system barely.
4. **Every component it needs is Tier 1** except the chart and the card chrome, so a broken contract
   will be a real finding rather than an unwritten page.

Risk journey second — it is the one that will find the Journey-rail gaps (G5, the missing back) — then
Proposal, then Review, then the Fund explorer.

---

## 5 · How each screen will be built

Every screen, before it is called done:

- **Only system components.** If a screen needs something that does not exist, it stops and asks —
  it does not invent a component.
- **Every state in the matrix above is rendered**, not just the typical one.
- **Every figure carries provenance** under it; every number is Indian-grouped to one decimal with
  tabular figures.
- **Every motion states its reduced-motion answer**, in a table on the screen's own page.
- **Rendered at 375 × 812 and looked at**, then the screenshot goes to you. A finding I did not see did
  not happen.
- **No screen mounts `ExplainerSheet` already open**, verified with a keyboard, per screen.
- `screens/` is a **new top level**. Nothing under `design-system/`. `ui_kits/` is not touched.
