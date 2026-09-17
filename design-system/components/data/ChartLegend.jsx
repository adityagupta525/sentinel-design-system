import React from 'react';
import { CHART_RAMP, tabular } from './chartMath.jsx';
/* Direct labels first. A legend is what we use when direct labelling is impossible — one series never
   has one, two series are end-labelled, so its real homes are ChartShare and the overlap bars.
   Ordered by value descending, always, never alphabetically: the legend then doubles as the ranking
   and every row carries its own number, which is what makes it readable with no colour at all.
   Left-aligned to the plot's left edge, never centred — a centred legend floats free of the card's rag.
   Text never wears the data colour: the 8px dot carries identity, the label stays ink. Labels wrap. */
const amountOf = (it) => (typeof it.amount === 'number' ? it.amount : parseFloat(String(it.value).replace(/[^0-9.-]/g, '')) || 0);
export function ChartLegend({ items = [], layout = 'stacked', sort = true }) {
  const rows = (sort ? items.slice().sort((a, b) => amountOf(b) - amountOf(a)) : items.slice());
  const stacked = layout === 'stacked';
  return (
    <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', flexWrap: stacked ? 'nowrap' : 'wrap', gap: stacked ? 6 : '6px 14px', width: '100%', alignItems: stacked ? 'stretch' : 'flex-start' }}>
      {rows.map((it, i) => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', width: stacked ? '100%' : 'auto', minWidth: 0 }}>
          <span style={{ flexShrink: 0, width: 8, height: 8, marginTop: 'var(--space-4)', borderRadius: 'var(--radius-full)', background: CHART_RAMP[Math.min(it.step ? it.step - 1 : i, CHART_RAMP.length - 1)] }} />
          <span style={{ flex: stacked ? 1 : '0 1 auto', minWidth: 0, font: 'var(--type-meta-font)', color: 'var(--color-ink)', overflowWrap: 'break-word' }}>{it.label}</span>
          {it.value != null && <span style={{ ...tabular, flexShrink: 0, marginLeft: stacked ? 8 : 0, font: 'var(--type-meta-font)', color: 'var(--color-muted)', textAlign: 'right' }}>{it.value}</span>}
        </div>
      ))}
    </div>
  );
}
