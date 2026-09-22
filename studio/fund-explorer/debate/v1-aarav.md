# V1 — the smart guided journey · argued by Aarav

## Position

An advisor's job is not to answer one question well; it is to hold a structure in their head that they
can walk in front of a client, point at, and defend — "we looked at flexi-cap, narrowed to three, ruled
two out on TER, this is why." A sentence is an accelerator inside that structure, not a replacement for
it: nobody has shipped a chat-only surface that lets an experienced user do that (Noor's Mobbin search for
"a browse sheet over a live chat" returned zero screens). V1 gives the advisor the walkable structure the
evidence says is the actual missing thing, while using chat to shorten every step of it. It is weaker than
a chat-first answer exactly where chat is genuinely faster — one already-known fund, one already-known
comparison — and I say so below rather than hide it.

## The argument, as numbered claims

**1. Every finance app that survived contact with real users gets to a list in two levels, and V1 is that pattern, not an invention.** Zerodha Coin (Explore → category → "1,731 funds"), Kuvera (category grid → list), and Centricity's own One Digital ("Choose your exposure" → chips → "1,739 sorted by") all do asset/category → counted list in two taps (Noor §B, "What the funnels agree on," point 1). Quiz products that narrow further (Nike, Warby Parker, Sephora) still land on a **shortlist of three to five**, never fewer, never a single answer except Wealthfront's robo case — which Noor's own anti-pattern list flags as *wrong for an MFD* precisely because "recommend" is regulated (§B anti-pattern 6). V1's asset → product → category → list is this same shape, one level deeper because Sentinel is five asset classes wide where every cited precedent is one.

**2. The "2–3 funds bas" complaint has no literal verbatim in Ira's 231 rows — it is a proxy for four separately-evidenced themes, and V1 is aimed at exactly those.** Ira states this directly: "not literally evidenced… the underlying need is strongly evidenced… T1, T2, T3, T5 together (84 verbatims, the four biggest non-trust themes)." T2 "which one is actually the best?" (n=23, sev 4) is a request for an *in-category ranking the user can audit*, not a single recommended answer — which is what a discovery-page-into-compare gives and a bare chat card does not. T5 "I can't filter for what matters to me" (n=20) is a request for facets deep enough for real constraints — V1's filter sheet at each funnel level, not three chips. T3 "I can't put two funds side by side" (n=19) is answered directly by V1's compare step. None of these four themes is answered by making the sentence smarter; all four are answered by giving the sentence somewhere structured to land.

**3. Kabir's peer-context finding is the strongest single piece of evidence for V1's spine.** "The best retail explorers give every fund a peer context on arrival — INDmoney ranks a fund inside its SEBI category; Groww's fund page has 'Returns and Rankings' against category average; Kuvera opens Comparison pre-filled with four category peers… Sentinel's 2–3 cards had no peer context, which is why they read as 'numbers thrown at you'" (§0.2). Peer context requires a *category* to be peer against — a bare chat card holding one or two funds has nothing to rank inside. V1's product → category step is not decoration; it is the object every "rank n of N" line needs to exist.

**4. Intent tiles are the compliant, evidenced way to make V1's first step feel like a sentence without becoming one.** GoldenPi's four purpose tiles ("Highly Rated," "Maturing within 3 Years") and Paytm Money's investment ideas are, in Kabir's words, "a pre-filled filter set with a name, so the first screen is a sentence, not a form" (§F.2). This is the one guided pattern Kabir found *living inside* a screener rather than bolted on as a separate quiz (§H: "ten of eleven guided paths are separate surfaces from the screener… GoldenPi's purpose tiles are the exception"). V1's asset-class and category chips are built the same way: each tap is a named, pre-filled filter, functionally identical to typing the equivalent sentence — so V1 does not compete with the chat parser, it is a second door onto the same nine verbs.

