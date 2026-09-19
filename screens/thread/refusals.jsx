/* The six buckets, and the answer to "what can I do here?" — shared by refusals.html and any prototype.

   THE RULE THIS WHOLE SCREEN IS BUILT ON, and the research backs it: a refusal that only says no is a
   dead end, and this market rates a product on whether something answers. `docs/RESEARCH.md` — the
   highest-rated advisor app in the sample is praised for a named human who answers, and its 1★ reviews
   are the same axis inverted ("support tickets open for months"). So EVERY refusal here names what
   Sentinel CAN do in the same breath, and offers the nearest real thing as a chip.

   `book.jsx` is loaded before this file and provides CLIENTS and the limits. */
const REF_DS = window.SentinelDesignSystem_0682a2;

/* Bucket 2 — out of bounds, hold position. The archive's own router builds this sentence
   (router.ts:90): the amount, the ceiling, whose mandate, and then "I have not applied it." The last
   clause is the one that matters: Sentinel states that it did NOT act. */
const amit = CLIENTS.find((c) => c.id === 'amit');
const BUCKET_2 = {
  ask: 'Put ₹60,00,000 into the proposal',
  eyebrow: 'That does not fit',
  body: `₹60,00,000 is above the ₹25 L ceiling on ${amit.name}'s mandate. I have not applied it.`,
  chips: ['Use ₹25 L', 'Raise the mandate first'],
};

/* Bucket 4 — not understood. Failure disclosure, then the four things it can actually do. The fourth
   chip appears only after a SECOND failure: offering the full list on the first miss reads as a lecture,
   and the archive gates it the same way (`failCount.current >= 2`). */
const BUCKET_4 = {
  ask: 'sharma ka wala thing',
  body: 'I did not follow that. I can look up a client, profile their risk, explain a drift, or search funds — which is closest?',
  chips: ['Look up a client', 'Explain a drift', 'Search funds'],
  repeatChip: 'Show me what I can ask',
};

/* Bucket 5 — in-domain, out of what this product does. The archive DECLARED this bucket
   (router.ts:36) and never returned it, so the copy is written here for the first time. Three rules
   went into it: name the thing asked for, say plainly that Sentinel does not do it, and hand back the
   nearest thing it does — never "I can't help with that". */
const BUCKET_5 = {
  ask: 'File Meera’s ITR for this year',
  body: 'I do not file returns — I have no access to her tax filings and no way to check one. What I can do is give you the numbers a return needs: her realised gains for the year, fund by fund, with the dates.',
  chips: ['Show her realised gains', 'What did she sell this year?'],
};

/* Bucket 6 — an instruction that would ACT. Never on a typed sentence alone: Sentinel previews exactly
   what it would do and asks for a confirm, which is the same Suggest → Confirm → Execute path the CTA
   takes. The preview is the instruction read back, so an advisor can see a misread before it runs. */
const BUCKET_6 = {
  ask: 'Sell all of Sharma’s Quant Small Cap',
  body: 'I will not act on a typed instruction on its own. Here is exactly what that would do — review it, then confirm.',
  preview: 'Redeem the full ₹4,41,130 holding in Quant Small Cap from folio 9142/28, at the next applicable NAV.',
  chip: 'Review and confirm',
};

/* A name with no intent. Not a refusal — a question back, with the three things this client actually has
   open, drawn from her own record rather than a generic menu. */
const meera = CLIENTS.find((c) => c.id === 'meera');
const DISAMBIGUATE = {
  ask: 'Meera',
  body: `${meera.name} — what about her?`,
  chips: ['Start her risk profile', 'What does she hold?', 'Her SIP on the 5th'],
};

/* THE STANDING ANSWER. "What can I do here?" had no home: an advisor who has never used the product has
   no way to ask it, and the six router buckets are invisible. It is a TURN in the thread, not a settings
   page — reached from a repeated miss, from the empty composer, and from the drawer. Rows rather than
   chips because every one of them runs past a line (FollowUpRow's own rule). */
const CAPABILITIES = [
  { question: "Profile a client's risk", note: 'Twelve short questions, mostly one tap — ends in a number you can build against' },
  { question: 'Build a proposal from an amount', note: 'You confirm every constraint before it is costed' },
  { question: 'Explain why a portfolio drifted', note: 'What moved the mix, what it would cost to fix, and what leaves under your ARN' },
  { question: 'Search funds on your shelf', note: 'By category and plan — and which of your clients already hold them' },
  { question: 'Read a statement you attach', note: 'Holdings pulled out and checked against the mandate on file' },
];
const CAPABILITIES_CLOSER = 'Anything outside these I will say I cannot do, rather than guess at it.';

function RefusalTurn({ body, chips = [], onChip, continued = false }) {
  return (
    <REF_DS.SentinelBlock continued={continued}>
      <REF_DS.SentinelText text={body} />
      {chips.length > 0 && (
        <div style={{ marginTop: 'var(--space-12)' }}>
          <REF_DS.ChipRow>
            {chips.map((c) => <REF_DS.AnswerChip key={c} label={c} onClick={() => onChip && onChip(c)} />)}
          </REF_DS.ChipRow>
        </div>
      )}
    </REF_DS.SentinelBlock>
  );
}

function CapabilitiesTurn({ onAsk }) {
  return (
    <REF_DS.SentinelBlock>
      <REF_DS.SentinelText text="Here is everything I can do." />
      <div style={{ marginTop: 'var(--space-12)' }}>
        <REF_DS.FollowUpRow items={CAPABILITIES} label="" onAsk={onAsk} />
      </div>
      <div style={{ marginTop: 'var(--space-12)' }}>
        <REF_DS.SentinelText weight="Regular" text={CAPABILITIES_CLOSER} />
      </div>
    </REF_DS.SentinelBlock>
  );
}

Object.assign(window, { BUCKET_2, BUCKET_4, BUCKET_5, BUCKET_6, DISAMBIGUATE, CAPABILITIES, CAPABILITIES_CLOSER, RefusalTurn, CapabilitiesTurn });
