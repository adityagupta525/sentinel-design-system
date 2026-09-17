import React from 'react';
/* Persistent under-composer disclosure — visually locked, de-emphasised grey.
   One line, deliberately: it repeats on all 27 artboards, so it is the heaviest repeated element in
   the product. [PLACEHOLDER — compliance to supply] — this wording is a stand-in until compliance
   supplies the final line; whatever they supply must still fit one line at 11px inside 343px. */
export function StandingDisclosure({ text = 'Sentinel assists an advisor · not investment advice' }) {
  return <p style={{ margin: 0, padding: '0 8px', textAlign: 'center', fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-regular)', fontSize: 'var(--text-11)', lineHeight: 'var(--leading-15)', color: 'var(--color-data-deemph)' }}>{text}</p>;
}
