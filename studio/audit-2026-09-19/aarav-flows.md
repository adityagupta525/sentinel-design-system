# The flow audit — states, repetition, the four questions, going back, and the router

**19 Sep 2026 · Aarav, Interaction Designer · Fable Design Studio**
Audited against `studio/audit-2026-09-19/parameters.md`. Every finding carries the parameter id it fails.

**How this was done.** Thirty-two phone frames rendered at 375×812 with `tools/phone-shot.mjs` and looked
at; `screens/prototype.html` driven live with Playwright (typed into the composers, walked journeys D and
E to their endings, ran E twice); the router's own `ROUTES` array evaluated against 48 sentences an Indian
MFD would plausibly type. **Nothing in this file is reported from source alone, and nothing is reported
from a screenshot alone** — each finding names both the thing seen and the line that causes it.

**No product code was changed.**

---

## 0 · The three I would fix first

| # | Finding | Parameter | Why first |
|---|---|---|---|
| 1 | **The rail's composer is a drawing.** `value=""`, `onChange={() => {}}`, `onSend={() => {}}` | **A3** blocker | Four of six journeys (A, D, E, F) have no working composer. This is the *same defect* the thread's composer had and that `prototype.html:133` records as found-and-fixed — it was fixed in one file and left in the shared rail module. Driven: filling the field leaves it `""`, Enter changes nothing. |
| 2 | **Offline does not exist anywhere in the product.** One string, on one page, and it is a mid-request drop, not offline | **F1** blocker | 0 of 6 journeys, 0 of 5 surfaces. Home already renders the exact frame offline would produce (`book unavailable`) and says nothing about why. An advisor in a client's living room on 1 bar cannot tell a slow product from a broken one. |
| 3 | **The router guesses on `sharma`.** A bare name, and `review Sharma`, both open Journey B's drift trace | **E5** high | The product's stated principle is *"Bucket 4 is the default; nothing is guessed at."* `drift`'s pattern carries a bare `sharma` and is tested before both `review` and `who`, so the one client the product uses most is the one client it guesses about. `review Sharma` opens the wrong journey. |

Close behind, and cheap: the four different lists of "what I can do" (§2, G2-1) and `affordances()` naming
three controls the rail does not have (§3, G3-1).

---

## 1 · The five-state inventory, on the CURRENT design

Read from each page's own `<State label=…>` tags, then confirmed by rendering. `◐` = present for one
sub-surface and missing for another.

### 1a · Per journey

| Journey | ideal | empty | loading | partial | error | offline |
|---|---|---|---|---|---|---|
| **A · risk profile** | ✓ live · question · result | **n/a** — a journey starts at a step | ✓ `SentinelThinking` between questions | ✗ | ✗ | ✗ |
| **B · drift** | ✓ home · trace · answer · decide | ◐ Home ✓ (`book unavailable`); **Thread ✗** — no reopened thread | ✓ trace running · artifact `filling` | ✓ stopped · artifact failed · one placed one rejected | ✓ connection lost · artifact failed | ✗ |
| **C · funds** | ✓ | ✓ `nothing matches` | ✗ | ✓ `the overlap, unavailable` | ✗ | ✗ |
| **D · proposal** | ✓ | ✗ | ✗ | ✓ `the mix, and what is missing` | ✗ | ✗ |
| **E · rebalance** | ✓ | ✗ | ✗ | ✓ `only one has a cost` | ✗ | ✗ |
| **F · review** | ✓ | ✗ | ✗ | ✓ `the finding is a missing figure` | ✗ | ✗ |
| **Ledger** | ✓ | ✗ | ✗ | ✓ `4 of 5 confirmed` · `Sent · no answer` | ✗ | ✗ |

**Totals, 42 cells:** **17 exist · 24 missing · 1 not-applicable.** Every journey has its ideal state and
six of seven have a partial — which is this product's real strength and is unusual. What is missing is
almost entirely **loading (6 of 7 missing), error (6 of 7 missing) and offline (7 of 7 missing)**.

### 1b · Per surface (APP-PLAN §1's five)

