import React from 'react';
import { IconArrow } from '../icons/IconArrow.jsx';
/* The dark CTA in the composer-button language: 48px, radius 16, dark gradient. */
export function DarkButton({ label, onClick, full = true, arrow = true }) {
  const [down, setDown] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      style={{ appearance: 'none', border: 'none', cursor: 'pointer', width: full ? '100%' : 'auto', display: 'flex', height: 48, alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)', borderRadius: 'var(--radius-16)', padding: '0 20px', background: 'var(--gradient-dark-cta)', transform: down ? 'scale(0.98)' : 'none', transition: 'transform var(--dur-press) var(--ease)' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-14)', color: 'var(--color-surface)' }}>{label}</span>
      {arrow && <IconArrow />}
    </button>
  );
}
