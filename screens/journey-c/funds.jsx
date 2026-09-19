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
/* THE FUND'S PAGE, now that there are figures for it. It was `locked` from the day it was built
   because nothing in this repository could source a return; `book.jsx`'s PERF fixture supplies them
   now and says in its own header that they are invented.

   THE RANGE CHANGES THE FIGURE, NOT A CHART. The anatomy is figure → chart → range → stats, and there
   is no chart here: a NAV series is a different dataset and we have point returns, not a curve. A
   drawn line would be the one thing this card was locked to avoid. The range still earns its place
   because 1Y and 3Y are different answers to the same question.

   THE PERIOD IS NAMED IN WORDS under the figure. "27.6%" over three years means a CAGR, and an advisor
   reading it to a client as "it made 27.6% last year" has been misled by a layout. SEBI's own
   presentation rule; `perfNote` writes it. */
/* ── THE FOUR VERBS ─────────────────────────────────────────────────────────────────────────────────
   The owner, 19 Sep: a fund card must let an advisor "compare kar paaye / rebalance me attach kar paaye
   / review ke liye bhej paaye / proposal me add kar paaye". Three of the four are HAND-OFFS to journeys
   that already exist — the Fund Explorer is not a silo, it is where D, E and F are entered from with a
   fund already chosen. Only Compare is new work.

   They are chips INSIDE the turn, under the fund card, because nothing is pinned above the composer
   (18 Sep) and a chip that outlives the turn that offered it makes the screen a toolbar.

   EVERY HAND-OFF GOES THROUGH THE SAME QUESTION FIRST: which client. A proposal, a rebalance and a
   review are all about somebody, and the fund explorer is the one surface in the product that does not
   already know who. `who.jsx` answers it and the prototype's WHO gate routes it, so the verbs do not
   each invent a client picker. Compare is the exception and it is the only one: a comparison is about
   two funds and nobody. */
const FUND_VERBS = [
  { id: 'compare',  label: 'Compare with…',        needsClient: false },
  { id: 'propose',  label: 'Add to a proposal',    needsClient: true,  journey: 'propose' },
  { id: 'rebal',    label: 'Attach to a rebalance', needsClient: true, journey: 'rebal' },
  { id: 'review',   label: 'Send for review',      needsClient: true,  journey: 'review' },
];

/* THE ROWS A COMPARISON IS ON, and every one of them comes from the book.
   Returns are NOT here: the gap to each fund's own benchmark is the thing a table cannot show, so the
   Dumbbells above the table own it (CompareTable's spec page says the same). Turnover and top-10
   concentration are in the v2 spec and are NOT in this repository — they need the holdings feed, which
   is an open decision, and a row invented to fill a table is the one thing this product never does. */
const compareEntities = (ids) => ids.map((id) => {
  const f = fundById(id);
  return f ? { id, name: f.name, meta: `${f.amc} · ${f.category}` } : null;
}).filter(Boolean);

const compareRows = (ids) => {
  const val = (fn) => Object.fromEntries(ids.map((id) => [id, fn(id)]));
  return [
    { label: 'Category',      values: val((id) => (fundById(id) || {}).category) },
    { label: 'Expense ratio', values: val((id) => `${(perfOf(id) || {}).ter.toFixed(2)}%`), better: 'low' },
    { label: 'Fund size',     values: val((id) => `₹${(perfOf(id) || {}).aumCr.toLocaleString('en-IN')} cr`) },
    /* The sharpest row in the table, and the reason MANAGERS exists: a three-year record under a
       manager who arrived last year is not that manager's record. */
    { label: 'Manager',       values: val((id) => managerLine(id) || '') },
    { label: 'Exit load',     values: val((id) => (fundById(id) || {}).exitLoad), better: 'low', rank: (v) => parseFloat(v) || 0 },
    { label: 'Riskometer',    values: val((id) => (fundById(id) || {}).riskometer) },
    { label: 'On your shelf', values: val((id) => ((fundById(id) || {}).onShelf ? 'Yes' : 'No')) },
    { label: 'Held by your clients', values: val((id) => String(holdersOf(id).length)) },
  ];
};

