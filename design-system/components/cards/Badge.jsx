import React from 'react';
/* Never tappable. One size, one padding (8 × 3). No onClick prop exists. */
const STATUS = { over: { bg: 'var(--color-status-over-bg)', fg: 'var(--color-status-over-fg)' }, under: { bg: 'var(--color-status-under-bg)', fg: 'var(--color-status-under-fg)' }, ok: { bg: 'var(--color-status-ok-bg)', fg: 'var(--color-status-ok-fg)' } };
export function Badge({ children, variant = 'meta', tone = 'under' }) {
  const base = { display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-full)', padding: '3px 8px', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)' };
  if (variant === 'status') { const t = STATUS[tone]; return <span style={{ ...base, background: t.bg, color: t.fg, fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-10)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</span>; }
  return <span style={{ ...base, background: 'var(--color-chip)', boxShadow: '0 0 0 1px var(--color-line)', color: 'var(--color-muted)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-11)' }}>{children}</span>;
}
