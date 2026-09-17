import React from 'react';
import { StandingDisclosure } from '../text/StandingDisclosure.jsx';
/* The three-row dock: chips → CTA → composer. The CTA never replaces the composer. */
export function Dock({ chips, cta, composer, disclosure = true }) {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', padding: '6px 16px 8px' }}>
      {chips}
      {cta}
      {composer}
      {disclosure && <StandingDisclosure />}
    </div>
  );
}
