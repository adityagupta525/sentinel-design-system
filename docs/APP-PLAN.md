# The app, end to end

**Written 19 Sep 2026, on the owner's brief:** *"mera goal fully end to end mobile app design hai … do
cheez nei chahiye — ek design system jis pe full design app ho, ready final product with all hi-fi
screens, perfect journey and flow with UX UI research and logic … AI chat-led hai to usko intelligent
controls dene hunge … user ki side se b sochna hai: wo next kya karne wala hai, kya kar sakta hai, aur
wapas ka kuch control hai ya simulation."*

`SCREENS-PLAN.md` is the inventory of what the archive had. **This is the plan for the product**: what an
advisor can do, what they are told next, and how they get back. Read this first, then that.

---

## 0 · One thing, not two

The system and the app are not two deliverables. The rule since 18 Sep is that nothing exists in the
system that is on no screen (`npm run report:parallel`), which makes the app the *proof* of the system and
the system the *vocabulary* of the app. Today that number is **44 of 86**.

**The other 42 are not a backlog of components. They are the app's missing behaviour**, and reading them
as a list is the fastest honest survey of what is not designed yet:

| What an advisor cannot do today | The component that already exists for it |
| --- | --- |
| Leave a journey to ask something, and come back | `DetourBanner` |
| Go back to the version of a proposal the client actually saw | `VersionRow` |
| Say an answer was wrong | `ResponseFeedback` |
| Be offered a next step longer than a chip | `FollowUpRow` |
| Enter an amount | `MoneyComposer` |
| Be told a limit was reached, and why | `ConstraintCallout`, `RejectCallout` |
| Read the small print before approving | `DisclosureBlock` |
| Compare two funds honestly | `OverlapView`, `Dumbbell` |
| Read a fund's own page | `InfoCard`, `ChartLine`, `RangePills`, `ChartReadout` |
| Ask what a figure means, anywhere | `InfoDot` |
| See a whole table, sort it, open a row | `DataTable`, `StatTile`, `ConcentrationBar` |
| Take the document away | `DownloadAction` |
| Find a client in a 512-name book | `SearchField`, `ClientChip` |
| See a journey's progress | `ProgressRail`, `DecisionsStrip` |
| Watch Sentinel think without a step list | `SentinelThinking` |

Every row above is a designed contract with a spec page and no screen behind it. **The app is built by
putting each of them on a screen, in the journey where an advisor actually meets it.**

---

## 1 · Surfaces, not seven screens

The archive counted seven screens; three of them were canvases the product removed. Counting *screens*
made the trace and the answer look like two products when they are one thread at two moments — the
question the review agent raised on 19 Sep, answered here.

**The app has five surfaces.** Everything else is a phase of one of them.

| Surface | What it is | Phases |
| --- | --- | --- |
| **Home** | The way in. No conversation yet | typical · book unavailable |
| **Thread** | The spine. Every answer arrives here | waiting · answered · artifact open · stopped · failed · refused · editing |
| **Journey rail** | One question at a time, when a sequence is needed | asking · interjected · detoured · result — **all built 19 Sep** |
| **Drawer** | Everything that is history | typical · loading · one section failed · first run |
| **Confirm sheet** | The only surface with no composer | reviewing · approved |

A page in `screens/` is a **surface**, and its states are sections on it. The journey's seven *steps* stay
numbered on `flow.html` — a step is a moment in Sharma's story, not a screen.

**Why the Thread's "waiting" is still its own page, and the expanded artifact is not:** the artifact open
changes a card's height and nothing else — same controls, same dock, same turn. Waiting changes the
*controls*: the send slot becomes Stop, which is the only moment in the product when the composer cannot
send, and the turn carries Continue and Try again, which no other phase can reach. A different control set
is a different screen to design and to test; a different height is not.

---

## 2 · The control layer — four questions, asked in this order

An advisor in a chat-led tool asks four things, and a chat UI answers none of them by default. This is the
part that has to be designed rather than inherited, and most of it already has components.

### "What can I do here?"
- **Home:** three ready prompts from the advisor's own book (whole sentences, named clients) and three
  starters with no client attached. Built.
- **In a turn:** contextual chips beside the message that offered them, never pinned. Built 18 Sep.
- **Missing:** a standing answer. An advisor who has never used the product has no way to ask *"what else
  can you do?"* — and the six router buckets are invisible. **To design:** a capabilities reply, reached
  from the drawer and from an empty composer, that lists what Sentinel does in the advisor's words. It is
  a thread turn, not a settings page.

