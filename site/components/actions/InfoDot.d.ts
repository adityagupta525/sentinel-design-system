export interface InfoDotProps {
  /** The figure's name, used to build the accessible label — "CAGR 1Y" → "How is CAGR 1Y worked out?".
   *  Names the figure, never the icon. */
  figure: string;
  /** Opens the ExplainerSheet. Never a tooltip: a tooltip cannot hold a formula, a date range and a
   *  source, and at 375pt it is dismissed by the next tap. */
  onOpen?: () => void;
  size?: number;
  stroke?: string;
}
/** THE RULE as a component: any figure an advisor must defend carries an ⓘ to its explanation.
 *  44pt target around a 14px glyph, inherited from Pressable. */
export function InfoDot(props: InfoDotProps): JSX.Element;
