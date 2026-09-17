import React from 'react';
/* A6 · 12px grey note under the user bubble ("understood as ₹1,80,000"). */
export function ParseNote({ text }) {
  return <p style={{ margin: 0, width: '100%', paddingRight: 'var(--space-2)', textAlign: 'right', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)', animation: 'ds-fade 300ms var(--ease) both' }}>{text}</p>;
}