### "What happens next?"
- **Built:** `ProgressTrace` names the work while it runs; the CTA names the decision.
- **The archive's own pattern, not yet rebuilt:** *the journey card.* Sentinel says what it is about to
  open and offers the door — *"I'll take Meera through the twelve-question risk profile. Each answer is
  hers — I won't assume any of them."* (`Chat.tsx:434`). **A journey never opens silently under the user.**
- **Built 19 Sep:** the end of a turn. `FollowUpRow` — a follow-up that exceeds one line is a row, not a
  pill — with the first row being the question this journey really asks next. After an answer, the advisor should be offered the two or three things that answer usually
  leads to — drawn from the router's buckets, not invented per screen.

### The two that must be on EVERY surface, not most of them
The owner's rule of 19 Sep, after finding Edit on one screen out of five: **an affordance that is valid
from the advisor's side must be present everywhere it is valid, and absent only where it is not — for a
stated reason.** Two are settled:
- **Edit the last prompt** — `AskTurn`. Present on every finished turn; absent while one is running (Stop
  is the control), on a file (removed, not re-worded), and on Home (no prompt yet).
- **The paperclip** — `useAttachment` + `AttachedTurn`. Real on every screen with a composer, gated by
  `check-previews`, and honest about what it can say over a file it has not read.

### "How do I go back?"
This is the weakest axis in the product today, and the most important one in a tool that moves money.

