import * as React from 'react';

export interface SentinelTurnProps {
  /** What Sentinel says. One string, or several — the first carries the statement, the rest carry
   *  the reasoning. Gapped at **--space-10** between sentences, which 5 of the 6 hand-built
   *  multi-sentence turns already used. */
  say?: string | string[];
  /** How the FIRST sentence is set. Default 'Medium'; every later line is Regular, which is the
   *  weight pair `SentinelText` was built around. */
  weight?: 'Medium' | 'Regular';
  /** The one thing the turn carries — a card, a chart, a trace, a list, a search field, a callout.
   *  Gapped at **--space-12**. */
  body?: React.ReactNode;
  /** Put the body ABOVE the sentences. For a turn whose answer IS the artifact and whose sentence
   *  reads it out: the risk result, the execution trace, the placed-moves receipt. */
  bodyFirst?: boolean;
  /** A sentence that follows the body. Set Regular, gapped at **--space-12** — a sentence after
   *  something that is not a sentence takes the part gap, not the sentence gap. Unanimous across the
   *  five hand-built cases. */
  then?: string;
  /** A second thing after `then` — the drafted note under the receipt, the client list under the
   *  search field. Gapped at **--space-12**. */
  tail?: React.ReactNode;
  /** Where the turn's figures came from. Gapped at **--space-10**, the value `InfoCard` and
   *  `OverlapView` both use; the two screens that hand-wrote it disagreed (10 and 8) and the system's
   *  own placements break the tie. */
  provenance?: string;
  /** The answer chips, as a `ChipRow`. Sits BELOW the block at `--stack` (12px) — the same 12px the
   *  seven turns that nested it inside the block were already drawing. */
  chips?: React.ReactNode;
  /** The artifact, the dark CTA, `MessageActions` — whatever belongs to this turn but not to the
   *  sentence. Also at `--stack`. */
  actions?: React.ReactNode;
  /** The turn is still arriving: renders `SentinelThinking` and NOTHING ELSE. Pass the verb as a
   *  string and it names what is being read. Chips and actions are dropped on purpose — offering an
   *  answer's chips beside the dots lets an advisor answer a question Sentinel has not finished
   *  asking. */
  thinking?: boolean | string;
  /** Drop the "✦ Sentinel" signature, for the second and later blocks of one turn. One label per
   *  turn is a standing ruling (18 Sep 2026). */
  continued?: boolean;
  /** Play `ds-rise` on the whole turn. The live page passes it; a frozen spec page does not. */
  enter?: boolean;
  /** Overrides the "Sentinel" label. Rarely right — see `SentinelBlock`. */
  label?: string;
}

/** ONE THING SENTINEL SAID, AND EVERYTHING THAT BELONGS TO IT.
 *
 *  Thirteen turns were hand-built across nine screen modules, with 35 spacer divs between their
 *  parts. The values were not arbitrary — measured on 20 Sep 2026 they spell a grammar the screens
 *  were already following without it being written down anywhere:
 *
 *  | between                            | value        | vote  |
 *  |------------------------------------|--------------|-------|
 *  | a sentence and the next sentence   | --space-10   | 5 / 6 |
 *  | the lead sentence and the body     | --space-12   | 7 / 8 |
 *  | the body and a sentence after it   | --space-12   | 5 / 5 |
 *  | the block and its chips            | --space-12   | 7 / 7 |
 *  | anything and its provenance        | --space-10   | the system's own two placements |
 *
 *  Three sites dissent and are NOT what this component draws: `proposal.jsx:141` gaps two sentences
 *  at 8, `answer.jsx:127` gaps a card at 8, `answer.jsx:130` gaps provenance at 8. Each is a visible
 *  2–4px and therefore the owner's call, not a migration.
 *
 *  It adds no visual decision. Every gap it draws is one the repository was already drawing most
 *  often. What it adds is that the gap is decided ONCE — so a fourteenth turn cannot quietly
 *  introduce a fifth value for "the next sentence". */
export function SentinelTurn(props: SentinelTurnProps): JSX.Element;
