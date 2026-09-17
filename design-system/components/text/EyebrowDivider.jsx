import React from 'react';
import { Eyebrow } from './Eyebrow.jsx';
/* C9 · hairline — eyebrow — hairline */
export function EyebrowDivider({ children }) {
  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 'var(--space-10)', padding: '2px 0' }}>
      <div style={{ height: 'var(--border-hairline)', flex: 1, background: 'var(--color-line)' }} />
      <Eyebrow>{children}</Eyebrow>
      <div style={{ height: 'var(--border-hairline)', flex: 1, background: 'var(--color-line)' }} />
    </div>
  );
}
