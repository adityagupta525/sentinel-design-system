import React from 'react';
import { InfoDot } from '../actions/InfoDot.jsx';
/* V5 · stat tile. Label sentence-case, value in the display face, one qualifying line beneath.
   Never a one-bar bar chart. `locked` renders a supplied-by-someone-else figure.
   v11: `onExplain` puts an ⓘ beside the label, and `caveat` puts the rounding or basis note AT the
   number instead of in a page footer — the two Monzo rules, at the two scales they belong to.
   The sparkline stroke moves to bronze-deep: measured, ramp 2 is 2.57 against surface and a 2px line
   at that ratio is not a mark anyone can see. */
export function StatTile({ label, value, note, sparkline, locked = false, onExplain, caveat }) {
  return (
    <div style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column', gap: 'var(--space-4)', borderRadius: 'var(--radius-12)', background: locked ? 'var(--color-chip)' : 'var(--color-surface)', padding: `var(--space-10) var(--space-12)`, boxShadow: `0 0 0 var(--border-1) var(--color-line)`, boxSizing: 'border-box' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <span style={{ font: 'var(--type-label-font)', fontWeight: 'var(--weight-medium)', color: 'var(--color-muted)' }}>{label}</span>
        {onExplain && <InfoDot figure={label} onOpen={onExplain} />}
      </span>
      <span style={{ font: 'var(--type-figure-font)', color: locked ? 'var(--color-data-deemph)' : 'var(--color-bronze-deep)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {sparkline}
      {note && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{note}</span>}
      {caveat && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-data-deemph)', textWrap: 'pretty' }}>{caveat}</span>}
    </div>
  );
}
export function Sparkline({ points, width = 84, height = 18 }) {
  const min = Math.min(...points), max = Math.max(...points), span = max - min || 1;
  const d = points.map((p, i) => `${(i / (points.length - 1)) * width},${height - ((p - min) / span) * height}`).join(' L ');
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: 'block', marginTop: 'var(--space-2)' }}><path d={`M ${d}`} stroke="var(--color-bronze-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
