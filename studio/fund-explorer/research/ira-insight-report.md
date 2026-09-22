# Insight report — Where does fund discovery and evaluation break for Indian MF investors and MFDs? · 22 Sep 2026

## 1. Header

**Question.** Before three Fund Explorer variations are argued: what do real users of Indian MF apps
struggle with finding, evaluating and choosing a fund — and does any of it match the stakeholder's three
complaints about Sentinel's build?

**Sources — 231 verbatims.** By platform: Play Store 172, Reddit (r/mutualfunds, r/IndiaInvestments,
r/personalfinanceindia) 39, App Store 18, Cafemutual 2. By app: Zerodha Coin 51, community threads 40,
ET Money 24, Dezerv 18, Tickertape 14, Value Research 11, INDmoney 10, Smallcase 10, MFCentral 10,
NJ E-Wealth 9, Groww 6, Wealthy Partner 6, NJ Client Desk 5, goMF 4, plus Prudent, AssetPlus, Kuvera,
Scripbox at 1–3 each — 22 apps total.

**Date range:** 2018-04-28 to 2026-09-19 (bulk 2024–2026).

**Method.** Public store reviews, Reddit and one advisor-community site, across retail, robo/PMS,
infrastructure and MFD/RIA partner apps. Each row coded with job + symptom
(usability/functional/trust/content), affinity-mapped into 12 themes (T1–T12) plus PROTECT and one
PERSONA note. Ranked below by frequency × Nielsen severity, not code order.

**Honest limit.** Public review mining, mostly retail — not a usability test, not Centricity's own
users. Only **26 of 231 (11.3%) are MFD/RIA/HNI**: 14 MFD, 4 RIA, 8 HNI — enough to see a pattern
(advisors want data to back their own call, not an app recommending to their client), not enough to size
or rank advisor themes with confidence; T12 rests on 14 verbatims from four small partner apps, not
Sentinel's own base. This set **adds 171 verbatims beyond `studio/research/verbatims.csv`** (60,
advisor-only, only six touching fund discovery at all) — chiefly, retail investors' own language for
evaluating and comparing funds.

## 2. Themes, ranked by frequency × severity

| # | Theme | n | Sev | f×s |
|---|---|---|---|---|
| 1 | T6 — "don't trust the recommendation" | 29 | 4 | 116 |
| 2 | T2 — "which one is actually the best?" | 23 | 4 | 92 |
| 3 | T8 — "the numbers don't agree" | 17 | 4 | 68 |
| 4 | T1 — "nothing here beyond what I already know" | 22 | 3 | 66 |
| 5 | T5 — "I can't filter for what matters to me" | 20 | 3 | 60 |
| 6 | T3 — "I can't put two funds side by side" | 19 | 3 | 57 |
| 7 | T12 — "the client's real portfolio isn't here" (MFD) | 14 | 4 | 56 |
| 8 | T9 — "I can't find my way to it" | 17 | 3 | 51 |
| 8 | T4 — "search doesn't find the fund I know exists" | 17 | 3 | 51 |
| 10 | T10 — "no benchmark, no overlap with what I hold" | 15 | 3 | 45 |
| 11 | T7 — "everything useful is now paywalled" | 9 | 3 | 27 |
| 12 | T11 — "I don't understand the terms" | 11 | 2 | 22 |

### 1. T6 "Don't trust the recommendation" · n=29 · sev 4 (users lose money or get sold to) · conf high
Job: deciding buy/hold/switch, or accept a suggestion.
- "DO NOT TRUST THE ANALYST RATINGS... it was BUY during 40 and still it is a buy" — INDmoney, 2★,
  2026-06-25. play.google.com/store/apps/details?id=in.indwealth&reviewId=60524a9c-5a81-482a-bab7-34dd06f07e78
- "et money recommended me pgim elss mutual fund which are worst fund... I UNINSTALL" — ET Money, 1★,
  2026-06-16. play.google.com/store/apps/details?id=com.smartspends&reviewId=307154e8-73ba-42fb-94d9-1ef5478225c3
- (HNI) "Dezerv will call you for MF portfolio review and pull or trap you to move to PMS" — Dezerv, 1★,
  2026-02-14.

**So what:** need is a recommendation the user can audit — basis visible, not a funnel. Sentinel's
honest, withheld-when-thin score is the right instinct; the risk is shipping one that reads like T6.

