import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* A2 artifact-canvas header — ‹ Back to chat · title · ⋯ */
export function CanvasHeader({ title, onBack, onMenu, backLabel = 'Back to chat' }) {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: 44, width: '100%', flexShrink: 0, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxSizing: 'border-box' }}>
      <Pressable onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', padding: '8px 12px', boxShadow: '0 0 0 1px var(--color-line)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 3 4.5 6l3 3" stroke="var(--color-bronze-deep)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-12)', lineHeight: 1, color: 'var(--color-bronze-deep)' }}>{backLabel}</span>
      </Pressable>
      <p style={{ margin: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', color: 'var(--color-ink)' }}>{title}</p>
      <Pressable onClick={onMenu} style={{ display: 'flex', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="4" cy="10" r="1.4" fill="var(--color-ink)" /><circle cx="10" cy="10" r="1.4" fill="var(--color-ink)" /><circle cx="16" cy="10" r="1.4" fill="var(--color-ink)" /></svg>
      </Pressable>
    </div>
  );
}
