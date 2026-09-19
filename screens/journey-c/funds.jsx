/* Journey C — the fund surfaces. The third router bucket, and the one that was entirely undesigned.

   THE HONEST CONSTRAINT, AND IT SHAPES EVERY SCREEN HERE. The archive says it in one line
   (docs/screens-source/src/screens/FundExplorer.tsx:42): "Fund names and AMCs only. No performance, TER
   or AUM — those are locked." So this journey knows a fund's name, its house, its category, whether it
   is on the compliance shelf, and WHICH OF THE ADVISOR'S CLIENTS HOLD IT — and it does not know how it
   performed. Three components were built for exactly that and have waited for a screen: InfoCard's
   `locked`, RangePills' `locked`, and OverlapView's null cell, which renders an em dash rather than a 0
   because "a zero and a missing value are different facts, and printing 0% states something untrue
   about the client's money".

   No top-level destructuring: every .jsx a page loads compiles into ONE scope. `book.jsx` is loaded
   before this file and provides FUNDS, CLIENTS and the limits. */
const FUNDS_DS = window.SentinelDesignSystem_0682a2;

const FUND_ASK = 'Show me flexi cap funds on my shelf';

/* THE LIST IS DERIVED FROM THE BOOK, not kept here. `screens/data/book.jsx` is the one place a fund, a
   client or a holding is written down; this file only decides how the fund surfaces present them. The
   reverse lookup — which of the advisor's clients hold a fund — is COMPUTED from their holdings and
   their SIPs rather than typed, so it cannot drift from the portfolios the other journeys render. */
const holdersOf = (fundId) => CLIENTS.filter((c) =>
  (c.holdings || []).some((h) => h.fundId === fundId) || (c.sips || []).some((sp) => sp.fundId === fundId)).map((c) => c.name);
const FUND_LIST = FUNDS.map((f) => ({
  id: f.id, name: f.name, amc: f.amc, cat: f.category, bucket: f.bucket,
  onShelf: f.onShelf, shelfNote: f.shelfNote, riskometer: f.riskometer, exitLoad: f.exitLoad, plan: f.plan,
  heldBy: holdersOf(f.id),
}));

/* The parsed query, as REMOVABLE chips. An advisor drops what Sentinel read wrong rather than retyping
   the sentence — the archive's own pattern (FundExplorer.tsx:55) and the one thing that makes a parsed
   query defensible: it is visible, and it is editable. */
const FUND_QUERY = [{ label: 'Flexi cap', on: true }, { label: 'Equity', on: true }, { label: 'Direct plan', on: true }];

/* WHO ALREADY HOLDS IT — the reverse lookup, and the most useful thing this journey actually knows.
   An advisor choosing a fund needs to know it is already in three of their clients' portfolios. */
const heldLine = (f) => (f.heldBy.length === 0 ? 'None of your clients' : f.heldBy.join(' · '));

const FUND_COLUMNS = [
  { key: 'name', label: 'Fund', kind: 'text', sticky: true, sortable: true, width: 148 },
  { key: 'cat', label: 'Category', kind: 'text' },
  { key: 'shelf', label: 'Shelf', kind: 'badge' },
  { key: 'held', label: 'Held by', kind: 'text' },
];
const fundRows = (funds) => funds.map((f) => ({
  id: f.id,
  name: f.name,
  cat: f.cat,
  shelf: <FUNDS_DS.Badge tone={f.onShelf ? 'ok' : 'over'}>{f.onShelf ? 'On shelf' : 'Off shelf'}</FUNDS_DS.Badge>,
  held: heldLine(f),
}));

/* The fund's own page, expanded IN PLACE inside the table row — DataTable's own rule: "the row becomes
   expandable in place — never a modal". The plan had called this a bottom sheet; the system had already
   ruled otherwise, and the row detail is also where an advisor is looking. */
