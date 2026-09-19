# Is the feel missing? — a review against what shipped apps actually do

**19 September 2026.** The owner asked for a pass over current interface work — Mobbin, and the
inspiration sites — to judge one thing: *does Sentinel's design system leave a feel missing?*

## What I actually looked at, and what I did not

I went through **Mobbin**, which indexes screens from shipping production apps, using its MCP so the
screens came back as images I could read rather than as descriptions. Two searches, both aimed at
something Sentinel has to do:

- parsed search queries as editable chips — **Thrive Market, Yazio, Google Drive, Best Buy, Crouton,
  Shopify, PayPal, Fabric**
- an assistant answering a money question inside a thread — **Cash App, Cleo, Comet, Binance, Origin,
  Public, Lloyds, Base**

**I did not browse Dribbble, Behance or Awwwards for this.** That is a decision, not an omission. Those
sites carry *proposals* — work made to be looked at. Mobbin carries *products* — work made to be used,
by people who had to ship it. For a question about whether an advisor's tool feels right, a screen that
shipped is worth more than a screen that won something. If you want the award-site pass as well, say so
and I will do it separately and label it as what it is.

**I did not take anything visual.** Nothing in this repository changed colour, type, radius, shadow or
motion character because of this review. The three things I saw most often are things Sentinel bans on
purpose: emoji as tone (Cleo), photography (Yazio), and colour carrying identity (Binance's yellow, the
red-for-loss). Rule 1 exists precisely so an advisor never reads meaning out of a hue.

## Where Sentinel is already ahead

Worth saying first, because the honest answer to "is the feel missing?" is *mostly no*.

1. **The wait.** Lloyds says "Preparing a response" under a pulsing dot. Comet lists the sub-queries it
   is running. Sentinel's `ProgressTrace` names four real steps, keeps a real clock, can be **stopped**,
   and keeps what it had. Nothing in the sample does this as well.
2. **Provenance.** Not one of the eight assistant screens says where its number came from. Every figure
   in Sentinel carries a line saying where it came from and how complete it is.
3. **Refusals.** Public's Alpha carries a disclaimer under the composer. Sentinel names what it *can*
   do in the same breath as what it cannot, every time.

## The one thing that is genuinely missing: **a figure is never allowed to land**

Cash App's answer to "how much can I spend this week" **is the number** — `Net: +$16.95` at display
size, the period under it, the chart below. Cleo's is three lines of arithmetic that add up in front of
you. In both, there is a moment.

Sentinel's answers are disciplined and they are all the same shape: a sentence, then a chart, then a
provenance line. *"Equity 62% → 71%. Mostly the market."* is a good sentence — and the number that the
whole screen exists to deliver is set at body size inside it, then again inside a chart. **Nothing is
ever bigger than anything else.** Read four of our screens in a row and they have one volume.

This is not a missing component — but it is **not `HeroNumberCard` either, and my first draft of this
document was wrong about that.**

**Correction, 19 Sep 2026.** I wrote that `HeroNumberCard` is the instrument and that four screens
should adopt it. Reading its contract properly: it takes `value`, `badge` and **`rows: MeterRow[]` with
a binding row**. That is the risk result's own anatomy — three scores and the lowest one wins — not a
general headline figure. Forcing the drift answer into it would have been a component worn as a
costume.

**The instrument that does exist is `InfoCard`'s `figure` + `figureNote`** — the number in the display
face with its qualifier on the line beside it. The fund page now uses exactly that, and it is the first
place in this product where a figure lands: **21.4%**, and next to it *"Three-year CAGR · against Nifty
500 TRI"*. Compare it with the drift answer, where 71% is set at body size inside a sentence.

So the open question for the owner is narrower and more answerable than the first draft made it:
**should an answer turn be allowed to lead with its figure, and if so, with what?** The three candidates
are (a) `ArtifactCard` taking a display-size figure beside its title, (b) extending `InfoCard`'s
figure/figureNote pattern into a small shared block, or (c) leaving it alone because a thread is a
conversation and a conversation does not shout. **Nothing has been applied**, and it is the kind of
question the studio's design crit should settle rather than a note in a file.

## What I changed today, which needed no ruling

**The count now sits with the filters and moves.** Every parsed-query screen in the sample does this:
Thrive Market says "139 results" and drops to "36 results" as a chip goes, with a brief moment while it
recomputes; Best Buy puts the count on the commit button. Ours had the count **only** on the CTA, so
dropping a chip changed the shortlist silently and the advisor had to read the button to find out what
they had done. It is now stated under the chips, from the same function that builds the rows, so the two
cannot disagree — and at zero it says what to do rather than showing an empty table.

## Sources

Screens read on Mobbin: [Thrive Market](https://mobbin.com/screens/593949eb-eed0-4f9e-b2ee-409db5d1a327) ·
[Google Drive](https://mobbin.com/screens/d61666ff-4cd8-41b3-99c3-4d946b07a7f5) ·
[Yazio](https://mobbin.com/screens/abfb6d8a-d5c7-4db9-93c2-3ffce333f345) ·
[Best Buy](https://mobbin.com/screens/ddf654ce-f406-4543-b171-37fb14c69cdf) ·
[Crouton](https://mobbin.com/screens/390f2afc-ed71-48ab-a997-d9f1319742df) ·
[Shopify](https://mobbin.com/screens/0b0693a1-69d5-4f65-adcc-86c068187fbc) ·
[PayPal](https://mobbin.com/screens/1ec067ea-d421-4b14-9c44-20099cccd612) ·
[Fabric](https://mobbin.com/screens/09a76f56-621b-4aa4-a949-cadab70b99fb) ·
[Cash App](https://mobbin.com/screens/2d543e0f-4c65-44d5-8828-a35df58ba902) ·
[Cleo](https://mobbin.com/screens/7d3d7ae8-2d8b-4d72-a777-96310a594103) ·
[Comet](https://mobbin.com/screens/53bbb46b-728b-435d-8565-935d856601a7) ·
[Binance](https://mobbin.com/screens/d96f6fd9-73eb-453c-9959-e08b96cfda26) ·
[Origin](https://mobbin.com/screens/c759f1aa-5c8a-46d2-a265-f2260a873275) ·
[Public](https://mobbin.com/screens/5646cdc5-dff9-4b41-baf4-6d984c594056) ·
[Lloyds](https://mobbin.com/screens/0b513db0-3b95-44c1-aa50-6ebd386b1c8a) ·
[Base](https://mobbin.com/screens/1f76450b-9d02-4f8b-8623-fd6715d75079)
