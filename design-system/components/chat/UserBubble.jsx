import React from 'react';
/* Partner (advisor) bubble — peach, right-aligned, 20px radius with a 6px tail corner. */
export function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', animation: 'ds-rise var(--dur-enter) var(--ease) both' }}>
      <div style={{ maxWidth: 280, borderRadius: '20px 20px 6px 20px', background: 'var(--color-bubble)', padding: '10px 12px', boxShadow: '0 0 0 1px var(--color-bubble-edge)' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-19)', color: 'var(--color-ink)' }}>{text}</p>
      </div>
    </div>
  );
}
