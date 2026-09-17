import React from 'react';
/* C15 · single 8px bronze bar on the alloc track + caption. */
export function ConcentrationBar({ fraction, label }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', height: 8, width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-full)', background: 'var(--color-track)' }}>
        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)', transformOrigin: 'left', transform: `scaleX(${fraction})`, animation: 'ds-grow 500ms var(--ease) both' }} />
      </div>
      <p style={{ margin: '6px 0 0', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', color: 'var(--color-muted)' } }}>{label}</p>
    </div>
  );
}
