import React from 'react';
import { DarkButton } from './DarkButton.jsx';
/* C17 · sticky primary CTA wrapper.
   DEPRECATED, AND THE ONLY DEAD COMPONENT IN THE SYSTEM. In v3+ the Dock's `cta` slot replaces this,
   which is what this header has said all along — but the component kept shipping in the barrel and
   the bundle, so a consuming team can still find and use it. It predates the dock law: no chips row
   above, no composer below, which is the layout rule 3 exists to prevent.
   Use <Dock cta={<DarkButton … />} composer={…} /> instead. See StickyCTA.d.ts. */
export function StickyCTA({ label, onClick }) {
  return <div style={{ position: 'relative', zIndex: 10, padding: '6px 16px 8px', animation: 'ds-rise var(--dur-screen) var(--ease) both', animationDelay: '320ms' }}><DarkButton label={label} onClick={onClick} /></div>;
}
