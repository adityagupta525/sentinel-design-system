import React from 'react';
import { Pressable } from '../actions/Pressable.jsx';
/* THE STICKY SECTION STRIP — a mini table of contents for a page too tall to hold in the head.

   A fund page is a CROSS-REFERENCE task: the advisor reads the expense ratio while thinking about the
   three-year return, and checks the riskometer against what the client already holds. NN/g is explicit
   that tabs are wrong for exactly that — "when users must repeatedly switch between tabs to compare or
   reference information, a tab-based design taxes short-term memory, increases cognitive load and
   interaction cost" — and Groww's four-tab fund page is the Indian convention that makes an advisor
   remember the number they left behind. So the page is ONE SCROLL, and this strip is how it stays
   navigable: NN/g again, "if the list of in-page links stays in place as users scroll, it should show
   users' current location."

   IT IS NOT TABS AND MUST NOT READ AS THEM. Tabs change WHAT you are looking at; this changes WHERE you
   are in one thing. So it is the system's existing filter-pill vocabulary at 32px, the same shape
   RangePills uses for a window over one series, and the roles are buttons rather than `tablist`/`tab`
   — which would promise arrow-key movement between panels that do not exist.

   THE ACTIVE PILL SCROLLS ITSELF INTO VIEW. Seven sections at 32px overflow 343, so the strip scrolls
   horizontally; a current-location indicator the advisor cannot see is not an indicator. Horizontal
   inside vertical is orthogonal, so this is not the nested-scroll law. `scroll-margin` keeps the pill
   off the edge rather than flush against it.

   THE CALLER OWNS THE SCROLL SPY. This component takes `active` and reports taps; it does not observe
   the page, because the page is the thing that knows where its sections are and an IntersectionObserver
   living in two places is two answers to one question. */

export function SectionStrip({ sections = [], active, onJump, label = 'Sections' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current && ref.current.querySelector('[data-active="true"]');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [active]);
  if (!sections.length) return null;
  return (
    <div ref={ref} role="group" aria-label={label} className="noscroll"
      style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-sticky)',
        display: 'flex', gap: 'var(--space-6)', width: '100%', overflowX: 'auto',
        padding: `var(--space-8) var(--space-16)`, boxSizing: 'border-box',
        background: 'var(--color-canvas)',
        /* A hairline, not a shadow: the strip is part of the page, not a layer above it. */
        boxShadow: `inset 0 calc(-1 * var(--border-1)) 0 0 var(--color-line-soft)`,
      }}>
      {sections.map((s) => {
        const on = s.id === active;
        return (
          <Pressable key={s.id} onClick={() => onJump && onJump(s.id)} pressed={on}
            data-active={on ? 'true' : 'false'} aria-current={on ? 'true' : undefined}
            label={`Go to ${s.label}`}
            style={{
              display: 'inline-flex', height: 'var(--h-filter-chip)', flexShrink: 0, alignItems: 'center',
              padding: `0 var(--space-12)`, borderRadius: 'var(--radius-full)', scrollMargin: 'var(--space-16)',
              background: on ? 'var(--color-selected)' : 'var(--color-chip)',
              boxShadow: `0 0 0 var(--border-1) ${on ? 'var(--color-bronze)' : 'var(--color-line)'}`,
            }}>
            <span style={{ font: 'var(--type-label-font)', letterSpacing: 'var(--tracking-pill)', color: on ? 'var(--color-ink)' : 'var(--color-bronze-deep)', whiteSpace: 'nowrap' }}>{s.label}</span>
          </Pressable>
        );
      })}
    </div>
  );
}
