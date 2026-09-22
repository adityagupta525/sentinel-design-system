# Fund Explorer — the plan

**22 Sep 2026 · research and planning only. Nothing is designed yet; nothing is built.**

Stakeholders rejected the Fund Explorer: *"recommendation nahi, organized journey nahi, 2-3 fund dikha
deta hai bas."* This is the answer to that, argued from evidence rather than taste, with the team's
disagreements on the record.

**What this rests on.** 231 verbatims mined and coded (`research/verbatims-discovery.csv`, ranked in
`research/ira-insight-report.md`) · 30+ Indian products torn down, retail, advisor and multi-asset
(`research/kabir-teardown.md`) · interaction patterns for chat-plus-browse, guided funnels, fund pages,
compare and filters, with NN/g and Baymard evidence (`research/noor-patterns.md`) · the 2026 regulatory
floor, read at source (`research/anaya-domain-brief.md`) · 66 reference screens in two boards
(`refs/board-mobbin.png`, `refs/board-retail.png`) · and the measured state of what ships today
(`00-current-state.md`). The debate is in `debate/`, judged in `debate/critique-and-resolutions.md`.

---

## 1. The complaint, tested

The three parts of the complaint turn out to point at three different layers. This is the single most
useful finding in the round, because it means no one variation can answer all three.

| What was said | What the evidence says | Which layer it lives in |
| --- | --- | --- |
| **"Recommendation nahi aa raha"** | **Inverted.** The largest theme is people who *got* a recommendation and did not trust it — T6, n=29, severity 4, bigger than the next theme by six. Stale ratings, redeemed units counted as returns, a "portfolio review" that became a PMS upsell. Users who love delegated guidance love it *when the basis is shown* (PROTECT: "expert research support… provides the necessary data to support my recommendations", Wealthy Partner 5★, MFD). A louder "Recommended for you" reproduces T6 — and is illegal for an MFD anyway (Anaya §2.1) | **Object / trust** |
| **"Organized journey nahi"** | **Partly testable.** T9 "I can't find my way to it" (n=17, sev 3) and T4 "search doesn't find the fund I know exists" (n=17) are real and evidenced. But every app mined *has* a browse UI and still fails at findability — so the evidence proves people need a stable, walkable hierarchy, not that chat-only entry is the specific fault | **Surface** |
| **"2–3 fund dikha deta hai bas"** | **Zero literal verbatims in 231 rows.** Its evidenced content is depth, not count: T1 + T2 + T3 + T5 = 84 verbatims asking for rolling returns, AUM, category comparison, real facets. Sentinel's book has **10 funds, 9 fields, no performance, no TER, no AUM, no holdings, zero non-MF rows** — which would trigger T1 and T5 at any count on screen | **Data** |

**So the order of work is data → object → surface.** A five-asset explorer drawn over a ten-row
mutual-fund book is how the current one got rejected.

---

## 2. What every variation must carry

These came out of the crit as shared requirements, not as any one variation's advantage.

1. **Basis on the face of every row.** Peer context — "rank n of N in category" or "vs category
   median" — because a fund shown alone is a number and a fund shown with its category median is a
   judgement (Kabir §F.1; INDmoney, Groww, Kuvera and Morningstar all do this). Plus provenance: "as
   on 31 Aug 2026 · AMFI". This is the answer to T6 and it is not optional.
2. **"Held by R. Sharma · 4.2%" on line one, not column three.** No product surveyed ships
   "not already held by this client" — not Morningstar's X-ray, not Prudent edge+, not AssetPlus's CAS
   import (Kabir §I.6). Sentinel already reads the book. It is the one uncontested edge and it is
   currently buried.
3. **The shortlist is a durable object, not a message.** Named, saved, versioned, re-runnable, tied to
   a client. Tickertape saves a screen with a note; Wealthy Select is a monthly playbook; NJ ships a
   Recommended Portfolio. "The shortlist is the durable object, not the query" (Kabir §F.5). Journey C
   re-sends a fresh table every turn — Noor's own file names this as the anti-pattern behind
   "2–3 funds, bas".
4. **Asset classes are sectioned, never merged.** "Returns" cannot be one column: MF is CAGR vs a
   Tier-1 TRI benchmark, PMS is TWRR vs an APMI benchmark, AIF is IRR with an agency report, bonds are
   YTM — not a return at all (Anaya §3.8). Only MF carries the regulator's riskometer pictogram, so one
   shared "risk chip" would be dishonest. One Digital's own Explore segments rather than merges.
5. **Unknown is said in words, never as a zero.** The existing instinct — an em dash with the reason —
   is correct and stays. The score is *withheld* with a stated reason when inputs are thin.
