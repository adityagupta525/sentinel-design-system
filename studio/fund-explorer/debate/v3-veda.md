# V3 — the studio's answer: the Auditable Shelf

**Author:** Veda, Design Director, Fable Design Studio · 22 Sep 2026

## Position

The explorer is not thin because it lacks a browse screen (V1) or a coexisting sheet (V2) — it is thin
because it has nothing durable to hand back, and nothing that lets an advisor show their work. V3 does
not add a bigger index of funds; it turns the shortlist into a **named, saved, auditable object** — tied
to one client's actual book, carrying its basis on its face, refreshable on a cadence — and gates its
copy hard by MFD/RIA mode. Entry stays chat-led, per the 19 Sep ruling; what changes is what a sentence
produces and where it lives afterward.

---

## The argument

**1. The biggest theme in the fresh research is not "no recommendation" — it is "got one, didn't trust
it."** T6, n=29, severity 4, the largest theme in Ira's report by a wide margin (`ira-insight-report.md`
§2): "DO NOT TRUST THE ANALYST RATINGS... it was BUY during 40 and still it is a buy" (INDmoney, 2★,
2026-06-25); "et money recommended me pgim elss mutual fund which are worst fund... I UNINSTALL" (ET
Money, 1★, 2026-06-16). §7 of the same report tests the stakeholder's complaint directly: *"Recommendation
nahi"* is "partly real, but inverted" — the majority of people who mention "recommend" got one and didn't
trust it. **So-what:** a variation that answers "no recommendation" by adding a louder recommendation
reproduces T6. The right target is T2 (n=23, sev 4, "which one is actually the best?") answered with an
**auditable** basis, not a push.

