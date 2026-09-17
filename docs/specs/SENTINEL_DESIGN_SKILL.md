---
name: sentinel-design
description: Design, extend or audit the Sentinel chat-led advisor app and its design system. Use for any component, screen, journey, motion or audit work on Sentinel — it holds the product's laws, the measure-before-you-design method, how to take and verify inspiration, and the keyframe QA every screen must pass.
---

# Sentinel — how design work is done here

Sentinel is a chat-led wealth app for financial advisors, 375 × 812, in a warm cream / sand / bronze palette. The conversation is the only surface. This skill is the method, not the spec; the specs are the attached documents and the system's own `readme.md` and `guidelines/contradictions.md`.

## The five gates, in order, no skipping

**1 · Read.** Before designing anything, read the system's `readme.md`, `guidelines/contradictions.md` and the `.prompt.md` of every component you will touch. The contradiction log is authoritative: a row marked ✅ is settled and must not be re-litigated, and a row marked ◐ is a known debt with a trigger — check whether your pass satisfies that trigger.

**2 · Measure.** Never design against an assumption you could have measured. Parse, count, compute. Before touching a chart, compute its marks' contrast against both backgrounds. Before adding a token, count how many of the existing ones are dead. Before claiming a height fits, measure the box and the content. Print the numbers in the report — a number is the only thing that settles an argument here, and this project has a history of specs that asserted and builds that measured.

**3 · Research.** Covered below.

**4 · Build.** Token-first. Every component ships with its nine-block page **in the same commit** — a component with no page is not in the system. Every new rule lands in the readme, and every conflict lands in the contradiction log with a date and, if it is a debt, a trigger.

**5 · Verify.** Covered below. Nothing is reported as done on the strength of having written it.

## How to take inspiration, the way a designer does

Search the references (Mobbin for product patterns, the web for system documentation). Then:

- **Extract the mechanism, never the layout.** The useful finding is *"four AI products collapse each tool call into a one-line row with per-step state"*, not *"make it look like Manus"*. Name the mechanism, name the products that use it, then design it in Sentinel's own language.
- **Test the mechanism against our constraints before adopting it.** Most of what looks good in a reference fails here for a stated reason: a floating tooltip fails because a finger covers the mark, a colour key fails because three of our four ramp steps do not clear 3:1, a pie fails on measured ΔE. If a pattern survives the constraints, it is ours; if it does not, say which constraint killed it.
- **Cite what you looked at.** Link the source screens. An unverifiable inspiration claim is worth nothing.
- **Never reproduce another product's visual identity** — no borrowed illustration, icon set, wordmark or signature layout. Mechanisms travel; expression does not.
- **Prefer a reference from a compliance-bearing product.** How Monzo words a rounding caveat is worth more to us than how a consumer app words anything, because our reader has to defend the number to a client.

## Verification — watch it, do not assume it

**Drive the interface.** Click the taps you built and report what resolved. Report `scrollTop` before and after an expand, and whether the card's header lands where the contract says. A tap you did not press is a tap that does not work — twice in this project a whole journey was unreachable because nobody pressed anything.

**Watch every screen in keyframes.** For each state that moves, capture and read three frames — at rest, mid-transition, and settled — and check four things: nothing clips, nothing reflows the layout as it lands, the property animating is the one the legend names, and the duration sits inside its budget (micro 80–400 ms, data reveal to 600 ms). Then set the reduced-motion switch and watch it again: every looping or entrance animation must resolve to its final state with an opacity fade and nothing else.

**Measure the box.** Every artboard reports its content height against its container. When the two disagree, report the two numbers — do not adjust padding and hope.

**QA sweep before reporting:** zero raw hex outside `tokens/`; no value on a page that is not a token; no artboard exceeding 812 with the composer docked; touch targets ≥ 44 pt; a visible focus indicator on everything operable; tabular figures on every column and count-up; every list and card has an empty state; every figure without a data owner renders visually locked.

**Report the two numbers every time** — tokens and components — plus what you measured, what you changed, and what you could not do and why.

## The laws — these are not preferences

- The conversation is the only surface. No `Back to chat`, because there is nowhere to go back from. Artifacts expand and collapse in place.
- No nested scroll. Vertical inside vertical is forbidden; horizontal inside vertical is orthogonal and allowed, with one sticky column and one axis.
- `ArtifactCard` peek is **96 pt, fixed** — recognition, not reading. A sparkline strip or three table rows. Expanded is plot 180 + axis 14.
- Placement: dock controls act on the current state and persist; inline controls belong to one message and scroll away; card actions live on the card's foot.
- Colour comes from a data role — `ramp`, `muted`, `status` — never from a prop. No chart takes a colour. Identity is carried by direct labels, position and edges, because the palette cannot carry a colour key.
- No categorical colour, no pie, no donut. Ruled with validator evidence; do not re-open.
- One easing, `cubic-bezier(0.2, 0.8, 0.2, 1)`. No overshoot; this product does not bounce. `stroke-dashoffset` for path draw-on is the single named exception, first reveal only.
- No toasts. Confirmation happens on the control that was pressed.
- No swipe actions in a thread. Row operations live in the row's `⋯`.
- Success copy describes the user's world, not our infrastructure: not "uploaded successfully" but "read her September statement · 4 pages · 12 holdings".
- The design system holds tokens, components and states. It does not hold product screens.
- A figure with no data owner renders visually locked. Never invent a number, a ceiling or an offer term.

## Where the judgement calls sit

Three decisions belong to Rahul and no agent may guess them: the mandate ceiling, the source of fund performance data, and the AMC offer terms. Anything that depends on them renders locked and says so.
