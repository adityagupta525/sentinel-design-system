export interface PressableProps {
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  /** Press scale. 0.98 default; 0.94 on 42px icon discs. */
  pressScale?: number;
  /** Accessible name — REQUIRED when the child is a glyph, a numeral or anything not self-describing. */
  label?: string;
  /** Override the implicit button role (e.g. 'tab', 'switch'). */
  role?: string;
  /** For toggles: paints aria-pressed. */
  pressed?: boolean;
  /** For disclosures: paints aria-expanded. Pair with `controls`. */
  expanded?: boolean;
  /** id of the region this control expands. */
  controls?: string;
  tabIndex?: number;
  /** 'auto' (default) measures the rendered box and extends the tap target to 44pt.
   *  'none' opts out — only for a control already ≥44 in both axes, or one nested inside a larger target. */
  expand?: 'auto' | 'none';
  /** Anything except `outline`, which the focus ring owns. `boxShadow` is safe to pass. */
  style?: React.CSSProperties;
}
/** The operable base. Every component built on it inherits two guarantees it cannot get wrong:
 *  a ≥44pt tap target (measured, not declared) and a :focus-visible ring that clears 3:1.
 *  The ring is a solid --border-focus OUTLINE at --border-focus-width plus the --focus-ring halo. It is
 *  an outline rather than a box-shadow on purpose: an inline `style.boxShadow` from a caller beats a
 *  stylesheet rule, so a box-shadow ring vanished on every chip that passed its own ring (measured).
 *  Callers may pass `boxShadow` freely; they must not pass `outline`. The halo alone measures 1.22:1
 *  and would fail WCAG 2.4.13. */
export function Pressable(props: PressableProps): JSX.Element;