| Surface | ideal | empty | loading | partial | error | offline |
|---|---|---|---|---|---|---|
| **Home** | ✓ | ✓ `book unavailable` | ✓ same frame (ruled) | n/a | ✓ same frame (ruled) | ✗ |
| **Thread** | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| **Journey rail** | ✓ | n/a | ✓ | ✓ (E's uncosted) | ✗ | ✗ |
| **Drawer** | ✓ | ✓ first run | ✓ | ✓ one section failed | ✓ one section failed | ✗ |
| **Confirm sheet** | ✓ | n/a | ✓ `committing` | n/a | ✗ | ✗ |

**Totals, 30 cells: 18 exist · 8 missing · 4 n/a.** **The drawer is the only surface with a complete
empty / loading / error trio**, and it got there because `Drawer.d.ts` made `loading` and `failed` props
rather than leaving them to a caller. That is the pattern worth copying.

### 1c · The findings behind the misses

| # | Finding | Param | Sev | Journey | The fix |
|---|---|---|---|---|---|
| F1-1 | **No loading state at all** in C, D, E, F or the ledger. No `SentinelThinking`, no `ArtifactCard state='filling'`, no skeleton — verified by grep across `screens/journey-{c,d,e,f}` and `screens/thread`. C searches 312 funds, F reads a 43-fund statement, the ledger calls an RTA; all three arrive instantly and always. | F1 | HIGH | C D E F, ledger | Journey B already owns the answer: `ArtifactCard state='filling'` for the artifact and `SentinelThinking` with a verb that names the source. Add one `filling` state per result card, and one thinking turn between the last rail answer and the result. |
| F1-2 | **No error state** in A, C, D, E, F or the ledger. The only failures designed are B's `connection lost` and `artifact failed`, and the drawer's per-section failure. The rail cannot fail to load a step or fail to save an answer — which `SCREENS-PLAN.md` §2 listed as required in March and is still open. | F1 | HIGH | A C D E F, ledger | One shape, reused: the thread's `connection lost` copy pattern (what happened → what is kept → `Try again`). On the rail it must say which answers are safe. |
| F1-3 | **`05-decide.html` has `one placed, one rejected`; Journey E has only `placed`.** Same two moves, same RTA, one journey designs the realistic failure and the other does not. | F1 · B-consistency | MED | E | E's `placed` state is the same component as B's. Add the split outcome, or state on the page why a cold rebalance cannot half-fail. |
| F1-4 | **The thread has no empty state.** `SCREENS-PLAN` §2 names it — *"a thread reopened from the drawer, showing past turns"* — and it is the one state the drawer's whole Recent section exists to produce. See F4-3: those rows do not open. | F1 · F3 | MED | B (Thread) | One page state: a thread scrolled to a past turn, with the resume banner. It also gives the drawer's 9 Recent rows somewhere to go. |
| F1-5 | **Home's `book unavailable` says nothing.** Rendered: the named-row card is omitted and ~450pt of empty screen is left between the greeting and the chips. No sentence, no reason, no retry. F3 requires an empty state to say what to do. | **F3** | HIGH | B (Home) | One line where the card was: *"Your book has not loaded. The three below still work, and I will name your clients the moment it arrives."* This is also the offline screen (see F1-6). |
| F1-6 | **The funds empty state names a control that is not on screen.** *"Nothing matches every filter. Drop one and I will widen the search."* — the removable query chips are in the turn above, scrolled off. | F3 · G3 | MED | C | Put the chips back inside the empty card, or make the sentence the control: *"Drop `Direct plan`"* as a tap. |
| F1-7 | **The drawer's failure offers no retry.** *"I could not load your recent threads just now. Everything else here still works."* — correct copy, no `Try again`, while every thread failure has one. | F1 · B-consistency | MED | Drawer | Add `Try again` to the failed section. Same control, same word, as the thread. |

### 1d · Offline — what each journey should do, concretely

**Today: one string in the whole product** — `screens/journey-b/02-thread-trace.html:83`, `connection
lost`, and it is a *mid-request* drop, not offline. Nothing reads `navigator.onLine`. Nothing on any
screen distinguishes "slow" from "gone". **Parameter F1, blocker, every journey.**

The advisor this matters for is sitting in a client's living room with one bar, the client watching.
What they need is not an error — it is to know **which sentence they can still say**.

| Journey | What offline must do | Why this and not a banner |
|---|---|---|
| **Everywhere** | One line under the app bar: **"No network. I am working from what I last read — 30 Sep."** It states the *as-of*, which is the same contract as every provenance line in the product (A4), so the advisor already knows how to read it. It is at the top, not above the composer (B5). | A grey "offline" pill teaches nothing. A date teaches whether the number is safe to say out loud. |
| **Home** | The named rows stay — they are last read from the book, and the greeting card already degrades to the capability rows. Add the as-of line. Do **not** hide the rows: a cached name is more useful than no name, and the line says how old it is. | This is the frame Home already renders (F1-5). It costs a sentence, not a screen. |
| **A · risk profile** | **Runs fully offline.** Twelve questions, all tapped, nothing fetched but the KYC smart chips — which are already local. The *result* is arithmetic. The only thing that needs a network is saving, so the result card carries **"Saved on this phone. It reaches her file when you are back."** | This is the single biggest offline win in the product and it is nearly free. A risk profile is exactly the thing you do sitting in front of a client. |
| **B · drift** | The allocation and the attribution are read from a statement already on file — serve them with the as-of line. The **trace must not start**: say *"I cannot check his Q3 statement against the mandate without a network. Here is what I last read, on 30 Sep."* The `Rebalance` CTA is **disabled with a word**, not hidden. | A trace that runs offline and then fails at step 4 spends the advisor's credibility in front of the client. Refusing before starting spends none. |
| **C · funds** | Search the shelf from cache and say what the cache is: *"312 funds, as I last read them on 30 Sep. NAVs and AUM are not current."* Performance figures render `locked` with the reason — the component already does this. | Fund *categories* do not change hourly; NAVs do. Saying which half is stale is the honest version. |
| **D · proposal** | The four rail steps run offline; the mandate ceiling is on file. The document **builds and saves**. `Send` is disabled with its reason: *"It will go the moment you are back — nothing is queued silently."* | D already ends in a document and not in money (E4). Offline changes only the last step, and the journey's own disclosure already says it places nothing. |
| **E · rebalance** | **Size all three targets offline** — the mandate, the band and the ceiling are all local rules on local holdings. **Cost none of them**, and say so in the sentence the journey already owns: the cost needs exit loads and tax from the scheme documents. There is already **no path from an uncosted target to a confirm** (`rebalance.jsx`), so offline needs no new gate — it simply makes all three uncosted. | This is the cleanest offline story in the product because the journey's architecture already handles "sized but not costed". |
| **F · review** | Builds fully. Every figure is from the statement on file. Add the as-of line and the existing `locked` tile. | Same as A: this is the work an advisor does in the room. |
| **Ledger** | Show the last-known rows with **status frozen**: a `Placed` stays `Placed`, and anything in flight becomes **"Sent · not checked since 30 Sep"** — a fourth word, not a spinner. | The ledger's whole design is that a status is a WORD (A1). Offline is another word, not a greyed row. |
| **Confirm sheet** | **Does not open.** The primary that would open it is disabled with the reason on it. | H3: nothing executes without a confirm that states what will be sent. A confirm sheet that cannot send is a lie with a dark button on it. |

---

## 2 · Repetition (G2) — where the advisor says or sees the same thing twice

### 2a · The same list of "what I can do", written four times, no two alike

| Where | What it lists | File |
|---|---|---|
| Home · named rows | risk profile · proposal · drift | `screens/journey-b/home.jsx` (NAMED) |
| Home · starter chips | Build proposal · **Review portfolio** · Fund explorer | `home.jsx:29` |
| Bucket 4 (not understood) | Look up a client · Explain a drift · Search funds | `screens/thread/refusals.jsx` (BUCKET_4) |
| The standing answer ("what can I do?") | profile risk · build proposal · explain drift · search funds · **read a statement** | `refusals.jsx:66–72` |

**G2-1 · The four lists disagree, and one of them is wrong.** *Parameter G2 + B4 + E5. Severity HIGH.*
No list names **Journey E (rebalance)** or **the ledger**, both of which are built and routable. Only
Home's chips name **Journey F (review)**. And the standing answer's fifth row — **"Read a statement you
attach"** — routes to **bucket 4, "I did not follow that"** (driven through the page's own `ROUTES`:
`miss`). The product's single most important trust surface offers a capability and then says it did not
understand it.

