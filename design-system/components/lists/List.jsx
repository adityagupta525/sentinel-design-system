import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
import { ListRow } from './ListRow.jsx';
/* The wrapper: a header eyebrow, dividers, an optional footer row ("See all 43"), grouping, and an
   empty state that is REQUIRED — every list in this product is empty on someone's first day, and a
   list that renders nothing is a bug report waiting to be filed.
   One scroll: a List never scrolls independently inside a scrolling surface. Cap it and give it a
   footer row instead — that is why the drawer's sections are capped at 3 / 7 / 8 with "See all". */
const GROUP_KEY = { client: 'client', date: 'date', journey: 'journey' };
export function List({ items, children, dividers = 'inset', header, footer, groupBy = 'none', emptyState, loading = false, rowProps }) {
  const rows = items || null;
  const isEmpty = !loading && (rows ? rows.length === 0 : React.Children.count(children) === 0);
  const line = (inset) => <div style={{ height: 'var(--border-hairline)', marginLeft: inset ? 12 : 0, background: 'var(--color-line-soft)' }} />;
  const withDividers = (nodes) => nodes.reduce((acc, node, i) => {
    if (i > 0 && dividers !== 'none') acc.push(<div key={'d' + i} style={{ height: 0.5, marginLeft: dividers === 'inset' ? 12 : 0, background: 'var(--color-line-soft)' }} />);
    acc.push(node);
    return acc;
  }, []);
  const renderRows = () => {
    if (loading) return withDividers([0, 1, 2].map((i) => (
      <div key={i} style={{ display: 'flex', minHeight: 56, alignItems: 'center', gap: 'var(--space-12)', padding: '8px 0' }}>
        <div style={{ height: 12, width: 40 + i * 30 + '%', borderRadius: 'var(--radius-6)', background: 'var(--color-track)', animation: 'sentinel-shimmer 1200ms var(--ease) infinite', animationDelay: i * 120 + 'ms' }} />
      </div>
    )));
    if (!rows) return withDividers(React.Children.toArray(children));
    if (groupBy === 'none') return withDividers(rows.map((r, i) => <ListRow key={r.id || i} {...rowProps} {...r} />));
    const key = GROUP_KEY[groupBy];
    const order = [];
    const buckets = {};
    rows.forEach((r) => { const g = r[key] || 'Other'; if (!buckets[g]) { buckets[g] = []; order.push(g); } buckets[g].push(r); });
    return order.map((g, gi) => (
      <div key={g}>
        <div style={{ padding: gi === 0 ? '0 0 6px' : '14px 0 6px' }}><Eyebrow>{g}</Eyebrow></div>
        {withDividers(buckets[g].map((r, i) => <ListRow key={r.id || i} {...rowProps} {...r} />))}
      </div>
    ));
  };
  return (
    <div style={{ width: '100%' }}>
      {header && <div style={{ padding: '0 0 6px' }}><Eyebrow>{header}</Eyebrow></div>}
      <div style={{ borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: '0 0 0 1px var(--color-line)', padding: '0 12px', boxSizing: 'border-box' }}>
        {isEmpty ? (
          <div style={{ padding: '18px 2px' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink)' }}>{emptyState.title}</p>
            {emptyState.body && <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-17)', color: 'var(--color-muted)' }}>{emptyState.body}</p>}
            {emptyState.action && <div style={{ marginTop: 'var(--space-12)' }}>{emptyState.action}</div>}
          </div>
        ) : renderRows()}
        {footer && !isEmpty && <React.Fragment>{line(false)}<div style={{ display: 'flex', minHeight: 44, alignItems: 'center' }}>{footer}</div></React.Fragment>}
      </div>
    </div>
  );
}
