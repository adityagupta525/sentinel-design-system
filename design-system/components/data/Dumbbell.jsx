import React from 'react';
/* V2 · dumbbell: hollow dot = target, filled dot = actual, bronze connector.

   A LABEL NEVER REPLACES THE NUMBER (19 Sep 2026). `actualLabel` and `targetLabel` used to substitute for
   the values — `actualLabel ?? \`${actual}%\`` — so a caller who named its two ends got a chart with two
   dots and no figures. Found on the rebalance simulation, which is the one place in the product where an
   advisor decides money from a picture: it read "He is at now → He agreed to" with 71, 60 and 58 nowhere
   on it. Rule 4 — every figure direct-labelled, in tabular figures. The labels now sit BESIDE their
   values; a call with no labels renders exactly the strings it always did. */
/* `min` — A BASELINE, NOT A ZOOM (20 Sep 2026). Default 0, so every caller that existed before this
   draws exactly what it drew: the rebalance's equity shares, where 0% equity is a real position.
   It exists because the fund comparison is not like that. Two flexi caps at 23.1% and 21.6% against a
   16.8% benchmark put both dumbbells in the right quarter of a 0–25 track, and the 1.5-point
   difference between the two gaps — which is the whole reason the chart is there — came out at 19px
   of 315. The system already does this for a series: `chartMath.niceDomain` is "never a raw data
   min/max", and `ChartLine` scales to its data rather than to zero, for the same reason and with the
   same safeguard — every figure is direct-labelled here (F-46), so the picture never carries a number
   on its own and a reader can see what the ends are. A caller that passes `min` is saying the zero is
   not meaningful for this quantity; a caller that does not gets the zero. */
export function Dumbbell({ label, target, actual, min = 0, max = 100, targetLabel, actualLabel }) {
  const lo = Math.min(target, actual), hi = Math.max(target, actual);
  const span = max - min || 1;
  /* A POSITION AND A LENGTH ARE NOT THE SAME CONVERSION once the scale has a baseline: `pct` places a
     value, `len` measures a distance. Running the connector's width through `pct` subtracts the
     baseline from a gap and draws a bar shorter than the two dots it joins. */
  const pct = (v) => `${((v - min) / span) * 100}%`;
  const len = (v) => `${(v / span) * 100}%`;
  const dot = { position: 'absolute', top: '50%', width: 10, height: 10, transform: 'translate(-50%,-50%)', borderRadius: 'var(--radius-full)', boxSizing: 'border-box' };
  return (
    <div style={{ width: '100%' }}>
      {label && <p style={{ margin: '0 0 8px', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-13)', color: 'var(--color-ink)' } }}>{label}</p>}
      <div style={{ position: 'relative', height: 16, width: '100%' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 'var(--border-1)', transform: 'translateY(-50%)', background: 'var(--color-track)' }} />
        <div style={{ position: 'absolute', top: '50%', height: 2, transform: 'translateY(-50%)', left: pct(lo), width: len(hi - lo) }}><div style={{ height: '100%', width: '100%', background: 'var(--color-bronze)', transformOrigin: 'left', animation: 'ds-grow 400ms var(--ease) both' }} /></div>
        <div style={{ ...dot, left: pct(target), border: '2px solid var(--color-bronze)', background: 'var(--color-canvas)', boxShadow: '0 0 0 2px var(--color-surface)' }} />
        <div style={{ ...dot, left: pct(actual), background: 'var(--color-bronze)', boxShadow: '0 0 0 2px var(--color-surface)' }} />
      </div>
      <div style={{ marginTop: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{actualLabel ? `${actualLabel} ${actual}%` : `${actual}% now`}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: 'var(--color-bronze-deep)', fontVariantNumeric: 'tabular-nums' }}>{targetLabel ? `→ ${targetLabel} ${target}%` : `→ ${target}%`}</span>
      </div>
    </div>
  );
}
