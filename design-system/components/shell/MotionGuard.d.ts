export interface MotionGuardProps {
  /** None. It renders nothing; the props exist so the contract is declarable. */
  children?: never;
}
/** The reduced-motion block, shipped in the bundle rather than only in `tokens/effects.css`.
 *  Installing on module evaluation is the point: loading `_ds_bundle.js` is enough, so a consuming
 *  project that brings its own page styles still honours `prefers-reduced-motion`. Idempotent. */
export const REDUCED_MOTION_CSS: string;
/** Appends the block once, id `ds-reduced-motion`. Returns false if it was already there. */
export function installReducedMotion(doc?: Document): boolean;
/** Renders nothing. Only needed when the bundle is loaded lazily and you want the install tied to a React tree. */
export function MotionGuard(props?: MotionGuardProps): null;