**What to cut, and what it costs.** Keep **one** list — the standing answer — as the source, in
`refusals.jsx`, and derive bucket 4's three chips and Home's three starters from it by slicing. Add
`rebalance` and `client review`; either give `read a statement` a router pattern or drop the row.
**Cost:** Home's starters become 3 of 6 rather than a hand-picked trio, so someone has to choose which
three and write down why — that is a 10-minute decision, not a redesign.

### 2b · The missing purchase dates, said four times in four wordings

Journey E, `screens/journey-e/rebalance.jsx`:

| Line | The words |
|---|---|
| `:44` (rendered **twice** — once per uncosted target) | *"Not costed. I need the purchase dates on folio 9142/28 before I can put a figure on this."* |
| `:50` (rendered **twice**) | the chip **"Get the purchase dates"** — the same act, twice on one screen |
| `:87` | *"I can size it and I cannot cost it. A switch is a redemption plus a purchase, so it is taxable, and the tax depends on when each lot was bought — folio 9142/28 has no purchase dates on file."* |
| `:99` | *"…purchase dates for folio 9142/28 not on file"* |

**G2-2 · One fact, four sentences, two identical doors.** *Parameter G2 + B4. Severity HIGH.* Rendered
and measured: on `how far?` the same sentence and the same chip appear 200pt apart. **B4 is explicit —
two controls opening the same thing is a defect**, and here it is the same control twice.

**What to cut.** Say it **once**, under the pair, as a single note with a single chip: *"Neither of
these is costed — folio 9142/28 has no purchase dates on file."* + **"Get the purchase dates"**. Keep
`:87`'s longer explanation only where it is *asked for* (it is the turn that answers the chip), and cut
its restatement of the folio. Keep `:99` — a provenance line is supposed to repeat the fact, that is its
job. **Cost:** a reader scanning only one card loses the reason; the note sits directly above both
cards, so they do not.

### 2c · The same decision confirmed twice, in the same words

