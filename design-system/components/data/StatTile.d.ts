export interface StatTileProps {
  /** Sentence case, 12px muted. */
  label: string;
  /** The headline figure, display face. */
  value: string;
  /** One qualifying line — "in a 20% fall", "exit load + STCG". */
  note?: string;
  /** Optional <Sparkline points={…} />. */
  sparkline?: React.ReactNode;
  /** A figure supplied elsewhere: chip surface, de-emphasis value. Use with [PLACEHOLDER — … to supply]. */
  locked?: boolean;
  /** Puts an `InfoDot` beside the label. **UNDOCUMENTED UNTIL 20 SEP 2026** — it shipped in v11 and
   *  lived only in the .jsx, which is how the review's four figures ended up with no door to an
   *  explanation while the same class of figure on a fund card had one on every stat (contradiction
   *  63). Pass it wherever the figure is one an advisor will be asked about. A locked tile takes it
   *  too: the absence is the thing that most needs explaining. */
  onExplain?: () => void;
  /** The rounding or basis note, AT the number rather than in a page footer — "annualised", "before
   *  tax". Quieter than `note`, which qualifies the figure; this one qualifies the arithmetic. */
  caveat?: string;
}

/** THE FIGURE TILE — the loud one, and contradiction 62's ruling of 20 Sep 2026 is which.
 *
 *  This system has two treatments for "a labelled figure in a rounded box" and nothing said when to
 *  reach for which, which is how a screen author picks the wrong one. They are now named:
 *
 *  - **`StatTile` is the FIGURE TILE.** Surface ground, OUTSET ring, display face, bronze, 24px. Use
 *    it when the figure IS the point of the turn — the review's four facts, the cost of doing nothing
 *    against the cost of fixing it. It is a component, it is exported, and it stands alone.
 *  - **`InfoCard`'s stat box is the FOOTNOTE STAT.** Canvas ground, INSET ring, 13px ink,
 *    `--type-caption-font` label. Use it for a fact ABOUT the thing the card is already about —
 *    riskometer, expense ratio, exit load under a fund's name. It is internal to `InfoCard`, it is
 *    not exported, and it never appears alone.
 *
 *  The test, in one line: **if the reader came for this number, it is a figure tile; if they came for
 *  the thing and this number qualifies it, it is a footnote stat.** Four figure tiles in a row are the
 *  loudest thing on a screen, which is correct when they are the answer and wrong when they are a
 *  footer. */
export function StatTile(props: StatTileProps): JSX.Element;
export interface SparklineProps { points: number[]; width?: number; height?: number }
export function Sparkline(props: SparklineProps): JSX.Element;
