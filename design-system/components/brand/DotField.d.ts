export interface DotFieldProps {
  /** Canvas side in px; the mascot's geometry is laid into 78% of it. 168 is the splash. */
  size?: number;
  /** How long the dots take to travel from their orbits onto the mascot. Defaults to
   *  --dur-enter + --dur-bar read from the tokens, so the field and SplashScreen agree without being told. */
  settleMs?: number;
  /** Delay before the settle begins, in ms. The orbits run meanwhile. */
  delayMs?: number;
  /** Settled dots breathe on opacity at SentinelThinking's 1.2s rhythm while this is true — the field's
   *  `working` state. Off, a settled field is still. */
  working?: boolean;
  /** Accessible name; the canvas is role="img". */
  label?: string;
  /** Fires once, when the last dot has landed. SplashScreen swaps the solid Mascot in on it. */
  onSettled?: () => void;
}
/** Bronze dots on tilted orbits that settle onto the mascot's own geometry — eyes first, then plate,
 *  then head — so the eyes open before the face exists. One colour, read from --color-bronze at mount;
 *  depth is alpha alone. Method from thinking-orbs (MIT), no dependency; see
 *  sentinel-craft/references/borrowed.md. Reduced motion draws the settled frame once. */
export function DotField(props: DotFieldProps): JSX.Element;
