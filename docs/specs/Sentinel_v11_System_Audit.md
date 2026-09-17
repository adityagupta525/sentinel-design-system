# Sentinel v11 — system audit

Read through the lens of Apple's HIG, Shopify Polaris, Material, Stripe and Linear, against the export dated 2026-09-17. **The design system is not changed anywhere in this document.** The palette, the two typefaces, the radii and the product's look are all left exactly as they are. What is audited is everything else: whether the tokens are actually used, whether the marks are perceivable, whether the thing can be operated, and what is missing.

First, the part worth saying plainly: the contradiction log is the best artefact in this project. Forty-seven rows, dated, with triggers, and three of them openly marked as unpaid debt. Most systems I have read do not have that, and almost none of them admit to a debt in writing. Everything below is measured against a system that is already honest about itself.

**Method.** I unzipped the export (314 files), parsed all five token files for the defined vocabulary, walked every `.jsx` in `components/` and `pages/` counting `var()` references and raw literals, computed WCAG 2.1 contrast for every text pair and every chart mark against both backgrounds, and grepped the whole tree for focus, role, keyboard and numeric-formatting signals. Every number below came out of that pass, not out of an opinion.

---

## Part 1 — The one that matters most: three of four chart marks are not perceivable

`CHART_RAMP` is `bronze-deep · bronze · alloc-debt · bubble-edge`. WCAG 1.4.11 asks a graphical object to clear **3.0:1** against its background. Measured against `--color-canvas` and `--color-surface`:

| Ramp step | on canvas | on surface | |
|---|---|---|---|
| 1 · `bronze-deep` `#715035` | 6.59 | 7.24 | passes |
| 2 · `bronze` `#b69377` | 2.57 | 2.83 | **fails** |
| 3 · `alloc-debt` `#d9bb9e` | 1.66 | 1.82 | **fails** |
| 4 · `bubble-edge` `#ebd4c3` | 1.30 | 1.42 | **fails** |
| `muted` tone · `data-deemph` `#a39a91` | 2.52 | 2.77 | **fails** |

And the steps cannot be told from each other either — adjacent separation is **2.56, 1.56, 1.28**. Ramp 3 beside ramp 4 is, to the eye, one colour.

This reframes a ruling we already made. The team was told the palette cannot carry **categorical** colour, and the ΔE evidence for that was right. The deeper finding is that **the palette cannot carry more than one chart mark at all.** Only ramp 1 is legible as a shape against the page. Which means the stacked bar we shipped as the substitute for the pie inherits the pie's problem: `ChartShare`'s four segments are four things nobody can separate.

**The remedy, and it changes no colour.** Colour stays exactly where it is; what changes is what colour is allowed to do alone.

- A mark that must be separated **from the background** — a line, a single bar, a crosshair — uses **ramp 1 only**. It is the one step that clears 3.0.
- A mark that must be separated **from its neighbour** — stacked segments, adjacent bars — carries a **0.5 px `--color-line` edge between segments**, plus the direct label the system already mandates. Segments are then separated by edge and word, which is how a monochrome stacked bar has always worked in print.
- The `muted` tone swaps from `--color-data-deemph` (2.52) to **`--color-muted`** (6.26 / 6.88). Same role, same warm grey family, already in the palette, and it passes. One line in `toneColor`.
- `--color-track` at 1.08 is correct as a track rather than a mark, but it needs the hairline it already gets in `HeroNumberCard` — `inset 0 0 0 0.5px var(--color-line)`. That pattern exists in the system; it should be the rule, not one component's habit.

Two devices seen in the field that solve exactly this without colour: Acorns puts a **4 px edge marker on the leading edge of each row** instead of a swatch, and Public prints the **ramp itself as a strip above the list** so the scale is legible before any row is read. Both are worth having.

---

## Part 2 — The dimensional tokens are decorative

130 tokens are defined. **49 are referenced. 83 are never used.** In the same tree there are **289 raw pixel literals** across 58 components — `fontSize: 16`, `lineHeight: '24px'`, `gap: 8`, `padding: '12px 6px 12px 14px'`, `height: 1`.

Raw hex, by contrast, is **zero**. So the colour discipline is real and holding. The dimensional discipline is not: every `--space-*`, `--radius-*`, `--text-*`, `--leading-*`, `--h-row*` and `--weight-*` token is dead, while the components hardcode the same numbers inline.

"148 tokens, zero raw hex" was true, and it hid this. The audit that produced it measured colour.

