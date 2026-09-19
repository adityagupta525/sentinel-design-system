# The product's DNA — data, fields, terminology and copy

**Written 19 Sep 2026.** `APP-PLAN.md` is what to build. `readme.md` is how it looks and behaves.
**This is what it is made of**: the fields a screen may render, the words the product uses for them, and
the rules the copy follows. Extracted from what is actually in the repository — the components' own
contracts, the built screens and `screens/data/book.jsx` — not proposed.

If a screen needs a field that is not here, it stops and asks, the same way it stops before inventing a
component. That is the whole point of writing it down.

---

## 1 · Where the data lives

**One file: `screens/data/book.jsx`.** Every client, fund, holding, limit and rate. Before it, the same
client held 43 funds on one screen and 31 on another; every figure already rendered on a built screen is
now in it or derivable from it, and the derivations are written in the file beside the number.

Three states a field can be in, and the product distinguishes them everywhere:

| State | What it means | How it renders |
| --- | --- | --- |
| **Known** | We hold it, and can say where it came from | The figure, with provenance under it |
| **Unknown** | No confirmed source exists | The component's `locked` state, with the reason in words — never a blank, never a plausible number |
| **Not applicable** | The field cannot apply to this row | An em dash, and a footnote if the reason is not obvious — **never a zero**, because "a zero and a missing value are different facts" (`OverlapView.d.ts`) |

Unknown today, deliberately: **fund performance, TER, AUM, and any two funds' holdings overlap.** Four
components already render that honestly and none of them is a design gap — they are data decisions.

---

## 2 · The fields

### The advisor
`name` · `firm` · **`arn`** the distributor's registration, under which every execution runs ·
**`euin`** the individual who advised it · `clients` the book's real size (512) · `asOf`.

ARN and EUIN are not decoration: the confirm sheet says *"these two switches run under your ARN"*, and
that sentence is the product naming whose authority is being used.