### 2. T2 "Which one is actually the best?" · n=23 · sev 4 (blocks the core job) · conf high
Job: narrowing hundreds of funds in a category to a shortlist.
- "Does not suggest the best funds to invest in" — Zerodha Coin, 2★, 2026-08-10.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=465fcc25-b91c-408e-81fd-28b68b78077f
- "difficult to find out the best performing fund in any category" — Zerodha Coin, 2★, 2023-10-26.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=be38948a-5487-45e2-bb41-00559bbb828c
- "no way to see how the similar fund types are ranked based on their return or star rating" — Zerodha
  Coin, 3★, 2026-01-03. play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=9c7e615d-ed39-4402-83fc-26cfe78d1d7f

**So what:** need is an in-category ranking, distinct from a personalised push (T6). The Fund Score
answers this only if facets exist to define the category (see T5).

### 3. T8 "The numbers don't agree" · n=17 · sev 4 (corrodes every other number on screen) · conf high
Job: verifying a return, benchmark or score before acting.
- "Returns shown... are Absolute. Industry norm is showing CAGR... intentional misleading" — INDmoney,
  3★, 2026-06-30. play.google.com/store/apps/details?id=in.indwealth&reviewId=1bbb49ff-0b4b-43f7-b6e9-42e7721578a0
- "Still showing outdated BSE benchmarks while 99% of equity mutual funds track NSE" — Value Research,
  1★, 2025-06-30 (RIA). play.google.com/store/apps/details?id=com.valueresearch.vro&reviewId=053bd9a9-2357-4861-84e1-219d14196ffe
- "Diversification score And XIRR... changes very frequently. Completely confused which score is right"
  — Tickertape, 1★, 2026-02-28. play.google.com/store/apps/details?id=in.tickertape&reviewId=40f2889a-c7c8-4dea-93cf-2bdd77887d33

**So what:** need is one number per metric, sourced consistently. `00-current-state.md` already flags a
benchmark reading 42.6% off an unconstrained curve (F-62) — T8 is user-side proof this burns trust.

### 4. T1 "Nothing here beyond what I already know" · n=22 · sev 3 (users route around it) · conf high
Job: analysing a fund past invested/current value.
- "no granular analysis...it shows only fund list, invested amount and current value..which I already
  know" — INDmoney, 2★, 2026-08-04. play.google.com/store/apps/details?id=in.indwealth&reviewId=22b85fe0-51da-41fa-9935-94c0b802fcd7
- "very little data... no AUM, 1 month growth chart, sector holding, no comparison" — Zerodha Coin, 1★,
  2025-09-30. play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=d9acf4c4-c0a2-4ea9-8059-ee52ff60f9f2
- "competition are offering detailed and analytical information... atleast show the rolling returns" —
  Zerodha Coin, 2★, 2026-08-03. play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=b1395e14-6afd-41ae-9154-9811475f5c53

**So what:** need is a fund page past the four fields a broker already shows. The book has nine fields,
none performance, TER or AUM — this is T1 waiting to happen.

### 5. T5 "I can't filter for what matters to me" · n=20 · sev 3 · conf high
Job: screening a list by a constraint specific to this user.
- "Basic portfolio filtering and sorting tools are missing" — Groww, 1★, 2026-09-19.
  play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=54937f05-0997-4ce6-9df6-a27bbfab9093
- "For muslim to find Sharia Compliant stock, similar to a Jain they need Satvik filter" — Groww, 4★,
  2026-09-09. play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=e177841e-c314-4ef0-9401-90968f55ce7b
- "we don't have a filter to select globally investing mutual funds" — Zerodha Coin, 1★, 2025-09-19.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=57675ff1-a7e4-4e07-9917-c04a1c9cc2c5

**So what:** need is facets deep enough for real constraints, not a generic three. Today's honest
vocabulary is five facets, an advisor screens on two — real users expect 8+.

### 6. T3 "I can't put two funds side by side" · n=19 · sev 3 · conf high
Job: comparing category peers, or a fund against its index.
- "such an intuitive experience where I can compare category funds, can see expense ratio, returns of
  the category peers" [re: Kuvera] — Zerodha Coin, 2★, 2025-09-29.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=948c129d-4d47-4266-a978-937c6f6cf636
- "can't compare with other funds... Not showing comparison with standard index fund" — Zerodha Coin,
  2★, 2024-04-11. play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=f0851d2f-d45d-457c-b22b-ae5920aa0749
