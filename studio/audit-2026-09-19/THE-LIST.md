# The list — what is wrong, in plain words

**19 Sep 2026 · Sentinel · the Fable Studio audit, five seats, against the parameter list written first**

Five seats measured this: **Nia** (QA, five gates) · **Rhea** (system drift) · **Aarav** (flows and
states) · **Meher + Anaya** (copy and compliance) · **Raghav** (craft, beside three shipped apps).
Everything below was **measured or looked at**. Nothing is an opinion about how it should feel.

**Already fixed today, before this list was written:** 7 defects — see F-45 to F-48. They are marked ✅
so you can see what the audit caught versus what is still waiting on you.

---

## 1 · The one thing only you can decide

### ⛔ The rupee sign is not in our typeface — **F-47, open**

`₹` falls back to **Helvetica** in both our faces. Measured with the tool that reports what the browser
*actually drew*, not what the CSS asked for:

> `"₹89,400 cr"` → **Helvetica ×1** · Urbanist ×9

**230 times, on all 13 screens**, including the big display figure. Our first rule is *Indian grouping*,
and the mark that makes a number Indian is the one glyph neither face has.

**I passed this by eye earlier the same day.** At 3× zoom the ₹ sits correctly on the baseline, so I
said it was fine. It looks fine — Helvetica's ₹ is a good glyph. It is simply a different typeface, at
a different weight, inside every rupee figure we draw.

**Your call:** vendor a donor face for just this glyph (`unicode-range`, one weight), or accept the
fallback and write it down. Either way it changes how every number looks, so it is yours.

---

## 2 · Fixed today — the ones that were actually broken

| | What was wrong | Why it mattered |
|---|---|---|
| ✅ **F-45** | The **rail's composer was a picture**, not a control — inert on journeys A, D, E, F | Every step said *"or type your answer"* and typing did nothing. Four of six journeys. Second time: the thread's composer had the same defect and was fixed the same day; nobody looked at the rail |
| ✅ **F-46a** | The **note that goes to the client said "no exit load and no tax"** on moves the same screen costs at **₹11,200** | It is the only copy in this product that reaches a client, and it was wrong toward comfort. True of the SIP change, false of the switch |
| ✅ **F-46c** | `ds-spin` was **defined inside a component and cancelled globally** | `Pill`'s loading spinner **never spun, anywhere**. Keyframe defined 0 times, `getAnimations()` empty |
| ✅ **F-46d** | `RangePills` dimmed a locked row to 40% | You could not see **which** range was locked in. Same defect fixed on `SegmentedRow` the same day and missed here |
| ✅ **F-48a** | **45 enabled, unnamed 105×44 buttons** across the product | My own F-42 fix was half a fix: I made the footer conditional and not its three slots |
| ✅ **F-48b** | The **focus trap let focus escape** a modal | It counted a `tabindex="-1"` button as a tab stop. Found because the `RangePills` fix above made it miscount |
| ✅ **router** | *"Sell 2 lakh of Quant Small Cap"* fell into "I did not follow that" | The ACT rule needed the word *all*. Its whole purpose is to catch an instruction before the fund search reads it as a browse |

---

## 3 · The ranked list — still open

Ranked by **how much it costs the advisor**, not by how easy it is.

### High

**H1 · Offline does not exist.** *(F1)* One string in the whole product, and it is a mid-request drop,
not offline. An advisor sits in a client's living room on bad network. Aarav's table: **loading missing
in 6 of 7 journeys, error in 6 of 7, offline in 7 of 7.** He wrote what each journey should do — A, F
and most of D and E work fully offline; the confirm sheet must not open.

**H2 · The AMFI risk line is on no screen.** *(H1)* `DisclosureBlock` is built, exported, used nowhere.
One line, parts already in the repo.

**H3 · Four words mean two things each.** *(H5)* **switch / SIP change** — a SIP redirect is called a
switch on the confirm sheet and the success turn. **mandate** — the investment mandate and the NACH bank
mandate swap places inside one paragraph. **exchange / RTA** — two names for where the same instruction
sits, across four states of one turn. **Placed** — the ledger's heading sits over rows badged *Rejected*
and *Sent*. These are what an advisor gets corrected on in front of a client.

**H4 · 262 tap targets under 44pt.** *(D3)* Measured by hit-testing, including the invisible extension.

**H5 · Four questions get four different answers.** *(G2)* There are **four lists of "what I can do"**
in the product and no two are alike — and the standing answer's fifth row, *"Read a statement you
attach"*, routes to *"I did not follow that."*

### Medium

**M1 · 11 colour pairs fail AA.** *(new parameter — contrast is not in the list yet; add it.)*

