# Sentinel v7 — the drawer, the flow board, and five corrections to my own documents

Read Part 0 first. Five things I got wrong across v5 and v6 are corrected here, and two of them were blocking work.

---

## Part 0 — Corrections to v5 and v6

**0.1 — "Six bundle `__errors`" was three.** Three entries, four underlying faults, because `b-board`'s `B01` throw masked its own #299. The measurement in the system session is the correct one; v6 §1.1's count is wrong.

**0.2 — `B01` was neither renamed nor unexported, and my diagnosis order sent the pass looking in the wrong place.** The real cause was compile order: files compile alphabetically, `b-board.jsx` evaluates before `b-screens.jsx`, each in its own IIFE, and `b-board`'s top-level `BOARD` array referenced screens that did not exist yet. Resolving from `window` at render time inside `App()` is the right fix and it is order-independent in both contexts. The lesson for my side: I named two hypotheses and neither was it. Next time the instruction is *find the cause*, not *choose between these two*.

**0.3 — The intent-router table is not in the v2 spec, and the fault is my citation.** v2 has §2.4 query chip and §2.5 response states (A5). The six-bucket router lives in the **v4 reconnect spec's keyword routing table**, not v2, and v4 was not attached. Attach v4 when buckets are in scope.

So the bucket count stands as built: **four from Pattern Plate 2** — parsed, rejected, detour, not understood — plus **ambiguous** and **out of scope**, which were already on the page and are answered by the readme's voice rules. Marked as additions, not spec. That is the right handling and nothing needs to change.

**0.4 — "The six corrections" collided with a different six, and the print-back went to the wrong list.** The list printed back — opacity wrapper, composer off the confirm sheet, history collapsed, annotation outside the frame, one container treatment, placeholder marker — appears in none of v2, v3, v4, v5 or v6. It is a set of fixes from an earlier build pass of the project's own. So **Rahul's six corrections have still not been printed back**, and that print-back is still owed.

From here they have permanent names. **Never "the six corrections" again:**

| | |
|---|---|
| **R1** | `JUMP BACK IN` moves off Home into the drawer |
| **R2** | No `Back to chat`; the artifact expands and collapses in place |
| **R3** | The conversation is the only surface |
| **R4** | The back pill is kept but must not eat the screen |
| **R5** | Proposal and review entry: client selection **and** typing, both |
| **R6** | Copy and edit the last message, after the output has arrived |

v5's Parts 2–6 map to R2/R3, R4, R5, R6 in that order. The project's own build fixes keep their own numbering and are never called corrections.

**0.5 — v6 §2.1's collapsed chart budget is withdrawn.** It contradicted v2 §2.1, which fixes the artifact preview at **96 pt**, and the project was right to say the budget was unbuildable rather than quietly raising the card.

**v2 wins, and not only because it is older.** The thread is 463–497 px. A 156 px chart block plus card chrome is roughly 250 px, so one collapsed artifact would eat half the thread and two would fill it. The collapsed state's job is **recognition, not reading**.

So the ruling:

- **Peek (collapsed): 96 px, fixed.** What fits there is a **sparkline strip** — plot 72 px, one end-label row 14 px, no axis ticks, no gridlines, no legend — or a single stat row. Never a chart with axes. A table peek stays as v2 has it: top three rows and a `+40 more` line.
- **Expanded: plot 180 px**, axis band 14 px, block ≤ 208 px. v6 §2.2 (`tone`) and §2.3 (the `stroke-dashoffset` exception) stand unchanged.
- The prop is `density?: 'peek' | 'expanded'`, **not** `'collapsed'`. The name change is deliberate: nobody should be able to read "collapsed" and go looking for 132 px again.

---

## Part 1 — The drawer, in full

Currently the drawer holds one section and an empty state. The empty-state copy that is there is good; keep it. Three sections, in this order.

### 1.1 `SAVED WORK` — R1's home

Up to **3** rows, most recent first: in-progress risk profiles, proposals and reviews, each with its place held — `Step 7 of 16`, `Draft · 2 funds`. An item leaves this list when it is locked, which is what the existing empty-state copy already promises.

### 1.2 `RECENT` — chat history

Up to **7** threads. Each row: the first user line truncated to one line, a relative time, and — when the thread is bound to a client — that client's chip. A `See all` row appears only when there are more than 7.

### 1.3 `CLIENTS`

Up to **8** rows, then `See all`. Each row: client name and one line of last-touch context (`Reviewed 12 Sep`), **not** AUM or returns — that data has no owner yet and is on the locked list.

