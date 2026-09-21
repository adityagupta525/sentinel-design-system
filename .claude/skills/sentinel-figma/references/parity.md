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

Both sides are rendered to PNG at the same box and compared numerically.

```bash
# the product side — the existing harness, already used for every spec page
node tools/phone-shot.mjs <page.html> <n> /tmp/web.png

# the Figma side — export the node through the MCP, then
node tools/figma-parity.mjs /tmp/web.png /tmp/figma.png --label SentinelBlock
```

`tools/figma-parity.mjs` reports the differing-pixel percentage, the worst row and column, and
writes a side-by-side plus a difference image. It exits non-zero above the threshold.

**The threshold is 2% of pixels, and it is not zero on purpose.** The browser and Figma rasterise
text with different hinting, so identical type differs on the glyph edges by a pixel or two. What 2%
does *not* absorb is a wrong colour, a wrong radius, a 2px spacing error or a missing element —
every one of those moves whole regions, not edges. If a diff is under 2% but the difference image
shows a solid block rather than a halo of edges, that is a failure whatever the number says.

**The probe must be shown able to fail.** Before trusting a pass, run the tool once with one side
deliberately wrong — a component exported at the wrong variant, or the web shot taken at a different
width — and confirm it reports the failure. A gate nobody has seen fail is not a gate; this
repository has already shipped one of those (F-80, where every visual check passed on a splash that
was swallowing every tap).

## What Gate B is not allowed to be used for

- **Not for the canvas components.** `DotField` and the splash's dot phase are computed per frame.
  Their parity is the settled frame only, and the page documentation says so.
- **Not for motion.** Six durations and one easing are documented in Foundations. A Figma prototype
  illustrates the timing; it is not the timing.
- **Not at the glyph.** Parity is measured at the component box. A line that breaks one word earlier
  in Figma at the same width is a text-layout difference, recorded, not a defect to chase.

## Recording it

Every component's Figma page carries its parity result in the page documentation: the date, the
percentage, and which gates passed. A page that says nothing about parity has not been measured, and
should be read as unproven rather than as fine.
