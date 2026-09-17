import React from 'react';
/* Small-caps grey eyebrow — column headers, meta, dividers. */
export function Eyebrow({ children, color = 'var(--color-muted)', style }) {
  return <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-11)', textTransform: 'uppercase', letterSpacing: '0.08em', color, ...style }}>{children}</p>;
}