One visible consequence, not just a theoretical one: `--border-hairline` is defined at **0.5px** and is dead, and the components draw dividers at `height: 1`. The system says hairline and the product renders a full pixel — a difference you can see on the cards.

Two things follow. **Sizes and leadings are not bound to each other.** Eight UI sizes and seven leadings exist as loose values, so nothing stops 14/22 in one card and 14/20 in another; Apple, Polaris and Stripe all publish a **ramp** instead — named roles that carry size, leading, weight and tracking together. And **the spacing set is not a scale**: 2, 3, 4, 5, 6, 8, 10, 12, 13, 14, 16, 20, 24 — thirteen steps including 3, 5 and 13, which are off any 4 pt grid and exist only because the Figma export contained them.

Both are also **named after their values** — `--space-13`, `--text-14`, `--radius-16`. That is the same anti-pattern the colour audit removed when it deleted appearance-named colour tokens. Colour got semantic names; dimension never did.

---

## Part 3 — Focus is not missing. It is removed.

`--focus-ring` is defined — `0 0 0 3px rgba(182,147,119,0.24)` — and so is `--border-focus`. **Both are dead.** Across the whole tree: `:focus-visible` appears **0 times**, `tabIndex` **0 times**, `role=` **once**, `aria-*` **four times**.

And `Pressable`, the base under thirty component files, sets `outline: 'none'` explicitly and puts nothing in its place.

So this is not an omission that a later pass forgot. The system defined the right token, then built a base component that switches the browser's own focus indicator off. Any of the five systems in the audit lens would stop here: Polaris and Material both treat a visible focus indicator as non-negotiable, and Apple's HIG assumes full keyboard and switch-control operability.

**`Pill` already shows the fix for the other half of this.** It computes `const hit = Math.max(0, (44 - s.h) / 2)` and extends its tap target with a transparent `::before`, so a 36 or 32 pt pill still answers to a 44 pt touch — and the comment says exactly why: *callers cannot get it wrong*. That is the right instinct, in the right place. `Pressable` should inherit both halves of it: the hit expansion, and a `:focus-visible` that paints `--focus-ring`. Everything under it then becomes operable at once, and no design decision changes.

(The `--hit` custom property the index reports as "+1 local" on `Pill` is correct as a local. It is computed per instance from the size, so it is not a design token and should not become one. That row is not a defect.)

---

## Part 4 — Three more measured contrast findings

**`--text-deemph` fails.** `data-deemph` at 2.52 on canvas is below even the 3.0 non-text floor, and it is used for text. Contradiction 35 already flagged a translucent bronze label for contradicting the "warm grey carries de-emphasis" rule and pointed at `data-deemph` as the correct answer — but the correct answer does not itself pass. De-emphasised text should be `--color-muted` at a smaller size or lighter weight; de-emphasis by **weight and size**, not by lowering contrast, is what Linear and Stripe do.

**The status pill's text fails at body sizes.** `danger #b4552f` on `status-over-bg #f3e2da` is **3.90** — fine for a large or non-text element, short of 4.5 for text, and the OVER CEILING pill sets its label at 10–11 px. The system's own rule saves it from being a perception failure, because colour never signals alone there and the pill always carries a word. Worth recording as a known, accepted 3.90 rather than leaving it to be discovered.

**Everything else passes, and comfortably.** Ink on canvas 14.82, ink-soft 10.81, muted 6.26, bronze-deep on chip 6.74, the ok-status pair 5.63. The type palette is in good shape; it is the data palette and the de-emphasis layer that are not.

---

## Part 5 — Smaller things, quickly

**`--dur-canvas: 380ms` is dead and should be deleted** — contradiction 40 removed the canvas from the product; its duration outlived it.

**`tabular` is real and correct** — `chartMath.jsx` exports `{ fontVariantNumeric: 'tabular-nums' }` and twelve files use it. My grep for `font-variant-numeric` returned zero because it lives in that one helper. Worth knowing that the guarantee depends on Urbanist actually shipping tabular figures; if it does not, the count-up and every table column will jitter, and that is a font test rather than a code test.

**Two typefaces, and the display face carries four sizes** — 24, 27, 40, 64 — all dead as tokens. `--display-27` exists for exactly one greeting.

**Nine radii** for a phone app. Linear and Stripe run three or four. Not a defect, and not something to change now, but the index should say which are load-bearing.

