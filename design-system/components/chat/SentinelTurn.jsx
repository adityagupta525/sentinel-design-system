import React from 'react';
import { SentinelBlock } from './SentinelBlock.jsx';
import { SentinelText } from './SentinelText.jsx';
import { SentinelThinking } from './SentinelThinking.jsx';
import { Provenance } from '../text/Provenance.jsx';
import { DarkButton } from '../actions/DarkButton.jsx';
/* THE TURN — one thing Sentinel said, and everything that belongs to it.
   Thirteen turns were hand-built across nine screen modules, and between their parts sat 35 spacer
   divs. Measured 20 Sep 2026, and the vote is not a preference — it is a GRAMMAR the screens were
   already following without anyone writing it down:

     a sentence after a sentence          --space-10   5 of 6   (the 6th, proposal.jsx:141, is 8)
     the body after the lead sentence     --space-12   7 of 8   (the 8th, answer.jsx:127, is 8)
     a sentence after the body            --space-12   5 of 5   unanimous
     the chips                            --space-12   7 of 7   unanimous
     provenance                           --space-10   InfoCard.jsx:119 and OverlapView.jsx:201

   Provenance is the one the screens split on — rail.jsx:156 at 10, answer.jsx:130 at 8 — so the tie
   is broken by the SYSTEM's own two placements, both 10, rather than by a preference.

   `--stack` (12px) between the turn's own parts — block, chips, actions — is what all eight hand-built
   turn wrappers already use. Seven other turns wrapped their chips INSIDE the block at --space-12
   instead; both spell 12px, so the two idioms draw the same picture and only one of them is kept here.

   THIS COMPONENT ADDS NO VISUAL DECISION. Every gap above is one the repository was already making.
   What it adds is that the gap is now decided ONCE — and that a fourteenth turn cannot quietly
   introduce a fifth value for "the next sentence". */
const GAP_SENTENCE = 'var(--space-10)';   /* text after text */
const GAP_PART = 'var(--space-12)';       /* anything after something that is not text */
const GAP_PROVENANCE = 'var(--space-10)';

/* A spacer div, not a margin on the child: SentinelText is a <p> with margin 0 and the parts are
   arbitrary nodes, so the gap has to be owned by the turn rather than asked of the child. That is
   what all 35 hand-written spacers did; this is the same div, written once — see `place` below. */

export function SentinelTurn({
  say, weight = 'Medium', body, bodyFirst = false, then: thenText, tail,
  provenance, chips, cta, actions, thinking, continued = false, enter = false, label,
}) {
  const lines = say == null ? [] : (Array.isArray(say) ? say : [say]).filter(Boolean);
  /* Every line after the first is set Regular. Six of the six multi-line turns already did this —
     the first sentence carries the statement and the rest carry the reasoning, which is the weight
     pair SentinelText was built around. */
  const sentences = lines.map((l, i) => (
    <SentinelText key={i} text={l} weight={i === 0 ? weight : 'Regular'} />
  ));
  /* `first` tracks whether anything has been laid down yet, because the FIRST thing in a block takes
     no gap at all — 13 of 13 hand-built turns start flush against the "✦ Sentinel" header. */
  let first = true;
  /* EVERY part gets a <div>, including the first — which takes no gap. The hand-built turns wrapped
     their first line in a bare <div> too, and dropping it for a Fragment changed the scroll subtree
     enough to land `scrollTop` 1px short of the bottom on screens/journey-a/risk-profile. Nothing in
     the layout moved — every child height measured identical — but the shot did, and a component
     that replaces hand-written markup has to produce the same tree, not merely the same box. */
  const place = (node, gap, key) => {
    if (node == null || node === false) return null;
    const el = <div key={key} style={first ? undefined : { marginTop: gap }}>{node}</div>;
    first = false;
    return el;
  };
  const stack = [];
  if (bodyFirst) {
    stack.push(place(body, GAP_PART, 'body'));
    sentences.forEach((s, i) => stack.push(place(s, GAP_PART, `say${i}`)));
  } else {
    sentences.forEach((s, i) => stack.push(place(s, i === 0 ? GAP_PART : GAP_SENTENCE, `say${i}`)));
    stack.push(place(body, GAP_PART, 'body'));
  }
  stack.push(place(thenText ? <SentinelText text={thenText} weight="Regular" /> : null, GAP_PART, 'then'));
  stack.push(place(tail, GAP_PART, 'tail'));
  stack.push(place(provenance ? <Provenance text={provenance} /> : null, GAP_PROVENANCE, 'prov'));

  /* A turn that is still arriving is a SentinelThinking and NOTHING else — no chips, no actions.
     Offering an answer's chips beside the dots would let an advisor answer a question Sentinel has
     not finished asking. The one hand-built thinking turn — the rail's, `{!thinking && step.chips}` —
     already did this by hand; it is a rule here so the fourteenth turn cannot forget. */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)', animation: enter ? 'ds-rise var(--dur-enter) var(--ease) both' : 'none' }}>
      {thinking ? <SentinelThinking verb={typeof thinking === 'string' ? thinking : undefined} /> : (
        <React.Fragment>
          <SentinelBlock continued={continued} label={label}>{stack}</SentinelBlock>
          {/* THE BLOCK WRAPPER IS LOAD-BEARING, and a render caught it. A bare `AnswerChip` handed
              straight to this flex column becomes a flex item and `align-items: stretch` pulls the
              pill to the full 343 — measured on screens/journey-b/05-decide, where the partial-
              execution turn passes ONE chip rather than a ChipRow. Every hand-built turn wrapped its
              chips in a plain <div>, which is block layout, which is intrinsic width. That div is
              kept here so any caller gets the old behaviour, ChipRow or single chip alike. */}
          {chips ? <div>{chips}</div> : null}
          {/* AT MOST ONE DARK CTA PER TURN, and the type is how that survives (B-5, 20 Sep 2026).
              Three hand-built action rows — `AnswerActions`, `MovesActions`, `RiskResult`'s tail —
              each paired a ChipRow with a `<DarkButton full arrow>`, and three copies can only agree
              where a type can enforce. Two dark buttons in a turn is two primary actions and the
              advisor cannot tell which one the turn was for. `actions` stays a free slot because the
              artifact and `MessageActions` go there; the CTA does not. */}
          {cta ? <div><DarkButton full arrow={cta.arrow !== false} label={cta.label} onClick={cta.onClick} /></div> : null}
          {actions ? <div>{actions}</div> : null}
        </React.Fragment>
      )}
    </div>
  );
}
