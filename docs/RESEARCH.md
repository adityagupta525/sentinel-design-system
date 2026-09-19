# Insight report — where trust breaks in an Indian wealth app, and which breaks Sentinel already answers
**19 Sep 2026 · Ira (UX research)**

**Question.** An advisor is about to read a number off this screen to a client. *Where, in the apps they
use today, does that stop being safe?*

**Sources.** 60 verbatims, all real and all linked, from Google Play on 19 Sep 2026:
**KFinKart – Distributor** (advisor-facing, 3.2★) · **AssetPlus – MF Partner** (advisor-facing, 4.7★) ·
**Groww** (investor-facing, 4.8★, 24.7 lakh ratings). Dates range Mar 2019 – Sep 2026. Raw file:
`studio/research/verbatims.csv` — source, app, date, stars, quote, url.

**Method.** Store listings opened in the browser, review dialog expanded, every review on the first page
captured with its star rating and date (no selection by hand at capture time). Then open coding by *job*
and *symptom*, affinity clustering, and ranking by frequency × severity (Nielsen 0–4, where 4 blocks the
job, costs money, or breaks trust).

**What this study is NOT.** It is 60 public reviews, not a usability test and not an advisor interview.
Play's first page is "most relevant", not a random sample. Two of the three apps are AMC/RTA tooling
rather than an advisory workbench, and none of them is chat-led. Everything below is therefore evidence
about *what goes wrong in this category*, not proof about Sentinel. §6 says what only a human study can
settle.

---

## Themes, ranked

### 1. "The total is wrong and nothing tells me" · freq 5 · sev 4 · confidence high
**The job:** an advisor opening the book before a client meeting, or quoting an AUM.

- *"Now consolidated AUM is seen. but just check my few investors details in Axis MF is not seen and hence **total AUM shown is less**"* — KFinKart, 3★, Jan 2020
- *"**Incomplete investment details gets reflected most of the time.** Also there is delay in data reflexion"* — KFinKart, 3★, Feb 2024
- *"I checked **my entire holding was not showing** due to server issue"* — Groww, 1★, Jul 2026

**Underlying need:** to know whether what is on screen is *all* of it. A total that silently omits one
AMC is worse than no total, because it is quotable. The symptom is missing data; the cause is that the
product renders a sum without stating what it is a sum *of*.

**So what for us:** this is the single strongest external support for rule 4 and for provenance under
every figure. It also raises a gap Sentinel has not closed: our provenance says *where* a figure came
from ("from his Q3 statement"), never *how complete* it is. A book assembled from several RTAs needs a
completeness statement — "43 funds, 2 AMCs still to report" — or the same failure is available to us.

### 2. "I can't tell whether it actually went through" · freq 6 · sev 4 · confidence high
**The job:** executing, and then telling the client it is done.

- *"money stays blocked but app says failed... **my money gets blocked or deducted every time**"* — Groww, 1★, Aug 2026
- *"clients open the link... they find it difficult to get past the Payment page... **no acknowledgements are received regarding approval**"* — KFinKart, 3★, Nov 2023
- *"the order does not get executed automatically. I have **incurred losses** so many times"* — Groww, 1★, Aug 2026

**Underlying need:** one honest state for an instruction in flight, and a record afterwards. The reviews
are not asking for speed; they are asking to be *told*.

**So what for us:** screen 7 already draws this line — "placed" for what left under the ARN, "drafted"
for what did not — and this is the evidence that the line is the product, not a nicety. **What we do not
have is the in-flight state**: `ConfirmSheet.busy` says "Placing both moves…" and then the thread shows
the outcome, with nothing in between if the connection drops mid-execution. That is the one state an
advisor will meet on a bad day, and it is unbuilt.

### 3. "The update took away what I had" · freq 4 · sev 3 · confidence medium
- *"this upgrade is a **total failure from user experience perspective**. Earlier version was a lot better and had features like **transaction history, yields**"* — KFinKart, 2★, Oct 2020
- *"Had to rate 3* down from 5*... everyone else was facing the issue with the latest app update"* — Groww, 3★, Aug 2026
- *"ridiculous new update. When we open the charts the back button on our phone just disappears"* — Groww, 1★, Aug 2026

**Underlying need:** continuity. An advisor's workflow is muscle memory between meetings.

**So what for us:** it is external support for *never restyle*, and for `VersionRow`'s existence. It also
argues that the going-back layer should extend to the product itself — when a surface changes, say so
once in the thread rather than letting an advisor discover it in front of a client.

### 4. "There is no ledger — I cannot see what happened, day by day" · freq 3 · sev 3 · confidence medium
- *"**There is no option check all transactions day wise & type wise** like CAMS edge360 where all AMC transactions are available"* — KFinKart, 3★, Aug 2024
- *"**Could not download statement** and could not add new Bank Account"* — KFinKart, 2★, Oct 2020
- *"monthly sip Reports not available pls add tools clients requirement"* — AssetPlus, 4★, Jul 2026

**So what for us:** Sentinel has no transaction ledger and no export. `DownloadAction` exists and is on no
screen. The drawer is *history of conversations*; this is history of *money*, and they are not the same
thing. A real gap, and a candidate for the build order.

