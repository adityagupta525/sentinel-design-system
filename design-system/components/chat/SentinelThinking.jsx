import React from 'react';
import { SentinelBlock } from './SentinelBlock.jsx';
/* Waiting state: shimmering label + three bronze dots on a staggered opacity pulse, 1.2s.
   Opacity, not a bounce — a 6px dot hopping beside text reads as jitter, and the delight budget is
   spent on data arriving, not on waiting. Under prefers-reduced-motion both hold at full opacity.

   `verb` replaces the "Sentinel" label with what Sentinel is doing. The motion is unchanged — this is
   a word, not an animation. It exists because a bare pulse says only "wait", while the same pulse
   under "Reading his Q3 statement…" says what is being read, which is provenance arriving before the
   figure does. Omit it and the label is "Sentinel", exactly as before. */
export function SentinelThinking({ verb }) {
  return (
    <SentinelBlock shimmer label={verb || 'Sentinel'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', paddingLeft: 1 }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)', animation: `dot-pulse 1200ms var(--ease) ${i * 150}ms infinite` }} />)}
      </div>
    </SentinelBlock>
  );
}