`screens/journey-b/moves.jsx:103` — the in-thread primary is **"Approve both moves"**.
`prototype.html:343`, `05-decide.html:57`, `rebalance.html:85` — the confirm sheet's commit is
**"Approve both moves"**.

**G2-3 · One act, two identical dark buttons, one surface apart.** *Parameter G2 + H3. Severity MED.*
Rendered side by side: the sheet then repeats the two `MoveCard`s **verbatim** from the turn above it and
**drops the two figures the decision actually turns on** — the cost (₹11,200) and the resulting mix
(58%). Journey D gets this right: **"Send to Mr. Aggrawal"** in the thread, **"Send the proposal"** on
the sheet.

**What to cut.** The in-thread button names what it *opens* — *"Check both moves"* — and the sheet's
commit keeps *"Approve both moves"*. Then cut one of the two `MoveCard` renders: the sheet keeps the
cards (H3 requires it to state what will be sent) and **gains the cost row and the after-mix**; the
thread's cards stay because the simulation is above them. **Cost:** nothing. The advisor currently taps
the same words twice and cannot tell what the second tap added.

### 2d · The same three figures, stated then tiled

`screens/journey-f/review.jsx:28` opens the journey with *"Meera Nair holds ₹18,40,000 across 43 funds.
Her risk number is 54, Moderate, locked 15 Sep 2026."* The `ResultCard` immediately below states
₹18,40,000 / 43 funds / 54 / Moderate / locked 15 Sep again — as `StatTile`s.

**G2-4 · The preamble is the card, in prose.** *Parameter G2. Severity MED.* And the **54** is a third
rendering: Journey A ends in `HeroNumberCard` with the same number, band and lock date.

**What to cut.** The preamble's job is to establish *what Sentinel already knows so the advisor does not
have to answer it* — keep that job, drop the figures: *"I have her holdings, her risk number and her
mandate. What I cannot infer is what this review is for."* **Cost:** an advisor who never scrolls to the
card loses the value — but the card is the next 40pt, and the question they must answer is above it.

### 2e · Two provenance lines, 60pt apart, both beginning the same seven words

`screens/journey-b/answer.jsx:130` (`ALLOC_PROVENANCE`) → *"As of 30 Sep · from his Q3 statement · all 18
funds reported"*, and `:144` (`DRIFT_PROVENANCE`) → *"As of 30 Sep · from his Q3 statement and the
mandate on file"*. Rendered, they read as one line printed twice.

**G2-5 · The repeated provenance the owner has already objected to twice.** *Parameter G2 + A4.
Severity MED.* Journey E already has the fix — `MovesSimulation` gained a `provenance` prop so a card
does not stack two near-identical lines. Journey B's answer turn never got it.

**What to cut.** The allocation and the attribution are the same source at the same date; one line under
the pair — *"As of 30 Sep · from his Q3 statement and the mandate on file · all 18 funds reported"* —
carries both facts and both completeness claims. **Cost:** the two cards become a unit that cannot be
reordered independently. They are never reordered.

### 2f · Two copies of one renderer

`screens/shell/menu.jsx:41` — `MenuFooter` inlines a `SegmentedRow` with the same props as
`MenuFooterTheme` at `:32`, rather than rendering it. Two copies of one caption in one file.
*Parameter B6. Severity LOW.* `MenuFooter` should render `<MenuFooterTheme />`.

### 2g · What is NOT repetition, and should be left alone

- **`Approve both moves` reachable from B and from E.** Two entry points to one decision is the product
  working: one in context, one cold. The `MovesBody` module already guarantees one renderer.
- **The confirm sheet restating what will be sent.** H3 requires it. The defect is the *label* (G2-3),
  not the restatement.
- **Provenance under every figure.** A4. Repetition is the point.
- **Home's named rows vs. its starters.** `home.jsx:13–17` already argues this: *this* proposal for a
  named client vs. *a* proposal. The argument holds. The problem is that four lists exist (G2-1), not
  that these two do.

---

## 3 · The four questions (G3), per journey

`affordances(state)` in `screens/prototype.html:65–114` is the product's answer to all four, and the
page claims at `:483` that *"a stale row is impossible"*. **It is not: `affordances()` is a hand-written
array of strings beside the state, not read from the turn.** Driven live.

