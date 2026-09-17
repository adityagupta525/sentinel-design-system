import React from 'react';
/* C19 · demo-data footer (superseded by Provenance in v4, still exported). */
export function DemoFooter({ text = 'Demo data — Meera Nair is an example. No real portfolio is shown.' }) {
  return <p style={{ margin: 0, width: '100%', textAlign: 'center', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{text}</p>;
}