**Contradiction 38's icon debt is the honest kind.** Six source glyphs on six grids beside four Lucide additions on a 24 px grid. Dated, triggered at the next visual refresh, and correctly judged as not worth paying today.

---

## Part 6 — What the five lenses would each say first

**Apple HIG** — operability. No keyboard path, no focus indicator, no switch control, `outline: none` on the base. Touch targets are handled where `Pill` handles them and unguaranteed everywhere else.

**Polaris** — semantics over values. The colour layer has semantic aliases (`--text-body`, `--surface-card`) and they are *all dead*; every dimensional token is value-named. Polaris' central discipline is that a component asks for a role, never a number.

**Material** — the ramp. No bound type roles, no 4 pt grid (3, 5, 13 break it), and state coverage without focus or error states specified per component.

**Stripe** — density and figures. Tabular figures are right; the de-emphasis layer failing contrast is the kind of thing Stripe's own docs treat as a correctness bug, because a number you can't read is a number you can't check.

**Linear** — restraint and speed. Nine radii, eight UI sizes, seven leadings, thirteen spacing steps. Linear would cut each set roughly in half and get a more coherent product out of it.

---

## Part 7 — What the app still needs, with the evidence

Researched on Mobbin against comparable products rather than imagined.

**A staged parse checklist for `FileUpload`.** The spec has one progress state; the field standard for *document parsing* is a per-stage list, because the stages are what the advisor cares about. Alan shows `✓ Document detection` then `••• Anti-fraud analysis`; Monese/Veriff tick four stages with a spinner on the active one; Airwallex shows the file row with a determinate line. This fits our "success is the parse summary, not 'uploaded successfully'" rule perfectly — the stages *are* the summary arriving progressively. Notion is the closest to Sentinel's own shape: the file sits as a **chip in the thread** above the answer, with a follow-up pill beside it.

**A feedback affordance on assistant responses.** Sentinel has none anywhere. Mindvalley's Eve AI puts 👍/👎 at the foot of each response. For a product whose whole value is the quality of its answers, and which an advisor is expected to defend to a client, there is no way to mark an answer wrong.

**A follow-up vessel bigger than a pill.** We specified at most three inline pills. Real follow-ups in this product are long — *"What about the 34 tiny funds?"* — and a pill that wraps is not a pill. Mindvalley uses a labelled group of full-width rows under "Here's what you can ask next"; GitHub Copilot uses two-line cards with a title and a description; Agoda uses rows with a leading icon and a trailing chevron. **A follow-up that exceeds one line becomes a row, not a pill** — that is the rule this needs.

**A decision on disclosure depth.** Ours is one line in the footer. GitHub puts *"Copilot uses AI. Check for mistakes."* directly under the header; Agoda puts a full generative-AI notice above the first message; Wise puts an upload-specific caution at the upload point. For a SEBI-adjacent product this is a compliance call, not a design preference, and it belongs to you and your compliance reviewer.

**Sort and frozen-column conventions are confirmed, not invented.** Fidelity ships the frozen entity column with a vertical rule at 375 pt; Shopee makes column headers the sort control with a `⇅` glyph and an active `↓`. Our `DataTable` §7.1 matches both. Origin puts its sort controls as dropdown chips above the list and its row operations in an `OPTIONS` sheet — which is our row-`⋯`-to-sheet choice, and a second confirmation that swipe is the wrong gesture here.

**Two open decisions rather than gaps.** Voice input appears in every comparable AI product (Copilot, Genie, Eve); our composer has paperclip and send only, and for an advisor between meetings dictation is plausible. And there is no dark mode — for a field tool, worth deciding, not worth assuming.

---

## Part 8 — Order of remediation

Nothing here changes a colour, a typeface, a radius or a layout.

1. **`toneColor`'s muted swap and the segment hairline** — one function and one rule; it makes the charts perceivable and it is the highest-value change in this document.
2. **`Pressable` inherits `Pill`'s two guarantees** — the ≥44 hit expansion and a `:focus-visible` painting `--focus-ring`. Thirty files become operable without touching any of them.
3. **Bind the type ramp** — name the roles that already exist in practice (Display, Total, Title, Body, Label, Caption, Figure) and bind size, leading, weight and tracking into each. The values stay; only the naming and the binding change.
4. **Make the dimensional tokens load-bearing** — replace the 289 literals with the tokens that already describe them, and take `--border-hairline` to its 0.5 px, which is the one visible change and it is the system's own stated intent.
5. **Reconcile the spacing set** — keep 4/8/12/16/20/24, treat 2, 3, 5, 13 and 14 as exceptions that must be justified on the page that uses them.
6. **Delete `--dur-canvas`**, and re-run the dead-token count as the closing evidence.
7. **The three new components** — the staged parse checklist inside `FileUpload`, the response feedback affordance, and the follow-up row.

