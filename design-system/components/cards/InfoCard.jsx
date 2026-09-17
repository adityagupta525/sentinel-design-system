import React from 'react';
import { InfoDot } from '../actions/InfoDot.jsx';
import { RangePills } from '../actions/RangePills.jsx';
import { ChartLine } from '../data/ChartLine.jsx';
import { tabular } from '../data/chartMath.jsx';
/* Fund detail, with the anatomy our stat tiles were missing: figure → chart → range row → a stat pair
   where each figure carries its own ⓘ. That is Shopee's fund-detail shape, and two gaps fell out of
   reading it: we had no range control at all, and no way for a figure to explain itself.

   The locked case is the one that matters here. The source of fund performance data is one of the
   three decisions that are not ours, so a performance series with no confirmed source renders
   VISUALLY LOCKED and says so — the radius-12 locked treatment the system already uses — rather than
   drawing a plausible line. An invented number in a wealth tool is worse than a blank. */
export function InfoCard({ name, meta, figure, figureNote, series, range, onRange, stats = [], onExplain, caveat, locked = false, lockReason }) {
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-8)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, font: 'var(--type-title-font)', color: 'var(--color-ink)', textWrap: 'pretty' }}>{name}</p>
          {meta && <p style={{ margin: `var(--space-2) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{meta}</p>}
        </div>
      </div>
      {locked ? (
        <div style={{ marginTop: 'var(--space-12)', borderRadius: 'var(--radius-12)', background: 'var(--color-canvas)', boxShadow: `inset 0 0 0 var(--border-1) var(--color-line)`, padding: 'var(--space-12)' }}>
          <p style={{ margin: 0, font: 'var(--type-figure-font)', color: 'var(--color-data-deemph)', fontVariantNumeric: 'tabular-nums' }}>——</p>
          <p style={{ margin: `var(--space-4) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)', textWrap: 'pretty' }}>{lockReason || 'Locked until the fund performance source is confirmed. Sentinel will not show a figure it cannot attribute.'}</p>
        </div>
      ) : (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
            <span style={{ ...tabular, font: 'var(--type-total-font)', color: 'var(--color-bronze-deep)' }}>{figure}</span>
            {figureNote && <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{figureNote}</span>}
          </div>
          {/* Monzo: the past-performance line sits ABOVE the chart, not at the foot of the screen. */}
          {caveat && <p style={{ margin: `var(--space-6) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)', textWrap: 'pretty' }}>{caveat}</p>}
          {series && <div style={{ marginTop: 'var(--space-10)' }}><ChartLine series={series} width={311} run={false} valueFormat={(v) => `${v}%`} /></div>}
          <div style={{ marginTop: 'var(--space-10)' }}><RangePills value={range} onChange={onRange} /></div>
        </React.Fragment>
      )}
      {stats.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 2)}, minmax(0, 1fr))`, gap: 'var(--space-8)', marginTop: 'var(--space-12)' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ borderRadius: 'var(--radius-12)', background: 'var(--color-canvas)', boxShadow: `inset 0 0 0 var(--border-1) var(--color-line)`, padding: 'var(--space-10)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{s.label}</span>
                <InfoDot figure={s.label} onOpen={() => onExplain && onExplain(s.label)} />
              </span>
              <p style={{ ...tabular, margin: `var(--space-2) 0 0`, font: 'var(--type-row-font)', fontWeight: 'var(--weight-bold)', color: locked || s.locked ? 'var(--color-data-deemph)' : 'var(--color-ink)' }}>{locked || s.locked ? '——' : s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
