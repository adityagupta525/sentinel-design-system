import React from 'react';
import { Composer } from './Composer.jsx';
import { MoneyComposer } from './MoneyComposer.jsx';
/* V13 · THE COMPOSER A QUESTION ASKS FOR. Promoted out of `screens/journey-a/rail.jsx` on
   20 Sep 2026: which composer a step wants is a property of the STEP, not of the page, and three
   journeys were each deciding it again.

   Rule 3 is that the composer is always present. This is the other half of it: on a money question
   the composer is the MoneyComposer, so an advisor can always type instead of tapping and what they
   type is read as money. A text composer under "how much is he putting in?" accepts "two and a half
   lakh" and hands back a string nothing can add up.

   MoneyComposer owns its own value and returns a formatted rupee string, so it takes only `onSend` —
   passing it value/onChange would be inventing a contract it does not have. */
export function StepComposer({ money = false, placeholder, moneyPlaceholder, onSend, onAttach }) {
  const [value, setValue] = React.useState('');
  const send = () => { const t = value.trim(); if (!t) return; setValue(''); if (onSend) onSend(t); };
  return money
    ? <MoneyComposer onSend={(v) => onSend && onSend(v)} placeholder={moneyPlaceholder || 'or type the amount'} />
    : <Composer value={value} onChange={setValue} placeholder={placeholder || 'or type your answer'}
        onSend={send} onAttach={onAttach} />;
}
