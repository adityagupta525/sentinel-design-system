# The Fund Explorer, chat-led — what it becomes, and what we already have

**19 Sep 2026 · after reading the Fund Discovery PRD and ~320 reference screens in `all-screens/`**

Ashish's worry, in his words: *"chatbot hona chahiye, lekin aisa nahi dikhna chahiye ki wo poora ek
page hi khol ke de de."* That is the whole design problem. The PRD is a good product document and it is
written for a **page**; our job is to keep its content and refuse its shape.

---

## 1 · What the references actually do well

Read at 1×, not skimmed. The Parag Parikh screens (`IMG_4566`–`4580`) are the fullest example.

| What they do | Why it is good | What we already have |
|---|---|---|
| **"If ₹10k Invested — This fund 18.33% (₹92,153) · Nifty 500 13.03% (₹50,540)"** as the headline | It is not a CAGR, it is **what ₹10,000 became**. That is the sentence an advisor reads to a client. A percentage needs translating; a rupee figure does not | Our whole discipline: a figure with its meaning attached |
| Fund **and** benchmark on one chart, two lines, labelled in text as well as colour | Never a lone number | `ChartLine` — **built, on no screen** |
| **Three values on one scale**: Category Avg 2.60 · This Fund 1.62 · Benchmark 1.43 | You see the gap, not three separate pictures | `Dumbbell` — built, used in the rebalance |
| **Size breakup**: one stacked bar + a legend list with the % | The PRD asks for exactly this ("one horizontal bar graph via toggle / pills") | `AllocationCard` |
| **Sector allocation with a month pill row** (Jun'26, May'26, Apr'26…) | Allocation *over time*, which is the PRD's "how has it changed" | `ChartBar` + `RangePills` |
| **"Monthly Changes Updates"** — *"AUM increased by 1.9K Cr in last 1M"*, *"May'26 return underperformed benchmark"* | **Narration as data.** The PRD calls it "AI narration"; it is really a short stream of plain sentences with numbers in them | `SentinelText`. This is the thing Sentinel is *best* at and it is the reference's weakest execution |
| **Compare is in the top bar**, beside share | Compare is a first-class verb, not a menu item | — new |

**What we deliberately do not take:** green and red fills for good and bad news (rule 2 — bad news is
text on the peach bubble, never a fill), the two dark-blue hero headers, and the bottom-pinned
One-Time / SIP buttons (nothing is pinned above the composer).

---

## 2 · The PRD, and where we improve on it

The PRD is strong on **content** and silent on **sequence**. It lists everything a fund one-pager
holds, splits it L1 / L2, and falls back to *"download the PPT"* when the chat cannot render more.

Three places we should not follow it:

**(a) "Download the PPT" is a surrender, not a fallback.** It appears four times. In our product the
honest ladder is: **peek → expand in place → a follow-up turn**. Each step is asked for and each arrives
as a turn in the thread, so it scrolls with the question that caused it. A PPT is the right answer for
something an advisor mails to a client — not for something they are reading now.

**(b) L1 / L2 is a page idea.** Ours is already better and already built: `ArtifactCard` has
`peek → expanded`, and the thread carries the scroll. L2 is not a second card; **L2 is the next turn**,
and it only exists if asked for. That also solves the worry about opening a whole page.

**(c) The PRD has no WHO.** Every journey in it starts with a fund. Ashish's point is the opposite and
he is right: *"risk profiling"* typed alone should produce **a client list to pick from, or the option
to type a name** — and only then the journey. Same for a proposal, a rebalance, a review. **This is the
biggest single gap between the PRD and a usable product**, and it is not a fund problem — it is every
journey's first step.

---

## 3 · What we build — and the shape it takes

### 3.1 · The WHO step — one component, six journeys

A new turn: **the client picker**. Sentinel asks *"Which client?"* and offers
- the advisor's **recent** clients as rows (from the book),
- a **search field** that filters as you type,
- and the composer stays live, so *"Meera"* typed as a sentence works too.

It appears **only when the journey needs a client and the sentence did not name one**. *"Start Meera's
risk profile"* skips it entirely — the router already knows the name. That is the rule: **never ask for
something the advisor has already said.**

### 3.2 · The fund, in four asks — not four tabs

The reference has tabs (Overview · Holdings · Performance · Peer Analysis). Tabs are a page. In a
thread the same four things are **four things you can ask**, offered as chips under the fund card:

| Ask | What arrives | Built from |
|---|---|---|
| *(default)* the fund card | Name, badges, **"₹10,000 invested at launch would be ₹92,153 — the index would be ₹50,540"**, the two-line chart, TER · AUM · riskometer · exit load, who of your clients hold it | `ArtifactCard` + `ChartLine` + `InfoCard` |
| **"How has it done against its category?"** | Three marks on one scale — category, fund, benchmark — for the chosen period | `Dumbbell` ×3 |
| **"What is it holding?"** | Equity/debt split, the size breakup bar, sector allocation with the month pills | `AllocationCard` + `ChartBar` + `RangePills` |
| **"What changed recently?"** | The monthly-changes stream as sentences, tone in the words | `SentinelText` |

### 3.3 · The four verbs Ashish named — and they belong on the fund, not in a menu

Under every fund card, as chips inside the turn:

- **Compare with…** → a second fund joins; the card becomes a comparison (max 3, per the PRD)
- **Add to a proposal** → the list of saved proposals, or a new one → Journey D
- **Attach to a rebalance** → saved rebalances, or a new one → Journey E
- **Send for review** → Journey F, for a named client

Each is a **hand-off to a journey that already exists**. That is the point: the Fund Explorer is not a
silo, it is the place the other five journeys are entered from with a fund already chosen.

### 3.4 · "Which of my clients hold this?"

The PRD asks for it three times. **We already have it** — `holdersOf()` in `funds.jsx` does the reverse
lookup, and the fund card already shows the count. It becomes a chip that opens the names and their %.

---

## 4 · What is missing before any of this can be built

Honest list, because three of these are data decisions and not design:

1. **A NAV series.** Every good thing above rests on a line. `ChartLine` is built and on no screen
   because `book.jsx` has point returns, not a curve. **This is the one blocker.**
2. **Holdings per fund** — for the size breakup, the sector split and any overlap that is not an em dash.
3. **Category averages and benchmark series** — for the three-marks-on-one-scale.
4. **The Centricity Score**, which the PRD leads with. **20 Sep 2026 — the owner: the definition does
   not exist yet, and the score is on FUND PERFORMANCE and CLIENT HOLDING.** So the basis is settled
   and the methodology is not. It is built as a placeholder on exactly that basis — two halves, its own
   record 70 and how your book holds it 30 — with the weights printed on the card and a provenance
   line that says "a design placeholder, not Centricity's methodology" in words. When the real
   definition arrives, `FUND_SCORE_WEIGHTS` and the five mappings in `book.jsx` are what change; the
   card, the band words, the turn and the shortlist column do not.

Items 1–3 can be fixtures, clearly labelled the way `PERF` already is. **Item 4 still cannot be
invented** — a score with a made-up methodology is the one number an advisor must never defend — and
the placeholder answers that by never hiding: every input is a field already in the book, the weights
are on the card, the weakest component is named in the sentence, and a half that cannot be read is
withheld rather than assumed.

---

## 5 · The order I would build it in

1. **The WHO step** — one component, and it improves six journeys immediately. No new data needed.
2. **The fund card with "₹10,000 would be…"** — needs the NAV series fixture.
3. **The four verbs** as hand-offs, since the destination journeys all exist.
4. **Compare** — the largest single piece, and the PRD has its columns already.
5. **Holdings and sector over time** — needs the holdings fixture.

**Nothing in the visual language changes.** Every screen above is drawn from components that exist; the
three that are new (`ClientPicker`, a comparison table, the changes stream) are new **components**, not
a new style, and each gets a contract and a spec page before a screen uses it.

---

## 6 · How a visual lives inside a chat — the part the references cannot teach us

Across all 320 screens the industry uses about **twelve visual devices**. They are all designed for a
page you scroll and return to. A thread is different in three ways that decide everything:

- a turn is **read once, in order** — it cannot be returned to by tapping a tab;
- it **scrolls away**, so nothing may depend on staying on screen;
- it sits in a **375-wide column with a composer under it**, so height is the scarce thing, not width.

So each device needs a rule. This is the table I would hold every future fund screen to:

| Device in the references | Their shape | **Ours, in a thread** |
|---|---|---|
| **Tabs** (Overview · Holdings · Performance · Peer) | Four pages behind one header | **Four chips under the card.** Each tap adds a turn. The thread becomes the tab history, and scrolling back IS going back |
| **Accordion sections** (Groww's dark fund page: Returns ▾ Expense ▾ Fund management ▾) | Ten collapsed rows on one page | **Never ten.** The three an advisor asks for most are chips; the rest arrive through "what else is in here?" |
| **Line chart** (fund vs benchmark) | Full-bleed hero, 300pt tall | **A peek at 96pt inside `ArtifactCard`, expanding in place.** Two lines, both labelled in text — never colour alone |
| **Stacked bar + legend** (size breakup) | Bar, then a legend list | Unchanged. `AllocationCard` is already this, and it is our best-fitting borrow |
| **Three marks on one scale** (Category · Fund · Benchmark) | A gradient rail with pins | **`Dumbbell`, three rows, one scale.** Ours already refuses the gradient: the rail is neutral and the marks carry the numbers |
| **Donut** (portfolio analyser) | 200pt circle + legend | **Do not use.** A donut needs a legend to be read, which doubles its height, and at 375 a stacked bar says the same thing in a third of the space. We have no donut and should not add one |
| **Month pills** (sector allocation over time) | A scrolling row above a chart | `RangePills`, unchanged — but the count must match the data (F-46 was exactly this) |
| **"Monthly changes" stream** | Green and red pills | **Sentences.** *"AUM rose ₹1,900 cr in the last month."* · *"May's return was under its benchmark."* Tone in the words, never a fill — rule 2 |
| **Peer comparison table** | Wide table, horizontal scroll | `DataTable` with the sticky column, and **three funds maximum**, which is the PRD's own limit |
| **Pros and cons** | Two lists with ticks and crosses | **One list, plain sentences.** A tick and a cross are colour-and-icon encoding a judgement we have not defended |
| **Return calculator** (slider → "₹5,000 becomes…") | A slider and a bar chart | **`MoneyComposer` and a sentence.** An advisor types the amount; the answer is a figure with its meaning attached. No slider — a slider invites a number nobody chose |
| **Bottom-pinned Buy / SIP** | Two buttons over the content | **Never.** Rule: nothing is pinned above the composer. The action is a chip in the turn that offered it |

### The one rule that keeps it a chat and not a page

**A turn answers one question.** If a card needs a tab bar to be understood, it is two answers and it
should be two turns. That single rule is what stops the fund one-pager becoming the page the PRD
describes — and it is why the four chips in §3.2 are better than the four tabs they replace.

### Where the visuals get better than the references, not just smaller

1. **Every figure keeps its sentence.** The references put "18.33%" in a hero and its meaning in 11px
   grey. We already put *"Three-year CAGR · against Nifty 500 TRI"* on the line beside it — and
   **"₹10,000 would be ₹92,153"** is that idea taken further.
2. **The narration is the product.** Their "Monthly Changes" pills are the weakest execution of the
   strongest idea in the set. Sentences with numbers in them is what Sentinel does natively.
3. **Provenance.** Not one of the 320 screens says where a figure came from or how complete it is.
