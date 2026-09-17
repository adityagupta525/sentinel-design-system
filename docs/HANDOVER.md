# Handover — for the team building Sentinel

Everything a developer needs to build Sentinel screens on this system, and the short list of things
that will get a pull request sent back.

Read `design-system/readme.md` when a choice surprises you. It is 43 KB and it is the specification,
not a summary — nearly every unusual decision in here has a paragraph explaining what it cost and why
it was taken anyway.

---

## Install and import

```bash
npm install @centricity/sentinel-design-system
```

```jsx
import { Pill, ArtifactCard, DataTable, Composer, Dock } from '@centricity/sentinel-design-system';
import '@centricity/sentinel-design-system/styles.css';
```

`styles.css` is not optional. It carries the five token files and two global rules that components
depend on: the ≥44pt hit-area extension and the focus ring. A component rendered without it is
operable only by accident.

**There is one entry point.** Never import a component by its path:

```jsx
import { Pill } from '@centricity/sentinel-design-system';                       // yes
import { Pill } from '@centricity/sentinel-design-system/components/actions/Pill.jsx';  // no
```

The second form is a warning in your own lint run — see *Adherence* below — because it binds your code
to a file layout that is ours to change.

## What you are getting

| | |
|---|---|
| **85 components** | Every one with a hand-written `.d.ts` carrying the prop contract **and the reasoning**. The doc comments are the design review; read them before guessing at a prop. |
| **One token layer** | `tokens/*.css` — colour, type, spacing, radius, motion. Roles, not values. |
| **16 guideline pages** | Rendered specimens: colour, type, spacing, radius, shadow, motion, texture. |
| **19 component spec pages** | Specimen, anatomy with dimensions, every variant, every state, tokens, props, do/don't, and a motion table naming each animation's reduced-motion behaviour. |
| **11 group boards** | Every component in a group on one board — 61 of the 85 are visible here. |
| **3 runnable prototypes** | The app, the risk journey, the proposal journey. The product, assembled. |
| **An adherence lint config** | `_adherence.oxlintrc.json` — point your linter at it. |

`npm run preview` serves all of it at `localhost:4321`.

## The four rules

These are not style preferences. A pull request that breaks one gets sent back.

**1 · Colour never encodes identity.** One bronze hue carries magnitude; identity is always a direct
label. No pies, no donuts, no multi-hue stacked bars. Three or more series is small multiples — one
chart each, same scale. The status family (`--color-status-*`) is reserved and never used without a
word beside it.

> This was measured, not asserted. In this palette adjacent pie slices come out at ΔE 11.4 against a
> floor of 15, and a muted earthy trio collapses to ΔE 3.8 under protanopia. `ChartShare` is the pie,
> answered: a 100 % stacked bar with a ranked legend.

**2 · Bad news sits on the peach bubble surface.** `--color-danger` is text and eyebrow colour only,
never a fill. Most bad news here is a nuance — a drift, a cap, a disclosure — and a red block reads as
an alarm, which would be a lie about the stakes.

**3 · The composer is on every screen.** A CTA stacks above it in the `Dock`; nothing replaces it. The
advisor can always just ask. A screen that takes that away has taken away the product.

**4 · Indian number grouping, always.** ₹1,85,000 · ₹25 L · ₹4.2 Cr. Day-first dates. **One decimal on
every figure.** `tabular-nums` on anything that changes. Provenance under every figure.

> A chart in this system once shipped `14.60000000000000075%` to a fund card. An advisor cannot read
> that to a client. If a figure reaches a component as a computed float, format it before it does.

## Things that will get a pull request sent back

| Don't | Do |
|---|---|
| A raw hex, a raw `px`, a raw `font-family` in a component | A token. The adherence config fails on all three |
| A number where a type role exists | `font: var(--type-row-font)`. Thirteen roles cover the product |
| A control inside a control | The press target is a **sibling behind** the content. See `ArtifactCard` |
| `outline: none` with nothing in its place | Nothing — `Pressable` already paints the ring, and it is an `outline` on purpose so your inline `boxShadow` cannot beat it |
| `overflow: auto` on an expanded `ArtifactCard` or its children | Let the thread scroll. A scroller inside a scroller is the pattern the removed canvas existed to avoid |
| A chart with three series | Small multiples |
| `0%` for a value you could not compute | An em dash and a footnote. A zero and a missing value are different facts |
| A figure with no provenance | "As of 30 Sep · from his Q3 statement" |
| An invented performance number | The locked treatment. `[PLACEHOLDER — fund data to supply]`. An invented number in a wealth tool is worse than a blank |