### 5. "Show me the shape of the portfolio, not one word for it" · freq 2 · sev 3 · confidence medium
- *"**only a part of asset allocation shown that too it says equity no mention of mid large or small**, still no intelligence metrics for patterns include **% change at portfolio level instead of absolute nos**"* — AssetPlus, 1★, Apr 2026
- *"goal-wise trackers with sub-divisions for goals like retirement, education, wealth creation... would make portfolio tracking much easier"* — Groww, 3★, Sep 2026

**So what for us:** this is an MFD asking, unprompted, for precisely what Journey B draws — an allocation
that is split finely enough to act on, and change expressed in points rather than rupees. It supports the
drift screens as built, and it says our `AllocationCard`'s three rows (Equity / Debt / Cash) are one level
too coarse for the advisor who wrote it: **the cap split is where the risk actually sits**, and our own
single-fund and small-cap-sleeve ceilings are stated against caps we never show.

### 6. "I could not get in, so nothing else mattered" · freq 9 · sev 4 · confidence high
Nine of the 60 are login, OTP, password or permission failures — the largest single cluster, and almost
entirely 1★. *"unable to login with my mobile number. it always gives error — 'something went wrong'"*
(Groww, 1★) · *"After clicking on the generate OTP button... nothing happens at all"* (KFinKart, 1★) ·
*"from last 2days I am trying to log in"* (KFinKart, 1★).

**So what for us:** outside this repository's scope — Sentinel has no auth surface designed — and worth
stating precisely because of that. **The first screen is the product.** Whoever builds it should know it
is the largest source of 1★ in the category.

---

## What to protect — the 5★ themes
Sixteen of the 60 are 5★, and they cluster on two things, neither of which is a feature:

1. **Speed of getting a client in.** *"takes less than 5 mins to create your account"* · *"digital
   onboarding is so fast"* · *"Entire client onboarding can be done by using this app very fast"*
   (AssetPlus, 5★, Aug–Sep 2026). For an MFD, onboarding *is* the product's first impression.
2. **A named human who answers.** *"My RM Mamata has been very supportive"* · *"query resolving is very
   quick"* · *"Excellent User friendly and expert support, round the clock"*. And the same axis inverted
   produces the 1★s: *"I have support tickets open for months now"* · *"support team is disgusting"*.

**So what for us:** the highest-rated advisor app in this sample is praised for **people and speed**, not
for analysis. A chat-led product is, to an advisor, a promise that something answers immediately — so
Sentinel's honesty rules (say what you cannot do, name what you did not guess) are load-bearing on the
axis this market actually rates.

---

## Journey map — the advisor's day, with the evidence pinned

| Stage | What they do | Emotion | Where it breaks | Evidence |
| --- | --- | --- | --- | --- |
| Open | Log in between meetings | Neutral → sharp drop | OTP / login failure | T6, 9 verbatims |
| Orient | Check the book, an AUM, a client | Confidence, **misplaced** | Totals silently incomplete | T1 |
| Decide | Read a number aloud, pick a move | Exposed — a client is listening | Allocation too coarse to act on | T5 |
| Execute | Place it, tell the client | Anxiety | No honest in-flight state | T2 |
| Account | Show what happened, when | Frustration | No ledger, no export | T4 |

---

## What Sentinel already answers, and what this study opens

**Answered, and now externally evidenced:** provenance under every figure (T1) · an outcome that
distinguishes what left from what did not (T2) · never restyle, and a version trail (T3) · saying plainly
what it cannot do rather than guessing (protect-themes).

**Opened by this study — three, in order of how much trust they carry:**
1. **Completeness, not just provenance.** Say what a total is a sum *of*, and what has not reported yet.
2. **The in-flight state of an instruction.** Between "Approve" and "placed" there is a state we have not
   designed, and it is the one that appears on a bad day.
3. **A money ledger and an export.** `DownloadAction` and `DataTable` exist; no screen uses them for this.

And one adjustment to a built screen: **the allocation is one level too coarse.** Our own ceilings are
written against caps (single fund 25%, small-cap sleeve 25%) that the allocation card never shows.

---

## Gaps only human research can fill, and the study I would run
Mining tells you what went wrong loudly. It cannot tell you what an advisor *does* in the ninety seconds
before a client meeting, whether they would approve a rebalance from a simulation they did not compute
themselves, or whether "I have not guessed the rest" reads as honest or as incompetent.

**Proposed:** six advisors, 45 minutes each, in their own office, between real meetings. Two tasks on the
built prototype — *explain Sharma's drift to me as if I were the client*, and *decide whether to approve
the two moves*. Measure: do they read the provenance line aloud unprompted; do they scroll back to check
the simulation before approving; and what they say when the artifact fails to load. That last one is the
only way to know whether our failure copy earns the trust it is designed to protect.

---

**Verbatims:** `studio/research/verbatims.csv` (60 rows · 22×1★ · 6×2★ · 6×3★ · 10×4★ · 16×5★).
Sources: [KFinKart – Distributor](https://play.google.com/store/apps/details?id=com.karvydistributor) ·
[AssetPlus – MF Partner](https://play.google.com/store/apps/details?id=in.assetplus.partner) ·
[Groww](https://play.google.com/store/apps/details?id=com.nextbillion.groww)