Locked and untouched: mandate ceiling, fund performance source, AMC offer terms. And the palette, the faces, the radii and the look — those were not mine to move.

---

## Appendix — the field sweep, read as a designer

One caveat first: the Mobbin connector searches by **description, not by upload date**. There is no "latest uploads" feed in it, so I cannot promise these are the newest additions. What I did instead was sweep the pattern areas Sentinel actually occupies, and what came back is the current generation of AI-agent and wealth products. Read that way, it is more useful than a chronological list would have been.

### The AI-agent set — this is our shape, and it has converged

**Manus** puts a **task checklist inside the reply**: a collapsible step with its reasoning indented beneath it, then the next step carrying its own `Thinking` sub-state, then the artifact as a row with a **running clock** at `00:16`. **Linktree** does the data-gathering version of the same thing — `Analysis ⌄` opening a vertical-ruled list of ticked steps: *loading your links, fetching your analytics, checking your integrations*. **ChatGPT** collapses each tool call into a one-line `Ran 3 commands ›` sitting between prose paragraphs. **DeepSeek** heads its trace `Thought for 5 seconds ⌄` and sets the trace itself as a left-ruled quote in muted text.

Four products, one conclusion: **what the assistant did is shown as collapsible one-line rows with per-step state.** Sentinel has a collapsed reasoning row, but it has nothing that shows *what was read*. For an advisor that is not a nicety — "read her holdings · matched to the mandate · checked the compliance shelf" **is** the provenance they will repeat to the client, and we currently bury it in a sentence. This is the strongest single addition in this document, and it is the same component as the staged parse checklist in Part 7, so one component earns twice.

**Mimo** adds the failure half: a completed-task card with a tick and a timestamp, then `⚠ Error detected`, then a `Selected action / Try to fix error` pair. Ours goes straight from complete to failed with nothing in between.

**Wabi** is the one I would not have thought of. Each revision of the artifact is a **row in the thread — `V1 ↺`, `V2 ↺`, `V3 ↺`, `V4`** — with a revert on each. A proposal that gets edited three times currently leaves no trail in Sentinel; an advisor who has revised a client's proposal twice has no way back to the version the client actually saw. That is a real product hole, not a visual one.

Every one of them also carries **mode chips inside the composer** — DeepSeek's `Think` and `Search`, Mimo's `Basic model`, ChatGPT's `5.5 Medium`. Ours has none, and I think that is right for an advisor tool: the model is our problem, not theirs. Worth recording as a deliberate no rather than an oversight.

### The wealth set — mostly confirmation, three things to take

**Wealthsimple** renders a 65 / 35 split as a **two-segment bar with the labels sitting beneath its two ends** — our `ChartShare` form, arrived at independently, and further evidence that direct labelling beats a key.

**Nutmeg** and **Monzo** both do allocation as plain labelled horizontal bars, which is `V1`. Monzo then does something we should copy: it puts its caveats **at the number**, not in a global footer — *"These percentages are rounded for simplicity"* directly under the bars, and the past-performance line above the chart rather than at the bottom of the screen. For a SEBI-adjacent product that is the better pattern, and it costs nothing.

**Shopee's fund detail** is the anatomy our `InfoCard` is missing: figure, area chart, then a **time-range pill row** — `1M 3M YTD 1Y 3Y 5Y ALL` — then a stat pair, `CAGR 1Y ⓘ` and `Max Drawdown 1Y ⓘ`, each with its own info affordance. Two gaps fall out of that. Our chart family has **no range control at all**, which for any performance series is not optional. And our stat tiles have no `ⓘ`, so a figure an advisor cannot explain has nowhere to explain itself — when we already have the sheet pattern that would do it.

**Nutmeg's projection** is a confidence cone rather than a line. J-RISK ends on a ₹2 crore goal, and a single projected line there would be a claim we cannot support; a band is the honest form. Worth holding for when that screen is designed.

### What this adds to Part 8

Three components, on top of the three already listed: the **step-trace row** (which also serves the parse checklist), the **version row** with revert, and the **time-range pill row** for performance series. Plus two small rules: caveats sit at the number, and any figure an advisor must defend carries an `ⓘ` to its sheet.
