import React from 'react';
import { IconSparkle } from '../icons/IconSparkle.jsx';
/* Sentinel response block: sparkle + "Sentinel" label, then children. No bubble. */
/* ONE LABEL PER TURN (18 Sep 2026, the owner reading a screen): a turn is often more than one block —
   the trace, then the answer — and each block signed itself, so "✦ Sentinel" appeared twice, eleven
   points apart, for one thing Sentinel said. `continued` drops the signature on every block after the
   first. It is not a variant: the blocks are identical below the header, and the header is a name that
   should be said once. */
export function SentinelBlock({ children, shimmer = false, label = 'Sentinel', continued = false }) {
  return (
    <div style={{ width: '100%' }}>
      {!continued && (
        <div style={{ marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: 'var(--space-8)', animation: shimmer ? 'sentinel-shimmer 1200ms ease-in-out infinite' : 'none' }}>
          <IconSparkle />
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{label}</span>
        </div>
      )}
      {children}
    </div>
  );
}
