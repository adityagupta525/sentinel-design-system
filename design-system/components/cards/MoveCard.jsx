import React from 'react';
/* C16 · numbered move card — the display numeral is --type-figure-font.
   It was the literals `font-display / weight-medium / 24 / 1` until v12, while typography.css carried
   --display-24 with the comment "MoveCard numeral" and --type-figure-font wrapping it. InfoCard and
   StatTile already took the role; this component spelled it out beside them (F-24). */
export function MoveCard({ n, title, body }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-12)',  width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', boxSizing: 'border-box', padding: '13px 14px' }}>
      <span style={{ font: 'var(--type-figure-font)', color: 'var(--color-bronze-deep)' }}>{n}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-15)', lineHeight: 'var(--leading-22)', color: 'var(--color-ink)' } }}>{title}</p>
        <p style={{ margin: '3px 0 0', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: 'var(--color-muted)' } }}>{body}</p>
      </div>
    </div>
  );
}
