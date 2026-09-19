# The audit parameter list — written BEFORE anything was checked

**19 Sep 2026 · Veda, Design Director · Sentinel, Centricity WealthTech**

Ashish asked for the list first, then the check. That order matters: a list written after looking is a
list of what we happened to find. This one is written from the system's own laws, its research, and the
44 findings already on file — so what we *miss* is visible too.

**The known failure mode, written at the top.** Sentinel has a settled scale of its own: 11.5px type,
42px rows, 14px card padding. A generic 4/8pt audit flags all three, and all three are the product.
**No parameter below is a number borrowed from outside this system.** Every one is either (a) one of
Sentinel's four rules, (b) a value in `tokens/*.css`, or (c) a question about whether a thing is true.

---

## A · The four rules — a break here is a blocker whatever else is right

| # | Parameter | Why it exists | How it is checked |
|---|---|---|---|
| A1 | Colour never encodes identity | An advisor must never read meaning out of a hue alone — they may be colour-blind, and the screen may be read aloud | Every status has a WORD; every chart mark has a label |
| A2 | Bad news on the peach bubble — text, never fill | A red fill makes a caution look like a failure, and this product says "over the ceiling" far more often than "broken" | Danger tone appears as ink, never as a surface |
| A3 | A composer on every screen | The thread is the surface; a screen you cannot speak to is a dead end | One exception, stated: the confirm sheet |
| A4 | Indian grouping + provenance on every defensible figure | ₹14,23,000 not ₹1,423,000; and a number the client can ask about that the advisor cannot source is worse than no number | Every figure has a line saying where it came from and how complete it is |

## B · Consistency — the same thing behaves the same way everywhere

| # | Parameter | Why | Check |
|---|---|---|---|
| B1 | The last prompt is editable wherever editing it is a real act | Ashish's standing rule. A journey you cannot correct is a journey you must restart | `AskTurn` on every thread surface |
| B2 | The paperclip is REAL on every screen, never a demo | A control that drops the file is a drawing of a control | `DEAD PAPERCLIP` gate, already in CI |
| B3 | One signature per turn | "✦ Sentinel" twice in one reply reads as two replies | `SentinelBlock continued` after the first block |
| B4 | One door per thing | Two controls opening the same sheet is a defect; the advisor learns the product is arbitrary | No duplicate action on one screen |
| B5 | Nothing pinned above the composer | A pinned chip outlives its turn, so scrolling back cannot tell you which answer it belonged to | `BOTTOM-FLUSH`'s sibling gate: no `Dock.chips` / `Dock.cta` under `screens/` |
| B6 | One copy of a renderer, not two | Two copies of a table are two places for the numbers to drift | Shared modules, not per-page copies |
| B7 | A prop that does nothing does not exist | A prop that lies is worse than a missing feature | Lint: unused parameters |

## C · Spacing and craft — measured, against this system's own scale

| # | Parameter | Why | Check |
|---|---|---|---|
| C1 | A card is padded on four sides | Ashish, 19 Sep. Sides padded and bottom open reads as unfinished | `BOTTOM-FLUSH` gate: no ink within 8px of a card's bottom |
| C2 | A 44pt target is not spacing | The target is for the finger; the ink is for the eye. Confusing them puts holes in a turn | Overhang written as arithmetic, not as two numbers |
| C3 | Gutter ≥ 16 on every phone | The screen edge | `GUTTER` gate, already in CI |
| C4 | No text clipped or truncated unless declared | A label that lost a third of itself passed every check until a human measured it | `TRUNCATED` gate + `TIGHT` warning at <8px slack |
| C5 | Every value on the system's scale | 11.5/42/14 are the product; a 13 or a 15 is drift | `literals` per component in `_index.json` |
| C6 | One easing, the real durations, reduced-motion in all three places | Motion character is settled | Motion table per spec page |

## D · Operability — can a person actually use it

| # | Parameter | Why | Check |
|---|---|---|---|
| D1 | Every control has an accessible name | Three times this system shipped a button nobody could see or name (F-28, F-39, F-42) | Live DOM: zero unnamed enabled buttons |
| D2 | No control inside a control | Shipped once (`DownloadAction` inside `ArtifactCard`) | Nested `<button>` scan |
| D3 | Targets ≥ 44pt | Finger, not cursor | Measured, not declared |
| D4 | Focus visible, keyboard path complete | The sheet traps, the drawer returns focus | Per-surface keyboard walk |

## E · Truth — the parameter this product is actually built on

| # | Parameter | Why | Check |
|---|---|---|---|
| E1 | A figure that is not available is STATED, never zero and never plausible | The research's top theme: a total silently short because one AMC had not reported | `locked` states carry the reason and what would fix it |
| E2 | Invented data says it is invented | `book.jsx`'s `PERF` returns are made up; a screen may use them and may not claim a scheme record | `perfProvenance()` is the only line that data may carry |
| E3 | A period is named in words | "27.6%" read as last year's return is a lie a layout told | CAGR spelled out under every multi-year figure |
| E4 | Sent ≠ placed ≠ settled | Journey D sends a document and places nothing; Journey B moves real money | Each success line says which |
| E5 | Nothing is guessed at | Bucket 4 is the default; no journey starts on a misread | Router order, and the uncosted path in Journey E |

## F · Five states, on the CURRENT design — not on the wireframe it used to be

| # | Parameter | Why | Check |
|---|---|---|---|
| F1 | ideal · empty · loading · partial · error · offline | Law 10. A screen audited only in its ideal state is not finished | Per journey, per surface |
| F2 | The in-flight state exists | R2: between "Approve" and "placed" is where an advisor meets a bad day | Journey B and E |
| F3 | Empty says what to do, not "no data" | An empty table on day one is the first impression | Every `emptyState` |

## G · UX lens — the questions a checklist cannot ask

| # | Parameter | Why |
|---|---|---|
| G1 | **Why does this exist?** Every component and every screen names the job it does | A system grows by accretion unless something asks |
| G2 | **Where does the advisor repeat themselves?** Across six journeys, what is asked twice | Repetition is the tax the user pays for our structure |
| G3 | **What does the advisor do next, and can they get back?** | Ashish's own ask: intelligent controls |
| G4 | **Where would behavioural psychology fit — and where would it be manipulation?** | Peak-end, defaults, loss aversion, commitment. In a product that moves a client's money, a nudge is a fiduciary act |
| G5 | **Persona coverage** — which personas and which cases are on a screen, and which are not | Advisors are not one person |

## H · Compliance and domain — this is regulated

| # | Parameter | Why |
|---|---|---|
| H1 | The standing disclosure is present and legible, not buried | "Sentinel assists an advisor · not investment advice" |
| H2 | Past-performance caveat wherever a return appears | SEBI presentation rule |
| H3 | Nothing executes without a confirm that states what will be sent | Suggest → Confirm → Execute |
| H4 | KYC / nominee / mandate constraints are stated where they block | Journey D's whole ending |
| H5 | Terminology is the market's, not ours | An advisor reads these words to a client |

---

**How this list gets used.** Every finding below is tagged with the parameter it fails. A finding with
no parameter is either a new parameter (say so, add it) or a preference (say that too, and drop it).
