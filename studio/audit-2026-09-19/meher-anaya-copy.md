# Copy and compliance audit — Meher (Content Design) · Anaya (Domain & Compliance)

**19 Sep 2026 · audited against `studio/audit-2026-09-19/parameters.md`.** Every finding carries the
parameter id it fails, the exact sentence, `file:line`, and the replacement written out in full. A copy
finding with no replacement is not a finding, so there are none of those here.

**What was looked at.** All eleven screens named in the brief, both in source and rendered at 375 × 812
(`tools/phone-shot.mjs`): `journey-e/rebalance` phones 1–3, `journey-c/funds` phones 1 and 4,
`journey-d/proposal` phones 2 and 7, `journey-f/review` phone 6, `thread/refusals` phone 4,
`thread/ledger` phone 2, `journey-b/05-decide` phones 3 and 8, `journey-a/risk-profile` phone 7. Three
findings below (M-19, A-14, and the repetition in M-9) exist only on the render; none of the code
findings is reported from a picture.

**No product code was changed.**

---

# Section 1 — Meher · Content Design

44 sentences read aloud. 31 findings: **2 blocker, 8 high, 15 medium, 6 low.**

## 1.1 · The read-aloud test

### M-1 · BLOCKER · H5, H2, E4 — the note to the client says there is no tax, and the product says it costs ₹11,200

**Where** `screens/journey-b/moves.jsx:37` (`CLIENT_NOTE`, drafted for Sharma and shown on the success turn)

**Now**
> "Mr. Sharma, your equity had drifted to 71% against the 60% we agreed. I am moving ₹1,85,000 from Quant
> Small Cap into ICICI Corporate Bond and redirecting your ₹30,000 SIP. **No exit load and no tax.** This
> brings you back to 58%."

**Why it fails** `book.jsx:106` states the rule this note breaks: *"A switch is a redemption plus a
purchase, so it is taxable."* Move 1 is a switch. `MovesSimulation` (`moves.jsx:60`) prints "What it
costs him ₹11,200" on the screen immediately above. So the one sentence the advisor will actually read
to the client tells him there is no tax on a transaction the same screen has costed. This is the only
string in the product that leaves Sentinel in the client's hands, and it is the one that is wrong.

**Replace with**
> "Mr. Sharma, your equity had drifted to 71% against the 60% we agreed. I am moving ₹1,85,000 from Quant
> Small Cap into ICICI Corporate Bond, and redirecting your ₹30,000 SIP. The switch costs ₹11,200 in exit
> load and tax. The SIP change costs nothing. This brings you back to 58%."

---

### M-2 · BLOCKER · H3, E4 — the confirm sheet promises the client a note that is never sent

**Where** `screens/journey-b/moves.jsx:30` (`CONFIRM_DISCLOSURE`), contradicted at `moves.jsx:204`

**Now**
> "These two switches run under your ARN. **Sharma gets a note explaining both moves and what they cost.**
> Nothing else in his book changes."

and, two taps later:

> "The two switches have gone to the exchange under your ARN — those cannot be pulled back from here.
> **Sharma has not been told yet:** his note is written and waiting for you."

**Why it fails** The confirm sheet is the last thing an advisor reads before money moves, and it states a
future fact that the product does not perform. An advisor who reads the sheet and walks into a meeting
believes the client has been told. `StandingDisclosure` on the success turn then says the opposite —
*"Nothing leaves Sentinel until you pick a channel and send it there."* Two surfaces, one turn apart,
opposite claims.

**Replace with**
> "These two moves run under your ARN. I will draft a note for Sharma explaining both and what they cost —
> you send it. Nothing else in his book changes."

---

### M-3 · HIGH · H5 — "these two switches", when one of them is not a switch

**Where** `screens/journey-b/moves.jsx:30` and `moves.jsx:204`

**Now** "These two switches run under your ARN." · "The two switches have gone to the exchange under your ARN"

**Why it fails** Move 2 is a SIP redirect (`moves.jsx:20`, `book.jsx:184` `kind: 'sip-redirect'`). It
redeems nothing and buys nothing today; it changes a standing instruction. The product's own ledger
already names them correctly as **Switch** and **SIP change** (`book.jsx:252–253`). Calling a mandate
change a switch is the kind of thing an ARN holder would be corrected on by an RTA, and it is the reason
M-1 got written.

**Replace with** (`moves.jsx:30`) "These two moves run under your ARN." · (`moves.jsx:204`) "The switch
has gone under your ARN and cannot be pulled back from here; the SIP change is with the registrar."

---

### M-4 · HIGH · H5 — "the mandate" means two different things in one paragraph

**Where** `screens/journey-b/moves.jsx:148` (`EXEC_COPY.partial`) and `moves.jsx:170` (the retry chip)

**Now**
> "One of the two went through. His mix is back at 58% today, but the SIP still buys small cap on the 7th,
> so the drift starts again next month **unless the mandate is fixed**."

chip: "**Fix the mandate** and retry move 2"

**Why it fails** `docs/DNA.md:98` flags this collision by name: the investment mandate (the 60/30/10 he
agreed to) and the NACH bank mandate are both called "mandate", and the DNA's ruling is that the SIP row
says "NACH" so the two can be told apart. Here the paragraph's subject is his *investment* mandate for
three clauses and then switches to the *bank* mandate without a word. An advisor reading this aloud will
tell the client his agreed mix needs changing when what needs changing is a bank instruction.

**Replace with** (`moves.jsx:148`)
> "One of the two went through. His mix is back at 58% today, but the SIP still buys small cap on the 7th,
> so the drift starts again next month unless his NACH mandate is re-registered."

chip (`moves.jsx:170`): "Re-register the NACH mandate, then retry move 2"

---

### M-5 · HIGH · E1, E5 — "Two moves, not seven", and then the product says it cannot name the seven

**Where** `screens/journey-b/moves.jsx:17` (`MOVES_ANSWER`), against `moves.jsx:24–28` (`SKIPPED`) and the
chip at `moves.jsx:101`

**Now**
> "**Two moves, not seven.** Together they bring equity from 71% back to 58%, and they cost ₹11,200."

and behind "Show the five we skipped":

> "The other trades are not costed in this build. I will not list a move I cannot cost, so there is nothing
> real to show here yet."

**Why it fails** The headline asserts a set of seven candidate moves and the panel behind it says the
other five do not exist in any form the product can show. The advisor is invited to defend a count the
product cannot produce. Parameter E1 is exactly this: a figure that is not available is stated, never
implied.

**Replace with** (`moves.jsx:17`)
> "Two moves. Together they bring equity from 71% back to 58%, and they cost ₹11,200."

and the chip at `moves.jsx:101` becomes "Why only two?", with `SKIPPED.title` (`moves.jsx:24`) becoming
"Why only two" and `SKIPPED.body[1]` (`moves.jsx:27`) becoming:
> "I only propose a move I can cost. Anything else would need the purchase dates on his folios, and those
> are not on file."

---

### M-6 · HIGH · H5 — a sentence whose subject is a label, not a noun

**Where** `screens/journey-e/rebalance.jsx:85` (`UncostedTurn`)

**Now** — rendered on the phone as
> "**To the mandate moves ₹1,56,530** and lands him at equity 60%."

