import React from 'react';
/* C15 · single 8px bronze bar on the alloc track + caption.

   IT SHOWED 100% FOR EVERY FRACTION, AND HAD SINCE IT WAS WRITTEN (F-38, 19 Sep 2026). The fill carried
   an inline `transform: scaleX(fraction)` AND `animation: ds-grow … both`. `ds-grow` ends at
   `scaleX(1)`, and `animation-fill-mode: both` holds a keyframe's final value forever — so the moment
   the 500ms finished, every bar was full, whatever it was told. The component whose entire job is to
   show a fraction showed all of it.

   THIS IS THE THIRD TIME THE SAME CSS FACT HAS COST US A FIGURE: F-27 was `ds-fade … both` holding a
   scrim at opacity 1 over a declared 0.4, and this is the transform half of it. The rule, now written
   somewhere it will be read: AN ANIMATION WITH `both` OWNS THE PROPERTY IT ANIMATES. Do not also set
   that property inline. Every sibling here already does it correctly — AllocationCard, HeroNumberCard,
   InfoCard and Dumbbell all set the WIDTH and let ds-grow scale 0 → 1 of it — so this one now does too. */
export function ConcentrationBar({ fraction, label }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', height: 8, width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-full)', background: 'var(--color-track)' }}>
        <div style={{ height: '100%', width: `${Math.max(0, Math.min(1, fraction)) * 100}%`, borderRadius: 'var(--radius-full)', background: 'var(--color-bronze)', transformOrigin: 'left', animation: 'ds-grow var(--dur-bar) var(--ease) both' }} />
      </div>
      <p style={{ margin: '6px 0 0', ...{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-12)', color: 'var(--color-muted)' } }}>{label}</p>
    </div>
  );
}