**2. The durable object every serious advisor tool has, and Sentinel doesn't, is a named shortlist that
changes on a cadence — not a bigger list.** Kabir §I.2 and §F.5: Tickertape lets a user save a screen with
a note ("Top 5 tax-saving ELSS funds"); Wealthy Select is "a monthly playbook of top-performing funds";
NJ's MARS produces the "NJ Recommended MF Portfolio." Kabir's own conclusion (§F.5): "the shortlist is the
durable object, not the query." Journey C re-sends a fresh table every turn (`00-current-state.md`); Noor
flags this by name as an anti-pattern (`noor-patterns.md`, Anti-patterns #2): "re-sending the list every
turn... Threads of stale tables are why '2–3 funds, bas' lands." **So-what:** the fix for "2–3 funds, bas"
is not more funds on screen at once — it's a shortlist that persists, has a name, and grows or changes
across sessions instead of dying with the thread.

**3. The advisor's real unit of recommendation is an allocation, not a fund.** Kabir §I.12: "Model
portfolios are the advisor's real unit of recommendation" — NJ, the largest MFD network in India, sells a
Recommended *Portfolio*, not a fund list; Wealthy sells a monthly *Select*; edge+ outputs allocation +
schemes under it. Neither V1's funnel-to-a-fund-page nor V2's coexisting fund list is built around this.
**So-what:** V3's shortlist object should be able to hold sleeves ("equity — flexi cap," "debt — short
term"), not just flat rows, because that is the shape the advisor already thinks in and the shape every
competing tool ships in.

**4. The one facet nobody in the market ships is free — Sentinel already has the data.** Kabir §I.6: "not
already held by this client" is shown by no product surveyed — not Morningstar's X-ray, not edge+'s
segmentation, not AssetPlus's CAS import. Sentinel reads the book already (`screens/data/book.jsx`). Ira's
T12 (n=14, MFD, confidence flagged low) is the adjacent pain: "Client also added with PAN but portfolio of
the client not showing... How this app supports MFDs, could not understand" (AssetPlus Partner, 1★,
2022-08-20). §3 PROTECT: "AI based features help me generate reports in seconds, saves [hours]" (Wealthy
Partner, MFD, 5★) — the reverse lookup is exactly this kind of time-saver. **So-what:** "Held by R. Sharma
· 4.2%" on a card is this product's one uncontested edge, and it should be the first line of the shortlist
object, not column three of a table (`00-current-state.md`'s own framing).

**5. MFD and RIA are not two skins on one screen — they are a hard mode switch that changes what is legal
to say.** Anaya §4.3, citing IA Reg 22(3): "a client is either advisory or distribution within the group,
never both." §4.1–4.2's build table: MFD sees Regular plan + commission disclosure + "match your filters"
copy + no auto-ranking; RIA sees Direct plan + suitability trail + AI-use disclosure (Reg 18(9)) + advice
copy. This is per-*client*, gated by the advisor's own registration and the client's engagement type, not
a settings toggle a user flips. **So-what:** V3's shortlist object carries its mode as a property, and the
copy engine reads it — the same underlying data renders as "Funds that match your filters" in MFD mode and
"Suggested for Amit — suitability on file" in RIA mode.

**6. A proprietary score is not a design decision — it's an unresolved compliance liability.** Anaya §2.4:
a ranking is a research report under SEBI's RA Regulations; the Fifth Schedule bars rankings in
advertisements outright; an RIA showing one to a client needs a documented process and a signed rationale
(Reg 17(b), 19(f)). `00-current-state.md` is blunt: the Centricity Fund Score's weights are invented and
the card says PLACEHOLDER twice. Anaya's own open item O2: "which registered entity owns a proprietary
Fund Score and where it may be shown" is unconfirmed. **So-what:** V3 does not lean on the score as its
trust mechanism. It leans on **provenance and peer context** instead — Kabir §F.1: "the best retail
explorers give every fund a peer context on arrival... A fund shown alone is a number; a fund shown with
its category median is a judgement." That's a factual comparison, not a ranking, and it doesn't wait on O2.

**7. The data contract is the actual ceiling, and it is asset-class-specific.** `00-current-state.md`: ten
funds, nine fields, zero non-MF rows, five honest facets. Anaya §3 gives the real per-class screen: bonds
need issuer/rating-with-agency/YTM/tenure/payout frequency (OBPP Annex B, §3.2); PMS needs
strategy/manager/TWRR-vs-APMI-benchmark/fee-with-HWM (§3.3); AIF needs category/commitment/drawdown/target
IRR "as per PPM," never our number (§3.4); GIFT needs currency/scheme-type/LRS-consumption (§3.5). §3.8:
"'Returns' cannot be one column in a cross-asset table" because the performance *basis* differs by law
(CAGR vs TRI for MF, TWRR vs APMI benchmark for PMS, IRR with an agency report for AIF, YTM — not a return
at all — for bonds). **So-what:** V3 names its data contract per asset class up front (§ "What it needs")
rather than drawing a shared card and hoping the data catches up, which is exactly the mistake
`00-current-state.md` diagnoses in the current build.

---

## Personas

Behavioural, grounded in Ira's file, with the advisor-side confidence limit stated plainly: only 26 of 231
verbatims (11.3%) are MFD/RIA/HNI, so both personas below are directional, not sized.

**Rakesh, the MFD generalist (primary — n=14 MFD verbatims, confidence: pattern visible, not sized).**
Reviews a client's book before he calls them, not during. Wants the holding and the commission math
visible without opening a ticket. Distrusts being steered toward self-investing or upsold into PMS without
being told the fee difference (Dezerv verbatim, §T6: "Dezerv will call you for MF portfolio review and pull
or trap you to move to PMS"). Wants research that backs *his own* call to the client, not an app that
recommends to the client over his head — the same instinct PROTECT §3 captures in "the fund recommendations
by scripbox are really good if you are not into exploring... yourself" and "expert research support...
provides the necessary data to support my recommendations" (Wealthy Partner, 5★). His anxiety is looking
uninformed in front of a client who is often on the call while he is in the app.

**Priya, the hybrid RIA (secondary — n=4 RIA verbatims, confidence: very low, flagged as directional
only).** Operates under Centricity's dual registration; the client in front of her today is fee-only, so
the product must show Direct plans, a suitability trail, and the AI-use disclosure Reg 18(9) requires, none
of which apply to Rakesh's client an hour earlier. Her single verbatim of note is the benchmark complaint
(T8: "Still showing outdated BSE benchmarks while 99% of equity mutual funds track NSE," Value Research,
1★, RIA) — she notices unit and source errors the moment they appear, because her registration makes her
personally liable for the rationale she records.

A third figure, not a persona but a constraint on both: **the client on the call.** Kabir's advisor-tool
notes (§B) and Wealthy's own "proposal shared in seconds on WhatsApp" pattern imply the advisor is often
composing the shortlist *while* a client is present or waiting — which is why the shortlist has to be
readable aloud, and why "recommended for you" as an auto-label is a real professional risk to Rakesh, not
an abstract compliance rule.

---

## The journey

1. **Entry — chat, unchanged.** Rakesh types "flexi cap under 0.7% for Sharma" or taps a starter. Same
   composer, same router bucket 3, per `docs/APP-PLAN.md` §3. No new screen at this step.
2. **Narrow — facets shown as chips, vocabulary chosen by asset class.** The sentence becomes removable
   chips (Journey C's own mechanic, kept). For MF: category (2026 SEBI list), bucket, shelf, riskometer,
   TER band. For a bond ask: rating band, YTM band, tenure band — a different card shape entirely (Anaya
   §3.8, claim 7).
3. **Shortlist forms — and this time it has a name and a peer line.** Each row carries one verdict
   sentence, category-median context (claim 6), and — first line, not column three — "Held by R. Sharma ·
   4.2%" when true (claim 4). The whole object gets a name ("Sharma — flexi cap, under 0.7% · 22 Sep") the
   moment it is saved, unprompted the first time, one tap thereafter.
4. **It persists — reachable from the Drawer, not re-typed next session.** A new Drawer section, "Saved
   shortlists" (claim 2), alongside Jump-back-in / Recent / Clients. Opening it re-opens the object at its
   current state, with a "refresh" affordance that re-runs its filters against today's data — the cadence
   Tickertape and Wealthy Select both have and Sentinel doesn't.
5. **Compare / overlap — capped at the industry ceiling, in words.** Two to four funds, verdict sentence
   first (claim 6), then the two-column table Sentinel already has; overlap speaks Dezerv's bands
   ("Significant overlap — reduced diversification") using SEBI's own ∑min(w) method (Anaya §1.12), with an
   em dash and a stated reason when there's no holdings feed — never a zero.
6. **Fund or sleeve page — one scroll, asset-native fields.** `InfoCard`/`ChartLine`/`DataTable` already
   exist; the page adds the mandated set per Annexure 12A (riskometer with as-on month, plan label, TER
   with as-on date, exit load) and, for a sleeve view, the allocation-level page Kabir §I.12 argues for.
7. **Back / what-if.** Any chip is editable in place (owner's standing requirement); reverting the
   shortlist to a prior save appends a version rather than destroying one, matching the going-back layer
   already built (`docs/CONTINUE-HERE.md` §0, "revert APPENDS"). "What if" is the same simulation language
   Journey B/E already use for a rebalance, applied here to "what if I drop the TER cap."
8. **Share.** The saved object becomes a proposal artifact — MFD copy: "Share factsheet & SID"; RIA copy:
   "Send advice note" with the recorded rationale attached (claim 5, Anaya §4.1–4.2's CTA tables verbatim).

---

## What it needs

**Data, named per asset class before any screen is drawn (claim 7):** MF — category (2026 vocabulary),
AUM, TER with as-on date, 1/3/5Y CAGR vs Tier-1 TRI benchmark, riskometer + PRC (debt), portfolio overlap
(SEBI method). Bonds — issuer, rating + agency + date, YTM, tenure, payout frequency, secured/unsecured.
PMS — strategy/APMI tag, TWRR vs APMI benchmark, fee with HWM. AIF — category, commitment, drawdown
schedule, target IRR "as per PPM" only. GIFT — currency, scheme type, LRS consumption. Today's book
supplies none of these beyond five MF facets — this is the honest ceiling, not a screen problem.

**Components — mostly reuse, three genuinely new:** `PeerContextLine` (category-median sentence, claim 6);
`SavedShortlist` (the persistent, named, versioned wrapper — the one structurally new piece); a `ModeStrip`
that reads MFD/RIA off the client record and swaps CTA copy per Anaya's tables. Everything else —
`InfoCard`, `DataTable`, `OverlapView`, `Dumbbell`, `ResultCard`, `VersionRow`, `StandingDisclosure` —
already exists and is ahead of the data, per `00-current-state.md`.

**Screens — one addition, not a new paradigm:** a "Saved shortlists" section in the Drawer. Entry, narrow,
shortlist, compare and fund page all stay inside the thread/artifact pattern the 19 Sep ruling already
allows. No funnel screen, no persistent browse canvas.

---

## Where it is weakest

**It may not look different enough.** The owner's brief demands variations that are "genuinely different
yet each a big improvement." V1 and V2 both change the *surface* dramatically — a funnel, a rising sheet.
V3 changes the *object model* underneath a surface that still reads, at a glance, like Journey C's existing
chat pattern. Unless the shortlist card gets a visibly different treatment (a name, a version count, a
refresh affordance on its face) it risks reading as "Journey C plus a save button" rather than a real third
variation — a critic will say this, and the answer has to be a strong visual spec for the saved-object
card, not an assertion that the architecture is enough.

**The trust mechanism leans on peer context and provenance, and neither is fully cleared.** Category-median
comparison sidesteps the ranking question (claim 6), but Anaya's O1 ("whether ¶19.10.4 applies to
Centricity's regular-plan explorer by analogy") is still open — if compliance says yes, even a
category-median sentence needs a methodology note.

**The persistence model is new product behaviour, not just a new screen.** Every other Sentinel artifact
today is thread-scoped. A shortlist that survives across sessions and re-runs its filters on a cadence is
a capability this product has never had, and its cost is closer to a data-layer decision than a UI one.

---

## Three challenges I expect

**"This isn't an explorer, it's plumbing — where's the screen the stakeholder can point at?"** The
stakeholder's complaint was never really "there's no index page" — `ira-insight-report.md` §7 shows the
"organized journey" complaint is only partially testable and the strongest adjacent evidence (T9) is about
a *stable, walkable hierarchy*, not a browse grid. The Drawer's "Saved shortlists" section is that walkable
hierarchy, and it's the one new screen V3 asks for — deliberately small.

**"You're dodging the V1-vs-V2 argument by inventing a third axis."** Yes, by the brief's own instruction
not to split the difference. The evidence hands three candidates that neither funnel framing nor sheet
framing is built around — T6 being the largest theme, the durable-object pattern in every competing tool,
and the free "not already held" edge — and V3 is built to centre those, not to average V1 and V2.

**"Where is the recommendation the stakeholder actually wants?"** Anaya §2.1 is explicit that the verb
*"recommend"* is not banned outright for an MFD giving incidental, appropriateness-based advice — what's
banned is auto-ranking and treating advice as the primary service. V3's answer is a ranking the advisor can
audit (category median, held-by-client, overlap band) rather than a label the product applies unilaterally
— which is the shape T6's victims were missing and PROTECT's fans were praising when they said they trusted
"data to support my recommendations," not the app's own pick.