| Journey | Where am I | What can I do | What happens next | How do I go back | Weakest |
|---|---|---|---|---|---|
| **A risk** | ✓ rail pinned, *Question 7 of 12* | ✗ **3 of 4 rows wrong** (G3-1) | ✓ each question is the next | ◐ edit the last answer; no detour | **what can I do** |
| **B drift** | ✓ app bar + trace | ✓ chips inside the turn | ✓ trace → answer → moves → flight → placed | ✓ edit the prompt, Stop/Continue | — (strongest) |
| **C funds** | ✓ | ◐ chips off-screen once results land (F1-6) | ✗ no follow-ups after the shortlist | ✓ edit the prompt, drop a chip | **what happens next** |
| **D proposal** | ✓ *Question 2 of 4* | ◐ chips ✓, composer inert | ✗ **the ending does not arrive** (G3-2) | ◐ edit answer; composer inert | **what happens next** |
| **E rebalance** | ✓ *Question 1 of 1* | ✓ three targets, one costed | ✓ the plan, then the confirm | ✗ **edit re-shows the plan, never re-asks** (G3-3) | **how do I go back** |
| **F review** | ✓ *Question 1 of 1* | ✓ three audiences | ✓ three endings | ◐ edit the answer, no composer | **how do I go back** |

### The findings

**G3-1 · `affordances()` names controls the rail does not have.** *Parameter G3. Severity HIGH.*
Driven: on Journey A question 1, the panel lists four things. **Three are false.**

| The panel says (`prototype.html:92`) | On screen |
|---|---|
| Answer the question | ✓ two chips |
| Ask why this question exists | ✗ — that chip is on the **Intro** step only (`rail.jsx:19`) |
| Skip to the result | ✗ — `{ goto: 15 }` is on the **Intro** step only (`rail.jsx:23`) |
| **Type an answer instead** | ✗ — the composer is inert (A3-1) |

And at `:102` the panel offers **"Why is 31% a problem?"** while the screen's chip reads **"Why is 71% a
problem?"** (`screens/journey-b/answer.jsx:49`).
**Fix:** `affordances()` should take the *step* and the *turn*, not a flag bag — `step.chips.map(c =>
c.label)` for the rail, and the turn's own chip array for the thread. Then the claim is structural rather
than written down, which is what the page says it already is.

**G3-2 · Journey D's ending never arrives.** *Parameter E4 + G3. Severity HIGH.* Driven end to end:
walked the four rail steps, opened the confirm, pressed **"Send the proposal"** — and the phone is
**pixel-identical to before**. The card still reads "Send to Mr. Aggrawal". `prototype.html:350`'s
`onCommit` calls `setConfirm(null)` and logs; it never advances the result card to `sent`. The *state
exists* — `journey-d/proposal.html` renders it as a frozen specimen labelled `sent` — but the one surface
where an advisor reaches it by doing the journey does not show it. E4 requires each success line to say
which of sent / placed / settled happened; here there is no success line at all.
**Fix:** `onCommit` sets the result card to `sent` and appends the consequence turn (*"He has it. Nothing
is placed — his KYC is still in process and he has no nominee."*), which the frozen page already writes.

**G3-3 · The rail's detour is unreachable.** *Parameter G3 + B1. Severity HIGH.* `Rail` accepts a
`banner` prop (`rail.jsx:100`) and `DetourBanner` renders correctly — but **`LiveRail` never passes it**
(`rail.jsx:204–248`). It exists only as a hand-built frozen `<Scene>` on `risk-profile.html:92`. It can
never fire, because the only way to detour is to ask something, and **you cannot type on the rail**
(A3-1). The two defects hold each other up.
**Fix:** wire `RailAsk`'s `onSend` to the caller, and have `LiveRail` pass `banner` whenever the caller
says a journey is paused. Journeys D, E and F inherit it for free.

**G3-4 · "What happens next" stops dead after Journey C's shortlist.** *Parameter G3. Severity MED.*
`FollowUpRow` is on `refusals.html` and `going-back.html` and nowhere else. APP-PLAN §2 says *"after an
answer, the advisor should be offered the two or three things that answer usually leads to — drawn from
the router's buckets"*. After a fund shortlist, the router's own next buckets are obvious (compare two ·
who already holds it · build a proposal from it) and none is offered.

---

## 4 · Going back — is it consistent between the rail and the thread?

**The rule holds structurally.** Every surface leaves by the same two doors — the app bar's `≡` (menu →
"Back to home") and its `+` (new thread). Checked on all thirteen pages and driven on the prototype: the
rail passes `onMenu`/`onNew` through `LiveRail`, the thread has them, the drawer has "Back to home", the
`ConfirmSheet` has a visible "Not now" beside the commit and the `ExplainerSheet` returns focus. **No
surface in this product is a dead end for *navigation*.**

Where it breaks is the level *below* navigation — undoing the work.

| Level (APP-PLAN §2) | Thread (B, C) | Rail (A, D, E, F) | Consistent? |
|---|---|---|---|
| The question | `AskTurn` — edit in place, `costNote` says what it replaces | `AnsweredList` + `MessageActions` on the last answer | **Yes.** Same gesture, honest about costing more. |
| The work | Stop keeps the partial, Continue | n/a — a rail step is instant | n/a |
| The answer | **`ResponseFeedback` — on `going-back.html` and nowhere else** | absent | **No.** See G4-1. |
| The artifact | `VersionRow` on D and `going-back` | D only | partial |
| The journey | `DetourBanner` — **unreachable** (G3-3) | unreachable | **No.** |
| The decision | open, by the owner's own note | open | consistent |