- "Can't even compare funds with their respective index funds" — Zerodha Coin, 3★, 2024-11-07.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=80497cd1-220d-4b66-8333-6b2c1807a79a

**So what:** need is a comparison table that isn't a paid tier. `CompareTable`/`Dumbbell` exist ahead of
the data — T3 justifies finishing them even at five known fields.

### 7. T12 "The client's real portfolio isn't here" (MFD) · n=14 · sev 4 · conf LOW (small n, partner apps only)
Job: reviewing/recommending against a client's holdings, or explaining commission.
- "NEED WATCHLISTS OPTIN TO TRACK AND RECOMMEND PREFERRED ITEMS" — Wealthy Partner, 2★, 2024-10-13.
  play.google.com/store/apps/details?id=in.wealthy.android.advisor&reviewId=044b67b8-850e-4567-9dc9-ea93c099b96f
- "only a part of asset allocation shown... no mention of mid large or small, still no intelligence
  metrics" — AssetPlus Partner, 1★, 2026-04-11 (MFD).
  play.google.com/store/apps/details?id=in.assetplus.partner&reviewId=0b9c9d5c-31e6-4070-809b-a03034c7bb17
- "Client also added with PAN but portfolio of the client not showing... How this app supports MFDs,
  could not understand" — AssetPlus Partner, 1★, 2022-08-20.
  play.google.com/store/apps/details?id=in.assetplus.partner&reviewId=ef571dee-b46e-4992-806d-31de6ad21aec

**So what:** need is the client's actual book, reliably, before speaking. The held-by-your-clients
reverse lookup is exactly this need and this product's real edge — peers are starved for it.

### 8 (tie). T9 "I can't find my way to it" · n=17 · sev 3 · conf high
Job: reaching a known feature or shortlist inside an app that has one.
- "Watch list is for quick view but getting is difficult, 3 taps. Default tab option is not present" —
  Groww, 2★, 2026-08-11. play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=09ec0a99-2d28-4add-81ff-9ee906df9f8d
- "So confusing and congested interface that by mistake redeemed my folio" — INDmoney, 1★, 2026-08-07.
  play.google.com/store/apps/details?id=in.indwealth&reviewId=fde1d1df-ddf7-4bc0-b78e-8204c147973c
- "constant UI/UX changes make it frustrating... forcing users to relearn" — INDmoney, 3★, 2026-04-20.

**So what:** need is a stable, walkable hierarchy, not a redesign every release. This evidence is about
*within-app* navigation of feature-rich apps; none of the mined apps are chat-only, so it can't confirm
or deny chat-only entry itself (see §7).

### 8 (tie). T4 "Search doesn't find the fund I know exists" · n=17 · sev 3 · conf high
Job: searching by name for a specific, known fund.
- "Search results disappear when exactly two characters are entered" — Zerodha Coin, 1★, 2026-07-01.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=c2667269-7155-4bef-bee6-985c2eeeabe7
- "search for ICICI Prudential Strategic Metal and Energy Equity FundofFund... not available but it's
  shown in the web app" — Zerodha Coin, 1★, 2025-12-18.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=76cd8362-b105-4ad5-b371-980c19bf3ce9
- "Searching on Coin does not work for many mutual funds. Had to Google them" — Zerodha Coin, 2★,
  2026-08-09. play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=e00e8f13-25d7-4ee2-95ea-9bd088e2877a

**So what:** need is search that matches fuzzily, covers the full catalogue. The nine-verb chat parser is
a different model — the bar for "found it" stays unforgiving regardless of surface.

### 10. T10 "No benchmark, no overlap with what I hold" · n=15 · sev 3 · conf high
Job: judging a fund vs. benchmark, or checking overlap with existing holdings.
- "There must be graph to show any fund performance against its benchmark, not vs category" — Zerodha
  Coin, 2★, 2023-09-15. play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=9503c2f4-cc40-4c43-a61c-3bc73106feb5
- "Please introduce overlap feature with my portfolio" — Zerodha Coin, 3★, 2024-08-10.
  play.google.com/store/apps/details?id=com.zerodha.coin&reviewId=9b021d15-a982-4611-a2c1-55dbf91d7ecc