| Level | What it undoes | Status |
| --- | --- | --- |
| The question | Edit it in place; the answer is replaced only on send | **Built 18 Sep** (`UserBubble editing`, `costNote`) |
| The work | Stop a running trace, keep the partial, Continue | Built |
| The answer | Say it was wrong, with a reason; the answer is not deleted or silently re-run | **Built 19 Sep** |
| The artifact | Revert to the version the client saw; revert APPENDS, never destroys | **Built 19 Sep** |
| The journey | Leave it, ask something else, resume — the banner names the journey AND the question | **Built 19 Sep** (the rail itself is #4) |
| The decision | Undo an approved action | **Open question — see §5** |

### "What if?"
An advisor's real question before approving is *"what does this do to him?"* — not *"are you sure?"*.
- **Built:** the confirm sheet states cost and compliance as rows, above the numbers.
- **To design — the simulation:** a rebalance shown as **before → after** on the same allocation the
  advisor is already looking at, with the cost attached. `Dumbbell` exists for exactly this shape (two
  values on one scale) and `AllocationCard` already draws the current mix. This is the one genuinely new
  piece of product thinking in the plan, and it belongs *before* the confirm sheet, not inside it: a
  decision surface should not be the first place a number appears.

---

## 3 · Information architecture

The router is the IA. `docs/screens-source/src/lib/router.ts` sorts free text into **six buckets**, and
every surface above is downstream of one of them:

1. **journey** — a sequence is needed (risk profile, proposal) → the journey card, then the rail
2. **drift / analysis** — a question about a portfolio → trace, answer, artifact
3. **funds** — a fund question → the fund surfaces (`InfoCard`, `OverlapView`, `DataTable`)
4. **disambiguate** — a name with no intent, or an intent with no client → chips that ask which
5. **scope** — outside what Sentinel does → a plain refusal that says what it *can* do
6. **action** — something that changes money → preview, then the confirm sheet

**The drawer is not navigation; it is history** — saved work, recent threads, the client book. The app has
no tab bar and will not grow one: the thread is the surface, and everything else is reached from it or
from the menu. That is the whole IA, and it is one sentence long on purpose.

---

## 4 · Build order

Each row is one commit, built on the system, every state rendered, and reviewed by
`.claude/agents/sentinel-interface-reviewer.md` before it is shown.

| # | What | Why here | Brings in |
| --- | --- | --- | --- |
| 1 ✅ | **Journey B, steps 5–7** — built 19 Sep as `05-decide.html` | Finished the one flow that was half-built; all four rules in one screen | `MoveCard`, `DrawnCheck`, `ConstraintCallout`, `StandingDisclosure`, and a new `ConfirmSheet` |
| 2 ✅ | **The simulation** — built into step 5 rather than after it, because it changes what the confirm sheet decides about | The missing "what if" | `Dumbbell` × 2 on one scale |
| 3 ✅ | **The going-back layer** — built 19 Sep as `screens/thread/going-back.html` | The weakest axis, and all four components existed unused | `ResponseFeedback`, `VersionRow`, `DetourBanner`, `FollowUpRow` |
| 4 ✅ | **Journey A — Meera's risk profile** — built 19 Sep as `screens/journey-a/risk-profile.html` | The rail, the longest journey, and the one the drawer's first row points at | `ProgressRail`, `MoneyComposer`, `SentinelThinking`, `QAPair`, `HeroNumberCard`, `ParseNote` |
| 5 ✅ | **The fund surfaces** — built 19 Sep as `screens/journey-c/funds.html` | The third router bucket, and the one that found what the product does not know | `InfoCard`, `OverlapView`, `DataTable`, `Badge`, `InfoDot` |
| 6 ✅ | **The refusals and the capabilities reply** — built 19 Sep as `screens/thread/refusals.html` | Buckets 4, 5 and "what can I do?" — the three states that decide whether the product feels honest | `RejectCallout`, `ParseNote`, `SearchField` |
| 7 | **The prototype, end to end** — next | Every journey clickable in one page, with the motion log | — |

`report:parallel` is the finish line: when it reads 86 of 86, the app has exercised the system and the
system has nothing in it nobody uses.

---

## 5 · Open, and the owner's to decide

- **Undo after approval.** Everything above is reversible before the confirm sheet and nothing is after
  it. In a build that drafts rather than sends, "undo" is honest for a draft and a lie for an instruction
  that left the building. My recommendation: the success screen states plainly what has and has not left
  Sentinel, and offers an undo only for what has not.
- **The fund data, which is three decisions and not a design gap.** Journey C is built and honest about
  what it cannot say: there is no confirmed source for fund **performance** (so `InfoCard` renders locked
  and `RangePills` never offers a range over a number nobody owns), none for **TER or AUM**, and no
  **holdings feed** (so an overlap between two funds is an em dash with a footnote, never a 0 — "a zero
  and a missing value are different facts"). The components for all three exist and are correct; supplying
  the sources fills the cards in rather than redesigning them.
- **Sharma's 18 holdings.** Gap G7 — the archive has Meera's 43, not his 18, and a holdings table under
  his name would be a fabricated figure. Needed from the owner, or the chip keeps opening the chart's
  table.
- **The UI kits.** `ui_kits/` still draws the pre-18-Sep product. Leave as the import record, or redraw.

## 5b · What the research opened (19 Sep 2026)

`docs/RESEARCH.md` — 60 linked verbatims from two advisor-facing apps and one investor app. Four things
it evidences that we already do (provenance, the placed/drafted line, never restyle, saying what we
cannot do) and **four it opens**, in order of how much trust they carry:

| # | What | Why it matters | Where it goes |
| --- | --- | --- | --- |
| R1 ✅ | **Completeness, not just provenance** — done 19 Sep: the allocation says "all 18 funds reported" and `book.jsx` carries a `reporting` field. — say what a total is a sum OF, and what has not reported yet | The top theme, sev 4: *"total AUM shown is less"* because one AMC was missing. Our provenance says where a figure came from, never how complete it is | A line on any total drawn from more than one source; `book.jsx` gains a `reporting` field |
| R2 ✅ | **The in-flight state of an instruction** — done 19 Sep: four outcomes on the deciding screen, including the one where Sentinel refuses to guess in either direction. | Between "Approve" and "placed" there is a state we have not designed, and it is the one an advisor meets on a bad day. Second theme, sev 4 | `ConfirmSheet.busy` exists; the thread has no "placing…" turn and no "we do not know yet" |
| R3 ✅ | **A money ledger and an export** — done 19 Sep: `screens/thread/ledger.html`, five instructions, a status that is a WORD, and a rejected row carrying the RTA's own reason. | Third-party advisors ask for it in almost every app. `DownloadAction` and `DataTable` exist and no screen uses them for this. The drawer is history of CONVERSATIONS; this is history of MONEY | A new surface, after the refusals |
| R4 ✅ | **The allocation is one level too coarse** — done 19 Sep: the cap split is in the book and the breached small-cap sleeve is drawn with `ConcentrationBar`. | An MFD's own words: *"it says equity no mention of mid large or small"*. Our own ceilings are written against caps the allocation card never shows | `AllocationCard` on the built drift screens |

## 6 · What research this is built on, honestly

**Updated 19 Sep 2026: there is now real evidence, and it is thin on purpose about what it is.**
`docs/RESEARCH.md` mines 60 public reviews — real, linked, and captured without hand-picking — from
KFinKart Distributor, AssetPlus Partner and Groww. It is not a usability test and it is not an advisor
interview, and it says so. Beyond that: the archive's own router, copy and journeys
(`docs/screens-source/`), the system's 43 KB specification and its `contradictions.md`, the four rules, and
the record of every ruling in `CONTINUE-HERE.md`. Where a pattern comes from outside — a staged parse
checklist, a version trail in the conversation — the component that carries it names its source in its own
header. **Nothing in this plan claims a user finding that was not observed.** If the owner can put real
advisors in front of it, the first thing worth testing is §2's fourth question: whether an advisor trusts a
simulation enough to approve from it.
