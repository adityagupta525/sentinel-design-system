import * as React from 'react';

export interface CompareEntity {
  id: string;
  /** The fund's name, as the advisor reads it. Wraps; the column is at least 104pt wide. */
  name: string;
  /** One line under it — the house and the category. */
  meta?: string;
}

export interface CompareRow {
  /** What is being compared, in the advisor's words: "Expense ratio", not "TER". */
  label: string;
  /** Keyed by entity id. A missing or empty value renders `——`, never a blank cell and never a zero. */
  values: Record<string, React.ReactNode>;
  /** ONLY where direction is a fact. `'low'` for cost — a lower expense ratio is cheaper, which is
   *  arithmetic, not an opinion — `'high'` where more is plainly better. A fund's SIZE has no better,
   *  and a row without this never marks one. The winning cell carries `--type-row-strong-font`: the
   *  same size at one weight up, never a colour (rule 1). */
  better?: 'low' | 'high';
  /** How to read this row's displayed string as a number, when the default (strip everything that is
   *  not a digit) is wrong — "2% within 365 days" is not 2. A row whose values cannot be ranked gets
   *  no mark rather than a wrong one. */
  rank?: (value: React.ReactNode) => number;
}

export interface CompareTableProps {
  /** Two or three. Two is the phone's comfortable answer: 104 + 2×105 fits 375. A third scrolls
   *  sideways with the label column pinned. */
  entities: CompareEntity[];
  rows: CompareRow[];
  /** Default 'Side by side'. */
  title?: string;
  /** Default 3, the PRD's ceiling. STATED when reached via `capNote`, never a disabled button with
   *  no explanation — `OverlapView`'s rule. */
  cap?: number;
  /** Omit and no add control is drawn. Hidden once the cap is reached. */
  onAdd?: () => void;
  /** Default 'Add a third'. */
  addLabel?: string;
  /** Shown once the cap is reached. Say what the cap is and why, in words. */
  capNote?: string;
  /** Rendered with `Provenance`. Every figure here came from somewhere, and a comparison an advisor
   *  reads to a client is the last place to leave that unsaid. */
  footnote?: string;
  /** Drawn on each column only while there are more than two — a comparison of one is not a
   *  comparison, so the second fund has no Remove. */
  onRemove?: (id: string) => void;
}

/** TWO OR THREE FUNDS, READ ACROSS A ROW.
 *
 *  `DataTable` is many entities with one kind per COLUMN, sorted and expandable in place. A comparison
 *  is its transpose: few entities, one kind per ROW, and the read is sideways — an advisor asks "what
 *  does each of these charge", not "sort by cost". Forcing a comparison through `DataTable` makes
 *  every fund column `text`, which throws away the tabular figures and the row's own meaning.
 *  `OverlapView` answers the other comparison question — how much of two funds is the same fund.
 *
 *  **The same value is the information, and it recedes.** The v2 spec says "differences bolded", and
 *  taken literally that bolds almost every cell. Inverted it is useful: a row where every fund says
 *  the same thing is MUTED, so the eye lands where they actually part. A de-emphasis, not a claim.
 *
 *  **`better` is the one claim, and only where direction is a fact.** The verdict that reads the whole
 *  comparison belongs in a sentence in the turn — which is where the spec puts it too: *"a table
 *  anyone can build; the reading is what the advisor is paying for."* */
export function CompareTable(props: CompareTableProps): JSX.Element;
