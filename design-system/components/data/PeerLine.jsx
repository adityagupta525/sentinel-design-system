import React from 'react';
/* A FUND'S FIGURE AGAINST ITS CATEGORY'S, ON ONE LINE — the device that turns a number into a
   judgement.

   Kabir's teardown of thirty Indian products found one thing every explorer that survived contact with
   users does, and the rejected build did not: "the best retail explorers give every fund a peer context
   ON ARRIVAL — INDmoney ranks a fund inside its SEBI category; Groww's fund page has Returns and
   Rankings against the category average; Kuvera opens Comparison pre-filled with four category peers."
   A fund shown alone is a number. A fund shown beside its category is a judgement. Two or three bare
   cards with 1Y/3Y/5Y on them is exactly what the stakeholders called numbers thrown at you.

   THIS IS THE ROW DEVICE. `Dumbbell` is the page device — three marks on one axis, for a fund page that
   has room. `PeerLine` is one line of type under a fund's name in a list, a table row or a result card,
   where a chart would not fit and an advisor still has to be able to say why this fund is on screen.
   Both read the same two numbers, so they cannot disagree.

   COLOUR NEVER ENCODES IT (rule 1). Ahead and behind are told by the WORD — "2.8 points ahead", "1.1
   points behind" — in the same ink, never by green and red. The status family is reserved and may not
   be used without a word beside it; here the word is doing all the work, so the colour is not needed
   and is not taken. An advisor reads this line aloud to a client, and "ahead" survives that reading
   where a colour does not.

   THE GAP IS COMPUTED, NEVER PASSED. A caller handing in its own "2.8 points ahead" is a caller that
   can disagree with the two figures printed beside it — the defect this whole product exists to avoid
   (F-62 was a benchmark reading 42.6% off a curve nobody constrained). One decimal, because the ramp
   prints returns to one, and tabular figures because these change.

   RANK IS OPTIONAL AND IS NEVER INVENTED. "4th of 31 in Flexi cap" needs the whole category, not the
   ten rows on a shelf; pass `rank` only where a real denominator exists, and leave it out otherwise.
   The line is still a judgement without it. */

const ORD = (n) => {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
};
const NUM = { fontVariantNumeric: 'tabular-nums' };

export function PeerLine({ value, peer, period, peerLabel, rank = null, unit = '%' }) {
  /* THE GAP IS TAKEN OFF THE PRINTED FIGURES, NOT THE RAW ONES. Subtracting first and rounding after
     lets the line disagree with the two numbers beside it: 6.650 against 6.649 is a raw gap of 0.001,
     which reads "level", while the figures print 6.7% and 6.6% — a reader does the subtraction in
     their head and gets 0.1. Rounding both ends first makes that impossible by construction. */
  const shown = (n) => Math.round(n * 10) / 10;
  const a = shown(value), b = shown(peer);
  const gap = shown(a - b);
  /* Level is a real answer, not a rounding artefact: at one decimal "0.0 points ahead" is a sentence
     no advisor would say aloud. */
  const verdict = gap === 0
    ? 'level with its category'
    : `${Math.abs(gap).toFixed(1)} points ${gap > 0 ? 'ahead' : 'behind'}`;
  return (
    <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
      <span style={{ ...NUM, color: 'var(--color-ink)', font: 'var(--type-meta-font)' }}>{a.toFixed(1)}{unit}</span>
      {' over '}{period}
      {' · '}{peerLabel}{' '}
      <span style={NUM}>{b.toFixed(1)}{unit}</span>
      {' · '}
      <span style={{ color: 'var(--color-ink)' }}>{verdict}</span>
      {rank && <>{' · '}<span style={{ color: 'var(--color-ink)' }}><span style={NUM}>{ORD(rank.n)}</span> of <span style={NUM}>{rank.of}</span></span></>}
    </p>
  );
}
