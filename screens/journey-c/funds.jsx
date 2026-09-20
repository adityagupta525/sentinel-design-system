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
  /* THE SCORE IS A BAR, not a bare number: `kind='bar'` draws the magnitude behind the figure in one
     hue, which is how ten scores become comparable down a column without a second colour encoding
     anything (rule 1). The figure is still printed — the bar never carries it alone.

     AND IT SITS SECOND, beside the sticky name column. It went in fifth and the render showed a
     shortlist with no score on it at all: at 375 the table folds after Category, and a column past
     the fold is a column an advisor has to go looking for. The score is the first thing the PRD
     leads with; a figure that has to be scrolled to is not leading anything. */
  /* min 40, not 0: "Weak" starts below 45 in this book's bands, so 40 is the floor below which a
     score stops being a shelf fund's score at all. The figure is printed in every cell, which is what
     the contract asks for in exchange for a baseline. */
  { key: 'score', label: 'Score', kind: 'bar', min: 40, sortable: true },
  { key: 'cat', label: 'Category', kind: 'text' },
  { key: 'shelf', label: 'Shelf', kind: 'badge' },
  { key: 'held', label: 'Held by', kind: 'text' },
];
const fundRows = (funds) => funds.map((f) => ({
  id: f.id,
  name: f.name,
  cat: f.cat,
  shelf: <FUNDS_DS.Badge tone={f.onShelf ? 'ok' : 'over'}>{f.onShelf ? 'On shelf' : 'Off shelf'}</FUNDS_DS.Badge>,
  score: String((fundScore(f.id) || {}).value ?? '—'),
  scoreValue: (fundScore(f.id) || {}).value ?? 0,
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
/* ── THE HOLDINGS, ONE QUESTION PER TURN (H1–H5, docs/FUND-EXPLORER-V2-PLAN.md §3) ────────────────
   The references stack five devices on one Holdings tab. In a 375-wide thread that is five answers,
   so it is five turns, each asked for. Every turn is a SentinelTurn: a sentence BUILT from the data,
   the one device that answers the question, the book's provenance line, and chips for the next
   questions. Every chip is also a sentence — `holdAsk()` maps typed words to the same turns.

   THE CAP SPLIT IS A ChartBar, NOT AN AllocationCard. The plan said AllocationCard; the system said
   otherwise. AllocationCard's three hues are ASSET CLASSES (equity · debt · cash) and large, mid and
   small are all equity — three hues for three sizes of the same thing is colour encoding identity
   (rule 1). ChartBar's own contract is the answer: one colour, rank carried by length, every value
   direct-labelled. The same device answers H2, which is fine: two questions, two turns. */
const HOLD_CHIPS = ['By sector', 'Top 10 stocks', 'How concentrated?', 'Overlap with…'];
const HOLD_KINDS = { 'By sector': 'sectors', 'Top 10 stocks': 'top', 'How concentrated?': 'concentration', 'Overlap with…': 'overlap' };
/* Typed words → the same turns the chips open. Null means "not a holdings question" and the caller
   routes it as usual — a search that quietly ignores half of what you typed is worse than one that
   says it did not follow. */
const holdAsk = (text) => {
  const t = (text || '').toLowerCase();
  /* THE THREE ASKS THAT ARE NOT HOLDINGS go through the same door, because an advisor typing
     "against its category" and an advisor tapping the chip asked the same question and one product
     cannot have two answers to that. Ordered before the holdings patterns: "who holds it" contains
     "hold". */
  /* `/\bcategor\b/` matched nothing: the word boundary after "categor" sits before "y", which is a
     word character. Found by driving it, not by reading it. */
  if (/\bscore\b|\bcentricity\b|\brating\b/.test(t)) return 'score';
  if (/\bcategor|\bpeers?\b|\bpeer group\b/.test(t)) return 'category';
  if (/\bwho\b.*\b(hold|own)|\b(my |which )clients?\b/.test(t)) return 'holders';
  if (/\bwhat changed\b|\bchanged recently\b|\brecent changes?\b|\bmonthly changes?\b/.test(t)) return 'changed';
  if (/\b(what is it holding|holdings?|what does it hold|inside it)\b/.test(t)) return 'shape';
  if (/\bsectors?\b/.test(t)) return 'sectors';
  if (/\btop\s*(10|ten)\b|\bstocks?\b/.test(t)) return 'top';
  if (/\bconcentrat/.test(t)) return 'concentration';
  if (/\boverlap\b/.test(t)) return 'overlap';
  return null;
};
const pctOf = (v) => `${v}%`;
const holdChips = (onChip, except) => (
  <FUNDS_DS.ChipRow>
    {HOLD_CHIPS.filter((c) => HOLD_KINDS[c] !== except).map((c) => <FUNDS_DS.AnswerChip key={c} label={c} onClick={() => onChip && onChip(HOLD_KINDS[c], c)} />)}
  </FUNDS_DS.ChipRow>
);

/* H1 · THE SHAPE. Where the weight sits, and the one sector that dominates. */
function HoldingsShape({ id, onChip }) {
  const f = fundById(id); const h = holdingsOf(id); if (!f || !h) return null;
  const bars = [...h.caps.map((c) => ({ label: c.label, value: c.pct })), { label: 'Debt & cash', value: h.split.debtCash }].filter((b) => b.value > 0);
  const big = h.sectors[h.asOf][0];
  const lead = h.caps.length
    ? `${f.name} is ${h.caps[0].pct}% ${h.caps[0].label.toLowerCase()}${h.caps[1] ? `, ${h.caps[1].pct}% ${h.caps[1].label.toLowerCase()}` : ''}${h.caps[2] ? ` and ${h.caps[2].pct}% ${h.caps[2].label.toLowerCase()}` : ''}, with ${h.split.debtCash}% in debt and cash.`
    : `${f.name} holds no equity — ${h.count} debt instruments, ${h.split.debtCash}% of it in debt and cash.`;
  const sector = `${big.name} is the biggest sector at ${big.pct}%${big.pct >= 30 ? ' — one sector is more than a third of the fund' : ''}.`;
  return (
    <FUNDS_DS.SentinelTurn say={[lead, sector]}
      body={<FUNDS_DS.ChartBar bars={bars} orientation="horizontal" valueFormat={pctOf} run={false} />}
      provenance={holdingsProvenance()} chips={holdChips(onChip)} />
  );
}

/* H2 · BY SECTOR, over three months. RangePills' count MATCHES the data (F-46). The sentence names the
   biggest sector's move across the window, in points. */
function HoldingsSectors({ id, onChip }) {
  const h = holdingsOf(id); const [month, setMonth] = React.useState(h ? h.asOf : null);
  if (!h) return null;
  const rows = h.sectors[month] || [];
  const newest = h.sectors[HOLD_MONTHS[0]], oldest = h.sectors[HOLD_MONTHS[HOLD_MONTHS.length - 1]];
  const at = (list, name) => (list.find((x) => x.name === name) || {}).pct;
  const top = newest[0]; const topThen = at(oldest, top.name);
  const mover = newest.map((x) => ({ name: x.name, d: +(x.pct - (at(oldest, x.name) || x.pct)).toFixed(1) })).sort((a, b) => Math.abs(b.d) - Math.abs(a.d))[0];
  const say = [`${top.name} went ${topThen} → ${top.pct} over three months${mover && mover.name !== top.name ? `; ${mover.name} moved most, ${mover.d > 0 ? 'up' : 'down'} ${Math.abs(mover.d)} points` : ''}.`];
  return (
    <FUNDS_DS.SentinelTurn say={say}
      body={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          <FUNDS_DS.RangePills ranges={HOLD_MONTHS} value={month} onChange={setMonth} label="Month" />
          <FUNDS_DS.ChartBar bars={rows.slice(0, 6).map((x) => ({ label: x.name, value: x.pct }))} orientation="horizontal" valueFormat={pctOf} run={false} />
        </div>
      }
      provenance={holdingsProvenance()} chips={holdChips(onChip, 'sectors')} />
  );
}

/* H3 · THE TOP TEN, with the change since last month. `bar` draws the weight behind the figure —
   one hue, magnitude only. The tail is ONE row, not ninety-three: the same rule the review applies to
   Meera's twenty-nine tiny funds. */
/* THREE COLUMNS, NOT FOUR — the render decided it. With a Sector column the table scrolled sideways
   and "vs last month" sat off the right edge of the phone, which is the one column this turn exists
   for. Sector is H2's question and is answered there; the name is enough here. */
const TOP_COLUMNS = [
  { key: 'name', label: 'Holding', kind: 'text', sticky: true, width: 124 },
  { key: 'pct', label: 'Weight', kind: 'bar' },
  /* "vs last month" wrapped to two lines and still lost its last character at 375 — measured. The
     header is the short word and the sentence above the table says what the month is. */
  { key: 'chg', label: 'Change', kind: 'number' },
];
/* `fold`, NOT `scroll` — and the render decided it. `overflow="scroll"` lays the columns out at
   max-content and the Change column, which is the only reason this turn exists, sat off the right edge
   of the phone. Two columns beside the sticky one is under DataTable's own three-column rule, so
   folding fits them exactly. `maxRows` is ten, because ten IS the answer.
   A JSX comment cannot sit in an attribute list — third time; it goes above the function. */
function HoldingsTop({ id, onChip }) {
  const h = holdingsOf(id); if (!h) return null;
  const rows = h.top.map((x) => {
    const d = +(x.pct - x.prevPct).toFixed(1);
    return { id: x.name, name: x.name, pct: `${x.pct}%`, pctValue: x.pct, chg: d === 0 ? '—' : `${d > 0 ? '+' : ''}${d.toFixed(1)}` };
  });
  const rest = h.count - h.top.length;
  return (
    <FUNDS_DS.SentinelTurn say={`The top five are ${h.concentration.top5CompaniesPct}% of the fund. ${h.top[0].name} alone is ${h.top[0].pct}%. Change is against last month.`}
      body={<FUNDS_DS.DataTable columns={TOP_COLUMNS} rows={rows} maxRows={10} emptyState={{ title: 'No holdings on file for this fund.' }} />}
      then={rest > 0 ? `${rest} more holdings, none above ${Math.max(0.5, +(h.top[9].pct * 0.8).toFixed(1))}%.` : undefined}
      provenance={holdingsProvenance()} chips={holdChips(onChip, 'top')} />
  );
}

/* H4 · HOW CONCENTRATED. Four figures on one baseline each. No ceiling of the product's applies INSIDE
   a fund — the 25% caps are written against a client's book — so the sentence states the numbers and
   claims nothing about them. */
function HoldingsConcentration({ id, onChip }) {
  const h = holdingsOf(id); if (!h) return null;
  const c = h.concentration;
  return (
    <FUNDS_DS.SentinelTurn say={`${h.count} holdings across ${c.sectorsCount} sectors. The top five companies are ${c.top5CompaniesPct}% of the fund, the top five sectors ${c.top5SectorsPct}%.`}
      body={
        <FUNDS_DS.Surface>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
            <FUNDS_DS.FigureRow label="Holdings" value={String(h.count)} sub={{ label: 'Largest', value: `${c.largestCompany.name} · ${c.largestCompany.pct}%` }} />
            <FUNDS_DS.FigureRow label="Top 5 companies" value={`${c.top5CompaniesPct}%`} />
            <FUNDS_DS.FigureRow label="Sectors" value={String(c.sectorsCount)} sub={{ label: 'Largest', value: `${c.largestSector.name} · ${c.largestSector.pct}%` }} />
            <FUNDS_DS.FigureRow label="Top 5 sectors" value={`${c.top5SectorsPct}%`} />
          </div>
        </FUNDS_DS.Surface>
      }
      provenance={holdingsProvenance()} chips={holdChips(onChip, 'concentration')} />
  );
}

/* H5 · OVERLAP — the em dashes become numbers. `OverlapView` was built for this question in v9 and has
   rendered "—" ever since, because nothing here knew what any fund held. `overlapPct` is computed from
   the names two top tens actually share. Without a second fund it asks for one, the same way Compare
   does: the picker is `List.search`, one mechanism for picking a thing. */
function HoldingsOverlap({ id, otherId, onPick, onChip, onEvent }) {
  const f = fundById(id); if (!f) return null;
  if (!otherId) return <ComparePicker exclude={[id]} onPick={onPick} onEvent={onEvent} lead="Overlap with which fund?" />;
  const g = fundById(otherId); const pct = overlapPct(id, otherId);
  const shared = pct == null ? [] : holdingsOf(id).top.filter((x) => holdingsOf(otherId).top.some((y) => y.name === x.name));
  const say = pct == null ? `I do not have holdings on file for both, so I cannot say how much they overlap.`
    : pct === 0 ? `${f.name} and ${g.name} share none of their top ten — they hold different things.`
    : `${pct}% of their top tens are the same ${shared.length} ${shared.length === 1 ? 'stock' : 'stocks'} — ${shared.slice(0, 3).map((x) => x.name).join(', ')}${shared.length > 3 ? ' and more' : ''}.`;
  return (
    <FUNDS_DS.SentinelTurn say={say}
      body={<FUNDS_DS.OverlapView mode="pairs"
        funds={[{ id, name: f.name, inComparison: true }, { id: otherId, name: g.name, inComparison: true }]}
        properties={[{ id: 'top10', label: 'top 10 holdings', active: true }]}
        cells={[{ a: id, b: otherId, pct }]}
        footnote={pct == null ? undefined : `Share of the smaller top ten held in common · ${holdingsProvenance()}`} />}
      chips={holdChips(onChip, 'overlap')} />
  );
}

/* One door for the five: the prototype and the page render whichever kind was asked for. */
/* ── THE THREE ASKS THAT ARE NOT HOLDINGS ─────────────────────────────────────────────────────────
   `FUND_CHIPS` offers four questions under a fund card. "What is it holding?" has been five turns
   since this morning; the other three said "not built yet" when tapped. They are built here, on the
   same terms: one question per turn, every figure direct-labelled, the sentence carrying the finding
   and the device carrying the evidence. */

/* The four asks as KINDS, so a chip and a typed sentence reach the same turn through one map. The
   holdings ask is the one that fans out into five turns of its own; the other three are one each. */
const ASK_KINDS = { 'What is its Centricity score?': 'score', 'How has it done against its category?': 'category', 'What is it holding?': 'shape',
  'What changed recently?': 'changed', 'Who of my clients hold it?': 'holders' };
const askChips = (onChip, except) => (
  <FUNDS_DS.ChipRow>
    {FUND_CHIPS.filter((c) => ASK_KINDS[c] !== except).map((c) => (
      <FUNDS_DS.AnswerChip key={c} label={c} onClick={() => onChip && onChip(ASK_KINDS[c], c)} />
    ))}
  </FUNDS_DS.ChipRow>
);

const PERIOD_PHRASE = { r1: 'Over the last twelve months', r3: 'Over three years', r5: 'Over five years' };
const pts = (v) => `${Math.abs(v).toFixed(1)} point${Math.abs(v).toFixed(1) === '1.0' ? '' : 's'}`;
const aheadOf = (v) => (v >= 0 ? 'ahead of' : 'behind');

/* A0 · THE CENTRICITY FUND SCORE — a DESIGN PLACEHOLDER, and the screen says so twice.
   The PRD leads with this number and nobody here has seen its definition, so the only honest way to
   draw it is with its own workings on the card: the weights in the copy line, the five components as
   meters, the weakest one distinguished, and a provenance line that calls it a placeholder in words.
   `HeroNumberCard` is already exactly this device — it draws Meera's risk number the same way, big
   figure, band word, contributing rows with one of them binding. Nothing new was built for a score;
   the system had the shape, which is the test a new component has to fail before it is written. */
/* The weakest component, as the start of a sentence: capitalised, and read as English rather than as
   a meter's label — "One manager, long enough is what holds it back" is not a sentence. */
const WEAKEST_PHRASE = { 'One manager, long enough': 'How long one manager has run it', 'Beats its category': 'Beating its category' };
const weakestPhrase = (w) => WEAKEST_PHRASE[w.label] || w.label.charAt(0).toUpperCase() + w.label.slice(1);
function FundScoreTurn({ id, onChip }) {
  const f = fundById(id); const sc = fundScore(id);
  if (!f || !sc) return null;
  const say = [
    `${f.name} scores ${sc.value} out of ${sc.readWeight} — ${sc.band.toLowerCase()}.`,
    `${weakestPhrase(sc.weakest)} is what holds it back, at ${sc.weakest.value}.`,
  ];
  /* THE MISSING ROWS SHARE ONE SENTENCE, grouped by their reason. Two rows that are absent for the
     same reason produced two near-identical paragraphs — the repetition this product has been pulled
     up on twice, and it read as if something had gone wrong twice rather than once. */
  const byWhy = sc.missing.reduce((m, x) => { const k = x.why || 'the input is not on file'; (m[k] = m[k] || []).push(x.label); return m; }, {});
  Object.entries(byWhy).forEach(([why, labels]) => {
    /* Only the first label keeps its capital: "Share of your whole book and Headroom under the
       ceilings" put a capital H in the middle of a sentence. */
    const low = labels.map((l, i) => (i === 0 ? l : l.charAt(0).toLowerCase() + l.slice(1)));
    const names = low.length === 1 ? low[0] : `${low.slice(0, -1).join(', ')} and ${low[low.length - 1]}`;
    say.push(`${names} ${labels.length === 1 ? 'is' : 'are'} not scored here — ${why}. That is why the number is out of ${sc.readWeight} rather than 100.`);
  });
  /* THE WEIGHTS ARE ON THE CARD. A score whose workings are one tap away is a score an advisor has to
     take on trust for the length of that tap, and this is the number they will be asked about first. */
  /* THE TWO HALVES ARE NAMED ON THE CARD, because the owner's basis is two things and a flat list of
     five would hide that. Its own record is 70 of the 100; how this book already holds it is 30. */
  const half = (g) => FUND_SCORE_WEIGHTS.filter(([, , , grp]) => grp === g).map(([, w, short]) => `${short} ${w}`).join(' · ');
  const weights = `Its own record — ${half('Its own record')}. How your book holds it — ${half('How your book holds it')}`;
  return (
    <FUNDS_DS.SentinelTurn say={say}
      body={<FUNDS_DS.HeroNumberCard title="Centricity Fund Score" meta="Placeholder" value={sc.value}
        badge={sc.band} copy={`Out of ${sc.readWeight}. ${weights}.`} rows={sc.rows} />}
      provenance={fundScoreProvenance()} chips={askChips(onChip, 'score')} />
  );
}

/* A3 · AGAINST ITS CATEGORY — three marks on one scale.
   The plan said "three Dumbbells". The COMPONENT said two, and the component was right: a Dumbbell is
   a pair — a hollow dot for what a thing is measured against, a filled one for what it is. So this is
   two rows sharing ONE domain, the fund's dot in both, and the two gaps are directly comparable
   because the track underneath them is the same. A bespoke three-dot device would be a new component,
   and nothing is hand-built on a screen.

   The domain comes from `niceDomain` over the three values, not from zero: at 5Y the fund is 23.1 and
   its benchmark 16.8, and on a 0–100 track that difference is four pixels. Every figure is
   direct-labelled, which is the safeguard the contract asks for in exchange. */
function CategoryTurn({ id, onChip, defaultPeriod = 'r5' }) {
  const f = fundById(id); const p = perfOf(id); const cat = categoryAvgOf(id);
  const [key, setKey] = React.useState(defaultPeriod);
  if (!f || !p || !cat) return null;
  const fund = p[key], avg = cat[key], bench = benchReturnAt(id, key);
  const marks = [fund, avg, bench].filter((v) => v != null);
  const dom = FUNDS_DS.niceDomain(Math.min(...marks), Math.max(...marks), 4);
  const gapCat = +(fund - avg).toFixed(1);
  const gapBench = bench == null ? null : +(fund - bench).toFixed(1);
  const say = [
    `${PERIOD_PHRASE[key]} ${f.name} returned ${fund}%${key === 'r1' ? '' : ' a year'}.`,
    gapBench == null
      ? `That is ${pts(gapCat)} ${aheadOf(gapCat)} its category.`
      : `That is ${pts(gapCat)} ${aheadOf(gapCat)} its category and ${pts(gapBench)} ${aheadOf(gapBench)} ${p.benchmark}.`,
  ];
  /* THE ONE SENTENCE THAT IS NOT ARITHMETIC. A three-year record is one person's work only if one
     person did it, and `MANAGERS` knows when they started — so a fund that changed hands inside the
     window says so, rather than letting the advisor read the number as the manager's. */
  const m = MANAGERS[id];
  const yrs = { r1: 1, r3: 3, r5: 5 }[key];
  const YRS_WORD = { r1: 'one', r3: 'three', r5: 'five' };
  if (m && m.years != null && m.years < yrs) say.push(`${m.name} has run it for ${m.years} years, so this ${YRS_WORD[key]}-year number is not one person's work.`);
  return (
    <FUNDS_DS.SentinelTurn say={say}
      body={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          <FUNDS_DS.RangePills ranges={PERF_PERIODS.map((x) => x.label)} value={PERIOD_LABEL[key]}
            onChange={(lbl) => setKey((PERF_PERIODS.find((x) => x.label === lbl) || {}).key || key)} label="Period" />
          {/* The label is the NAME only: Dumbbell prints the number itself, so "This fund 23.1%" as a
              label rendered "This fund 23.1% 23.1%". `relation='against'` drops the arrow — nothing
              travels from this fund to its category, and the component learned that before the
              screen used it. */}
          <FUNDS_DS.Dumbbell label="Against its category" relation="against" min={dom[0]} max={dom[1]}
            target={avg} actual={fund} targetLabel="Category" actualLabel="This fund" />
          {bench != null && (
            <FUNDS_DS.Dumbbell label={`Against ${p.benchmark}`} relation="against" min={dom[0]} max={dom[1]}
              target={bench} actual={fund} targetLabel="The index" actualLabel="This fund" />
          )}
        </div>
      }
      provenance={`${perfProvenance(PERIOD_LABEL[key])} · ${benchProvenance(key)}`}
      chips={askChips(onChip, 'category')} />
  );
}

/* A5 · WHAT CHANGED — the reference set's weakest execution of its strongest idea.
   Every app in the study renders this as green and red pills. Rule 2 says bad news is text on the
   peach bubble and never a fill, and a pill that encodes its verdict in its colour also has to be
   read twice — once for the colour, once for the number. Sentences say it once. The FigureRows under
   them carry the three months' returns with the benchmark's in the quiet half, so nothing in the
   words has to be taken on trust. */
function ChangedTurn({ id, onChip }) {
  const f = fundById(id); const rows = monthlyOf(id);
  if (!f || !rows || !rows.length) return null;
  const now = rows[0], prev = rows[1];
  const gap = +(now.fundReturn - now.benchReturn).toFixed(1);
  const prevGap = prev ? +(prev.fundReturn - prev.benchReturn).toFixed(1) : null;
  const up = now.gainers[0], down = now.losers[0];
  const say = [
    `Size ${now.aumChangeCr >= 0 ? 'rose' : 'fell'} ${inr(Math.abs(now.aumChangeCr))} cr in ${now.month}.`,
    prevGap == null
      ? `${now.month}'s return was ${pts(gap)} ${gap >= 0 ? 'over' : 'under'} its benchmark.`
      : `${now.month}'s return was ${pts(gap)} ${gap >= 0 ? 'over' : 'under'} its benchmark; ${prev.month}'s was ${pts(prevGap)} ${prevGap >= 0 ? 'over' : 'under'}.`,
    /* `down.pct` is already negative, so "cost it ${down.pct}%" printed "cost it -3%" — the minus and
       the word "cost" saying the same thing twice, and the second one wrongly. The direction is in the
       verb; the figure is a magnitude. */
    `${up.name} carried the month at +${up.pct.toFixed(1)}%; ${down.name} cost it ${Math.abs(down.pct).toFixed(1)}%.`,
  ];
  const m = MANAGERS[id];
  if (m && m.years != null && m.years < 3) say.push(`${m.name} took it over in ${m.since}.`);
  return (
    <FUNDS_DS.SentinelTurn say={say}
      body={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {rows.map((r) => (
            <FUNDS_DS.FigureRow key={r.month} label={r.month} value={`${r.fundReturn >= 0 ? '+' : ''}${r.fundReturn}%`}
              weight={r === now ? 'strong' : 'quiet'}
              sub={{ label: 'Its benchmark', value: `${r.benchReturn >= 0 ? '+' : ''}${r.benchReturn}%` }} />
          ))}
        </div>
      }
      provenance={monthlyProvenance()} chips={askChips(onChip, 'changed')} />
  );
}

/* A6 · WHO OF MY CLIENTS HOLD IT — and the honest half of the answer is the part nobody asks for.
   `holdersOf` counts a client who has a SIP running into a fund but no position recorded yet. That is
   a different fact from a ₹4.4 L holding, and the count on the fund card has always folded the two
   together. The rows separate them, each client's weight is read against THEIR OWN book rather than
   against the fund, and a position over one of the book's ceilings says which ceiling — `LIMITS`
   carries two different rules that both read 25 (contradiction 32), so naming it is not optional. */
const holdersDetail = (fundId) => CLIENTS.map((c) => {
  const h = (c.holdings || []).find((x) => x.fundId === fundId);
  const sip = (c.sips || []).find((x) => x.fundId === fundId);
  return h || sip ? { client: c, holding: h || null, sip: sip || null } : null;
}).filter(Boolean).sort((a, b) => {
  /* POSITIONS FIRST, BIGGEST FIRST. The rows came back in book order, which put a client with a SIP
     and no position above one holding ₹1,99,220 of it. A SIP running in is the qualifier to this
     answer, not the answer — and the row that might be over a ceiling has to be the one an advisor
     sees without scrolling. */
  if (!!a.holding !== !!b.holding) return a.holding ? -1 : 1;
  if (a.holding && b.holding) return b.holding.pct - a.holding.pct;
  return 0;
});

function HoldersTurn({ id, onChip }) {
  const f = fundById(id); const who = holdersDetail(id);
  if (!f) return null;
  const withPos = who.filter((w) => w.holding);
  const sipOnly = who.filter((w) => !w.holding && w.sip);
  const over = withPos.filter((w) => w.holding.over);
  const say = who.length === 0
    ? [`None of your clients hold ${f.name}.`]
    : [
        withPos.length === 0
          ? `No client holds ${f.name} yet — ${sipOnly.length === 1 ? 'one has' : `${sipOnly.length} have`} a SIP running into it.`
          : `${withPos.length === 1 ? 'One client holds' : `${withPos.length} clients hold`} it${sipOnly.length ? `, and ${sipOnly.length === 1 ? 'one more has' : `${sipOnly.length} more have`} a SIP running into it with no position yet` : ''}.`,
      ];
  if (over.length) say.push(`${over[0].client.name} is at ${over[0].holding.pct}% of their own book, over the ${over[0].holding.over} of ${LIMITS.singleFund}%.`);
  const items = who.map((w) => ({
    title: w.client.name,
    /* NO BADGE HERE, and the render is why: a ListRow shows ONE trailing thing, and `meta` is the
       rupee value — rule 4 asks for every figure direct-labelled, so the value keeps the slot and a
       `badge` passed beside it was silently dropped. The breach goes into the row's own words, where
       it also says WHICH ceiling: two different rules in LIMITS both read 25 (contradiction 32). */
    subtitle: w.holding
      ? `${w.holding.pct}% of their book${w.holding.over ? ` · over the ${LIMITS.singleFund}% ${w.holding.over}` : ''} · folio ${w.holding.folio}`
      : `SIP ${inr(w.sip.amountRs)} a month · no position recorded yet`,
    meta: w.holding ? inr(w.holding.valueRs) : `${w.sip.mandate} · ${w.sip.day}th`,
    trailing: 'meta',
  }));
  return (
    <FUNDS_DS.SentinelTurn say={say}
      body={who.length ? <FUNDS_DS.List items={items} dividers="inset" rowProps={{ variant: 'static' }}
        emptyState={{ title: `None of your clients hold ${f.name}.` }} /> : null}
      provenance="your own book · positions as of 30 Sep 2026 · SIPs from the mandates on file"
      chips={askChips(onChip, 'holders')} />
  );
}

function HoldingsTurn({ kind, id, otherId, onPick, onChip, onEvent }) {
  if (kind === 'score') return <FundScoreTurn id={id} onChip={onChip} />;
  if (kind === 'category') return <CategoryTurn id={id} onChip={onChip} />;
  if (kind === 'changed') return <ChangedTurn id={id} onChip={onChip} />;
  if (kind === 'holders') return <HoldersTurn id={id} onChip={onChip} />;
  if (kind === 'shape') return <HoldingsShape id={id} onChip={onChip} />;
  if (kind === 'sectors') return <HoldingsSectors id={id} onChip={onChip} />;
  if (kind === 'top') return <HoldingsTop id={id} onChip={onChip} />;
  if (kind === 'concentration') return <HoldingsConcentration id={id} onChip={onChip} />;
  if (kind === 'overlap') return <HoldingsOverlap id={id} otherId={otherId} onPick={onPick} onChip={onChip} onEvent={onEvent} />;
  return null;
}

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
function ComparePicker({ exclude = [], funds = FUND_LIST, onPick, onEvent, lead: leadProp }) {
  const [q, setQ] = React.useState('');
  const pool = funds.filter((f) => !exclude.includes(f.id));
  const lead = leadProp || (exclude.length > 1 ? 'Add which third fund?' : 'Compare it with which fund?');
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
/* `period` rides through to the row detail so a typed "show 3Y" changes every figure on the screen,
   not only the one the advisor happened to have open. */
function FundResults({ funds = FUND_LIST, openRow = null, state = 'expanded', onExplain, period = 'r3' }) {
  return (
    <FUNDS_DS.ArtifactCard state={state} eyebrow="Fund search · your shelf" title={funds.length === 1 ? '1 fund matches' : `${funds.length} funds match`}
      provenance="As of 30 Sep · from the scheme record and your own book" onToggle={() => {}} onMenu={() => {}}>
      <FUNDS_DS.DataTable columns={FUND_COLUMNS} rows={fundRows(funds)} emptyState={FUND_EMPTY} overflow="scroll" defaultOpen={openRow}
        expandable={(row) => <FundInfo id={row.id} defaultPeriod={period} heldBy onExplain={onExplain || (() => {})} />} />
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
const FUND_CHIPS = ['What is its Centricity score?', 'How has it done against its category?', 'What is it holding?', 'What changed recently?', 'Who of my clients hold it?'];

const REFINE_CATEGORIES = [...new Set(FUNDS.map((f) => f.category))];
const REFINE_BUCKETS = [...new Set(FUNDS.map((f) => f.bucket))];
const REFINE_TERMS = [...REFINE_CATEGORIES, ...REFINE_BUCKETS, 'Direct plan', 'Regular plan'];

/* Returns { kind, ... } — never a mutated query, so a caller decides what to do with a refusal. */
/* A FUND BY NAME, AND AN AMBIGUOUS NAME MATCHES NOTHING. Same discipline the WHO step learned on
   20 Sep: "Nair" is two clients and taking the first silently is worse than asking. Here "HDFC" is
   four funds, so it comes back as a miss with the four named, rather than as a guess. */
const fundByWords = (t) => {
  const hits = FUND_LIST.filter((f) => {
    const words = `${f.name} ${f.amc}`.toLowerCase().split(/[\s·]+/).filter((w) => w.length > 2);
    return words.some((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(t));
  });
  return { one: hits.length === 1 ? hits[0] : null, many: hits.length > 1 ? hits : null };
};
const SORT_KEYS = [
  { key: 'ter', dir: 'asc', re: /\b(cost|cheap|expense|ter|fee)\b/, said: 'cheapest first' },
  { key: 'aumCr', dir: 'desc', re: /\b(size|aum|biggest|largest)\b/, said: 'biggest first' },
  /* NOT A FIXED PERIOD. "sort by return" used to sort on r3 while the table might be showing 5Y, so the
     rows came back in an order the numbers on screen did not explain. The key resolves to whatever
     period is being displayed, and the sentence names it — a sort the reader cannot verify against the
     column in front of them is the same defect as a figure with no provenance. */
  { key: 'return', dir: 'desc', re: /\b(return|performance|best)\b/, said: 'best return first' },
  { key: 'score', dir: 'desc', re: /\b(score|centricity|rating)\b/, said: 'highest score first' },
];
const PERIOD_WORDS = { '1y': 'r1', '3y': 'r3', '5y': 'r5', 'one year': 'r1', 'three year': 'r3', 'five year': 'r5' };

function refine(text, query) {
  const t = (text || '').trim().toLowerCase();
  if (!t) return { kind: 'miss' };

  /* SORT — a view over the same shortlist, not a filter on it, so it never changes the count. */
  if (/\bsort\b|\border by\b|\bcheapest\b|\bbiggest\b/.test(t)) {
    const k = SORT_KEYS.find((x) => x.re.test(t));
    if (k) return { kind: 'sort', sort: { key: k.key, dir: k.dir }, said: k.said };
    return { kind: 'miss', why: 'sort' };
  }
  /* A NUMBER WITH A DIRECTION. "under 0.7%" is the filter an advisor actually types, and the query had
     no way to hold one — every pill was a word. */
  const num = t.match(/\b(under|below|less than|over|above|more than)\s*₹?\s*([\d.]+)\s*%?/);
  if (num && /\b(ter|expense|cost|fee|charge)\b/.test(t)) {
    const op = /^(over|above|more)/.test(num[1]) ? 'gt' : 'lt';
    return { kind: 'ter', op, value: parseFloat(num[2]) };
  }
  /* PERIOD — which return every figure on the shortlist is read at. */
  const per = Object.keys(PERIOD_WORDS).find((w) => t.includes(w));
  if (per && /\b(show|use|switch|give)\b/.test(t)) return { kind: 'period', period: PERIOD_WORDS[per] };
  /* COMPARE two funds by name, straight from the composer. */
  const cmp = t.match(/\bcompare\b(.+?)\b(?:with|and|vs|versus)\b(.+)/);
  if (cmp) {
    const a = fundByWords(cmp[1]), b = fundByWords(cmp[2]);
    if (a.one && b.one && a.one.id !== b.one.id) return { kind: 'compare', ids: [a.one.id, b.one.id] };
    const amb = a.many || b.many;
    return amb ? { kind: 'ambiguous', funds: amb } : { kind: 'miss', why: 'compare' };
  }

  const hit = REFINE_TERMS.find((x) => t.includes(x.toLowerCase()));
  const shelfWord = /\bshelf\b|\bon my shelf\b|\bapproved\b/.test(t);
  const dropping = /\b(drop|remove|without|not|no|except|forget)\b/.test(t);
  const onlying = /\b(only|just)\b/.test(t);

  if (shelfWord && dropping) return { kind: 'shelf', on: false, said: 'off the shelf filter' };
  if (shelfWord) return { kind: 'shelf', on: true, said: 'the shelf filter' };

  /* A FUND BY NAME. "add Motilal" is not a category — it is one scheme the advisor wants in the list
     whatever the filters say, and "drop HDFC Flexi Cap" is one they want out. Both arrive as visible,
     removable chips, because a list the system quietly changed is a list nobody can defend. Checked
     AFTER the category words, so "add small cap" is still a category. */
  if (!hit) {
    const f = fundByWords(t);
    if (f.one) return { kind: dropping ? 'fundDrop' : 'fundAdd', fund: f.one };
    if (f.many) return { kind: 'ambiguous', funds: f.many };
    return { kind: 'miss' };
  }

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
const terLabel = (op, v) => `TER ${op === 'lt' ? 'under' : 'over'} ${v}%`;
function applyRefine(r, query) {
  /* One TER pill at a time: "under 0.7" then "under 0.5" is a correction, not two filters. */
  if (r.kind === 'ter') return [...query.filter((q) => q.kind !== 'ter'), { label: terLabel(r.op, r.value), on: true, kind: 'ter', op: r.op, value: r.value }];
  if (r.kind === 'fundAdd') return [...query.filter((q) => q.id !== r.fund.id), { label: `+ ${r.fund.name}`, on: true, kind: 'fund', mode: 'add', id: r.fund.id }];
  if (r.kind === 'fundDrop') return [...query.filter((q) => q.id !== r.fund.id), { label: `− ${r.fund.name}`, on: true, kind: 'fund', mode: 'drop', id: r.fund.id }];
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
  body: 'I did not follow that as a change to the search. I can add a category or drop one, filter on the expense ratio, add or drop a fund by name, sort the list, or turn the shelf filter on and off.',
  chips: ['Only direct plan', 'Under 0.7% TER', 'Sort by cost', 'Drop the shelf filter'],
};
/* TWO FUNDS WITH THE SAME WORD IN THEM IS NOT A CHOICE SENTINEL GETS TO MAKE. It names them and asks,
   which is the same answer the WHO step gives for two clients called Nair. */
const refineAmbiguous = (r) => ({
  body: `${r.funds.length} funds match that: ${r.funds.map((f) => f.name).join(', ')}. Which one?`,
  chips: r.funds.slice(0, 3).map((f) => f.name),
});
/* LAZY, BECAUSE AN OBJECT LITERAL EVALUATES EVERY BRANCH. This was a map built eagerly, so
   `r.fund.name` ran for a kind that has no fund and threw — found the moment the new grammar was
   driven, before any of it reached a screen. One arm per kind, and only the taken arm runs. */
const PERIOD_LABEL = { r1: '1Y', r3: '3Y', r5: '5Y' };
/* A SORT THE READER CAN CHECK. The table's cost and return columns sit off the 375 edge behind a
   horizontal scroll, so "sorted cheapest first" was a claim with nothing on screen to test it against —
   the same shape as a figure with no provenance. The sentence now carries the span it sorted on, first
   value to last, which is the smallest thing that makes the order verifiable without moving a column. */
const SORT_UNIT = { score: (v) => String(v), ter: (v) => `${v.toFixed(2)}%`, aumCr: (v) => `${inr(Math.round(v))} cr`, return: (v) => `${v.toFixed(1)}%` };
const sortSpan = (r, period, list) => {
  if (!list || list.length < 2) return '';
  const key = r.sort.key === 'return' ? period : r.sort.key;
  const vals = list.map((f) => (perfOf(f.id) || {})[key]).filter((v) => v != null);
  if (vals.length < 2) return '';
  const fmt = SORT_UNIT[r.sort.key] || ((v) => String(v));
  return ` — ${fmt(vals[0])} to ${fmt(vals[vals.length - 1])}.`;
};
const refineSaid = (r, period = 'r5', list = null) => {
  switch (r.kind) {
    case 'add': return `Added ${r.term}.`;
    case 'drop': return `Dropped ${r.term}.`;
    case 'only': return `Only ${r.term} now — I took the other categories off.`;
    case 'already': return `${r.term} was already on.`;
    case 'absent': return `${r.term} was not on, so there was nothing to drop.`;
    case 'shelf': return r.on ? 'Filtering to your shelf.' : 'Showing funds off your shelf too.';
    case 'ter': return `Only funds with an expense ratio ${r.op === 'lt' ? 'under' : 'over'} ${r.value}%.`;
    case 'fundAdd': return `Added ${r.fund.name} — it stays in whatever the filters say.`;
    case 'fundDrop': return `Dropped ${r.fund.name}.`;
    case 'sort': return `Sorted ${r.sort.key === 'return' ? `best ${PERIOD_LABEL[period]} return first` : r.said}${sortSpan(r, period, list) || '.'} The list is the same funds in a different order.`;
    case 'period': return `Reading every return at ${PERIOD_LABEL[r.period]} now.`;
    default: return null;
  }
};

/* The shortlist for a query — one function, so the count beside the chips and the rows in the table
   can never disagree. That pair is the whole reason an advisor trusts the chips. */
const fundsFor = (query, shelf) => {
  const on = query.filter((q) => q.on);
  const added = on.filter((q) => q.kind === 'fund' && q.mode === 'add').map((q) => q.id);
  const dropped = on.filter((q) => q.kind === 'fund' && q.mode === 'drop').map((q) => q.id);
  const words = on.filter((q) => !q.kind).map((q) => q.label.toLowerCase());
  const ter = on.find((q) => q.kind === 'ter');
  return FUND_LIST.filter((f) => {
    if (dropped.includes(f.id)) return false;
    /* A fund named by hand is IN, whatever the filters say — that is what naming it means. */
    if (added.includes(f.id)) return true;
    if (shelf && !f.onShelf) return false;
    if (ter) { const p = perfOf(f.id); if (!p) return false; if (ter.op === 'lt' ? !(p.ter < ter.value) : !(p.ter > ter.value)) return false; }
    return words.every((label) => {
      if (label === 'direct plan') return f.plan === 'direct';
      if (label === 'regular plan') return f.plan === 'regular';
      return f.cat.toLowerCase() === label || f.bucket.toLowerCase() === label;
    });
  });
};
/* SORT IS A VIEW, NOT A FILTER — it never changes the count, which is the pair an advisor trusts. */
const sortFunds = (list, sort, period = 'r5') => {
  if (!sort) return list;
  const key = sort.key === 'return' ? period : sort.key;
  /* The score is not in PERF — it is computed from it — so it is the one key read from elsewhere. */
  const val = (f) => (key === 'score' ? (fundScore(f.id) || {}).value ?? null : (perfOf(f.id) || {})[key] ?? null);
  return [...list].sort((a, b) => {
    const x = val(a), y = val(b);
    if (x == null || y == null) return x == null ? 1 : -1;
    return sort.dir === 'asc' ? x - y : y - x;
  });
};


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

Object.assign(window, { FundInfo, FundScoreTurn, FUND_CHIPS, ASK_KINDS, askChips, CategoryTurn, ChangedTurn, HoldersTurn, holdersDetail, HOLD_CHIPS, HOLD_KINDS, holdAsk, HoldingsTurn, HoldingsShape, HoldingsSectors, HoldingsTop, HoldingsConcentration, HoldingsOverlap, FUND_VERBS, FundVerbs, ComparePicker, FundHandoff, VERB_SAYS, FundCompare, compareEntities, compareRows, compareVerdict, compareProvenance, REFINE_TERMS, refine, applyRefine, REFINE_MISS, refineAmbiguous, refineSaid, fundsFor, sortFunds, fundByWords, SORT_KEYS, FUND_EMPTY, FundResults, FUND_ASK, FUND_LIST, FUND_QUERY, FUND_COLUMNS, fundRows, heldLine, OVERLAP_FUNDS, OVERLAP_PROPERTIES, OVERLAP_CELLS, OVERLAP_FOOTNOTE, PERIOD_LABEL, sortSpan });
