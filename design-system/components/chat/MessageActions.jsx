import React from 'react';
/* Per-message actions — the LAST message only. At 375pt, actions under every turn are noise.
   Text only at 11.5px muted, never pills: this system is text-forward and a row of ghost pills here
   would compete with the chip row directly below it.

   THE OVERHANG IS ARITHMETIC, NOT A GUESS (F-44, 19 Sep 2026). The target is 44 and the visible line is
   --leading-16, so each button overhangs its own text by (44 - 16) / 2 = 14 on the top and on the
   bottom. The row must pull back exactly that, or the 44pt target becomes visible spacing: it used to
   pull -8 and -10, which left the word "Edit" sitting 19px under the bubble when the turn's own rhythm
   is 8. The owner found it by looking at a prompt and its Edit.
   Written as the subtraction rather than as two numbers, so changing the target or the type moves it. */
const TARGET = 44;
const LINE = 16;                       /* --leading-16, the visible line box of --type-meta-font */
const OVERHANG = (TARGET - LINE) / 2;  /* 14 */
const LABELS = { copy: 'Copy', edit: 'Edit', retry: 'Retry' };
export function MessageActions({ role = 'assistant', actions, onAction }) {
  const list = actions && actions.length ? actions : (role === 'user' ? ['edit'] : ['copy', 'retry']);
  return (
    <div style={{ display: 'flex', gap: 'var(--space-16)', justifyContent: role === 'user' ? 'flex-end' : 'flex-start', margin: `${-OVERHANG}px 0` }}>
      {list.map((a) => (
        <button key={a} type="button" onClick={() => onAction && onAction(a)}
          style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', minHeight: TARGET, padding: `${OVERHANG}px 2px`, font: 'var(--type-meta-font)', color: 'var(--color-muted)' }}>{LABELS[a] || a}</button>
      ))}
    </div>
  );
}
