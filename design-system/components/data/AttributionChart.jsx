import React from 'react';
import { useCountUp } from '../cards/HeroNumberCard.jsx';
/* V3 · diverging attribution bar. Reads top-down as a chain from the target to today.
   One hue only; an intentional contribution ("what you did") renders in de-emphasis grey with a
   hairline outline so it separates from "what happened to you" without a second colour.
   Bars 20px thick, 2px surface gap, values direct-labelled at the tip. */
function Row({ c, max, i, run }) {
  const grey = c.intentional;
  /* run=false means "do not animate" — the bar is drawn at full length, never frozen at zero. */
  const [on, setOn] = React.useState(!run);
  React.useEffect(() => { if (run) { const t = setTimeout(() => setOn(true), 20); return () => clearTimeout(t); } }, [run]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-18)', color: grey ? 'var(--color-data-deemph)' : 'var(--color-ink)' }}>{c.label}</span>
        <span style={{ flexShrink: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-13)', color: grey ? 'var(--color-data-deemph)' : 'var(--color-bronze-deep)' }}>{c.value > 0 ? '+' : '−'}{Math.abs(c.value).toFixed(1)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
        <div style={{ position: 'relative', height: 20, flex: 1, minWidth: 0 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(Math.abs(c.value) / max) * 100}%`, borderRadius: '2px 6px 6px 2px', background: grey ? 'var(--color-track)' : 'var(--color-bronze)', boxShadow: grey ? 'inset 0 0 0 1px var(--color-data-deemph)' : 'none', transformOrigin: 'left', transform: on ? 'none' : 'scaleX(0)', transition: run ? 'transform 200ms var(--ease)' : 'none', transitionDelay: run ? `${i * 200}ms` : '0ms' }} />
        </div>
      </div>
      {c.note && <p style={{ margin: '-1px 0 0', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-16)', color: 'var(--color-muted)' }}>{c.note}</p>}
    </div>
  );
}
export function AttributionChart({ from, to, targetLabel = 'Target', target, contributions, skeleton = false, run = true, todayLabel = 'Today' }) {
  const total = useCountUp(to, 600, run && !skeleton);
  const shown = run ? total : to;
  const max = Math.max(...contributions.map((c) => Math.abs(c.value)), 1);
  const cap = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)' };
  const capLabel = { margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-11)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)' };
  return (
    <div style={{ width: '100%' }}>
      <div style={cap}>
        <p style={capLabel}>{targetLabel}</p>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', color: 'var(--color-muted)' }}>{target ?? from}%</span>
      </div>
      <div style={{ margin: '8px 0 12px', height: 'var(--border-hairline)', width: '100%', background: 'var(--color-line)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', opacity: skeleton ? 0.5 : 1 }}>
        {contributions.map((c, i) => <Row key={c.label} c={c} max={max} i={i} run={run && !skeleton} />)}
      </div>
      <div style={{ margin: '12px 0 8px', height: 'var(--border-hairline)', width: '100%', background: 'var(--color-line)' }} />
      <div style={cap}>
        <p style={capLabel}>{todayLabel}</p>
        <span style={{ font: 'var(--type-total-font)', color: 'var(--color-bronze-deep)' }}>{skeleton ? from : shown}%</span>
      </div>
    </div>
  );
}
