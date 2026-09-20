# The Fund Explorer, complete — and the rebalance, made understandable

**20 Sep 2026 · a plan to rule on before it is built.** Follows `FUND-EXPLORER-PLAN.md` (19 Sep),
which built the WHO step, the fund card, the four verbs and Compare. This covers what is left: the
data the explorer still lacks, the journey end to end as a self-operated chat, the holdings view, and a
rebalance journey an advisor can follow without a briefing.

Sources read for it, at 1×: the fifteen Parag Parikh fact-sheet screens in `all-screens/`
(`IMG_4566–4580`), twelve Mobbin holdings screens (Origin, Copilot, Nutmeg, Fidelity, Wise, Monzo, N26,
Shopee, Revolut) and six Mobbin rebalance flows (Acorns, Revolut, Binance, Stake), `docs/RESEARCH.md`,
and every line of `journey-e/rebalance.jsx`. **The Figma file (`Centricity-Global-app-design`, node
130-2550) could not be read from this session** — the in-app browser is not signed in and the Figma MCP
tools are not in this session's roster even after connecting; a new session, or frames exported as PNG
into `all-screens/`, would fix that. Nothing below depends on it; §5 says what it would add.

---

## 1 · The data, and the honest terms it comes on

Everything the explorer still cannot say traces to four missing feeds. All four become fixtures in
`book.jsx` on PERF's terms — `fixture: true` on every row, invented but internally consistent, shown only
through a provenance line the book itself writes — because a screen designed against no data is a
screen designed against a guess.

