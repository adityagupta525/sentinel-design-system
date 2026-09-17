import React from 'react';
/* Home greeting: dashed hairlines either side of a 27px Darker Grotesque line. */
export function GreetingDivider({ children }) {
  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)', padding: '8px 16px', boxSizing: 'border-box' }}>
      <div style={{ height: 0, flex: 1, borderTop: '1px dashed var(--color-line)' }} />
      <p style={{ margin: 0, whiteSpace: 'nowrap', textAlign: 'center', font: 'var(--type-greeting-font)', color: 'var(--color-bronze-deep)' }}>{children}</p>
      <div style={{ height: 0, flex: 1, borderTop: '1px dashed var(--color-line)' }} />
    </div>
  );
}
