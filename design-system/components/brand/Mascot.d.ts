export interface MascotProps {
  /** Width in px. Height follows at 0.74 — the head is 1.38 : 1, read off the 3D model's front view.
   *  The signature in a turn is 13–18; the splash uses 168. Below about 40 the eyes' offset stops
   *  reading and the mark becomes a plate with two dots, which is still the character but no longer
   *  its expression — measure before using it small. */
  size?: number;
  /** What the mascot is doing, and the only three things it may claim to be doing.
   *  `waking` — eyes off. Cold start only; the moment before the product exists.
   *  `attentive` — eyes on, still. The resting face, and the default.
   *  `working` — eyes pulse on opacity, 1.2s, the second trailing by 150ms: SentinelThinking's own
   *  rhythm, so a waiting mascot and a waiting thread are one behaviour.
   *  There is deliberately no `happy`, `confused` or `empathetic`. A state is a claim about what the
   *  product is doing, and a wealth-management tool should not claim a mood about a figure it is about
   *  to show. */
  state?: 'waking' | 'attentive' | 'working';
  /** Which neutral is the shell and which is the plate. `light` (desk shell, ink plate) for dark
   *  grounds — the splash; `dark` (ink shell, desk plate) for the canvas. The eyes are bronze in both.
   *  No colour is introduced by either; rule 1 holds. */
  tone?: 'light' | 'dark';
  /** Accessible name. The svg is role="img"; a decorative use should still name what it depicts. */
  label?: string;
}
/** The product's character, as one SVG from tokens — the 3D model's front view at any size. Head
 *  only: the body is noise at every size this is used at. `ds-mascot-shell` and `ds-mascot-eyes` are
 *  hooks for a caller that needs to reveal the two separately, which is what SplashScreen does; they
 *  are not styled by anything in this system. */
export function Mascot(props: MascotProps): JSX.Element;
