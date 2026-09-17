import React from 'react';
import { tabular } from './chartMath.jsx';
/* For dragging along a plot. A FIXED row above the chart, never a box that follows the finger: during
   a scrub the finger is sitting on the thing you are trying to read. Nothing moves except the numbers
   and the 1px crosshair the chart draws. The row is reserved when idle, showing the latest value, so
   it never appears out of nowhere and shifts the layout — that reservation is the whole component. */
export function ChartReadout({ label, value, active = false, idleNote }) {
  return (
    <div style={{ display: 'flex', height: 22, width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{label || idleNote || ''}</span>
      <span style={{ ...tabular, flexShrink: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: active ? 'var(--color-ink)' : 'var(--color-bronze-deep)' }}>{value}</span>
    </div>
  );
}
