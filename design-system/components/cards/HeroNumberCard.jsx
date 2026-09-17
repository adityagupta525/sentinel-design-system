import React from 'react';
import { Badge } from './Badge.jsx';
export function useCountUp(target, ms, run = true) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (!run) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf = 0; const start = performance.now();
    const tick = (t) => { const p = Math.min(1, (t - start) / ms); setV(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, run]);
  return v;
}
/* C10 · hero number card with the lowest-of-three meter.
   All three rows draw a hairline track and a fill — the card's argument is a comparison of three
   figures where the lowest binds, and an undrawn row makes the comparison unreadable. The binding
   row is distinguished by bronze fill + heavier label, never by being the only one drawn. */
export function HeroNumberCard({ title, meta, value, badge, copy, rows }) {
  const n = useCountUp(value, 600, true);
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', boxSizing: 'border-box', padding: 'var(--space-16)', animation: 'ds-rise var(--dur-screen) var(--ease) both' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-16)', lineHeight: 'var(--leading-24)', color: 'var(--color-ink)' } }}>{title}</p>
        <Badge>{meta}</Badge>
      </div>
      <div style={{ marginTop: 'var(--space-8)', display: 'flex', alignItems: 'flex-end', gap: 'var(--space-12)' }}>
        <span style={{ font: 'var(--type-display-font)', color: 'var(--color-bronze-deep)' }}>{n}</span>
        <div style={{ marginBottom: 'var(--space-10)', borderRadius: 'var(--radius-full)', background: 'var(--color-selected)', padding: '4px 12px', boxShadow: '0 0 0 1px var(--color-bubble-edge)', animation: 'ds-fade 300ms var(--ease) both', animationDelay: '600ms' }}><span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-13)', color: 'var(--color-ink)' }}>{badge}</span></div>
      </div>
      <p style={{ margin: '6px 0 0', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-20)', color: 'var(--color-ink-soft)' } }}>{copy}</p>
      <div style={{ marginTop: 'var(--space-14)', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {rows.map((r, i) => (
          <div key={r.label}>
            <div style={{ marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: r.binding ? 700 : 500, fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: r.binding ? 'var(--color-ink)' : 'var(--color-muted)' }}>{r.label}</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: r.binding ? 700 : 500, fontSize: 'var(--text-14)', color: r.binding ? 'var(--color-bronze-deep)' : 'var(--color-ink)' }}>{r.value}</span>
            </div>
            <div style={{ height: 6, width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-full)', background: 'var(--color-track)', boxShadow: 'inset 0 0 0 0.5px var(--color-line)' }}>
              <div style={{ height: '100%', width: `${r.value}%`, borderRadius: 'var(--radius-full)', background: r.binding ? 'var(--color-bronze)' : 'var(--color-alloc-debt)', transformOrigin: 'left', animation: 'ds-grow 500ms var(--ease) both', animationDelay: `${600 + i * 120}ms` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
