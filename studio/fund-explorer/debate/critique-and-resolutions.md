# The debate, judged — critique and resolutions

**22 Sep 2026.** Three seats argued three variations from the same evidence base (Kabir's teardown,
Noor's patterns, Anaya's compliance brief, Ira's 231 verbatims, 66 reference screens). This file is
the crit: where each argument holds, where it does not, what the disagreements actually were, and
what was resolved versus what is the owner's to rule.

Each advocate declared their own weakest point, and each was honest. What follows is what they did
**not** catch — the findings that only appear when the three arguments are read against each other.

---

## Finding 1 · Two of the three variations do not answer the biggest theme at all

Ira's largest theme is **T6, n=29, severity 4: people who *got* a recommendation and did not trust
it** — stale ratings, redeemed units counted as returns, a portfolio review that turned into a PMS
upsell. It is bigger than the next theme by six verbatims and it sits at the journey's low point
(Ira §5: "the curve bottoms at **Decide**, not Search").

- **V1's answer to T6** is that the list is sorted by a column the advisor picks, never by a
  proprietary default. That is a *compliance* answer — it keeps Sentinel on the legal side of
  ¶19.10.4 — but it is not a *trust* answer. Nothing in V1 gives the advisor something to show the
  client and say "this is why."
- **V2's answer to T6** is, in Noor's own words, "closed less by the sheet than by *what the sheet is
  not*." An argument from absence. A filter rail does not make a number believable.
- **V3 is the only argument built on T6**, and it is right to be.

**Resolution.** T6 is not a variation-level concern, it is a product-level one. **Whichever surface
wins, the shortlist must carry its basis on its face** — peer context ("rank n of N in category",
"vs category median"), provenance ("as on 31 Aug 2026 · AMFI"), and a withheld score with a stated
reason rather than an invented number. This is now a requirement on all three, not V3's advantage.

## Finding 2 · "2–3 funds bas" is the one complaint no variation can fix

Ira, §7: the complaint has **no literal verbatim** in 231 rows. Its evidenced content is T1 + T2 + T3
+ T5 — 84 verbatims — all of which are about *depth per fund*, not count on screen. And
`00-current-state.md` measures the depth: **10 funds, 9 fields, zero non-MF rows**, with fund
performance, TER, AUM and holdings overlap all deliberately unknown.

All three advocates name this. None of them can design past it. Aarav: "Without these, step 3's
'sort by TER' and step 7's fund page cannot render honestly." Noor: "V2 ships MF-only at launch no
matter how good the mechanic is." Veda: "this is the honest ceiling, not a screen problem."

**Resolution.** The data contract is **not part of the variation choice** — it is the precondition
for any of them. It is sequenced first in the plan, and no variation is shown to a stakeholder
without the line that says so. Drawing a five-asset explorer over a ten-row MF book is how the
current explorer got rejected in the first place.

## Finding 3 · V3 is not a third surface — it is the layer V1 and V2 are both missing

Read side by side, the three arguments are not three answers to one question. They are answers to
three different questions:

| Layer | The question | Whose argument |
| --- | --- | --- |
| **Data** | What can we honestly say about a fund, a bond, a PMS? | Nobody's — it is the shared ceiling |
| **Object** | What does a sentence *produce*, and does it survive the session? | V3 |
| **Surface** | Where does the advisor stand while they work? | V1 (funnel) vs V2 (sheet) |

V1 and V2 both leave the object model exactly as Journey C has it — a table re-sent per turn, dead
when the thread scrolls. Noor flags this as an anti-pattern **in his own research file** and then
argues V2 fixes it ("one artifact, mutated") — which is true, and is V3's point arriving in V2's
clothes. V1 does not fix it at all: four stacked artifact levels is four times the staleness.

**Resolution.** V3's object model — a **named, saved, versioned shortlist tied to a client** — is
promoted out of the variation set and into the shared requirement set. The genuine fork the owner
must choose between is **V1's funnel versus V2's sheet**. V3 still ships as a third option to
stakeholders, because it is the one that can be built on the smallest data contract and the one that
answers the complaint most directly — but it should be presented as *"the object model, with chat
entry unchanged"*, not as a rival surface.

## Finding 4 · V1's "it is not a screen, it is stacked artifacts" does not survive contact

Aarav keeps V1 inside the 19 Sep ruling by making every funnel level an artifact in the thread that
replaces the last. Two problems, neither of which he raises:

1. **A funnel's whole value is knowing where you are.** Noor's own evidence says the path shows as
   *chips on the list head* (Coin, Groww, One Digital) — which works for **two** levels. At four,
   with each level replacing the last in a scrolling thread, the advisor cannot see the structure
   they are supposed to be able to point at in front of a client. That is V1's own stated reason for
   existing, removed by V1's own architecture.
2. **His mitigation collapses the variation.** Aarav's honest fallback is "collapse asset+product
   into one screen for MF-only sessions... to get back to two." Day one is MF-only. So V1 on day one
   *is* the two-level pattern — which is much closer to V2's full detent and V3's chip row than the
   argument implies.

**Verified, and it cuts the other way too:** the 19 Sep line — *"there is no explorer screen, because
there is no canvas"* — is a **description of what was built**, not a prohibition. `design-system/
components/shell/` ships `ScreenScaffold`, `ScreenStack`, `ScreenBackdrop`, `Drawer`, `TopBar`. A
screen is architecturally available. What does not exist is a **Canvas** surface (removed in v5). So
V1 does not need the stacked-artifact dodge — it may simply ask for a screen. **Owner's call.**

## Finding 5 · V2's strongest claim is a re-reading of an owner ruling, not a finding

Noor's claim 6 reinterprets *"nothing pinned above the composer"* as "a rule about silent chrome, not
about a summoned surface with its own dismiss." The reasoning is good — the 18 Sep ruling did kill
`Dock.chips`/`Dock.cta` because they sat there unasked — and the `ConfirmSheet` precedent is real.

But an advocate re-reading the owner's ruling to permit their own design is the one move a crit must
stop. **This is not resolved by argument. It is the owner's to rule**, and it is listed as such in the
plan. If the answer is no, V2's three-detent sheet loses its full detent and possibly its half.

## Finding 6 · Nobody costed the gesture risk honestly enough

Noor names it: drag-to-collapse on the sheet competing with scroll-to-read on the thread, at the same
gesture origin; an advisor mid-client-call losing the thread because a sheet rose over it uninvited;
no Sentinel precedent for a non-modal sheet's reduced-motion and screen-reader behaviour. He proposes
folding the test into Ira's MFD study.

That is the right test and the wrong order. Ira's study needs a working prototype; V2's mechanic has
**no incumbent anywhere** (Mobbin returned zero screens for a browse sheet over a live chat; the
closest relatives are Rufus inverted, Maps over a canvas, Spotify inside one thread). **A driven HTML
prototype of the three detents must exist before V2 is designed, not after** — this repository's own
standing rule is that a finding you did not see did not happen, and F-80 is the proof of what a
plausible-looking interaction hides.

## Finding 7 · The advisor's unit is a portfolio, and all three ship a fund

Kabir §I.12, from the largest MFD network in India: NJ sells a *Recommended Portfolio*; Wealthy sells
a monthly *Select*; Prudent's edge+ outputs an allocation with schemes under it. "The advisor's unit
of recommendation is a portfolio, not a fund."

V1 admits this and calls itself "the shelf a future portfolio-composer would draw from." V2 does not
address it. V3 gets closest — its shortlist object "should be able to hold sleeves" — but does not
carry it into the journey.

**Resolution.** Out of scope for this round, recorded as the next question. The explorer feeds the
proposal (Journey D) and the rebalance (Journey E), both already built. **The shortlist object should
be designed so a sleeve is a later container around it, not a rewrite** — that is a cheap constraint
to honour now and an expensive one to retrofit.

---

## The disagreements, and where each landed

| # | The disagreement | Positions | Landed |
| --- | --- | --- | --- |
| 1 | Does an explorer need a screen? | V1: no, stacked artifacts · V2: no, a sheet is chrome · V3: no, a Drawer section | **Open — owner's call.** Screens exist in the shell; the 19 Sep line described the build, it did not forbid one |
| 2 | Does more structure reproduce T6? | V1: no, advisor-chosen sorting is legal · V3: any ranking without visible basis reproduces it | **V3.** T6 is about basis, not about the presence of a list. Basis-on-the-face becomes a requirement for all three |
| 3 | Sheet, or a surface that stays? | V2: sheet — "stays" has no mobile precedent and is a tab in a product that ruled out tabs | **V2's reading accepted.** `docs/APP-PLAN.md` §3 is explicit: no tab bar, and it will not grow one |
| 4 | Is "nothing pinned above the composer" violated by a summoned sheet? | V2: no, the ruling was about silent chrome | **Open — owner's call.** An advocate may not re-read a ruling into permission |
| 5 | Two levels or four? | V1: four, because five asset classes · Noor's evidence: every precedent stops at two | **Two, plus asset-class segmentation.** One Digital's own Explore segments rather than nests; Kabir §0.4 says the vocabularies do not merge |
| 6 | Is the score the trust mechanism? | V1: one optional column · V3: no — peer context and provenance instead, the score is an unresolved liability | **V3.** Anaya §2.4: a proprietary score is a research report needing a registered owner and a published methodology. Blocked on a compliance answer, so it cannot be the trust mechanism |
| 7 | Compare: how many on a phone? | All three cite NN/g's cap | **Two side by side**, third as "+1 more"; three or more becomes a ranked list on one metric |
| 8 | Fund page: tabs or scroll? | Noor §C: NN/g is explicit that tabs tax cross-reference tasks | **One scroll with a sticky section strip**, accordions for prose only — One Digital's own shape |

## What no seat could settle, and who owns it

| Question | Owner | Why it blocks |
| --- | --- | --- |
| May the explorer have a screen? | **Ashish** | Decides whether V1 is a funnel or a stack of artifacts, and whether V2's sheet is even needed |
| Is a summoned sheet "pinned above the composer"? | **Ashish** | Decides whether V2 has three detents or one |
| Who owns the Centricity Fund Score, and where may it be shown? | **Compliance** (Anaya's O2) | The score cannot be a sort column, a badge or a headline until this is answered |
| Does ¶19.10.4 apply to a regular-plan explorer by analogy? | **Compliance** (Anaya's O1) | Decides whether even a category-median sentence needs a methodology note |
| Which asset classes ship first, and who supplies the feed? | **Ashish + data** | The explorer is bounded by this, not by design |
