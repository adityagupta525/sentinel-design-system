import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* A NAMED FILTER SET WITH ITS COUNT — the first screen of the explorer, as a sentence rather than a
   form.

   Kabir found eleven guided paths across the Indian market and ten of them are a SEPARATE surface from
   the screener: a quiz, a goal flow, a robo questionnaire. The eleventh — GoldenPi's purpose tiles
   ("Highly Rated", "High Returns", "Get Tax Free Return", "Maturing within 3 Years") — lives INSIDE the
   explorer, and it is the only one an advisor can walk without leaving what they were doing. Centricity's
   own One Digital does the same thing one level up: "Choose your exposure · Equity 612 funds · Debt 448
   · Hybrid 216 · Index/Passive 463". A tile is a pre-filled filter set with a name, so the first screen
   reads as a sentence and the advisor never meets an empty form.

   THE COUNT IS THE POINT, not decoration. Baymard calls option counts the single highest-impact fix to
   any filter interface, and every funnel the research found that worked carries one — Coin's "View 1,731
   funds", One Digital's "612 funds". A tile with no count asks the advisor to tap and find out, which is
   the tap this component exists to save.

   UNAVAILABLE IS A WORD, NEVER A ZERO. Four of the five asset classes Centricity sells — bonds, PMS, AIF,
   GIFT City — have no rows in the book at all. The product's rule is that what it cannot say, it says in
   words; a tile reading "Bonds · 0 funds" is a lie about an empty shelf rather than an admission of a
   missing feed. `unavailable` renders the tile inert with the reason underneath, and it is still visible,
   because an advisor needs to know the asset class exists and is coming.

   INERT, NOT DISABLED (F-46, F-31). `disabled` dims to 0.4 and takes the label with it. An unavailable
   tile keeps its label legible and drops only its affordance — the same fix RangePills and SegmentedRow
   already carry. */
const NUM = { fontVariantNumeric: 'tabular-nums' };

export function IntentTile({ label, count = null, unit = 'funds', note, selected = false, unavailable = false, unavailableNote, onClick }) {
  const inert = unavailable || !onClick;
  return (
    <Pressable
      onClick={unavailable ? undefined : onClick}
      aria-disabled={unavailable || undefined}
      tabIndex={unavailable ? -1 : undefined}
      pressed={selected}
      label={count == null ? label : `${label}, ${count} ${unit}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)',
        width: '100%', minHeight: 'var(--h-touch)', padding: 'var(--space-12)', textAlign: 'left',
        borderRadius: 'var(--radius-16)',
        background: selected ? 'var(--color-selected)' : 'var(--color-surface)',
        boxShadow: `0 0 0 var(--border-1) ${selected ? 'var(--color-bronze)' : 'var(--color-line)'}`,
        cursor: inert ? 'default' : undefined,
      }}>
      <span style={{ font: 'var(--type-title-font)', color: 'var(--color-ink)' }}>{label}</span>
      {/* The count and the note are one line of caption, because two lines of small type under a title
          is a card, and this is a tile. */}
      {count != null && (
        <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)', ...NUM }}>
          {count.toLocaleString('en-IN')} {unit}
        </span>
      )}
      {note && !unavailable && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{note}</span>}
      {unavailable && (
        <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
          {unavailableNote || 'No feed yet — nothing to show rather than nothing on the shelf.'}
        </span>
      )}
    </Pressable>
  );
}

/* Two to a row at 375, which is the width One Digital uses for the same job and the widest a count and
   a two-word label sit on one line without wrapping. The grid is here rather than on each screen so the
   gap cannot drift between the three explorer variations. */
export function IntentGrid({ children, cols = 2 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 'var(--space-8)' }}>
      {children}
    </div>
  );
}
