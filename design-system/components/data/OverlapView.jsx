import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
import { Pill } from '../actions/Pill.jsx';
import { Pressable } from '../actions/Pressable.jsx';
import { ListRow } from '../lists/ListRow.jsx';
import { Provenance } from '../text/Provenance.jsx';
/* How much two funds are the same fund — component request spec Part 8.

   PAIRS IS THE DEFAULT, AND THE MATRIX IS NOT THE MOBILE ANSWER (§8.1). Five funds make a symmetric
   matrix of twenty-five cells, of which only ten carry information: the diagonal is meaningless and
   the upper triangle repeats the lower. At 375pt those ten values do not fit legibly. The same ten
   numbers as a list sorted by overlap descending read at phone width, put the problem pair first, and
   need no horizontal scroll. The matrix stays for wide viewports and for export.

   COLOUR IS MAGNITUDE, NEVER IDENTITY (rule 1, §8.3). One sequential bronze ramp, four steps, light
   for low and dark for high — and every cell prints its percentage, so the colour is never the only
   carrier. The two darkest steps take surface-coloured text, because ink on bronze-deep is the one
   pairing in this palette that does not clear its floor.

   THE EDGE CASES ARE THE COMPONENT (§8.3). Each is a different fact and each reads differently:
     · a fund against itself      → a blank cell. NEVER 100 %, which would look like a finding.
     · overlap not available      → an em dash and a footnote naming why. A zero and a missing value
                                    are different facts, and printing 0 % states something untrue.
     · fewer than two funds       → "Pick at least two funds to compare."
     · no properties active       → "Pick at least one property to compare on." The view renders empty
                                    rather than quietly defaulting to a basis the advisor did not pick.

   THE PROPERTY CHIPS ARE THE POINT, not decoration. They show what the overlap was computed ON, so an
   advisor can change the basis of the number instead of trusting it blind. An overlap figure with no
   stated basis is a number nobody can defend to a client. */

/* Light → dark for low → high, so the eye reads intensity as magnitude without being told. CHART_RAMP
   runs the other way (deep first, for series rank), so it is reversed here rather than re-ordered
   there: its order is load-bearing for charts. */
const RAMP = ['var(--color-bubble-edge)', 'var(--color-alloc-debt)', 'var(--color-bronze)', 'var(--color-bronze-deep)'];
const step = (pct) => (pct >= 60 ? 3 : pct >= 40 ? 2 : pct >= 20 ? 1 : 0);
/* Ink measures 2.25:1 against bronze-deep — below the 4.5 floor for text. The two dark steps take the
   surface colour, which is the same pairing the dark CTA already uses. */
const onRamp = (i) => (i >= 2 ? 'var(--color-surface)' : 'var(--color-ink)');

/* Three dimensions the token layer has no name for, named here once instead of repeated six times —
   which is the craft problem, not the count. CHIP_MAX matches ClientChip's own 200: a chip that eats
   the row stops being a chip. LABEL_W is the matrix's sticky name column, carried over from the
   compare canvas this replaces. CELL_W holds "100%" at --type-label-font with room either side, which
   is the widest value a cell can ever print. None is a spacing relationship, so none is rounded to the
   spacing scale. */
const CHIP_MAX = 200;
const LABEL_W = 104;
const CELL_W = 72;

