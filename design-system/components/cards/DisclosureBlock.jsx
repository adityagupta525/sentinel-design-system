import React from 'react';
import { Eyebrow } from '../text/Eyebrow.jsx';
/* Locked disclosure — peach callout with a lock glyph. */
export function DisclosureBlock({ text = 'Mutual fund investments are subject to market risk. Read all scheme-related documents carefully. Past performance is not indicative of future returns.', eyebrow = 'Required disclosure · locked' }) {
  return (
    <div style={{ width: '100%', borderRadius: 'var(--radius-16)', background: 'var(--color-bubble)', padding: '12px 14px', boxShadow: '0 0 0 1px var(--color-bubble-edge)', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2.5" y="5" width="7" height="5" rx="1" stroke="var(--color-bronze-deep)" strokeWidth="1.1" /><path d="M4 5V4a2 2 0 0 1 4 0v1" stroke="var(--color-bronze-deep)" strokeWidth="1.1" /></svg>
        <Eyebrow color="var(--color-bronze-deep)">{eyebrow}</Eyebrow>
      </div>
      <p style={{ margin: 0, ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-17)', color: 'var(--color-ink-soft)' } }}>{text}</p>
    </div>
  );
}
