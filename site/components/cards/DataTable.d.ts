export type ColumnKind = 'text' | 'number' | 'percent' | 'currency' | 'badge' | 'bar' | 'sparkline';
export type ColumnAlign = 'start' | 'end';
export type SortDir = 'asc' | 'desc' | 'none';
export type Density = 'compact' | 'default';
export type TableOverflow = 'fold' | 'scroll';

export interface DataTableColumn {
  key: string;
  label: string;
  kind: ColumnKind;
  /** `kind='sparkline'` only: the tone the line takes — 'ramp' (default) the row's own series,
   *  'muted' a benchmark or prior period, 'status' a crossed limit. Never a colour. */
  tone?: 'ramp' | 'muted' | 'status';
  /** `kind='sparkline'` only: the accessible name each spark takes. Defaults to the point count and
   *  the final value. Pass it when the column header does not say what the series is. */
  sparkLabel?: string;
  /** `kind='bar'` only: the low end of the bar's scale. **Default 0**, so every bar column written
   *  before this draws what it drew — a holding weight, where 0% is a real position. Pass it when the
   *  zero is not meaningful for the quantity: ten fund scores between 58 and 80 scaled from zero are
   *  ten bars within a quarter of each other's length, and the column reads as no signal. Same
   *  reasoning and same safeguard as `Dumbbell.min` — the figure is the cell's content and the bar
   *  sits behind it, so a baseline can never leave a number unreadable. */
  min?: number;
  /** Derived from `kind` — text and badge start, every figure ends. Override only when the derivation
   *  is wrong for a specific column, never as a style preference: a column of figures that does not
   *  share a right edge cannot be compared down. */
  align?: ColumnAlign;
  /** Fixed px. Omit to share the remaining width. The sticky column defaults to 132 when scrolling. */
  width?: number;
  /** EXACTLY ONE column may be sticky, and it is the entity name. Without it the table is unreadable
   *  the moment it scrolls sideways. TypeScript cannot express "exactly one" over an array, so the
   *  rule lives here and the component warns once and uses the first rather than rendering two sticky
   *  cells that fight over the same offset. Omit it entirely and the first column is used. */
  sticky?: boolean;
  sortable?: boolean;
}

export type DataTableRow = Record<string, React.ReactNode> & {
  /** Stable key. Falls back to the index, which is wrong the moment rows re-sort. */
  id?: string;
};

export interface DataTableEmptyState {
  /** One line in the product's voice. Never "No data" — "Nothing matches every filter". */
  title: string;
  body?: string;
  /** One pill, at most — usually the way out of the filter that emptied it. */
  action?: React.ReactNode;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  /** Title above the table. */
  title?: string;
  /** Default 'default'. 'compact' tightens the row inset only; it never changes type or alignment. */
  density?: Density;
  /** Default 'fold' — `maxRows` then a ghost "Show all 43", the pattern the review journey already
   *  uses. A 43-row table inside a chat thread is not a good idea. 'scroll' shows every row. */
  overflow?: TableOverflow;
  /** The active sort. One column at a time: multi-column sort is unusable on a phone. */
  sort?: { key: string; dir: SortDir };
  /** Called with the next state in the cycle none → desc → asc. Omit and no header is pressable. */
  onSort?: (key: string, dir: SortDir) => void;
  /** A row of filter Pills (tone="filter"), above the header. */
  filters?: React.ReactNode;
  /** Return a node and the row becomes expandable IN PLACE — never a modal. The chevron lives in the
   *  sticky column and the detail pushes the rows below it down, so the row you opened does not move
   *  under your thumb. Return null for rows with nothing to show. */
  expandable?: (row: DataTableRow) => React.ReactNode;
  /** Which row index starts expanded. Null (default) means all closed, which is every product call site.
   *  It exists because the expansion was internal state with no way in, so a frozen specimen could not
   *  show a row opened in place — the state this component's whole no-modal rule is about. Same gap and
   *  the same fix as `ProgressTrace.initialCollapsed`. */
  defaultOpen?: number | null;
  /** 'fold' only. Default 5. */
  maxRows?: number;
  onShowAll?: () => void;
  /** REQUIRED — every table in this product is empty on someone's first day, or one filter away. */
  emptyState: DataTableEmptyState;
  /** Skeleton rows on --color-track, not a spinner. */
  loading?: boolean;
  /** The live label the first skeleton row carries — "Reading her September statement". A skeleton
   *  that says what it is doing is the difference between waiting and wondering. */
  loadingLabel?: string;
}

/** The full table: sorting, filters, expand-in-place, horizontal scroll with a fade and a one-time
 *  nudge. `DataTableCard` remains the three-column card for a thread; this is its widening.
 *
 *  A `kind='bar'` column reads its magnitude from `<key>Value` when present, otherwise by parsing the
 *  displayed string. The bar is drawn behind the figure in `--tint-bronze-06` — one hue, magnitude
 *  only. Never a categorical colour in a table. */
export function DataTable(props: DataTableProps): JSX.Element;
