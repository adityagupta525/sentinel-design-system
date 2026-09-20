/** THE FILTER ABOVE A LIST — the composer's visual style at one row and 44px, so it reads as a filter
 *  rather than a second composer. This doc said "what a `List searchable` renders" until 19 Sep 2026;
 *  `List` has no `searchable` prop and never did, so the sentence described a feature that did not
 *  exist. The caller composes it: SearchField above, `List` below, filtered by the caller. Selection is for browsing a 512-client book; typing a name in
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