### The findings

**G4-1 · "This answer was wrong" exists on one surface out of thirteen.** *Parameter B1 + G3. Severity
HIGH.* `ResponseFeedback` appears only in `screens/thread/going-back.html` (and the prototype's import
list). It is absent from Journey B's answer, C's shortlist, D's proposal, E's plan, F's review and the
ledger. This is **exactly** the failure the owner ruled on 19 Sep after finding Edit on one screen out of
five: *an affordance valid from the advisor's side must be present everywhere it is valid, and absent
only where it is not — for a stated reason.* `AskTurn` was made a component so a page could not forget
it. `ResponseFeedback` was not.
**Fix:** the same treatment — one `AnswerFooter` in `thread.jsx` that carries `ResponseFeedback`, used by
every turn that states a finding. State the exceptions: a refusal (there is nothing to rate), and a turn
still running.

**G4-2 · Journey E: editing the prompt does not reopen the question.** *Parameter G3 + B1. Severity MED.*
The plan surface offers *"Edit the prompt above — sending it replaces the plan below it."* Sending routes
back to `rebal`, but `rebalPicked` is never reset (`prototype.html:153–168`), so the rail renders **the
plan again**, not the "how far" question. The cost line promises a replacement the app does not perform.

**G4-3 · Journey E's question is silently skipped on a second run.** *Parameter E5 + G3. Severity HIGH.*
Driven: run E → take the costed target → new thread → type "Rebalance Sharma" again. **The "how far"
question does not appear; the costed plan opens immediately.** `goHome` (`prototype.html:196`) resets
`journey`, `ask`, `phase` and `artifact` and does **not** reset `rebalPicked`, `audience`, `railJourney`
or `uncosted`. Journey E's entire argument — *"rebalance is not an instruction until someone says how
far"* — is bypassed on the second run, and the advisor is handed a sized, costed plan for a target they
never chose.
**Fix:** `goHome` resets the journey bag, or `send()` does on entry to a rail journey. One line.

**G4-4 · Approving Journey E lands the advisor in Journey B.** *Parameter E5 + F1. Severity HIGH.*
Driven and rendered (`p-after-approve.png`): after approving a cold rebalance, `onCommit`
(`prototype.html:344`) sets `setJourney('drift')`, so the thread renders **Journey B's body** — the
attribution artifact, the allocation card and the small-cap sleeve line, none of which the advisor asked
for. Worse, `artifact` is never advanced past `filling`, so the card sits in a **skeleton that never
resolves**: a loading state with nothing behind it, directly under a success turn that says money has
moved. That is the worst possible pairing of F1 and E4.
**Fix:** the flight/placed turns belong to the *decision*, not to Journey B. Give the confirm's
`onCommit` its own `execution` phase that renders `ExecutionTurn`/`SuccessTurn` on whichever journey
opened the sheet.

**G4-5 · The drawer's rows are chevrons that open nothing.** *Parameter B2's principle (a control that is
a drawing) + G3. Severity HIGH.* `screens/shell/menu.jsx:9–25` builds 5 saved + 9 recent + N client rows
with `trailing: 'chevron'` and **no `onPress` on any of them** — `Drawer.d.ts` documents `onPress` in
`ListRowProps` and no caller passes it. Fourteen-plus rows carry the system's strongest "this opens"
signal and do nothing. The drawer's only live controls are `See all`, `Back to home`, `+` and the locked
theme row. This is also why the thread has no empty state (F1-4): Recent is the door to a reopened
thread, and it does not open.

**G4-6 · The one back arrow left in the product is in the drawer.** *Parameter B4/consistency. Severity
LOW.* `menu.jsx:38` renders **"‹ Back to home"**. `SCREENS-PLAN` §0 removed `CanvasHeader`'s
`‹ Back to chat` on the grounds that there is nowhere to go back *from*. The drawer's door is the right
door — but it is drawn with the glyph the product retired, which is the one place an advisor could learn
that this product does have a back arrow. Drop the `‹`, or state why this one is different.

---

## 5 · Router coverage — what lands in bucket 4 and should not

`ROUTES` (`screens/prototype.html:44–58`) evaluated against 48 realistic sentences. **The order is
right** — `act` before `funds` is a good decision and the page argues it well. **The patterns are too
narrow in one direction and too greedy in the other.**

### 5a · Three misroutes that are worse than bucket 4

| Typed | Lands in | Should be | Param | Sev |
|---|---|---|---|---|
| `review Sharma` | **drift** | review | E5 | **HIGH** |
| `sharma` (a bare name) | **drift** | who (disambiguate) | E5 | **HIGH** |
| `Sell 2 lakh of Quant Small Cap` | **funds** | act | E5 · H3 | **HIGH** |
| `How much tax will Sharma pay on this switch?` | **drift** | miss (or a tax bucket) | E5 | MED |
| `Which funds did I sell for Sharma last year?` | **drift** | ledger | E5 | MED |
| `Sharma ko kya bolun?` | **drift** | miss | E5 | MED |
| `What is my AUM this month?` | **ledger** | miss (or a book bucket) | E5 | MED |

