# Continue here

**If you are a new agent session on this repository, read this file first, then `CLAUDE.md`.**
It is the state of the work, the rulings that are not obvious from the code, and the things that are
*not* in this repository and have to be supplied.

Written 18 Sep 2026, at commit `dcfe133`, when the work moved to a different Claude account.

---

## 0 · Where this stopped — 23 Sep 2026, the explorer joined the app

**Read this section first.** §0a below is the 20 Sep drop and §0b the 18 Sep one; both are kept
because their rulings still hold. §1–§10 are the standing document and are still true.

| | |
|---|---|
| Branch / HEAD | `claude/practical-newton-fi0pof` — **two commits ahead of the remote and NOT PUSHED.** `git push origin HEAD` returns 403: the keychain identity is `centricitydesigner` and the repo is `adityagupta525`. Pushing needs the SSH key — see §0·push below |
| Pages | **166 / 166 render clean** |
| The system | **111 components**, every one with a contract, a prompt and a rendered spec page |
| Parallel | **104 of 111** on a screen; the seven are `AssetMark`, `ChartTooltip`, `EyebrowDivider`, `IconCheckCircle`, `IconDownload`, `IconSpinner`, `MotionGuard` |
| UI gate | `npm run check:ui` — 118/134 clean, 24 findings in `docs/UI-GATE-FINDINGS.txt`, none new today |
| App artifact | https://claude.ai/artifact/CNPzjJSutX4gAZVDK4XDX5 — **version 5**, and it is now the BUILT APP (`npm run build:app`), not the V1 board. 17 supporting files: the 13 art files and the home-screen icons |
| System artifact | https://claude.ai/artifact/H9KoAbs6Ha7goJgrhtJZ2T — **version 36**, 166 files. Rebuild with `npm run build:artifact`, republish with `url` |

### What changed, and what to know before touching it

**The explorer is the app's FOURTH SURFACE — `screen === 'explore'`, beside home, the rail and the
thread.** It was returned from `body()`, the function that produces a *turn*, and `Funnel` renders a
whole `ScreenScaffold`: one phone came out with two status bars, two app bars and two composers.
The rule this leaves behind: **a component that renders a ScreenScaffold is a surface, and a surface
goes in the ScreenStack.**

**`Funnel` now takes `onMenu`, `onNew`, `onHandOff` and `startAsk`.** Without them it is the same
standalone board it always was, so `screens/explorer/*.html` are unchanged. `startAsk` runs the
sentence the app routed here through the funnel's own `send`, so the parse lives in one file.

**"Add to a proposal" opens journey D carrying the fund** — the same `carried` hand-off journey C
makes. **It is reachable on 2 of 80 instruments**, because `propCarriedLines` reasons from the book
(the compliance shelf, the sleeve, the proposal split) and the book holds ten funds. The other 78 say
so rather than opening a journey about a fund the rail cannot name. **Widening it means writing
journey D a fourth branch for a shelf instrument the book has no position in — that is a product
decision and it is the owner's, not a bug.**

**A fold that is still animating measures wrong.** `send` bumps `settle` after `FOLD_SETTLE_MS`
(260, one frame past `--dur-enter`) so the scaffold anchors on settled layout. Without it the seeded
sentence left the parse note 9pt *above* the scroller, cut in half by the app bar. Only after a send,
never on an ordinary fold toggle — re-anchoring on every collapse yanks the list.

**`check:ui` gained a `placeholder-cut` detector.** Detector 1 measures boxes and text *content*; a
placeholder is neither, and the explorer's composer drew 324pt of hint into 317pt of field.

**`build:app` now asserts the explorer art copied.** It shipped zero of the 13 files while the page
asked for them by path, and a 404 on an `<img>` is not a console error, so the boot check never saw it.

**`build:artifact` folds the 111 `.d.ts` into one `contracts.d.ts`** — 276 files was past the 255
publish ceiling. It runs *after* the precompile step: a page reads its contract at RUNTIME, and
folding them earlier gave every page a 404 while `check:artifact` still reported 142/142, because a
page renders around a failed fetch.

### §0·push — the two commits that are not on the remote

`364c2a6` (the explorer as the fourth surface) and `3918c39` (the artifact build). `origin` is HTTPS
and the stored credential cannot push to it. The working push is over SSH — see the memory note
"Push over SSH, not HTTPS". A session that cannot run that command should say so rather than leave
the owner thinking the work is on the remote.

---

## 0a · Where this stopped — 20 Sep 2026, end of the long session

§0b below is the 18 Sep drop, kept because its rulings still hold; §1–§10 are the standing document.

| | |
|---|---|
| Branch / HEAD | `claude/practical-newton-fi0pof` — local and remote identical |
| Pages | **144 / 144 render clean** (95 spec pages + 17 guidelines + 18 screens + boards + kits) |
| The system | **94 components, every one with a contract, a prompt and a rendered spec page.** Tier 2 closed |
| Integrity | 450 files pinned |
| Adherence | system **61** (the gate ceiling, tightened from 62) · screens **0** · tokens **0 undefined** |
| Parallel | **86 of 94** on a screen. The eight are named in contradiction 64, in three kinds |
| Findings | **F-1 … F-80, none open** — F-80 (21 Sep) is the one only `npm run check:app` finds |
| Contradictions | **9 open**, every one dated and triggered |
| Artifact | https://claude.ai/artifact/H9KoAbs6Ha7goJgrhtJZ2T — **version 33**, a grouped cover rather than a file tree, 254 files. Rebuild with `npm run build:artifact`, then republish with `url` |
| Deployment | `vercel.json` builds the same staged site. `docs/DEPLOY.md` covers it, and answers the `.apk` question honestly |
| Handoff | `npm run build:handoff` → one folder for a development team. `dist/` carries the two single code files the owner asked for by name |

### What this session did, in the order it did it

1. **The explorer's commands** — `sort by cost`, `under 0.7% TER`, `show 3Y`, `add Motilal`,
   `compare A with B`, and an ambiguous name that binds nobody. The line it settled: **a filter
   changes which funds match and becomes a chip; a view changes only the order or the period and
   touches no chip.** (F-61)
2. **The last three fund asks** — against its category, what changed, who holds it. Closed plan §2.
   Two data defects found by measuring: the benchmark could not be read at one year, and two funds on
   the same index drew two different indexes. (F-62)
3. **The two scores** — Centricity Fund Score and Client Health Score, placeholders with their
   weights printed on the card. The owner's basis, 20 Sep: *fund performance and client holding*. The
   best part is the score that is **withheld** when too little of its inputs are on file. (F-63, F-67)
4. **The UI kits redrawn** and **`Dock.cta` deleted** — the kits are no longer frozen. (F-64)
5. **Contradictions 62 and 63 closed** — the two stat-box treatments named, and the review's four
   figures given explainers. (F-65)
6. **The breaching bar** on the rebalance takes `tone='status'`. (F-66)
7. **The prototype driven end to end**, 24 steps, which found two defects nothing else could: a new
   thread kept the previous thread's client, and a chip on the risk result crashed the rail. (F-68)
8. **Four screen components promoted into the system** — `UserTurn`, `AttachmentTurn`, `RefusalTurn`,
   `StepComposer` — and a motion pass that took `ds-rise` from three turns to every arriving one.
   (F-70)
9. **Three components deleted** (`CanvasHeader`, `DemoFooter`, `DecisionsStrip`), one built in
   (`ScrollToBottomButton`, which turned out to have no accessible name), eight named. (F-71)
10. **Tier 2 closed** — forty spec pages written, so every component in the system is specified.
    (F-72)

### What is open, and whose it is

- **The Centricity Score's real methodology.** The owner's basis is settled; the weights are still
  invented and the card says PLACEHOLDER. When the definition arrives, `FUND_SCORE_WEIGHTS` and the
  five mappings in `book.jsx` are what change — the card, the band words, the turn and the shortlist
  column do not.
