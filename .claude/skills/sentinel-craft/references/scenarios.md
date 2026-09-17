# Stress axes

Adapted from `break` in the `interfaces` skills: render one component in every scenario that can
actually reach it, on one throwaway page, look once, report what **visibly** broke. The axes below are
bound to what Sentinel components actually accept, so a scenario is only kept when its cue matches.

One component per run. "The fund card" is a component; "the thread" is not.

## Keep an axis only when its cue matches

| Axis | Cue — keep it when the component… | Values to render |
| --- | --- | --- |
| **Content length** | takes a string it does not control | A 2-character label · a realistic one · a 60-character fund name with no space · a name with a bracketed suffix ("Parag Parikh Flexi Cap — Direct (Growth)") |
| **Number magnitude** | renders a figure | ₹0 · ₹1,85,000 · ₹4.2 Cr · −14.2% · 100% · a negative in a column of positives |
| **Number precision** | takes a computed value | An integer · one decimal · **a raw float** (`14.600000000000001`) · a value from `Math` |
| **Item quantity** | renders a list, a series or rows | 0 · 1 · 3 · the real count · 43 (the holdings case) |
| **Series count** | is a chart | 1 · 2 · **3** — three must become small multiples, never a third hue |
| **Container** | is placed by a caller | The 375pt screen · inside a card at 343 · inside a peeking `ArtifactCard` at 96px · inside a bottom sheet |
| **State** | has any state at all | default · pressed · **focus-visible** · disabled · loading · empty · failed · locked |
| **Interactive children** | accepts `children` | A control in the slot — this is how `ArtifactCard` produced a button inside a button |
| **Motion** | animates | First reveal · a re-render · **`prefers-reduced-motion: reduce`** |
| **Provenance** | shows a figure an advisor must defend | With provenance · without · with a "data to supply" placeholder |

Drop an axis with one line saying why, so a wrong inference is cheap to catch.

## What counts as a break

Something you saw. "Text escapes the card's right edge", never "spacing feels tight".

Sentinel-specific breaks worth naming, because each has happened:

- A figure rendered at full float precision.
- A chart whose plot, baseline or axis stops short of the edges every other element in the card uses.
- An end label lying across the stroke it labels.
- An axis label that vanishes because its count was derived from the other axis.
- A control that lands inside another control's hit area.
- A focus ring that disappears because the caller passed its own `boxShadow`.
- Peek content taller than 96px, clipped mid-word.
- An animation that still moves under `prefers-reduced-motion`.

## Building the harness

A throwaway page under `design-system/pages/`, or a scratch HTML served by `npm run preview`. It loads
`_ds_bundle.js` like every other page, so **rebuild the bundle first** — otherwise the harness renders
the previous build and every conclusion is about code that is no longer there.

The component ships untouched. The page adds labels, container widths and fixture props, nothing else:
no fonts of its own, no token swaps, no probes. A component observed under any of those is a different
component.

Widths are scenarios on the page: render the narrow cases in fixed-width containers beside the
full-width one, so one load shows every width and nothing is ever resized.

## Report

| Scenario | Observed | Owner |
| --- | --- | --- |
| A 60-character fund name | Overflows the card, no wrap and no truncation | Type and number discipline |
| Series of 3 | Drew a third line in a new hue | **Rule 1 — Block** |
| Raw float from a computed series | Printed 14.600000000000001% | Rule 4 |

The owner column names the review area from `SKILL.md` whose rules diagnose the fix, so the work starts
in the right place. This pass observes; it issues no verdict.
