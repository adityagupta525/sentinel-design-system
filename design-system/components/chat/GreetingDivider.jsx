import React from 'react';
/* Home greeting: dashed hairlines either side of a 27px Darker Grotesque line.
   v12 · THE NAME WRAPS. It was `white-space: nowrap`, which is a promise the line cannot keep in an
   Indian wealth product: measured at 375, "Good afternoon, Ramasubramanian" runs 349 against a 343
   content box and "…Lakshminarayanan" runs 351, so both sit 3–4pt into the gutter on each side.
   Wrapping to a second line is the answer rather than truncation — a tool whose whole job is to treat
   a client as a person does not cut a person's name in half. `text-wrap: balance` so the two lines
   split evenly instead of orphaning a word.
   Names that already fit are untouched: measured either side, "Ashish" and "Priya" render identically,
   and so do all 75 pages in the repository.
   KNOWN, and not solved by this: the hairlines are `flex: 1`, so a long name squeezes them to zero and
   the divider stops looking like one — 47pt of rule at "Ashish", 12pt at "Vishwanathan", 0 beyond. A
   max-width on the text would reserve them; it would also wrap shorter names, so it is the owner's
   call and not taken here. */
export function GreetingDivider({ children }) {
  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-8)', padding: '8px 16px', boxSizing: 'border-box' }}>
      <div style={{ height: 0, flex: 1, borderTop: '1px dashed var(--color-line)' }} />
      <p style={{ margin: 0, textWrap: 'balance', textAlign: 'center', font: 'var(--type-greeting-font)', color: 'var(--color-bronze-deep)' }}>{children}</p>
      <div style={{ height: 0, flex: 1, borderTop: '1px dashed var(--color-line)' }} />
    </div>
  );
}
