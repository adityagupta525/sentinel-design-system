import React from 'react';
/* THE PLAIN CARD. `components/cards/` held fourteen cards and not one of them was simply a card, so
   nine screens and six system components hand-wrote the same box. Measured across the repository on
   19 Sep 2026: 38 hand-written surfaces, and one intent — a hairline ring — written THREE ways
   (`inset 0 0 0 var(--border-1) var(--color-line)`, `0 0 0 1px var(--color-line)`, and the same
   without `inset`), two of them inset and one not, one carrying a raw 1px. `moves.jsx:62` was
   byte-for-byte `InfoCard.jsx:69`. That is what a component with a name ends.

   EVERY DEFAULT HERE IS THE REPOSITORY'S OWN MOST-USED VALUE, not a preference:
     radius 16   — 18 of 38 (12 next, for a block INSIDE a card)
     padding 14  — 8 of the 28 that set one at all
     surface     — 31 of 38; canvas is the secondary, for a block inset into a surface
   So `<Surface>` with no props renders the box this system already draws most often.

   THE FOUR ELEVATIONS ARE THE FOUR THINGS A BOX CAN MEAN HERE, and nothing else:
     raised  the card the thread scrolls past         shadow-card      (10 uses)
     soft    a quieter card inside a panel            shadow-card-soft (3)
     ring    a block INSET into a card                hairline ring    (9, written 3 ways)
     flat    a box that groups and does not lift      none             (11)
   A fifth would be a new visual decision and belongs to the owner, not to a caller. */
const ELEVATION = {
  raised: 'var(--shadow-card)',
  soft: 'var(--shadow-card-soft)',
  /* INSET, and at --border-1. The three hand-written versions disagreed on both: an outset ring sits
     OUTSIDE the box and eats the gap to its neighbour, and --border-hairline is for row dividers and
     card edges, never for a ring that has to read as an edge of its own (spacing.css:56). */
  ring: 'inset 0 0 0 var(--border-1) var(--color-line)',
  flat: 'none',
};
const TONE = { surface: 'var(--color-surface)', canvas: 'var(--color-canvas)', bubble: 'var(--color-bubble)' };

export function Surface({
  children, elevation = 'raised', tone = 'surface',
  radius = 16, padding = 14, grow = false, style, ...rest
}) {
  const e = ELEVATION[elevation] || ELEVATION.raised;
  const bg = TONE[tone] || TONE.surface;
  /* Numbers, not strings, so a caller cannot pass `13`: the value is looked up in the scale and an
     unknown one falls back to the common case rather than silently drawing an off-ramp box. */
  const r = [8, 12, 16, 20, 24].includes(radius) ? `var(--radius-${radius})` : 'var(--radius-16)';
  const p = padding === 0 ? 0
    : [6, 8, 10, 12, 14, 16, 20].includes(padding) ? `var(--space-${padding})`
    : 'var(--space-14)';
  return (
    <div {...rest}
      style={{ width: '100%', boxSizing: 'border-box', borderRadius: r, background: bg, boxShadow: e,
        padding: p, ...(grow ? { flex: 1, minHeight: 0 } : null), ...style }}>
      {children}
    </div>
  );
}
