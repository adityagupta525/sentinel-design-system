import React from 'react';
import { DarkButton } from './DarkButton.jsx';
/* C17 · sticky primary CTA wrapper. In v3+ the Dock's cta slot replaces this. */
export function StickyCTA({ label, onClick }) {
  return <div style={{ position: 'relative', zIndex: 10, padding: '6px 16px 8px', animation: 'ds-rise var(--dur-screen) var(--ease) both', animationDelay: '320ms' }}><DarkButton label={label} onClick={onClick} /></div>;
}
