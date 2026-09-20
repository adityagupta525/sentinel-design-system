import React from 'react';
import { SentinelTurn } from './SentinelTurn.jsx';
import { ChipRow } from '../actions/ChipRow.jsx';
import { AnswerChip } from '../actions/AnswerChip.jsx';
/* V13 · WHAT SENTINEL SAYS WHEN IT WILL NOT DO SOMETHING. Promoted out of
   `screens/thread/refusals.jsx` on 20 Sep 2026, where the shape was already the product's and the
   copy was the only thing that changed between six of them.

   THE SHAPE IS THE RULE, and it is why this is a component rather than a `SentinelTurn` each caller
   composes. A refusal in this product has two parts and always both: **what it will not do, and what
   it can do instead, by name.** A refusal with no chips is a dead end, and a dead end is the one
   thing an advisor cannot work around — so the chips are the half that makes the refusal usable, and
   they are named routes, never "try again".

   `continued` because a refusal usually follows something Sentinel already signed; one ✦ Sentinel per
   turn (the ruling of 18 Sep). */
export function RefusalTurn({ body, chips = [], onChip, continued = false, enter = false }) {
  return (
    <SentinelTurn continued={continued} enter={enter} say={body}
      chips={chips.length > 0 && (
        <ChipRow>
          {chips.map((c) => <AnswerChip key={c} label={c} onClick={() => onChip && onChip(c)} />)}
        </ChipRow>
      )} />
  );
}