**M2 · Tab escapes the drawer.** *(D4)* Fixed for the trap logic; the drawer still needs its own pass.

**M3 · Journey D's "Send the proposal" changes nothing.** *(F1)* The phone is pixel-identical after the
commit. The `sent` state exists only as a frozen specimen.

**M4 · Journey E skips its own question on a second run**, and approving a cold rebalance lands the
advisor **inside Journey B's drift thread**, under a skeleton that never resolves. *(G3)*

**M5 · `affordances()` is wrong where it claims it cannot be.** *(G3)* Three of its four rows are wrong
on Journey A's first question, and it says *"Why is 31%"* where the screen says 71%.

**M6 · 303 hardcoded values across 53 components.** *(C5)* **13 of them have a token that already
exists.** Worst: `Pill`'s whole size table is raw and all seven values are tokens — and `Pill` is on
**26 screens**, the most-placed component in the system.

**M7 · The same thing is written in 8 places.** *(B6)* Indian grouping and one-decimal percent have
**eight implementations** — that is rule A4 with eight places to fail. `Ask` is byte-identical in 7
pages. The dialog focus trap is copied **three times inside the design system**.

**M8 · Four rule-carrying components have no spec page.** *(coverage)* `Pressable` (27 screens, the base
every control sits on), `Provenance` (rule A4), `StandingDisclosure` (rule H1), `Badge` (the status
family). Tier 1 was called done and is not.

### Low

**L1 · 15 contracts would mislead a reader.** `StatTile` renders two props it documents nowhere;
`ResultPrimary` says *"Both moves approved"* for any count, against its own `.d.ts`.

**L2 · `contradictions.md` is malformed** — row 45 is swallowed inside row 38's cell. It matters because
every audit is told to read it first.

**L3 · 14 components are on no screen**, 4 of them with a spec page. `CanvasHeader` is deprecated by
contradiction 40, still exported, still describing a surface removed in v5.

---

## 4 · The UX lens — the questions a checklist cannot ask

**Why does each thing exist?** Every component has a contract that says so, and that is rare and worth
keeping. The exceptions are in L3: fourteen things exist because nobody removed them.

**Where does the advisor repeat themselves?** Four places, and all four are ours, not theirs:

1. **Four different "what I can do" lists.** Pick one, generate the rest from it.
2. **The missing purchase dates are written four times in four wordings** in Journey E, with **the same
   chip rendered twice on one screen**.
3. **"Approve both moves" is the label on both** the thread button and the sheet's commit — and the
   sheet then repeats both move cards while **dropping the cost (₹11,200) and the after-mix (58%)**.
   The advisor confirms twice and the second time sees less.
4. **Two provenance lines start with the same seven words**, stacked, in Journey B.

**Where would behavioural psychology fit — and where would it be manipulation?**

- **Peak-end:** the end of a journey is what an advisor remembers. Journey B ends on a drawn check and a
  true sentence. Journey D ends correctly on *"nothing has been placed"*. **Journey F ends on nothing** —
  it has no closing beat at all.
- **Defaults are a fiduciary act here.** Journey E offers three targets and marks the costed one primary.
  That is a nudge toward *the one we can price*, not toward the one that is right for the client. It is
  defensible — but it should be a written decision, not an accident of which chip got `variant="primary"`.
- **Loss aversion: do not.** *"Your client is losing ₹X by not rebalancing"* would work, and it would be
  a product telling an advisor to sell. The current framing — a ceiling that was breached, a mandate that
  was agreed — is the honest one. **Keep it.**
- **Commitment:** the risk number is locked with a date. That is the strongest psychological instrument
  in the product and it is used once. The proposal's *"built against the mandate he stated, not against a
  score"* is the same instrument and could be as firm.

---

## 5 · Who is on these screens, and who is not

**Clients — four, and they cover more than they look like they do:**

| | Covers | The case it forces |
|---|---|---|
| Meera, 38, salaried, Kochi | the long tail | 43 funds, 29 of them tiny — and **her actual split is not on file**, which is Journey F's whole finding |
| Sharma, 46, business, Pune | the breach | one fund over two ceilings at once |
| Amit, 52, business, Delhi | the blocked client | **KYC in process, no nominee** — can be sent a proposal, cannot be given a folio |
| Sunita | — | in the book, on no screen |

**Advisors — one, and that is the gap.** Every screen assumes an established ARN holder with a book,
a shelf and 512 clients. **Nobody has designed the first day**: a new ARN holder with 20 clients, no
saved work, no recent threads, no shelf. The drawer's three empty states are the only place that
advisor exists — and the thread has **no empty state at all**.

That is the single biggest persona hole, and it is the one every new user meets first.
