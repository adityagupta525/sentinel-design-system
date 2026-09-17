/** What a `List searchable` renders: the composer's visual style at one row and 44px, so it reads as a
 *  filter rather than a second composer. Selection is for browsing a 512-client book; typing a name in
 *  the composer stays the path for an advisor who already knows it. */
export interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  /** Default 'Search 512 clients' — state the real count. */
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}
export function SearchField(props: SearchFieldProps): JSX.Element;
