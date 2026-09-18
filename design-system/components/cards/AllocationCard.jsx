import React from 'react';
/* Allocation card: label/value rows (--h-row, 42px) + a 6px stacked bar. Bars grow with scaleX, never
   width. The row height was the literal 42 until v12, while spacing.css had carried --h-row:42px with
   the comment "SuggestionRow, AllocationCard rows" the whole time — the token was written FOR this
   component and this component never used it. Same pixel, one less raw value. */
export function AllocationCard({ segments, animate = true }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 100;
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxSizing: 'border-box', padding: '2px 12px' }}>
      {segments.map((s, i) => (
        <div key={s.label} style={{ display: 'flex', height: 'var(--h-row)', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < segments.length - 1 ? '0.5px solid var(--color-line-soft)' : 'none' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }}>{s.label}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }}>{s.value}%</span>
        </div>
      ))}
      <div style={{ padding: '10px 0 12px' }}>
        <div style={{ display: 'flex', height: 6, width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-full)', background: 'var(--color-track)' }}>
          {segments.map((s, i) => <div key={s.label} style={{ height: '100%', width: `${(s.value / total) * 100}%`, background: s.color, transformOrigin: 'left', animation: animate ? `ds-grow var(--dur-bar) ease-in-out both` : 'none', animationDelay: `${i * 120}ms` }} />)}
        </div>
      </div>
    </div>
  );
}
