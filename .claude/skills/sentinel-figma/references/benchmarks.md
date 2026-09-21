> Part of the [sentinel-figma skill](../SKILL.md).

# What the good files do — and what Sentinel takes from each

The brief was "Google, Razorpay, Apple ki tarah proper clean organised file". So this is the record
of what those files actually do, what was taken, and what was **rejected with a reason** — the same
shape as `sentinel-craft/references/borrowed.md`, and for the same purpose: so nobody re-proposes a
rejected convention in six weeks and nobody has to re-argue it.

The rule that governs every row: **advice describes the product it came from.** A convention that
assumes two colour modes, a 4/8pt grid or a raster-heavy brand is not wrong — it is about a
different product, and Sentinel has one canvas, an 11.5px type step, a 42px row and no images.

## Sources read

| Source | What it is |
| --- | --- |
| [Figma · `figma-generate-library` v2.0.2](https://github.com/markj81/figma-mcp-skills) | Figma's own phased skill for building a library from a codebase. The engine this skill sits on top of. |
| [Figma · Turn your design system into a Claude skill](https://www.figma.com/resource-library/claude-skill-design-system/) | Figma's guidance on exactly this: a house skill that sits *on top of* theirs, not duplicating it. |
| [Razorpay Blade](https://www.figma.com/community/file/1341658976127676210/blade-design-system) · [repo](https://github.com/razorpay/blade) · [Figma case study](https://www.figma.com/customers/razorpay-boosting-design-system-adoption-and-collaboration/) | 40+ components, tokens as variables, base file plus theme files, dot-notation code syntax. |
| [Material 3 Design Kit](https://m3.material.io/) | The most-used community library. Multi-collection, multi-mode token architecture. |
| [Apple · iOS 26 / iPadOS 26 UI Kit](https://developer.apple.com/news/?id=pnfbj8je) | Platform kit. Pattern-complete, documentation-light, one page per surface family. |
| [7 Figma design system best practices, 2026](https://atomize.tools/blog/figma-design-system-best-practices/) | A current summary of the conventions the above share. |

## Taken

| Convention | Source | Why it fits Sentinel |
| --- | --- | --- |
| **Tokens before components, always** | all four | Nothing downstream survives without it. A component built before the variables exist carries literals forever. This is Phase 1 before Phase 3, no exceptions. |
| **Primitive layer hidden, semantic layer exposed** | M3, Blade, the 2026 summary | Sentinel already has the split in CSS — 31 literals and 28 aliases. `scopes = []` on the palette is what stops a designer picking `bronze` where the role is what carries meaning. |
| **Figma variable path mirrors the CSS custom property, one to one** | the 2026 summary, Blade | `--color-bronze` ⇄ `color/bronze`, with `codeSyntax` set to the literal `var(--color-bronze)`. Dev Mode then hands an engineer the token this repository actually has, not a lookalike. |
| **100% variable binding, zero literals in a component** | Blade, the 2026 summary | "Hard-coded values are where themes go to die." Here the ceiling is **zero**, not the 61 the code lint tolerates, because a new Figma component has no legacy to carry. |
| **3–5 variants; everything else is a component property** | the 2026 summary | Sentinel's props are already mostly booleans and text. A variant per icon is explicitly forbidden — `INSTANCE_SWAP`. |
| **Per-component documentation in the file, not a wiki** | Blade | Blade documents anatomy, tokens used, states, do/don't, content, motion and a11y per component. Sentinel already has all of that in 98 rendered spec pages; the Figma page carries the same content, so there is one story in two places rather than two stories. |
| **Cover → Getting started → Foundations → `---` → Components → `---` → Utilities** | Figma's skill, the community structure files | Plain, conventional, and a designer who has opened any other system file already knows where things are. |
| **A named owner and a changelog** | the 2026 summary | The owner is Ashish. The changelog is this repository's commit history plus `docs/FINDINGS.md`; the Figma file's Getting-started page links to both rather than starting a third record. |

## Rejected, with the reason

| Advice | Source | Why not here |
| --- | --- | --- |
| **Light and Dark modes on the colour collection** | all four; it is the default everywhere | Sentinel has no dark mode. `grep prefers-color-scheme design-system/tokens/*.css` returns nothing. A Dark mode would be 28 roles with a second value nobody has designed, and the first person to switch it would see a broken product and call it a bug in the file. |
| **Theme files layered over a base file** | Blade | Blade has multiple brands to theme. Sentinel has one. A second file is a second place for the token map to drift. |
| **Dot-notation token names (`surface.text.subtle`)** | Blade | Their code consumes dot paths. Ours consumes `var(--color-bronze)`. Matching Blade here would make the Figma name disagree with the CSS name, which is the exact failure the one-to-one rule exists to prevent. |
| **A generic 4/8pt spacing scale** | most guidance | Sentinel's scale has three tiers and includes 6, 10, 2, 3, 5, 13, 14 as documented exceptions, plus a 42px row and an 11.5px type step. `sentinel-craft/references/scale.md` is the authority; a tidy-up to 4/8 is a restyle. |
| **One Figma page per component** | Figma's skill default | It is right for a 20-component system. At 98 it produces a file nobody can navigate. One page per group — the 11 groups are already this system's taxonomy. |
| **Importing the product with html.to.design and componentising the result** | a common shortcut | It produces layers, not a system: no variables, no variant sets, no properties, and a name for every div. It would be quick and would have to be thrown away. Considered and rejected — with one narrow exception below. |
| **Smart Animate between frames** | every prototyping guide | The system has one easing, six durations and **no shared-element transition**. Smart-animating a card into a page invents motion the product does not ship. |
| **Contrast checked in two modes before publishing** | the 2026 summary | Half-applicable: checked, but in one mode, because there is one. The pairs are already measured in `sentinel-craft` and `docs/FINDINGS.md`. |

## The one narrow use for an HTML import

Not as a source of components — as a **reference underlay for Gate B**. The 148 spec pages and the
screens already render; an imported copy pinned beside a hand-built Figma component makes a
misalignment visible while it is being built, before the parity tool is run. It is a tracing guide,
it is deleted before the page ships, and nothing from it is ever published as a component.

## What none of them solve, and this repository does

No benchmark file answers *"is the Figma file still the product?"* — they answer "is it tidy". Blade
comes closest, through Code Connect. Sentinel's answer is `references/parity.md`: two gates, one
structural and one measured in pixels, with a probe that has been shown able to fail. That part is
not borrowed from anywhere, because nobody publishes it.