**5. Compliance draws V1's funnel a specific, legal endpoint, and it is not "the best fund."** Anaya §2.1 is unambiguous for MFD mode: "Recommended for you," "Top picks," "Best funds" as *automatic* labels on a list read as ranking, which Fifth Schedule (b) and ¶19.10.4 forbid outright. The regulator's own test is whether the criteria are **investor-chosen** (filtering — permitted) or **auto-displayed** (ranking — not). V1's funnel is built entirely from advisor-chosen taps and typed refinements, so it clears that test by construction, provided the copy obeys it: the funnel ends in **"14 funds match Flexi Cap · under 0.7% TER"**, sortable by a column the advisor picks — never in a system verdict. The Fund Score becomes one optional, withheld-when-thin sort column among several, not the list's reason for existing. Where an advisor does want to flag a fund for a specific client, the correct copy is Anaya's "Suggested for `<client>`" — gated on an appropriateness record — not a badge on the general list.

## The journey, step by step

1. **Entry.** Composer plus the empty state's intent tiles (asset class, or a GoldenPi-style named filter — "under 0.7% TER, on your shelf"). Tapping a tile sends the same sentence a typed query would; typing always works instead.
2. **Narrow.** Asset class → product/category, two taps, matching the universal two-level pattern (Noor §B). Each tap is a chip in the thread, removable, exactly as Journey C already does with typed filters.
3. **Shortlist.** A counted, sortable `DataTable` artifact — "14 funds match…" — with peer context per row (rank or vs-category line) and the held-by-your-clients badge in the lead column, not column three (Kabir §I.6, the product's real edge, currently buried).
4. **Push on a ratio or number.** Tap a column header, or type "sort by TER" / "only AA and above" — the same nine-verb parser refines the artifact **in place**, never resending it as a new message (Noor's anti-pattern 2, which Journey C already commits today).
5. **Compare 2–3.** `ComparePicker` from the shortlist into `CompareTable`, capped at **two** columns on a phone with a "+1 more" affordance, verdict sentence above the grid before the numbers (NN/g's mobile cap; INDmoney's pros/cons pattern — Noor §D).
6. **Overlap.** `OverlapView`, SEBI's own ∑min(w) method, spoken in Dezerv's bands ("significant overlap — reduces diversification") rather than a bare percentage — for MF/PMS pairs only; every other asset class gets the reason in words, never a zero (Anaya §3.8.3).
7. **Full fund page.** Fixed top block (name, category, headline number, chart) then one scroll with a sticky section strip for numbers, accordions only for prose — the hybrid Noor's evidence favours and Centricity's own One Digital app already uses (§C). Annexure 12A's list is the floor: manager, objective, performance-with-source, min/AUM/NAV/exit-load/TER, riskometer (Anaya §1.1).
8. **Tutorial.** An inline "what does TER mean" chip opens `ExplainerSheet` **closed by default** (the standing mount rule) — never leaves the page underneath it.
9. **Score.** One sortable, optional column; withheld with a stated reason when inputs are thin — the product's existing, correct instinct (00-current-state.md).
10. **Back / what-if.** Swipe or type "go back" pops the last artifact, Raycast/Rufus-style, not a screen route. "What if I widen it" relaxes one filter in place and re-renders the same artifact, Redfin-style, rather than starting over.

## What it needs

**Data**, per asset class, none of which exists today beyond a partial MF set:
- **MF (closest to buildable):** book.jsx has category, bucket, riskometer, exit load, on-shelf — it is missing **TER, AUM, 1/3/5Y CAGR vs Tier-1 TRI benchmark, riskometer as-on date, PRC cell for debt** (00-current-state.md; Anaya §3.1, §1.2–1.4). Without these, step 3's "sort by TER" and step 7's fund page cannot render honestly — they would have to say so in words, which defeats the point of a guided journey.
- **Bonds, PMS, AIF, GIFT:** zero rows exist (00-current-state.md: "Multi-asset: zero rows"). Each needs its own facet contract before its funnel level can exist at all — bond cards need rating+agency, YTM, coupon, tenure, payout frequency; PMS needs strategy, manager, AUM, TWRR vs APMI benchmark; AIF needs category/lock-in/PPM-sourced target IRR; GIFT needs currency, scheme type, LRS eligibility (Anaya §3.2–3.5). These vocabularies do not merge into one card — Kabir's finding that no multi-asset platform blends them (§0.4) is a hard constraint, not a preference.

**Components**, ahead vs. behind:
- Already ahead of the data: `DataTable`, `CompareTable`, `OverlapView`, `Dumbbell`, `ComparePicker`, `FundCompare`, `ResultCard` (00-current-state.md).
- Missing: an intent-tile grid (asset/category chips with counts, Baymard's highest-impact filter fix — Noor §E); a sticky section-strip for the fund page; one card template per asset class (bond card, PMS card, AIF card, GIFT card, unlisted card) — five new card contracts, not one generic one.

**Screens:** formally none — every funnel level ships as a stacked artifact in the thread, consistent with the 19 Sep ruling (see below). Practically, six new spec pages: intent tiles, shortlist table, compare, overlap, fund page, tutorial sheet.

## Where it is weakest

**It ends in a fund, not a portfolio.** Kabir's clearest finding about advisor tools is that "the advisor's unit of recommendation is a portfolio, not a fund" — NJ's largest network sells a Recommended Portfolio, Wealthy sells a monthly Select, not a fund list (§I.12). V1, as framed by the owner, is a fund screener and fund page; it does not compose a sleeve or an allocation. My honest answer is that V1 is not the whole product — it is the shelf a future portfolio-composer would draw from — but that composer is out of scope here, and a critic is right to call V1 incomplete on this axis alone.

**The fourth level is untested.** Every precedent Noor found tops out at two levels before a list (§B). V1 needs a third and fourth for a five-asset-class product that no single-asset competitor had to solve, and nothing in the evidence proves advisors tolerate that extra tap. The honest mitigation: collapse asset+product into one screen for MF-only sessions (Centricity's day-one majority) to get back to two, and test the four-level path only for advisors who actually cross asset classes.

**The stacked-artifact architecture that keeps V1 off a canvas has no direct precedent either.** Noor's search for "a browse sheet over a live chat" found nothing on Mobbin; the closest relatives (Rufus, Spotify Prompted Playlists) are single-object refinement, not a four-level funnel of replacing cards. I am proposing a pattern, not citing one.

## Three challenges I expect, and my answer

**"This is the explorer screen the 19 September ruling forbade."** It is not a screen route; it is a sequence of `DataTable`/`ResultCard`-class artifacts, each replacing the last in the thread exactly as Journey C's current shortlist does, with "back" popping an artifact rather than navigating history. If a reviewer still finds four stacked artifact levels indistinguishable from a canvas in practice, that is the one point where I would ask the owner to revisit the ruling explicitly — because Coin, Kuvera and One Digital all prove that a two-level, category-then-list structure is what makes "findable" mean something to an advisor (Ira's T9, n=17), and no cited product carries five asset classes' worth of facets in a single turn without one.

**"A sortable, categorised shortlist is a recommendation engine with extra steps — T6 (n=29, the single biggest theme) all over again."** The list is sorted by a column the advisor picks, never by a default proprietary rank exposed as the page's reason for existing; the score is one optional, withheld-when-thin column, not the headline. This is precisely the ¶19.10.4 line Anaya draws between investor-chosen filtering (permitted) and auto-displayed ranking (not) — V1 is built to sit on the legal side of it by construction, not by copy alone.

**"You're specifying a journey the book can't run — four of five asset classes have zero data."** True, and I am naming it rather than drawing over it, per the brief's own rule. The sequencing this implies: ship the MF funnel first, with TER/AUM/performance added to the data contract before step 3 goes live; gate every other asset tile with the product's existing honest pattern — say so in words — rather than showing an empty list that reads as a bug.
