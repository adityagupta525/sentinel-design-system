# Sentinel v10 — the charting library decision, and one page per component

Two things are true at once. The components are missing, and the reason is not that anyone dropped them.

**Sixteen components are specified and not built.** They live in three documents and nowhere else — which is why the design system shows none of them. Nothing was lost; the specs were written and the build passes that would turn them into components were never run.

| Source | Specified, not built |
|---|---|
| Component request spec | `Pill` loading · `FileUpload` · `DownloadAction` · `List` / `ListRow` · `ResultCard` · `InfoCard` · `DataTable` · `OverlapView` |
| v7 Part 1 (the drawer) | `SearchField` · `ClientChip` |
| v9 Part 2 (the charts) | `ChartLine` · `ChartBar` · `ChartShare` · `ChartLegend` · `ChartReadout` · `ChartTooltip` |

That is the backlog. Part 2 below makes it impossible for this to happen quietly again.

---

## Part 1 — The charting library

You named two. I looked at both against our own constraints, and I am recommending neither — but the reasoning matters more than the verdict, because you are right about the underlying problem.

### 1.1 Chart.js — no, and on a hard constraint rather than taste

Chart.js renders to **canvas**. Canvas cannot take CSS custom properties per element, so every one of our tokens has to be read out in JavaScript and passed in as a string. That puts raw hex back into chart configs, which is the exact thing the token audit removed — 148 tokens, zero raw hex outside `tokens/`. It is also not accessible by default: the whole chart is a single `<canvas>` node with nothing for a screen reader to read, and our table-view escape hatch exists precisely because that matters here.

### 1.2 Recharts — viable, and heavier than the job

Recharts is SVG, so tokens do apply, and it genuinely does sit well with design-token setups. But it is around **370 KB** and built on D3 submodules, and what we need from it is a line with one or two series, a bar, a 100 % stacked bar and a 96 pt sparkline. Worse, its defaults are a list of things our spec already overrode: a cartesian grid we don't draw, a legend we place ourselves, and a **floating tooltip that is the one pattern v9 §2.6 ruled out on a phone** — during a scrub the finger covers the mark. We would be paying 370 KB largely to switch features off.

### 1.3 What we actually take — the maths, not the marks

Here is the part where you are right: our charts look weak, and it is not for want of a library. It is for want of **scale discipline**. Unrounded axis ticks, baselines that don't sit on a grid, uneven bar bands, arbitrary curve choice — that is what reads as amateur, and it is exactly what a scale library does properly.

So: **`d3-scale` and `d3-shape`, or the same two behind `@visx/scale` and `@visx/shape`.** Two small modules, no DOM, no defaults, no styling opinions. We get `scale.nice()` and `ticks()` for honest axes, band and point scales for correct bar rhythm, and `line()` / `area()` / `curveMonotoneX` for paths that don't wobble. Every stroke, fill, typeface, height and duration stays ours, because we render the SVG ourselves.

visx is Airbnb's SVG primitive set and is described as offering maximum control with no built-in design-system support. For most teams that last part is a drawback. For us it is the requirement — we have a system, and every library default is a fight with it.

**The rule: no charting library renders a Sentinel chart.** A library may compute a scale or generate a path. If you would rather trade weight for speed later, the fallback is Recharts wrapped so tightly that no screen ever imports it — grid, legend and tooltip all off, our `ChartReadout` and `ChartLegend` on top. Chart.js is the one I would keep out on the token grounds above.

---

## Part 2 — One page per component, and a rule that keeps the index honest

The reason you cannot find where anything was designed is that the system has no component pages. Specimens live inside journey artboards and kit files, so a component is only visible where it happens to be used. That is backwards.

### 2.1 `00 Index` — the first page, and the one you open

One row per component: name, group, **status**, the page it lives on, and the tokens it consumes. Status is one of `shipped`, `building`, `specified`. Sixteen rows would have read `specified` this morning, and you would have known that without opening anything.

### 2.2 One page per component, same anatomy every time

Nine blocks, in this order, so that every page reads identically and a reviewer builds a habit rather than hunting:

1. **Specimen** — the component alone, at real size, on the product background. Nothing else in frame.
2. **Anatomy** — the same specimen with dimensions annotated **outside** the frame, per B/05's rule.
3. **Variants** — the full cross-product, labelled, in a grid.
4. **States** — default, pressed, loading, disabled, error, empty; whichever genuinely exist, and no invented ones.
5. **In context** — inside a 375 pt thread fragment, so its real width and its neighbours are visible. This is the block that catches a component that only works in isolation.
6. **Tokens** — the list it consumes, by name. If a value here is not a token, the page fails.
7. **Props** — the `.d.ts`, printed.
8. **Do / Don't** — two specimens side by side, the wrong one marked. One pair, the sharpest one; a page of eight don'ts teaches nothing.
9. **Motion** — the row from the motion legend that applies, with its reduced-motion behaviour.

### 2.3 The rule

**A component with no page is not in the system.** Not shipped, not half-shipped — not in it. The index is generated from the pages that exist, so it cannot drift from reality, and `specified` becomes a visible debt rather than a docx nobody re-opens.

### 2.4 Groups, so the index stays scannable

`Foundations` (tokens, type, motion) · `Chat` (thread, composer, dock, artifact card) · `Data` (charts, table, overlap, stat tiles) · `Input` (pill, chip, search, upload) · `Navigation` (drawer, sheet, rail).

---

## Part 3 — Order

Two passes, because sixteen components plus a new page architecture in one sitting is how quality goes.

**Pass one** — the index and the page template, then `Pill` loading (three components depend on it), then the six chart components with the scale modules. Charts first because that is the visible pain, and because `DataTable` leans on the chart cells.

**Pass two** — `FileUpload`, `DownloadAction`, `List` / `ListRow`, `SearchField`, `ClientChip`, `ResultCard`, `InfoCard`, `DataTable`, `OverlapView` in `pairs` mode.

Every component built in either pass gets its page in the same commit. A component without a page does not count as built, which is the whole point of Part 2.

Locked, unchanged: mandate ceiling, fund performance source, AMC offer terms.
