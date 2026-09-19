export type ListDividers = 'none' | 'inset' | 'full';
export interface ListEmptyState {
  /** One line in the product's voice. Never "No data" — "No drift to review — I'll flag it here when a portfolio moves". */
  title: string;
  body?: string;
  /** One pill, at most. */
  action?: React.ReactNode;
}
export interface ListProps {
  /** Row prop objects; each renders a <ListRow>. Omit and pass children to compose rows yourself. */
  items?: Array<Record<string, unknown>>;
  children?: React.ReactNode;
  /** Default 'inset'. */
  dividers?: ListDividers;
  /** Eyebrow above the card. */
  header?: string;
  /** A row under the last divider — the "See all 43" ghost button. A capped list plus a footer is how
   *  this system avoids a nested scroller; never make a List scroll inside a scrolling surface. */
  footer?: React.ReactNode;
  groupBy?: 'none' | 'client' | 'date' | 'journey';
  /** REQUIRED — every list in this product is empty on someone's first day. */
  emptyState: ListEmptyState;
  /** Skeleton rows with a shimmer; under prefers-reduced-motion they hold still. */
  loading?: boolean;
  /** Props merged into every row (e.g. `{variant:'nav', trailing:'chevron'}`). */
  rowProps?: Record<string, unknown>;
  /** Renders a `SearchField` ABOVE the card and filters `items` by `title`, case-insensitively.
   *
   *  An AMENDMENT rather than a `SearchableList`: `SearchField`'s own header has said since v9 that
   *  it is "the search field a `searchable` List renders", and this prop never existed — so
   *  `who.jsx` held the query in state, filtered by hand and rendered the field itself, and the fund
   *  picker was about to do it a second time.
   *
   *  **The pool stays the caller's.** `items` on the who-picker is already "the four most recent",
   *  and a search that silently widens to 512 clients on the first keystroke is a different surface.
   *  This filters what it was given and nothing more.
   *
   *  `emptyState` here is the SEARCH's, not the list's: a list with no rows and a query with no
   *  matches need different words. Omit it and the list's own is used for both. */
  search?: {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    emptyState?: ListEmptyState;
  };
}
export function List(props: ListProps): JSX.Element;