### A client
| Field | Notes |
| --- | --- |
| `name` `age` `city` `since` | `since` is the relationship year — "your client since 2019" |
| `pan` | **Masked** — `ABCPN••••K`. A full PAN is never rendered on a screen |
| `kyc` | `status` Valid · In process · Re-KYC due; `mode` **CKYC** or **KRA**; `updated`. Nothing executes for a client whose KYC is not valid, and the screen says so rather than failing later |
| `nominee` | `name` `relation` `share`. `null` is a real state and worth surfacing |
| `income` | `monthly` · `source` (Fixed salary · Salary plus bonus · Own business · Freelance, varies · Rent or pension — the risk rail's own five) · **`evidence`** ("ITR, AY 2025-26", "Form 16") |
| `spendMonthly` `emergencyFund` | The pair the first interjection does arithmetic on |
| `goal` | `label` `amountRs` `byYear` |
| `risk` | `score` 0–100 · `band` · **`lockedOn`** · `rows[]` the three scores, one marked `binding`. `null` is a state: "not profiled" |
| `mandate` | The agreed `equity` / `debt` / `cash` split. This is what drift is measured against |
| `portfolio` | `valueRs` `funds` `asOf` |
| `allocation` | Today's split, from the latest statement. `allocationPrior` carries the previous quarter, which is what makes a drift statable |
| `holdings[]` | `fundId` `pct` `valueRs` **`folio`** `over` (which limit it breaches, if any) |
| `sips[]` | `fundId` `amountRs` **`day`** of the month · **`mandate: 'NACH'`** |
| `flags[]` | What an advisor would want to see first about this client |

### A fund
`name` · `amc` · **`category`** — SEBI's, never a marketing name · `bucket` Equity / Debt / Hybrid /
Index · **`plan`** direct or regular · **`riskometer`** the six-band scale · **`exitLoad`** as a sentence
("1% within 365 days", "Nil") · `onShelf` + `shelfNote`.

### The rules a book is checked against
`LIMITS.singleFund` 25% · `LIMITS.smallCapSleeve` 25% · `LIMITS.driftBand` 5 points.
**The two 25s are different rules** (contradiction 32) and a screen must say which one it means.

### Tax
`STCG 20%` under twelve months · `LTCG 12.5%` on aggregate equity gains above **₹1,25,000** a financial
year · no indexation. Checked against the market on 19 Sep 2026, not remembered. **A switch is a
redemption plus a purchase**, so it is taxable by definition — which is why any "no tax" claim in a move
card has to be supported by the purchase dates on the folio, and is marked as a placeholder until it is.

---

## 3 · The terminology

The standard term, and what this product says. Where they differ, the reason is that an advisor has to
read the sentence aloud to a client who may not know the standard term.

| Standard | Sentinel says | Why |
| --- | --- | --- |
| Asset allocation drift | **"what moved the mix"** | "Drift attribution" is jargon; "the mix" is what an advisor already calls it |
| Investment policy statement / IPS | **"his mandate"**, "what you agreed" | The agreement, in the advisor's words |
| Rebalancing | **"rebalance"**, and in the sentence "bring him back to his mandate" | The term is standard among advisors; the explanation is not assumed |
| Switch | **"move ₹X out of A into B"** | A switch is two transactions and one sentence |
| SIP | **SIP** | Universal in India. The redirect is "redirect his ₹30,000 monthly SIP" |
| Exit load | **exit load**, always with its window: "1% within 365 days" | A load with no window is not a fact an advisor can act on |
| STCG / LTCG | **"short-term tax"**, with the rate when it matters | The acronym is fine on a compliance row, not in a sentence |
| NAV, units, folio | **folio** on a holding; NAV and units are not rendered today | Nothing on a built screen needs them yet |
| Riskometer | **riskometer band** as a word — "Very high" | Never a dial: the word carries it |
| Concentration limit | **"single-fund ceiling"**, "no fund over 25%" | Names the limit and the number together |
| Risk profiling score | **"her risk number"**, with the band — "54, Moderate" | A number with no band is not readable to a client |
| Capacity / tolerance / requirement | **"what her finances can absorb" · "what she can sit through calmly" · "what her ₹2 crore goal needs"** | The three scores, each as the question it answers |
| KYC | **KYC**, with its status as a word: Valid · In process · Re-KYC due | Standard, and the status is what matters |
| CKYC / KRA | the **mode**, shown only where it changes what the advisor must do | |
| ARN / EUIN | **"under your ARN"** | Said once, on the surface where it is used |
| NACH mandate | **"mandate"** on the SIP row | The bank mandate, distinct from the investment mandate — and this collision is why the SIP row says "NACH" |
| T+2 settlement | **"settles T+2"** | Standard, short, and advisors use it |

### Money and dates — rule 4, restated with the field names
- **Indian grouping, always.** `₹1,85,000` · `₹30,000` · `₹1,25,000`. Never `₹185,000`.
- **Lakh and crore for round magnitudes**, in the advisor's own shorthand: `₹25 L` · `₹18.4 L` ·
  `₹4.2 Cr`. One decimal at most.
- **Day-first dates, short month**: `30 Sep`, `15 Sep 2026`, `19 Sep, 3:04 pm`.
- **Tabular figures on anything that changes**, so a column does not jitter.
- **Percentages to one decimal** when they are computed (`+6.1`), whole when they are stated (`71%`).
- **Provenance under every figure an advisor may have to defend** — "As of 30 Sep · from his Q3
  statement and the mandate on file".

---

## 4 · The copy

Six rules, and every one of them is already enforced somewhere in the repository.

1. **Sentence case. No emoji. No exclamation marks.** (`readme.md`; `ResponseFeedback` draws its own
   thumbs at the icon grid rather than using emoji.)
2. **Plain English an advisor can read aloud**, because they will. Short sentences, the number before
   the explanation, no jargon where a plain word exists. The rewrite on 18 Sep is the worked example:
   *"Attributing the drift"* became *"Working out what moved"*, *"against a 60% target"* became
   *"He agreed to 60%"*, and **no figure changed**.
3. **Say what happened, then what it means, then what it costs.** "Most of it is the small-cap rally —
   about two of every three points. You did not cause it, and selling now has a cost."
4. **Failure disclosure over invention.** Name what went wrong, say what survived, and say plainly what
   was not guessed: *"I have not guessed the rest."* A stopped turn and a dropped connection get
   different words, because one the advisor chose and one happened to them.
5. **A limit is stated when it is reached, never enforced by a disabled control with no explanation.**
   (`OverlapView`, `SegmentedRow`, `ConstraintCallout`.)
6. **A control says exactly what happens.** "Approve both moves", then "Both moves placed". Never
   "Submit", never "OK". A dismiss is a word beside the commit, not only a scrim.

### The sentences the product owns
Short, load-bearing, and not to be re-worded casually:
- `Sentinel assists an advisor · not investment advice` — the standing disclosure, on every screen.
  **[PLACEHOLDER — compliance to supply]**; the replacement must also fit one line.
- `Nothing leaves Sentinel until you pick a channel and send it there.` — on anything drafted.
- `These two switches run under your ARN.` — the confirm sheet's first line.
- `I have not guessed the rest.` — any failure that produced partial work.

---

## 5 · The visual DNA, in one place

The numbers themselves are generated from the tokens and live in
`.claude/skills/sentinel-craft/references/scale.md`, which cannot drift because it is built from
`tokens/*.css`. What that file does not say, and this does:

- **One canvas, one hue.** Warm cream ground, a single bronze that carries magnitude and accent, warm
  ink in three steps. **Colour is never identity** — rule 1. A second hue is not available to signal a
  category, which is why every chart direct-labels.
- **Bad news is text, not a fill** — rule 2. `--color-danger` colours a word ("Required"), never a block.
- **One easing** `cubic-bezier(0.2, 0.8, 0.2, 1)`, durations 150–600 ms, press at 0.98 (icons 0.94).
  **No blur anywhere. No images. No illustration.** Eleven drawn glyphs and nothing else.
- **Type: Urbanist for UI in four weights, Darker Grotesque for display.** 11–18 px UI; the display face
  carries numerals and the greeting.
- **Surfaces**: cream canvas → white card → chip → peach bubble. The peach bubble is the advisor's own
  voice and the place bad news sits.
- **A screen is 375 × 812**, gutter 16, thread stack 12, and the composer is on every screen but one.

### What an advisor's eye is meant to do, in order
The figure first, then what moved it, then what it costs, then the control that acts. Every built screen
is laid out in that order, and the one deliberate exception — the confirm sheet — puts the **disclosure**
before the figure, because small print under a number is small print read after the decision.

---

## 6 · What was checked against the market, and what was not

Checked on 19 Sep 2026 and correct as written above: SEBI's scheme categorisation and the large / mid /
small definitions (1st–100th, 101st–250th, 251st onward by full market capitalisation, circular
SEBI/HO/IMD/DF3/CIR/P/2017/114; flexi cap added November 2020; one scheme per category per AMC), and
equity taxation (STCG 20%, LTCG 12.5% above ₹1.25 L aggregate, no indexation).

**Not checked, because it is not ours to assert:** any specific fund's performance, TER, AUM or
portfolio. Those are the locked decisions, and the product renders them locked rather than plausible.
