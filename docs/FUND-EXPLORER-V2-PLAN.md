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
| **1 · shortlist** | reads the table; says *"sort by cost"*, *"only direct"*, *"drop the shelf"*, *"add Motilal"* | the `DataTable` re-sorts or re-filters **as a new turn** that says what changed; a fund added by name joins the list | table ✓ · refine parser ✓ (add/drop/shelf) · **sort · numeric · add-by-name new** |
| **2 · the fund** | taps a name, or types it | `InfoCard`: ₹10,000 → what it became, the two-line chart, the range row, riskometer · TER · size · exit load · who holds it. Under it two rows of chips: **the four asks** and **the four verbs** | ✓ |
| **3 · vs category** | *"How has it done against its category?"* | three `Dumbbell`s on one scale — category average · this fund · benchmark — for the chosen period, and the sentence: *"Ahead of its category by 2.1 points and its benchmark by 6.3."* | `Dumbbell` ✓ · **needs `CATEGORY_AVG`** |
| **4 · holdings** | *"What is it holding?"* | **the shape first, one turn**: `AllocationCard` by cap (large · mid · small · debt & cash) with its sentence — *"Two-thirds large cap. 31.6% is financials — one sector is a third of the fund."* — then chips for the next questions (§3) | `AllocationCard` ✓ · **needs `HOLDINGS`** |
| **5 · what changed** | *"What changed recently?"* | a `SentinelTurn` of sentences, tone in the words: *"Size rose ₹1,900 cr in May."* · *"May's return was 0.6 points under its benchmark; April's was 1.8 over."* · *"HCL and TCS carried the month; HDFC Bank cost it 10.6%."* · manager change if any | `SentinelTurn` ✓ · **needs `MONTHLY`** |
| **6 · who holds it** | *"Who of my clients hold it?"* | a `List` of the clients, each with **% of their own book** and whether it sits over a ceiling for them | `holdersOf` ✓ · `List` ✓ · the % new |
| **7 · verbs** | Compare · Add to a proposal · Attach to a rebalance · Send for review | as built 20 Sep — Compare is two blocks with one signature; the three hand-offs carry the fund into D, E, F | ✓ |
| **8 · period** | *"show 3Y"*, taps `1Y · 3Y · 5Y` | the card's figure, chart and Dumbbells re-read for that period; the sentence says what changed | pills ✓ · **the command new** |

**Smart insights are one sentence, built from data, after every artifact** — the discipline
`compareVerdict()` already follows. A clause with no fact behind it does not appear; when two facts
conflict (cheapest but off-shelf) both are said. Never a score, never a tick or cross.

**Commands the parser gains** (`refine()` in `funds.jsx`): `sort by <cost|size|return>` · `under|over
<n>%` on TER · `only <direct|regular>` · `add <fund>` · `drop <fund>` · `compare <a> with <b>` · `show
<1Y|3Y|5Y>` · `holdings` · `what changed` · `who holds`. Anything else still lands in bucket 4 and says
so — a search that quietly ignores half of what you typed is worse than one that says it did not follow.

---

## 3 · The holdings view — one question per turn

The references stack five devices on one Holdings tab: a toggle, a size bar, a sector list with month
pills, a top-ten list, a concentration table. In a 375-wide thread that is five answers, so it is five
turns, and the advisor asks for each one:

| turn | question | device | the sentence it earns |
|---|---|---|---|
| **H1 · the shape** | *"What is it holding?"* | `AllocationCard` — large · mid · small · debt & cash, one hue, direct labels | where the weight sits, and the one sector that dominates |
| **H2 · by sector** | *"By sector"* | `ChartBar` horizontal, six bars, with `RangePills` for the three months (count matches the data — F-46) | *"Financials went 29.8 → 31.6 over three months; tech fell."* |
| **H3 · top ten** | *"Top 10 stocks"* | `DataTable` — name · sector · % · **change since last month** | *"The top five are 30.9% of the fund. HDFC Bank alone is 8.3%."* |
| **H4 · concentration** | *"How concentrated?"* | four `FigureRow`s — holdings · top-5 companies · sectors · top-5 sectors | said against the product's own ceilings where one applies |
| **H5 · overlap** | *"Overlap with HDFC Flexi"* | `OverlapView` **with numbers**, computed from shared top holdings | *"38% of their top tens are the same eleven stocks."* |