function FundDetail({ fund, onExplain }) {
  return (
    <FUNDS_DS.InfoCard
      name={fund.name} meta={`${fund.amc} · ${fund.cat}`}
      shelf={fund.onShelf ? 'on-shelf' : 'not-on-shelf'}
      locked lockReason="No confirmed source for this fund's performance yet, so nothing is drawn. Everything above comes from the scheme record."
      provenance="As of 30 Sep · from the scheme record and your own book"
      stats={[
        { label: 'Held by your clients', value: String(fund.heldBy.length) },
        { label: 'Exit load', value: fund.exitLoad },
      ]}
      onExplain={onExplain} />
  );
}

/* Two flexi caps, and the question an advisor is actually asked: are these the same fund? THIS PRODUCT
   CANNOT ANSWER IT YET, and OverlapView was built to say so — a null cell is an em dash with a footnote,
   never a 0. The screen shows the real shape of the answer and names what is missing to fill it. */
const OVERLAP_FUNDS = [
  { id: 'ppfas', name: 'Parag Parikh Flexi Cap', inComparison: true },
  { id: 'hdfc', name: 'HDFC Flexi Cap', inComparison: true },
];
const OVERLAP_PROPERTIES = [
  { id: 'top10', label: 'top 10 holdings', active: true },
  { id: 'all-holdings', label: 'all holdings', active: false },
  { id: 'sector', label: 'sector', active: false },
];
const OVERLAP_CELLS = [{ a: 'ppfas', b: 'hdfc', pct: null }];
const OVERLAP_FOOTNOTE = 'No holdings feed for either fund yet, so the overlap cannot be computed — an em dash, not a zero.';

const FUND_EMPTY = { title: 'Nothing matches every filter.', body: 'Drop one and I will widen the search.' };
/* The shortlist as an artifact — lifted out of funds.html when the end-to-end prototype needed it, so
   the two render ONE table rather than two that can drift. `overflow="scroll"` here is deliberate and is
   the opposite call from the ledger's: a fund row carries five facts an advisor compares sideways, and
   the sticky Fund column is what keeps that readable. The ledger has three columns and needs no scroller. */
