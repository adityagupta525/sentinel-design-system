import React from 'react';
/* V2 · dumbbell: hollow dot = target, filled dot = actual, bronze connector. */
export function Dumbbell({ label, target, actual, max = 100, targetLabel, actualLabel }) {
  const lo = Math.min(target, actual), hi = Math.max(target, actual);
  const pct = (v) => `${(v / max) * 100}%`;
  const dot = { position: 'absolute', top: '50%', width: 10, height: 10, transform: 'translate(-50%,-50%)', borderRadius: 'var(--radius-full)', boxSizing: 'border-box' };
  return (
    <div style={{ width: '100%' }}>
      {label && <p style={{ margin: '0 0 8px', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-13)', color: 'var(--color-ink)' } }}>{label}</p>}
      <div style={{ position: 'relative', height: 16, width: '100%' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 'var(--border-1)', transform: 'translateY(-50%)', background: 'var(--color-track)' }} />
        <div style={{ position: 'absolute', top: '50%', height: 2, transform: 'translateY(-50%)', left: pct(lo), width: pct(hi - lo) }}><div style={{ height: '100%', width: '100%', background: 'var(--color-bronze)', transformOrigin: 'left', animation: 'ds-grow 400ms var(--ease) both' }} /></div>
        <div style={{ ...dot, left: pct(target), border: '2px solid var(--color-bronze)', background: 'var(--color-canvas)', boxShadow: '0 0 0 2px var(--color-surface)' }} />
        <div style={{ ...dot, left: pct(actual), background: 'var(--color-bronze)', boxShadow: '0 0 0 2px var(--color-surface)' }} />
      </div>
      <div style={{ marginTop: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', color: 'var(--color-muted)' }}>{actualLabel ?? `${actual}%`} now</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: 'var(--color-bronze-deep)' }}>→ {targetLabel ?? `${target}%`}</span>
      </div>
    </div>
  );
}
