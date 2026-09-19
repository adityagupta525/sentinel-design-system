import React from 'react';
/* TWO SCREENS, ONE SLOT — the only orchestration this system ships, and it decides nothing about motion.
   It was hand-built on `screens/journey-b/prototype.html` on 18 Sep with a note that said it would be
   promoted the moment a second live page needed it. The end-to-end prototype is that page, so this is
   that promotion: a screen never keeps what it had to build.

   What it owns: WHICH screen is mounted, and for how long the outgoing one stays. What it does not own:
   how a screen moves. Both keyframes are the system's (`tokens/effects.css`) and the duration is read
   from `--dur-screen` at run time, so a timer here can never disagree with the CSS it waits for — the
   bug this component exists to make impossible is an outgoing screen unmounted before its animation ends.

   GOING BACK IS THE SAME MOTION READ BACKWARDS. `direction="back"` invents no keyframe: the two the
   system already has are played with `animation-direction: reverse` and swapped between the screens, so
   the incoming screen arrives from -30% and the outgoing one leaves at 100% — the forward transition,
   run the other way. That is deliberate. A back gesture that looks like a forward one tells the advisor
   they went deeper when they went up, and inventing a third keyframe would have added motion character
   to a settled system to say something the existing two already say.

   Under prefers-reduced-motion both keyframes are redefined to a fade in place, and a reversed fade is
   still a fade — so the back direction degrades correctly without a line of its own. */
const FORWARD = { in: 'ds-screen-in', out: 'ds-screen-out', dir: 'normal' };
const BACK = { in: 'ds-screen-out', out: 'ds-screen-in', dir: 'reverse' };

export function ScreenStack({ screen, render, direction = 'forward', onSettle }) {
  const [prev, setPrev] = React.useState(null);
  /* The direction is captured AT THE CHANGE, not read from the prop while the animation runs. A parent
     that sets direction from the next intent would otherwise re-aim a transition already in flight. */
  const [dir, setDir] = React.useState('forward');
  const last = React.useRef(screen);
  const settle = React.useRef(onSettle);
  settle.current = onSettle;

  React.useEffect(() => {
    if (last.current === screen) return;
    const from = last.current;
    last.current = screen;
    setDir(direction);
    setPrev(from);
    const ms = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-screen')) || 0;
    const t = setTimeout(() => { setPrev(null); if (settle.current) settle.current(screen, from); }, ms);
    return () => clearTimeout(t);
    /* direction is read, never watched: changing it alone must not move a screen. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const k = dir === 'back' ? BACK : FORWARD;
  const play = (name) => `${name} var(--dur-screen) var(--ease) both`;
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      {prev !== null && (
        <div key={`out-${prev}`} aria-hidden="true"
          style={{ position: 'absolute', inset: 0, animation: play(k.out), animationDirection: k.dir }}>
          {render(prev)}
        </div>
      )}
      <div key={`in-${screen}`}
        style={{ position: 'absolute', inset: 0, animation: prev !== null ? play(k.in) : 'none', animationDirection: prev !== null ? k.dir : undefined }}>
        {render(screen)}
      </div>
    </div>
  );
}
