import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
import { Pill } from '../actions/Pill.jsx';
import { Pressable } from '../actions/Pressable.jsx';
import { ChartSpark } from '../data/ChartSpark.jsx';
/* The full table — component request spec Part 7, a widening of DataTableCard rather than a rival to
   it. DataTableCard stays the three-column card that sits in a thread; this is the one that sorts,
   scrolls, filters and expands.

   THE RULES THAT MAKE A TABLE SURVIVE 375pt (§7.1), and what each costs if dropped:

   · EXACTLY ONE STICKY COLUMN, and it is the entity name. Without it the table is unreadable the
     moment it scrolls sideways — you are looking at numbers with nothing to attach them to. The spec
     asks for this in the type; JS cannot, so the contract states it and the component warns once
     rather than silently rendering two sticky cells that fight over the same offset.
   · AT MOST THREE COLUMNS BESIDE THE STICKY ONE. Beyond that the body scrolls horizontally with a
     fade on the right edge and a one-time nudge on first render. A table that hides data with no
     signal is worse than a narrower table.
   · NUMBERS END, TEXT START, derived from `kind`. Not a per-caller choice: a column of figures that
     does not share a right edge cannot be compared down.
   · ONE SORT COLUMN, cycling none → desc → asc. Multi-column sort is unusable on a phone. Only the
     active column shows a caret.
   · EXPAND IN PLACE, never a modal. The chevron lives in the sticky column and the detail pushes the
     rows below it down, so the row you opened does not move under your thumb.
   · FOLD IS THE DEFAULT. maxRows, then a ghost "Show all 43" — the pattern the review journey already
     uses. A 43-row table inside a chat thread is not a good idea.
   · LOADING CARRIES LIVE LABELS, not a spinner: "Reading her September statement". A skeleton that
     says what it is doing is the difference between waiting and wondering.

   ONE DELIBERATE DEVIATION FROM THE SPEC. It asks for the bar cell at "10 % opacity". The token layer
   publishes --tint-bronze-06 and no 10 % tint, and writing rgba(182,147,119,0.1) here would be a raw
   colour literal — the one thing _adherence.oxlintrc.json forbids outright. The spec predates the
   token audit that settled the tints, so the published tint wins and the difference is recorded here
   rather than smuggled in. */

const ALIGN = { text: 'start', badge: 'start', number: 'end', percent: 'end', currency: 'end', bar: 'end', sparkline: 'end' };
const NUDGE = 'ds-table-nudge';

