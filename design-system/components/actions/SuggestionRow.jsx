import React from 'react';
import { IconChevronRight } from '../icons/IconChevronRight.jsx';
/* Suggestion row with chevron, --h-row (42px), hairline divider.
   The height was the literal 42 while spacing.css named this component in --h-row's own comment. */
export function SuggestionRow({ label, onClick, last = false }) {
  const [down, setDown] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      style={{ appearance: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', height: 'var(--h-row)', width: '100%', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', background: down ? 'var(--tint-bronze-06)' : 'transparent', borderBottom: last ? 'none' : '0.5px solid var(--color-line-soft)', transform: down ? 'scale(0.98)' : 'none', transition: 'transform var(--dur-press) var(--ease), background-color var(--dur-press)' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-12)', lineHeight: 'var(--leading-18)', color: 'var(--color-ink)' }}>{label}</span>
      <IconChevronRight />
    </button>
  );
}