and, for the other target, "Inside the band moves ₹85,380 and lands him at equity 65%."

**Why it fails** The template interpolates `target.label` as the grammatical subject. "To the mandate
moves ₹1,56,530" is not a sentence an Indian English speaker — or any English speaker — can say out loud
without stopping. Verified on the render (`journey-e/rebalance.html` phone 3).

**Replace with**
> "Taking him to ${target.label.toLowerCase()} moves ₹X and lands him at equity Y%."

giving "Taking him to the mandate moves ₹1,56,530 and lands him at equity 60%." and "Taking him inside the
band moves ₹85,380 and lands him at equity 65%." — with `REBALANCE_TARGETS[1].label` (`book.jsx:320`)
reading "Inside the band" unchanged.

---

### M-7 · HIGH · E4 — the ledger's own title says "Placed" over rows that were not placed

**Where** `screens/thread/ledger.jsx:53` (card eyebrow) and `ledger.jsx:11` (`LEDGER_ASK`)

**Now** eyebrow "Placed · Sep 2026"; the question above it "What have I placed this month?"

**Why it fails** Of the five rows, one is **Rejected** and one is **Sent · no answer** (`book.jsx:253,256`).
This surface exists precisely to keep placed, settled, rejected and sent apart (parameter E4), and its own
heading collapses them. Confirmed on the render (`thread/ledger.html` phone 2): the word "Placed" sits
40pt above a row badged "Rejected".

**Replace with** eyebrow (`ledger.jsx:53`) "Instructed · Sep 2026"; question (`ledger.jsx:11`)
"What have I sent this month?"

---

### M-8 · HIGH · E4 — "Four are confirmed", and one of the four was refused

**Where** `screens/thread/ledger.html:44`, and repeated verbatim at `:75` and `:78`

**Now**
> "Five instructions this month. **Four are confirmed**; one is still out with the RTA, so I have not
> counted it as done."

**Why it fails** "Confirmed" is being used for *we have an outcome* while an advisor hears *four went
through*. One of the four was rejected. The next sentence — "so I have not counted it as done" — shows the
writer knew the distinction and put it on the wrong word.

**Replace with**
> "Five instructions this month. Four have an answer — three went through and one was refused. The fifth is
> still out with the registrar."

---

### M-9 · HIGH · A1, E1 — the rejection says what and why, and never says how to fix it

**Where** `screens/thread/ledger.jsx:46` rendering `book.jsx:253` `note`

**Now** "NACH mandate registered for the old amount"

**Why it fails** No full stop, no subject, and no next action. The same failure is written properly 100
lines away in `moves.jsx:139` — *"The NACH mandate on folio 9142/28 is registered for the old amount. The
RTA rejected the change."* — and even that one stops before the fix. Every other refusal in this product
names what it can do in the same breath; this one does not, and it is the only refusal an advisor meets
after the money has already moved.

**Replace with** (`book.jsx:253` `note`)
> "The registrar refused it: his NACH mandate is still registered for the old amount. Re-register the
> mandate for ₹30,000 and send the SIP change again."

---

### M-10 · HIGH · H5 — the uncosted explanation is 31 words and carries a term the client will not know

**Where** `screens/journey-e/rebalance.jsx:87`

**Now**
> "I can size it and I cannot cost it. A switch is a redemption plus a purchase, so it is taxable, and the
> tax depends on when each lot was bought — folio 9142/28 has no purchase dates on file."

**Why it fails** 31 words, three clauses and an em-dash aside in one breath. "Lot" is a back-office word;
an advisor says "the units you bought in June". Verified on the render (`journey-e/rebalance.html` phone 3)
— it runs four lines.

**Replace with**
> "I can size it. I cannot cost it. A switch sells units and buys new ones, so there is tax to pay, and the
> tax depends on when each unit was bought. Folio 9142/28 has no purchase dates on file."

---

### M-11 · MEDIUM · H5 — the mandate read aloud as three bare numbers

**Where** `screens/journey-f/review.jsx:75` (`REV_MISSING`), rendered in the "What is missing" callout

**Now**
> "…I cannot tell you whether she is on the **55/30/15** she agreed to."

**Why it fails** Seen on the phone (`journey-f/review.html` phone 6), "55/30/15" has no labels anywhere
near it. Read to a client it is three numbers with no nouns. The tile 300pt above does carry
"Equity / debt / cash" — but a sentence has to stand on its own, because it is the sentence that gets
spoken.

**Replace with**
> "…I cannot tell you whether she is on the mix she agreed to — 55% equity, 30% debt, 15% cash."

---

### M-12 · MEDIUM · H5 — an idiom in a sentence written to be read to a client

**Where** `screens/journey-f/review.jsx:54`

**Now** "Too small to move the needle, and they still cost her a fee and a line on every statement."

**Why it fails** "Move the needle" is an English business idiom. The owner's ruling is plain English for
an advisor who may not be a confident English reader; an idiom is the exact thing that ruling was written
against, and it will not survive a Hindi or Malayalam rendering either.

**Replace with** "Each one is too small to change her returns, and every one of them still costs her a
fee and a line on her statement."

---

### M-13 · MEDIUM · H5 — system language in the finding the whole review rests on

**Where** `screens/journey-f/review.jsx:75`

**Now** "Her statement was **loaded fund by fund**, and the 29 small funds have never been **mapped to
categories**."

**Why it fails** "Loaded" and "mapped to categories" describe what an operations team did to a file, not
anything the advisor or the client recognises. This is the single most important sentence in journey F —
it is the review's whole finding — and it is written from inside the system.

**Replace with**
> "Her statement lists 43 funds by name and not by type, and nobody has yet written down which type each of
> the 29 small ones is."

The chip beneath it (`review.jsx:87`, "Map her funds to categories") becomes "Sort her 43 funds by type".

---

### M-14 · MEDIUM · A4, H5 — numbers spelled out on one screen and in digits everywhere else

**Where** `screens/journey-f/review.jsx:82`

**Now** "**Twenty-nine** of her **forty-three** funds are under ₹27,600 each. Together they are **a fifth**
of her money and they do nothing a single fund would not do better."

**Why it fails** `docs/DNA.md` and the rest of the product write these as digits, and the tiles 200pt above
this sentence say "43 funds" and "20%". Same screen, same two facts, two renderings. Digits also read
faster on a 375 screen, which is where this is.

**Replace with**
> "29 of her 43 funds are under ₹27,600 each. Together they are 20% of her money, and they do nothing a
> single fund would not do better."

---

### M-15 · MEDIUM · A4 — the same ceiling written three ways

**Where** `screens/thread/refusals.jsx:19` and `:20` · `screens/journey-d/proposal.jsx:26` and `:29–31` ·
`screens/shell/menu.jsx:11` · `screens/thread/going-back.html:88` and `:144`

