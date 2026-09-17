# What was taken, and what was not

The method here is adapted from the **`interfaces`** skills by Jakub Krehel — MIT, interfaces.dev,
`github.com/jakubkrehel/skills`. Recorded so the debt is visible and so nobody re-imports the parts
that were rejected on purpose.

## Taken

| From | What | Where it lives here |
| --- | --- | --- |
| Repository structure | Progressive disclosure — a short skill that routes to focused references loaded on demand | `SKILL.md` + `references/` |
| `interface-review` | Review in a fixed order so a foundational failure is not hidden under polish | `SKILL.md` → Reviewing |
| `interface-review` | Evidence rule: never a code finding from appearance alone, never a visual finding from source alone | `SKILL.md` → Look at it |
| `interface-review` | One consolidated table, one root cause per row, severity then reach | `review-format.md` |
| `interface-review` | **Considered and rejected** — candidates inspected and deliberately left alone | `review-format.md` |
| `interface-review` | Coverage table that distinguishes `Clear` from `Not reviewed` | `review-format.md` |
| `break` | One component, every scenario it can actually reach, one page, look once | `scenarios.md` |
| `break` | Scenario axes kept only when a cue matches, and dropped axes named in one line | `scenarios.md` |
| `break` | An **owner** per finding, so the fix starts in the right place | `scenarios.md` |
| `break` | "A predicted failure is still not a finding" | `SKILL.md` |
| `better-interface` | Match the project's styling system; never introduce a second approach to apply a fix | `SKILL.md` → Changing something |

## Rejected, and why

Each of these is sound advice for the products it was written for. None survives contact with
Sentinel's token layer.

| Rejected | Sentinel's position |
| --- | --- |
| The 4/8pt spacing audit, "anything not a multiple of 4 is off-grid" | The scale is **4/8/12/16/20/24**, with **6 and 10** tolerated inside chips and cards and **2/3/5/13/14** as named exceptions each justified at use. A flat 4/8 pass flags 11.5px type, 13px pill inset, 14px card padding, and 42/46/52px rows — the product. `scale.md` reads the real tiers from the tokens |
| `scale(0.96)` on press, *"Always use 0.96"* | `--press-scale` is **0.98**, and **0.94** on 42px discs — token layer, documented in readme.md |
| Icon transitions with `filter: blur(4px)` and a spring | **"No blur anywhere"** is an explicit rule. There is one easing, `cubic-bezier(0.2,0.8,0.2,1)`, and no spring anywhere |
| `motion` / `framer-motion` import conventions | Neither is installed. Motion is CSS transitions and keyframes |
| Image outlines in `oklch(0 0 0 / 0.1)` | The product ships **no images**. "No photography, no illustration" |
| Shadows instead of borders for depth | Sentinel already decided the opposite way round: a card is `0 1px 2px` at 5% ink **or** a 1px ring, never both heavy, and depth is reserved for four surfaces |
| Dark-mode token pairs | One visual world. There is no dark mode, and inventing one would describe a system that does not exist |
| The Figma annotation machinery — cards, connectors, `figma.loadFontAsync` | Belongs to a Figma plugin context. Sentinel's review surface is the rendered preview page |
| Concentric radius maths, `outer = inner + padding` | Useful, but Sentinel's radii are a fixed named set (6/8/10/12/16/20/24/44/full) where 16 and 20 are load-bearing. Derive a radius and you leave the set |
| `text-wrap: balance` / `pretty` as defaults | Fine where it applies, but the product is 375pt with hand-tuned line-heights per size; wrapping changes are visual changes and need a decision first |

## Licence

MIT. Reproducing text from those skills requires the copyright notice; this file is the attribution for
the method, and no file here copies their prose verbatim.
