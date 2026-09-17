import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
/* C11 · the peach callout — carries constraints and bad news. Never a red surface. */
export function ConstraintCallout({ eyebrow, body }) {
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-bubble)', padding: '12px 14px', boxShadow: '0 0 0 1px var(--color-bubble-edge)', boxSizing: 'border-box', animation: 'ds-rise 260ms var(--ease) both' }}>
      <Eyebrow color="var(--color-bronze-deep)">{eyebrow}</Eyebrow>
      <p style={{ margin: '4px 0 0', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-13)', lineHeight: 'var(--leading-19)', color: 'var(--color-ink-soft)' } }}>{body}</p>
    </div>
  );
}
