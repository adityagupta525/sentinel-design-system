import React from 'react';
/* C6 · wrapping chip row, 8px gap, staggered entrance. */
export function ChipRow({ children, animate = true }) {
  return (
    <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
      {React.Children.map(children, (c, i) => <div key={i} style={animate ? { animation: `ds-rise var(--dur-enter) var(--ease) both`, animationDelay: `${i * 60}ms` } : undefined}>{c}</div>)}
    </div>
  );
}
