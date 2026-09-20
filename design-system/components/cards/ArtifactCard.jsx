import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
import { Pressable } from '../actions/Pressable.jsx';
/* A1 · the artifact card in the thread — and now the artifact's ONLY surface. There is no canvas:
   the card expands and collapses in place, so there is nowhere to go back from.

   CONTRACT — no nested scroll. An expanded card takes its content's natural height and the THREAD
   carries the scroll. Never set overflow:auto/scroll on this card or on `children`, and never cap it
   with a maxHeight. A scroller inside the scrolling thread is the pattern the old full-bleed canvas
   existed to avoid, and re-introducing it here is the one way this component stops feeling good.
   Peek clips its preview AT 96px — a cap, not a reserved block: a shorter preview takes its own height
   and the card closes under it (hidden, not scrollable). Expanded clips nothing.

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
  /* THE CARD'S BOTTOM MATCHES ITS SIDES WHEN NOTHING FOLLOWS (F-44, 19 Sep 2026). Both bodies ended in
     `14px 0` and relied on the footer to supply the bottom space — which was fine while the footer
     always rendered. F-42 stopped rendering it when a card has no handlers, and the last line then sat
     flush against the card's edge with 14 either side of it: padded on three sides, open on the fourth.
     The owner found it on the review card. When the footer IS there it still supplies the bottom, so
     the padding stays 0 and nothing that had a footer moves by a pixel. */
  const hasFooter = !!(onToggle || onWhy || onShare);
  const padBottom = hasFooter ? 0 : 14;
  const label = (t, strong) => <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-12)', color: strong ? 'var(--color-bronze-deep)' : 'var(--color-muted)' }}>{t}</span>;
  const titleEl = <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-16)', lineHeight: 'var(--leading-24)', color: 'var(--color-ink)' }}>{title}</p>;
  const body = (
    <React.Fragment>
      {!expanded && <React.Fragment><Eyebrow>{eyebrow}</Eyebrow><div style={{ marginTop: 'var(--space-4)' }}>{titleEl}</div></React.Fragment>}
      <div style={expanded ? { marginTop: 'var(--space-12)' } : { maxHeight: 96, marginTop: 'var(--space-10)', overflow: 'hidden' }}>
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
      {/* v12 · TAP-ANYWHERE WITHOUT NESTING A CONTROL. Peek used to wrap the whole body — children
          included — in the Pressable, so every interactive child became a <button> inside a <button>:
          invalid markup the browser silently unnests, a control announced inside a control, and the
          child's own ≥44pt extension landing inside someone else's target. Any Pill, DownloadAction or
          InfoDot in a peeking card hit it, so it was the card's bug, not the caller's.
          The press target is now a SIBLING behind the content, not an ancestor of it. The card's own
          chrome — eyebrow, title, provenance — passes its clicks through to it, while `children` keep
          their own pointer events, so a control in the preview acts instead of expanding the card.
          It is aria-hidden and out of the tab order on purpose: the footer's `Expand ▾` is the same
          action and is the keyboard path, and two tab stops for one action is noise. */}
      {expanded
        ? <div style={{ padding: `2px 14px ${padBottom}px` }}>{body}</div>
        : (
          <div style={{ position: 'relative' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
              <Pressable onClick={filling ? undefined : toggle} expand="none" tabIndex={-1}
                style={{ position: 'absolute', inset: 0, width: '100%', display: 'block' }} />
            </div>
            <div style={{ position: 'relative', padding: `14px 14px ${padBottom}px`, textAlign: 'left', pointerEvents: 'none' }}>
              <Eyebrow>{eyebrow}</Eyebrow>
              <div style={{ marginTop: 'var(--space-4)' }}>{titleEl}</div>
              {/* 96 IS A CAP, NOT A RESERVED BLOCK — corrected 18 Sep 2026, after the owner saw the gap.
                  `height: 96` reserved the full block whatever the preview measured, so a three-row bar
                  chart (62 measured) left 34pt of empty card between the chart and the provenance line:
                  a 44pt gap where 10 was declared. `maxHeight` keeps the rule exactly — the preview is
                  still clipped at 96 and still hidden rather than scrollable — and a shorter preview now
                  ends where it ends. The `filling` skeleton keeps a fixed 96, because there the block IS
                  the content: a shimmer that shrinks would be a wait that lies about its size. */}
              <div style={{ maxHeight: 96, marginTop: 'var(--space-10)', overflow: 'hidden', pointerEvents: 'auto' }}>
                {filling ? <div style={{ height: 96, borderRadius: 'var(--radius-12)', background: 'var(--color-track)', animation: 'sentinel-shimmer 1200ms ease-in-out infinite' }} /> : children}
              </div>
              {provenance && <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-15)', color: 'var(--color-muted)' }}>{provenance}</p>}
            </div>
          </div>
        )}
      {/* F-42 (19 Sep 2026). The rule and the footer were rendered unconditionally, so a card given none
          of the three handlers ended in a hairline, 44pt of dead space and THREE enabled <button>s with
          no name, no text and nothing to do — all of them in the tab order. Measured on the live DOM of
          `screens/journey-e/rebalance.html`, where `ResultCard` supplies none of them: a keyboard user
          tabbed into three invisible buttons. The condition is on the PROPS, not on `filling`: a card
          that has a toggle keeps its footer while it fills, because the row is about to be usable. */}
      {hasFooter && (
        <React.Fragment>
          <div style={{ margin: '12px 14px 0', height: 'var(--border-hairline)', background: 'var(--color-line-soft)' }} />
          {/* EACH SLOT IS A BUTTON ONLY IF IT HAS A HANDLER (F-47, 19 Sep 2026). F-42 made the whole
              footer conditional and stopped there, so a card given ONE handler still rendered three
              Pressables — two of them enabled, unnamed, 105×44 and reachable by keyboard. Nia measured
              45 of them across the product. That is the FIFTH time this system has shipped a nameless
              Pressable (F-28, F-39, F-42, F-43), and the fourth was mine.
              An empty slot is now a plain div of the same width, so the row's layout does not move. */}
          <div style={{ display: 'flex', padding: '0 14px' }}>
            {/* F-47 made the SLOT conditional on the handler; it did not cover `filling`, so while a
                card was filling the toggle rendered as a Pressable with its children gated off — an
                enabled 105 x 44 button with no name and nothing in it, in the tab order. Found on
                20 Sep by an accessibility sweep, and it is the fifth of this family. A card that is
                still filling has nothing to toggle, so it renders the empty slot like the others. */}
            {toggle && !filling
              ? <Pressable onClick={toggle} style={slot}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>{label(expanded ? collapseLabel : expandLabel, true)}<Chevron up={expanded} /></span>
                </Pressable>
              : <div style={slot} />}
            {onWhy ? <Pressable onClick={onWhy} style={slot}>{label('Why?')}</Pressable> : <div style={slot} />}
            {onShare ? <Pressable onClick={onShare} style={slot}>{label('Share')}</Pressable> : <div style={slot} />}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
