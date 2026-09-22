# V2 — the discovery sheet that coexists with chat

**Noor · Inspiration Scout · 22 Sep 2026.** Arguing for V2, as the owner framed it: *"poora fund
explore page bottom se upar hokar aaye ya screen pe hi rahe."* Building on `research/noor-patterns.md`
(mine) rather than repeating it — every board number below is read from `refs/mobbin/mobbin-index.md`
and `refs/index.md`, not recalled.

## Position

V2 is a **sheet**, not a screen that stays. It rises over the Thread on any funds-bucket query, at
three detents that never take the composer or the last line of conversation with them. One artifact
lives in it at a time — the same shortlist Journey C already computes, now given room instead of a
table squeezed into a turn. Its cost is real and specific: this exact mechanic has no verified
precedent anywhere I could find, and building it is the biggest lift of the three variations.

## The argument

**1. The sheet form wins because "stays on screen" has no mobile precedent and no home in this
architecture.** Kayak's Ask AI is the only product that keeps chat and a live results page as two
first-class regions — and its own newsroom post and TechCrunch's coverage describe desktop and mobile
web without ever describing the mobile *layout* (`research/noor-patterns.md`, row A1). Sentinel has
five surfaces — Home, Thread, Journey rail, Drawer, Confirm sheet — and an explicit rule against a
sixth: *"the thread is the surface, and everything else is reached from it or from the menu... no tab
bar and will not grow one"* (`docs/APP-PLAN.md` §3). A persistent explorer that "stays on screen" is a
tab in a product that has just ruled tabs out. A sheet is not a new surface at all — it is a state of
the Thread, closer kin to `ConfirmSheet` and `ExplainerSheet` than to Home or the Drawer.

