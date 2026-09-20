/** The bound client, composer-resident and always removable. Tapping a client does not navigate — it
 *  binds the next thread to that client, and this chip is what "bound" looks like. The drawer's client
 *  tap and a journey's client picker produce the same chip in the same place; typing a name resolves to
 *  the same state, so selection and typing are one flow, not two. */
export interface ClientChipProps {
  name: string;
  /** Avatar letter. Defaults to the first letter of `name`. */
  initial?: string;
  /** Omit to render a non-removable chip (inside a list row, for instance). In the composer it is always present. */
  onRemove?: () => void;
  disabled?: boolean;
}
export function ClientChip(props: ClientChipProps): JSX.Element;