function FundResults({ funds = FUND_LIST, openRow = null, state = 'expanded', onExplain }) {
  return (
    <FUNDS_DS.ArtifactCard state={state} eyebrow="Fund search · your shelf" title={`${funds.length} funds match`}
      provenance="As of 30 Sep · from the scheme record and your own book" onToggle={() => {}} onMenu={() => {}}>
      <FUNDS_DS.DataTable columns={FUND_COLUMNS} rows={fundRows(funds)} emptyState={FUND_EMPTY} overflow="scroll" defaultOpen={openRow}
        expandable={(row) => <FundDetail fund={FUND_LIST.find((x) => x.id === row.id)} onExplain={onExplain || (() => {})} />} />
    </FUNDS_DS.ArtifactCard>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────────────────────────
   THE REFINEMENT PARSER — what makes this screen chat-LED rather than a filter panel with a composer
   parked under it. Until now the only way to change the query was to tap ✕ on a chip, which is a
   filter UI; an advisor mid-thought says "only direct plan" or "drop the shelf" and expects the
   shortlist to move.

   It is patterns, like the router, and the screen says so. Three shapes cover what an advisor actually
   types after a first search: ADD a category, DROP one, or turn the shelf filter on or off. Anything
   else is not guessed at — it comes back as bucket 4's sentence, because a search that quietly ignores
   half of what you said is worse than one that says it did not follow.

   Every category it can add is a real `category` on the shelf, read from FUNDS rather than listed here,
   so a fund arriving in the book is searchable the same day. */
const REFINE_CATEGORIES = [...new Set(FUNDS.map((f) => f.category))];
const REFINE_BUCKETS = [...new Set(FUNDS.map((f) => f.bucket))];
const REFINE_TERMS = [...REFINE_CATEGORIES, ...REFINE_BUCKETS, 'Direct plan', 'Regular plan'];

/* Returns { kind, ... } — never a mutated query, so a caller decides what to do with a refusal. */
function refine(text, query) {
  const t = (text || '').trim().toLowerCase();
  if (!t) return { kind: 'miss' };
  const hit = REFINE_TERMS.find((x) => t.includes(x.toLowerCase()));
  const shelfWord = /\bshelf\b|\bon my shelf\b|\bapproved\b/.test(t);
  const dropping = /\b(drop|remove|without|not|no|except|forget)\b/.test(t);
  const onlying = /\b(only|just)\b/.test(t);

  if (shelfWord && dropping) return { kind: 'shelf', on: false, said: 'off the shelf filter' };
  if (shelfWord) return { kind: 'shelf', on: true, said: 'the shelf filter' };
  if (!hit) return { kind: 'miss' };

  if (dropping) {
    if (!query.some((q) => q.on && q.label.toLowerCase() === hit.toLowerCase())) return { kind: 'absent', term: hit };
    return { kind: 'drop', term: hit };
  }
  /* "only X" replaces the category filters rather than adding to them — an advisor saying "only flexi
     cap" after asking for equity means one thing, and adding it would leave both and return nothing. */
  if (onlying) return { kind: 'only', term: hit };
  if (query.some((q) => q.on && q.label.toLowerCase() === hit.toLowerCase())) return { kind: 'already', term: hit };
  return { kind: 'add', term: hit };
}

/* The query after a refinement. Pure, so the same input always gives the same pills. */
function applyRefine(r, query) {
  if (r.kind === 'drop') return query.map((q) => (q.label.toLowerCase() === r.term.toLowerCase() ? { ...q, on: false } : q));
  if (r.kind === 'add') {
    return query.some((q) => q.label.toLowerCase() === r.term.toLowerCase())
      ? query.map((q) => (q.label.toLowerCase() === r.term.toLowerCase() ? { ...q, on: true } : q))
      : [...query, { label: r.term, on: true }];
  }
  if (r.kind === 'only') {
    const off = query.map((q) => (/plan$/i.test(q.label) ? q : { ...q, on: false }));
    return off.some((q) => q.label.toLowerCase() === r.term.toLowerCase())
      ? off.map((q) => (q.label.toLowerCase() === r.term.toLowerCase() ? { ...q, on: true } : q))
      : [...off, { label: r.term, on: true }];
  }
  return query;
}

/* What Sentinel says back. The refusal names the three things it can do to a query — the same shape
   every refusal in this product keeps — and never silently leaves the shortlist where it was. */
const REFINE_MISS = {
  body: 'I did not follow that as a change to the search. I can add a category, drop one, or turn the shelf filter on and off.',
  chips: ['Only direct plan', 'Drop the shelf filter', 'Add small cap'],
};
const refineSaid = (r) => ({
  add: `Added ${r.term}.`,
  drop: `Dropped ${r.term}.`,
  only: `Only ${r.term} now — I took the other categories off.`,
  already: `${r.term} was already on.`,
  absent: `${r.term} was not on, so there was nothing to drop.`,
  shelf: r.on ? 'Filtering to your shelf.' : 'Showing funds off your shelf too.',
}[r.kind]);

/* The shortlist for a query — one function, so the count beside the chips and the rows in the table
   can never disagree. That pair is the whole reason an advisor trusts the chips. */
const fundsFor = (query, shelf) => FUND_LIST.filter((f) => {
  if (shelf && !f.onShelf) return false;
  const on = query.filter((q) => q.on).map((q) => q.label.toLowerCase());
  return on.every((label) => {
    if (label === 'direct plan') return f.plan === 'direct';
    if (label === 'regular plan') return f.plan === 'regular';
    return f.cat.toLowerCase() === label || f.bucket.toLowerCase() === label;
  });
});

Object.assign(window, { REFINE_TERMS, refine, applyRefine, REFINE_MISS, refineSaid, fundsFor, FUND_EMPTY, FundResults, FUND_ASK, FUND_LIST, FUND_QUERY, FUND_COLUMNS, fundRows, heldLine, FundDetail, OVERLAP_FUNDS, OVERLAP_PROPERTIES, OVERLAP_CELLS, OVERLAP_FOOTNOTE });
