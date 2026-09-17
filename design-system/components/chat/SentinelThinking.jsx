import React from 'react';
import { SentinelBlock } from './SentinelBlock.jsx';
/* Waiting state: shimmering label + three bronze dots on a staggered opacity pulse, 1.2s.
   Opacity, not a bounce — a 6px dot hopping beside text reads as jitter, and the delight budget is
   spent on data arriving, not on waiting. Under prefers-reduced-motion both hold at full opacity. */
export function SentinelThinking() {
  return (
    <SentinelBlock shimmer>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', paddingLeft: 1 }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)', animation: `dot-pulse 1200ms var(--ease) ${i * 150}ms infinite` }} />)}
      </div>
    </SentinelBlock>
  );
}
