export interface RefusalTurnProps {
  /** What it will not do, and why — one sentence or several. Plain English: the advisor may read this
   *  aloud to a client, and "I cannot action that request" is not a sentence anybody says. */
  body: string | string[];
  /** WHAT IT CAN DO INSTEAD, BY NAME. Not optional in practice: a refusal with no chips is a dead end,
   *  and a dead end is the one thing an advisor cannot work around. Never "try again" — each chip is a
   *  route that exists. */
  chips?: string[];
  onChip?: (label: string) => void;
  /** Default false. True when Sentinel already signed the turn above — one signature per turn. */
  continued?: boolean;
  enter?: boolean;
}
/** WHAT SENTINEL SAYS WHEN IT WILL NOT DO SOMETHING, in the shape every refusal in this product
 *  keeps: what it will not do, then what it can do instead, by name. Promoted from
 *  `screens/thread/refusals.jsx` on 20 Sep 2026, where six refusals shared this shape and differed
 *  only in copy.
 *
 *  The six: an instruction that would act · an amount over a ceiling · in the domain but outside this
 *  product · a sentence it could not follow · a name that matches two clients · a figure it cannot
 *  stand behind. */
export function RefusalTurn(props: RefusalTurnProps): JSX.Element;