/* THE READING, BUILT FROM THE DATA AND NEVER WRITTEN PER PAIR.
   The v2 spec is blunt about why this matters: "a table anyone can build; the reading is what the
   advisor is paying for." It is also the place a comparison can most easily lie, so every clause here
   is conditional on a fact and a clause with no fact behind it simply does not appear. Same discipline
   as the rebalance's uncosted sentence: build it from the targets so a fourth option cannot arrive with
   softer wording. Two funds only — a three-way verdict is four sentences nobody reads. */
function compareVerdict(ids) {
  if (ids.length !== 2) return null;
  const [a, b] = ids;
  const fa = fundById(a), fb = fundById(b);
  const pa = perfOf(a), pb = perfOf(b);
  if (!fa || !fb || !pa || !pb) return null;
  const out = [];

  /* THE SHELF COMES FIRST, because it is the only row that is a constraint rather than a preference. */
  const off = [fa, fb].filter((f) => !f.onShelf);
  if (off.length === 1) out.push(`${off[0].name} is not on your compliance shelf, so whatever the rest of this says, you cannot place it today.`);
  else if (off.length === 2) out.push('Neither is on your compliance shelf, so neither can be placed today.');

  /* COST — arithmetic, not an opinion. */
  const cheap = pa.ter <= pb.ter ? fa : fb, dear = pa.ter <= pb.ter ? fb : fa;
  const gapTer = Math.abs(pa.ter - pb.ter);
  out.push(gapTer < 0.05
    ? `They cost the same to hold — ${pa.ter.toFixed(2)}% against ${pb.ter.toFixed(2)}%.`
    : `${cheap.name} is the cheaper of the two, ${gapTer.toFixed(2)} points a year under ${dear.name}.`);

  /* THE GAP TO EACH FUND'S OWN BENCHMARK — the thing the table cannot show. */
  const ga = pa.r5 - (benchCagr(a) || 0), gb = pb.r5 - (benchCagr(b) || 0);
  const wide = ga >= gb ? { f: fa, g: ga, p: pa, id: a } : { f: fb, g: gb, p: pb, id: b };
  const other = ga >= gb ? { f: fb, g: gb, p: pb, id: b } : { f: fa, g: ga, p: pa, id: a };
  const sameBench = pa.benchmark === pb.benchmark;
  out.push(Math.abs(ga - gb) < 0.3
    ? `Over five years both landed about the same distance from ${sameBench ? 'the benchmark' : 'their own benchmarks'} — ${ga.toFixed(1)} points and ${gb.toFixed(1)}.`
    : `${wide.f.name} beat ${sameBench ? 'that benchmark' : 'its own benchmark'} by more over five years — ${wide.g.toFixed(1)} points against ${other.g.toFixed(1)}.`);

  /* THE MANAGER — the sentence appears only when the record is not the manager's, and it appears for
     BOTH funds when both are recent. Naming one and staying quiet about the other would read as an
     endorsement of the one not mentioned, which is the opposite of what the figure says. */
  const thin = [a, b].map((id) => ({ id, m: managerOf(id) }))
    .filter((x) => x.m && x.m.years != null && x.m.fundYears > 0 && x.m.years / x.m.fundYears < 0.34);
  if (thin.length === 1) {
    const m = thin[0].m, f = fundById(thin[0].id);
    out.push(`${f.name} changed hands ${m.since ? `in ${m.since}` : 'recently'}: ${m.name} has run it ${m.years} of its ${m.fundYears} years, so the long record is the fund's rather than theirs.`);
  } else if (thin.length === 2) {
    out.push(`Both changed hands recently — ${thin.map((x) => `${x.m.name} ${x.m.years} of ${x.m.fundYears} years at ${fundById(x.id).name}`).join(', and ')}. Neither five-year record is one person's work.`);
  }

  /* ARE THESE EVEN THE SAME JOB? Two funds in different categories can be compared on cost and on the
     gap to their own benchmarks and still not be alternatives to each other. Saying so is the one
     caution a comparison screen owes an advisor, and it comes last because it qualifies everything
     above rather than replacing it. */
  if (fa.category !== fb.category) {
    out.push(`They are not the same job — ${fa.name} is ${fa.category.toLowerCase()} and ${fb.name} is ${fb.category.toLowerCase()} — so read the gap to each benchmark, not the two returns against each other.`);
  }
  return out;
}

/* The book writes it — see comparisonProvenance()'s own note on why the two lines are not
   concatenated here. */
const compareProvenance = () => comparisonProvenance();