- **Contradiction 64(c)** — `ChartLegend`, `ChartShare`, `ChartTooltip`, `EyebrowDivider`. Rule 1
  argues against a legend at all, which is why nothing reached for `ChartShare`. The owner's call.
- **The remaining eight contradictions**, each dated and triggered.
- **An `.apk`**, if the demo needs a file rather than a link. `docs/DEPLOY.md` §3 has the three routes.

---

## 0b · Where this stopped — 18 Sep 2026, end of the second account's first session

**Read this section first; §1–§10 below are the standing document and are still true.**

### The last drop

| | |
|---|---|
| Branch / HEAD | `claude/practical-newton-fi0pof` at `2cb7412` — local and remote identical, tree clean |
| CI | 25 commits this session, **every one green** (runs 20–43). Before this session 19 of 19 were red. |
| Pages | **88 / 88** render clean (76 design-system + 12 screens) |
| Integrity | 375 files intact |
| Screens built | **Journey B is complete — all 7 steps, on 5 pages**: `01-home`, `02-thread-trace` (Thread · while it works), `03-thread-answer` (Thread · the answer, steps 3 and 4), `05-decide` (Thread · deciding — steps 5, 6 and 7), `prototype`, plus `shell/drawer` and `flow` |
| **Next** | The build order is **empty**. What is left is the owner's open calls in `APP-PLAN.md` §5, and R4 (the fee and commission question), which needs figures this repository does not have. R1–R4 are all closed except R4 (the fee and commission question), which needs figures the repository does not have. |
| Review artifact | https://claude.ai/artifact/H9KoAbs6Ha7goJgrhtJZ2T — version 7, owned by ashish@centricity.co.in, cover → Screens section → flow, Home, Drawer, Trace. Republish after every screen (recipe: memory + §8). |
| Claude Design canvas | **Undecided.** DesignSync works on this machine after `/design-login` in a real terminal. `0682a2d3` is unreachable from both accounts (404 / "Project not found"). None of the six writable projects is Sentinel. Owner must pick: new project (recommended) or one of the six. Do not create one without the word. |

### Later the same day — screen 3, the live prototype, three fixes, and what the owner asked

Commits after `0eb7778` (Drawer/SegmentedRow promotion). **Every one of these is measured, and the
measurements are on the pages themselves.**

- **Screen 3 built** (`03-thread-answer.html`, six states): the answer, the allocation with its own
  provenance, the artifact at 96px peek (`ChartBar density="peek"`, 62pt measured in the 96 clip, no
  truncation), filling (skeleton-first), artifact-failed (not in the archive), trace reopened, and the
  explainer opened the real way. Shared turn in `answer.jsx`.
- **Live prototype** (`prototype.html`): Home → tap → trace (Stop / Continue) → answer → filling → peek →
  expand in place → collapse → explainer → menu, with a log of what moved and which `ds-*` keyframe on
  which `--dur-*` token carried it. Probed under full and reduced motion: transforms present in one, `none`
  in the other. The one hand-built piece, `ScreenStack`, is named with its promotion trigger (README rule 12).
- **Where a thread rests — a ruling of mine, yours to overturn.** Newest turn's first line on screen; bottom
  only if it fits (`thread.jsx`, README rule 13). Measured: a ~500pt answer in a 462pt thread. The archive's
  sticky-bottom scrolled the sentence away while it was being read.
- **System changes, all promoted-first with contract + page:** `ProgressTrace initialCollapsed` (the
  one-line resting state a frozen page could not show); **F-27 fixed in `ExplainerSheet` too** (0.4 measured —
  the live state had rendered a black phone, which settled it); **F-28** Stop and Send buttons had no
  accessible name; **F-29** the status-bar wifi glyph was drawn half — the owner caught it — redrawn whole.
- **R2 is built (19 Sep): the state between "Approve" and "placed"**, three new states on
  `05-decide.html`. It was the research's second theme and the product had nothing there.
  **In flight** — sent, nothing back; says WHEN it went and that the advisor need not wait, because the
  reviews are not asking for speed, they are asking to be told. **One placed, one rejected** — the most
  likely real failure of a two-move rebalance, with the consequence stated out loud: the mix is back at
  58% today, but the SIP still buys small cap on the 7th, so the drift returns next month unless the
  mandate is fixed. **Sent, and no answer** — the only state where the product must refuse to guess in
  either direction: it does not say "failed" for something it has not confirmed failed, and **it does not
  offer to send again**, because a duplicate switch is real money. It offers checking, and the question
  the advisor actually has: what do I tell Sharma?
- **The fund explorer is chat-LED now (19 Sep), and there is a written answer to "is the feel missing?"
  in `docs/FEEL.md`.** Until today the only way to change a parsed query was to tap ✕ on a chip, which
  is a filter panel with a composer parked under it. `funds.jsx` gained a **refinement parser** —
  patterns, like the router, and the screen says so — covering the three things an advisor types after
  a first search: ADD a category, DROP one, or turn the shelf filter on and off. "only X" REPLACES the
  category filters rather than adding to them, because an advisor who says "only flexi cap" after asking
  for equity means one thing and adding it would return nothing. Anything else lands in bucket 4's
  sentence with the three things it can do — never a silent half-application.
  **The count now sits with the chips and moves**, from the same `fundsFor` that builds the rows, so the
  number and the table cannot disagree; at zero it says what to do instead of showing an empty table.
  A typed refinement is the advisor's own turn on their side, then a SMALL answer saying what changed —
  not the first turn printed again, which is the repeated data this product has been pulled up on twice.
  **F-43:** the query chips drew their ✕ as a character inside the label, so a screen reader read
  "Flexi cap ✕" as the name and nothing told a remove chip from a select chip. `Pill removable` draws it
  and names itself "Remove Flexi cap". Deliberately NOT a nested button — `Pill` is a `<button>`.
  **`docs/FEEL.md` is the review the owner asked for**, against shipping apps on Mobbin rather than
  award sites, and its conclusion is one sentence: the feel that is missing is that **a figure is never
  allowed to land**. `HeroNumberCard` is in the system and on exactly one screen. That change is the
  owner's to make because it alters four built screens, and it has NOT been applied.

- **Journey F is built (19 Sep): Meera's client review**, `screens/journey-f/review.html`, eight states,
  and the last of the three journeys `ResultCard` was built for. Its one rail step is **not a
  fact-finding question** — the book holds every fact this review can state. What Sentinel cannot infer
  is **what the review is FOR**, because the same holdings make a different document for a file, for a
  meeting, and for a decision to invest more. The facts never change; what is left out and what is
  proposed does, and **the product will not turn a record into a proposal on its own.**
  **The review's finding is a MISSING FIGURE.** Her record has the value, the fund count, the long tail,
  the SIP, the mandate, the risk number and the goal — and NOT her 43 holdings and NOT her actual
  equity/debt/cash split. So the review describes the shape of her book exactly (14 funds hold 80% =
  ₹14,72,000; the other 29 hold ₹3,68,000, ₹12,690 each, none reaching 1.5% = ₹27,600) and **cannot say
  whether she is on her mandate**, which is the most useful sentence a review would carry. It says so on
  the document, with the reason and with the one thing that fixes it for every review after. `StatTile
  locked` exists for exactly this and had been on no screen since v9.
  **The tail is ONE row, not twenty-nine** — a list an advisor cannot read to a client hides the finding.
  **There is no primary button on the card, deliberately:** a review commits to nothing, and a record
  that ends in one big dark button is a proposal wearing a record's title. Journey D's button sends a
  document and Journey E's moves money; both earn theirs.
  `LiveRail` gained `onAnswer(step, chip)` — the answered list stores the LABEL the advisor sees, and a
  journey that branches needs the chip. Journey F is the first to branch, on `chip.audience`, so copy can
  change without moving the branch. A duplicate door was caught and removed on the way: the record
  ending offered "Save it to her file" beside `ResultActions`' own Save.