- "benchmark has only BSE indexes... portfolio comparison with any index like Nifty 50... very important"
  — Tickertape, 4★, 2025-03-02. play.google.com/store/apps/details?id=in.tickertape&reviewId=3645e990-383c-452b-a108-0d3b20cd2f56

**So what:** need is overlap and benchmark as table stakes. `OverlapView` renders an em dash today — T10
says this is one of the most wanted screens in category, not a nice-to-have.

### 11. T7 "Everything useful is now paywalled" · n=9 · sev 3 · conf medium
Job: getting guidance or comparison after a free tier stops working.
- "now it is demanding additional monthly subscription charges... only shows mutual fund performance,
  which is basic" — ET Money, 1★, 2026-04-26.
- "paid 999 for tracking an external portfolio and seeing the ranking of mutual funds. but now it again
  says pay to upgrade" — ET Money, 2★, 2026-05-27.
  play.google.com/store/apps/details?id=com.smartspends&reviewId=c6efc4c7-b123-4428-a880-dc666a92d4e3
- "now they have blocked all features for review or comparison" — ET Money, 3★, 2026-03-04.
  play.google.com/store/apps/details?id=com.smartspends&reviewId=e2fa1427-0d60-421c-aa65-3ffe156d54e4

**So what:** need is comparison/ranking as baseline, not a monetisation lever. No paywall model here, but
a warning against gating the score or compare view behind "premium" later.

### 12. T11 "I don't understand the terms" · n=11 · sev 2 (minor, real for beginners) · conf medium
Job: reading a fund page, or holdings, in plain language.
- "Bonds interface is too difficult to understand. I can't even view my portfolio" — Groww, 2★,
  2026-08-19. play.google.com/store/apps/details?id=com.nextbillion.groww&reviewId=6437ae8a-4f4d-48d4-9428-8c5025acdc2a
- "make app so easy that non commerse invester can understand terms" — Tickertape, 2★, 2025-12-22.
  play.google.com/store/apps/details?id=in.tickertape&reviewId=8a10a4bf-1ba4-4600-8ef8-6f1b3eaff22a
- "Please summarize the pros and cons system generated like screener.in does it" — Tickertape, 3★,
  2024-11-20. play.google.com/store/apps/details?id=in.tickertape&reviewId=e09e0b87-8696-45a6-b8c3-ee6346d330ec

**So what:** need is jargon translated at point of use. DNA copy rules already push plain English — this
confirms, doesn't add a new requirement.

## 3. What to protect

17 PROTECT rows, mostly 4–5★:
- **Trust in the source over the feature list**: "we trust Zerodha's judgment completely"; "No
  recommendation & unnecessary notification... On top of that Zerodha's trust" (both Zerodha Coin, 5★) —
  restraint itself is valued.
- **Clean over complete**: "UI is so neat and clean and not cluttered with unwanted features liky groww
  app" (Zerodha Coin, 4★). New facets (T5) must not become the clutter T9 complains about.
- **Honest delegated recommendation is loved**: "the fund recommendations by scripbox are really good if
  you are not into exploring and analysing everything on your own" (Scripbox, 5★); "expert research
  support... provides the necessary data to support my recommendations" (Wealthy Partner, 5★, MFD) —
  advisors want data to back *their* call, not the app recommending to their client.
- **Fast, reliable comparison**: "allows comparison of up to five funds and provides accurate updates
  right after midnight" (Value Research, 5★).
- **Time saved is felt directly**: "AI based features help me generate reports in seconds, saves
  [hours]" (Wealthy Partner, MFD) — protect anything Sentinel already does this well (reverse lookup).

## 4. Personas (behavioural)

**The MFD partner** (14 verbatims — low-n, flagged). Reviews a client's book before speaking; wants
holdings and commission math visible without a ticket; distrusts being pushed to self-invest or upsell
PMS; wants research that lets *them* make the recommendation. Anxiety: looking uninformed to a client.

**The experienced retail investor** (175 verbatims — best-evidenced persona here). Holds multiple funds
across platforms; wants to rank, filter and compare before acting, not be told what to do; checks numbers
against Value Research; churns over paywalls and lost navigation more than missing features per se.

**The first-time investor** (30 verbatims, thinner). Wants terms explained, a single default view, fewer
taps to a shortlist; overwhelmed by "hundreds of funds" without ranking help. Treat as directional — a
fifth the volume of the experienced-retail persona.