**R-1 · `drift`'s pattern carries a bare `sharma`** (`:50`) and is tested before `review` (`:51`), `ledger`
(`:54`) and `who` (`:56`). Every sentence containing the product's most-used client name opens a drift
trace. `meera`, `amit` and `sunita` all reach the `who` disambiguation correctly; **Sharma cannot**.
**Fix:** drop `|sharma` from `drift` and add `drift(ed)?|what moved` patterns; move `who` above the
journey buckets and anchor it on *a name and nothing else* (it already is).

**R-2 · `act` requires `all|everything|full`** (`:46`), so a **partial** instruction — by far the more
common one — falls through to `funds` and becomes a browse. That is precisely the failure the page's own
note (`:472`) says the order exists to prevent; the order is fine, the pattern is not.
**Fix:** `\b(sell|redeem|switch|buy|stop|start)\b` plus an amount, a unit (`lakh`, `cr`, `₹`) or a fund
name → `act`. Bucket 6 already reads the instruction back before anything runs, so a false positive costs
one extra confirmation and a false negative costs a browse in place of a trade.

### 5b · The top 10 sentences an Indian MFD would type that we do not handle

All ten verified to land in bucket 4 (`miss`) through the page's own `route()`. Ranked by how often an
MFD actually says them, and each named with the nearest thing the product already has.

| # | What they type | Why it matters | What it should open | Nearest built thing |
|---|---|---|---|---|
| 1 | **"Start a SIP of ₹10,000 in Parag Parikh for Meera"** | The single most common instruction an MFD gives all day. Today: *"I did not follow that."* | **bucket 6 · act** — read back, then confirm | `ConfirmSheet`, `MoveCard`, bucket 6's read-back |
| 2 | **"Which of my clients have not done KYC?"** | Compliance work that stops money moving. `book.jsx` holds KYC state per client; H4 already blocks Journey D on it | a **book query** bucket → `DataTable` | Journey D's KYC block; `DataTable` |
| 3 | **"How much commission did I earn last month?"** | Third-party MFDs ask this in nearly every review in `RESEARCH.md`. The repository has no fee data — so this needs a **refusal that names the gap**, not bucket 4 | bucket 5 · out of scope, *for now*, with the reason | R4, open in APP-PLAN §5b |
| 4 | **"Meera wants to stop her SIP"** | A client instruction in the client's words. `stop` is not in any pattern | bucket 6 · act | `MoveCard` (Journey B move 2 is a SIP redirect) |
| 5 | **"Show me Sunita's portfolio"** | `sharma` routes; `sunita` in a sentence does not. Any client's holdings should reach the review | bucket 2 · review | Journey F, `ResultCard journey='review'` |
| 6 | **"Which of my clients are overweight small cap?"** | Routes to `funds` today, which is wrong — this is a book-wide mandate check, and it is the follow-up `going-back.html` already offers by name | a **book query** bucket → `DataTable` | `going-back.html`'s own follow-up row |
| 7 | **"What is the exit load on Quant Small Cap?"** | Routes to `funds` (a search) when it is a **single-fact lookup**. An advisor asks this with a client on the phone | `funds` → the fund's own row, opened | `DataTable` `defaultOpen`, `InfoCard` |
| 8 | **"Print a capital gains statement for FY 24-25"** | Peak season, every year. `DownloadAction` + `DataTable` exist and the ledger is the shape | the **ledger**, with a FY period pill | `ledger.html` already has `FY 26-27` |
| 9 | **"Add a nominee for Amit"** | H4 says nominee constraints are stated where they block — and Journey D blocks on exactly this, then offers no way to fix it | bucket 5 · out of scope, naming who can | Journey D's ending |
| 10 | **"Meera ka SIP kab start hua?"** / **"Sharma ko kya bolun?"** | Hinglish is how this advisor actually types. Every pattern is English-only, and `Sharma ko kya bolun?` currently opens a **full drift trace** on a misread | `who`/`miss` honestly, or a Hinglish pattern set | README rule 19 already commits to plain English the advisor reads aloud |

**R-3 · The capability the product advertises and cannot route.** *Parameter B4 + E5. Severity HIGH.*
`"Read a statement you attach"` is row 5 of the standing answer (`refusals.jsx:71`) and is tappable —
`CapabilitiesTurn` wires it to `send()`. It routes to **bucket 4**. Tapping the product's own answer to
"what can I do?" produces "I did not follow that."
**Fix:** either add `\b(statement|attach|upload|holding statement|cas)\b` → a parse bucket, or make that
row point at the paperclip instead of the composer.

