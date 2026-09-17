import React from 'react';
/* Partner (advisor) bubble — peach, right-aligned, 20px radius with a 6px tail corner.
   overflowWrap 'anywhere' because an advisor pastes scheme codes and ISINs. A hyphenated code wraps on
   its own; one unbroken token ran straight out of the bubble's own background and past the 280pt cap
   (F-18). It changes nothing for prose, which breaks at spaces long before it reaches this. */
export function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', animation: 'ds-rise var(--dur-enter) var(--ease) both' }}>
      <div style={{ maxWidth: 280, borderRadius: '20px 20px 6px 20px', background: 'var(--color-bubble)', padding: '10px 12px', boxShadow: '0 0 0 1px var(--color-bubble-edge)' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', lineHeight: 'var(--leading-19)', color: 'var(--color-ink)', overflowWrap: 'anywhere' }}>{text}</p>
      </div>
    </div>
  );
}
