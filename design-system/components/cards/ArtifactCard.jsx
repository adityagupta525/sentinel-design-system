import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* A1 · the artifact card in the thread — and now the artifact's ONLY surface. There is no canvas:
   the card expands and collapses in place, so there is nowhere to go back from.

   CONTRACT — no nested scroll. An expanded card takes its content's natural height and the THREAD
   carries the scroll. Never set overflow:auto/scroll on this card or on `children`, and never cap it
   with a maxHeight. A scroller inside the scrolling thread is the pattern the old full-bleed canvas
   existed to avoid, and re-introducing it here is the one way this component stops feeling good.
   Peek clips its preview to 96px (hidden, not scrollable); expanded clips nothing.

   PEEK IS 96px, FIXED — recognition, not reading. What fits there is a sparkline strip (plot 72,
   one end-label row 14, no axis ticks, no gridlines, no legend), a single stat row, or a table's top
   three rows plus a "+40 more" line. Never a chart with axes: the thread is 463–497px, so one taller
   card would eat half of it and two would fill it. Axes, legend and the 180px plot belong to expanded.

   Two scroll behaviours belong to the caller, not the card: on expand, scroll the thread so the
   card's header sits just under the app bar; on collapse, scroll back to the card's position. */
const Chevron = ({ up }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', transform: up ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-screen) var(--ease)' }}>
    <path d="M6 9.5l6 6 6-6" stroke="var(--color-bronze-deep)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export function ArtifactCard({ state = 'peek', eyebrow, title, children, provenance, onToggle, onWhy, onShare, onMenu, expandLabel = 'Expand', collapseLabel = 'Collapse' }) {
  const expanded = state === 'expanded';
  const filling = state === 'filling';
  const toggle = onToggle;
  const slot = { flex: 1, display: 'flex', alignItems: 'center', height: 44 };
  const label = (t, strong) => <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: strong ? 'var(--color-bronze-deep)' : 'var(--color-muted)' }}>{t}</span>;
  const titleEl = <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-16)', lineHeight: 'var(--leading-24)', color: 'var(--color-ink)' }}>{title}</p>;
  const body = (
    <React.Fragment>
      {!expanded && <React.Fragment><Eyebrow>{eyebrow}</Eyebrow><div style={{ marginTop: 'var(--space-4)' }}>{titleEl}</div></React.Fragment>}
      <div style={expanded ? { marginTop: 'var(--space-12)' } : { height: 96, marginTop: 'var(--space-10)', overflow: 'hidden' }}>
        {filling ? <div style={{ height: 96, borderRadius: 'var(--radius-12)', background: 'var(--color-track)', animation: 'sentinel-shimmer 1200ms ease-in-out infinite' }} /> : children}
      </div>
      {provenance && <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-15)', color: 'var(--color-muted)' }}>{provenance}</p>}
    </React.Fragment>
  );
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', boxSizing: 'border-box', overflow: 'hidden', animation: 'ds-artifact 300ms var(--ease) both' }}>
      <style>{'@keyframes ds-artifact{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){@keyframes ds-artifact{from{opacity:0}to{opacity:1}}}'}</style>
      {expanded && (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', padding: '12px 6px 12px 14px' }}>
            <div style={{ flex: 1, minWidth: 0 }}><Eyebrow>{eyebrow}</Eyebrow><div style={{ marginTop: 'var(--space-2)' }}>{titleEl}</div></div>
            <Pressable onClick={onMenu} style={{ display: 'flex', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-16)', lineHeight: 1, color: 'var(--color-ink)' }}>⋯</span>
            </Pressable>
          </div>
          <div style={{ margin: '0 14px', height: 'var(--border-hairline)', background: 'var(--color-line-soft)' }} />
        </React.Fragment>
      )}
      {expanded
        ? <div style={{ padding: '2px 14px 0' }}>{body}</div>
        : <Pressable onClick={filling ? undefined : toggle} style={{ display: 'block', width: '100%', padding: '14px 14px 0', textAlign: 'left' }}>{body}</Pressable>}
      <div style={{ margin: '12px 14px 0', height: 'var(--border-hairline)', background: 'var(--color-line-soft)' }} />
      <div style={{ display: 'flex', padding: '0 14px' }}>
        <Pressable onClick={filling ? undefined : toggle} style={slot}>
          {toggle && !filling ? <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>{label(expanded ? collapseLabel : expandLabel, true)}<Chevron up={expanded} /></span> : null}
        </Pressable>
        <Pressable onClick={onWhy} style={slot}>{onWhy ? label('Why?') : null}</Pressable>
        <Pressable onClick={onShare} style={slot}>{onShare ? label('Share') : null}</Pressable>
      </div>
    </div>
  );
}
