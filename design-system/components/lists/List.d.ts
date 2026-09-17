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
}
export function List(props: ListProps): JSX.Element;
