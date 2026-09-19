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

Object.assign(window, { FUND_EMPTY, FundResults, FUND_ASK, FUND_LIST, FUND_QUERY, FUND_COLUMNS, fundRows, heldLine, FundDetail, OVERLAP_FUNDS, OVERLAP_PROPERTIES, OVERLAP_CELLS, OVERLAP_FOOTNOTE });
