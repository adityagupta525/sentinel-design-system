import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* A follow-up that runs past one line is not a pill.

   We specified at most three inline pills, but the real follow-ups in this product are long — "What
   about the 34 tiny funds?" — and a pill that wraps has stopped being a pill: its radius-full ends
   turn into a lozenge, its 44pt target becomes two rows of uneven target, and the chip row's rhythm
   breaks. Three products solve it as a row: Mindvalley groups full-width rows under a label,
   GitHub Copilot uses two-line cards with a title and a description, Agoda uses a leading icon and a
   trailing chevron.

   Sentinel's own language: ListRow's geometry and the bronze chevron, grouped under an Eyebrow, on
   the card surface. Not a pill with a bigger radius — a different vessel for a different length.

   THE RULE, which is what this component is really for: a follow-up that exceeds one line becomes a
   row, not a pill. Pill stays for short follow-ups; this takes the real questions. Rows are inline
   (they belong to the message that produced them and scroll away with it), so they sit in the
   thread under the answer, never in the dock — the dock is for what persists. */
const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M9 6l6 6-6 6" stroke="var(--color-bronze-deep)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export function FollowUpRow({ items = [], label = "Here's what you can ask next", onAsk, leading }) {
  if (!items.length) return null;
  return (
    <div style={{ width: '100%' }}>
      <p style={{ margin: `0 0 var(--space-6)`, font: 'var(--type-eyebrow-font)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</p>
      <div style={{ borderRadius: 'var(--radius-12)', background: 'var(--color-surface)', boxShadow: `inset 0 0 0 var(--border-1) var(--color-line)`, padding: `0 var(--space-14)`, boxSizing: 'border-box' }}>
        {items.map((it, i) => {
          const q = typeof it === 'string' ? { question: it } : it;
          return (
            <Pressable key={q.question} onClick={() => onAsk && onAsk(q.question)} label={`Ask: ${q.question}`}
              style={{ display: 'flex', width: '100%', minHeight: 'var(--h-row-md)', alignItems: 'center', gap: 'var(--space-10)', padding: `var(--space-10) 0`, borderTop: i ? `var(--border-hairline) solid var(--color-line-soft)` : 'none', textAlign: 'left' }}>
              {(q.leading || leading) && <span style={{ flexShrink: 0, display: 'flex' }}>{q.leading || leading}</span>}
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ font: 'var(--type-body-strong-font)', color: 'var(--color-ink)', textWrap: 'pretty' }}>{q.question}</span>
                {q.note && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', textWrap: 'pretty' }}>{q.note}</span>}
              </span>
              <Chevron />
            </Pressable>
          );
        })}
      </div>
    </div>
  );
}