6. **MFD copy by default, RIA copy behind a per-client mode.** MFD mode: "Funds that match your
   filters", Regular plan, commission disclosure, no auto-ranking. RIA mode: Direct plan, suitability
   trail, AI-use disclosure (Reg 18(9)), "Suggested for `<client>`". A client is either advisory or
   distribution within the group, never both — IA Reg 22(3), so this is per client, not a settings
   toggle (Anaya §4.3).
7. **Compare caps at two side by side on a phone**, third as "+1 more"; three or more becomes a ranked
   list on one metric at a time. NN/g's rule; Groww turned compare *off* in its app rather than ship
   three columns at phone width.
8. **The fund page is one scroll with a sticky section strip, not tabs.** A fund page is a
   cross-reference task and NN/g is explicit that tabs tax exactly that. Accordions for prose only.
   Annexure 12A is the floor for what must be on it (Anaya §1.1).

---

## 3. The three variations, after the crit

### V1 · The guided journey — structure the advisor can point at

Asset class → category → a counted, sortable list, with intent tiles at the entry ("Highly rated",
"Maturing within 3 years") that are named, pre-filled filter sets rather than a form. Compare, overlap,
fund page, tutorial. **Two levels, not four** — every precedent stops at two, and the fifth asset class
is handled by segmenting, not by nesting.

- **Strongest for:** T2 (n=23, "which one is actually the best?"), T5 (n=20, real facets), T9
  (findability). It is the only variation that produces a *category object* for peer context to rank
  inside.
- **Weakest at:** it ends in a fund, when the advisor's unit of recommendation is a portfolio (Kabir
  §I.12). It needs the most data before it can render honestly.
- **Open:** does it get a screen, or does it stay a stack of artifacts in the thread? See §6.

### V2 · The explorer sheet over the live chat — one surface, two grammars

A non-modal sheet rises over the thread on a funds query, at three detents — peek (count + top three),
half (the shortlist), full (list + filter rail) — never covering the composer. Swipe down is back, one
detent at a time. One artifact lives in it, mutated in place rather than re-sent.

- **Strongest for:** it keeps the filter state visible while the advisor works, which a scrolling
  thread structurally cannot. It is the only variation that fixes the re-send anti-pattern by
  construction.
- **Weakest at:** **the mechanic has no incumbent anywhere.** Mobbin returned zero screens for a browse
  sheet over a live chat with a working composer. Amazon Rufus is the mirror (a chat sheet over a
  store), Google Maps is the detent grammar (over a canvas, not a conversation), Spotify is the
  mutating object (inside one thread, not layered over it). V2 is their union.
- **Gate:** a driven HTML prototype of the three detents must exist and be watched **before** V2 is
  designed — the gesture conflict between sheet-drag and thread-scroll is the central risk, not a
  detail. F-80 is this repository's proof of what a plausible-looking interaction hides.

### V3 · The auditable shelf — change what a sentence produces

Entry stays chat-led. What changes is the object: the shortlist gets a name, a saved state, a version
history, a client, a peer line and a "held by" line on its face, and a home in the Drawer that survives
the session. Refreshable on a cadence, the way Wealthy Select and Tickertape's saved screens are.

- **Strongest for:** it is the only argument built on T6, the biggest theme, and it needs the smallest
  data contract to be honest.
- **Weakest at:** it may not *look* different enough to a stakeholder — the change is in the object
  model, under a surface that still reads like Journey C. The saved-shortlist card needs real visual
  weight or this reads as "Journey C plus a save button".
- **Note from the crit:** V3's object model has been promoted into §2 as a shared requirement. V3 as a
  variation is therefore best read as *"the object model, with chat entry unchanged and no new
  surface"* — the smallest, fastest, most honest of the three, not a rival surface.

### How they differ, in one table

| | V1 funnel | V2 sheet | V3 shelf |
| --- | --- | --- | --- |
| Entry | Composer + intent tiles | Composer; sheet rises on a funds query | Composer, unchanged |
| Where the advisor stands | In a structure they walked | In a sheet over the conversation | In the conversation |
| Filter state | Chips on the list head | Visible in the sheet header while working | Chips in the turn |
| New surface | A screen, or stacked artifacts (open) | A sheet (new primitive, `ExplorerSheet`) | A Drawer section |
| New components | Intent tiles, sticky section strip, 5 asset cards | `ExplorerSheet` (3 detents, non-modal) | `PeerContextLine`, `SavedShortlist`, `ModeStrip` |
| Biggest risk | Four levels no precedent supports; ends in a fund | The mechanic has no incumbent | Reads as too small a change |
| Data needed before it is honest | Most | Most | Least |

---

## 4. The data contract — the real ceiling

Nothing above can be drawn honestly until this exists. Per asset class, from Anaya §3 and Kabir §C:

| Class | Rows today | What a card cannot lie without |
| --- | --- | --- |
| **Mutual funds** | 10, 9 fields | TER + as-on date · AUM · 1/3/5Y CAGR vs Tier-1 TRI · riskometer + as-on month · PRC cell (debt) · plan label · holdings (for overlap, SEBI's ∑min(w) method) · 2026 category vocabulary (the 2017 list of 36 is out of date) |
| **Bonds / NCDs** | 0 | Issuer · rating + agency + date · YTM · coupon · tenure · payout frequency · secured/unsecured · min investment (OBPP Annexure B's 12 fields) |
| **PMS** | 0 | Strategy · manager · AUM · TWRR vs APMI benchmark + peer rank · fee with high-water mark · min ₹50 L · APMI-registered distributor |
| **AIF** | 0 | Category I/II/III · commitment · drawdown · lock-in · target IRR **"as per PPM"** only, never ours · min ₹1 Cr |
| **GIFT City** | 0 | Currency · inbound/outbound/feeder · eligibility (NRI/OCI/resident) · LRS consumption · min USD 75,000 (PMS) |
| **Unlisted** | 0 | Indicative price + the word "indicative" · change · lot · sector · **stage** (Pre-DRHP → DRHP filed → IPO expected → SEBI approved) |

**Bands, not sliders.** GoldenPi and IndiaBonds proved three to four named bands work on a phone where
a slider does not: "AAA (Low risk) / AA (Balanced) / A and below (High yield)", "Up to 8% / 8–11% /
11%+". Sentinel's chips should be the bands an advisor says aloud.

**Counts beside every option** ("Equity 612 funds", as One Digital already does) and on the apply
button ("View 1,731 funds", as Coin does) — Baymard calls option counts the single highest-impact
filter fix.

---

## 5. Build order

1. **The data contract** — MF first, in full. Nothing else starts honestly until a fund card can carry
   TER, AUM, performance vs benchmark and the riskometer with its as-on date.
2. **The object model** (§2.3) — the named, saved, versioned shortlist, whichever surface wins. It is
   the fix for the anti-pattern behind "2–3 funds, bas", and it is a data-layer decision as much as a
   UI one.
3. **The surface** — V1 or V2, after §6 is ruled and, for V2, after the prototype has been watched.
4. **Second asset class** — bonds, because its facet vocabulary is the best evidenced and its cards do
   not need a performance series.
5. **Sleeves** — the explorer feeds Journey D (the proposal) and Journey E (the rebalance), both built.
   The shortlist object should be shaped so a sleeve is a later container around it, not a rewrite.

---

## 6. What needs a decision before design starts

| # | Question | Who | What it unblocks |
| --- | --- | --- | --- |
| 1 | **May the explorer have a screen?** The 19 Sep line — *"no explorer screen, because there is no canvas"* — describes what was built, not a prohibition. The shell ships `ScreenScaffold`, `ScreenStack`, `Drawer`, `TopBar`; what does **not** exist is a Canvas surface (removed in v5). Verified, not assumed | **Ashish** | Whether V1 is a funnel or a stack of artifacts, and whether V2's sheet is needed at all |
| 2 | **Is a summoned sheet "pinned above the composer"?** The 18 Sep ruling killed `Dock.chips`/`Dock.cta` because they sat there unasked. V2 argues a sheet the advisor summons, that never covers the composer and always carries a dismiss, is a different thing. That reading may be right — but an advocate may not re-read your ruling into permission | **Ashish** | Whether V2 has three detents or one |
| 3 | **Which variation goes to stakeholders, and in what order?** | **Ashish** | The next round of work |
| 4 | **Who owns the Centricity Fund Score, and where may it be shown?** A proprietary ranking is a research report under SEBI's RA Regulations: it needs a registered owner and a published methodology. The weights are currently invented and the card says PLACEHOLDER twice | **Compliance** | Whether the score can be a sort column, a badge, or must stay off the discovery surface |
| 5 | **Does ¶19.10.4 apply to a regular-plan explorer by analogy?** | **Compliance** | Whether even a category-median sentence needs a methodology note |
| 6 | **Which asset classes ship first, and who supplies each feed?** | **Ashish + data** | Everything in §4 |

---

## 7. What this plan does not claim

- **The advisor evidence is thin.** Only 26 of 231 verbatims are MFD, RIA or HNI (11.3%). Every
  advisor-side claim here is a pattern, not a measurement, and is marked as such in Ira's file.
- **Chat-only entry is neither proven nor disproven.** No app mined is chat-only, so the evidence
  cannot settle whether a browsable hierarchy must be a screen.
- **V2's mechanic is unproven, not merely new.** No product raises a browse sheet over a live chat with
  the composer working underneath. That is a reason to prototype it, not a reason to drop it.
- **Nothing here has been drawn.** These are arguments and contracts. The visual language is settled and
  is not being restyled; only the explorer changes.