What is refused, and why: **no donut** (needs a legend to be read; a bar says it in a third of the
height) · **no gainers/losers as green-and-red pills** (rule 2 — they are sentences in H5's "what
changed") · **no "103 holdings" list** (the tail is one row: *"93 more, none above 1%"*, the same rule
the review applies to Meera's 29 tiny funds).

Every H-turn keeps the fund's four verbs available through the composer — *"compare this with…"* works
from inside the holdings the way it works from the card.

---

## 4 · The rebalance, made understandable

**What is wrong with the one that exists.** It opens with a question — *how far?* — and three
rule-named targets (*To the mandate · Inside the band · Clear the fund ceiling*), each carrying a
headline pair, a rule, a paragraph of why, a cost or a refusal, and a chip. Measured on the rendered
rail: **three parallel options, ~180 words, before a single move is shown.** The rules are correct;
the sequence asks the advisor to understand the theory before seeing the answer. Journey B's version of
the same rebalance — *"Two moves, not seven. Together they bring equity from 71% back to 58%, and they
cost ₹11,200."* — is understood in one line, because it leads with the answer.

What the research says an advisor actually wants (`RESEARCH.md` §5, an MFD's own words): *the shape of
the portfolio, not one word for it* — the cap split, and change in **points**. And what mining cannot
tell us and a study should: *whether they would approve a rebalance from a simulation they did not
compute themselves.* The redesign is built around that doubt: **every number shows its working.**

### The new sequence — diagnose, propose, then offer the dials

| turn | what Sentinel says | device |
|---|---|---|
| **R1 · where he is** | *"Sharma agreed to 60% equity and is at 71 — 11 points over. The reason is one fund: Quant Small Cap is 31% of his book, over the 25% fund ceiling and the 25% small-cap sleeve at once."* | `AllocationCard` **by cap**, with the two ceilings drawn as marks on the bar. Provenance under it |
| **R2 · what I would do** | *"Two moves. Sell ₹1,85,000 of Quant Small Cap and buy ICICI Corporate Bond with it; redirect his ₹30,000 SIP the same way so it does not drift back. He lands at 58% equity."* | two `MoveCard`s · a `Dumbbell` **71 → 58 against 60** · the after-state `AllocationCard` beside the before |
| **R3 · what it costs him, line by line** | *"₹11,200 — exit load ₹777 on the 42% bought inside the year, short-term tax ₹5,173 on those gains, long-term tax ₹5,250 on the rest. No tax on the SIP redirect; nothing is sold."* | `FigureRow` × 4 with a `sub` naming each rule, from `SWITCH_COST` and `TAX` |
| **R4 · the dials** | chips, in the turn: **Go all the way to his mandate** (60) · **Just inside the band** (65) · **Move into a different fund** · **Why these two funds?** · **Approve** | the three rules are now *alternatives to a recommendation*, each re-running R2–R3 as a new turn, rather than a gate before it |
| **R5 · the uncosted case** | unchanged in substance: *"I can size this and I cannot cost it — folio 9142/28 has no purchase dates."* — and **no confirm sheet opens** | as built; a dial that lands here says so in its own turn |
| **R6 · approve** | the same `ConfirmSheet` and the same three rows as Journey B, because it is the same money | ✓ |

**Why this is not a restyle.** Every device is one that exists. What changes is the *order* and the
*words*: answer first, rules second, cost with its working. The three targets survive as R4's chips and
`REBALANCE_TARGETS` is still the arithmetic behind them.

**What the carried fund does here.** "Attach to a rebalance" with HDFC Flexi Cap carried in makes it
the *destination* in R2 — *"buy HDFC Flexi Cap with it"* — and R3 costs that switch. Off-shelf is
refused in R2's first sentence, as built.

**The question for the owner in this section:** R1 draws the two ceilings as marks on the allocation
bar. That is a new use of an existing device (`AllocationCard` has never carried a target mark), so it
is a visual decision — yes or no.

---

## 5 · What the Figma file would add, when it can be read

The owner's note: *"sab kuch hai but ye chat-led design nahi hai — info hai, content hai."* So it is
read for **content**, never for shape: the exact field list a fund page carries in the other app, the
words it uses for them (so both Centricity products call a thing by one name), and any figure this plan
guessed at — minimum SIP, lock-in, exit-load wording, the riskometer's six bands. Three places it would
change this plan: the row labels in H3/H4, the fields on the `InfoCard` stat grid, and whether the other
app has a rebalance flow at all (if it does, R1–R6 are checked against it).

---

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