**The HNI** (8 verbatims — very low-n, flag). Suspicious of being steered to PMS "without considering
expense factors or taxes"; wants overlap cost made visible ("₹1L+/year silent bleed. Not visible until
review").

## 5. Journey map — finding and choosing a fund

| Stage | Does | Thinks | Emotion | Pain |
|---|---|---|---|---|
| Prompted | Has a need (own or client's) | "Where do I start" | neutral | T9 |
| Search/browse | Types a name, opens a category | "Why can't it find what I typed" | dipping | T4 |
| Narrow | Applies filters | "None of these match what I care about" | frustrated | T5 |
| Evaluate one | Opens a fund page | "Tells me nothing I didn't know" | flat/annoyed | T1, T11 |
| Compare | Puts two funds side by side | "I have to do this in my head" | frustrated | T3, T10 |
| Decide | Weighs a rating, score or push | "Can I actually trust this number" | suspicious — low point | T6, T8, T7 |
| Act (advisor) | Recommends to a client | "Is this their real book, can I explain the fee" | anxious commitment | T12 |

The curve bottoms at **Decide**, not Search — the cost of *not trusting the answer* outweighs the cost of
*not finding it*.

## 6. Opportunity solution tree

```
Outcome: advisor finds, evaluates and confidently backs a fund choice for a client,
         in a journey they can walk end to end
│
├── Trustworthy guidance (T6, T7, T8) — auditable score, one number per metric, no paywall on compare
├── A shortlist mechanism (T2, T5) — in-category ranking; facets deep enough for real constraints
├── Depth and comparability per fund (T1, T3, T10) — beyond invested/current value; side-by-side; overlap
├── A findable, stable hierarchy (T9, T4) — reachable without relearning; forgiving search
├── Plain-language content (T11) — jargon translated at point of use
└── Advisor-linked visibility (T12, low confidence — validate first) — client's real book, commission math
```
Opportunities only — no solutions specified here by design.

## 7. The three stakeholder complaints, tested against the evidence

**"Recommendation nahi"** — Partly real, but inverted. 24 verbatims mention "recommend"; the majority
(T6, n=29, biggest theme) **got** a recommendation and didn't trust it — stale ratings, redeemed units
counted as returns, PMS upsell disguised as review. PROTECT shows the same users loving Scripbox/Wealthy
delegated guidance *when honest and disclosed*. The real ask is a rankable, auditable shortlist (T2,
n=23), not a "recommended for you" surface — which would likely reproduce T6.

**"Organized journey nahi"** — Only partially testable. T9 (n=17) is the closest evidence, but every
source app has a browse/search UI Sentinel's chat-only entry doesn't — so this proves feature-rich apps
*still* fail at findability, not that chat-only entry is specifically the gap meant. Confirmed: users
expect a stable, walkable hierarchy (T9) and working search (T4) regardless of surface. Whether that
hierarchy must be a browsable screen or can live in chat is a call this evidence can't settle — §8.

**"2–3 fund dikha deta hai bas"** — Not literally evidenced (no app here has too few funds to complain
about), but the underlying need is strongly evidenced. T1, T2, T3, T5 together (84 verbatims, the four
biggest non-trust themes) all say the same thing differently: users expect depth and facets, not volume —
rolling returns, AUM, sector split, category comparison, personal-constraint filters. Sentinel's ten
funds and nine fields, none performance or AUM, would trigger T1 and T5 regardless of count on screen.
The "count" complaint is really about what's knowable per fund — independently confirmed by the
product's own data audit.

## 8. What only human research can answer

Mining cannot see: whether an MFD trusts a chat-parsed shortlist as much as a browsable list; how long an
advisor tolerates typing filters mid-client-call versus tapping them; whether the reverse client lookup
is legible enough on first use to be trusted; which "recommend" an MFD believes they're regulatorily
allowed to see; and whether the Decide low-point (§5) is the same for an advisor acting for a client as
for a retail investor acting for themselves.

**Proposed study (5 lines).** 6–8 moderated sessions with practising MFDs (mixed tenure), using a working
Journey C/D prototype. Task: given a client's stated goal, find, evaluate, compare and settle on a fund
in 10 minutes, thinking aloud. Measure: time to first candidate, filter/chat turns, moments of stated
distrust, and whether they can explain the score's basis unprompted afterward. Recruit via
AMFI/NISM-registered MFD communities, not general investor panels.
