import React from 'react';
/* A LABEL AND ITS FIGURE, ON ONE BASELINE — and the tabular figures are set here.
   Four hand-written instances across three screens (`moves.jsx:70`, `rebalance.jsx:30` and `:34`,
   `review.jsx:46`), all the same declaration — flex, `align-items: baseline`, `space-between`,
   `--space-8` — and all four setting `fontVariantNumeric: 'tabular-nums'` on the right-hand span by
   hand. Rule 4 asks for tabular figures on anything that changes, and four call sites remembering it
   independently is four chances to forget. A component is how that stops being remembered.

   TWO WEIGHTS, AND THEY ARE A PAIR. `strong` is the row that carries the answer; `quiet` is the row
   that qualifies it, and it sits under the first. A card with two strong rows has not decided what it
   is saying — which is why `sub` is a `quiet` row rather than a second `strong` one.

   `tone='over'` IS TEXT, NEVER A FILL (rule 2). A figure the product cannot stand behind — an uncosted
   move — says so in `--color-status-over-fg` on whatever surface it is already on. This component
   never paints a background. */
const FONT = { strong: 'var(--type-row-strong-font)', quiet: 'var(--type-caption-font)' };
const INK = { strong: 'var(--color-ink)', quiet: 'var(--color-muted)' };

function Pair({ label, value, weight, tone }) {
  const font = FONT[weight] || FONT.strong;
  const color = tone === 'over' ? 'var(--color-status-over-fg)' : (INK[weight] || INK.strong);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
      <span style={{ font, color }}>{label}</span>
      {/* Tabular ALWAYS, and on the value only: a label is words and a figure is a column. */}
      <span style={{ font, color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

export function FigureRow({ label, value, sub, weight = 'strong', tone = 'ink' }) {
  if (!sub) return <Pair label={label} value={value} weight={weight} tone={tone} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <Pair label={label} value={value} weight={weight} tone={tone} />
      <Pair label={sub.label} value={sub.value} weight="quiet" tone={sub.tone || 'ink'} />
    </div>
  );
}
