import React from 'react';
import { IconSparkle } from '../icons/IconSparkle.jsx';
/* Sentinel response block: sparkle + "Sentinel" label, then children. No bubble. */
export function SentinelBlock({ children, shimmer = false, label = 'Sentinel' }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: 'var(--space-8)', animation: shimmer ? 'sentinel-shimmer 1200ms ease-in-out infinite' : 'none' }}>
        <IconSparkle />
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{label}</span>
      </div>
      {children}
    </div>
  );
}