/* The chips under a fund card. Four verbs and the four asks are DIFFERENT ROWS on purpose: the asks
   (FUND_CHIPS) are questions about this fund, the verbs do something with it. Putting eight chips in
   one row would make the advisor read all eight to find either. */
const FundVerbs = ({ onVerb, animate = false }) => (
  <FUNDS_DS.ChipRow animate={animate}>
    {FUND_VERBS.map((v) => <FUNDS_DS.AnswerChip key={v.id} label={v.label} onClick={() => onVerb && onVerb(v)} />)}
  </FUNDS_DS.ChipRow>
);

/* COMPARE IT WITH WHICH FUND — the same shape as the WHO step, and deliberately so: an advisor who has
   picked a client from a searchable list once should not meet a second, different way of picking a
   thing three screens later. It is `List.search` in both places now, so they cannot drift.
   The shelf is the pool, and a fund already in the comparison is not offered again. */
function ComparePicker({ exclude = [], funds = FUND_LIST, onPick, onEvent }) {
  const [q, setQ] = React.useState('');
  const pool = funds.filter((f) => !exclude.includes(f.id));
  const lead = exclude.length > 1 ? 'Add which third fund?' : 'Compare it with which fund?';
  return (
    <FUNDS_DS.SentinelTurn say={lead}
      body={
        <FUNDS_DS.List
          items={pool.map((f) => ({
            id: f.id, title: f.name,
            subtitle: `${f.amc} · ${f.cat}${f.onShelf ? '' : ' · not on your shelf'}`,
            onPress: () => { if (onEvent) onEvent(`Picked ${f.name}`, 'the comparison replaces the picker in place'); onPick && onPick(f.id); },
          }))}
          rowProps={{ variant: 'select' }}
          search={{ value: q, onChange: setQ, onClear: () => setQ(''), placeholder: `Search ${pool.length} funds on your shelf`,
            emptyState: { title: `No fund called “${q}”.`, body: 'Check the spelling, or clear the search to see the whole shelf.' } }}
          emptyState={{ title: 'Nothing left to compare it with.', body: 'Every fund on your shelf is already in this comparison.' }} />
      } />
  );
}

/* THE THREE HAND-OFFS. Each says the same two things — what it is about to do, and that it needs a
   client first — because a proposal, a rebalance and a review are all about somebody and the fund
   explorer is the one surface that does not already know who. The WHO step answers it (`who.jsx`), so
   this turn does not invent a second client picker; it states the hand-off and gets out of the way.

   The sentence is BUILT from the verb rather than written three times, for the same reason the
   rebalance's uncosted sentence is: a fourth verb could not arrive with softer wording. */
const VERB_SAYS = {
  propose: (f) => [`${f.name} it is. A proposal is about somebody, so I need the client before I can size anything.`,
    'Once you pick one I will check their risk number and their mandate against this fund before it goes in.'],
  rebal:   (f) => [`${f.name} it is. A rebalance moves real money in somebody's folios, so I need the client first.`,
    'Then I will size the switch against their mandate and tell you what it costs — or say plainly that I cannot cost it.'],
  review:  (f) => [`${f.name} it is. A review is written for one client and one audience, so I need the client first.`,
    'Then you pick who it is for — their file, the client, or a fresh investment case.'],
};
function FundHandoff({ verb, fundId }) {
  const f = fundById(fundId);
  const say = f && VERB_SAYS[verb] ? VERB_SAYS[verb](f) : null;
  if (!say) return null;
  return <FUNDS_DS.SentinelTurn say={say} />;
}

/* THE BAR IS NEVER THE ONLY PLACE THE GAP IS SAID — ConcentrationBar's rule, applied here. The row's
   label carries the number the picture is about, so a reader who cannot judge two bar lengths still
   gets the answer. "ahead" and "behind" are the same two words InfoCard.compare uses. */
const gapLabel = (id) => {
  const g = +(perfOf(id).r5 - (benchCagr(id) || 0)).toFixed(1);
  const dir = g < 0 ? 'behind' : 'ahead';
  return `${fundById(id).name} · ${Math.abs(g)} points ${dir} over 5 years`;
};

