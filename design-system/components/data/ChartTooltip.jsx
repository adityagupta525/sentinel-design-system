import React from 'react';
import { tabular } from './chartMath.jsx';
/* For TAPPING a single mark. Hover does not exist at 375pt: this appears on tap, sits above the mark,
   flips below near the top edge, and dismisses on the next tap anywhere.
   Box style is the HeroNumberCard idiom so it belongs: surface fill, radius 8, padding 8/10, hairline
   as inset 0 0 0 0.5px --color-line. No arrow or tail — a 1px leader line to the mark instead, because
   a tail clips at the plot's edges and a clipped tail just looks broken.
   Two obligations sit with the caller: a tap target of at least 44pt around the mark, and a table view
   in the card's ⋯, so no value is ever reachable only by touching a coloured shape. */
export function ChartTooltip({ anchor = 'above', label, value, meta, leader = 14, style }) {
  const above = anchor !== 'below';
  return (
    <div role="status" style={{ position: 'absolute', left: '50%', [above ? 'bottom' : 'top']: '100%', transform: 'translateX(-50%)', [above ? 'marginBottom' : 'marginTop']: leader, zIndex: 20, pointerEvents: 'none', width: 'max-content', maxWidth: 200, borderRadius: 'var(--radius-8)', background: 'var(--color-surface)', padding: '8px 10px', boxSizing: 'border-box', boxShadow: 'inset 0 0 0 0.5px var(--color-line), var(--shadow-float)', animation: `ds-tip-${above ? 'up' : 'down'} 160ms var(--ease) both`, ...style }}>
      <style>{'@keyframes ds-tip-up{from{opacity:0;transform:translateX(-50%) translateY(4px)}to{opacity:1;transform:translateX(-50%)}}@keyframes ds-tip-down{from{opacity:0;transform:translateX(-50%) translateY(-4px)}to{opacity:1;transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){@keyframes ds-tip-up{from{opacity:0;transform:translateX(-50%)}to{opacity:1;transform:translateX(-50%)}}@keyframes ds-tip-down{from{opacity:0;transform:translateX(-50%)}to{opacity:1;transform:translateX(-50%)}}}'}</style>
      <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-15)', color: 'var(--color-muted)' }}>{label}</p>
      <p style={{ ...tabular, margin: '1px 0 0', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: 'var(--color-ink)', whiteSpace: 'nowrap' }}>{value}</p>
      {meta && <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-15)', color: 'var(--color-data-deemph)' }}>{meta}</p>}
      <span style={{ position: 'absolute', left: '50%', [above ? 'top' : 'bottom']: '100%', width: 1, height: leader, background: 'var(--color-line)' }} />
    </div>
  );
}
