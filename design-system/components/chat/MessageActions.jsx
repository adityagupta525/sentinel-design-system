import React from 'react';
/* Per-message actions — the LAST message only. At 375pt, actions under every turn are noise.
   Text only at 11.5px muted, never pills: this system is text-forward and a row of ghost pills here
   would compete with the chip row directly below it. Tap targets are 44px through vertical padding;
   the row pulls that padding back out so the optical spacing stays tight under the bubble. */
const LABELS = { copy: 'Copy', edit: 'Edit', retry: 'Retry' };
export function MessageActions({ role = 'assistant', actions, onAction }) {
  const list = actions && actions.length ? actions : (role === 'user' ? ['edit'] : ['copy', 'retry']);
  return (
    <div style={{ display: 'flex', gap: 'var(--space-16)', justifyContent: role === 'user' ? 'flex-end' : 'flex-start', margin: '-8px 0 -10px' }}>
      {list.map((a) => (
        <button key={a} type="button" onClick={() => onAction && onAction(a)}
          style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', minHeight: 44, padding: '12px 2px', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 11.5, lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{LABELS[a] || a}</button>
      ))}
    </div>
  );
}
