import React from 'react';
import { Mascot } from './Mascot.jsx';
import { DotField } from './DotField.jsx';
/* THE SPLASH COVERS WORK; IT DOES NOT WAIT (21 Sep 2026).
   A splash that exists to be looked at is a tax. This one is the cover for whatever has to be true
   before Home can be — the fonts arriving, a book parsing — and it leaves when that settles, not on
   a timer. What it cannot do is half-open the eyes: once the reveal has started it completes, so the
   floor is the reveal plus the exit, and the hold is whatever the work adds on top.

   The reveal is DotField's: bronze dots on tilted orbits settle onto the mascot's geometry, eyes
   first, then plate, then head. When the last dot lands the field IS the mascot, and the solid
   Mascot crossfades in over it with nothing moving — the 3D-in-Blender character arriving as dots
   and resolving into the token-drawn one. Then it waits, eyes breathing if the work is still going,
   and leaves on the screen transition every other screen uses.

     1. ink                                 the ground is --color-ink; nothing else is there
     2. + 3. dots → eyes → plate → head     --dur-enter + --dur-bar   DotField
     3b. dots resolve into the solid        --dur-enter               ds-fade in / ds-splash-leave out
     4. hold; if `until` is pending          Mascot state="working"
     5. leave                               --dur-screen              ds-screen-out + ds-splash-leave
   One new keyframe (`ds-splash-leave`, opacity only, with its reduced-motion entry), no new easing,
   no new colour. */
const ms = (name, fb) => {
  if (typeof window === 'undefined') return fb;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? (v.endsWith('ms') ? n : n * 1000) : fb;
};

export function SplashScreen({ until, onDone, mascotSize = 168, label = 'Sentinel is starting' }) {
  const [phase, setPhase] = React.useState('dots');           // dots → solid → leaving → gone
  const [untilSettled, setUntilSettled] = React.useState(false);
  const [solidReady, setSolidReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    const done = () => { if (alive) setUntilSettled(true); };
    Promise.resolve(until).then(done, done);             // a failure is not reported here
    return () => { alive = false; };
  }, [until]);

  const onSettled = React.useCallback(() => setPhase((p) => (p === 'dots' ? 'solid' : p)), []);

  React.useEffect(() => {
    if (phase !== 'solid') return;
    const t = setTimeout(() => setSolidReady(true), ms('--dur-enter', 240));
    return () => clearTimeout(t);
  }, [phase]);

  React.useEffect(() => {
    if (!(phase === 'solid' && untilSettled && solidReady)) return;
    setPhase('leaving');
    const t = setTimeout(() => { setPhase('gone'); onDone && onDone(); }, ms('--dur-screen', 320));
    return () => clearTimeout(t);
  }, [phase, untilSettled, solidReady, onDone]);

  if (phase === 'gone') return null;
  const showDots = phase === 'dots' || (phase === 'solid' && !solidReady);
  const showSolid = phase !== 'dots';
  return (
    <div className="ds-splash" data-phase={phase} role="status" aria-label={label}
      style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-ink)',
        animation: phase === 'leaving' ? 'ds-screen-out var(--dur-screen) var(--ease) both, ds-splash-leave var(--dur-screen) var(--ease) both' : undefined }}>
      <div style={{ position: 'relative', width: mascotSize, height: mascotSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {showDots && (
          <div className={phase === 'solid' ? 'ds-splash-dots' : undefined} style={{ position: 'absolute', inset: 0 }}>
            <DotField size={mascotSize} onSettled={onSettled} label="" />
          </div>
        )}
        {showSolid && (
          <div className="ds-splash-solid">
            <Mascot size={Math.round(mascotSize * 0.78)} tone="light" state={untilSettled ? 'attentive' : 'working'} label="Sentinel" />
          </div>
        )}
      </div>
    </div>
  );
}
