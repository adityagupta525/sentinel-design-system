# Screens — the plan, before anything is built

**Status (18 Sep 2026, end of the day): approved and in progress — 5 of 7 Journey B screens built on 4 pages (Home, the trace, and the answer WITH the artifact expanded, which is a state of it rather than a screen) plus the shell drawer and a live prototype; screen 5 (two moves) is next. Current state and this session's rulings: `docs/CONTINUE-HERE.md` §0.** This is Gate C: what
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

### 1 · Home — **built, 18 Sep 2026** · `screens/journey-b/01-home.html`

The matrix below is what the screen actually is, after the owner's structural rulings. It is shorter
than the first draft because two whole sections left the screen.

**What Home is now:** greeting, three rows, composer. Nothing else.

- **"Jump back in" moved to the menu.** Saved work is history, and history belongs with the rest of it
  — recent threads and the client list. Home answers "what can I do, and for whom", not "what were you
  doing yesterday". The empty and loading states that section carried went with it; they are the
  drawer's question now.
- **The quick-action chips are gone.** Not because their destinations disappeared — they never opened
  a canvas at all, `docs/screens-source/src/App.tsx:58` says a chip is a conversational turn and
  `handleChip` posts the label to the thread. They are gone because they repeated the card above them
  in the abstract, four hundred points below it, and because `Dock.d.ts` calls that slot "Contextual
  AnswerChips" while Home has had no conversation yet.

**The three rows are built from the advisor's own book.**

| | |
|---|---|
| Named | `Start Meera Nair's risk profile` · `Build a proposal for Mr. Amit Aggrawal` · `Why did Sharma's portfolio drift this quarter?` |
| Unnamed | `Start a risk profile` · `Build a proposal` · `Explain a portfolio's drift` |

Ordered by the client lifecycle — know them, build for them, keep it right — not by recency, because
recency is what the menu is for. Every label routes: checked by hand against the three intent patterns
in `docs/screens-source/src/lib/router.ts`, which match on "risk profil", "propos" and "drift".

**Risk profiling was added, and it was the real defect.** It is the longest journey and the product's
spine, and it was absent from Home entirely.

**The AMC offer row was removed, and the reason is written down so it does not return.** "Show me
Diwali offer from HDFC AMC" was the only row that is not the advisor's own client work; it is a
distributor's marketing inventory. An advisor's day starts with a client, not with a fund house's
campaign. And the day a wealth tool's home screen leads with an AMC's offer is the day the advisor
starts reading the product as a **sales channel**, which is against the whole basis of its trust.
**If this row is ever proposed again — most likely under the word "engagement" — that is the reason it
was taken out.**

| State | What it is |
|---|---|
| typical | The book is loaded, so every row names a client. |
| empty · loading · error | **One frame, not three.** The capability-shaped rows are the BASE CASE and the names are an enhancement that arrives. A first day, a book that has not arrived, and a book that failed to load all render the same screen. So Home has no skeleton to show and no failure to report: it is never blank, and it never promises a name it does not have. "Which client?" is then answered by the thread, which is the same disambiguation the router already does in reverse. |
| edge | **A long advisor name.** The greeting wraps to two lines rather than truncating — measured at 375 against a 343 content box, "Ramasubramanian" runs 349 and "Lakshminarayanan" 351. The row grows 43 → 70 and the 27pt comes out of the empty middle; the composer does not move and the phone never exceeds 812. |
| refused | n/a. Home never refuses — a refusal is a thing Sentinel says, and Sentinel has not spoken yet. |

**Open on this screen, for the owner:** `GreetingDivider`'s dashed hairlines are `flex: 1`, so a long
name squeezes them to nothing — 47pt beside "Ashish", 12pt beside "Vishwanathan", none beyond — and the
component stops looking like a divider. A `max-width` on the text would reserve them, at the cost of
wrapping shorter names sooner.

### 2 · Thread — **screens 2 and 3 built, 18 Sep 2026** · `02-thread-trace.html`, `03-thread-answer.html`, `prototype.html`

Built as the matrix says, with three things the matrix did not know:

- **Where a thread rests.** The answer turn is ~500pt in a 462pt thread. Sticking to the bottom (the
  archive's `useStickyScroll`) scrolled the first sentence off while it was being read, then did it again
  when the artifact arrived. Rule, in `screens/journey-b/thread.jsx`: the newest turn STARTS on screen, and
  ends on screen too only if it fits. A specimen can ask for the bottom, or for a given turn at the top.
- **The peek is `ChartBar density="peek"`**, three ranked bars, 62pt measured in the 96pt clip, no
  truncation at 11px. `AttributionChart` is the expanded artifact and does not fit 96 — nor should it.
- **The artifact can fail on its own.** Sentence arrived, breakdown did not: said in the same block as text
  (rule 2), Try again inline, "Show the 18 holdings" withdrawn, "Why is 71% a problem?" kept because 71 is
  still true. Not in the archive.


| State | In the archive | What it must be |
|---|---|---|
| empty | ✗ | **A thread reopened from the drawer, showing past turns.** The archive only ever enters `Chat` with a fresh seed. |
| loading | ✓ | `ProgressTrace` for real ordered steps; `SentinelThinking` with a **verb that names the source the answer will cite**. |
| typical | ✓ | Strong. Ten message kinds, all built. |
| edge | ✓ partly | A pasted scheme code (fixed, F-18); an 18-fund table at **96px peek — fixed, recognition not reading**: top three rows plus "+40 more", never a chart with axes. |
| refused | ✓ | The best part of the archive. Bucket 2 reject and hold, bucket 4 "I did not follow that", bucket 5 out of scope, bucket 6 action → confirm. Failure disclosure over invention, every time. |
| error | ✗ | **The answer fails mid-stream.** The archive has `aborted` — the advisor pressing Stop — but nothing for the connection dropping. Vote: same shape as `aborted`, different copy, a "Try again" chip. `SentinelBlock` + `AnswerChip`, no new component. |

### 4 · The artifact, expanded — **built, 18 Sep 2026, as a state of screen 3** · `03-thread-answer.html`

| State | What it is |
|---|---|
| typical | Opened in place: plot 180 + a 14pt axis band, card **475pt** measured in a 462pt thread, so the THREAD scrolls. The card's header is brought to just under the app bar — the caller's scroll, per `ArtifactCard`'s contract, wired in the live phone and in the prototype. |
| table view | From the card's ⋯. The same three numbers as rows, each keeping the line the chart draws under its bar. `readme.md:235` — no value is ever reachable only by touching a coloured shape. |
| from the top | The whole turn in one scroller: question, closed trace, answer, allocation, then the card. Nothing inside the card scrolls. |
| live | Expand, collapse, and the ⋯, with the composer placeholder following the state — "Ask about this" open, "Ask Sentinel" closed. |

**Gap G7, and it is a data gap, not a design one: "Show the 18 holdings" has nothing to show.** The chip
is the archive's (`Chat.tsx:363`) and its destination was the canvas. Its real destination is a table of
Sharma's eighteen funds, and **the archive holds no holdings for him** — the eight rows in
`journeys.tsx:396` are **Meera's**, from the review journey, and 43 funds rather than 18. Filling a card
with her rows under his name is exactly the figure an advisor would read to a client, so it is not drawn.
Today the chip opens the chart's own table view. It needs his holdings, from the owner.

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

1. ~~**The single-fund ceiling: 15% or 25%?**~~ **LOCKED 18 Sep 2026: the SINGLE-FUND ceiling is 25%.**
   The owner's ruling, and the reason is not preference — the system states it in words in **two**
   sentences across **three** places. *"One of them would have to hold 34% of his money — past the 25%
   ceiling on any single fund"* is on `pages/ConstraintCallout.html:34` and again inside
   `components/cards/cards.card.html:16`; *"No fund crosses 25%"* is the `DataTableCard` footer on that
   same board line and in `components/cards/DataTableCard.prompt.md:3`. **15% appears nowhere in the
   system** — no page, no document, no token. `Portfolio.tsx:86` in the archive is the single outlier and flags itself in-code as NEEDS
   DECISION. Logged as contradiction 32, resolved.

   **⚠️ Two different rules share the number 25%, and only the first is ruled.** The other is the
   **small-cap sleeve ceiling** — *"Small cap is 31.0% of his equity, against a 25% ceiling"* — which
   the system carries on nine surfaces: `MoveCard`, `MessageActions`, `SentinelText`, `SentinelBlock`,
   `ProgressTrace`, `SentinelThinking`, `UserBubble`, `ResultCard` and `guidelines/motion-screens`.
   Same number, different rule. Change one and the other does not follow, and a grep for "25%" returns
   both. **Correcting this plan's first draft:** it cited `ResultCard` as single-fund evidence. It is
   not — `ResultCard`'s 25% is the sleeve line. The archive's `Reference_Review.png` also shows a **15%
   category ceiling** for *small cap overall* beside a 25% single-fund limit, for a different client;
   mandates are per client so those need not conflict, but no screen may mix them.
2. ✅ **ANSWERED, 19 Sep 2026 — both numbers are real.** `Reference_Proposal.png` answers "₹50 lakh" and
   returns a document headed "Where ₹25 lakh would go". ₹50,00,000 is what the advisor asked for;
   ₹25,00,000 is the ceiling on the mandate Amit stated (`CLIENTS.amit.mandate.ceilingRs`), which the
   router already refuses ₹60,00,000 against. The gap between them is not a bug in the reference — it is
   step 2 of the journey, where Sentinel names the ceiling and says it has not applied the larger number.
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