const Cross = () => (
  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M3 3l6 6M9 3l-6 6" stroke="var(--color-bronze-deep)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* A removable chip carrying a fund, not a person. ClientChip is the removable chip in this system but
   it leads with an initials avatar, which is a person's affordance — a fund has no initials, and
   borrowing one would say something false about what is bound. Same 28px box, same ✕ with its own
   44pt target through Pressable. */
function FundChip({ label, onRemove, disabled }) {
  return (
    <span style={{ display: 'inline-flex', height: 'var(--h-chip-sm)', maxWidth: CHIP_MAX, alignItems: 'center', gap: 'var(--space-6)', borderRadius: 'var(--radius-full)', background: 'var(--color-chip)', boxShadow: '0 0 0 1px var(--color-bubble-edge)', padding: onRemove ? '0 var(--space-2) 0 var(--space-10)' : '0 var(--space-10)', opacity: disabled ? 0.4 : 1 }}>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', font: 'var(--type-label-font)', color: 'var(--color-bronze-deep)' }}>{label}</span>
      {onRemove && (
        <Pressable onClick={onRemove} disabled={disabled} label={`Remove ${label}`}
          style={{ display: 'flex', width: 'var(--space-20)', height: 'var(--space-20)', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 'var(--radius-full)' }}>
          <Cross />
        </Pressable>
      )}
    </span>
  );
}

function Note({ children }) {
  return (
    <div style={{ padding: `var(--space-16) 0` }}>
      <p style={{ margin: 0, font: 'var(--type-body-strong-font)', color: 'var(--color-ink)' }}>{children}</p>
    </div>
  );
}

export function OverlapView({
  mode = 'pairs', funds = [], properties = [], cells = [], maxFunds = 5,
  onToggleFund, onToggleProperty, onAddFund, onAddProperty, onChangeMode, footnote,
}) {
  const inPlay = funds.filter((f) => f.inComparison);
  const active = properties.filter((p) => p.active);
  const name = (id) => (funds.find((f) => f.id === id) || {}).name || id;

  /* Sorted descending so the problem pair is the first thing read. A pair with pct == null is not
     sorted to the bottom as if it were zero — it keeps its place and prints an em dash. */
  const pairs = React.useMemo(() => cells
    .filter((c) => c.a !== c.b)
    .filter((c) => inPlay.some((f) => f.id === c.a) && inPlay.some((f) => f.id === c.b))
    .slice()
    .sort((x, y) => (y.pct == null ? -1 : y.pct) - (x.pct == null ? -1 : x.pct)),
  [cells, funds]);

  const value = (a, b) => {
    const c = cells.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    return c ? c.pct : undefined;
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <div>
        <Eyebrow>Comparing</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--chip-gap)', marginTop: 'var(--space-8)' }}>
          {inPlay.map((f) => <FundChip key={f.id} label={f.name} onRemove={onToggleFund ? () => onToggleFund(f.id) : undefined} />)}
          {onAddFund && <Pill label="Add fund" size="sm" tone="tertiary" onClick={onAddFund} disabled={inPlay.length >= maxFunds} />}
        </div>
        {inPlay.length >= maxFunds && (
          /* The cap is stated, never a disabled button with no explanation (§8.2). */
          <p style={{ margin: `var(--space-6) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{`Up to ${maxFunds} funds.`}</p>
        )}
      </div>
      <div>
        <Eyebrow>Computed on</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--chip-gap)', marginTop: 'var(--space-8)' }}>
          {active.map((p) => <FundChip key={p.id} label={p.label} onRemove={onToggleProperty ? () => onToggleProperty(p.id) : undefined} />)}
          {onAddProperty && <Pill label="Add property" size="sm" tone="tertiary" onClick={onAddProperty} />}
        </div>
      </div>
    </div>
  );

  let body;
  if (inPlay.length < 2) body = <Note>Pick at least two funds to compare.</Note>;
  else if (active.length === 0) body = <Note>Pick at least one property to compare on.</Note>;
  else if (mode === 'matrix') {
    const cols = inPlay.slice(1);
    const rowsF = inPlay.slice(0, -1);
    body = (
      <div style={{ overflowX: 'auto' }} className="noscroll">
        <div style={{ minWidth: 'max-content' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
            <div style={{ width: LABEL_W, flexShrink: 0, position: 'sticky', left: 0, background: 'var(--color-surface)' }} />
            {cols.map((c) => <div key={c.id} style={{ width: CELL_W, flexShrink: 0, paddingBottom: 'var(--space-6)' }}><Eyebrow>{c.name}</Eyebrow></div>)}
          </div>
          {rowsF.map((r, ri) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <div style={{ width: LABEL_W, flexShrink: 0, position: 'sticky', left: 0, background: 'var(--color-surface)', display: 'flex', alignItems: 'center', paddingRight: 'var(--space-8)' }}>
                <span style={{ font: 'var(--type-row-font)', color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
              </div>
              {cols.map((c, ci) => {
                /* Lower triangle only. The diagonal and everything above it is blank — a fund against
                   itself is not 100 %, it is not a comparison. */
                if (ci < ri) return <div key={c.id} style={{ width: CELL_W, flexShrink: 0 }} />;
                const pct = value(r.id, c.id);
                const s = pct == null ? null : step(pct);
                return (
                  <div key={c.id} style={{ width: CELL_W, flexShrink: 0, height: 'var(--h-filter-chip)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-8)', background: s == null ? 'var(--color-track)' : RAMP[s] }}>
                    <span className="ds-tabular" style={{ font: 'var(--type-label-font)', color: s == null ? 'var(--color-muted)' : onRamp(s) }}>{pct == null ? '—' : `${pct}%`}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    body = (
      <div>
        {pairs.map((c) => {
          const s = c.pct == null ? null : step(c.pct);
          return (
            <div key={`${c.a}|${c.b}`} style={{ position: 'relative' }}>
              {/* The bar sits BEHIND the row, so the row reads as a row and the magnitude is a second
                  glance. It grows from the leading edge, which is where the eye already starts. */}
              {s != null && (
                <span aria-hidden="true" style={{ position: 'absolute', top: 'var(--space-4)', bottom: 'var(--space-4)', left: 0, width: `${Math.max(2, c.pct)}%`, background: 'var(--tint-bronze-06)', borderRadius: 'var(--radius-6)' }} />
              )}
              <div style={{ position: 'relative' }}>
                <ListRow variant="static" title={`${name(c.a)} ↔ ${name(c.b)}`} trailing="meta" meta={c.pct == null ? '—' : `${c.pct}%`} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const missing = pairs.some((c) => c.pct == null);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <p style={{ margin: 0, font: 'var(--type-title-font)', color: 'var(--color-ink)' }}>How much these are the same fund</p>
        {onChangeMode && (
          <div style={{ display: 'flex', gap: 'var(--space-6)', flexShrink: 0 }}>
            <Pill label="Pairs" size="sm" tone="filter" selected={mode === 'pairs'} onClick={() => onChangeMode('pairs')} />
            <Pill label="Matrix" size="sm" tone="filter" selected={mode === 'matrix'} onClick={() => onChangeMode('matrix')} />
          </div>
        )}
      </div>
      <div style={{ marginTop: 'var(--space-12)' }}>{controls}</div>
      <div style={{ marginTop: 'var(--space-12)' }}>{body}</div>
      {(footnote || missing) && (
        <div style={{ marginTop: 'var(--space-10)' }}>
          <Provenance text={footnote || 'An em dash is a pair whose holdings are not both disclosed yet — not a zero.'} />
        </div>
      )}
    </div>
  );
}
