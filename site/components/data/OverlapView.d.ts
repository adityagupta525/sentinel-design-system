export type OverlapViewMode = 'pairs' | 'matrix';
export type OverlapProperty = 'top10' | 'all-holdings' | 'sector' | 'market-cap' | 'style';

export interface OverlapFund {
  id: string;
  name: string;
  inComparison: boolean;
}
export interface OverlapPropertyOption {
  id: OverlapProperty | string;
  /** What the advisor reads — "top 10 holdings", "sector". */
  label: string;
  active: boolean;
}
export interface OverlapCell {
  a: string;
  b: string;
  /** null or undefined means the overlap is NOT AVAILABLE, and it renders as an em dash with a
   *  footnote. Never pass 0 for a pair you could not compute: a zero and a missing value are
   *  different facts, and printing 0% states something untrue about the client's money. */
  pct: number | null;
}

export interface OverlapViewProps {
  /** Default 'pairs'. Pairs is the phone answer: five funds make a 25-cell matrix of which only ten
   *  carry information, and at 375pt those ten do not fit legibly. Matrix is for wide viewports and
   *  for export. */
  mode?: OverlapViewMode;
  /** Up to `maxFunds`. Only entries with `inComparison` are compared. */
  funds: OverlapFund[];
  /** The basis of the number, shown as removable chips so an advisor can change it rather than trust
   *  it blind. An overlap figure with no stated basis is one nobody can defend to a client. */
  properties: OverlapPropertyOption[];
  /** Symmetric — pass each pair once. Self-pairs are ignored: a fund against itself is a blank cell,
   *  never 100%. */
  cells: OverlapCell[];
  /** Default 5. The cap is STATED when reached, never enforced by a disabled button with no
   *  explanation. */
  maxFunds?: number;
  onToggleFund?: (id: string) => void;
  onToggleProperty?: (id: OverlapProperty | string) => void;
  /** Opens the picker sheet — `List` with `variant="multi"`. The sheet states the cap. */
  onAddFund?: () => void;
  onAddProperty?: () => void;
  /** Omit and the mode toggle is not rendered; the view stays in whatever `mode` says. */
  onChangeMode?: (mode: OverlapViewMode) => void;
  /** Replaces the default footnote about em dashes. Name WHY a pair is unavailable when you know. */
  footnote?: string;
}

/** Fund overlap: how much two funds are the same fund.
 *
 *  Colour is magnitude only — one sequential bronze ramp in four steps, light for low and dark for
 *  high — and every cell prints its percentage, so colour is never the only carrier. The two dark
 *  steps take surface-coloured text; ink on bronze-deep measures 2.25:1 and does not clear the floor.
 *
 *  Four states are not errors and each reads differently: fewer than two funds asks for a second one;
 *  no active property asks for a basis and renders nothing rather than defaulting to one the advisor
 *  did not choose; a self-pair is blank; an uncomputable pair is an em dash with a footnote. */
export function OverlapView(props: OverlapViewProps): JSX.Element;