| fixture | shape | what it unblocks |
|---|---|---|
| **`HOLDINGS[id]`** | `asOf` · `count` · `split { equity, debtCash }` · `caps[]` (large/mid/small % of fund) · `sectors { month: [{name, pct}] }` for three months · `top[]` ten names with % and sector · `concentration { top5CompaniesPct, sectorsCount, largest… }` | "What is it holding?" · size breakup · sector over time · top ten · concentration · **real overlap** (`OverlapView`'s em dashes become numbers, computed from shared top holdings) |
| **`MONTHLY[id]`** | three months of `{ month, aumChangeCr, fundReturn, benchReturn, gainers[3], losers[3] }` | "What changed recently?" — the narration stream, as sentences |
| **`CATEGORY_AVG[category]`** | `r1 · r3 · r5` | "How has it done against its category?" — three marks on one `Dumbbell` |
| **`SWITCH_COST(fromId, toId, amountRs)`** | exit load % and months · gain split by lot age → STCG/LTCG under `TAX` | the rebalance's cost breakdown, one line per component instead of one total |

The names in `HOLDINGS.top` are real listed companies chosen to fit each fund's category (an index fund
holds the Nifty's largest; a corporate-bond fund holds AAA issuers). **The weights are ours.** No number
here is a scheme record, and the provenance line says so on every card that shows one. **The Centricity
Score stays out** — the PRD leads with it and no definition has ever been seen; a score with an invented
method is the one number an advisor must never defend.

---

## 2 · The explorer as a chat, step by step

The standing rule from §6 of the first plan, kept: **a turn answers one question.** Tabs become chips,
each chip adds a turn, scrolling back is the tab history. And a second rule, new: **every chip is also a
sentence.** Whatever a chip does, typing its words does the same thing — that is what "self-operated"
means in a chat, and it is what makes the composer the one control that never fails.

| step | the advisor | Sentinel answers with | built |
|---|---|---|---|
| **0 · entry** | types *"flexi cap under 0.7% on my shelf"* or taps the starter | reads the sentence back as **removable chips** (`Flexi cap ✕ · TER < 0.7% ✕ · On your shelf ✕`), counts the matches, and says the one thing worth saying: *"Four clear it. Two clear it comfortably."* | chips ✓ · **numeric filters new** · the sentence new |
| **1 · shortlist** ✓ | reads the table; says *"sort by cost"*, *"only direct"*, *"drop the shelf"*, *"add Motilal"* | the `DataTable` re-sorts or re-filters **as a new turn** that says what changed; a fund added by name joins the list | table ✓ · refine parser ✓ (add/drop/shelf) · **sort · numeric · add-by-name BUILT 20 Sep** |
| **2 · the fund** | taps a name, or types it | `InfoCard`: ₹10,000 → what it became, the two-line chart, the range row, riskometer · TER · size · exit load · who holds it. Under it two rows of chips: **the four asks** and **the four verbs** | ✓ |
| **3 · vs category** | *"How has it done against its category?"* | three `Dumbbell`s on one scale — category average · this fund · benchmark — for the chosen period, and the sentence: *"Ahead of its category by 2.1 points and its benchmark by 6.3."* | `Dumbbell` ✓ · **needs `CATEGORY_AVG`** |
| **4 · holdings** | *"What is it holding?"* | **the shape first, one turn**: `AllocationCard` by cap (large · mid · small · debt & cash) with its sentence — *"Two-thirds large cap. 31.6% is financials — one sector is a third of the fund."* — then chips for the next questions (§3) | `AllocationCard` ✓ · **needs `HOLDINGS`** |
| **5 · what changed** | *"What changed recently?"* | a `SentinelTurn` of sentences, tone in the words: *"Size rose ₹1,900 cr in May."* · *"May's return was 0.6 points under its benchmark; April's was 1.8 over."* · *"HCL and TCS carried the month; HDFC Bank cost it 10.6%."* · manager change if any | `SentinelTurn` ✓ · **needs `MONTHLY`** |
| **6 · who holds it** | *"Who of my clients hold it?"* | a `List` of the clients, each with **% of their own book** and whether it sits over a ceiling for them | `holdersOf` ✓ · `List` ✓ · the % new |
| **7 · verbs** | Compare · Add to a proposal · Attach to a rebalance · Send for review | as built 20 Sep — Compare is two blocks with one signature; the three hand-offs carry the fund into D, E, F | ✓ |
| **8 · period** | *"show 3Y"*, taps `1Y · 3Y · 5Y` | the card's figure, chart and Dumbbells re-read for that period; the sentence says what changed | pills ✓ · **the command BUILT 20 Sep** |

**Smart insights are one sentence, built from data, after every artifact** — the discipline
`compareVerdict()` already follows. A clause with no fact behind it does not appear; when two facts
conflict (cheapest but off-shelf) both are said. Never a score, never a tick or cross.

**Commands the parser gains** (`refine()` in `funds.jsx`) — **BUILT 20 Sep 2026**, frozen on
`screens/journey-c/funds.html` §7 and live in `screens/prototype.html`: `sort by <cost|size|return>` ·
`under|over <n>%` on TER · `only <direct|regular>` · `add <fund>` · `drop <fund>` · `compare <a> with
<b>` · `show <1Y|3Y|5Y>` · `holdings` · `what changed` · `who holds`. Anything else still lands in
bucket 4 and says so — a search that quietly ignores half of what you typed is worse than one that says
it did not follow.

**What building them settled, and the plan did not say** (F-61):

- **A filter and a view are different acts, and the state has to say so.** A filter changes which funds
  match and becomes a removable chip; a sort or a period changes only the order or the period every
  figure is read at, and touches no chip. Sort and period are held apart from the query for exactly
  that reason: a view that showed up as a filter chip would make the count look negotiable.
- **A sort must be checkable against the screen.** Cost and return sit off the 375 edge behind the
  table's scroll, so the turn carries the span it sorted on — *"Sorted cheapest first — 0.63% to
  0.98%."* And the return key follows whatever period is displayed, rather than a fixed three years.
- **An ambiguous fund name binds nobody.** *"add HDFC"* matches three, so it names all three and asks —
  `namedClient`'s ruling from F-60, applied to the shelf.
- **A fund added by name stays** whatever the filters say. The advisor asked for that fund.

---

## 3 · The holdings view — one question per turn · **BUILT 20 Sep 2026**

The references stack five devices on one Holdings tab: a toggle, a size bar, a sector list with month
pills, a top-ten list, a concentration table. In a 375-wide thread that is five answers, so it is five
turns, and the advisor asks for each one. **Every chip is also a sentence** — `holdAsk()` maps typed
words to the same turns, so typing *"by sector"* opens exactly what the chip opens.

| turn | question | device **as built** | the sentence it earns |
|---|---|---|---|
| **H1 · the shape** | *"What is it holding?"* | **`ChartBar`** — large · mid · small · debt & cash, one hue, direct labels | *"Parag Parikh Flexi Cap is 67% large cap, 20.6% mid cap and 6.2% small cap, with 6.2% in debt and cash. Financial services is the biggest sector at 25.2%."* |
| **H2 · by sector** | *"By sector"* | `ChartBar` + `RangePills` over the three months (count matches the data — F-46) | *"Financial services went 24.6 → 25.2 over three months; Industrials moved most, up 1.5 points."* |
| **H3 · top ten** | *"Top 10 stocks"* | `DataTable`, **folded at ten**, sticky name · weight-behind-figure · Change | *"The top five are 35.6% of the fund. Power Grid alone is 8.4%. Change is against last month."* + the tail as one row: *"71 more holdings, none above 2%."* |
| **H4 · concentration** | *"How concentrated?"* | four `FigureRow`s inside a `Surface`, each with its quiet half | *"81 holdings across 10 sectors. The top five companies are 35.6% of the fund, the top five sectors 85.6%."* |
| **H5 · overlap** | *"Overlap with…"* | `OverlapView` **with a number**, or the `List.search` picker when no second fund was named | *"47% of their top tens are the same 6 stocks — ICICI Bank, Axis Bank, TCS and more."* |

**Three things the plan got wrong and the render corrected.**

1. **H1 is a `ChartBar`, not an `AllocationCard`.** `AllocationCard`'s three hues are *asset classes*
   (equity · debt · cash). Large, mid and small are all equity, and three hues for three sizes of the
   same thing is colour encoding identity — rule 1. `ChartBar`'s own contract is the answer: one
   colour, rank carried by length, every value direct-labelled.
2. **H3 folds, it does not scroll.** `overflow="scroll"` lays the columns out at max-content and the
   **Change** column — the only reason the turn exists — sat off the right edge of the phone. Two
   columns beside the sticky one is inside `DataTable`'s own three-column rule, so folding fits them
   exactly. The Sector column was dropped for the same reason: sector is H2's question.
3. **A debt fund draws no cap bar it has no data for.** `ICICI Corporate Bond` says what it is instead:
   *"holds no equity — 52 debt instruments, 100% of it in debt and cash"*, and the sector chip still
   works, because a bond fund has issuers by sector.

What is refused, and why: **no donut** (needs a legend to be read; a bar says it in a third of the
height) · **no gainers/losers as green-and-red pills** (rule 2 — they are sentences in §2's "what
changed") · **no 103-row list** (the tail is one row, the same rule the review applies to Meera's
twenty-nine tiny funds) · **no claim against a ceiling inside a fund** (the product's 25% caps are
written against a *client's* book, so H4 states the numbers and claims nothing about them).

Every H-turn keeps the fund's four verbs available through the composer — *"compare this with…"* works
from inside the holdings the way it works from the card.

## 4 · The rebalance, made understandable · **BUILT 20 Sep 2026**

**What was wrong.** It opened with a QUESTION — *how far* — and three rule-named targets, each carrying
a headline, a rule, a paragraph of why, a cost or a refusal, and a chip. Measured on the rendered rail:
**three parallel options and ~180 words before a single move was shown.** The rules were right and the
sequence was not. Journey B's version of the same rebalance is understood in one line, because it leads
with the answer.

**Journey E is a thread now, not a rail.** A rail is the surface for a question Sentinel must ask before
it can answer. It *can* answer — so there is nothing to ask, and nothing for a rail to carry.

| turn | what Sentinel says | device |
|---|---|---|
| **R1 · where he is** | *"R. Sharma agreed to 60% equity and is at 71 — 11 points over. The reason is one holding. Quant Small Cap is 31% of his book, over the 25% single-fund ceiling and the 25% small-cap sleeve at the same time — two rules, one fund."* | the **cap** split as a `ChartBar`, one hue, plus the provenance that says how complete the book is |
| **R2 · what I would do** | *"Two moves. Sell ₹1,85,000 of Quant Small Cap and buy ICICI Corporate Bond with it; redirect his ₹30,000 SIP the same way so it does not drift back."* | `MovesBody`, shared with Journey B — two `MoveCard`s and the simulation |
| **R3 · what it costs, line by line** | *"₹11,200 — exit load ₹777, short-term gains tax ₹5,173, long-term gains tax ₹5,250. The SIP redirect: no cost."* | `FigureRow` × 5 from `switchCost`, the total leading |
| **R4 · the dials** | *"Those are the two I would place. If you want it sized by a different rule, say which."* | four chips + **one** dark CTA (`SentinelTurn.cta` can hold one) |
| **R5 · a dial nobody can cost** | unchanged: sized, refused a figure, the nearest real thing offered | and **the Approve withdraws** while it is on screen |
| **R6 · approve** | the same `ConfirmSheet`, disclosure and three rows as Journey B — it is the same money | ✓ |

**Sentinel recommends the one it can cost.** That is not a preference: the other two have no purchase
dates on folio 9142/28, and a product that recommends a move it cannot put a figure on has made the
figure optional. Tapping either still works and still gets the honest refusal.

**The ceiling-mark question, answered by the system rather than by me.** The plan asked for ceiling
marks on `AllocationCard`. Two things came out of building it: the device is a `ChartBar` (three hues
for large/mid/small would be colour encoding identity — all three are equity), and `ChartBar` already
offers `tone='status'` for *"the one bar that crossed a limit"*. **It is used on no screen**, and a
danger-coloured *fill* would be a first in this product where rule 2 reserves that colour for text —
so the bar ranks by length like every other bar and the **sentence** names the fund, the figure and
both ceilings. If you want the toned bar, that is one word and one line.

**Two defects the drive found**, both in the rebalance's own path:
- typing *"rebalance Sharma"* asked **"whose portfolio are we rebalancing?"** — `namedClient` matched on
  the first word of the name, which for *"R. Sharma"* is the initial. It matches every part longer than
  one character now, and **an ambiguous name binds nobody**: Meera Nair and Sunita Nair share a surname,
  so *"review Nair"* falls through to the WHO step rather than silently taking the first.
- the **Approve** CTA stayed on screen above an uncosted refusal. It commits the two costed moves and
  not the dial just asked for, but an advisor reading *"I cannot cost it"* had an Approve in view. It
  withdraws while a dial is open and comes back with *"Take the one I can cost"*.

## 5 · What the Figma file said — read 20 Sep, for content

`Centricity-Global-app-design`, page *fund discovery & Investment* (the only page). Read at 1× from
five frames: the fund screener (375×2868), fund discovery (375×3005), Portfolio (375×2287), the filter
sheet and a six-card fund list. **No rebalance flow exists in it**, so §4 has nothing to check against
and stands on its own research.

**Field names both Centricity apps should share** — used here as the labels for H3/H4 and the card:
`Exp. ratio` · `Risk` · `3Y return` · `Fund return (%)` · `Category avg. (%)` · `Rank` · `Expense · AUM ·
Min SIP` · `Top 5 holdings allocation` · `Distribution Analysis — By assets / By sectors / By category` ·
`Fund manager` · `Expense & exit load` · `About this fund` · `SEBI Riskometer` · `Returns & ranking`.

**Content it carries that this plan did not have, and what each becomes here:**

| in the other app | here |
|---|---|
| **"+2.3% vs category"** on every fund card, with an arrow | the `compare`-style line on `InfoCard` and the H-turn sentence — the same fact, said in words; **no arrow, no green** (rule 2). `CATEGORY_AVG` already carries it |
| **Category 3Y range bar** — *14.2% ······●······ 26.4%, Flexi Cap 3Y range* | a strong device: the fund inside its category's spread. `CATEGORY_AVG` gains `range { lo, hi }` per period and the *vs category* turn draws it as a `Dumbbell` from lo to hi with the fund as the mark — one scale, direct-labelled |
| **Returns & ranking** table — Fund · Category avg · **Rank** across 1Y/3Y/5Y/All | category average is in; **rank is not** — a rank needs the whole peer set and this book holds two funds per category. Said plainly on the turn rather than invented |
| **3Y quant statistics** — Sharpe, Sortino, alpha, beta, standard deviation, tracking error, info ratio | not in the book. Legitimate factsheet content; a `QUANT[id]` fixture is possible on PERF's terms but is *not* in this build — an advisor reads these to a client rarely and a wrong one is unrecoverable |
| **Portfolio → Insights: "3 funds overlap 40% — your top funds hold the same stocks"** | the reverse lookup this plan already has the data for: `overlapPct` across a **client's** funds. Belongs to the review (Journey F), as a sentence: *"14 of Meera's 43 funds share 60%+ of their top ten."* Added to the review's backlog, not built here |
| **Idle cash** insight · **Goals planning** (on track / behind target · *Increase SIP by ₹8,400/mo*) | not the explorer's. Noted for the review and the proposal |
| **"Choose your exposure"** — Equity 612 · Debt 448 · Hybrid 216 · Index/Passive 463 funds | the shelf's shape, as the refusal's *"remove that pill to search all 1,412 schemes"* already implies. A count per bucket on the shortlist's sentence |
| **Smart collections** (*Long-term Wealth Builders · 3 funds*) | a saved shortlist with a name — Journey C's *Save this comparison* chip is the same idea; not built here |

## 6 · Build order, and what needs a yes

1. **Fixtures** (§1) — data only, no screen changes. *Can start now.*
2. **Holdings turns H1–H5** — every device exists; one new `refine()` grammar. *Can start now.*
3. **What changed · vs category · who holds** — three turns, one new % computation.
4. **Explorer commands** — sort, numeric filter, add-by-name, period. Parser work in `funds.jsx`.
5. **Rebalance R1–R6** — needs the one yes above (ceiling marks on the allocation bar). Otherwise every
   device exists and the change is sequence and copy.
6. **Figma read** — new session or PNG export; adjusts labels, not structure.

**Three decisions, then it is all buildable:**
- **Ceiling marks on `AllocationCard`** (§4, R1) — a new mark on an existing device. Yes / no.
- **The rebalance sequence** (§4) — answer first, rules as dials. This replaces the *how far* gate; the
  built states on `rebalance.html` are re-shot against the new order.
- **Fixture scope** (§1) — ten funds × three months of sector and monthly data, generated
  deterministically the way `NAV_SERIES` is, with real company names and invented weights. Yes / no.