**What the router gets right, and should keep.** `act` before `funds`; `over` catching `₹5 crore` and
`₹70,00,000`; `outside` catching ITR and GST; bucket 4 last and default; and the page saying out loud
that this is regular expressions and not language understanding. Every fix above is a pattern change, not
an architecture change.

---

## 6 · Everything else found, by parameter

| # | Finding | Param | Sev | Where |
|---|---|---|---|---|
| A3-1 | **The rail composer is inert on A, D, E and F.** `value=""`, `onChange={() => {}}`, `onSend={() => {}}`; `MoneyComposer`'s `onSend` too. Driven: the field stays `""` after `fill()`, Enter does nothing, the page text length is identical before and after. A composer is present on every screen (A3 satisfied on paper) and cannot be spoken to (A3 broken in fact). | **A3** | **BLOCKER** | `screens/journey-a/rail.jsx:194–196` |
| H3-1 | **"Client consent — Required" does not gate the commit.** Rendered on the moves sheet: the row states `Required` in danger ink (A2 correct — ink, not fill) beside an enabled **Approve both moves**. Either consent is a precondition, in which case the commit waits for it, or it is a reminder, in which case the word is wrong. | H3 | MED | `prototype.html` CONFIRM_ROWS |
| E1-1 | **A locked figure reads as an unfinished screen.** Journey F's fourth `StatTile` prints **`[PLACEHOLDER — her split, to supply]`**. E1 is satisfied — the figure is stated, not zeroed — but the wording is developer-facing on a document an advisor may show a client (H5: terminology is the market's, not ours). | E1 · H5 | MED | `screens/journey-f/review.jsx` |
| G2-6 | **The confirm sheet drops the two figures that matter.** Rendered: it repeats both `MoveCard`s verbatim and shows compliance rows — and neither `₹11,200` nor `58%` appears on the surface that asks for the commitment. | G2 · H3 | MED | `prototype.html:342–347` |
| G5 | **Persona coverage, noted not audited.** Every journey is one advisor (Ashish) and four clients. No screen shows a *new* advisor with an empty book except the drawer's `first run`, and Home's `book unavailable` is the closest thing to a day-one screen — and it says nothing (F1-5). A second advisor persona is out of scope for this pass and should be Ira's. | G5 | — | — |

---

## 7 · What I checked and found clean

Stated so a later reader knows it was looked at, not skipped.

- **A3 · a composer on every screen.** Present on all thirteen pages; the one exception is the
  `ConfirmSheet`, which takes no composer prop at all. Correct. (The *rail's* composer being inert is
  A3-1, a different failure.)
- **D1 · unnamed enabled buttons.** Driven on the live prototype: **zero**.
- **A1 · colour never encodes identity.** Every ledger status is a word; every chart mark is labelled;
  the drift bars carry `+6.1 / +2.0 / +0.9` beside them.
- **A2 · bad news as ink.** `Not costed…`, `Client consent Required`, `Rejected` — all ink on peach or on
  the card, no danger fill anywhere in 32 frames.
- **A4 · Indian grouping and provenance.** ₹14,72,000 / ₹1,85,000 / ₹18,40,000 throughout; a provenance
  line under every figure card. The only defect is two of them stacked (G2-5).
- **B5 · nothing pinned above the composer.** Confirmed on every rendered frame: chips and CTAs sit inside
  their turn. The two pinned elements are the `ProgressRail` and `DetourBanner`, both under the app bar.
- **H1 · the standing disclosure.** *"Sentinel assists an advisor · not investment advice"* legible under
  the composer on every phone with a Dock.
- **Every surface has a way out.** Menu and new-thread on all of them; "Not now" on the confirm sheet.

---

## 8 · Handoffs

| To | What |
|---|---|
| **Meher (content)** | The offline as-of line (§1d); Home's `book unavailable` sentence (F1-5); the single purchase-dates note replacing four (G2-2); *"Check both moves"* vs *"Approve both moves"* (G2-3); Journey F's preamble without its figures (G2-4); `[PLACEHOLDER — her split, to supply]` in market language (E1-1). |
| **Rhea (design system)** | `Drawer`'s `loading`/`failed` prop pattern is the model — propose the same for `ResultCard` (`filling`, `failed`) so a journey cannot ship without them. `ListRow.onPress` is contracted and unused by every caller. |
| **Zoya (visual)** | Nothing. No finding in this pass is a visual one, and the standing rule is never restyle. |
| **Nia (QA)** | Two gates worth adding beside `DEAD PAPERCLIP`: **DEAD COMPOSER** (a `screens/` phone whose composer input cannot take text) and **DEAD CHEVRON** (a `ListRow` with `trailing: 'chevron'` and no `onPress`). Both would have caught A3-1 and G4-5 without a human. |
| **The owner** | §0's three, plus the call on G2-1: which single list of capabilities is the source, and whether `read a statement` gets a router pattern or leaves the list. |
