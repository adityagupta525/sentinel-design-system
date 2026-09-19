# Craft audit — Sentinel's fund page beside three shipped references

**19 Sep 2026 · Raghav, Design Principal · Law 4: taste is a gate, and the gate is Ashish's yes**

Evidence: `audit/side-by-side.png` — our screen at 1×, then **Shopee Fund Details**, **Cash App Stocks**,
**TradingView AAPL**. Shopee is the honest comparison: `InfoCard`'s own header says its anatomy is
*"Shopee's anatomy, in our language"*, so this is our own stated reference, measured against itself.

I picked the fund page because it is the **only screen in this product where a figure lands**, and a
craft audit is worth most where the work is strongest — that is where the remaining gap is real rather
than obvious.

---

## What holds, and holds well

1. **The figure has a moment.** `21.4%` at display size carries the same weight as Cash App's `$1.01`
   and TradingView's `179.23`. Three weeks of screens set every number at body size inside a sentence;
   this one does not, and the difference is visible from across the room.
2. **The qualifier is better than all three references.** Ours reads *"Three-year CAGR · against Nifty
   500 TRI"* on the line beside the figure. Shopee puts "CAGR 1Y" in an 11px label far below it; Cash
   App says "all-time" and TradingView says "today" — both in grey, both easy to miss. **Ours is the
   only one of the four where you cannot misread the period.** That is not a small thing in a product
   whose figures get read aloud to clients.
3. **The caveat sits above the range row, not in a footer.** None of the three references does this.
4. **Provenance.** *"illustrative figures for design, not a scheme record."* No reference has anything
   of the kind, and for us it is the difference between a demo and a lie.
5. **The ⓘ on each stat** matches Shopee's exactly — CAGR ⓘ, Max Drawdown ⓘ. Arrived at independently
   and it is the right answer.

## Where it reads weaker, and why — four findings

**R-1 · The range row promises a chart it does not have.** *(parameter C6 / E1, major)*
All three references put range pills under a chart, and the pills move the chart. Ours move a single
number. It is honest — we have point returns, not a series — but the control is borrowed from a pattern
that does more, so it under-delivers on its own shape. **Two ways out, and they are not equal:** add a
NAV series to `book.jsx` and draw `ChartLine` (the component exists and is on no screen), or make the
range change more than one figure — 1Y/3Y/5Y each with their own benchmark delta. The first is better
and is a data decision for Ashish.

**R-2 · Three nested surfaces where the references have one.** *(parameter G1, major)*
Our fund page is a card, inside a `DataTable` row, inside an `ArtifactCard`, inside a thread. Each
carries its own radius and its own edge. **Measured consequence:** our content column is visibly
narrower than Shopee's at the same 375, which is why *"Parag Parikh Flexi Cap"* wraps to two lines and
Shopee's *"Sucorinvest Maxi Fund"* does not. The nesting is a real decision — "a fund's page opens IN
PLACE, never a modal" — so the fix is not to unnest it; it is to stop the innermost card re-stating an
edge the row already drew.

**R-3 · Four rounded boxes where a hairline would do.** *(parameter G1, minor)*
Shopee spends one divider on two stats. We spend four rounded rectangles on four. *Not everything is a
card* — border, fill and radius each say "separate object", and here four of them say it about facts
that belong together. The vertical cost is real: our four stats take more height than Shopee's two
stats **plus a chart**.

**R-4 · Our labels are long where the references' are short.** *(parameter C4, minor)*
*"Held by your clients"* wraps to two lines and *"2% within 365 days"* wraps beside it. Shopee: *"CAGR
1Y"*, *"Max Drawdown 1Y"*. Ours are more human and that is deliberate — but in a 2×2 grid at 375 the
wrapping is what makes the block feel unresolved. Shorter labels, or two rows instead of a grid.

---

## The cheap-UI checklist, filled honestly

| Check | Ours |
|---|---|
| One accent, locked | ✅ one bronze, and it never encodes identity |
| One radius set | ✅ |
| Type scale, no orphan sizes | ✅ generated from tokens |
| Tabular numerals wherever digits change | ✅ |
| Real content, no lorem | ✅ and the fixture says it is a fixture |
| Motion motivated and capped | ✅ one easing, reduced-motion in three places |
| Semantic colour separate from accent | ✅ |
| Hierarchy: one thing is clearly biggest | ✅ **here**. ❌ on the other five journeys |
| Density: content fills its container | ⚠️ R-3 — four boxes where a rule would do |
| Edges: one set per object | ⚠️ R-2 — three nested edges |
| Labels fit their box | ⚠️ R-4 |
| Controls deliver what their shape promises | ⚠️ R-1 |

**Verdict: not a blocker, two majors.** The screen belongs beside those three — it says more true things
than any of them. It is beaten on density and on the chart, and both are fixable without touching the
visual language.

**The gate is Ashish's, not mine.** The question for him is R-1: do we put a NAV series in the book so
the range row earns its shape, or do we accept a range over one figure and say so?