### 1.4 What tapping a client does — and this is the mechanism R5 also uses

Tapping a client does **not** navigate. It **binds the next thread to that client**: a new thread opens with a removable `ClientChip` pinned in the composer, and the bound client's name sits in the thread's first line.

This matters beyond the drawer: **the drawer's client tap and the proposal/review journey's client picker produce the same `ClientChip` in the same place.** One mechanism, two entry points. R5's "selection and typing, both" is then not two flows — it is one composer that accepts a chip from a picker or a name typed into it, and both resolve to the same bound state. Typing a name that matches nothing falls to the `not understood` bucket already on the states page.

### 1.5 Drawer rules

- **One scroll, no nested scroll.** That is why every section is capped with a `See all` row rather than made independently scrollable.
- Every section gets an empty state: `SAVED WORK` has one already; `RECENT` and `CLIENTS` need theirs written, one line plus one pill, in the same voice.
- Row height ≥ 44 pt. Section headers are labels, not tappable.

### 1.6 `[ADDED — say the word and I drop it]` A search field

You did not ask for this. I am naming it rather than slipping it in: a single field at the top of the drawer searching threads and clients together. The reason is 1.3 — an advisor with 200 clients cannot use an 8-row capped list, and `See all` then becomes the only route. If you would rather the drawer stay three sections and nothing else, drop it and `See all` carries the load.

---

## Part 2 — The flow board, which does not exist yet

You are right that nothing shows the whole thing. Artboards exist per journey; nothing shows landing → every journey, connected, with the motion running. That is one new board in the **project**, not the system.

### 2.1 Where it lives, and a rule that follows

**The design system does not hold product screens.** `ui_kits/sentinel-app/portfolio.jsx` and `proposal.jsx` are product screens living in the system's kit — that, not the canvas framing, is the real reason contradiction 43 exists. They are duplicates of Journey A and B artboards that the project already owns and keeps current.

So contradiction 43 **closes by deletion, not redraw**: remove those two screens, `app.jsx`'s `canvas` branch, `onOpenCanvas` and the `kit-canvas` keyframe. The system's kit becomes what it should be — tokens, components and states, a vitrine. The click-through of the *product* belongs where the product screens are.

Route (b) was the right call to make in that pass, and it is accepted — with an expiry. The debt is dated and triggered, and the trigger is the next system pass, which is now issued rather than left to schedule.

### 2.2 What the board contains

Four parts on one `.dc.html`:

1. **Map** — every artboard that exists, at small scale, grouped by journey (A, B, C, D, states), with connectors drawn between the ones that actually connect. Each connector is labelled with its trigger: `tap pill`, `submit composer`, `expand card`, `open drawer`. **Only real transitions are drawn.** An aspirational arrow is worse than a gap.
2. **Play** — one 375 × 812 frame, tap targets live, running the real motion: thread entrance, artifact peek → expanded, drawer open, chip bind, streaming, the detour resume pill.
3. **Motion legend** — every named motion in one place with its property and duration: the micro budget 80–400 ms, the data-reveal budget ≤ 600 ms, the `stroke-dashoffset` draw-on exception with its reason, and what each one does under `prefers-reduced-motion`.
4. **Coverage** — a table: journey → artboards → which transitions are prototyped and which are still static. Gaps stated, not hidden. This is the part I will read first.

---

## Part 3 — Two motion faults, both system-side

**3.1 — Nothing in the build implements `prefers-reduced-motion`.** Not the bundle, not any kit. The motion law says reduced motion is honoured; no stylesheet honours it. This is the most serious open item in the system right now, because the document and the build disagree and the document is the one people trust.

**3.2 — `SentinelThinking` bounces.** It runs `dot-bounce 1.2s`, a transform bounce, where the state asks for opacity. Ruling: **opacity pulse, staggered across the three dots, 1.2 s.** Not because transform is illegal — it is not — but because a bounce at that size sits next to text and reads as jitter, and the delight budget is spent on data arriving, not on waiting.

---

## Part 4 — Order

1. **System pass** — Part 0.5's peek ruling on `ArtifactCard`, Part 3's two motion faults, `List` / `ListRow` / `SearchField` / `ClientChip` for the drawer, and Part 2.1's deletions. Then one refresh.
2. **Project pass** — the drawer in full (Part 1), the R1–R6 print-back that is still owed (Part 0.4), then the flow board (Part 2).

`List` and `ListRow` come from the team's nine and are pulled forward because the drawer cannot be built without them. The remaining seven stay in their own pass.

Still locked: mandate ceiling, fund-performance source, AMC offer terms.
