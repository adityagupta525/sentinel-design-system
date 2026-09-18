---
name: sentinel-craft
description: Review or change anything in the Sentinel design system — a component, a spec page, a UI kit screen, a chart, a new screen built on it. Holds Sentinel's own scale, its four hard rules and its motion values, so an audit measures against this product instead of a generic grid. Use it before editing a component, before judging whether spacing or alignment is wrong, before adding a component or a screen, and whenever someone asks if something is off, misaligned, inconsistent, or good enough. Triggers on spacing audit, alignment, craft review, design review, is this right, does this match the system, polish this, add a component, build a screen.
---

# Sentinel craft

Sentinel is settled. It has one canvas, one accent hue, a fixed type ramp, one easing and four rules it
carries into every output. Most of what looks unusual here is a decision with a paragraph behind it.

So this skill exists to stop two failures, and they pull in opposite directions:

- **Auditing Sentinel against somebody else's numbers.** A generic 4/8pt pass flags 11.5px type, a 42px
  row and 14px card padding — all three are the product. Advice that prescribes `scale(0.96)` on press,
  a 4px blur on an icon swap or an image outline is about a different product: Sentinel presses at
  **0.98**, has **no blur anywhere**, and ships **no images**.
- **Calling a real defect a house style.** The system is not above criticism. It shipped a page that
  never ran, a chart that printed `14.60000000000000075%`, and a card that wrapped its children in a
  `<button>`. "It's deliberate" is a claim that has to be found in the source, not assumed.

The test that separates them: **a decision is deliberate when the system says so somewhere you can
point at** — `design-system/readme.md`, the token file's own comment, the component's header, its
`.d.ts`, or `guidelines/contradictions.md`. Deliberate and documented is not a finding. Deliberate and
undocumented is a documentation finding. Neither is a defect.

## Before anything else

1. **`references/scale.md`** — every number this system allows, generated from `tokens/*.css` by
   `npm run build:scale`. Never audit spacing, type, radius or motion without it open.
2. **`references/rules.md`** — the laws that are Sentinel's rather than general good practice, and
   what breaking each one costs.
3. **`design-system/guidelines/contradictions.md`** — the system's own list of known inconsistencies.
   Check before reporting something as new; rediscovering logged debt wastes the report.
4. **`docs/FINDINGS.md`** — what is already open and what was already fixed.

## Look at it. Do not reason about it.

The rule that would have caught the one mistake this repo has already made: `DownloadAction` was blamed
for a nested `<button>` from a React stack trace alone; the wrapper was `ArtifactCard`, four frames
down. Reading a stack is not looking.

- Never report a **visual** finding from source alone. Render it.
- Never report a **code** finding from a screenshot alone. Open the file and cite `path:line`.
- A predicted failure is not a finding. A finding is something that happened.
- **A clean render is not proof the document is well formed.** Five spec pages shipped with a
  duplicated `<body>` and a second `<div id="root">`; Chrome tolerated it here and the published
  copies came up blank. `check-previews` now counts `<body>`, `#root` and the page-kit script
  statically, before the browser sees the page — a new page must not be written by hand-splicing a
  head fragment without that check.

```bash
npm run build:bundle                              # the pages read the bundle, not the source
npm run preview                                   # then open it
node tools/check-previews.mjs --shots /tmp/shots  # all 63 pages, at their own @dsCard viewport
```

**The bundle step is not optional.** Preview pages load `_ds_bundle.js`; a source change is invisible
until it is rebuilt, and the page will calmly show you the previous build instead.

## Changing something

Every change under `design-system/` runs `npm run check:integrity -- --update` in the **same commit**.
That is what keeps "imported verbatim" honest: a change can be deliberate, never silent.

Then, before the commit:

```bash
npm run check                            # barrel, bundle, integrity, adherence
node tools/check-previews.mjs            # 63/63, or say which one regressed and why
```

**Never restyle.** Colour, type, radii, shadow and motion character are settled. Fix gaps, alignment,
correctness and consistency. If a change alters what something *looks like* rather than how correctly
it behaves, it needs a decision from the user first, and the commit has to name the ruling it answers.

## Reviewing

Order matters — a foundational failure must not be hidden under polish:

1. **The four rules** (`references/rules.md`). A break here is `Block`, whatever else is right.
2. **Operability** — 44pt targets, focus visible, keyboard path, no control inside a control.
3. **Alignment and scale** — one set of edges per card; every value in `references/scale.md`.
4. **Type and number discipline** — a role not a raw size; Indian grouping; one decimal; tabular
   figures on anything that changes.
5. **Motion** — one easing, the real durations, reduced-motion in all three places. Screens use
   `ds-screen-in` / `ds-screen-out`; **there is no shared-element transition** — an artifact expands in
   place, and a screen that "smart animates" a card into a page has invented something. A wait is
   `SentinelThinking`, and its `verb` is a provenance claim: it must name the source the answer then
   cites. Several real ordered steps are `ProgressTrace`, not a verb that keeps changing.
6. **Copy** — sentence case, no emoji, no exclamation marks, limits stated plainly.

Report in the format in `references/review-format.md`. Stress one component with the axes in
`references/scenarios.md` when the question is "does it hold up", not "is it correct".

## Adding a component

The index counts a component only when all three exist — that is the definition, not a convention:

```
design-system/components/<group>/<Name>.jsx     tokens only; no raw hex, px or font-family
design-system/components/<group>/<Name>.d.ts    the contract, with the reasoning in the doc comments
design-system/pages/<Name>.html                 specimen · anatomy · variants · states · tokens · props · do/don't · motion
```

Then `npm run build:barrel && npm run build:bundle && npm run build:index`. The `build:index` warning
that stood here is spent: F-8's dropped `literals` column was re-derived in v12 and the rule is now
written down in the generator, so the index regenerates whole.

Read `design-system/pages/StepTrace.html` first. It is what a finished spec page looks like, down to
the motion table that states each animation's reduced-motion behaviour.

## Where this came from

The method — progressive disclosure, evidence before judgement, scenario stress, an owner per finding,
and recording what was considered and rejected — is adapted from the `interfaces` skills by Jakub
Krehel (MIT, interfaces.dev). **Its numbers were not taken**, because they describe a different
product. `references/borrowed.md` records exactly what was taken, what was rejected and why.
