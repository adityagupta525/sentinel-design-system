import React from 'react';
import { StandingDisclosure } from '../text/StandingDisclosure.jsx';
/* The two-row dock: chips → composer. The composer is always present and nothing replaces it.
   `cta` WAS THE THIRD ROW AND IT IS GONE (20 Sep 2026). The owner's ruling of 18 Sep moved the
   decision into the turn that offers it, so it scrolls with the message it belonged to; pinned here
   it outlived its turn and the screen read as a toolbar. The prop survived the ruling for two days
   because `ui_kits/` passed it in six artboards and the kit is not edited lightly. The kits were
   redrawn on `SentinelTurn` the same day this was removed. A decision is `SentinelTurn cta` now. */
export function Dock({ chips, composer, disclosure = true }) {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', padding: '6px 16px 8px' }}>
      {chips}
      {composer}
      {disclosure && <StandingDisclosure />}
    </div>
  );
}