**Now** `₹25 L` (the refusal body and its chip, the drawer's saved row, the version trail) ·
`₹25,00,000` (the proposal's own chip, its step-2 sentence and its heading) · `₹25 lakh` (the archive
heading the proposal page still quotes at `proposal.html:147`).

**Why it fails** One number — `CLIENTS.amit.mandate.ceilingRs` — in three forms, in one journey. `DNA.md:102–104`
permits both grouped digits and the L/Cr shorthand, which is why this drifted. It needs a rule.

**The rule to adopt** *A figure the product will act on is always full grouped digits. The L/Cr shorthand
is for a title where the figure is a name, not a fact.* That keeps the drawer row and the version label as
they are and fixes the rest.

**Replace with**
- `refusals.jsx:19` → "₹60,00,000 is above the ₹25,00,000 ceiling on Mr. Amit Aggrawal's mandate. I have not applied it."
- `refusals.jsx:20` chip → "Use ₹25,00,000"
- `menu.jsx:11` and `going-back.html:88,144` — unchanged, "₹25 L proposal" is a title.

---

### M-16 · MEDIUM · A4 — the same portfolio written two ways, and money chips in two styles

**Where** `screens/journey-a/rail.jsx:17` vs `screens/journey-f/review.jsx:28` ·
`screens/journey-a/rail.jsx:42` vs `screens/journey-d/proposal.jsx:26`

**Now** "₹18.4 L across 43 funds" (journey A's opening line) against "Meera Nair holds ₹18,40,000 across
43 funds" (journey F's opening line) — the same client, the same book, the same sentence position. And the
money chips: `₹50 lakh · ₹1 crore · ₹2 crore` on the risk rail against `₹25,00,000 · ₹50,00,000 · ₹10,00,000`
on the proposal rail. Same control, same gesture, two number styles.

**Why it fails** Both are amounts the product acts on, so by the rule in M-15 both are grouped digits.

**Replace with**
- `rail.jsx:17` → "Meera Nair, 38, Kochi. Your client since 2019. ₹18,40,000 across 43 funds."
- `rail.jsx:42` chips → `c('₹50,00,000'), c('₹1,00,00,000'), c('₹2,00,00,000'), c("She isn't sure yet", 'muted')`

---

### M-17 · MEDIUM · E1 — an em dash standing in for a reference, unlabelled

**Where** `screens/thread/ledger.jsx:44`

**Now** renders as "19 Sep 2026 · —" on the rejected row and the sent row (confirmed on
`thread/ledger.html` phone 2)

**Why it fails** `DNA.md:25` allows an em dash for *not applicable*, "and a footnote if the reason is not
obvious". Here it is not obvious: the advisor sees a date, a separator and a dash where every other row
shows "ord 8841/22". Nothing says whether the reference is missing, pending or does not exist.

**Replace with** — render the word instead of the dash when `l.ref === '—'`:
> "19 Sep 2026 · no reference — it was never accepted"  (rejected rows)
> "5 Sep 2026 · no reference yet"  (sent rows)

---

### M-18 · MEDIUM · H5, B6 — one empty state, three wordings

**Where** `screens/journey-c/funds.jsx:117` · `screens/journey-c/funds.html:47` · `screens/journey-c/funds.html:76`

**Now**
- table: "Nothing matches every filter." / "Drop one and I will widen the search."
- live count line: "Nothing matches all of those now. Drop one and I will widen it."
- frozen count line: "Nothing matches all of those."

**Why it fails** Three sentences for one condition, two of them 10pt apart on the same phone. The third
does not say what to do at all, which is the empty-state rule.

**Replace with** one string, declared once in `funds.jsx` beside `FUND_EMPTY` and read by both pages:
> `const FUND_NONE = 'Nothing matches all of those. Drop a filter and I will widen the search.';`

with `FUND_EMPTY` (`funds.jsx:117`) becoming `{ title: 'Nothing matches all of those.', body: 'Drop a filter and I will widen the search.' }`.

---

### M-19 · MEDIUM · H5, D1 — a tick drawn as a character inside a label (the F-43 class, unfixed here)

**Where** `screens/journey-c/funds.html:42` and `:69`

**Now** `<Pill label={shelf ? 'On your shelf ✓' : '+ On your shelf'} …>`

**Why it fails** Confirmed on the render (`journey-c/funds.html` phone 1): the pill reads "On your shelf ✓".
This is the same defect F-43 closed for the remove chips — a glyph carried as a character inside the
accessible name. A screen reader announces "On your shelf tick" and nothing distinguishes the on state from
the off state except a character. The `+` in the off state is the same problem inverted.

**Replace with** one label, with the state carried by `tone` as it already is:
> `<Pill label="On your shelf" size="sm" tone={shelf ? 'primary' : 'outline'} aria-pressed={shelf} onClick={onShelf} />`

---

### M-20 · MEDIUM · H5, G2 — a note that repeats the answer it annotates

**Where** `screens/journey-a/risk-profile.html:28`

**Now** `{ q: 'What does she earn a month?', a: '₹1,80,000', note: 'understood as ₹1,80,000' }`

**Why it fails** Confirmed on the render (`journey-a/risk-profile.html` phone 7): the answer chip says
₹1,80,000 and the line 6pt beneath it says "understood as ₹1,80,000". The note exists to say Sentinel read
a typed string correctly; saying it with the identical string says nothing. Compare the line above it,
"from her KYC", which does carry a fact.

**Replace with** `note: 'typed as 1.8 lakh'`

---

### M-21 · MEDIUM · H5 — a refinement invitation that does not say what can be said

**Where** `screens/journey-c/funds.html:65` and `:72`

**Now** "I read that as a fund search. This is what I am filtering on — drop anything I got wrong, **or just
tell me**."

**Why it fails** The refinement parser understands exactly three things (`funds.jsx:150–171`: add a category,
drop one, turn the shelf filter on or off) and the composer placeholder says so — "Add, drop, or say
'only…'". The sentence above it says "just tell me", which promises more than the parser has and sends the
advisor into bucket 4.

**Replace with**
> "I read that as a fund search. This is what I am filtering on. Drop a chip, or tell me a category to add or drop."

---

### M-22 · MEDIUM · E4 — one proposal, two version histories

**Where** `screens/thread/going-back.html:36–40` against `screens/data/book.jsx:354–358`

**Now** going-back's trail: V1 "First draft, 6 funds" 14 Sep 4:12 pm · V2 "Mid-cap → flexi-cap" 15 Sep
11:20 am (sent) · V3 "**Small-cap cut to 12%**" Yesterday 6:40 pm. The book's trail for the same artifact:
v1 "Draft, before the ceiling" 14 Sep 6:40 pm · v2 "Sent to Mr. Aggrawal" 16 Sep 4:05 pm · v3 "Mid-cap
trimmed by ₹1,00,000" 19 Sep 11:20 am.

**Why it fails** Both rows are labelled "Mr. Amit Aggrawal · ₹25 L proposal". Three of the six summaries
disagree, the send dates disagree, and V3's summary describes a small-cap cut in a proposal that has never
held small cap — `PROPOSAL_SPLIT` (`book.jsx:339–346`) has no small-cap line and `book.jsx:342` says so
explicitly: *"Small cap is absent on purpose: he has no risk profile yet."* The version trail is the
surface whose entire job is telling the advisor what the client actually read.

The same block also carries the product's only relative timestamps — "Yesterday, 6:40 pm" (`:39`) and
"Just now" (`:75`) — against `DNA.md:105`'s day-first short month everywhere else.

**Replace with** — delete `going-back.html:36–40` and read `PROP_VERSION_LIST` from `proposal.jsx:107`,
so the summaries and the dates are the book's: "Draft, before the ceiling · 14 Sep 2026, 6:40 pm" ·
"Sent to Mr. Aggrawal · 16 Sep 2026, 4:05 pm" · "Mid-cap trimmed by ₹1,00,000 · 19 Sep 2026, 11:20 am".
If going-back must stay standalone, those are the three strings. The appended revert row (`:75`) reads
"Restored V2 · 19 Sep 2026, 3:04 pm" rather than "Just now".

---

### M-23 · MEDIUM · H4 — the two blockers name the blocker and not the next thing to do

**Where** `screens/data/book.jsx:363–364`, rendered by `screens/journey-d/proposal.jsx:94`

**Now**
> KYC — "PAN–Aadhaar seeding pending. Nothing can be placed until it clears."
> Nominee — "An AMC will not accept a folio without a nominee or a signed opt-out."

**Why it fails** Confirmed on the render (`journey-d/proposal.html` phone 7). Both are true and both stop
at the wall. The product's own standard — every refusal names what it can do in the same breath — is kept
on every refusal screen and dropped on the two rows that actually block a rupee.

**Replace with**
> KYC — "PAN–Aadhaar seeding is pending. Nothing can be placed until it clears. Ask him to seed the PAN on
> the income-tax portal, then tell me and I will re-check."
> Nominee — "An AMC will not accept a folio without a nominee or a signed opt-out. Send him the nomination
> form with this proposal and it clears with the KYC."

---

### M-24 · MEDIUM · H5 — the sentence that carries the whole risk result is 23 words with three parentheticals

**Where** `screens/journey-a/rail.jsx:59` (the "How is 54 worked out?" explainer)

**Now** "Three scores: what her finances can absorb (71), what she can sit through calmly (54), and what her
₹2 crore goal needs (62)."

**Why it fails** Three bracketed numbers in one breath. Brackets do not survive being spoken — the advisor
has to invent a way to say them.

**Replace with**
> "Three scores. Her finances can absorb 71. She can sit through 54. Her ₹2,00,00,000 goal needs 62."

---

### M-25 · MEDIUM · H5 — an inference about the client, stated as a fact about the client

**Where** `screens/journey-a/rail.jsx:73` (`RISK_RESULT.trailing`)

**Now** "She is a 54, Moderate. Her finances could carry more, but **she would not sleep through it** — so
54 is what we build against."

**Why it fails** The advisor reads this to Meera. "She would not sleep through it" is Sentinel telling the
client what she is like; the score came from her own twelve answers, and saying so is both more accurate and
easier to say to her face.

**Replace with**
> "She is a 54, Moderate. Her finances could carry more, but her own answers say she would not sit through
> it calmly — so 54 is what we build against."

---

### M-26 · MEDIUM · H5 — a forward promise where a limit belongs

**Where** `screens/journey-a/rail.jsx:35` (the first interjection)

**Now** "That is about six months of her spending. Comfortable — it means a fall in the market **will not
force her to sell**."

**Why it fails** An assurance about a future market, stated flatly, on a screen the advisor reads aloud.
Six months of spending makes a forced sale less likely; it does not make it impossible.

**Replace with**
> "That is about six months of her spending. Comfortable — it means a fall in the market is much less likely
> to force her to sell."

---

### M-27 · MEDIUM · G2 — the uncosted line printed twice on one phone

**Where** `screens/journey-e/rebalance.jsx:44`, rendered once per uncosted `TargetRow`

**Now** "Not costed. I need the purchase dates on folio 9142/28 before I can put a figure on this." —
identical on both uncosted targets, and said a third time in longer form in `UncostedTurn`
(`rebalance.jsx:87`) when either is tapped.

**Why it fails** Confirmed on the render (`journey-e/rebalance.html` phones 2 and 3): the same 17 words
appear twice within 200pt. The folio is the same folio in both cases, so the second statement of it carries
nothing new.

**Replace with** — the first uncosted row keeps the full sentence; every row after it reads
> "Not costed — same reason."

with the full sentence stated once, above the three targets:
> "I can size all three. I can only cost the third, because folio 9142/28 has no purchase dates on file."

---

### M-28 · LOW · H5 — "the exchange" and "the RTA" for the same two instructions

**Where** `screens/journey-b/moves.jsx:147` and `:155` against `moves.jsx:139` and `:177`

**Now** "Both moves are with **the exchange**" · "Sent · waiting for **the exchange**" · "**The RTA** rejected
the change." · chip "Check with **the RTA**"

**Why it fails** Two names for where an instruction sits, on one screen, inside four states of one turn. An
MFD does place a switch through the exchange platform and does not place a NACH mandate change there —
which makes the inconsistency a fact problem as well as a word problem (see A-10).

**Replace with** one word for the whole surface — "the registrar", since that is where the reject actually
came from:
- `moves.jsx:147` → "Both moves are with the registrar. I will tell you the moment either one is confirmed — you do not need to wait here."
- `moves.jsx:155` → "Sent · waiting for the registrar"
- `moves.jsx:177` chip → "Check with the registrar"

---

### M-29 · LOW · F3 — the new advisor's Home has nothing on it and says nothing about that

**Where** `screens/journey-b/home.jsx:55`

**Now** `{rows.length > 0 && ( … )}` — the ready-prompt card is omitted entirely when the book is empty.

**Why it fails** Omission is not an empty state. A partner on day one gets a greeting, three capability
chips and a composer, and no sentence telling them what to do first. Every other empty surface in this
product says what to do (`FUND_EMPTY`, the proposal table, the drawer's three lists); this is the first
screen anyone sees and it is the only one that does not.

**Replace with** — render the card with one row instead of omitting it:
> title: "Nothing waiting yet."
> body: "Add your first client and I will start putting their work here. Or ask me anything below."

---

### M-30 · LOW · H5 — the paused-journey banner named two ways

**Where** `screens/journey-a/risk-profile.html:92` against `screens/thread/going-back.html:80` and `:155`

**Now** "Risk profile · paused at question 7" · "Meera's risk profile · paused at question 7"

**Why it fails** An advisor with two paused journeys needs the client's name; an advisor with one does not
need it removed. Pick the one that works in both cases.

**Replace with** `risk-profile.html:92` → `label="Meera's risk profile · paused at question 7"`

---

### M-31 · LOW · A4 — three unit conventions

**Where** `screens/journey-c/funds.jsx:94` · `screens/thread/ledger.jsx:61` · `screens/data/book.jsx:118,215`

**Now** "₹89,400 **cr**" (lowercase) against `DNA.md:103`'s "₹4.2 **Cr**" · period pill "**FY 26-27**"
against the book's "ITR, **AY 2025-26**" and "Form 16, **FY 2025-26**"

**Replace with**
- `funds.jsx:94` → ``value: `₹${p.aumCr.toLocaleString('en-IN')} Cr` ``
- `ledger.jsx:61` → `ranges={['Sep', 'Q2', 'FY 2026-27']}`

---

## 1.2 · The glossary the screens actually use

Built from the strings, not from `DNA.md`. **Bold** is the term to keep.

| Concept | Said on screen as | Where | Keep |
|---|---|---|---|
| Moving money between two funds | **switch** · "these two switches" (used for a SIP redirect too) | `moves.jsx:19,30,204`; `book.jsx:252` | **switch** — for a redemption-plus-purchase only |
| Changing a standing SIP instruction | **SIP change** · "redirect" · "switch" | `book.jsx:253,184`; `moves.jsx:20,30` | **SIP change**, with "redirect his ₹30,000 SIP" as the verb |
| The agreed asset mix | **his mandate** · "the mix he agreed to" · "what she agreed to" · "the 55/30/15" · "the mandate on file" · "the mandate he stated" | `rebalance.jsx:60`; `moves.jsx:55`; `review.jsx:75`; `answer.jsx:43`; `proposal.jsx:29` | **his mandate** on a label; **"the mix he agreed to"** in a spoken sentence; never bare numbers |
| The bank instruction behind a SIP | **NACH mandate** · **the mandate** | `book.jsx:253`; `moves.jsx:139,148,170` | **NACH mandate**, always both words — never "the mandate" alone |
| The approved fund list | **your shelf** · **compliance shelf** · "on shelf" / "off shelf" badge | `funds.jsx:124`; `moves.jsx:32`; `funds.jsx:49` | **your shelf** to the advisor; **compliance shelf** only on the confirm row |
| Where an instruction goes | **the exchange** · **the RTA** | `moves.jsx:147,155` vs `:139,177` | **the registrar** |
| An instruction's outcome | **Placed · Settled · Rejected · Sent · no answer** (good) — but the card heading says **Placed** for all five, and the turn says **confirmed** for a rejection | `ledger.jsx:17` vs `:53`, `ledger.html:44` | keep the four words; fix the heading (M-7) and "confirmed" (M-8) |
| ₹25,00,000 | **₹25 L** · **₹25,00,000** · **₹25 lakh** | `refusals.jsx:19,20`; `proposal.jsx:26`; `menu.jsx:11` | **₹25,00,000** in a sentence or a chip; **₹25 L** only in a title |
| ₹18,40,000 | **₹18.4 L** · **₹18,40,000** | `rail.jsx:17` vs `review.jsx:28` | **₹18,40,000** |
| Past performance caveat | three wordings — see A-9 | `funds.jsx:90`; `InfoCard.prompt.md:5`; `DisclosureBlock.jsx:4` | **"Past performance may or may not be sustained in future."** |
| A fund's size | **Fund size … cr** | `funds.jsx:94` | **AUM**, value in **Cr** |
| Periods | **FY 26-27** · **FY 2025-26** · **AY 2025-26** | `ledger.jsx:61`; `book.jsx:118,215` | **FY 2026-27** |
| Empty fund search | three wordings | `funds.jsx:117`; `funds.html:47,76` | one string (M-18) |

**Conflicts that change a fact, not just a word: switch/SIP change · mandate/NACH mandate · exchange/RTA ·
Placed-as-heading. The other nine are style.**

## 1.3 · Refusals — what / why / fix

Audited all ten. **Seven pass in full.**

| Refusal | What | Why | Fix in the same breath |
|---|---|---|---|
| Bucket 2, over the ceiling (`refusals.jsx:19`) | ✅ | ✅ | ✅ two chips |
| Bucket 4, not understood (`refusals.jsx:28`) | ✅ | ⚠️ never says why it missed | ✅ three chips |
| Bucket 5, out of scope (`refusals.jsx:39`) | ✅ | ✅ | ✅ — the best-written refusal in the product |
| Bucket 6, an instruction that would act (`refusals.jsx:48`) | ✅ | ✅ | ✅ preview then confirm |
| Refinement miss (`funds.jsx:193`) | ✅ | ✅ | ✅ |
| Uncosted target (`rebalance.jsx:74`) | ✅ | ✅ | ✅ |
| Artifact failed (`answer.jsx:134`) | ✅ | ✅ | ✅ "Try again" |
| In-flight unknown (`moves.jsx:149`) | ✅ | ✅ | ✅ check, never resend |
| **Partial execution (`moves.jsx:148,170`)** | ✅ | ✅ | ❌ the fix names the wrong mandate — **M-4** |
| **Ledger rejection (`book.jsx:253`)** | ✅ | ✅ | ❌ no fix at all — **M-9** |

Bucket 4's missing "why" is worth one clause:

**Replace `refusals.jsx:28` with**
> "I did not follow that — I could not find a client or an action in it. I can look up a client, profile
> their risk, explain a drift, or search funds. Which is closest?"

## 1.4 · Empty states

All seven say what to do, not "no data": `FUND_EMPTY` (`funds.jsx:117`), the proposal table
(`proposal.jsx:124`), the ledger table (`ledger.jsx:57`), the drawer's three lists, and the prototype's
event log. **Parameter F3 is met** with two exceptions already filed: **M-29** (Home omits rather than
empties) and **M-18** (one condition, three wordings).

## 1.5 · Numbers in sentences

Indian grouping is used everywhere a figure is rendered — `inr()` (`book.jsx:372`) uses `en-IN` and no
hand-written figure in `screens/` breaks it. **A4's grouping half is met.** The figure-before-explanation
order is met on every screen except `rebalance.jsx:85` (**M-6**), where the label comes first because it is
the grammatical subject. Format conflicts are **M-15**, **M-16** and **M-31**.

---

# Section 2 — Anaya · Domain & Compliance

19 findings: **2 blocker, 6 high, 9 medium, 2 low**, plus the persona note.

## 2.1 · SEBI / AMFI presentation

### A-1 · BLOCKER · H1, H2 — the standard risk disclaimer is on no screen, and the component for it exists

**Where** absent from all of `screens/`. `DisclosureBlock` is built, exported and unused:
`design-system/components/cards/DisclosureBlock.jsx:4`

**Now** the component's default text is correct and no screen mounts it:
> "Mutual fund investments are subject to market risk. Read all scheme-related documents carefully. Past
> performance is not indicative of future returns."

The only standing line in the product is `StandingDisclosure` — *"Sentinel assists an advisor · not
investment advice"* — which is a statement about **Sentinel**, not about **mutual funds**. They do
different jobs and one does not cover the other.

**Why it fails** Two surfaces make this material rather than theoretical:
1. **Journey D's proposal is emailed to a client** (`proposal.jsx:104`: "Sending this emails him the
   document"). A scheme recommendation for six named schemes leaves the product with no AMFI disclaimer on it.
2. **Journey C's fund page shows a return** (`funds.jsx:87`). It carries the past-performance caveat and not
   the market-risk line.

This is also the owner's parallel rule in reverse: the component built for the mandated disclosure is on no
screen, and `report:parallel` counts it in the 42.

**Replace with** — mount `DisclosureBlock` at the foot of `ProposalResult` (`proposal.jsx:128`, inside the
`ResultCard`, above `ResultActions`) and at the foot of `FundDetail` (`funds.jsx:98`), with the text left
at its default. On the proposal it must also appear in the sent PDF, so the confirm sheet's rows
(`proposal.jsx:110–115`) gain a fifth:
> `{ label: 'What the document carries', value: 'The AMFI risk disclosure' }`

**Owner's note:** the wording is compliance's to supply, the same as `StandingDisclosure`. The component's
default is the standard AMFI text and should be treated as `[PLACEHOLDER — Centricity compliance to confirm]`
until they do.

---

### A-2 · BLOCKER · H2 — a fund's own page shows a return and no riskometer

**Where** `screens/journey-c/funds.jsx:68–99` (`FundDetail`). `grep -r riskometer design-system/components/`
returns **zero** — no component in the system renders one. The band is in the data
(`book.jsx:40–49`, six-band values) and appears on exactly one screen as a caption string:
`proposal.jsx:76`.

**Now** the fund card (confirmed on `journey-c/funds.html` phone 4) shows: the name, the house, the
category, "On your shelf", **21.4%**, "Three-year CAGR · against Nifty 500 TRI", the past-performance
caveat, 1Y/3Y/5Y, the provenance line, and four stats — Expense ratio, Fund size, Held by your clients,
Exit load. **No riskometer band anywhere.**

**Why it fails** The riskometer is required per scheme on any surface presenting a scheme, and this is the
scheme surface — the one an advisor opens to decide, and reads to a client. The product has decided
(`DNA.md:91`) that the band is a **word**, never a dial, which is exactly right and makes this cheap to fix.
Showing a 21.4% three-year number with no risk band beside it is the presentation the rule exists to
prevent. Note it also breaks the product's own rule 1 in spirit: "Very high" is the word that carries the
identity and it is missing.

**Replace with** — a fifth stat on the perf branch (`funds.jsx:92–97`) and a third on the locked branch
(`funds.jsx:79`), before Exit load:
> `{ label: 'Riskometer', value: fund.riskometer }`

giving "Riskometer — Very high". No new component, no restyle.

---

### A-3 · HIGH · H2 — "No exit load, no tax" and "it stops the drift coming back", on the confirm sheet

**Where** `screens/journey-b/moves.jsx:20`, rendered inside the confirm sheet at `05-decide.html:56` and
`rebalance.html:84`

**Now** "Redirect his ₹30,000 monthly SIP — **No exit load, no tax, and it stops the drift coming back.**"

**Why it fails** Two problems, one sentence, sitting 60pt above "Approve both moves" (confirmed on
`journey-b/05-decide.html` phone 3):
1. **"No exit load, no tax"** is true of move 2 alone and false of the pair. Beside it on the same sheet is
   move 1, a switch, and 40pt below is a commit. `book.jsx:107` names this exact claim as the one the book
   has to support. It is also what produced M-1.
2. **"It stops the drift coming back"** is an unqualified forward statement. A SIP redirect stops *this*
   cause of drift; the market is the other cause, and `answer.jsx:39` says the market caused two of every
   three points of it.

**Replace with**
> "Redirect his ₹30,000 monthly SIP — No exit load and no tax on this one, because nothing is sold. It
> stops the SIP adding to the drift each month."

---

### A-4 · HIGH · H3 — "Client consent · Required" sits above an enabled commit and nothing captures it

**Where** `screens/journey-b/moves.jsx:34` (`CONFIRM_ROWS`), rendered on `05-decide.html:56,75`,
`rebalance.html:84,124` and `prototype.html:342`

**Now** the sheet's three rows are Compliance shelf — Passed · Single-fund ceiling — No fund over 25% ·
**Client consent — Required**. The commit below them is enabled and reads "Approve both moves".

**Why it fails** Confirmed on the render. Journey D taught the advisor a different contract: there, a row
marked blocking (`PROPOSAL_BLOCKERS`, KYC and nominee) actually prevents placement and says so. Here the
word "Required" is stated and then nothing follows from it — no capture, no attestation, no date, and the
commit does not change. The most expensive error class in an advisory product is a trade placed without a
recorded instruction from the client, and this sheet lets it happen while displaying the word that should
stop it.

**Replace with** — the row states what the advisor is attesting, so approving is the record:
> `{ label: 'Client consent', value: 'You confirm you have it', tone: 'required' }`

and the disclosure (see M-2's replacement) ends:
> "Approving records that R. Sharma instructed these two moves, on 19 Sep 2026, under your ARN."

**Owner's note:** whether an attestation is sufficient or a stored consent artefact is required is
`[PLACEHOLDER — Centricity compliance to confirm]`. The design must not ship with the word "Required" and
nothing behind it either way.

---

### A-5 · HIGH · H3 — the confirm names an authority it never shows

**Where** `screens/journey-b/moves.jsx:30` and `:204`; `screens/data/book.jsx:29–30`

**Now** "These two switches run under **your ARN**." The ARN itself is
`"ARN-[PLACEHOLDER — the firm's own registration]"` and the EUIN is `'E[PLACEHOLDER]'`, and **neither is
rendered on any screen** — the only use of `ADVISOR` anywhere in `screens/` is `ADVISOR.clients` in the
drawer's search placeholder (`drawer.html:61`).

**Why it fails** `DNA.md:35–39` is explicit that ARN and EUIN are not decoration and that the confirm sheet
is where the product names whose authority is being used. It names it in the abstract. An ARN holder with
staff, or a partner transacting under a firm's ARN with their own EUIN, cannot tell from this sheet which
registration and which individual the transaction will carry — and the EUIN is the field that says who
advised it.

**Replace with** — two rows on the confirm sheet (`moves.jsx:31`), above Compliance shelf:
> `{ label: 'Runs under', value: ADVISOR.arn }`
> `{ label: 'Advised by (EUIN)', value: ADVISOR.euin }`

and the disclosure's first clause becomes "These two moves run under ARN-XXXXXX, advised by EUIN EXXXXXX."
Both values stay `[PLACEHOLDER — the firm's own registration]` until supplied; showing the placeholder is
more honest than showing nothing.

---

### A-6 · HIGH · H3, E4 — the confirm promises a notification the product does not send

Same defect as **M-1/M-2**, restated from the Suggest → Confirm → Execute angle: the confirm sheet is the
one surface where every statement must be a thing that will happen. "Sharma gets a note explaining both
moves and what they cost" is not. Fix is M-2's replacement.

---

### A-7 · HIGH · E2 — the card enclosing the invented returns says "from the scheme record"

**Where** `screens/journey-c/funds.jsx:125` (the `ArtifactCard` around the shortlist)

**Now** `provenance="As of 30 Sep · from the scheme record and your own book"`

**Why it fails** `perfProvenance()` (`book.jsx:89`) is described in the book as *"THE ONLY PROVENANCE LINE
THIS DATA MAY CARRY"*, and `FundDetail` uses it correctly (`funds.jsx:91`). But every row of this table
expands into a `FundDetail`, so the outer card's line is a second provenance claim that sits above the
invented figures and says they came from a scheme record. The book's own header (`book.jsx:65–67`) rules
this out in as many words: *"it may NOT print a provenance line claiming they came from a scheme record."*
This is the one thing E2 exists to stop.

**Replace with** (`funds.jsx:125`)
> `provenance="As of 30 Sep · names, houses and categories from the scheme record; your holdings from your own book"`

The same line at `funds.jsx:78` (the locked branch) is fine as it stands — that card shows no returns.

---

### A-8 · MEDIUM · E5 — "Review Sharma's portfolio" still opens a drift answer

> **Note — this file moved under me.** When this audit began, `screens/prototype.html:50` read
> `{ id: 'drift', re: /\bdrift|why .*\b(mix|allocation)|sharma/i }` and the `who` bucket sat last, so the
> bare word `sharma` won four of five sentences: *Review Sharma's portfolio*, *Build a proposal for
> Sharma*, *Start Sharma risk profile* and *What has Sharma placed this month?* all opened a drift answer.
> **A concurrent session fixed most of that while this audit was running** (uncommitted, tagged F-45): the
> pattern is now `sharma(?:'|’)s (portfolio|mix|book)` and `who` has moved above `drift`. Three of the four
> cases are closed. The finding below is against the file **as it stands now**, re-verified by evaluating
> the current patterns in the page's own order.

**Where** `screens/prototype.html` — the `drift` route is still tested **before** `review`

**Now**

| Typed | Bucket it lands in |
|---|---|
| "Review Sharma's portfolio" | **drift** ❌ |
| "Build a proposal for Sharma" | propose ✅ |
| "Start Sharma risk profile" | risk ✅ |
| "What has Sharma placed this month?" | ledger ✅ |
| "Sharma" | who ✅ |

**Why it fails** Parameter E5 is *nothing is guessed at*, and the page's own note says *"Bucket 4 is last
and is the default: nothing is guessed at."* An advisor who types the verb **review** has said what they
want; a possessive pattern matched on a client's name should not outrank an explicit verb. This is also the
exact sentence journey F is built to answer (`REV_ASK`, `review.jsx:21` — "Review Meera's portfolio"), so
the one client the drift journey uses is the one client whose review cannot be reached by typing.

**Replace with** — move the `review` route above the `drift` route. No pattern changes. Verified against the
current set:

| Typed | After |
|---|---|
| "Review Sharma's portfolio" | review ✅ |
| "Why did Sharma's portfolio drift this quarter?" | drift ✅ |
| "Rebalance Sharma" | rebal ✅ |
| "Sharma" | who ✅ |

---

### A-9 · MEDIUM · H2 — three wordings of one mandated caveat

**Where** `screens/journey-c/funds.jsx:90` · `design-system/components/cards/InfoCard.prompt.md:5` and
`design-system/pages/InfoCard.html:25,29,76` and `design-system/pages/RangePills.html:45` ·
`design-system/components/cards/DisclosureBlock.jsx:4`

**Now**
1. "Past performance may or may not be sustained in future." — the screen
2. "Past performance does not indicate future returns." — the spec pages and the prompt
3. "Past performance is not indicative of future returns." — `DisclosureBlock`

**Why it fails** A mandated line is a quotation, not copy. Three variants means nobody is treating it as
mandated, and the spec pages are what a future screen will copy from.

**Replace with** (1) everywhere — it is AMFI's own phrasing:
> "Past performance may or may not be sustained in future."

`InfoCard`'s `caveat` prop should carry it as its default rather than leaving each caller to write one.

---

### A-10 · MEDIUM · H5 — "the exchange" for a NACH mandate change

**Where** `screens/journey-b/moves.jsx:147` and `:155`

**Now** "Both moves are with the exchange." · "Sent · waiting for the exchange"

**Why it fails** An MFD places a switch through BSE StAR MF or NSE NMF II, so "the exchange" is defensible
for move 1. Move 2 is a NACH mandate change, which goes to the registrar and the sponsor bank and never
touches an exchange — and the product knows it, because the rejection three states away reads "The RTA
rejected the change" (`moves.jsx:139`). See M-28 for the wording fix; the domain point is that the two
moves genuinely do not travel the same road, and a single accurate word ("the registrar") covers both
without pretending they do.

---

### A-11 · MEDIUM · H5 — "switch" applied to a SIP redirect

Domain restatement of **M-3**. In the Indian market these are two distinct instruction types with two
distinct forms, two distinct rejection reasons and two distinct tax consequences. An ARN holder who reads
"these two switches" to a client and then files a SIP-change form has been given the wrong word by the
product. The ledger already has it right. Fix is M-3's replacement.

---

### A-12 · MEDIUM · H4 — the rebalance confirm never mentions KYC, and the proposal confirm does

**Where** `screens/journey-b/moves.jsx:31–35` (`CONFIRM_ROWS`) against
`screens/journey-d/proposal.jsx:110–115` (`PROP_CONFIRM_ROWS`)

**Now** the rebalance sheet's rows are Compliance shelf · Single-fund ceiling · Client consent. The
proposal sheet's rows include "Before anything can be placed — CKYC clear · nominee on file."

**Why it fails** Sharma's KYC is Valid (`book.jsx:135`) so nothing on this screen is factually wrong. But
journey D teaches the advisor that a confirm sheet states KYC, and journey E's sheet — which moves real
money, where journey D's moves none — does not. A row that appears only when it blocks teaches the advisor
that its absence means nothing was checked.

**Replace with** — a fourth row on `moves.jsx:31`, stated whether or not it blocks:
> `{ label: 'KYC', value: 'Valid · KRA · 3 Aug 2025' }`

---

### A-13 · MEDIUM · H1 — the standing disclosure is present and is not legible

**Where** `design-system/components/text/StandingDisclosure.jsx:7`, rendered by `Dock` on every thread and
rail screen (`thread.jsx:59`, `rail.jsx:106` — `Dock`'s `disclosure` defaults to `true`, so no screen
forgets it)

**Now** `fontSize: var(--text-11)` in `--color-data-deemph` (`#a39a91`) on the `#f6f4f1` canvas.
**Measured contrast: 2.52 : 1.** Confirmed on every phone rendered for this audit — it is the faintest text
in the product.

**Why it fails** Parameter H1 is "present **and legible**, not buried". It is present on all eleven screens,
which is more than most products manage, and at 11px and 2.5:1 it is decoration. Anaya's own bar is 14px
minimum for compliance copy at full contrast; WCAG AA for body text is 4.5:1.

One surface has it obscured rather than faint: `screens/shell/drawer.html` draws `Home` behind the open
drawer (`drawer.html:34`), so Home's Dock and its disclosure sit under the scrim. That is defensible — the
drawer is transient and the disclosure returns the moment it closes — and is recorded so it is not reported
as missing.

**This is a restyle, so it is the owner's call, not a fix I will write.** What can be said from the copy
side: the component's header (`StandingDisclosure.jsx:5`) commits compliance's future wording to *"one line
at 11px inside 343px"*, which pre-decides the size before compliance has spoken. That constraint should be
removed from the contract, so the line can be sized to be read.

**Replace with** (`StandingDisclosure.jsx:4–5`, the comment only)
> "[PLACEHOLDER — compliance to supply]. Size and contrast are open: this line is mandated copy, so it is
> set to be read, not to fit. Whatever compliance supplies, the layout yields to it."

---

### A-14 · MEDIUM · H5 — the whole shelf is direct plan, in a product for ARN holders

**Where** `screens/data/book.jsx:40–49` — all ten funds carry `plan: 'direct'`. Rendered as "Direct plan" in
the proposal's row detail (`proposal.jsx:76`) and as a query chip (`funds.jsx:33`). The fund table has no
Plan column (`funds.jsx:39–44`).

**Why it fails** A direct plan pays the distributor nothing — the book says so itself at `book.jsx:37`. So
every journey in this product has an ARN holder building, costing and placing business that earns them
nothing, and no screen remarks on it. This is `CONTINUE-HERE.md:24`'s open R4 (the fee and commission
question) showing up as a content problem rather than a data one: the one fact an MFD checks first about a
scheme is which plan it is, and it is visible only if you open a row.

**Replace with** — two things, neither of which needs the missing commission figures:
1. A **Plan** column on the fund table (`funds.jsx:39–44`), between Category and Shelf:
   `{ key: 'plan', label: 'Plan', kind: 'text' }` with value "Direct" or "Regular".
2. A sentence on the shortlist turn (`funds.html:65`, appended):
   > "Everything on your shelf today is a direct plan. I do not hold commission figures, so I cannot tell you what any of this earns you."

**Owner's note:** whether Centricity's real shelf is direct, regular or both is
`[PLACEHOLDER — Centricity to confirm]`. The screens must not imply an answer either way, and today they
imply direct-only by silence.

---

### A-15 · MEDIUM · H5 — sharing a client's risk profile without saying what is shared

**Where** `screens/journey-a/rail.jsx:61` (chip) and `rail.jsx:208–211` (`SHARE_SHEET`)

> **Note:** `rail.jsx` was edited by a concurrent session during this audit (uncommitted, tagged F-45 —
> `RailAsk` became a real composer). `SHARE_SHEET` moved from :194 to :208; every other `rail.jsx` line
> cited in this document is above the change and is unmoved. All line numbers here are re-verified against
> the working tree as of the end of this audit.

**Now** chip "Share with Meera on WhatsApp"; the sheet says
> "This build prepares the summary and hands it to your own share sheet — it does not send anything on its own."
> "Nothing leaves Sentinel until you pick a channel and send it there."

**Why it fails** Both sentences are about the mechanism and neither says **what** is in the summary. The
advisor is about to put a client's income, spending, emergency fund, drawdown tolerance and risk score into
WhatsApp. Under the DPDP Act the purpose and the contents of a disclosure are the thing that has to be
clear, and "the summary" is not.

**Replace with** (`rail.jsx:210`, a new first line)
> "The summary carries her risk number, her band, and the three scores behind it. It does not carry her
> income, her spending or her PAN."

keeping the two existing sentences after it. If the summary *does* carry her income, the sentence changes
to say so — it must not be written until someone decides what is in it.

---

### A-16 · MEDIUM · H4 — the proposal blockers stop, and do not hand back a path

Domain restatement of **M-23**. The two blocking rows are exactly right about *what* blocks — CKYC and a
nominee or signed opt-out are the two real gates — and give the advisor nothing to do about either. This is
the highest-value place in the product to keep the product's own refusal rule, because it is the one gate
that costs the advisor a client's first investment. Fix is M-23's replacement.

---

### A-17 · LOW · E3 — the period is named in words, everywhere it appears

**No defect.** `perfNote()` (`book.jsx:93`) writes "Last 12 months" / "Three-year CAGR" / "Five-year CAGR"
and `funds.jsx:87` renders it under the figure with the benchmark. Confirmed on
`journey-c/funds.html` phone 4: **21.4%** with "Three-year CAGR · against Nifty 500 TRI" beside it.
**Parameter E3 is met.** Recorded so the next audit does not re-open it.

---

### A-18 · LOW · E2 — the invented data is never presented as a scheme record, with one exception

**Almost clean.** `PERF` carries `fixture: true` on every row (`book.jsx:75–84`), `perfProvenance()` is the
only line the data may carry, and `FundDetail` uses it. It is rendered on exactly one screen, journey C, and
nowhere else — journeys B, D, E and F show no returns at all, and journey D's own note
(`proposal.html:152–157`) says why. **The one exception is A-7**, the enclosing card's provenance line. Fix
that and E2 is met in full.

---

### A-19 · LOW · H3 — journey D's confirm is the model the others should copy

**No defect, recorded as the benchmark.** `PROP_CONFIRM_ROWS` (`proposal.jsx:110–115`) states What is sent ·
To · What it commits ("Nothing") · Before anything can be placed. The disclosure (`proposal.jsx:104`) says
exactly what sending does and does not do. Journey B and E's sheet should be brought to this standard —
see A-4, A-5 and A-12.

---

## 2.2 · Persona — the seat that is empty

The book has four **clients** and exactly **one advisor**: `ADVISOR` (`book.jsx:26–33`) — Centricity
WealthTech, **512 clients**, a full book with a drift, a KYC in process, a review due and a 43-fund tail.
That is the **established MFD**. The **new ARN holder with 20 clients** — the partner Centricity's B2B2C
model actually has to activate, who may be an ex-bank RM, a retiree or a student, and who is afraid of making
an error on someone else's money — is on no screen. Five things change for them:

| Screen | What breaks at 20 clients | What it needs |
|---|---|---|
| **Home** (`home.jsx:24–28,55`) | `NAMED` is three named clients with work waiting. A new partner has none, and the card is **omitted** — a greeting, three chips, a composer, and no orientation. | The empty-state card of **M-29**, plus a fourth ready prompt that is not about the book: "Show me what Sentinel can do" |
| **Journey C** (`funds.jsx:37`) | `heldLine` returns **"None of your clients"** on nearly every row, so the column that carries this journey reads as a verdict on each fund. | Change the value to **"Not yet"** and, when the advisor holds nothing anywhere, drop the column and say it once above the table: "None of your clients hold any of these yet — the column comes back when they do." |
| **The confirm sheet** (`moves.jsx:30`) | **"under your ARN"** is wrong for a partner who transacts under the firm's ARN with their own EUIN. | A-5's two rows, which name the ARN and the EUIN separately and make the distinction visible: "Runs under — ARN-XXXXXX (Centricity WealthTech)" / "Advised by (EUIN) — EXXXXXX" |
| **The drawer** (`drawer.html:61`) | Placeholder reads `Search ${ADVISOR.clients} clients` → "Search 20 clients", and the 3/7/8 caps with "See all" never trigger. | Below 20, drop the caps and the "See all" rows; the placeholder becomes "Search your clients" |
| **The standing answer** (`refusals.jsx:66–72`) | Four of the five capabilities assume a book — "Explain why a portfolio drifted", "Search funds on your shelf", "which of your clients already hold them". | One row added for the first day, first in the list: `{ question: 'Add your first client', note: 'Name, PAN and KYC — then everything below works on them' }` |

**The two-word version:** the established MFD is designed for and the new partner is assumed. Every surface
that draws on the book degrades to *nothing here* rather than to *here is how to start*, which is the first
impression parameter F3 was written about.

---

# What I would fix first

1. **M-1 + A-3 + M-2** — the client note says there is no tax on a ₹11,200 transaction, the confirm sheet
   promises a note that is never sent, and "no exit load, no tax" sits 60pt above the commit. One journey,
   three sentences, all three wrong in the direction of comfort. This is the only copy in the product that
   reaches a client, and the replacements are written above.
2. **A-1 + A-2** — no AMFI risk disclaimer anywhere (the component exists and is on no screen), and no
   riskometer on the one surface that shows a return. Both are one-line additions using components and data
   already in the repository.
3. **M-3 / M-4 / M-7 / M-8 / A-10** — the four terminology conflicts that change a fact: switch vs SIP
   change, mandate vs NACH mandate, "Placed" as a heading over rejected rows, and exchange vs registrar.
   These are the ones an advisor gets corrected on in front of a client.

---

*Written against `studio/audit-2026-09-19/parameters.md`. No product code changed. Every replacement above
is a sentence, not a direction — paste it and the finding closes.*
