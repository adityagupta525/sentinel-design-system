import React from 'react';
/* 44px status bar: 9:41, signal, wifi, battery. */
export function StatusSpacer() {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: 44, width: '100%', flexShrink: 0, alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 24px 6px', boxSizing: 'border-box' }}>
      <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-13)', color: 'var(--color-ink)' }}>9:41</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>{[6, 9, 12, 15].map((h) => <div key={h} style={{ width: 3, height: h, borderRadius: 1, background: 'var(--color-ink)' }} />)}</div>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5C10 2.5 11.8 3.3 13 4.6M8 6C9 6 9.9 6.4 10.5 7M5.5 9.3 8 11l2.5-1.7" stroke="var(--color-ink)" strokeWidth="1.3" strokeLinecap="round" /></svg>
        <div style={{ position: 'relative', height: 11, width: 22 }}><div style={{ position: 'absolute', inset: 0, borderRadius: 3, border: '1px solid var(--color-ink)', opacity: 0.4, boxSizing: 'border-box' }} /><div style={{ position: 'absolute', top: 1.5, bottom: 1.5, left: 1.5, right: 5, borderRadius: 1, background: 'var(--color-ink)' }} /></div>
      </div>
    </div>
  );
}
