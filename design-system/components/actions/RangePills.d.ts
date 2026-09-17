export interface RangePillsProps {
  /** Default ['1M','3M','1Y','3Y','ALL']. Add 'YTD' / '5Y' where the data supports them. */
  ranges?: string[];
  value?: string;
  onChange?: (range: string) => void;
  label?: string;
  /** True when the fund performance source is unconfirmed — one of the three locked decisions. The row
   *  renders inert and says why, rather than offering ranges over a number nobody owns. */
  locked?: boolean;
  lockedNote?: string;
}
/** The time range for a performance series — a number with no period attached is not a number an
 *  advisor can defend. A single-select filter over one panel, so a group of aria-pressed buttons, not
 *  a tablist. The row scrolls horizontally when the ranges overflow 343: horizontal inside vertical is
 *  orthogonal and allowed. */
export function RangePills(props: RangePillsProps): JSX.Element;
