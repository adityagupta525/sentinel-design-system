# MASTER PROMPT — RUN IN: **DESIGN SYSTEM SESSION** (`Sentinel DS · 2026.09`)

**Attach:** `SENTINEL_DESIGN_SKILL.md` · `Sentinel_v11_System_Audit.md` · `Sentinel_v9_Chart_Family_and_Reconciliation.docx` · `Sentinel_v10_Chart_Library_and_DS_Pages.docx` · `Sentinel_Component_Request_Spec.docx`

---

Load `SENTINEL_DESIGN_SKILL.md` first and work through its five gates in order. The audit is the brief: it was produced by parsing this export, so treat its numbers as measurements you can reproduce, not as opinions you can weigh. Reproduce the ones you are about to act on — if a figure of mine is wrong, say so with your own number and act on yours.

**Nothing in this pass changes the design system.** The palette, the two faces, the radii and the product's look stay exactly as they are. Every fix below is at the level of *where a value is allowed to be used*, not which value exists.

## What to do, in order

**1 · Make the charts perceivable.** Three of four `CHART_RAMP` steps fail WCAG 1.4.11 against both backgrounds (2.57 / 1.66 / 1.30 against a 3.0 floor), and adjacent steps separate by as little as 1.28 — so `ChartShare`'s segments inherit exactly the problem the pie was rejected for. Fix it without touching a colour: a mark that must separate from the background uses **ramp 1 only**; segments that must separate from each other carry a **0.5 px `--color-line` edge plus the direct label the system already mandates**; `toneColor`'s `muted` swaps from `--color-data-deemph` (2.52) to `--color-muted` (6.26 / 6.88); and `--color-track` takes the inset hairline `HeroNumberCard` already uses. Print the new contrast table as your evidence.

**2 · Make the system operable.** `--focus-ring` and `--border-focus` are defined and dead, `:focus-visible` appears nowhere, and `Pressable` — the base under thirty component files — sets `outline: none` with nothing in its place. `Pill` already solves the other half correctly with `const hit = Math.max(0, (44 - s.h) / 2)` and a transparent `::before`, and its comment says why: callers cannot get it wrong. Give `Pressable` both guarantees — the ≥ 44 pt hit expansion and a `:focus-visible` that paints `--focus-ring`. Then add roles and labels where a control is not self-describing. Report how many files became operable without being edited.

**3 · Bind the type ramp and make the dimensional tokens load-bearing.** 83 of 130 tokens are never referenced while 289 raw pixel literals sit in the components — colour discipline holds, dimensional discipline does not. Name the type roles that already exist in practice, bind size / leading / weight / tracking into each, replace the literals with the tokens that already describe them, and take `--border-hairline` to its stated 0.5 px, which is the one visible change and it is the system's own intent. Keep 4 / 8 / 12 / 16 / 20 / 24 as the spacing scale and make 2, 3, 5, 13, 14 exceptions that must be justified on the page that uses them. Delete `--dur-canvas`; the canvas is gone. Close with the dead-token count re-run.

**4 · Then the components the audit found missing.** In this order, each with its page in the same commit:

- **`StepTrace`** — the highest-value addition. Four current AI products show what the assistant did as collapsible one-line rows with per-step state: Manus indents the reasoning under its step, Linktree ticks a vertical-ruled list of what it read, ChatGPT collapses a tool call to `Ran 3 commands ›`, DeepSeek heads its trace `Thought for 5 seconds ⌄`. For an advisor this is not decoration — *read her holdings · matched to the mandate · checked the compliance shelf* is the provenance they repeat to the client. Same component serves `FileUpload`'s staged parse, so it earns twice. States per step: pending, running, done, failed.
- **`VersionRow`** — Wabi puts each revision of the artifact in the thread as `V1 ↺ · V2 ↺ · V3 ↺` with a revert on each. An advisor who has revised a proposal twice currently has no way back to the version the client actually saw. That is a product hole, not a visual one.
- **`RangePills`** — any performance series needs `1M 3M 1Y 3Y ALL`. Our chart family has no range control at all.
- **`FollowUpRow`** — a follow-up that runs past one line is not a pill. Mindvalley groups full-width rows under a label; GitHub uses two-line cards; Agoda uses a leading icon and a trailing chevron. Keep `Pill` for short follow-ups and add the row for real questions like *"What about the 34 tiny funds?"*
- **`ResponseFeedback`** — nothing in Sentinel lets an advisor mark an answer wrong.
- Then the six still unbuilt from the earlier spec: `FileUpload`, `DownloadAction`, `ResultCard`, `InfoCard`, `DataTable`, `OverlapView` — `InfoCard` gaining Shopee's fund-detail anatomy (figure, chart, range pills, a stat pair where each figure carries an `ⓘ` to its sheet).

**5 · Two copy rules, from Monzo.** Caveats sit **at the number**, not in a global footer — the rounding note under the bars, the past-performance line above the chart. And any figure an advisor must defend carries an `ⓘ` to its explanation.

## How to use what you have

Use the **design-system and accessibility skills** for the audit half of this, and the **dataviz skill** before writing a single line of chart code. Use **Mobbin** for product patterns and the **web** for system documentation — Apple's HIG, Polaris, Material, Stripe and Linear are the five lenses this work is judged against. When you search, extract the *mechanism* and name the products that use it; never reproduce a layout or anyone's visual identity. Test every borrowed mechanism against our constraints before adopting it, and when one dies, say which constraint killed it. Cite the screens you looked at.

If a step would be better done by a specialist pass, run it as one and report what it found rather than folding it into prose.

## How to verify, before you report anything

Drive it. Press the taps you built and say what resolved. Report `scrollTop` before and after every expand and whether the card header lands where the contract says.

**Watch every screen you touch in keyframes** — at rest, mid-transition, settled — and check four things per state: nothing clips, nothing reflows as it lands, the property animating is the one the legend names, and the duration is inside its budget. Then set reduced motion and watch it again: everything resolves to its final state with an opacity fade and nothing else.

Measure every box against its container and report both numbers when they disagree. Do not adjust padding and hope — that is how a 463 px thread inside a 465 px card wasted a whole pass.

## What to report

The two numbers, tokens and components. The new contrast table. The dead-token count before and after. The `building` count, which must fall. Every new page. Every contradiction opened or closed, with its date and, if it is a debt, its trigger. The keyframe findings per screen. And anything you could not do, with the reason — a stated gap is worth more to me than a silent workaround.

Three decisions are not yours to make: the mandate ceiling, the source of fund performance data, and the AMC offer terms. Anything depending on them renders visually locked and says so.
