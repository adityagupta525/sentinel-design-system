import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* A7 · pinned below the header while a journey is paused. */
export function DetourBanner({ label, onResume }) {
  return (
    <div style={{ position: 'relative', zIndex: 10, margin: '0 16px', display: 'flex', height: 32, alignItems: 'center', justifyContent: 'space-between', borderRadius: 'var(--radius-10)', background: 'var(--color-chip)', padding: '0 12px', boxShadow: '0 0 0 1px var(--color-line)', animation: 'ds-rise var(--dur-enter) var(--ease) both' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', color: 'var(--color-muted)' }}>{label}</span>
      <Pressable onClick={onResume} style={{ borderRadius: 'var(--radius-full)', padding: '0 6px' }}><span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: 'var(--color-bronze-deep)' }}>Resume</span></Pressable>
    </div>
  );
}
