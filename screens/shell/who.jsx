/* THE WHO STEP — the first question of six journeys, and the one the PRD does not have.

   Every journey in `Fund_Discovery_PRD.pdf` starts with a fund. The owner's point is the opposite and
   it is right: an advisor who types "risk profiling" has named the WORK and not the CLIENT, and the
   product cannot start. Until now it landed in bucket 4 — "I did not follow that" — which is honest and
   useless, because it did follow: it just had half the sentence.

   TWO RULES DECIDE THE WHOLE COMPONENT.

   1. NEVER ASK FOR SOMETHING THE ADVISOR HAS ALREADY SAID. "Start Meera's risk profile" names the
      client, so this step does not appear at all. It appears only when the work is named and the
      client is not. An advisor who is made to pick Meera from a list after typing her name learns the
      product is not listening.
   2. SELECTION AND TYPING ARE ONE FLOW, NOT TWO. `ClientChip`'s contract has said this since v9:
      picking from the list and typing a name both resolve to the same bound state, and the composer
      stays live throughout. The list is for browsing a 512-client book; typing is for the advisor who
      already knows the name. Neither is the "real" path.

   `book.jsx` is loaded before this file. */
const WHO_DS = window.SentinelDesignSystem_0682a2;

/* Recency is the order, because an advisor works a handful of clients in any week and the one they
   want is nearly always one of the last few. The full book is behind the search, not in the list —
   twelve rows of a 512-client book is a scroll, not a choice. */
const WHO_RECENT = ['sharma', 'meera', 'amit', 'sunita'];
const WHO_CAP = 4;

/* What the step is FOR, so the question names the work rather than asking a bare "which client?".
   The advisor asked for something; the question should remember what. */
const WHO_ASKS = {
  risk: 'Whose risk profile?',
  propose: 'Who is the proposal for?',
  rebal: 'Whose portfolio are we rebalancing?',
  review: 'Whose portfolio are we reviewing?',
  drift: 'Whose drift?',
  ledger: 'Whose instructions?',
};
const whoAsk = (journey) => WHO_ASKS[journey] || 'Which client?';

/* The advisor's own words back, so the turn reads as a continuation rather than a form. */
const WHO_LEAD = (journey, total) =>
  `${whoAsk(journey)} Here are the four you worked on most recently — or search the other ${total - WHO_CAP}.`;

/* THE SUBTITLE IS ONE FACT, NOT A FLAG. The first cut put `flags[0]` here and Amit's is "KYC in
   process — nothing can be executed until it clears": 292px of sentence in a 243px row, caught by the
   truncation gate. A row in a picker answers "is this the right person", and the shortest true answer
   is what they hold, or why they hold nothing. The full flag belongs on the journey that is blocked
   by it, where there is room to say what to do about it. */
const whoRow = (c) => ({
  id: c.id,
  title: c.name,
  /* THE FACE, WITH THE AGE THE BOOK HAS (23 Sep 2026). `ListRow` derives one from the title on its
     own, and that is right for every caller that has only a name — but this screen is built from
     CLIENTS, where every client carries an `age`, and a picker showing a 38-year-old as grey when the
     record says otherwise is a wrong answer it had the data to avoid. */
  leadingContent: <WHO_DS.ClientAvatar name={c.name} age={c.age} face={c.face} size={32} />,
  subtitle: c.portfolio && c.portfolio.valueRs
    ? `${inr(c.portfolio.valueRs)} · ${c.portfolio.funds} funds`
    : c.kyc && c.kyc.status !== 'Valid' ? `KYC ${c.kyc.status.toLowerCase()}`
    : 'Nothing on file yet',
});

/* THE PICKER. A SearchField above a List, filtered by this component — `List` has no `searchable` prop
   and never did, whatever SearchField's doc used to claim. `select` rows, because this is a choice and
   not navigation: a chevron would promise a page. */
function WhoPicker({ journey, clients = CLIENTS, onPick, onEvent }) {
  const [q, setQ] = React.useState('');
  const term = q.trim().toLowerCase();
  const recent = WHO_RECENT.map((id) => clients.find((c) => c.id === id)).filter(Boolean);
  /* THE POOL, not the filter — that is List's now. Typing widens the pool from the four most recent
     to the whole book, which is a decision about this screen and not about how a list searches. */
  const pool = term ? clients : recent.slice(0, WHO_CAP);
  const total = ADVISOR.clients || clients.length;

  return (
    <WHO_DS.SentinelBlock>
      <WHO_DS.SentinelText text={WHO_LEAD(journey, total)} />
      {/* THE FIELD IS THE LIST'S NOW (20 Sep 2026). This held the query, filtered by hand and drew the
          SearchField itself — and `SearchField`'s own header had said since v9 that it is "the search
          field a `searchable` List renders". `List.search` is that prop; the pool below is still ours,
          because "the four most recent" is this screen's decision and not the list's. */}
      <div style={{ marginTop: 'var(--space-12)' }}>
        <WHO_DS.List
          items={pool.map((c) => ({ ...whoRow(c), onPress: () => { if (onEvent) onEvent(`Picked ${c.name}`, 'the chip binds in the composer; the journey resumes'); onPick && onPick(c); } }))}
          rowProps={{ variant: 'select', leading: 'avatar' }}
          search={{ value: q, onChange: setQ, onClear: () => setQ(''), placeholder: `Search ${total} clients`,
            emptyState: { title: `No client called “${q}”.`, body: 'Check the spelling, or clear the search to see the four most recent.' } }}
          emptyState={{ title: 'Nobody on your book yet.', body: 'Add a client and every journey here works on them.' }} />
      </div>
    </WHO_DS.SentinelBlock>
  );
}

/* THE EMPTY BOOK — the persona the audit found nobody had designed for. A new ARN holder has no recent
   clients, no saved work and no book, and every screen in this product assumes 512. This is the one
   place the first day is answered, and it does not pretend: it says what is missing and what to do. */
function WhoEmpty({ journey, onAdd }) {
  return (
    <WHO_DS.SentinelTurn
      say={[`${whoAsk(journey)} There is nobody on your book yet.`,
        'Add a client and everything here works on them — the risk profile, the proposal, the review. Nothing is lost by starting with one.']}
      chips={
        <WHO_DS.ChipRow>
          <WHO_DS.AnswerChip label="Add a client" variant="primary" onClick={onAdd || (() => {})} />
          <WHO_DS.AnswerChip label="Import from my ARN" onClick={() => {}} />
        </WHO_DS.ChipRow>
      } />
  );
}

/* The chip the composer carries once a client is bound. Removable, because binding the wrong client is
   the easiest mistake in the product and the hardest to notice. */
const WhoBound = ({ client, onClear }) =>
  client ? <WHO_DS.ClientChip name={client.name} onRemove={onClear} /> : null;

Object.assign(window, { WHO_RECENT, WHO_ASKS, whoAsk, WhoPicker, WhoEmpty, WhoBound });
