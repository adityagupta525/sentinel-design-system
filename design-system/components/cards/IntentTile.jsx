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

   REDRAWN 23 SEP 2026, ON THE OWNER'S NOTE THAT THE TILES READ AS LABELS IN BOXES. They did: a word, a
   figure, a hairline. Three things changed and none of them is a colour.
     1. A MARK IN THE BOTTOM-RIGHT, FULLY INSIDE THE TILE. It is a silhouette UNDER the label rather
        than an icon beside it, so the second time an advisor opens the explorer they reach for a
        shape instead of reading four words. It is texture, never meaning — every tile still states
        its class in words, so rule 1 holds and a tile with no mark is not a tile missing information.

        IT USED TO BLEED PAST THE CORNER AND IT LOOKED BROKEN. Drawn at 76px with a negative offset,
        the mark was cut by the straight part of the border-box before the radius curved away: the
        equity bars ended in a flat slice, the debt ladder's rungs stopped mid-rung, the ingot lost
        its base. At a glance it read as intentional cropping; at 4x it read as clipping damage, and
        the owner's note was that the outline was being cut. A bleeding object only reads as depth
        when it is unmistakably a big shape passing through — which a 76px flat glyph in an 88pt tile
        is not. So it sits inside with clearance, and nothing is clipped at all.
     2. THE TILE HAS A FLOOR, so a grid of four is a grid of four equal objects rather than four boxes
        of whatever height their text happened to need. 88 is the height at which a title, a count and
        the mark all sit without the mark touching the type.
     3. SELECTION IS A TICK AND A RING, not a fill alone. The old tile signalled only with
        --color-selected, which is a 1.06 contrast change against the surface — invisible to a good
        number of people and to anyone outdoors. The tick is a shape, and rule 1 is that colour never
        carries a meaning by itself.

   UNAVAILABLE IS A WORD, NEVER A ZERO. Four of the five asset classes Centricity sells — bonds, PMS, AIF,
   GIFT City — had no rows in the book at all. The product's rule is that what it cannot say, it says in
   words; a tile reading "Bonds · 0 funds" is a lie about an empty shelf rather than an admission of a
   missing feed. `unavailable` renders the tile inert with the reason underneath, and it is still visible,
   because an advisor needs to know the asset class exists and is coming.

   INERT, NOT DISABLED (F-46, F-31). `disabled` dims to 0.4 and takes the label with it. An unavailable
   tile keeps its label legible and drops only its affordance — the same fix RangePills and SegmentedRow
   already carry. */
const NUM = { fontVariantNumeric: 'tabular-nums' };

export function IntentTile({
  label, count = null, unit = 'funds', note, mark, selected = false,
  unavailable = false, unavailableNote, onClick,
}) {
  const inert = unavailable || !onClick;
  return (
    <Pressable
      onClick={unavailable ? undefined : onClick}
      aria-disabled={unavailable || undefined}
      tabIndex={unavailable ? -1 : undefined}
      pressed={selected}
      label={count == null ? label : `${label}, ${count} ${unit}`}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)',
        width: '100%', minHeight: 88, padding: 'var(--space-12)', textAlign: 'left',
        borderRadius: 'var(--radius-16)',
        background: selected ? 'var(--color-selected)' : 'var(--color-surface)',
        boxShadow: `0 0 0 var(--border-1) ${selected ? 'var(--color-bronze)' : 'var(--color-line)'}`,
        transition: 'box-shadow var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)',
        cursor: inert ? 'default' : undefined,
      }}>
      {/* THE MARK IS BEHIND EVERYTHING, and `pointerEvents:none` matters — it overlaps the label's
          box and a mark that swallowed a tap would make the bottom half of the tile dead. */}
      {mark && (
        <span aria-hidden="true" style={{
          position: 'absolute', right: 'var(--space-12)', bottom: 'var(--space-10)', pointerEvents: 'none',
          color: 'var(--color-bronze-deep)', opacity: unavailable ? 0.06 : selected ? 0.18 : 0.11,
          transition: 'opacity var(--dur-fast) var(--ease)',
          display: 'grid', placeItems: 'center',
        }}>{mark}</span>
      )}

      {/* The tick sits where the eye already goes for state on a card in this system — top right,
          the same corner Badge takes — and it is a shape, so selection survives a greyscale print. */}
      {selected && (
        <span aria-hidden="true" style={{
          position: 'absolute', top: 'var(--space-10)', right: 'var(--space-10)',
          width: 18, height: 18, borderRadius: 'var(--radius-full)',
          background: 'var(--color-bronze-deep)', color: 'var(--color-surface)',
          display: 'grid', placeItems: 'center', font: 'var(--type-caption-font)', lineHeight: 1,
        }}>✓</span>
      )}

      <span style={{ position: 'relative', font: 'var(--type-title-font)', color: 'var(--color-ink)', paddingRight: selected ? 22 : 0 }}>{label}</span>
      {/* The count and the note are one line of caption, because two lines of small type under a title
          is a card, and this is a tile. */}
      {count != null && (
        <span style={{ position: 'relative', font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)', ...NUM }}>
          {count.toLocaleString('en-IN')} {unit}
        </span>
      )}
      {note && !unavailable && <span style={{ position: 'relative', font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{note}</span>}
      {unavailable && (
        <span style={{ position: 'relative', font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
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
