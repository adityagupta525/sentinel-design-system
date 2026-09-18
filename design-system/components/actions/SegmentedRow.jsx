import React from 'react';
import { Pressable } from './Pressable.jsx';
/* One of a set, as a row of filter-tone pills — the shape RangePills has carried alone since v10,
   extracted on 18 Sep 2026 because a second control needed it (the drawer's Light / Dark) and a
   control the system cannot name is a control every screen redraws by hand.
   Selection reads the way it reads everywhere in this system: the selected pill takes --color-selected
   and a bronze ring; the rest keep --color-chip and a line ring. Not tabs — tabs change what you look
   at, this changes a value about the same thing — so it is a group of aria-pressed buttons.
   LOCKED is the state that earned the component. OverlapView's rule, in the system's words: the cap
   is STATED when reached, never enforced by a disabled button with no explanation. So a locked row
   renders inert, keeps its selection visible, and says why underneath in one caption. It never hides
   the option that is not available. */
export function SegmentedRow({ options, value, onChange, label, locked = false, lockedNote }) {
  const active = value ?? options[0];
  return (
    <div>
      <div role="group" aria-label={label} style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        {options.map((o) => {
          const on = o === active;
          return (
            <Pressable key={o} onClick={locked ? undefined : () => onChange && onChange(o)} disabled={locked} pressed={on} label={`${label}: ${o}`}
              style={{ display: 'inline-flex', height: 'var(--h-filter-chip)', flexShrink: 0, alignItems: 'center', justifyContent: 'center', padding: '0 var(--space-12)', borderRadius: 'var(--radius-full)', background: on ? 'var(--color-selected)' : 'var(--color-chip)', boxShadow: on ? '0 0 0 var(--border-1) var(--color-bronze)' : '0 0 0 var(--border-1) var(--color-line)' }}>
              <span style={{ font: 'var(--type-label-font)', letterSpacing: 'var(--tracking-pill)', color: on ? 'var(--color-ink)' : 'var(--color-bronze-deep)' }}>{o}</span>
            </Pressable>
          );
        })}
      </div>
      {locked && <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{lockedNote || 'Not available yet.'}</p>}
    </div>
  );
}
