import React from 'react';
import { Provenance } from '../text/Provenance.jsx';
import { Pill } from '../actions/Pill.jsx';
/* TWO OR THREE FUNDS, READ ACROSS A ROW.
   `DataTable` is many entities with ONE KIND PER COLUMN, sorted and expandable in place. A comparison
   is the transpose of that: few entities, one kind per ROW, and the read is sideways — an advisor asks
   "what does each of these charge", not "sort by cost". Its contract says a column is one kind, and
   forcing a comparison through it would make every fund column `text`, which throws away the tabular
   figures and the row's own meaning. Different read, different component; `DataTableCard` remains the
   three-column card for a thread and `OverlapView` still answers the other comparison question, which
   is how much of two funds is the same fund.

   THE SAME VALUE IS THE INFORMATION, AND IT RECEDES (20 Sep 2026). The v2 spec says "differences
   bolded", and taken literally that bolds almost every cell — two funds differ on nearly everything.
   Inverted it is useful: a row where every fund says the same thing is muted, so the eye lands on the
   rows where they actually part. It is a de-emphasis, not a claim, and it uses the ink/muted pair the
   system already has.

   `better` IS THE ONE CLAIM, AND ONLY WHERE DIRECTION IS A FACT. A lower expense ratio is cheaper —
   that is arithmetic, not an opinion — so a cost row may name the cheaper cell and it carries
   `--type-row-strong-font`, the same size at one weight up. A fund's SIZE has no better, and a row
   without `better` never marks one. The verdict that reads the whole comparison belongs in a sentence
   in the turn, which is where the spec puts it too: "a table anyone can build; the reading is what the
   advisor is paying for."

   THE PHONE DECIDES THE CAP. 104 + 2×105 fits 375; 104 + 3×104 does not, so a third fund scrolls
   sideways with the label column pinned — the rule DataTable states for its own sticky column, and
   horizontal inside vertical is orthogonal to the no-nested-scroll law. */
/* BORDER-BOX, AND THE FIRST RENDER CAUGHT IT. Without it `minWidth: 104` is the CONTENT width and
   each cell became 104 + 20 of padding = 125, so two funds needed 354 in a 315pt card and the second
   column was clipped mid-word. Every padded box in this system is border-box; this one was not. */
const LABEL_W = 104;       /* the archive's own value (FundExplorer.tsx:334) */
const COL_MIN = 104;       /* 104 + 2×105.5 = 315, which is a 343 card's inside. A third scrolls. */
const HAIR = '0.5px solid var(--color-line-soft)';

const same = (vals) => vals.length > 1 && vals.every((v) => v === vals[0]);

export function CompareTable({
  entities = [], rows = [], title = 'Side by side', cap = 3, onAdd, addLabel = 'Add a third',
  capNote, footnote, onRemove,
}) {
  const ids = entities.map((e) => e.id);
  const full = entities.length >= cap;
  return (
    <div style={{ width: '100%', boxSizing: 'border-box', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-14)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <p style={{ margin: 0, font: 'var(--type-title-font)', color: 'var(--color-ink)' }}>{title}</p>
        {/* THE CAP IS STATED, NEVER A DISABLED BUTTON WITH NO EXPLANATION — OverlapView's own rule. */}
        {onAdd && !full && <Pill label={addLabel} size="sm" tone="filter" onClick={onAdd} />}
      </div>
      <div className="noscroll" style={{ marginTop: 'var(--space-12)', overflowX: 'auto' }}>
        <div style={{ minWidth: LABEL_W + entities.length * COL_MIN }}>
          {/* The fund names. No label over the label column: the column IS the labels. */}
          <div style={{ display: 'flex', borderBottom: HAIR }}>
            <div style={{ width: LABEL_W, flexShrink: 0, boxSizing: 'border-box' }} />
            {entities.map((e) => (
              <div key={e.id} style={{ flex: 1, minWidth: COL_MIN, boxSizing: 'border-box', borderLeft: HAIR, padding: `var(--space-2) var(--space-10) var(--space-10)` }}>
                <p style={{ margin: 0, font: 'var(--type-row-strong-font)', color: 'var(--color-ink)', textWrap: 'pretty' }}>{e.name}</p>
                {e.meta && <p style={{ margin: `var(--space-2) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{e.meta}</p>}
                {onRemove && entities.length > 2 && (
                  <span style={{ display: 'flex', marginTop: 'var(--space-6)' }}>
                    <Pill label="Remove" size="sm" tone="filter" onClick={() => onRemove(e.id)} />
                  </span>
                )}
              </div>
            ))}
          </div>
          {rows.map((r, ri) => {
            const vals = ids.map((id) => (r.values || {})[id]);
            const flat = same(vals);
            /* The winner is computed from `pick`, never passed in: a caller that decides which cell to
               bold is a caller that can decide differently on the next screen. */
            const win = r.better && !flat ? bestOf(vals, r.better, r.rank) : -1;
            return (
              <div key={r.label} style={{ display: 'flex', borderBottom: ri < rows.length - 1 ? HAIR : 'none' }}>
                <div style={{ width: LABEL_W, flexShrink: 0, boxSizing: 'border-box', padding: `var(--space-10) var(--space-8) var(--space-10) 0` }}>
                  <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{r.label}</span>
                </div>
                {vals.map((v, i) => (
                  <div key={ids[i]} style={{ flex: 1, minWidth: COL_MIN, boxSizing: 'border-box', borderLeft: HAIR, padding: `var(--space-10)` }}>
                    <span style={{
                      font: i === win ? 'var(--type-row-strong-font)' : 'var(--type-row-font)',
                      color: flat ? 'var(--color-muted)' : 'var(--color-ink)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>{v == null || v === '' ? '——' : v}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {full && capNote && (
        <p style={{ margin: `var(--space-10) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)', textWrap: 'pretty' }}>{capNote}</p>
      )}
      {footnote && <div style={{ marginTop: 'var(--space-10)' }}><Provenance text={footnote} /></div>}
    </div>
  );
}

/* `rank` turns a displayed string into the number the comparison is on — "0.63%" is not a number and
   "2% within 365 days" is not one either. A row that wants `better` must say how to read itself; a row
   that cannot be ranked simply does not get a mark, rather than getting a wrong one. */
function bestOf(vals, dir, rank) {
  const nums = vals.map((v) => (typeof rank === 'function' ? rank(v) : parseFloat(String(v).replace(/[^0-9.-]/g, ''))));
  if (nums.some((n) => !isFinite(n))) return -1;
  const target = dir === 'low' ? Math.min(...nums) : Math.max(...nums);
  /* A tie marks nothing: two cheapest funds are not one winner. */
  return nums.filter((n) => n === target).length === 1 ? nums.indexOf(target) : -1;
}
