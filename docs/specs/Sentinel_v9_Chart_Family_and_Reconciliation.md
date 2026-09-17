# Sentinel v9 — the chart family, and reconciling the nine against what has changed

Before the plan: **eight of the ten items on this list are already specified.** `Sentinel_Component_Request_Spec` took the same nine requests and ruled four new, three extensions, two already shipping, with props and legal pairings. Writing a second spec for them would put two contracts in the system for one component, which is the drift the pill and token audits just cleared out.

So this document does two things only. Part 1 reconciles that spec against three things that have changed since it was written. Part 2 designs the one item that has rulings but no component contract — the graphs, which you have now asked for twice.

---

## Part 1 — Three reconciliations, not rewrites

**1.1 `ResultCard` was drawn sitting "on top of the artifact card". There is no canvas any more.** Its foot is now the expanded card's foot — the one B/06b was added to prove fits. One primary, two secondaries, and §4.2's rule that the primary never fires directly still holds. `Save` has somewhere to land now that it did not have then: it writes a row into the drawer's `SAVED WORK`, and it confirms **on the control that was pressed** — the pill flips to `Saved ✓` in 240 ms. No toast. A toast in a chat-led product is a second surface telling you what the first surface already knows.

**1.2 `List variant="action"` covers saved items, and `See all` now has a destination.** Not a screen — R3 forbids that. `See all` is a query, and the answer to a query is an artifact: Sentinel replies with the full saved list as an `ArtifactCard`. Row actions stay in the row's `⋯` sheet. **No swipe actions inside the thread** — a horizontal swipe on a row collides with the system back-swipe and with the thread's own scroll, and the advisor loses either way.

**1.3 `DataTable`'s "one-time nudge on first render" is a motion and it is not in the legend.** Add it: **Table nudge** — `translateX` −12 px and back, 320 ms, once per card lifetime, only when content exceeds the fold, suppressed entirely under reduced motion. Also, §7.1's rules already answer the vertical-and-horizontal-scroll request, but the reason should be on the record, because it reads like a violation of the no-nested-scroll law and is not: **vertical inside vertical is forbidden because the gesture is ambiguous; horizontal inside vertical is orthogonal and is what the platform itself does.** One axis, one sticky column, never a second scroller.

And one copy ruling while we are here: **`FileUpload` has no "uploaded successfully" state.** Success is the parse summary. "Uploaded" is a fact about our infrastructure; `Read her September statement · 4 pages · 12 holdings` is a fact about her money. The advisor only needs the second one.

---

## Part 2 — The chart family

Five components. The rulings behind them are already made — v5 §6.1–6.5 (line, bar, no pie, legend required, tap not hover), v6 §2.2–2.3 (`tone`, the draw-on exception), v7 §0.5 (peek 96 / expanded 180). What follows is the contract.

### 2.1 "Colour themes" — the answer in our palette

A request for colour themes is a request for a categorical palette, and the validator settled that: this palette cannot carry three hues that survive protanopia. So a theme here is not a hue set. **It is a data role**, and there are three:

| Theme | What it is for | How it renders |
|---|---|---|
| **Portfolio** | The client's own money | `tone="ramp"` — bronze ramp, solid marks, area fill on a single series only |
| **Benchmark** | Reference, target, prior period | `tone="muted"` — no fill, dashed at 4-2 for a second series, always drawn behind |
| **Breach** | A crossed limit, and nothing else | `tone="status"` — one mark or one segment, never a whole series |

Three themes, semantic, enforceable in the type. `tone` never accepts a colour and no chart takes a `color` prop. A fourth theme is the pie question wearing a hat, and the answer is the table in v5 §6.2.

### 2.2 `ChartLine`

Two series maximum, both end-labelled directly. Stroke 2 px, round caps. Series 2 dashed, muted, behind. Area fill only when there is one series, in `--color-accent-wash`. Baseline only — no horizontal gridlines, or one dashed line when there is a target to draw. Three or more series is small multiples, not three colours: one chart per series, same scale, stacked down the card.

`density="peek"` is the sparkline strip — plot 72, one end-label row 14, no axes, no legend, no readout. `density="expanded"` is plot 180 plus a 14 px axis band.

### 2.3 `ChartBar`