**2. The sheet grammar already exists, proven at scale, and Sentinel has the closest thing to it in
its own product.** Google Maps' results sheet runs three visible states — peek (a summary height),
half (a list), full — over a map that "remains fully interactive with no scrim" (board #33–35).
Amazon Rufus mirrors the exact inversion V2 needs: a sheet rises from the search bar over the store,
carries its own input at its foot, and a grabber at the top means swipe-down is back (board #30–31);
the product card inside stays reachable with the input still live beneath it (board #32). Airbnb's
filter sheet answers the "how much does the sheet cost the thumb" question with a live count on its
own commit button — "Show 1,000+ places" tightening to "Show 45 homes" as filters apply (board
#36–37). None of these is finance, and none is Sentinel's colour or type — what transfers is the
*mechanic*: non-modal, three detents, a live count, a composer that is never covered.

**3. Best Buy's filter panel is the counter-example that proves the sheet, not a shelf, is the right
container.** Best Buy drops its filter panel *under the chip row* rather than opening a sheet — "Filter
panel drops under the chip row (not a full sheet), 'See 67 results'" (mobbin board #19). That is the
"stays on screen" form in miniature, and it works there because Best Buy's filters are one product
category with one column set. Sentinel's V2 has to hold funds, bonds, PMS, AIF and GIFT City with
different fields and different risk pictograms (claim 6, below) — a panel that drops in place has
nowhere to put five different column sets without becoming its own scroll-fight with the thread above
it. A sheet with its own scroll region keeps that fight contained.

**4. The detents map onto what an advisor actually needs at each moment, not onto arbitrary heights.**
*Peek* — the count and the top three rows, the same economy as Rufus's closed grabber and Maps'
"40 places to stay" count riding in the sheet head with structured fields as chips (board #34). *Half*
— the shortlist as `DataTable`, `FUND_COLUMNS`, exactly what `FundResults` in `screens/journey-c/
funds.jsx:770` already renders, just given a sheet instead of a turn. *Full* — the list plus the filter
rail, matching Zerodha Coin's full-screen filter sheet with its live "View 1,731 funds" button (`refs/
index.md` #05–06) and Airbnb's histogram-and-steppers rail (board #37). Nothing here is invented; every
detent already ships somewhere.

**5. "Back" is swipe-down, and it is the one gesture every cited product agrees on.** Rufus: "swipe
down to send the chat dialog box back to the bottom" (`research/noor-patterns.md` row A2). Maps:
"drag down from the top of the scroll collapses." Raycast/Linear's command-palette convention — pop a
level on an empty input — is the desktop cousin. None of them re-open a new surface to go back; they
collapse the one that is already open. V2's back is therefore **one rule, three steps**: full → half
(drop the rail, keep the list) → peek (drop the list, keep the count) → gone (thread fully visible,
composer where it always was). No new screen is ever pushed, so there is nothing for `ScreenStack` to
manage and nothing for `report:parallel` to count — the sheet is chrome on the Thread, not a sixth
surface, exactly like `ConfirmSheet` is chrome on a journey rather than a surface of its own.

**6. Nothing pinned above the composer, read correctly, is a rule about silent chrome, not about a
summoned surface with its own dismiss.** The 18 Sep ruling killed `Dock.chips`/`Dock.cta` because they
sat permanently above the composer whether or not the advisor asked for them
(`docs/CONTINUE-HERE.md:355`). V2's sheet is the opposite: it opens only when a funds-bucket query
fires, it never covers the composer (peek height leaves it and the last thread line visible, the way
Maps' canvas stays interactive behind its sheet), and — following the `ConfirmSheet` precedent, which
"shows a visible dismiss beside the commit" because the archive's version offered only a scrim
(`docs/CONTINUE-HERE.md`, Journey B entry) — it always carries an explicit close. One door opens it:
a funds-bucket query, the router's existing bucket 3. No second icon, no redundant browse button —
that is what "one door per thing" actually asks for.

**7. The sentence and the chips have to stay legible in both directions, and Sentinel already has the
harder half of this solved.** Type "only flexi cap under 0.7%" and the sheet's header shows the same
three removable chips Journey C already renders (`funds.jsx:30`) — never Google AI Mode's or Zillow's
invisible parse (`research/noor-patterns.md`, anti-pattern 1). Tap a chip to remove it and the header
sentence re-composes in plain English, because an advisor must be able to read the applied filters
aloud to a client — the same discipline the existing product enforces. What changes from today: the
composer itself stays empty and ready after a tap, rather than needing to be retyped, matching
Raycal/Linear's rule that "the input keeps DOM focus the whole time" and Booking's typed field living
*inside* the filter sheet rather than replacing it (`research/noor-patterns.md` rows A16, E4).

**8. The artifact is one object, mutated — not a table re-sent every turn.** Journey C today renders a
new `SentinelBlock` per refinement; my own patterns note flags this as the anti-pattern to beat
(`research/noor-patterns.md`, anti-pattern 2). Spotify's Prompted Playlists is the cure, watched in two
frames: the list is the object, kept/removed per row, refined by a sentence below it, and "You made
changes to the tracklist" — edits are remembered by the next refine, not re-explained from zero (board
#41–42). **V2 has exactly one live sheet-artifact per open session** — the same `fundsFor(query, shelf)`
function that drives `FundResults` today (`funds.jsx:966`) now backs one `ExplorerSheet` instance that
mutates its rows in place. When the advisor dismisses it, the Thread keeps one small closing turn — the
final sentence and count, for the record — never the whole table. So a session that ran through eight
refinements leaves **one artifact live at a time, and one short note in the Thread**, not eight tables.

**9. Multi-asset in one sheet cannot mean one column set, or it lies.** Anaya §3.8: "Returns cannot be
one column in a cross-asset table" — MF is point-to-point CAGR vs a Tier-1 TRI benchmark, PMS is TWRR
against the APMI benchmark with peer ranking, AIF is IRR against an agency benchmark report, bonds are
YTM (not a return at all), and unlisted has no regulated basis. Anaya §2.1: a fund card without a
riskometer, PRC cell, plan label and as-on date next to any return figure is a compliance defect, not a
style choice — and only MF carries the regulator's pictogram; bonds get a credit rating (a proposed
credit-riskometer, not live yet); PMS/AIF/GIFT carry prose risk factors only. **V2's answer: the sheet
groups by asset class as sections, never as one flat table.** One Digital's own Explore tab is the
precedent already in this product's family — `All Products · Mutual Funds · Bonds · GIFT City`
segments, each with its own facet set (`refs/one-digital-explore.webp`) — not a merged grid. A query
that spans assets ("show me everything under three years") returns sectioned results, each section
headed with its own column labels ("YTM · Rating" for bonds, "3Y CAGR · Riskometer" for funds), so no
cell in the sheet is ever asked to mean two different things.

**10. A persistent, always-reachable sheet closes findability gaps a thread structurally cannot.**
Ira's T9 ("I can't find my way to it", n=17, sev 3) and T5 ("I can't filter for what matters to me",
n=20, sev 3) are both about a stable, walkable hierarchy that a scrolling thread erodes the moment new
turns push old ones up. T1 ("nothing here beyond what I already know", n=22, sev 3) is a depth
complaint the sheet's full detent answers directly — the rail can carry 8+ facets against today's five
(`00-current-state.md`), matching what Coin and One Digital already ship. T6 ("don't trust the
recommendation", n=29, sev 4, the single biggest theme) is closed less by the sheet than by *what the
sheet is not*: it never auto-ranks, and the always-visible chip header is the auditable basis Ira's
so-what calls for — "a recommendation the user can audit — basis visible, not a funnel." None of this
is unique to V2's mechanic; what is unique is that the sheet keeps the filter state **on screen** while
the advisor works, instead of requiring a scroll back through the thread to remember what was asked.

## The journey, step by step

**Entry.** Any funds-bucket query (the router's existing bucket 3) raises the sheet at half, over the
Thread, composer untouched. **Narrow.** Type or tap; chips update the header sentence; the full detent's
rail adds facets the advisor cannot get from typing alone. **Shortlist.** The half-detent `DataTable`,
sectioned by asset class the moment more than one is in play. **Compare/overlap.** Select two rows;
`ComparePicker` and the verdict-sentence-then-table pattern Noor's patterns doc names as the winning
shape (`research/noor-patterns.md`, steal #6); overlap computed the SEBI way for MF, a maturity ladder
for bonds, an honest em dash elsewhere (Anaya §3.1–3.4). **Fund page.** Opens in place inside the row,
Journey C's existing device (`funds.jsx:67`), inheriting whatever detent the sheet was at. **Back/what
if.** Swipe collapses one detent at a time; the composer always answers "what if I ask something else"
without the sheet closing — Kayak's coexistence, finally given a mobile shape.

## What it needs

**Data.** Per-asset facet sets from Anaya §3.1–3.6 before "multi-asset" is true rather than aspirational
— today's book is 10 MF rows, 9 fields, zero bonds/PMS/AIF/GIFT/unlisted. **Components.** One new
primitive, `ExplorerSheet` (three non-modal detents, no scrim) — nothing in the system does this today;
every existing sheet (`ConfirmSheet`, `ExplainerSheet`) is single-detent and modal-adjacent. Reused as-is:
`ArtifactCard`, `DataTable`, `Pill removable`, `ComparePicker`, `OverlapView`, `InfoCard`. **Screens.**
The sheet at three detents × MFD/RIA copy mode × empty/zero-result — roughly the size of Journey C today,
plus the detent chrome.

## Where it is weakest

I could verify no product that raises a **browse** sheet over a **chat thread** with the thread's
composer still working underneath — not on Mobbin, not on the web (`refs/mobbin/mobbin-index.md`,
"What the search did not find"; `research/noor-patterns.md` line 52). Rufus is the mirror (a chat sheet
over a store); Maps is the detent grammar (over a map, not a conversation); Spotify is the mutating
object (inside one thread, not layered over it). V2 is their union, and a union with no incumbent is a
union nobody has proven survives contact with a real thumb mid-conversation. Concretely, what could go
wrong: drag-to-collapse on the sheet's grabber competing with scroll-to-read on the thread underneath it
at the same gesture origin; an advisor mid-client-call losing the thread of what Sentinel just said
because a sheet rose over it uninvited; reduced-motion and screen-reader behaviour for a non-modal sheet
having no Sentinel precedent to copy. Second, this is the most conventional-app-shaped of the three
variations — a filter rail and a three-detent sheet is what "not thin" looks like on every retail app in
`refs/board-retail.png`, which cuts against the 19 Sep ruling that made Sentinel chat-led on purpose.
Third, multi-asset is bounded entirely by the data gap: V2 ships MF-only at launch no matter how good
the mechanic is.

**Cheapest test.** Before building `ExplorerSheet`, a driven HTML prototype — three detents, real
gestures, no real data — run the way the 19 Sep end-to-end prototype was: one facilitator, an advisor
mid-simulated-client-call, told to find and shortlist a fund without being told how. Watch for the two
failures above: do they lose the thread, do they fight the gesture. Fold this into Ira's already-proposed
6–8 session MFD study (`research/ira-insight-report.md` §8) rather than running a second one.

## Three challenges I expect

**"This contradicts the 19 Sep ruling that there is no explorer screen."** It does not add a screen. The
sheet has no route, no entry in `report:parallel`'s count, and closes to nothing — it is a state of the
Thread, the same category as `ConfirmSheet` and `ExplainerSheet`, both of which already exist without
being counted as surfaces.

**"Nothing pinned above the composer — isn't a sheet pinned chrome by another name?"** No: the ruling
killed chrome that sat there *unasked*, on every screen, whether or not the advisor wanted it
(`Dock.chips`/`cta`). The sheet opens only on a funds query, always leaves the composer and the last
thread line visible even at its tallest, and always carries an explicit dismiss — the same bar
`ConfirmSheet` was held to.

**"Where's the compliance line, MFD vs RIA?"** MFD mode: header reads "Funds matching your filters," no
column is ever sorted by return or score unless the advisor explicitly asks, Regular plan is the
default with the commission-disclosure line pinned to the fund page (Anaya §1.7, §2.1). RIA mode: Direct
plan default, sort-by-score enabled once a risk profile is on file, "Suggested for <client>" gated behind
that record — exactly the mode switch `docs/CONTINUE-HERE.md`'s architecture and Anaya §4.3 already
require per client, not per session.