const Caret = ({ dir }) => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    style={{ display: 'block', flexShrink: 0, transform: dir === 'asc' ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease)' }}>
    <path d="M6 9.5l6 6 6-6" stroke="var(--color-bronze-deep)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Chevron = ({ open }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    style={{ display: 'block', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease)' }}>
    <path d="M6 9.5l6 6 6-6" stroke="var(--color-muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

let warned = false;
function stickyKey(columns) {
  const marked = columns.filter((c) => c.sticky);
  if (marked.length > 1 && !warned && typeof console !== 'undefined') {
    warned = true;
    console.warn('DataTable: exactly one column may be sticky, and it is the entity name. Using the first.');
  }
  return (marked[0] || columns[0] || {}).key;
}

/* A bar cell reads as TEXT first: the figure is the content, the bar behind it is a secondary cue for
   magnitude. Never a categorical colour — one hue, one meaning, per rule 1. */
function Cell({ col, row, max }) {
  const v = row[col.key];
  const align = col.align || ALIGN[col.kind] || 'start';
  /* `fontVariantNumeric` AFTER the shorthand, not before and not only in a class (20 Sep 2026).
     The `font:` shorthand RESETS font-variant-numeric to `normal`, and an inline style beats the
     `.ds-tabular` rule in the token sheet — so every numeric cell in every table in this product
     rendered with proportional figures while carrying the class that says it does not. Measured on
     the proposal: 49 of 49. Rule 4 asks for tabular figures on anything that changes, and a column
     of rupee amounts that do not share a digit width cannot be compared down. */
  const base = { minWidth: 0, textAlign: align === 'end' ? 'right' : 'left', font: 'var(--type-row-font)', fontVariantNumeric: 'tabular-nums', color: 'var(--color-ink)' };
  if (col.kind === 'bar') {
    const n = Number(row[`${col.key}Value`] ?? (parseFloat(String(v)) || 0));
    /* `col.min` — A BASELINE, NOT A ZOOM (20 Sep 2026), and the same argument `Dumbbell.min` settled
       this morning. Default 0, so every bar column written before this draws what it drew: a holding
       weight, where 0% is a real position. It exists because a SCORE is not like that. Ten fund
       scores between 58 and 80 scaled from zero produced ten bars within a quarter of each other's
       length — measured on the shortlist, where the column reads as no signal at all. The safeguard
       is the one the contract already asks for: the figure is the cell's content and the bar sits
       behind it, so the picture never carries a number on its own. */
    const lo = Number(col.min) || 0;
    const span = max - lo;
    const pct = span > 0 ? Math.max(0, Math.min(1, (n - lo) / span)) : 0;
    return (
      <div style={{ ...base, position: 'relative', paddingRight: 'var(--space-4)' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, transformOrigin: 'right center', transform: `scaleX(${pct})`, background: 'var(--tint-bronze-06)', borderRadius: 'var(--radius-6)' }} />
        <span style={{ position: 'relative' }} className="ds-tabular">{v}</span>
      </div>
    );
  }
  /* SPARKLINE — the kind this contract has declared since v1 and nothing rendered. Until 22 Sep 2026
     `sparkline` existed in ColumnKind and in ALIGN and nowhere else, so a cell holding a series fell
     through to the text branch and printed the array: `100104107111114118...` across three columns of
     the fund table. The value is the series itself, oldest first; anything that is not an array of at
     least two numbers falls back to the text branch, which is what a column of mixed history needs. */
  if (col.kind === 'sparkline' && Array.isArray(v)) {
    return (
      <div style={{ ...base, display: 'flex', justifyContent: align === 'end' ? 'flex-end' : 'flex-start' }}>
        <ChartSpark points={v} tone={col.tone} label={col.sparkLabel} />
      </div>
    );
  }
  const tabular = col.kind && col.kind !== 'text' && col.kind !== 'badge';
  return <div style={base} className={tabular ? 'ds-tabular' : undefined}>{v}</div>;
}

export function DataTable({
  columns = [], rows = [], density = 'default', overflow = 'fold', sort, onSort,
  filters, expandable, maxRows = 5, emptyState, loading = false, loadingLabel, title, onShowAll, defaultOpen = null,
}) {
  /* defaultOpen (19 Sep 2026): which row starts expanded. The expansion was internal state with no way
     in, so a frozen specimen could not show the state the rule is about — a fund's page open INSIDE its
     row. Same gap and same fix as ProgressTrace's initialCollapsed (F-22): a spec page must be able to
     reach the state it is documenting, or it documents the one state the component can hold still in. */
  const [open, setOpen] = React.useState(defaultOpen);
  const bodyRef = React.useRef(null);
  /* THE IN-ROW DETAIL MUST NOT SCROLL SIDEWAYS WITH THE COLUMNS (19 Sep 2026). The detail renders inside
     the horizontal scroller, so it inherited the table's max-content width and a card in it was cut off at
     the right edge — measured on the fund screen, where a fund's page lost its sentence mid-word. The rule
     this component exists to hold is "expand in place, never a modal"; a detail you cannot read is a modal
     with extra steps. It is pinned to the left and given the VIEWPORT's width, the same trick the sticky
     column already uses, so it stays whole wherever the columns are scrolled to. */
  const [viewW, setViewW] = React.useState(0);
  React.useEffect(() => {
    const el = bodyRef.current; if (!el) return;
    const measure = () => setViewW(el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, []);
  const sticky = stickyKey(columns);
  const rest = columns.filter((c) => c.key !== sticky);
  const scrolls = overflow === 'scroll' || rest.length > 3;
  const rowPad = density === 'compact' ? 'var(--space-6)' : 'var(--space-8)';

  /* The nudge fires once, on first render, and only when there is something off-screen to find. It is
     a hint that the table continues, not decoration — so it never repeats and it never runs under
     prefers-reduced-motion, where the fade alone carries the same fact. */
  React.useEffect(() => {
    const el = bodyRef.current;
    if (!el || !scrolls) return;
    if (el.scrollWidth <= el.clientWidth + 1) return;
    el.classList.add(NUDGE);
    const t = setTimeout(() => el.classList.remove(NUDGE), 900);
    return () => clearTimeout(t);
  }, [scrolls, rows.length]);

  const cycle = (key) => {
    if (!onSort) return;
    onSort(key, !sort || sort.key !== key ? 'desc' : sort.dir === 'desc' ? 'asc' : 'none');
  };

  const shown = overflow === 'fold' && !loading ? rows.slice(0, maxRows) : rows;
  const hidden = rows.length - shown.length;
  const maxima = {};
  for (const c of columns) if (c.kind === 'bar') maxima[c.key] = Math.max(...rows.map((r) => Number(r[`${c.key}Value`] ?? (parseFloat(String(r[c.key])) || 0))), 0);

  const headCell = (c) => {
    const align = c.align || ALIGN[c.kind] || 'start';
    const active = sort && sort.key === c.key && sort.dir !== 'none';
    const inner = (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', flexDirection: align === 'end' ? 'row-reverse' : 'row' }}>
        <Eyebrow>{c.label}</Eyebrow>
        {active && <Caret dir={sort.dir} />}
      </span>
    );
    return c.sortable && onSort
      ? <Pressable onClick={() => cycle(c.key)} expand="none" label={`Sort by ${c.label}`} style={{ display: 'block', width: '100%', textAlign: align === 'end' ? 'right' : 'left' }}>{inner}</Pressable>
      : <div style={{ textAlign: align === 'end' ? 'right' : 'left' }}>{inner}</div>;
  };

  const cellW = (c) => (c.width ? { width: c.width, flexShrink: 0 } : { flex: 1, minWidth: 0 });
  /* THE PINNED CELL HAS TO COVER THE WHOLE ROW HEIGHT, NOT ITS OWN (20 Sep 2026, the owner: "data
     horizontally scroll karne par wo visual glitch aa raha hai"). The cell painted its own
     `--color-surface` box and nothing else, so when a LATER column wrapped to two lines the row grew
     taller than the pinned cell and the scrolled-under text showed above and below it — "Corporate
     bond" reading straight through "ICICI Corporate Bond". `alignSelf: stretch` makes the cover the
     row's height; the flex centring keeps the content where it was; `zIndex` puts it in front of the
     cells that scroll beneath, which until now depended on paint order alone. */
  const stickyCell = scrolls
    ? { position: 'sticky', left: 0, zIndex: 1, background: 'var(--color-surface)', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }
    : {};
  const stickyCol = columns.find((c) => c.key === sticky) || columns[0];

  const body = (
    <div ref={bodyRef} className={scrolls ? 'ds-table-scroll noscroll' : undefined}
      style={scrolls ? { overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' } : undefined}>
      <div style={{ minWidth: scrolls ? 'max-content' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-10)', paddingBottom: 'var(--space-6)', borderBottom: 'var(--border-hairline) solid var(--color-line-soft)' }}>
          <div style={{ ...cellW(stickyCol), ...stickyCell, minWidth: scrolls ? stickyCol.width || 132 : 0, alignItems: 'flex-end' }}>{headCell(stickyCol)}</div>
          {rest.map((c) => <div key={c.key} style={cellW(c)}>{headCell(c)}</div>)}
        </div>

        {loading
          ? Array.from({ length: Math.min(maxRows, 4) }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', padding: `${rowPad} 0`, borderBottom: 'var(--border-hairline) solid var(--color-line-soft)' }}>
              <div style={{ ...cellW(stickyCol), minWidth: scrolls ? stickyCol.width || 132 : 0 }}>
                {i === 0 && loadingLabel
                  ? <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{loadingLabel}</span>
                  : <span style={{ display: 'block', height: 'var(--space-10)', width: '70%', borderRadius: 'var(--radius-6)', background: 'var(--color-track)', animation: 'sentinel-shimmer 1200ms ease-in-out infinite' }} />}
              </div>
              {rest.map((c) => <div key={c.key} style={cellW(c)}><span style={{ display: 'block', height: 'var(--space-10)', width: '60%', marginLeft: 'auto', borderRadius: 'var(--radius-6)', background: 'var(--color-track)', animation: 'sentinel-shimmer 1200ms ease-in-out infinite' }} /></div>)}
            </div>))
          : shown.map((r, i) => {
            const isOpen = open === i;
            const detail = expandable ? expandable(r) : null;
            return (
              <React.Fragment key={r.id || i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', padding: `${rowPad} 0`, borderBottom: 'var(--border-hairline) solid var(--color-line-soft)' }}>
                  <div style={{ ...cellW(stickyCol), ...stickyCell, minWidth: scrolls ? stickyCol.width || 132 : 0 }}>
                    {detail
                      ? <Pressable onClick={() => setOpen(isOpen ? null : i)} expanded={isOpen} label={`${r[sticky]} — details`} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 'var(--space-6)' }}>
                          <Chevron open={isOpen} /><Cell col={stickyCol} row={r} max={maxima[stickyCol.key]} />
                        </Pressable>
                      : <Cell col={stickyCol} row={r} max={maxima[stickyCol.key]} />}
                  </div>
                  {rest.map((c) => <div key={c.key} style={cellW(c)}><Cell col={c} row={r} max={maxima[c.key]} /></div>)}
                </div>
                {isOpen && detail && (
                  <div style={{ padding: `var(--space-10) 0`, borderBottom: 'var(--border-hairline) solid var(--color-line-soft)', animation: 'ds-fade var(--dur-enter) var(--ease) both',
                    ...(scrolls && viewW ? { position: 'sticky', left: 0, width: viewW, boxSizing: 'border-box' } : null) }}>{detail}</div>
                )}
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );

  const empty = !loading && rows.length === 0;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)' }}>
      {title && <p style={{ margin: `0 0 var(--space-10)`, font: 'var(--type-title-font)', color: 'var(--color-ink)' }}>{title}</p>}
      {filters && <div style={{ marginBottom: 'var(--space-12)' }}>{filters}</div>}

      {empty
        ? <div style={{ padding: `var(--space-16) 0` }}>
            <p style={{ margin: 0, font: 'var(--type-body-strong-font)', color: 'var(--color-ink)' }}>{emptyState && emptyState.title}</p>
            {emptyState && emptyState.body && <p style={{ margin: `var(--space-4) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{emptyState.body}</p>}
            {emptyState && emptyState.action && <div style={{ marginTop: 'var(--space-12)' }}>{emptyState.action}</div>}
          </div>
        : (
          <div style={{ position: 'relative' }}>
            {body}
            {/* The fade says the row continues. It is the card's own surface running out, not a shadow,
                so it works over any row and adds no depth the system has not budgeted for. */}
            {scrolls && <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'var(--space-24)', pointerEvents: 'none', background: 'linear-gradient(to right, transparent, var(--color-surface))' }} />}
          </div>
        )}

      {!loading && hidden > 0 && (
        <div style={{ marginTop: 'var(--space-10)' }}>
          <Pill label={`Show all ${rows.length}`} size="sm" tone="filter" onClick={onShowAll} />
        </div>
      )}
    </div>
  );
}
