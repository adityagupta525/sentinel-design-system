# Fund Explorer — what exists today, measured

**22 Sep 2026.** Before three variations are argued, this is what the stakeholder actually saw, and
why it read as thin. Every number below was read off the repository or a render, not recalled.

## What the stakeholder said

> "Fund explorer par mazza nahi aaya. Recommendation nahi aa raha. Organized journey nahi hai jo user
> khud navigate kar paaye. 2-3 fund dikha deta hai, bas."

Three complaints: **no recommendation · no navigable journey · a handful of funds.** Each one is
measurable against the build.

## What Journey C is — `screens/journey-c/funds.html` + `funds.jsx`, 1,075 lines

Rendered: `refs/current-journey-c.png` — six states, 42 phone frames on the page.

| State | What the phone shows |
| --- | --- |
| Live · drop a filter, open a fund | a chat turn: parsed query as three removable chips + "On your shelf ✓", "2 funds match", one CTA |
| The query, before the results | the same chips, no table yet |
| The table | `FUND SEARCH · YOUR SHELF · 5 funds match` — a `DataTable`: Fund · Score · Category |
| A fund, opened in its row | 21.4% 3Y CAGR (illustrative), riskometer, expense, fund size, exit load, held-by-your-clients |
| Nothing matches | "0 funds match — nothing matches every filter. Drop one and I will widen the search." |
| The overlap, unavailable | "How much these are the same fund" — an em dash and a footnote, because there is no holdings feed |

**Entry is chat only.** There is no explorer *screen*: a sentence is parsed into chips, the shortlist
arrives as an artifact in the thread. The 19 Sep ruling made this deliberate ("there is no explorer
screen, because there is no canvas"). The refinement parser understands nine verbs — `add`, `drop`,
`only`, `shelf on/off`, `under X% TER`, `sort by`, `show 3Y`, `add <fund>`, `compare A with B` — and
anything else lands in a sentence saying the three things it can do.

**What it does that no retail app does:** the reverse lookup — *which of the advisor's own clients
already hold each fund* — and the shelf filter as a first-class chip. Both come from the advisor's
book, not from fund data. That is the product's real edge and the table buries it in column three.

## What the product knows about a fund — `screens/data/book.jsx`

```
const FUNDS = [ … ]   // 10 rows
id · name · amc · category · bucket · plan · riskometer · exitLoad · onShelf (+ shelfNote)
```

**Ten funds. Nine fields. All mutual funds.** Buckets: Equity 6 · Debt 3 · Hybrid 1 · Index 1.

Deliberately unknown, and the screens say so in words (`docs/DNA.md:27`): **fund performance, TER,
AUM, and any two funds' holdings overlap.** There is no NAV, no returns series, no holdings, no
manager, no rating, no min SIP, no inception date, no benchmark.

So the honest filter vocabulary today is **category · bucket · shelf · riskometer · exit load** —
five facets, of which an advisor screens on two. Every retail explorer in `refs/board-retail.png`
offers 8–15. **The explorer is not thin because the chat is thin; it is thin because there is nothing
to filter on.** Any variation that does not name the data it needs is drawing over this hole.

**Multi-asset: zero rows.** Not one bond, PMS, AIF, GIFT City or unlisted product exists in the book.
The owner's brief — "hum unlisted bhi karte hain, AIF bhi, PMS bhi, GIFT bhi, bonds bhi" — describes a
shelf the data layer has never seen.

## The scores

`FUND_SCORE_WEIGHTS` in `book.jsx:611` — the **Centricity Fund Score** is a design placeholder and the
card says PLACEHOLDER twice. The owner settled its **basis** on 20 Sep (fund performance and client
holding); the weights are invented; the score is **withheld** when too few inputs are on file, which
is the best thing about it. The **Client Health Score** is the same shape. Neither is a
recommendation, and an MFD's cannot be — see Anaya's brief for where that line is.

## Compare and overlap

`OverlapView`, `CompareTable`, `Dumbbell`, `ComparePicker`, `FundCompare` exist as components and are
on the spec pages. In the journey, overlap is an em dash — "no holdings feed" — and compare is a
verdict sentence plus a two-column table of the five known fields. The components are ahead of the
data.

## What the existing research covers

`studio/research/verbatims.csv` — 60 advisor verbatims, coded and ranked. **Six touch fund
discovery**, and only one is about it ("no separate category for International funds — difficult to
find", Groww, 1★). The research this product rests on is about *trust in figures*, *completeness*,
*what left under my ARN* — not about finding a fund. That gap is why Ira is mining again.

## The reference the owner sent

`refs/one-digital-explore.webp` — Centricity's own investor app, One Digital. Its IA, read off the
image:

- **Explore tab**: `All Products · Mutual Funds · Bonds · GIFT City` segments → "Build your wealth" →
  **"Choose your exposure"** (Equity 612 funds · Debt 448 · Hybrid 216 · Index/Passive 463) → Large /
  Flexi / Index / Tax chips → Build a SIP → New Fund Offer → Smart collections → **All Mutual Funds,
  1,739, sorted by recommended**, each row: logo · name · Direct·Growth · exp ratio · risk · 3Y return.
- **Fund page**: name + category chips → NAV chart with 1M–ALL ranges + 3Y CAGR → expense · AUM · min
  SIP → **3Y quant statistics** (Sharpe, Sortino, Alpha, Beta, SD, Tracking error, Info ratio) →
  Distribution donut (by assets / sectors / category) → Top 5 holdings → What if you invested (SIP /
  one-time, slider, projected value) → Returns & ranking (fund / category avg / rank at 1Y·3Y·5Y·All)
  → Riskometer → About · Manager · Expense & exit load accordions → **Invest**.
- **Portfolio**: holdings list → **Insights: "3 funds overlap 40%"** → goals.

This is the multi-asset seed and it is the company's own. It is investor-side and dark; Sentinel is
advisor-side and light. What transfers is the **IA and the facet vocabulary**, never the surface.

## The measured gap, in one table

| The complaint | What is true today | What closes it |
| --- | --- | --- |
| "No recommendation" | A placeholder score with invented weights; the word *recommend* is not one an MFD may use | A real score basis + curation the regulation allows (Anaya) |
| "No navigable journey" | Chat-only entry; nine typed verbs; no browse, no categories, no collections | An entry surface with a hierarchy the advisor can walk (Kabir's IA patterns) |
| "2–3 funds, that's it" | Ten funds in the book; five facets; zero non-MF products | A data contract for every asset class before a screen is drawn |
| — | The one thing retail cannot do, held-by-your-clients, is column three of a table | Lead with it |