Vertical for time, horizontal for comparison. Bars take ramp steps **by ordinal rank, never by category**. Value labels at the bar end, tabular figures. 24 pt maximum thickness, 4 pt rounded at the data end, square at the baseline. `scaleY` from `transform-origin: bottom`, 480 ms, **staggered 60 ms** down the rows so an allocation assembles rather than appears.

### 2.4 `ChartShare` — the pie, answered

A 100 % stacked bar with a ranked legend beneath it. This is the substitute, it is already the strongest component in the system as `V1`, and it does the pie's job at 375 pt, in greyscale, and in print.

> **For the team, if it helps:** a pie encodes identity by colour. We tested our palette with a validator rather than by eye: the bronze ramp's adjacent pairs measure ΔE 11.4 against a floor of 15, and a muted earthy trio collapses to ΔE 3.8 under protanopia — olive and terracotta are the same colour to a red-weak reader. A set that passes needs saturation that is not our brand. So a pie here is either unreadable for colourblind users or it is a different brand; there is no third outcome. The stacked bar with direct labels carries the same information and survives all three tests.

If a ring is wanted for a dashboard tile, the two-segment meter is `V6` — one ratio against one limit, one hue.

### 2.5 `ChartLegend`

**Direct labels first; a legend is what we use when direct labelling is impossible.** One series never has a legend. Two series are end-labelled. So the legend's real homes are `ChartShare` and the overlap bars.

Dot 8 px on its ramp step, label in `--color-ink`, value right-aligned in `--color-muted`, 11.5 px, wrapping rather than truncating. **Text never wears the data colour** — the dot carries identity, the label stays ink.

Two rules the earlier spec did not state. **Left-aligned to the plot's left edge, never centred** — a centred legend floats free of the card's rag. And **ordered by value descending, always**, never alphabetically, so the legend doubles as the ranking and every row carries its own number. That last part is what makes it readable with no colour at all.

### 2.6 The hover box, on a phone

Hover does not exist at 375 pt, and the request is really two different interactions that need two different answers.

**Tap a mark → `ChartTooltip`.** v5 §6.5 stands. Anchored above the mark, flips below near the top edge, 44 pt target around the mark, dismisses on the next tap anywhere.

**Drag along the plot → `ChartReadout`.** New, and it is the one that matters: during a scrub the finger covers the mark, so a floating box under the thumb shows the advisor nothing. The readout is a **fixed row above the plot** — x label and value, tabular figures, with a 1 px vertical crosshair at the touch position. Nothing moves except the crosshair and the numbers. The row is reserved even when idle, showing the latest value, so it never appears and never shifts the layout.

**Box style, shared by both:** `--color-surface`, radius 8, padding 8 / 10, hairline as `inset 0 0 0 0.5px var(--color-line)` — the `HeroNumberCard` idiom, so it belongs. Label 11 px muted, value 13 px ink, tabular. **No arrow or tail** — a 1 px leader line to the mark instead, because a tail clips at the plot's edges and a clipped tail looks broken.

And the escape hatch that makes all of it accessible: **every chart offers a table view from the card's `⋯`.** No value is ever reachable only by touching a coloured shape.

---

## Part 3 — Order

1. `Pill` loading — three of the nine depend on it, and it is still the prerequisite it was.
2. `FileUpload`, `DownloadAction`, `List` / `ListRow` — the general three.
3. `ResultCard`, re-pointed per §1.1, with `Save` writing to the drawer.
4. `InfoCard`, then `DataTable` with §1.3's nudge in the legend.
5. `OverlapView` in `pairs` mode. Matrix mode stays behind the flag the spec put it behind.
6. The chart family, Part 2 — after `DataTable`, because the table view is every chart's escape hatch and should exist before the charts lean on it.

Two calls that are yours, not mine: whether a fund manager card carries a photograph — I would use initials in a 40 pt circle, because we have no rights pipeline for AMC manager portraits and a headshot in an advisory tool reads as endorsement — and whether the team gets §2.4's paragraph directly.

Locked, unchanged: mandate ceiling, fund performance source, AMC offer terms. Every figure in `InfoCard` and `ChartLine` for J-FUNDS renders visually locked until the second of those has an owner.
