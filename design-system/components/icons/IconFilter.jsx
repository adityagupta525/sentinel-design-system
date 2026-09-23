import React from 'react';
/* THREE SLIDERS, NOT A FUNNEL. A funnel glyph is the common one and it is wrong here: this product
   HAS a funnel — four questions down the screen — and using its picture for the thing that narrows
   the result would name two different mechanics with one shape. Sliders say "adjust", which is what
   the sheet does.

   TWO RAILS, NOT THREE. Three rails at 15px with a 1.5 stroke and three knobs is a dense smudge —
   drawn and looked at, it read as a glyph rather than as sliders. Two rails with larger knobs keeps
   the idea at the size it is actually used.

   Drawn in the set's own idiom: 15 viewBox, 1.5 stroke, round caps, `--color-bronze` by default, so
   it sits with IconChevronRight and IconPlus rather than beside them. The knobs sit at DIFFERENT
   positions on their rails, because knobs in a line is a drawing of a control at rest and this one is
   meant to look set. */
export function IconFilter({ stroke = 'var(--color-bronze)', size = 15 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}>
      <svg width={Math.round(size * 0.8)} height={Math.round(size * 0.8)} viewBox="0 0 15 15" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M2.25 5.25h10.5M2.25 10.125h10.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9.9" cy="5.25" r="2" fill="var(--color-surface)" stroke={stroke} strokeWidth="1.5" />
        <circle cx="5.1" cy="10.125" r="2" fill="var(--color-surface)" stroke={stroke} strokeWidth="1.5" />
      </svg>
    </span>
  );
}