## Adherence

```bash
npx oxlint --config node_modules/@centricity/sentinel-design-system/design-system/_adherence.oxlintrc.json src
```

Three rules, all of them about keeping your code and this system in step:

- no raw hex, `px` or `font-family`
- no import that reaches past `index.js`
- the forbidden-elements list

`pages/_index.json` reports the same measure back at the system itself, per component, as `literals` —
how many raw style values each one still hardcodes. **28 of 85 are at zero.** That number is meant to
go up, and it is the honest way to see where this system does not yet follow its own rule.

## Motion

One easing, `cubic-bezier(0.2, 0.8, 0.2, 1)`. Press **0.98**, and **0.94** on 42px discs — not 0.96,
whatever a general guide says. Enter is fade plus an 8–12px rise, 240–320 ms, 60 ms stagger. Bars fill
by `scaleX`. Numbers count up over 600 ms. Success is a drawn check, never confetti. **No blur
anywhere.**

**Reduced motion lives in three places and all three are required** — `tokens/effects.css` for the
global keyframes, each component's own `<style>` for the five component-local ones, and `MotionGuard`
inside the bundle so a project that loads the bundle with its own styles still honours it. Keyframes
are **redefined, not cancelled**, so nothing is stranded mid-transform.

**Screens** slide with `ds-screen-in` (100% in, opacity .6 → 1) over `ds-screen-out` (0 → −30%), both at
`--dur-screen`. Both carry `both` fill, so **you remove the outgoing screen yourself after 320ms** — the
keyframe holds it at −30%, it does not unmount it. Slide on a push only, never on a tab change or a
filter: a slide says "you have gone somewhere", and it should be true.

**There is no shared-element transition, and you should not build one.** An artifact expands in place —
height to natural over 300ms, the thread keeping its scroll position and the composer staying put. The
full-screen canvas it would have morphed into was removed from the product in v5.
`guidelines/motion-screens.html` runs both live.

If you add an animation, add its reduced-motion behaviour in the same commit and put the row in the
component's motion table.

## Generated files — do not edit

| File | Rebuild with |
|---|---|
| `design-system/index.js` · `index.d.ts` | `npm run build:barrel` |
| `design-system/_ds_bundle.js` | `npm run build:bundle` |
| `design-system/pages/_index.json` | `npm run build:index` |
| `.claude/skills/sentinel-craft/references/scale.md` | `npm run build:scale` |
| `baseline/design-system.sha256` | `npm run check:integrity -- --update` |

CI fails when any of them is stale.

**The preview pages read `_ds_bundle.js`, not the source.** A component change is invisible in every
page until you run `npm run build:bundle`. This catches everyone once.

## Deprecated

**`StickyCTA`** — superseded by `Dock`'s `cta` slot since v3 and still exported. It predates the dock
law: no chips row above it, no composer below. Use:

```jsx
<Dock chips={…} cta={<DarkButton label="Rebalance to his mandate" arrow full />} composer={…} />
```

It is the only dead component in the system. It has not been deleted so the removal is a decision
someone takes on purpose rather than an API that vanishes under you.

## Where the gaps are

Stated plainly, because a handover that oversells is worse than one that does not.

- **19 of 85 components have a full spec page.** The other 66 have source, a contract and a place on a
  group board — enough to use, short of the anatomy/states/do-don't treatment. `pages/00-Index.html`
  lists which is which, generated from disk, so it cannot claim a page that is not there.
- **`docs/FINDINGS.md`** carries every known defect and every deliberate deviation, including the ones
  already fixed. Read it before reporting something as new.
- **`design-system/guidelines/contradictions.md`** is the system's own list of known inconsistencies,
  kept by the system about itself. Contradiction 38 — the icon set has two origins and normalises to
  1.8–2.0px against Lucide's 1.5 — is the largest one still open.