- **Journey E is built (19 Sep): Sharma's rebalance, reached COLD**, `screens/journey-e/rebalance.html`,
  nine states. Journey B rebalances him at the end of a drift explanation; an advisor who types
  "rebalance Sharma" with nothing in front of them had no answer at all — and **"rebalance" is not an
  instruction until someone says how far.** That is the one rail step SCREENS-PLAN counts for it.
  **The three answers are three RULES, not three appetites:** his mandate (equity 60, moves ₹1,56,530),
  the ±5 drift band (equity 65, ₹85,380), and the 25% single-fund ceiling (equity 58, ₹1,85,000 — past
  the mandate, because the ceiling sized the move and not the drift). Quant Small Cap is 31% of his book
  AND the whole of his small-cap sleeve, so one holding is over two different ceilings that are both 25.
  **Only one of the three is costed, and that is the point.** `rebalance.costParts` is an honest
  placeholder: the split between exit load and tax needs the purchase dates on folio 9142/28, which
  nobody has supplied. So Sentinel sizes all three, costs one, says which figure is missing and what
  would produce it — and **there is no path from an uncosted target to a confirm sheet at all.** A
  product that lets an advisor approve an uncosted switch has made the number optional.
  **One body, two frames:** `MovesBody` in `moves.jsx` draws the simulation and the two move cards once.
  Journey B wraps it in a `SentinelBlock` because there it is the next sentence in a conversation;
  Journey E wraps it in `ResultCard journey='rebalance'` because here it is an artifact asked for cold.
  Exactly one approve on either, never both. `MovesSimulation` gained a `provenance` prop so the card
  does not stack two near-identical provenance lines — the repeated data the owner has objected to twice.
  **F-42, found by driving it:** `ArtifactCard` rendered its rule and three-slot footer unconditionally,
  so every `ResultCard` in the product ended in 44pt of dead space and **three enabled, unnamed buttons
  in the tab order**. Measured on the live DOM: 677px → 621px, three unnamed buttons → zero.
  Also fixed in the prototype: the moves confirm sheet was mounted inside the thread's tree, so reaching
  it from the RAIL set the state and opened nothing. Both sheets now mount above the `ScreenStack`,
  because a confirm is a surface and not part of the screen that opened it.

- **Journey D is built (19 Sep): Amit's proposal**, `screens/journey-d/proposal.html`, nine states, and it
  is **`ResultCard`'s first screen** — the component shipped in v9 and sat on no screen for months because
  the three journeys it exists for were unbuilt. Four rail steps, which is SCREENS-PLAN's own count (22
  across the rail: Risk 16, Proposal 4, Review 1, Rebalance 1), so `LiveRail` now takes its steps and its
  result as arguments and there is still ONE loop deciding what "edit answer 3" does.
  **Step 2 is not a question.** The advisor asks for ₹50,00,000; his mandate caps at ₹25,00,000; Sentinel
  names the ceiling, says plainly that it has not applied the larger number, and offers both real paths.
  Same sentence and same field as the router's bucket 2. That also **answers SCREENS-PLAN open question 2**:
  the archive's reference answers "₹50 lakh" and is headed "Where ₹25 lakh would go", and both numbers are
  real — one is the ask, the other is the ceiling.
  **The journey ends in a document, not in money.** His KYC is in process and he has no nominee, so the
  proposal can be saved, downloaded and SENT and not one rupee can be placed. `ResultPrimary`'s success
  line says the client has it and cannot say more, because a rebalance and a proposal need opposite
  sentences — so the consequence is written in the turn beneath, and it says the opposite of Journey B's.
  **Found while building it:** `ResultCard.d.ts` still told its consumers to put the actions in "the Dock's
  `chips` slot" and the CTA in `cta` — the pre-ruling dock, eleven months after the ruling. Corrected.
  `savedAt` takes a DATE, not "Saved · date" (the badge adds the word), and `VersionRow` takes the whole
  list rather than one row each; both were my errors, both caught by looking at the render.

