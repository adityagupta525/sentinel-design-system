import React from 'react';
/* Generic pressable with the calm press micro-state: scale 0.98 over 150ms.

   v11 · THE BASE CARRIES BOTH OPERABILITY GUARANTEES, so thirty component files inherit them without
   being edited — the instinct Pill already had, moved to where it belongs: callers cannot get it wrong.

   1 · Hit expansion. A visual box shorter than 44pt gets a transparent ::before that extends the
   target to 44 vertically (and horizontally when the box is narrow). Measured from the rendered box,
   not declared, so a 28px chip and a 42px disc both answer to a 44pt touch.

   2 · Focus. This component used to set `outline: none` with nothing in its place, which is worse than
   an omission — it switched the browser's own indicator off for everything beneath it. It now paints a
   2px solid --border-focus OUTLINE plus the --focus-ring halo, on :focus-visible only, so a mouse
   press stays quiet and a keyboard or switch-control user can see where they are.

   Why an outline and not a box-shadow: the first build used box-shadow, and an inline style.boxShadow
   from a caller beats a stylesheet declaration every time — measured, a chip passing its own 1px ring
   returned "rgb(225,222,218) 0 0 0 1px" on focus and no ring at all. Four callers did exactly that
   (RangePills, ResponseFeedback, CanvasHeader, ScrollToBottomButton), so the guarantee held for most
   components and failed silently for the rest, which is the one failure mode a base may not have.
   `outline` is never passed inline by a caller here, so it cannot be overridden by accident. Callers
   may pass boxShadow freely; they must not pass outline.

   Both rules live in tokens/effects.css, not in a <style> here: a <style> child of <button> is an
   invalid content model and duplicated once per instance (53 copies on the RangePills page). They are
   global and identical for every instance, so the stylesheet is where they belong. MotionGuard also
   installs them from the bundle, so a consuming project that skips the stylesheet still gets them.

   Why solid and not just the halo: the halo is bronze at 24% alpha, which composites to #e7ddd4 and
   measures 1.22:1 against canvas — it fails WCAG 2.4.13's 3.0 floor on its own. The solid outline is
   --color-bronze-deep at 6.59 / 7.24. Both tokens already existed; only their use is new. */
/* `aria-disabled` is accepted and forwarded (19 Sep 2026) so a caller can render a control INERT —
   unclickable, out of the tab order, announced as unavailable — WITHOUT the 0.4 dimming that `disabled`
   carries. SegmentedRow's locked row needs exactly that: the cap is stated, and the current selection
   still has to be visible while it cannot be changed. */
export function Pressable({ children, onClick, style, disabled = false, pressScale = 0.98, label, role, expand = 'auto', pressed, expanded, controls, tabIndex, 'aria-disabled': ariaDisabled }) {
  const [down, setDown] = React.useState(false);
  const ref = React.useRef(null);
  const [pad, setPad] = React.useState({ y: 0, x: 0 });
  /* MEASURED ON EVERY RESIZE, NOT ONCE (20 Sep 2026). The deps were `[expand, children]`, so the pad
     was frozen to whatever the layout happened to be when the effect first ran — and 47 RangePills
     that all render at the same width carried three different targets, decided by nothing the caller
     could see. A control whose hit box depends on when it mounted is not a guarantee. */
  React.useEffect(() => {
    if (expand === 'none' || !ref.current) return;
    const el = ref.current;
    const measure = () => {
      const box = el.getBoundingClientRect();
      if (!box.height) return;
      setPad({ y: Math.max(0, (44 - box.height) / 2), x: Math.max(0, (44 - box.width) / 2) });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [expand]);
  React.useEffect(() => {
    if (expand === 'none' || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    if (!box.height) return;
    /* THE 12px CAP MEANT THE 44pt GUARANTEE WAS NOT KEPT (20 Sep 2026, found by measuring rather than
       by reading the contract). A 14px `InfoDot` expanded to 14 + 24 = **38 wide**, six points short,
       on every figure in the product that offers an explanation. The cap was there to stop a narrow
       control swallowing its neighbours — but neighbours are spaced by the row that holds them, and a
       target that silently stops at 38 breaks the one promise this component exists to make. It
       expands to 44 now, in both axes, and a caller that genuinely cannot afford it passes
       `expand='none'` and says so. */
    setPad({ y: Math.max(0, (44 - box.height) / 2), x: Math.max(0, (44 - box.width) / 2) });
  }, [expand, children]);
  const needsPad = pad.y > 0 || pad.x > 0;
  return (
    <button ref={ref} type="button" onClick={onClick} disabled={disabled} aria-disabled={ariaDisabled} className="ds-pressable" data-hit={needsPad ? '' : undefined}
      aria-label={label} role={role} aria-pressed={pressed} aria-expanded={expanded} aria-controls={controls} tabIndex={tabIndex}
      onPointerDown={() => !disabled && setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      style={{ position: 'relative', appearance: 'none', border: 'none', background: 'transparent', padding: 0, margin: 0, cursor: disabled ? 'default' : 'pointer', color: 'inherit', font: 'inherit', textAlign: 'inherit', opacity: disabled ? 0.4 : 1, transform: down ? `scale(${pressScale})` : 'none', transition: 'transform var(--dur-press) var(--ease), background-color var(--dur-press) var(--ease)', '--hit-y': `${pad.y}px`, '--hit-x': `${pad.x}px`, ...style }}>
      {children}
    </button>
  );
}
