> Part of the [sentinel-figma skill](../SKILL.md).

# The parity gate

This repository's standing rule is that a finding you did not see did not happen, and a claim you
did not measure is not a claim. "The Figma file matches the product" is exactly that kind of claim,
and it is the easiest one in this project to get wrong, because a Figma component can look right in
a screenshot and still be built on a hardcoded `#b69377` that will not move when the token does.

So parity is proven two ways, and a component is not done until both pass.

## Gate A · Structural parity — the bindings, not the picture

Read the component back with `get_metadata` and assert, in the returned tree:

- every fill, stroke, corner radius, gap and padding resolves to a **variable**, not a literal;
- every text node uses one of the 14 **text styles**, not a loose font size;
- every variable it resolves to is one the map knows — its `codeSyntax` matches a real
  `var(--token)` in `design-system/tokens/*.css`;
- the component's name equals the `.jsx` basename exactly.

A component that renders perfectly and fails Gate A is worse than one that fails visibly: it will
drift silently on the first token change, and nothing in Figma will report it. This is the Figma
equivalent of `lint:adherence`, and the ceiling is **zero literals**, not 61 — a Figma component has
no legacy to carry.

## Gate B · Visual parity — measured, not eyeballed

Both sides are rendered to PNG **at the same box, the same bleed and the same ground**, then
compared numerically.

```bash
# the product side
node tools/component-shot.mjs Badge /tmp/w.png --scale 1 \
  --props '{"variant":"status","tone":"over"}' --children 'OVER CEILING'

# the Figma side: build a stage — a frame of (w + 2·bleed) × (h + 2·bleed), filled with the same
# ground, holding the instance inset by the bleed — then get_screenshot it and curl the PNG.

node tools/figma-parity.mjs /tmp/w.png /tmp/f.png --label Badge-status-over
```

Three things had to be true before the number meant anything, and each was found by running it:

**1. The same ground.** A shadow is only visible against something. A transparent PNG compared with
a composited one fails on every shadowed pixel for a reason that has nothing to do with the
component. `--ground` defaults to `var(--color-canvas)`.

**2. The same bleed.** Every drop shadow and the `meta` badge's ring live *outside* the border box,
and an element screenshot clips exactly there. `--bleed 8` on both sides. The first version clamped
the clip at zero, which put the whole bleed on the right and bottom while Figma inset the instance
on all four sides — a 21% failure with the entire perimeter differing, and nothing wrong with the
component.

**3. The right question.** A fixed percentage is meaningless across sizes: the *same* glyph
rasterisation difference scored 0.34% on a 359×88 card and 10% on an 87×18 badge, because on the
badge the text is most of the image. So the gate asks three questions instead of one:

| Check | Passes when | Catches |
| --- | --- | --- |
| **Inked box** | every edge within `--slack` (default 1px) | a shifted, mis-sized or mis-padded component — the thing a percentage cannot see on a solid shape, where a 3px displacement scored 1.98% |
| **Interior differences** | at or under `--threshold` (2%) | a wrong fill, a missing element, a wrong colour. A pixel is *interior* when it has no differently-coloured neighbour in the same image, so it is not an antialiased edge |
| **Dense rows** | at most 2 rows differ by more than half | a recoloured or shifted band that slips under the threshold |

Edge pixels are reported but do not fail: at 10px the two rasterisers disagree about the
antialiasing of every glyph, which no component can fix. Surface passed with 72 edge pixels and
**0 interior**; Badge with 160 edge pixels and **0 interior**, box exact at 87×18.

**The probe must be shown able to fail.** `npm run check:figma-parity` runs seven checks: an
identical pair scores 0.00, one token wrong scores 53%, a one-channel difference is ignored, a
1px shift is forgiven in pixels and reported in the box, and a 3px shift is caught *by the box*.
A gate nobody has seen fail is not a gate — this repository has already shipped one of those
(F-80, where every visual check passed on a splash that was swallowing every tap).

## What Gate B is not allowed to be used for

- **Not for the canvas components.** `DotField` and the splash's dot phase are computed per frame.
  Their parity is the settled frame only, and the page documentation says so.
- **Not for motion.** Six durations and one easing are documented in Foundations. A Figma prototype
  illustrates the timing; it is not the timing.
- **Not at the glyph.** Parity is measured at the component box. A line that breaks one word earlier
  in Figma at the same width is a text-layout difference, recorded, not a defect to chase.

## Type: the register, not an exemption

A text node passes Gate A when it uses one of the 14 roles **or** its exact combination — weight,
size, leading, tracking — appears in `type-register.md`. Fifty-eight declarations across the
components compose type from primitives rather than using a role, and the owner's ruling of
21 Sep is to build those faithfully and register them. Registered is not excused: the font size
must still be a bound variable, and the register is generated, so it cannot quietly grow.

## Recording it

Every component's Figma page carries its parity result in the page documentation: the date, the
percentage, and which gates passed. A page that says nothing about parity has not been measured, and
should be read as unproven rather than as fine.
