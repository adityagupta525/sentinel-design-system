export interface SegmentedRowProps {
  /** Two to five short labels. Sentence case; the row wraps rather than scrolling. */
  options: string[];
  /** The selected option. Defaults to the first — a segmented row is never in no state. */
  value?: string;
  onChange?: (option: string) => void;
  /** The group's accessible name — "Appearance", "Time range". Required. */
  label: string;
  /** The whole row renders inert and `lockedNote` appears beneath it. Use it when the choice exists
   *  but cannot be taken yet; never hide the option instead. OverlapView's rule: the cap is stated
   *  when reached, never enforced by a disabled button with no explanation. */
  locked?: boolean;
  /** One line, in the product's voice, on why the row is locked. */
  lockedNote?: string;
}
/** One of a set, as filter-tone pills at 32px — the selection vocabulary RangePills established. A
 *  group of aria-pressed buttons, not a tablist: tabs change what you look at, this changes one value
 *  about the same thing. Every pill answers to a 44pt target through Pressable. */
export function SegmentedRow(props: SegmentedRowProps): JSX.Element;
