export interface SelectionMarkProps {
  /** radio = one of a set · checkbox = several of a set. Pairing is enforced by the row, not chosen here. */
  kind: 'radio' | 'checkbox';
  selected?: boolean;
  disabled?: boolean;
}
/** Not an icon — drawn inside the component that owns it, and never rendered on its own. */
export function SelectionMark(props: SelectionMarkProps): JSX.Element;