/* The comparison, as a turn — and it is TWO blocks with ONE signature.
   Dumbbells first, because the gap to each fund's own benchmark is what no table shows. The table
   beneath. Then the reading, in a `continued` block, because it is a second thing Sentinel says about
   the same question and `SentinelTurn`'s order puts a sentence before its body, not after it. The
   chips belong to the reading — they answer it — which is also why they are not on the first block.
   Journey D's result turn is the same shape for the same reason. */
function FundCompare({ ids = [], onChip, onAdd, onRemove, enter = false,
                       chips = ['Add a third', 'Which suits a 54 Moderate?', 'Save this comparison'] }) {
  const ents = compareEntities(ids);
  if (ents.length < 2) return null;
  const lines = compareVerdict(ids);
  /* ONE SCALE ACROSS EVERY ROW, and it is not zero-based. The rows are only comparable if they share
     a domain — each dumbbell niced to its own values would make two different gaps look the same
     length — and a 0-based domain buries all of them in the right quarter (Dumbbell's own note on
     `min` records the measurement). `niceDomain` is the system's, so the ends land on whole steps. */
  const vals = ids.flatMap((id) => [perfOf(id).r5, benchCagr(id) || 0]);
  const [lo, hi] = FUNDS_DS.niceDomain(Math.min(...vals), Math.max(...vals), 4);
  /* `<>` rather than React.Fragment: the lint reads `React.Fragment` in a file that never imports
     React — the bundle provides it globally — and rail.jsx:112 already recorded the same rule. */
  return (
    <>
      <FUNDS_DS.SentinelTurn enter={enter}
        say={`${ents.map((e) => e.name).join(' and ')}, side by side.`}
        body={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {ids.map((id) => (
              <FUNDS_DS.Dumbbell key={id} label={gapLabel(id)}
                target={benchCagr(id)} actual={perfOf(id).r5} min={lo} max={hi}
                targetLabel={perfOf(id).benchmark} actualLabel="the fund" />
            ))}
          </div>
        }
        tail={<FUNDS_DS.CompareTable entities={ents} rows={compareRows(ids)} cap={3}
          onAdd={ids.length < 3 && onAdd ? onAdd : undefined}
          capNote="Three is the most that reads on a phone. Drop one to add another."
          onRemove={onRemove} footnote={compareProvenance()} />} />
      {lines && (
        <FUNDS_DS.SentinelTurn continued say={lines}
          chips={<FUNDS_DS.ChipRow>
            {chips.map((c) => <FUNDS_DS.AnswerChip key={c} label={c} onClick={() => onChip && onChip(c)} />)}
          </FUNDS_DS.ChipRow>} />
      )}
    </>
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
        expandable={(row) => <FundInfo id={row.id} defaultPeriod="r3" heldBy onExplain={onExplain || (() => {})} />} />
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
/* The four things an advisor asks about a fund. In every reference these are four TABS behind one
   header; in a thread each is a question and each answer is its own turn. */
const FUND_CHIPS = ['How has it done against its category?', 'What is it holding?', 'What changed recently?', 'Who of my clients hold it?'];

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


/* THE FUND, AS THE SYSTEM ALREADY DRAWS IT.

   This was hand-built here on 19 Sep — a card with its own headline, its own chart call and its own 2x2
   stat boxes — and then deleted, because `InfoCard` already does every part of it: the name and meta,
   the shelf badge, the figure with its caption on the baseline, the caveat ABOVE the chart (Monzo's
   rule), `series` composed straight into `ChartLine`, the range row, the provenance line, and the stat
   pair with an InfoDot on each. Building a second one was the owner's rule broken: a thing goes into
   the system first and the screen picks it from there.

   What was genuinely missing went INTO the system rather than staying here — `InfoCard.compare`, the
   one line that names what the figure sits against. This function now only decides WHICH facts about a
   fund belong on the card, which is a screen's job.

   THE LABEL IN THE CHART IS THE ROLE, NOT THE NAME. The compare line above already says "Nifty Smallcap
   250 TRI"; repeating it in 10px beside the line is the same fact twice, and it wrapped to three lines
   and drew over the plot (F-51). */
/* ONE FUND CARD, NOT TWO (20 Sep 2026). A second wrapper lived at :68 and was this function with the
   series and the ₹10,000 framing removed, `Held by your clients` added, and a `locked` branch for a
   fund with no figures — nine of the same props from the same three book lookups, one branch apart.
   All three differences are props `InfoCard` already takes, so they are props here now.

   THE PERIOD IS CONTROLLED OR IT IS NOT, and the two callers wanted the other one. The table's row
   detail cannot hold state — `expandable` is a render callback — so it needs the card to own it;
   the thread's five call sites passed neither `period` nor `onPeriod`, which made `onRange` a no-op
   and left the range row on every fund card DEAD. A control that invites a tap and drops it is F-45's
   rule, and the merge fixes it by giving the card the state the table already proved it needs. */
function FundInfo({ id, period, onPeriod, onExplain, heldBy = false, defaultPeriod = 'r5' }) {
  const [ownPeriod, setOwnPeriod] = React.useState(defaultPeriod);
  const per = period || ownPeriod;
  const pick = onPeriod || setOwnPeriod;
  const f = fundById(id); const p = perfOf(id); const t = tenKAfter(id);
  if (!f) return null;
  const held = { label: 'Held by your clients', value: String(holdersOf(id).length) };
  /* NO FIGURES ON FILE IS A STATE, NOT A BLANK CARD. `InfoCard.locked` was built for exactly this and
     says so where the figure would be; the two facts that come from the advisor's own book are still
     true and still shown — hiding something known because something else is unknown is the opposite
     of this system's stance (InfoCard.jsx:12-18). */
  if (!p) {
    return (
      <FUNDS_DS.InfoCard
        name={f.name} meta={`${f.amc} · ${f.category}`}
        shelf={f.onShelf ? 'on-shelf' : 'not-on-shelf'}
        locked lockReason="No figures on file for this fund yet, so nothing is drawn."
        provenance="As of 30 Sep · from the scheme record and your own book"
        stats={[...(heldBy ? [held] : []), { label: 'Exit load', value: f.exitLoad }]}
        onExplain={onExplain} />
    );
  }
  const s = navSeries(id);
  const label = (PERF_PERIODS.find((x) => x.key === per) || {}).label;
  const gap = t ? t.fund - t.bench : 0;
  return (
    <FUNDS_DS.InfoCard
      name={f.name} meta={`${f.amc} · ${f.category}`}
      shelf={f.onShelf ? 'on-shelf' : 'not-on-shelf'}
      figure={per === 'r5' && t ? inr(t.fund) : `${p[per].toFixed(1)}%`}
      figureNote={per === 'r5' && t ? `is what ${inr(t.base)} would be, over ${t.years} years` : `${perfNote(per)} · against ${p.benchmark}`}
      compare={per === 'r5' && t ? { label: t.benchmark, value: inr(t.bench), gap: inr(Math.abs(gap)), behind: gap < 0 } : undefined}
      caveat="Mutual fund investments are subject to market risks. Read all scheme related documents carefully. Past performance may or may not be sustained in future."
      series={per === 'r5' && s ? [{ label: 'This fund', points: s.fund }, { label: 'Benchmark', points: s.bench, tone: 'muted' }] : undefined}
      valueFormat={(v) => inr(Math.round(v))}
      xFormat={(x) => (x === 0 ? `${NAV_MONTHS / 12} years ago` : x === NAV_MONTHS ? 'today' : '')}
      range={label} ranges={PERF_PERIODS.map((x) => x.label)}
      onRange={(r) => pick((PERF_PERIODS.find((x) => x.label === r) || {}).key || defaultPeriod)}
      provenance={perfProvenance(label)}
      stats={[
        { label: 'Riskometer', value: f.riskometer },
        { label: 'Expense ratio', value: `${p.ter.toFixed(2)}%` },
        { label: 'Fund size', value: `₹${p.aumCr.toLocaleString('en-IN')} cr` },
        { label: 'Exit load', value: f.exitLoad },
        ...(heldBy ? [held] : []),
      ]}
      onExplain={onExplain} />
  );
}

Object.assign(window, { FundInfo, FUND_CHIPS, FUND_VERBS, FundVerbs, ComparePicker, FundHandoff, VERB_SAYS, FundCompare, compareEntities, compareRows, compareVerdict, compareProvenance, REFINE_TERMS, refine, applyRefine, REFINE_MISS, refineSaid, fundsFor, FUND_EMPTY, FundResults, FUND_ASK, FUND_LIST, FUND_QUERY, FUND_COLUMNS, fundRows, heldLine, OVERLAP_FUNDS, OVERLAP_PROPERTIES, OVERLAP_CELLS, OVERLAP_FOOTNOTE });
