# Sentinel — the demo script

**Everything you can type, and where it goes.** Written 20 Sep 2026 for a live demo of
`screens/prototype.html`. Every sentence below is routed by the prototype's own router, so **typing it
and tapping it reach the same place** — which is the rule the product is built on, applied to its own
index of itself.

Type `what can I ask?` in the app and Sentinel lists the seven headline ones itself.

**Every line in this file is driven before it is written down.** `make it purple` and `Make the app
purple` are the two that deliberately reach nothing — that is the refusal being demonstrated. Everything
else resolves to a journey, an ask or a refinement.

---

## 1 · The seven journeys

| Type this | What opens |
|---|---|
| `Start Meera's risk profile` | **Journey A** — twelve questions, mostly one tap, ending in her locked number |
| `Why did Sharma's portfolio drift this quarter?` | **Journey B** — the trace, the answer, the artifact, the two moves, the confirm sheet |
| `Show me flexi cap funds on my shelf` | **Journey C** — the shortlist, and everything in §2 below |
| `Build a proposal for Amit of 25 lakh` | **Journey D** — four questions, then where ₹25,00,000 would go |
| `Rebalance Sharma` | **Journey E** — the answer first, then the dials |
| `Review Meera's portfolio` | **Journey F** — it asks what the review is FOR before it writes anything |
| `What did I place this month?` | **The ledger** — every instruction, its status, what is unsettled |

**A name on its own** — `Meera`, `Sharma`, `Amit`, `Sunita` — asks what you want to do with them.
**A journey with no name in it** — `rebalance`, `review a portfolio` — asks which client first.

---

## 2 · Inside the fund explorer

With the shortlist on screen, these change **that list** rather than starting a new search.

| Type this | What it does |
|---|---|
| `under 0.7% TER` · `over 1%` | A **filter** — a removable chip, and the count moves. A bare percentage is read as the expense ratio, and the chip says so in words |
| `sort by cost` · `sort by size` · `sort by return` · `sort by score` | A **view** — the order changes, the count does not |
| `show 1Y` · `show 3Y` · `show 5Y` | A **view** — every figure is read at that period |
| `add Motilal Oswal` · `drop HDFC Flexi Cap` | A fund **by name**; it stays whatever the filters say |
| `add HDFC` | **Ambiguous** — three funds carry that word, so it names all three and asks |
| `only direct` | Narrows to one plan |
| `compare Parag Parikh with UTI Nifty` | Opens the comparison straight from the composer |
| `make it purple` | A **miss** — it names the three things it can do to a shortlist and changes nothing |

With a fund open, these five asks work as chips **and** as typed sentences:

`what is its Centricity score` · `how has it done against its category` · `what is it holding` ·
`what changed recently` · `who of my clients hold it`

And inside holdings: `by sector` · `top 10 stocks` · `how concentrated` · `overlap with`

---

## 3 · What it refuses, and how to show it

| Type this | What you are showing |
|---|---|
| `Sell all of Sharma's Quant Small Cap` | It **will not act** on a typed instruction. It prints exactly what that would do and asks you to confirm |
| `Invest ₹80,00,000 for Meera` | An amount **above a mandate ceiling** — it says which ceiling |
| `File Meera's ITR` | In the domain, **outside what this product does** |
| `Make the app purple` | It says plainly what it could not follow, and what it can do instead |
| `Review Nair's portfolio` | **Two clients share that surname**, so it binds nobody and asks which Nair |

---

## 4 · The things worth pointing at while you drive

- **The composer never goes away.** One screen in the whole product has none — the confirm sheet —
  and that is deliberate: commit or dismiss, no third path.
- **Nothing is pinned above the composer.** Every chip and every dark button sits inside the turn that
  offered it and scrolls away with it.
- **Every figure says where it came from.** The provenance line under a card, and the ⓘ beside a
  figure that an advisor will be asked about.
- **The scores are placeholders and say so.** The weights are printed on the card, the weakest
  component is named in the sentence, and a score built on too little of its inputs is **withheld** —
  Meera's health score is the one to show.
- **Bad news is text, never a fill.** There is no red panel anywhere in this product.
- **Attach a file** with the paperclip on any screen; it comes back as a turn you can remove.

---

## 5 · A five-minute run

1. `Show me flexi cap funds on my shelf` → `under 0.7% TER` → `sort by score` → open **Parag Parikh**
   → `what is its Centricity score` → `who of my clients hold it`
2. `Why did Sharma's portfolio drift this quarter?` → Expand → **Rebalance to his mandate** →
   **Approve both moves** → the confirm sheet → **Approve**
3. `Review Meera's portfolio` → pick **a meeting with her** → tap the ⓘ on *What she actually holds*
4. `Sell all of Sharma's Quant Small Cap` → the refusal
5. `what can I ask?` → the list, and everything on it is typeable