- **Build order #7 is done: `screens/prototype.html`** — the app end to end, and the last row of the
  plan. One phone, one composer, and the **router** decides which journey a sentence enters: the six
  buckets are regular expressions over the sentence, said out loud on the page because every screen in
  this repository is downstream of which bucket they pick. The order is a decision — an ACT instruction
  is tested BEFORE the fund search, because "sell all of Sharma's Quant Small Cap" carries a fund name
  and matching it as a search would turn an instruction into a browse. Bucket 4 is last and is the
  default: nothing is guessed at.
  Beside the phone, **the four questions a chat UI must answer** (where am I · what can I do · what
  happens next · how do I go back) are produced by ONE function, `affordances(state)`, from the live
  state — so the panel cannot name a control the screen does not have. That is the "intelligent
  controls" ask made structural rather than written down.
  **Four things were lifted or promoted so nothing is drawn twice:** `ScreenStack` into the system with
  a contract and a spec page (the Journey B prototype's own note said it would be, the moment a second
  live page needed it — and that page now draws the system's one); the ledger table, the fund shortlist
  and the whole `LiveRail` out of their pages into their modules.
  **`ScreenStack direction="back"` invents no keyframe:** the system's two, reversed and swapped, so
  leaving a surface looks like leaving. Under reduced motion a reversed fade is still a fade.
  **Two defects only driving it could find:** the thread's composer was `value=""` with a no-op
  `onChange`, copied from screens that only had to SHOW a composer — so "type anything, the router
  decides" was a claim the page could not keep; and **F-39**, the app bar's menu and new-thread buttons
  had no accessible name, on every screen in the product. `check-previews` renders the FIRST state of a
  page, so neither was visible to it.

- **R3 is built (19 Sep): the money ledger**, `screens/thread/ledger.html`, three states. It answers the
  third thing third-party advisors ask for in every app, and it is NOT the drawer: the drawer is the
  history of conversations, this is the history of MONEY. Five instructions from `book.jsx`'s new `LEDGER`,
  each with a status that is a **word** — Placed, Settled, Rejected, and **"Sent · no answer"**, which is
  its own state and not a failure (rule 2: the colour never signals alone). Three columns, not four:
  `DataTable` turns on a horizontal scroller at four non-sticky columns, and the first cut put Status off
  the right edge — the one question the table exists to answer needed a sideways scroll to reach. The
  client moved into the row's detail instead, where it reads as a sentence. A **rejected row opens in
  place** and carries the RTA's own reason — "the NACH mandate is registered for the old amount" — which
  is the difference between an advisor who can fix it and one who rings support. The period pills say what
  the table is a record OF, and the provenance line says **4 of 5 confirmed** (R1: a count of rows is not
  a count of outcomes). `DownloadAction` holds its own loading state on itself, because this product has
  no toasts; **nothing writes a real file** — the export is designed, not implemented.
- **Build order #6 is done: `screens/thread/refusals.html`**, six states. The six buckets a sentence
  lands in — out of bounds (with the clause that matters, "I have not applied it"), an instruction that
  would act (read back as exactly what it would do, down to the folio, before any confirm), not
  understood, out of scope, and a name with no intent — plus **the standing answer to "what can I do
  here?"**, which had no home in the product at all.
  **Bucket 5's copy is written for the first time here:** `router.ts:36` declares the out-of-scope bucket
  and nothing ever returned it. Three rules went into it — name the thing asked for, say plainly that
  Sentinel does not do it and why, hand back the nearest real thing. Never "I can't help with that".
  **Every refusal names what it CAN do in the same breath**, and that is the research's doing: the
  highest-rated advisor app in the sample is praised for a named human who answers, and its 1★ reviews
  are that axis inverted.
- **Four of the research's own findings are closed in the same pass.** R1: the allocation now says "all
  18 funds reported" — completeness is not provenance. R4: the cap split is in the book and the breached
  **small-cap sleeve (31% against 25%)** is drawn, because both of this product's 25% ceilings were
  written against caps the three-row card never showed. G6: the drawer has a `search` slot and the live
  phone filters 512 names. And **F-38** — `ConcentrationBar` drew 100% for every fraction, since it was
  written, because `ds-grow … both` overrode its inline `scaleX`. That is the THIRD time this one CSS
  fact has cost a figure (F-27 was the opacity half), so the rule is now in the component's own header:
  an animation with `both` owns the property it animates.
- **There is evidence now, and it is honest about being thin: `docs/RESEARCH.md`.** 60 real, linked
  verbatims from Google Play — KFinKart Distributor (advisor-facing, 3.2★), AssetPlus Partner
  (advisor-facing, 4.7★) and Groww (investor, 4.8★) — coded and ranked by frequency × severity. It is
  not a usability test and the report says so in its own second paragraph.
  **What it confirms we already do:** provenance under every figure, the placed/drafted line on the
  success screen, never restyle, and saying what we cannot do instead of guessing.
  **What it opens (now APP-PLAN §5b, R1–R4):** completeness as distinct from provenance — *"total AUM
  shown is less"* because one AMC had not reported; the **in-flight state** of an instruction, which we
  have not designed and which appears on a bad day; a **money ledger and export** (`DownloadAction` and
  `DataTable` exist and no screen uses them for it); and the **allocation being one level too coarse** —
  an MFD's own words, *"it says equity no mention of mid large or small"*, against ceilings we write in
  terms of caps the card never shows.
  **What the highest-rated advisor app is actually praised for:** speed of onboarding, and a named human
  who answers. Not analysis.
- **There is one book now: `screens/data/book.jsx`**, and `docs/DNA.md` explains it. Every client, fund,
  holding, limit and tax rate in one file, with the line between REAL (SEBI's scheme categories and the
  large/mid/small definitions, equity taxation at 20% / 12.5% above ₹1.25 L, the shape of a KYC record, a
  NACH mandate, an ARN/EUIN, a folio, a riskometer band, an exit load — all checked against the market on
  19 Sep, not remembered) and ILLUSTRATIVE (every rupee figure) written down inside it.
  **Sharma's ₹14.2 L is derived, not invented:** the product says a ₹1,85,000 switch moves equity thirteen
  points, and a switch changes today's allocation while a SIP redirect does not — so the portfolio is
  ₹1,85,000 ÷ 0.13. Change one and the other has to move, or screen 5 starts lying. The fund list and the
  drawer's client list are now COMPUTED from the book, including the reverse lookup of who holds what.
  `docs/DNA.md` also carries the terminology table (what the market calls it / what Sentinel says / why),
  the copy rules with the sentences the product owns, and the visual DNA in one page.
- **Journey C is built (19 Sep): `screens/journey-c/funds.html`**, six states. A sentence becomes a parsed
  query whose every part is a removable chip; the shortlist arrives as an artifact in the thread (there is
  no explorer screen, because there is no canvas); and a fund's page opens INSIDE its row — `DataTable`'s
  own rule, which overruled the plan's "bottom sheet" line.
  **It is the journey that found what the product does not know.** No confirmed source for fund
  performance, TER or AUM, and no holdings feed — so the fund card renders locked with the reason in
  words, and the overlap between two flexi caps is an em dash with a footnote rather than a 0. The most
  useful column it does have is the reverse lookup: which of the advisor's own clients already hold each fund.
- **Two more system defects, both found by cropping the phone:** F-36, `InfoCard`'s card-level `locked`
  blanked stats it HAD (it printed —— over "Held by your clients: 1"); F-37, a `DataTable` row's detail was
  cut off by the table's own sideways scroll, so a fund's page lost its sentence mid-word. Also `DataTable`
  gained `defaultOpen`, because the expansion was internal state and a frozen specimen could not show the
  state the no-modal rule is about — the same gap and fix as `ProgressTrace.initialCollapsed`.
- **Journey A is built (19 Sep): `screens/journey-a/risk-profile.html`**, eight states, one of them the
  whole twelve-question journey running. The rail is pinned under the app bar and does not scroll;
  answers collapse to a `QAPair` each; a smart chip names its SOURCE ("Use her KYC age — 38") so tapping
  it is not guessing; a money question swaps the Dock's composer for `MoneyComposer`; two interjections do
  arithmetic out loud and do NOT advance the rail; and the result states that 54 is the lowest of three
  scores and therefore the binding one. **The rail's chips are in the turn, not the Dock** — it was the
  one surface the 18 Sep ruling left for a deliberate migration, and building it new is that migration.
  **That leaves `Dock.chips` and `Dock.cta` with no consumer anywhere in the repository** — a removal,
  and the owner's call.
- **Consistency, the owner's rule of 19 Sep.** Edit-the-last-prompt existed on one screen out of five and
  three screens had a paperclip that dropped the file. Both are components now — `AskTurn` and
  `useAttachment`/`AttachedTurn` in the thread shell — so a page cannot forget them, and
  `check-previews` FAILS any `screens/` phone that draws an attach disc with nothing behind it
  (`data-attach="inert"`). In the rail, editing the last ANSWER is the same gesture with a bigger cost:
  it reopens the journey at that question, which is what `MessageActions`' contract has always said.
- **The going-back layer is built (19 Sep):** `screens/thread/going-back.html`, seven states. Four
  affordances the system had specified and no screen had ever placed — mark an answer wrong **with a
  reason** (down is deliberately not symmetrical with up), ask a follow-up too long for a chip
  (`FollowUpRow`, whose own contract already said rows belong in the thread and not the dock — written
  before the 18 Sep ruling), **revert to the version the client actually saw** (revert APPENDS, so the
  trail only grows), and **resume a journey left at question 7** (the banner names the journey and the
  question, and is pinned under the app bar because it is a state the whole thread is in). The thread
  shell gained one `banner` slot for exactly that and nothing else.
  Marking an answer wrong does NOT delete it or silently re-run it, and the screen says so: an affordance
  that quietly replaced what it was rating would be unsafe to use in front of a client.
- **Journey B is finished (19 Sep).** `05-decide.html` carries steps 5, 6 and 7: the two moves with a
  **simulation** of what they would do (two `Dumbbell`s on one scale — he is at 71%, he would be at 58%,
  against the 60% he agreed to, with ₹11,200 under it), the **confirm sheet**, and a success that says
  plainly what has and has not left Sentinel. The simulation was moved *into* step 5 rather than built
  after it, because a figure an advisor must defend should not appear first on the surface that asks them
  to approve it.
- **`ConfirmSheet` is new in the system** — the one surface in the product with no composer, and it takes
  no composer prop at all, so rule 3's single exception lives in the type rather than in a caller's
  discipline. `disclosure` and `rows` are REQUIRED: small print under the numbers is small print read
  after the decision, and compliance not stated as a row is compliance implied by silence. It also shows a
  visible dismiss beside the commit — the archive's sheet offered only the scrim, so the one control an
  advisor could see said Approve.
- **The two archive copy defects are closed**, not copied forward: 71→58 vs 67→58 (the pair's figure is
  stated once, on the simulation, and no per-move figure was invented to replace the 67), and "her ₹30,000
  SIP" in a journey whose client is a he.
- **Two defects found by cropping the phone, both in the system:** F-34, a `Dumbbell` label REPLACED its
  own number, so the rebalance simulation rendered two dots and no figures; and a `ConfirmSheet` mounted
  already open took the page's keyboard, because I copied the F-25 focus pattern's shape and not its
  initialisation (`useRef(open)`, not `useRef(false)`). The second never shipped — it was caught by a blue
  focus ring in a screenshot, measured, and fixed before the commit.
- **The app plan exists now: `docs/APP-PLAN.md`** — written on the owner's brief that the system and the
  app are one deliverable, not two. Its spine: the 42 components no screen uses are not a component
  backlog, they are the app's missing *behaviour* (leave a journey and resume, revert to the version the
  client saw, say an answer was wrong, enter an amount, compare two funds, read a fund's page). Five
  surfaces rather than seven screens; a build order in seven commits; and `report:parallel` reading 86 of
  86 as the finish line.
- **Both open decisions were called (the owner asked for a vote and to proceed).** (1) Home's placeholder
  is now "Ask Sentinel" — the long one repeated the three starter chips 55pt below it, and the map in
  `Composer.d.ts` was written before Home had chips; the map is amended with the reason. (2) The waiting
  phase stays its own page, because it changes the CONTROL SET (Stop in the send slot, Continue, Try
  again) and not just a height — and the pages are now named for a surface and a phase rather than
  "Screen N of 7", with the seven numbered steps kept on `flow.html` where a step is a moment in Sharma's
  story. Written up on the answer page and in APP-PLAN §1.
- **Five rulings from the owner reading the screens, all applied.** (1) **Nothing is pinned above the
  composer** — chips and CTAs live in the conversation and scroll with the message that offered them;
  `Dock.chips`/`cta` deprecated, contradiction 60, rule 3 untouched. (2) **One signature per turn** —
  `SentinelBlock continued`, because the trace and the answer each signed themselves. (3) **One door per
  thing** — the card's `Why?` is gone; the chip that asks the question in words stays. (4) **Copy in plain
  English** an advisor can read aloud — "what moved the mix", not "drift attribution"; figures unchanged.
  (5) **A state of a screen is not a screen** — screen 4 folded into screen 3, one page fewer to publish.
  Also: the paperclip now works on Home, and an attached file arrives at the END of the thread on the
  advisor's side (`FileUpload side="advisor"`), where it had been pasted above Sentinel's reply at full
  width, reading as something Sentinel produced.
- **The reviewer agent found thirteen things on the three screens built before the rulings, and eleven are
  fixed.** The two HIGH ones: screen 2 was telling a different story from screen 3 in exactly the words
  ruling 4 named (its own copy of the question, steps and reasoning had drifted — now it draws the shared
  `answer.jsx` ones, no figure moved); and on the drawer phone the page calls *"the screen"*, **four
  controls were drawings** — Back to home and all three "See all" rows did nothing when tapped. Both wired
  and driven with Playwright: See all raises that section's cap in place (rows 48 → 51, Sunita's row
  appears), Back to home closes. Also fixed: `thread.jsx` no longer pipes the two deprecated Dock slots no
  screen passes; the drawer page claimed a composer the drawer deliberately does not have; the theme
  caption said "Dark arrives with its tokens" (jargon in a menu — now "Dark is coming") and was drawn from
  two copies; `ds-drawer` was a sixth component-local keyframe that two lists still called five.
  **Still the owner's call: Home's placeholder** repeats the chip row 55pt below it ("Ask Sentinel about a
  client, a fund, or a plan" vs "Build proposal · Review portfolio · Fund explorer"). Shortening it to
  "Ask Sentinel" would de-duplicate, but `Composer.d.ts` documents the home placeholder as the long one, so
  it is a documented system behaviour, not a screen's choice.
  **And one question the agent put well:** by ruling 5's own test, is screen 2 (the trace) a state of screen
  3 rather than a screen? Same thread, same turn, same question. The argument against folding is that it
  changes the CONTROLS — the send slot becomes Stop, and it carries Continue and Try again — which is a
  different interaction contract, not a different moment. Worth deciding out loud.
- **Home keeps its starters in the Dock, and now the contract says why.** The ruling moves what a *message*
  offered into that message; Home has no message and no scroller (measured: zero scrolling elements). The
  carve-out is written into `Dock.d.ts` and contradiction 60 rather than living in a screen's comment.
- **The reviewer agent the owner asked for:** `.claude/agents/sentinel-interface-reviewer.md`. It renders
  the pages, looks at them, and reports repetition, duplicate controls, placement, whose-message, controls
  that are drawings, copy and iconography — with `path:line` and the smallest fix. Every item on its list
  is there because the owner found it on a rendered screen and no check did.
- **The parallel rule, and the two components that proved it.** The owner's words: *nothing in the design
  system that is on no screen — screen and design system 100% parallel.* `MessageActions` had offered Edit
  since v1 with no state to go to, and `FileUpload` had carried its staged parse since v7 while the
  composer's paperclip was a `<div>`. Both now work: `UserBubble` gained an **editing-in-place** state with
  a `costNote` that says what sending destroys before it destroys it, and `Composer` gained `onAttach`
  (omit it and the disc renders exactly as before). `npm run report:parallel` measures the gap
  transitively — **44 of 86 on a screen today**, and a screen naming what the system does not export now
  fails CI.
- **F-30, the owner's third catch:** the artifact peek RESERVED 96pt instead of capping at it, so a 62pt
  chart left 34pt of empty card above the provenance line; and `ChartBar`'s three tracks ended 4pt apart
  because the value column sized to its text. Both fixed in the system — `maxHeight` instead of `height`
  (card 243 → 209, gap 44 → 10) and `minWidth: '4ch'` on the value (tracks all end at 334). The widget in
  the owner's screenshot was the KIT's hand-drawn copy, which gets neither fix; see below.
- **Owner's second ask, open:** the review artifact's *UI kits* section shows the OLD Home (“Jump back in”,
  chips) because `design-system/ui_kits/sentinel-app/home.jsx` IS the imported kit's Home. The kit is
  “states, not product screens” (`readme.md:258`) and the standing rule is not to touch `ui_kits/`. Two
  honest options for the owner: (a) leave the kit as the import record and label it so on the artifact
  cover (done in the cover copy — “imported states; Screens supersede them where they differ”), or (b) update
  the kit's Home / Chat artboards to the built screens — a `design-system/` change with integrity, and a
  visible one. Not done without the word.
- **Small gaps logged, not fixed:** `ProgressTrace` restarts its clock at 0 on Continue (internal clock; the
  archive did the same); the composer's attach disc is a `<div>`, not a control (archive too); the
  six-bucket router is not ported, so the prototype routes only a question containing “drift”.

### Rulings made this session, not visible in code

Beyond §4. Each was the owner's call; do not re-open.

- **Single-fund ceiling is 25%** (contradiction 32). Two different rules share the number 25 — single-fund (2 sentences, 3 places) and the small-cap **sleeve** (9 surfaces). The ruling is about the first only.
- **Home** = greeting · ready-prompt card (advisor's own book, whole sentences, named clients) · starter chips above the composer ("Build proposal · Review portfolio · Fund explorer") · composer. Saved work ("Jump back in") **moved to the drawer**. AMC offer row **removed, permanently** — reason in `SCREENS-PLAN.md` §2; it will be proposed again as "engagement" and the answer is no.
- **Two lists, two jobs**: the card sends *this* proposal for a named client; a chip starts *a* proposal and the thread asks who for. When the book is unavailable the card is **omitted**, never faked with capability rows.
- **Drawer** = Jump back in (cap 3) · Recent (cap 7, one line: client as title, topic as meta, no timestamp) · Clients (cap 8) · "Back to home" · Light/Dark control. **No composer** — owner's ruling, logged as contradiction 59; `readme.md:68` still names the drawer and needs the owner's wording. Row heights are `ListRow` at 56 (F-21 ruling), caps are `List.jsx:8`'s own 3/7/8.
- **Light/Dark control lives in `screens/`, not the system** — the system has one theme and cannot specify a two-state control. `RangePills`' `locked`/`lockedNote` pattern, copied verbatim. Promotion trigger: contradiction 58.
- **`StatusSpacer` takes `time`** (default 9:41). **`GreetingDivider` wraps** instead of truncating; its hairlines yield first (open, owner's call on a `max-width`).
- **No screen mounts `ExplainerSheet` already open** (§4).
- **The gutter guard** (`check-previews`) covers `screens/` and `ui_kits/`, not spec pages — deliberate, measured, documented in `screens/README.md`. `--self-test` proves it can fail. `data-gutter="edge"` makes an element the frame for its subtree (the drawer).
- **Everything designed here is 375 wide.** Screens are 375×812 by construction; the flow, index and artifact cover were measured to fit 375 with no sideways scroll.

### Two copy defects waiting in the archive (fix when screens 5 and 7 are built)

`docs/screens-source/src/screens/Chat.tsx`: the rebalance sentence says **71% → 58%** while the move card says **67% → 58%** (`:280` vs `:283`); and Sharma's SIP is "**her** ₹30,000" (`:284`, `:753`) in a journey that says *his* everywhere else. Both recorded on `screens/flow.html`.

### Why so many bugs — the honest audit, and the guardrails that came out of it

Five of this session's 25 commits are corrections of earlier commits in the same session. The owner caught four defects from a screenshot or a crop that I had already looked at and passed. The pattern, so the next session does not repeat it:

1. **Writing before measuring.** The card that ran 8pt past the edge, the label that lost a third of itself, the uncapped drawer with the client book below the fold, the greeting that would not wrap — every one was visible only after render, and my own first look missed the card. *Guardrail:* measure the geometry with Playwright **before** calling a screen done, not after; the probes in the scratchpad (`probe-gutter`, `measure-drawer`, `w375`) are the shape of it and should become `tools/`.
2. **One shared Babel scope.** Every `text/babel` file a page loads compiles into one global scope, so a second `const { Dock } = …` is a `SyntaxError` and the page renders **nothing**. It broke Home's extraction and the drawer, both on first load. *Guardrail:* shared `.jsx` files use one uniquely named const (`THREAD_DS`) and never destructure at top level — see `thread.jsx`.
3. **The harness checked "did it render", not "is it right".** "75/75 clean" was true while a card was cut off. The gutter guard fixes one class. **Still unchecked:** truncated text (`scrollWidth > clientWidth`), and raw style literals in `screens/` — `lint:adherence` runs on `design-system/` only, and `screens/` carries **71 raw px values** today. *Guardrail to add first next session:* a truncation probe in `check-previews`, and adherence lint on `screens/` (as a count in `_index.json`-style, then as a gate).
4. **Not reading the system before building on it.** The 3/7/8 caps were in `List.jsx:8`; `box-sizing: border-box` was in the kit's own `card` style; the rule-3 exception was in `readme.md`. *Guardrail:* before a screen, grep the components it uses for comments that name that screen.
5. **A patch that failed but a commit that went out anyway.** The index-link edit failed its assertion; the shell chain used `;` not `&&`, so the commit landed with a false claim in its message. *Guardrail:* every edit-then-commit chain is `&&`-joined, and the commit message is written after the check, not before.
6. **Three review surfaces got confused** — the published Artifact, the Design-type Artifact (created by mistake and deleted), the Claude Design canvas. *Rule:* the Artifact is the review surface today; the canvas waits for the owner's project decision.
7. **Two sessions on one branch.** Another claude.ai/code session pushed `65c03ac` mid-session. It was pulled and corrected, not clobbered. *Rule:* one writer per branch; check `git fetch` before every push.

### Are the screens aligned with the design system?

Yes, by rule now. On 18 Sep evening the owner ruled that **a screen never hand-builds what it needs: it goes into the design system first, passes every audit, and the screen picks it from there.** Applied the same evening: `shell/Drawer` and `actions/SegmentedRow` were promoted from `screens/shell/drawer.html` into the system with contracts, spec pages and **0 literals**, and the screen now only composes them. Every screen — Home, the thread, the drawer — draws nothing of its own. Guards that hold this: `lint:adherence:screens` in CI, the static shared-scope check, the truncation probe, the gutter guard (`screens/README.md` rules 8–11). Still open and named: raw px values in `screens/*.jsx` are not counted the way `_index.json` counts them for components.

## 1 · What this is, in four lines

Sentinel is Centricity WealthTech's chat-led wealth-management assistant for advisors. Mobile only,
375 × 812, warm cream, no dark mode. `design-system/` is a Claude Design project **imported verbatim**;
everything else in this repository is the scaffolding around it and the audit since.

The owner is the designer. They built the system on another Claude account, ran out of tokens there,
and moved it here to finish it.

## 2 · Where the work stands

| | |
|---|---|
| Branch | `claude/practical-newton-fi0pof` — the repository's **only** branch, and its default |
| Last commit | `2cb7412` · screen 2 of Journey B (was `dcfe133` when this file was first written) |
| Components | **86** · all exported, all with a hand-written `.d.ts` (84 → 86 on 18 Sep: `Drawer` and `SegmentedRow` promoted from the screens) |
| Spec pages | **43 of 86** · Tier 1 closed |
| Preview pages | **80 / 80 render clean** (`node tools/check-previews.mjs`) — 75 design-system + 5 screens |
| Integrity | 370 files hashed, clean |
| Findings | F-1 … F-26 in `docs/FINDINGS.md`. **None open.** F-11, F-21 and F-25 closed 18 Sep |
| Roadmap | 1 Import ✅ · 2 Audit ✅ (ongoing) · 3 The four unbuilt components ✅ · **4 Screens — 3 of 7 built, see §0** |

**Tier 1 is defined as:** every component that carries one of the four rules, or that the chat spine is
built from. Tier 2 is the remaining 43 — chips, buttons, marks, icons, shells: short contracts, and
behaviour already visible on a group board.

## 3 · Read these, in this order

1. **`CLAUDE.md`** — the standing instructions. They override defaults.
2. **`.claude/skills/sentinel-craft/`** — load the skill before touching anything under
   `design-system/`. It carries this system's own scale (generated from `tokens/*.css`, so it cannot
   drift), the four rules, the real motion values, and `references/borrowed.md`, which records what was
   taken from outside advice **and what was rejected and why**.
3. **`design-system/readme.md`** — 43 KB, and it is the specification, not a summary. Nearly every
   surprising decision has a paragraph explaining what it cost and why it was taken anyway.
4. **`design-system/guidelines/contradictions.md`** — the system's own list of known inconsistencies.
   Check it before reporting anything as new.
5. **`docs/FINDINGS.md`** — 26 findings, every one with how it was found. Read it before you decide
   something is a bug; several obvious-looking "bugs" are recorded there as deliberate.
6. **`docs/HANDOVER.md`** — what a developer consuming this library needs.
7. **`docs/SCREENS-PLAN.md`** — roadmap step 4, planned and not yet approved: the screen inventory,
   the state matrix, the gap list and which journey goes first. Read it with
   `docs/screens-source/README.md` beside it.

> ⚠️ **`docs/HANDOFF.md` is NOT instructions for you.** It is the readme that came inside the original
> Claude Design export, kept for provenance. It tells an agent *"don't render these files in a browser
> or take screenshots"* — which is the exact opposite of this project's rule. **`CLAUDE.md` wins.**

## 4 · The rulings that are not in the code

These were decided in conversation. They are binding, and re-litigating them wastes the owner's time.

| Ruling | Why |
|---|---|
| **Never restyle.** Colour, type, radii, shadow, motion character are settled. | The visual language is the product. Fix gaps, alignment, correctness, consistency — not appearance. A change that alters what something *looks like* needs the owner's decision first, and the commit must name the ruling it answers. |
| **No pie charts, no colour themes for charts.** | Measured, not asserted: adjacent slices in this palette come out at ΔE 11.4 against a floor of 15, and a muted trio collapses to ΔE 3.8 under protanopia. `ChartShare` is the answered version — a 100% stacked bar with a ranked legend. |
| **No Lottie, and no motion library.** | ~250 KB of runtime in a repo with **zero** runtime dependencies; a Lottie file bakes its colours so it cannot take tokens; no `prefers-reduced-motion` path without custom wiring; and the system's own aesthetic rejects that layer — *"No photography, no illustration"*, *"Success is a drawn check, not confetti"*. Sentinel's motion is entirely predetermined, so it is CSS transitions and keyframes. |
| **Waiting verbs are words, not motion.** | `SentinelThinking`'s `verb` changes the label and nothing else. Six of six AI assistants surveyed pair a wait with a named verb; none ships a bare pulse. The verb must be **true and checkable** — it names the source the answer will cite. |
| **`ui_kits/` stays inside `design-system/`.** | Moving it breaks the three prototypes' relative paths. The owner's instruction was explicit: *"kuch kharab nei karna chahta agar kuch khrab hoga to rehne do."* Screens get a **new** top-level `screens/` instead. |
| **`StickyCTA` is deleted** (18 Sep 2026). | It was deprecated first so the removal would be a decision taken on purpose; the owner took it. `package.json` is `private: true` and nothing in the system imported it, so there was no consumer to break. See F-11 and `CHANGELOG.md` → Removed. |
| **No screen mounts `ExplainerSheet` already open.** A sheet mounts closed and is opened by an action. | F-25's Tab trap arms on the `false → true` transition, which is also what moves focus in. That is right for a spec page rendering six specimens, but it means a sheet mounted with `open={true}` — a restored state, a reload, a deep link — gets neither focus nor a trap. The component is not wrong; this is the screens' side of the contract. Verify it on every screen that carries a sheet. |
| **Figma export comes last.** | The owner *is* the designer and wants Figma only after the design system and the screens are both complete. |

## 5 · How the work is done here

This is the part that is hard to infer and easy to skip. It is also the reason the findings list is
what it is.

- **Look at the work.** `npm run preview`, then render it. `node tools/check-previews.mjs --shots <dir>`
  renders all 73 pages at their declared `@dsCard` viewport and reports console errors, 404s and pages
  that mount nothing. **A finding you did not see did not happen.**
- **Never report a visual finding from source alone, or a code finding from a screenshot alone.**
  `DownloadAction` was once blamed for a nested `<button>` from a stack trace; the wrapper was
  `ArtifactCard`, four frames down.
- **A clean render is not proof the document is well formed.** Five spec pages passed
  `check-previews` and published blank (F-23). The harness asks *"did something appear"*, and something
  had. `check-previews` now also counts `<body>`, `#root` and the page-kit script statically.
- **Prove a no-op, do not assert one.** Token substitutions in F-24 were verified by hashing five board
  screenshots before and after — all five byte-identical.
- **The preview pages read `_ds_bundle.js`, not the source.** A component change is invisible in every
  page until `npm run build:bundle`. This catches everyone once.
- **Every change under `design-system/` runs `npm run check:integrity -- --update` in the same commit.**
  That is the mechanism that keeps "imported verbatim" honest.
- **Correct yourself in public.** Several pages in this repo carry a note saying what they claimed
  before and why it was wrong. That is the standard, not an apology.

## 5b · The canvas and the repository — which one is true

Added 18 Sep 2026, before the first Claude Design canvas was made for this work. Read it before you
push anything to a canvas, and before you believe anything you read on one.

**The repository is the source of truth. Not the canvas.** `design-system/` is 367 files pinned by
sha256 in `baseline/design-system.sha256`, and the whole of `check:integrity` — the mechanism that
keeps "imported verbatim" honest — stands on that. A canvas has no such pin.

**The canvas is where the work is reviewed, commented on and tweaked.** That is its job and it is a
real one: the owner is the designer, and they need to select a thing and change it, not only look at
a picture of it.

**Every change made on the canvas comes back as a commit** — in the repository, with
`npm run check:integrity -- --update` in the same commit when it touches `design-system/`. Never
silently. A change that exists only on the canvas does not exist.

**If the canvas and the repository disagree, the repository wins** — and the difference is reported to
the owner, not quietly reconciled. "I pulled the canvas version" is the one move that is never
allowed without saying so first.

**The original Claude Design project (`0682a2d3`) is the origin of this entire system** and is not to
be overwritten. `design-system/_ds_bundle.js` still publishes onto `window.SentinelDesignSystem_0682a2`
because that is where it came from. Ask the owner before writing to it; a new project or a new page is
almost always the right answer.

## 5c · Why `/design-login` fails on Claude Code Web — stop retrying it

Recorded 18 Sep 2026, after three attempts from two accounts.

`/design-login` is **not** missing, misspelt, or account-gated. It is surface-gated. The `DesignSync`
tool says so itself, verbatim, when called without authorization:

> DesignSync needs design-system authorization, and /design-login cannot run in this non-interactive
> session. Ask the user to run /design-login once from an interactive Claude Code session on this
> machine — headless and SDK runs here then reuse that authorization. If this is claude.ai/code, ask
> them instead to use Claude Design's "Send to Claude Code Web" (which seeds the project into the
> workspace) or to provide the project files directly.

Both of this project's sessions run on **claude.ai/code** — a remote container, non-interactive by the
tool's definition. So the command cannot succeed there no matter how it is typed, in the terminal pane
or the chat pane. `zsh: no such file or directory` was the shell being handed a slash command;
"isn't a recognized command here" was Claude Code correctly reporting the same gate.

There are exactly two ways in, and neither is a retry:

1. **Claude Design → "Send to Claude Code Web."** Open the project at claude.ai/design and use that
   button. It seeds the project into the workspace and carries the authorization with it. This is the
   path for the sessions we are actually running.
2. **The Claude Code CLI on the owner's own machine.** `npm i -g @anthropic-ai/claude-code`, `claude`
   inside this repository, then `/design-login` once. That session is interactive, so the command
   runs; the authorization it writes is then reused by headless and SDK runs on that machine.

Until one of those happens, `DesignSync` is unavailable **on that surface**. Do not report a canvas as
made, or a project as checked, on the strength of anything but a `DesignSync` call that returned. That
last rule is the durable one and it still stands.

### 5c.1 · Path 2 worked — corrected 18 Sep 2026, from a different surface

The section above was written from a **claude.ai/code** session and is correct about claude.ai/code.
As a blanket statement it was wrong, and this is the correction rather than a quiet edit.

A **Claude Code desktop app** session took path 2 — the CLI on the owner's own machine, then
`/design-login` once in a real interactive terminal — and after that `DesignSync` returned normally
**in the desktop session**. `/design-login` typed inside the desktop app's own Code tab still answers
"isn't available in this environment": that pane is not the interactive terminal the tool means. The
terminal is.

So the accurate statement is: `/design-login` needs an interactive Claude Code **CLI** session on the
owner's machine. Once it has run there, other sessions **on that machine** reuse the authorization.
claude.ai/code, being a remote container, is never that machine, which is why §5c's Send-to-Web path
is the right one there.

What a returned call then established, and what it did not:

| | |
|---|---|
| Checked | Six design-system projects are writable by this account: `197f7992`, `43e81071`, `9b8bd6c3`, `35f9eb34`, `4b0f24df`, `62d8af98` — dated May to July 2026. |
| Checked | **`0682a2d3` is not among them**, and none of the six is Sentinel. The newest "Centricity Design System" (`197f7992`) is the *Quiet Wealth* system — General Sans, Satoshi and Zodiak, with Avatar / TabBar / PortfolioCard / HoldingRow. Sentinel is Urbanist and Darker Grotesque, grouped actions / cards / chat / composer / data / forms / icons / lists / shell / text. Related lineage, different system. |
| **Not** checked | Whether `0682a2d3` still exists **anywhere**. `list_projects` returns writable projects only, and this system was built on a different Claude account (§1). Its absence here is expected and is not evidence that it is gone. |

## 6 · What is NOT in this repository

Be honest about these with the owner rather than guessing around them.

| Missing | What to do |
|---|---|
| **`Amicro` (micro-transitions)**, the `interfaces` skills bundle, and the `Libraries.dev` repository. | Their conclusions are already distilled into `.claude/skills/sentinel-craft/references/borrowed.md` and into the motion rulings above. You do not need the sources unless you want to re-derive something. |
| **The review Artifact** (a rendered copy of the whole system, published at claude.ai). | **Artifacts are per-account and private — the link does not carry over.** Publish a fresh one from the new account. The staging recipe is in §8. |

## 7 · What is open, and waiting on the owner

1. ~~**F-21**~~ — closed 18 Sep 2026 as recommended: `--h-row-2l: 72px`, `ListRow` reads it, the `lg`
   collision is contradiction 57, and the five raw `46` / `52` row heights in `ui_kits` now read
   `--h-row-lg` / `--h-row-xl`. The owner's correction to the reasoning is recorded in the finding.
2. ~~**F-25**~~ — closed 18 Sep 2026: Tab is trapped and wraps at the boundary, acting only while focus
   is inside the sheet so a page of open specimens does not fight over it. Measured before and after.
3. ~~**F-11**~~ — `StickyCTA` deleted 18 Sep 2026, on the owner's ruling. 84 components remain.
4. **`docs/SCREENS-PLAN.md` is waiting for a yes.** It also carries six content decisions that are
   yours alone — the 15% / 25% single-fund ceiling is the sharpest.
5. **Next phase.** Tier 2 (43 short pages) or screens. The recommendation on record is **screens**:
   everything a screen is assembled from is now page-verified, and the Tier 2 gaps will show up as
   real gaps while building rather than as guesses on a page.
6. ~~**Three spacing dissents (F-54)**~~ — ruled 20 Sep 2026, the owner took the component's vote; all three
   sites migrated (`9cce54b`).
7. **`docs/FUND-EXPLORER-V2-PLAN.md` is waiting for three yeses** (20 Sep 2026): ceiling marks on
   `AllocationCard` for the rebalance's first turn · the rebalance re-sequenced as answer-first with the
   three rules as dials · the fixture scope (ten funds × three months, generated on PERF's terms — the
   fixtures themselves are already in `book.jsx` because the owner asked for the holdings feed the same
   day). Read it before touching Journey C or E.
8. **The Figma file** (`Centricity-Global-app-design`, node 130-2550) is the other Centricity app's
   design — read for CONTENT and field names, never for shape. The connector was `pending` at the end
   of the 20 Sep session; a new session sees its tools.

## 8 · Publishing the review Artifact from a new account

The owner reviews the system as a rendered, clickable copy. To rebuild it:

1. Copy `design-system/` to a staging directory, rewriting each `.html`: `unpkg.com/` →
   `cdn.jsdelivr.net/npm/`, strip `integrity=` and `crossorigin=`, `_ds_bundle.js` → `ds_bundle.js`.
   (The artifact host allows jsdelivr and not unpkg.)
2. Copy `_ds_bundle.js` to `ds_bundle.js` and `_ds_manifest.json` to `ds_manifest.json`.
3. Publish `index.html` — a hand-written cover page listing the kits, the group boards, the
   guidelines, the spec pages and the four rules — with the rest as supporting files.
4. `.d.ts` files must be published with `contentType: "text/plain"`, or the spec pages' **Props**
   block cannot fetch them.

## 9 · The first thing to check

Before believing any of the numbers above:

```bash
npm ci                            # FIRST — see below
npx playwright install chromium   # ONCE per machine, and only AFTER npm ci — see below
npm run check                     # barrel, bundle, index, scale, integrity, adherence
node tools/check-previews.mjs     # expect 73/73
npm run preview                   # → http://localhost:4321/pages/00-Index.html
                                  #   Screens → /screens/index.html
```

**If port 4321 is already taken, the preview server says so and stops** — it does not fall back to
another port, because the printed URL has to be the URL that works. Whatever else is on 4321 will
answer your browser with its own 404, which reads exactly like a broken page in this repository. Run
`lsof -nP -iTCP:4321 -sTCP:LISTEN` to see what holds it, or `PORT=4322 npm run preview`. Hit on
18 Sep 2026, when an unrelated `python -m http.server` had owned 4321 since August.

**`npx playwright install chromium` is not optional on a local machine.** `playwright` is a
devDependency so `npm ci` installs the *library*, but not the browser binary. Without it
`check-previews` exits with `playwright not found` and **you cannot look at the work** — which is the
one thing this project will not let you skip. The cloud container this was built in had Chromium
pre-installed, so the step is easy to miss.

**The order of the first two lines is not cosmetic.** Each Playwright release pins its own Chromium
build number, and `npx playwright install` fetches the build for whichever Playwright it is running.
If `node_modules` does not exist yet, `npx` downloads the *latest* Playwright and installs *its*
Chromium; `npm ci` then installs the locked `playwright@1.56.1`, which looks for a different build and
fails with `Executable doesn't exist at …/chromium_headless_shell-1194/…`. The fix is the same command
again, now that the locked Playwright is on disk. First seen 18 Sep 2026, the first time this repository
was set up from a clean clone.

**`npm ci` itself failed on that first clean clone.** `package.json` asked for `esbuild ^0.25.0` while
`package-lock.json` had resolved `0.28.2`, and `npm ci` refuses a lockfile that is out of sync with its
manifest. The range was a hand edit in commit `88d961e`; nothing upstream ever ran `npm ci` from an
empty tree, so it was never caught there — and it is why every CI run before this fix failed at the
install step, skipping every guard after it. `package.json` now says `^0.28.2`. That is the version the
committed `_ds_bundle.js` was built with: rebuilding with it reproduces the bundle byte-for-byte, which
`check:integrity` confirms.

Pushing from a local clone needs git credentials for `adityagupta525/sentinel-design-system`
(`gh auth login`, or an SSH key). Reading and rendering need nothing.

`npm run check` ends with **170 warnings and 0 errors**. The warnings are the system's own adherence
debt measured against itself — `pages/_index.json` reports it per component as `literals`. That number
is meant to go down, and it is the honest way to see where this system does not yet follow its own rule.

---

## 10 · The prompt to start a new session with

Paste this as the first message. It is deliberately short — everything else is in the repository, and a
prompt that restates the repository will go stale the moment the repository changes.

```
Ye Sentinel design system repo hai. Main isi ka designer/owner hoon — kaam pehle
dusre Claude account par ho raha tha, ab yahan se continue karna hai.

Shuru karne se pehle, is order me padho:
  1. docs/CONTINUE-HERE.md   — state, rulings, kya open hai, kya repo me nahi hai
  2. CLAUDE.md               — standing instructions (ye defaults ko override karte hain)
  3. .claude/skills/sentinel-craft/ — skill load karo, design-system/ ko chhune se pehle
  4. docs/FINDINGS.md        — 26 findings; kuch "obvious bugs" wahan deliberate likhe hain

Phir khud verify karo, mujhe numbers bata do:
  npm ci && npm run check && node tools/check-previews.mjs
  (expect: integrity clean, 0 errors, 73/73 pages render clean)

Uske baad mujhe batao:
  - state kya hai aur kya aapko CONTINUE-HERE se alag mila
  - teen open decisions (F-11, F-21, F-25) par tumhara vote
  - aage ka plan: Tier 2 spec pages ya screens — tumhara vote ke saath

Standing rules jo main dohra raha hoon:
  - Visual language settled hai. Restyle nahi karna. Gaps, alignment, correctness,
    consistency fix karo. Dikhne wala kuch badalna ho to pehle mujhse poochho.
  - Kaam ko DEKHO. Source padh kar visual finding mat batao, screenshot dekh kar
    code finding mat batao.
  - design-system/ ke har change ke saath usi commit me:
    npm run check:integrity -- --update
  - Branch: sirf apni designated branch par push karo. PR mat banao jab tak main na kahoon.
  - Jhoot mat bolo numbers ke baare me. Jo nahi ho paaya, wo bata do.

Jab tak main na kahoon, koi bada kaam shuru mat karo — pehle review karke plan do.
```

**Nothing needs to be attached to that first message.** The screen source that used to be missing is
now `docs/screens-source/` — read its `README.md` first, including the two warnings and the three files
that were renamed so the archive cannot reprogram the repository. The skills, the specs, the research
conclusions and the decision record are all committed here too.
