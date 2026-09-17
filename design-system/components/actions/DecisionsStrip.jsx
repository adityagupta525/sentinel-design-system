import React from 'react';
/* §1.4 · read-only strip of settled facts, separated by 14px hairlines. */
export function DecisionsStrip({ tokens }) {
  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 'var(--space-8)', overflowX: 'auto', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', padding: '10px 12px', boxShadow: '0 0 0 1px var(--color-line)', scrollbarWidth: 'none', boxSizing: 'border-box' }}>
      {tokens.map((t, i) => (
        <div key={t.label} style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 'var(--space-8)' }}>
          {i > 0 && <div style={{ height: 14, width: 1, background: 'var(--color-line)' }} />}
          <button type="button" onClick={t.onClick} style={{ appearance: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, borderRadius: 'var(--radius-full)', background: 'var(--color-chip)', padding: '5px 10px', boxShadow: '0 0 0 1px var(--color-line)' }}>
            <span style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: 'var(--color-bronze-deep)' }}>{t.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
