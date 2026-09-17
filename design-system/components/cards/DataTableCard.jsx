import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
import { Badge } from './Badge.jsx';
/* C13 · data table card. */
const colStyle = (c) => ({ textAlign: c.align === 'right' ? 'right' : 'left', ...(c.key === 'name' || c.key === 'what' ? { flex: 1, minWidth: 0 } : { flexShrink: 0 }) });
export function DataTableCard({ title, meta, description, columns, rows, footer, filters, bar, showAll, onShowAll }) {
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', boxSizing: 'border-box', padding: 'var(--space-14)', animation: 'ds-rise var(--dur-screen) var(--ease) both' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <p style={{ margin: 0, ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-16)', lineHeight: 'var(--leading-22)', color: 'var(--color-ink)' } }}>{title}</p>
        {meta && <Badge>{meta}</Badge>}
      </div>
      {description && <p style={{ margin: '6px 0 0', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-19)', color: 'var(--color-muted)' } }}>{description}</p>}
      {filters && <div style={{ marginTop: 'var(--space-10)' }}>{filters}</div>}
      {bar && <div style={{ marginTop: 'var(--space-12)' }}>{bar}</div>}
      <div style={{ marginTop: 'var(--space-12)', display: 'flex', alignItems: 'center', gap: 'var(--space-8)', borderBottom: '0.5px solid var(--color-line-soft)', paddingBottom: 'var(--space-6)' }}>
        {columns.map((c) => <div key={c.key} style={colStyle(c)}><Eyebrow>{c.header}</Eyebrow></div>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', padding: '9px 0', borderBottom: i < rows.length - 1 ? '0.5px solid var(--color-line-soft)' : 'none', animation: 'ds-fade var(--dur-enter) var(--ease) both', animationDelay: `${i * 40}ms` }}>
          {columns.map((c) => <div key={c.key} style={colStyle(c)}>{r[c.key]}</div>)}
        </div>
      ))}
      {footer && <p style={{ margin: '10px 0 0', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-17)', color: 'var(--color-muted)' } }}>{footer}</p>}
      {showAll && <button type="button" onClick={onShowAll} style={{ appearance: 'none', border: 'none', cursor: 'pointer', marginTop: 'var(--space-10)', width: '100%', borderRadius: 'var(--radius-12)', background: 'var(--color-chip)', padding: '9px 0', boxShadow: '0 0 0 1px var(--color-line)' }}><span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: 'var(--color-bronze-deep)' }}>{showAll}</span></button>}
    </div>
  );
}
