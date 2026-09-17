import React from 'react';
/* v4 §6 — every figure names where it came from. */
export function Provenance({ text }) {
  return <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-15)', color: 'var(--color-muted)' }}>{text}</p>;
}
