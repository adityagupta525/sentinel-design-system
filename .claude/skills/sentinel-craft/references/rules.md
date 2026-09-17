# The rules that are Sentinel's

General good practice applies everywhere and is not listed here. These are the laws this product made
for itself, what each one protects, and what it costs to break. A break is `Block`, not a nit.

Source: `design-system/SKILL.md` for the four, `design-system/readme.md` for the reasoning.

---

## 1 · Colour never encodes identity

One bronze hue carries **magnitude** — bars, meters, lines. Identity is **always a direct label**.

- No pies, no donuts, no multi-hue stacked bars. Ever.
- Three or more series is **small multiples**: one chart each, same scale, stacked down the card.
  A third line would have to encode identity in a hue, and this palette cannot.
- Two series are both **end-labelled directly**, so there is no legend and no second label row.
- The status family (`--color-status-{over|under|ok}-{bg|fg}`) is **reserved**: never a series colour,
  and never used without a word beside it.
- Warm grey `--color-muted` carries de-emphasis, not a category.

**Why it holds:** an advisor reads a chart aloud to a client. A hue that means "HDFC" is a hue the
client cannot ask about. A label is answerable.

## 2 · Bad news sits on the peach bubble surface

`--color-danger` is **text and eyebrow colour only — never a fill**.

- The peach bubble `--color-bubble` `#f9eee6` and the status-over peach `#f3e2da` carry bad news.
- A red block reads as an alarm, and most bad news in wealth management is a nuance: a drift, a cap,
  a disclosure. An alarm would be a lie about the stakes.

## 3 · The composer is on every screen

A CTA **stacks above it** in the Dock. Nothing replaces it.

- Home, the thread, the journey, the drawer, and an expanded artifact card — where the placeholder
  becomes "Ask about this".
- The confirm sheet is the single documented exception.
- **The advisor can always just ask.** A screen that takes that away has taken away the product.

## 4 · Indian number grouping, always

₹1,85,000 · ₹25 L · ₹4.2 Cr · ₹18.4 L. Day-first dates, short month: "15 Sep",
"Placed 16 Sep, 9:41 · settles T+2".

- **One decimal on every figure** — 18.4%, 12.1%, −14.2%. A chart that renders a raw float is a chart
  an advisor cannot read to a client. This is not hypothetical: the fund card shipped
  `14.60000000000000075%`.
- `font-variant-numeric: tabular-nums` on anything that changes — count-ups, columns, chart labels.
- **Provenance under every figure**: "As of 30 Sep · from his Q3 statement and mandate on file."

---

# The rules below the four

Not in the headline list, but each one is load-bearing and each has been broken at least once.

## Operability is the base's job, not the caller's

`Pressable` carries both guarantees so thirty component files inherit them:

- **≥44pt target**, measured from the rendered box. A visual box may be 28 or 42; the target may not.
- **Focus**: a 2px solid `--border-focus` **outline** plus the `--focus-ring` halo, on `:focus-visible`.
  An outline, not a box-shadow — an inline `style.boxShadow` from a caller beats a stylesheet
  declaration, and four callers silently lost their focus ring that way.
  `--focus-ring` alone measures **1.22:1** and fails WCAG 2.4.13's 3.0 floor. Never use it alone.

**No control inside a control.** A `<button>` inside a `<button>` is invalid, browsers unnest it, and
assistive technology announces a control inside a control. Where a whole area should be tappable, the
press target is a **sibling behind** the content, never an ancestor of it — see `ArtifactCard`.

## A global rule does not live inside a component

A `<style>` child of `<button>` is an invalid content model and duplicates once per instance — a page
of range chips carried 53 identical copies. Rules that are identical for every instance belong in
`tokens/effects.css`. A per-instance value is a custom property set inline; the rule that reads it is
not.

## Motion: waiting is opacity only

- **One easing**, `cubic-bezier(0.2,0.8,0.2,1)`. There is no second curve.
- Press **0.98**, and **0.94** on 42px discs. Not 0.96 — that is another product's number.
- Enter: fade + 8–12px rise, 240–320ms, 60ms stagger. Bars fill by `scaleX`, never by width.
  Numbers count up 600ms. Success is a **drawn check**, not confetti.
- The thinking dots pulse 0.28 → 1 across 1.2s. **No bounce** — a 6px dot hopping beside text reads as
  jitter, and the delight budget is spent on data arriving.
- **No blur anywhere.** Any recipe that reaches for `filter: blur()` is for a different product.
- **Reduced motion lives in three places** and all three are required: `tokens/effects.css` for the
  global keyframes, each component's own `<style>` for the five component-local ones (those sheets
  append after the stylesheet and would otherwise win), and `MotionGuard` inside the bundle, so a
  consuming project that loads `_ds_bundle.js` with its own styles honours it too.
  Keyframes are **redefined, not cancelled**, so nothing is stranded mid-transform.

## Surfaces

- Cards: white, radius 16, padding 14–16, shadow `0 1px 2px rgba(37,31,27,.05)` **or** a 1px ring —
  **never both heavy**.
- Depth is reserved: the composer, the floating scroll disc, the drawer, the phone. Nowhere else.
- **No blur, no photography, no illustration.** Avatars are initials in a bronze-20% disc.
- The dark gradient `#3b3531 → #1a1614 → #111` appears in exactly three places: the composer send
  disc, the Stop button and the 48px `DarkButton`. Nothing else is dark.
- One dotted paper texture, 3px, ink at 4.5%. No other pattern.

## Voice

Sentinel speaks in the first person as a careful colleague. The advisor is "you"; the client is named.

- **Honesty is the register.** "I did not follow that", "I have not applied it", "I won't invent a
  rate". Failure disclosure over invention, every time.
- Short declaratives, **numbers first**. "Two moves, not seven."
- **Sentence case everywhere.** Only the 11px Eyebrow and 10px DeltaPill are uppercase, by CSS
  transform, never typed.
- **No emoji. No exclamation marks.** The only "✓" is a text glyph inside "Shortlisted ✓".
- Em dash with spaces for the pivot; middle dot for meta chains; "›" for open; "→" for consequence.

## The contract that is easy to break by accident

**An expanded `ArtifactCard` takes its content's natural height and the thread carries the scroll.**
Never `overflow: auto` on the card or its children, never a `maxHeight`. A scroller inside the
scrolling thread is the pattern the removed full-bleed canvas existed to avoid.

**Peek is 96px, fixed** — recognition, not reading. What fits: a sparkline strip, one stat row, or a
table's top three rows plus a "+40 more" line. Never a chart with axes.
