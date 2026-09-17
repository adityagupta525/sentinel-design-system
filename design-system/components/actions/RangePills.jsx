import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* The time range for a performance series. Shopee's fund detail carries `1M 3M YTD 1Y 3Y 5Y ALL`
   under the figure; our chart family had no range control at all, which for any performance series is
   not optional — a number with no period attached is not a number an advisor can defend.

   Sentinel's own language: these are Pill's filter tone at 32px in a single row, selected carrying the
   sand fill and a bronze ring, which is how selection already reads in this system. Not tabs: tabs
   change what you are looking at, a range changes the window on the same thing, and the selected pill
   is the existing vocabulary for "one of a set is on".

   Roles: role="tablist"/"tab" would promise arrow-key navigation between panels; this is a single-
   select filter over one panel, so it is a group of aria-pressed buttons. Seven ranges at 32px + gaps
   exceeds 343, so the row scrolls horizontally — permitted, because horizontal inside vertical is
   orthogonal (the no-nested-scroll law is about vertical inside vertical). */
const DEFAULT = ['1M', '3M', '1Y', '3Y', 'ALL'];
export function RangePills({ ranges = DEFAULT, value, onChange, label = 'Time range', locked = false, lockedNote }) {
  const active = value || ranges[ranges.length - 1];
  return (
    <div>
      <div role="group" aria-label={label} className="noscroll" style={{ display: 'flex', gap: 'var(--space-6)', width: '100%', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
        {ranges.map((r) => {
          const on = r === active;
          return (
            <Pressable key={r} onClick={locked ? undefined : () => onChange && onChange(r)} disabled={locked} pressed={on} label={`${label}: ${r}`}
              style={{ display: 'inline-flex', height: 'var(--h-filter-chip)', flexShrink: 0, alignItems: 'center', justifyContent: 'center', padding: `0 var(--space-12)`, borderRadius: 'var(--radius-full)', background: on ? 'var(--color-selected)' : 'var(--color-chip)', boxShadow: on ? `0 0 0 var(--border-1) var(--color-bronze)` : `0 0 0 var(--border-1) var(--color-line)` }}>
              <span style={{ font: 'var(--type-label-font)', letterSpacing: 'var(--tracking-pill)', color: on ? 'var(--color-ink)' : 'var(--color-bronze-deep)', fontVariantNumeric: 'tabular-nums' }}>{r}</span>
            </Pressable>
          );
        })}
      </div>
      {/* The performance caveat sits AT the chart, above it, not in a page footer — Monzo's rule. */}
      {locked && <p style={{ margin: `var(--space-6) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{lockedNote || 'Ranges unavailable until the performance source is confirmed.'}</p>}
    </div>
  );
}
