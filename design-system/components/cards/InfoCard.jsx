import React from 'react';
import { InfoDot } from '../actions/InfoDot.jsx';
import { RangePills } from '../actions/RangePills.jsx';
import { ChartLine } from '../data/ChartLine.jsx';
import { tabular } from '../data/chartMath.jsx';
import { Badge } from './Badge.jsx';
import { Provenance } from '../text/Provenance.jsx';
/* Fund detail, with the anatomy our stat tiles were missing: figure → chart → range row → a stat pair
   where each figure carries its own ⓘ. That is Shopee's fund-detail shape, and two gaps fell out of
   reading it: we had no range control at all, and no way for a figure to explain itself.

   The locked case is the one that matters here. The source of fund performance data is one of the
   three decisions that are not ours, so a performance series with no confirmed source renders
   VISUALLY LOCKED and says so — the radius-12 locked treatment the system already uses — rather than
   drawing a plausible line. An invented number in a wealth tool is worse than a blank.

   v12 · kind='manager' (spec Part 6). The manager card earns its place through ONE thing, and the spec
   is blunt about it: "Render a small two-segment bar showing how much of the fund's track record
   belongs to the current manager… Without this the card is decorative and should not be built." A
   three-year record under a manager who arrived last year is not that manager's record, and a card
   that prints tenure as a number leaves the advisor to do that arithmetic in their head in front of a
   client. The bar does it for them.

   The bar is two segments of ONE hue plus the track — bronze for the manager's years, --color-track
   for the rest — which is the AllocationCard / ProgressRail pattern, not a multi-hue stack. Both
   segments are labelled directly, because a segment with no label is the violation ChartShare is built
   around. */
const TENURE_THIN = 0.34;   /* below a third of the record, the card says so in words as well */

const SHELF = {
  'on-shelf': { tone: 'ok', text: 'On your shelf' },
  'not-on-shelf': { tone: 'over', text: 'Not on your shelf' },
  'under-review': { tone: 'under', text: 'Under review' },
};

/* How much of the fund's track record is this manager's. The whole reason the card exists. */
function Tenure({ managerYears, fundYears, since }) {
  const share = fundYears > 0 ? Math.max(0, Math.min(1, managerYears / fundYears)) : 0;
  const thin = share < TENURE_THIN;
  return (
    <div style={{ marginTop: 'var(--space-12)' }}>
      <div style={{ display: 'flex', height: 'var(--space-10)', borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--color-track)' }}>
        <span style={{ width: `${share * 100}%`, background: 'var(--color-bronze)', transformOrigin: 'left center', animation: 'ds-grow var(--dur-bar) var(--ease) both' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-8)', marginTop: 'var(--space-6)' }}>
        <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>{`Theirs · ${managerYears} yr`}</span>
        <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-muted)' }}>{`Before them · ${Math.max(0, +(fundYears - managerYears).toFixed(1))} yr`}</span>
      </div>
      {since && <p style={{ margin: `var(--space-6) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{`Managing since ${since}.`}</p>}
      {thin && (
        <p style={{ margin: `var(--space-6) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)', textWrap: 'pretty' }}>
          {`Most of the fund's ${fundYears}-year record was built before they arrived. Read the long numbers as the fund's, not theirs.`}
        </p>
      )}
    </div>
  );
}
export function InfoCard({ kind = 'fund', name, meta, figure, figureNote, series, range, onRange, stats = [], onExplain, caveat, locked = false, lockReason, shelf, tenure, provenance }) {
  const manager = kind === 'manager';
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-8)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, font: 'var(--type-title-font)', color: 'var(--color-ink)', textWrap: 'pretty' }}>{name}</p>
          {meta && <p style={{ margin: `var(--space-2) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{meta}</p>}
        </div>
        {/* Fund only. A shelf status on a manager would say something the compliance shelf does not
            hold an opinion about. */}
        {!manager && shelf && SHELF[shelf] && <Badge variant="status" tone={SHELF[shelf].tone}>{SHELF[shelf].text}</Badge>}
      </div>
      {manager ? (
        tenure ? <Tenure {...tenure} /> : null
      ) : locked ? (
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
          {series && <div style={{ marginTop: 'var(--space-10)' }}><ChartLine series={series} width={311} run={false} /></div>}
          <div style={{ marginTop: 'var(--space-10)' }}><RangePills value={range} onChange={onRange} /></div>
        </React.Fragment>
      )}
      {provenance && <div style={{ marginTop: 'var(--space-10)' }}><Provenance text={provenance} /></div>}
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
