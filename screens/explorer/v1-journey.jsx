/* VARIATION 1 — THE GUIDED JOURNEY, REBUILT AGAINST THE FUND DISCOVERY PRD.

   The first cut of this screen was rejected for a reason worth writing down: it rendered a stack of
   plain cards when the system already ships fifteen data components, and it answered the PRD with
   prose where the PRD asked for a chart, a table and a toggle between them. `DataTable` already has
   sorting, an expandable row, a filter slot and a show-all; `ChartLine` already scrubs and takes a
   target; `ChartBar` already runs horizontal; `CompareTable` already caps at three; `OverlapView`
   already draws the matrix with property pills. Almost everything the PRD asks for existed and was
   not used.

   WHAT THE PRD GOVERNS HERE. Fund Discovery — Chat Journey PRD (MF only): the fund one-pager's L1
   content list and its L2 behind "Show more"; the fund list's five default columns with multi-select
   actions; the two-level Asset Class → Category filter; comparison capped at three; the overlap
   matrix with its pills. Each section names the clause it answers.

   THE ONE PLACE THIS SCREEN DISAGREES WITH THE PRD, and says so rather than quietly complying: the
   PRD leads the one-pager with the Centricity Score. Sentinel's score is a design placeholder with
   invented weights, and a proprietary ranking is a research report under the research-analyst rules —
   it needs a registered owner and a published method, neither of which exists yet. So the score is
   rendered WITH its basis and marked as a placeholder rather than as the headline, and the headline is
   what the data can defend: what ₹10,000 became, against the benchmark and the category. */

const { useState: useS1 } = React;

/* ─── The PRD's two-level filter, Asset Class → Category, counts computed from the book ─────────── */
const ASSET_L1 = ['Equity', 'Debt', 'Hybrid', 'Index'];
const catsIn = (bucket) => {
  const inB = FUNDS.filter((f) => f.bucket === bucket);
  return Array.from(new Set(inB.map((f) => f.category)))
    .map((c) => ({ key: c, label: c, count: inB.filter((f) => f.category === c).length }));
};

/* ─── The fund list's five default columns — PRD §5, in its order ───────────────────────────────── */
const rollingAvg = (id) => { const p = perfOf(id); return p ? +(((p.r3 + p.r5) / 2)).toFixed(1) : null; };
/* RANK — AND WHY IT IS NOT THE PRD'S CATEGORY RANK ON THIS SHELF. The PRD sorts the fund list by
   Centricity Rank within the SEBI category, which is right against a universe of 1,739 funds. This
   book holds ten, one or two per category, so a category rank reads "1 of 1" on five rows and says
   nothing. Ranking inside the list the advisor is actually looking at is the honest version of the
   same idea at this size, and the narration says which one it is. `categoryRank` is kept because the
   fund page's peer line does want the category, where a real universe will make it meaningful. */
const categoryRank = (id) => {
  const f = fundById(id);
  const peers = FUNDS.filter((x) => x.category === f.category).sort((a, b) => perfOf(b.id).r3 - perfOf(a.id).r3);
  return { n: peers.findIndex((x) => x.id === id) + 1, of: peers.length };
};
const rankIn = (list, id) => {
  const ordered = list.slice().sort((a, b) => perfOf(b.id).r3 - perfOf(a.id).r3);
  return { n: ordered.findIndex((x) => x.id === id) + 1, of: ordered.length };
};
/* COLUMN ORDER IS NOT THE PRD'S, AND THE REASON IS DataTable'S OWN STRUCTURE. The PRD puts the
   checkbox before the rank. Here the STICKY column is the fund name — it has to be, or the name
   scrolls away from its own numbers — and DataTable renders the expand control inside that sticky
   cell, so a checkbox placed there would be a control inside a control. So the checkbox is the cell
   immediately after the name, which is where it lands visually anyway once sticky pulls the name to
   the left edge. Same reading order, no nested control. */
const LIST_COLS = [
  { key: 'name', label: 'Fund', kind: 'text', sticky: true, width: 148, sortable: true },
  { key: 'pick', label: '', kind: 'text', width: 40 },
  { key: 'rank', label: '#', kind: 'text', width: 40, align: 'end', sortable: true },
  { key: 'aum', label: 'AUM ₹cr', kind: 'number', align: 'end', sortable: true },
  { key: 'roll', label: '3Y roll', kind: 'percent', align: 'end', sortable: true },
  /* The path, not only the endpoint. Two funds on the same three-year return with different paths
     are not the same fund, and `DataTable` has declared this column kind since v1. */
  { key: 'path', label: '5Y path', kind: 'sparkline', width: 64 },
  { key: 'sharpe', label: 'Sharpe', kind: 'number', align: 'end', sortable: true },
];
const SORT_VAL = {
  rank: (id) => -perfOf(id).r3,
  name: (id) => fundById(id).name,
  aum: (id) => perfOf(id).aumCr,
  roll: (id) => rollingAvg(id),
  sharpe: (id) => riskOf(id).sharpe,
};
const SORT_WORDS = { rank: 'rank in this list', name: 'name', aum: 'fund size', roll: 'three-year rolling return', sharpe: 'Sharpe ratio' };

/* ─── Step 1 · Explore ──────────────────────────────────────────────────────────────────────────── */
/* SEARCH AND FILTER BELONG ON THE FIRST SCREEN, NOT ONLY ON THE LIST (the owner, 22 Sep: "main screen
   par bhi filter hona chahiye... ya koi particular fund dhundna ho"). The funnel is the right default
   for browsing and the wrong one for an advisor who already knows the fund — making them tap Mutual
   funds → Flexi cap to reach a name they could type is the tax this screen existed to remove.

   ONE FIELD, SEVERAL KINDS OF THING — the command-palette shape (Arc's bar, Raycast's list, and the
   cmdk pattern in the forge UI set the owner pointed at): typing matches fund names, houses and
   categories at once, and the results are GROUPED by what they are, because "HDFC" is three different
   answers and an advisor means one of them. A category match applies the filter; a fund match opens
   the fund; and each result carries the same checkbox the list does, so two can go straight to compare
   without visiting the list at all. */
function searchHits(q) {
  const t = q.trim().toLowerCase();
  if (!t) return { funds: [], amcs: [], cats: [] };
  const funds = FUNDS.filter((f) => f.name.toLowerCase().includes(t));
  const amcs = Array.from(new Set(FUNDS.filter((f) => f.amc.toLowerCase().includes(t)).map((f) => f.amc)));
  const cats = Array.from(new Set(FUNDS.filter((f) => f.category.toLowerCase().includes(t)).map((f) => f.category)));
  return { funds, amcs, cats };
}

function Explore({ onAsset, onPurpose, onOpen, onFilters, picked, onPick, onCompare, onOverlap, value }) {
  const [q, setQ] = useS1('');
  const hits = searchHits(q);
  const any = hits.funds.length + hits.amcs.length + hits.cats.length;
  const labels = filterLabels(value);
  /* THREAD, NOT PAGE — measured, not guessed. With the search field, the filter row, the four asset
     tiles and two purpose tiles this screen is 881px in an 812px phone, and `body='page'` does not
     scroll, so the composer was pushed off the bottom edge. ScreenScaffold says it itself: "a page
     that needs to scroll is a thread" (ScreenScaffold.jsx:102). A thread also supplies the gutter, so
     the hand-rolled padding goes with it. */
  return (
    <ScreenScaffold title="Explore" body="thread" anchor={0} onMenu={() => {}}
      composer={<Composer placeholder="Or just tell me what you need" onAttach={() => {}} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <SearchField value={q} onChange={setQ} onClear={() => setQ('')}
            placeholder="Find a fund, a house or a category" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
            <Pressable onClick={onFilters} label="Open filters"
              style={{ display: 'inline-flex', minHeight: 'var(--h-touch)', alignItems: 'center' }}>
              <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>
                {labels.length ? `Filters · ${labels.length} on` : 'Filters'}
              </span>
            </Pressable>
            {picked.length > 0 && (
              <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{picked.length} selected</span>
            )}
          </div>
          {labels.length > 0 && (
            <ChipRow>{labels.map((l) => <Pill key={l} tone="filter" size="sm" selected label={l} />)}</ChipRow>
          )}
          {picked.length >= 2 && (
            <InlineActionRow actions={[
              { label: `Compare ${picked.length}`, onClick: onCompare },
              { label: 'See overlap', onClick: onOverlap },
            ]} />
          )}
        </div>

        {/* Typing replaces the tiles: an advisor who is searching is not browsing. */}
        {q.trim() ? (
          any === 0 ? (
            <RejectCallout eyebrow="NOTHING BY THAT NAME"
              body={`No fund, house or category on this shelf matches “${q.trim()}”. The shelf holds ${FUNDS.length} funds today.`} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
              {hits.funds.length > 0 && (
                <div>
                  <Eyebrow>FUNDS · {hits.funds.length}</Eyebrow>
                  <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    {hits.funds.map((f) => {
                      const on = picked.includes(f.id);
                      return (
                        <div key={f.id} style={{ position: 'relative' }}>
                          <FundRow id={f.id} compact onOpen={() => onOpen(f.id)} />
                          <Pressable onClick={() => onPick(f.id)} label={`${on ? 'Deselect' : 'Select'} ${f.name}`}
                            style={{ position: 'absolute', bottom: 'var(--space-8)', right: 'var(--space-10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SelectionMark kind="checkbox" selected={on} />
                          </Pressable>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {hits.cats.length > 0 && (
                <div>
                  <Eyebrow>CATEGORIES</Eyebrow>
                  <div style={{ marginTop: 'var(--space-8)' }}>
                    <ChipRow>{hits.cats.map((c) => (
                      <Pill key={c} tone="filter" size="sm" label={`${c} · ${FUNDS.filter((f) => f.category === c).length}`}
                        onClick={() => onPurpose({ category: c })} />
                    ))}</ChipRow>
                  </div>
                </div>
              )}
              {hits.amcs.length > 0 && (
                <div>
                  <Eyebrow>FUND HOUSES</Eyebrow>
                  <div style={{ marginTop: 'var(--space-8)' }}>
                    <ChipRow>{hits.amcs.map((a) => (
                      <Pill key={a} tone="filter" size="sm" label={`${a} · ${FUNDS.filter((f) => f.amc === a).length}`}
                        onClick={() => onPurpose({ amc: a })} />
                    ))}</ChipRow>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
        <React.Fragment>
        <div>
          <Eyebrow>ASSET CLASS</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <IntentGrid>
              <IntentTile label="Mutual funds" count={FUNDS.length} note="Direct plans, on and off your shelf" onClick={() => onAsset('Equity')} />
              <IntentTile label="Bonds" unavailable unavailableNote="No feed yet — rating, yield and tenure are not on file." />
              <IntentTile label="PMS" unavailable unavailableNote="No feed yet — strategy, manager and benchmark are not on file." />
              <IntentTile label="AIF" unavailable unavailableNote="No feed yet — category, lock-in and PPM terms are not on file." />
            </IntentGrid>
          </div>
        </div>
        <div>
          <Eyebrow>OR START FROM A QUESTION</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <IntentTile label="Cheapest on your shelf" count={FUNDS.filter((f) => f.onShelf && perfOf(f.id).ter < 0.35).length}
              note="Under 0.35% expense, on your shelf" onClick={() => onPurpose({ ter: '0.35', shelf: 'on' })} />
            <IntentTile label="Nobody holds it yet" count={FUNDS.filter((f) => f.onShelf && holdersOf(f.id).length === 0).length}
              note="On your shelf, in no client's portfolio" onClick={() => onPurpose({ shelf: 'on' })} />
          </div>
        </div>
        </React.Fragment>
        )}
        <Provenance text={explorerProvenance()} />
      </div>
    </ScreenScaffold>
  );
}

/* ─── Step 2 · Category, the PRD's L2 filter ────────────────────────────────────────────────────── */
function Categories({ bucket, onBucket, onPick, onBack }) {
  /* PAGE, not thread. Measured: this screen is 812px in an 812px phone — it does not scroll, so as a
     thread it bottom-anchored and left the top half of the phone empty. `page` is for exactly this,
     and it owns its own padding. */
  return (
    <ScreenScaffold title={bucket} body="page" onMenu={onBack}
      composer={<Composer placeholder="Ask Sentinel" onAttach={() => {}} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', padding: `16px var(--gutter) 24px` }}>
        <SegmentedRow label="Asset class" options={ASSET_L1} value={bucket} onChange={onBucket} />
        <Eyebrow>CATEGORY</Eyebrow>
        <IntentGrid>
          {catsIn(bucket).map((c) => <IntentTile key={c.key} label={c.label} count={c.count} onClick={() => onPick(c.key)} />)}
        </IntentGrid>
        <Provenance text={explorerProvenance()} />
      </div>
    </ScreenScaffold>
  );
}

/* The expanded row: the peer line and the reverse lookup, which five columns cannot say. */
function FundPeek({ id, onOpen }) {
  const f = fundById(id), p = perfOf(id), cat = categoryAvgOf(id), held = holdersOf(id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <PeerLine value={p.r3} peer={cat.r3} period="3 years" peerLabel={`${f.category} average`} />
      <FigureRow label="Held by your clients" value={held.length ? held.join(' · ') : 'None yet'} weight="quiet" />
      <FigureRow label="Expense ratio" value={`${p.ter.toFixed(2)}%`} weight="quiet" />
      <DarkButton full label="Open the fund" onClick={onOpen} />
    </div>
  );
}

/* ─── Step 3 · The fund list — PRD §5 ───────────────────────────────────────────────────────────── */
/* CARDS OR A TABLE, AND THE ADVISOR CHOOSES (22 Sep 2026, the owner's question: "saare fund cards
   kahan dekhun"). The PRD's fund list is a table, and a table is right when the job is to SORT and
   COMPARE — five columns, one row each, scan down a number. It is wrong when the job is to BROWSE,
   because a row cannot carry the peer line, the reverse lookup or the shelf note, and those are the
   three things that make a fund legible at a glance. Every explorer in the reference set that people
   actually browse — Coin, Kuvera, One Digital, Groww — shows cards, and keeps the table for the
   screener. So both are here, over ONE list and ONE sort: the same funds, the same order, two
   densities. The toggle is a SegmentedRow because it changes how you look at one thing, not what you
   are looking at. */
function FundList({ view, onView, value, sort, onSort, onFilters, onOpen, onDrop, picked, onPick, onCompare, onOverlap }) {
  const list = applyFilters(value).slice();
  const dir = sort.dir === 'none' ? 'asc' : sort.dir;
  const get = SORT_VAL[sort.key] || SORT_VAL.rank;
  list.sort((a, b) => {
    const x = get(a.id), y = get(b.id);
    const c = typeof x === 'string' ? x.localeCompare(y) : x - y;
    return dir === 'asc' ? c : -c;
  });
  const labels = filterLabels(value);
  const rows = list.map((f) => {
    const p = perfOf(f.id), r = riskOf(f.id), rk = rankIn(list, f.id);
    return {
      id: f.id,
      /* SelectionMark is a MARK, not a control — it takes no handler. The tap target is the Pressable
         around it, in its own cell, away from the sticky cell's expand control. */
      pick: (
        <Pressable onClick={() => onPick(f.id)} label={`${picked.includes(f.id) ? 'Deselect' : 'Select'} ${f.name}`}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <SelectionMark kind="checkbox" selected={picked.includes(f.id)} />
        </Pressable>
      ),
      rank: String(rk.n),
      name: f.name,
      aum: p.aumCr.toLocaleString('en-IN'),
      roll: rollingAvg(f.id).toFixed(1),
      path: <ChartSpark points={(navSeries(f.id) || { fund: [] }).fund.map((pt) => pt.y)} label={`${f.name}, five years`} />,
      sharpe: r.sharpe.toFixed(2),
    };
  });
  return (
    <ScreenScaffold title="Explore" body="thread" anchor={0} onMenu={() => {}}
      composer={<Composer placeholder="Narrow it in a sentence" onAttach={() => {}} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        <SentinelBlock>
          <SentinelText text={list.length === 0
            ? 'Nothing matches every filter. Drop one and I will widen the search.'
            : `${list.length} funds match, ranked by three-year return within this list. Sorted by ${SORT_WORDS[sort.key]}, ${dir === 'asc' ? 'best first' : 'worst first'}.`} />
        </SentinelBlock>

        <SegmentedRow label="How to look at them" options={['Cards', 'Table']} value={view === 'cards' ? 'Cards' : 'Table'}
          onChange={(x) => onView(x === 'Cards' ? 'cards' : 'table')} />

        {view === 'cards' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* THE CHECKBOX IS A SIBLING OF THE CARD, NOT A CHILD OF IT. The card is itself a
                Pressable — tap anywhere to open the fund — so a second control inside it is a
                <button> inside a <button>: invalid DOM and the exact defect this repository already
                shipped once (F-? ArtifactCard wrapping DownloadAction). It is absolutely positioned
                over the card's top-right corner instead, which reads as inside and is not. */}
            {list.map((f) => {
              const on = picked.includes(f.id);
              return (
                <div key={f.id} style={{ position: 'relative' }}>
                  <FundRow id={f.id} onOpen={() => onOpen(f.id)} />
                  <Pressable onClick={() => onPick(f.id)}
                    label={`${on ? 'Deselect' : 'Select'} ${f.name}`}
                    /* BOTTOM-right, not top-right. Top-right is the convention and it is wrong here:
                       FundRow already right-aligns the expense ratio on its first line, and the mark
                       landed on top of the figure. Found by looking at the render. The card's
                       bottom-right is empty at every height, including the taller card a shelf note
                       makes. */
                    style={{ position: 'absolute', bottom: 'var(--space-8)', right: 'var(--space-10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SelectionMark kind="checkbox" selected={on} />
                  </Pressable>
                </div>
              );
            })}
          </div>
        ) : (
        <DataTable
          columns={LIST_COLS} rows={rows} density="compact" overflow="scroll"
          sort={sort} onSort={(key, d) => onSort({ key, dir: d === 'none' ? 'asc' : d })}
          filters={labels.length ? (
            <ChipRow>{labels.map((l) => <Pill key={l} tone="filter" size="sm" selected removable label={l} onClick={() => onDrop(l)} />)}</ChipRow>
          ) : null}
          expandable={(row) => <FundPeek id={row.id} onOpen={() => onOpen(row.id)} />}
          emptyState={{ title: 'Nothing matches every filter', body: 'Drop one and I will widen the search — under 0.3% expense and very high risk do not meet on this shelf.' }} />
        )}

        {picked.length >= 2 && (
          <InlineActionRow actions={[
            { label: `Compare ${picked.length}`, onClick: onCompare },
            { label: 'See overlap', onClick: onOverlap },
          ]} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onClick={onFilters} label="Open filters" style={{ display: 'inline-flex', minHeight: 'var(--h-touch)', alignItems: 'center' }}>
            <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>Filters</span>
          </Pressable>
          <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>{picked.length} selected</span>
        </div>
        <Provenance text={explorerProvenance()} />
      </div>
    </ScreenScaffold>
  );
}

/* ─── Step 4 · The fund one-pager — PRD §1 ──────────────────────────────────────────────────────── */
const PAGE_SECTIONS = [
  { id: 'returns', label: 'Returns' }, { id: 'score', label: 'Score' }, { id: 'stats', label: 'Statistics' },
  { id: 'mix', label: 'Composition' }, { id: 'clients', label: 'Your clients' }, { id: 'manager', label: 'Manager' },
];
const RANGE_OF = { r1: '1Y', r3: '3Y', r5: '5Y' };

function FundPage({ id, onBack, onCompare, onOverlap, onExplain, l2, onL2, openAt }) {
  const moreRef = React.useRef(null);
  const [active, setActive] = useS1(openAt || 'returns');
  const [period, setPeriod] = useS1('r3');
  const [asTable, setAsTable] = useS1(false);
  const [mix, setMix] = useS1('cap');
  const [slice, setSlice] = useS1(null);
  /* A REF PER SECTION, because SectionStrip was a control that did nothing. Until now `onJump` only
     moved the strip's own highlight: the chip lit up, the page stayed exactly where it was, and a
     reader who tapped 'Composition' was told the app had heard them and then shown the same screen.
     A control that reports success without acting is worse than one that is absent. */
  const secRefs = { returns: React.useRef(null), score: React.useRef(null), stats: React.useRef(null),
    mix: React.useRef(null), clients: React.useRef(null), manager: React.useRef(null) };
  const jump = (id) => {
    setActive(id);
    const n = secRefs[id] && secRefs[id].current;
    if (n && n.scrollIntoView) n.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const f = fundById(id), p = perfOf(id), cat = categoryAvgOf(id), r = riskOf(id), h = holdingsOf(id);
  const held = holdersOf(id), nav = navSeries(id), mgr = managerOf(id), rk = categoryRank(id);

  /* PRD §1.6: ONE chart, the breakdown switched by pills — the pills change the LENS, never the
     chart type, or they would mean two things at once. Three of the PRD's four lenses are in the
     book; the sub-sector split is L2 and has no feed, so it is not offered. */
  const capSum = h.caps.reduce((a, c) => a + c.pct, 0);
  const sect = h.sectors[h.asOf].slice(0, 5);
  const sectRest = +(100 - sect.reduce((a, x) => a + x.pct, 0)).toFixed(1);
  const MIX = {
    cap: h.caps.map((c) => ({ label: c.label, value: c.pct })).concat([{ label: 'Cash & other', value: +(100 - capSum).toFixed(1), tone: 'muted' }]),
    sector: sect.map((x) => ({ label: x.name, value: x.pct })).concat([{ label: `Other · ${h.concentration.sectorsCount - 5} sectors`, value: sectRest, tone: 'muted' }]),
    instrument: [{ label: 'Equity', value: h.split.equity }, { label: 'Cash & equivalents', value: h.split.debtCash, tone: 'muted' }],
  };

  return (
    <ScreenScaffold title={f.name} body="thread" onMenu={onBack}
      anchor={l2 ? moreRef : (openAt ? secRefs[openAt] : 0)} revision={l2 ? 'l2' : (openAt || 'l1')}
      composer={<Composer placeholder="Ask about this fund" onAttach={() => {}} />}>
      <div style={{ margin: `0 calc(-1 * var(--gutter))` }}>
        <SectionStrip sections={PAGE_SECTIONS} active={active} onJump={jump} />
      </div>

      {/* PRD §1 NARRATION — the considered view, before any number. */}
      <div style={{ marginTop: 'var(--space-12)' }}>
        <SentinelBlock>
          <SentinelText text={`${f.name} is ${rk.n === 1 ? 'the strongest' : `number ${rk.n} of ${rk.of}`} in ${f.category} on your shelf, on ${p.r3.toFixed(1)}% over three years against ${cat.r3.toFixed(1)}% for the category. It costs ${p.ter.toFixed(2)}% a year, and ${held.length ? `${held.length} of your clients already hold it` : 'no client of yours holds it yet'}.`} />
        </SentinelBlock>
      </div>

      <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {/* PRD §1.3 RETURNS — the line graph, its ranges, and the headline as what ₹10,000 became. */}
        <InfoCard
          name={f.name} meta={`${f.category} · ${f.plan === 'direct' ? 'Direct plan' : 'Regular plan'} · ${f.riskometer} risk`}
          shelf={f.onShelf ? 'on-shelf' : 'not-on-shelf'}
          figure={nav ? `₹${Math.round(nav.fund[nav.fund.length - 1].y).toLocaleString('en-IN')}` : undefined}
          figureNote={`₹10,000 five years ago · ${perfNote(period)} ${p[period].toFixed(1)}%`}
          compare={{ label: `${f.category} average`, value: `${cat[period].toFixed(1)}%`, gap: `${Math.abs(p[period] - cat[period]).toFixed(1)} pts`, behind: p[period] < cat[period] }}
          series={nav ? [{ label: 'This fund', points: nav.fund }, { label: p.benchmark, points: nav.bench, tone: 'muted' }] : undefined}
          /* THE CURVE IS RUPEES, NOT PERCENT, AND THE AXIS IS MONTHS, NOT INDICES. Found by looking:
             the readout printed "28268.0%" beside a wealth figure and the axis read 0 … 60. Both are
             the chart's defaults, and both are wrong for this series — which is rule 4's whole point,
             that a number carries its unit. NAV_SERIES is sixty monthly points ending at PERF_AS_OF. */
          valueFormat={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
          xFormat={(x) => { const d = new Date(2026, 8 - (60 - x)); return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); }}
          range={RANGE_OF[period]} ranges={['1Y', '3Y', '5Y']}
          onRange={(x) => setPeriod({ '1Y': 'r1', '3Y': 'r3', '5Y': 'r5' }[x])}
          stats={[
            { label: 'Expense ratio', value: `${p.ter.toFixed(2)}%` },
            { label: 'Fund size', value: `₹${p.aumCr.toLocaleString('en-IN')} cr` },
            { label: 'Exit load', value: f.exitLoad },
            { label: 'Held by your clients', value: String(held.length) },
          ]}
          onExplain={onExplain}
          provenance={perfProvenance()} />

        {/* PRD §1.3: "both line graph and table: toggle-able" — one row for the fund, one for its
            benchmark, one for its category. */}
        <Pressable onClick={() => setAsTable((v) => !v)} label={asTable ? 'Hide the table' : 'Show the same returns as a table'}
          style={{ display: 'flex', minHeight: 'var(--h-touch)', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ font: 'var(--type-meta-font)', color: 'var(--color-bronze-deep)' }}>{asTable ? 'Hide the table' : 'Show as a table'}</span>
        </Pressable>
        {asTable && (
          <DataTable density="compact" overflow="scroll"
            columns={[{ key: 'w', label: 'Average CAGR', kind: 'text', sticky: true, width: 132 },
              { key: 'r1', label: '1Y', kind: 'percent', align: 'end' },
              { key: 'r3', label: '3Y', kind: 'percent', align: 'end' },
              { key: 'r5', label: '5Y', kind: 'percent', align: 'end' }]}
            rows={[
              { id: 'f', w: 'This fund', r1: p.r1.toFixed(1), r3: p.r3.toFixed(1), r5: p.r5.toFixed(1) },
              { id: 'b', w: p.benchmark, r1: '——', r3: '——', r5: '——' },
              { id: 'c', w: `${f.category} average`, r1: cat.r1.toFixed(1), r3: cat.r3.toFixed(1), r5: cat.r5.toFixed(1) },
            ]}
            emptyState={{ title: 'No returns on file' }} />
        )}

        {/* PRD §1.2 CENTRICITY SCORE — with its basis, and marked for what it is. */}
        <Surface ref={secRefs.score}>
          <Eyebrow>CENTRICITY SCORE</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <FigureRow label={`Rank ${rk.n} of ${rk.of} in ${f.category}`} value="Placeholder"
              sub={{ label: 'What it means', value: p.r3 > cat.r3 ? 'Ahead of its category on three years' : 'Behind its category on three years' }} />
          </div>
          <div style={{ marginTop: 'var(--space-10)' }}>
            <ConstraintCallout eyebrow="BEFORE YOU USE THIS"
              body="The score's weights are a design placeholder, and a proprietary ranking is a research report needing a registered owner and a published method. The rank above is a fact about this shelf — the fund's three-year return against its peers here. Nothing else is claimed." />
          </div>
        </Surface>

        {/* PRD §1.4 STATISTICS — top five, each with an info icon that says how to JUDGE it. */}
        <Surface ref={secRefs.stats}>
          <Eyebrow>STATISTICS</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
            <StatTile label="Sharpe ratio" value={r.sharpe.toFixed(2)} note="Return per unit of swing" onExplain={() => onExplain('Sharpe ratio')} />
            <StatTile label="Max drawdown" value={`${r.maxDD.toFixed(1)}%`} note="Deepest fall from a peak" onExplain={() => onExplain('Max drawdown')} />
            <StatTile label="Volatility" value={`${r.sd.toFixed(1)}%`} note="Annualised" onExplain={() => onExplain('Volatility')} />
            <StatTile label="Beta" value="——" locked note="Not on file" onExplain={() => onExplain('Beta')} />
          </div>
          <div style={{ marginTop: 'var(--space-8)' }}><Provenance text={riskProvenance()} /></div>
        </Surface>

        {/* PRD §1.6 COMPOSITION — a ring, switched by pills. It was a horizontal bar chart until the
            owner pointed out that the explorer is where the data visuals should live and the donut
            was sitting on a spec page and nowhere else. A ring is the right shape for this question
            and a bar is not: every breakdown here is a SHARE OF ONE WHOLE that sums to 100, which is
            what a ring says in its geometry and a bar only says in its labels — and the component's
            own rule (four to six segments, past that a bar wins) is satisfied by all three lenses,
            market cap at four, instrument at two, sector at five and an Other. The hole carries the
            holding count, which is the thing a reader came for and a bar chart had nowhere to put.
            `max` is the row count so the ring never re-folds an Other the fixture already folded. */}
        <Surface ref={secRefs.mix}>
          <Eyebrow>COMPOSITION</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <SegmentedRow label="Breakdown" options={['Market cap', 'Sector', 'Instrument']}
              value={{ cap: 'Market cap', sector: 'Sector', instrument: 'Instrument' }[mix]}
              onChange={(x) => setMix({ 'Market cap': 'cap', Sector: 'sector', Instrument: 'instrument' }[x])} />
          </div>
          <div style={{ marginTop: 'var(--space-12)' }}>
            <ChartDonut slices={MIX[mix]} max={MIX[mix].length}
              center={String(h.count)} centerNote="holdings"
              selected={slice} onSelect={(l) => setSlice(l === slice ? null : l)}
              caveat={`as of ${h.asOf}`} />
          </div>
          <div style={{ marginTop: 'var(--space-8)' }}><Provenance text={holdingsProvenance()} /></div>
        </Surface>

        <Surface ref={secRefs.clients}>
          <Eyebrow>YOUR CLIENTS</Eyebrow>
          <p style={{ margin: `var(--space-8) 0 0`, font: 'var(--type-body-font)', color: 'var(--color-ink)' }}>
            {held.length ? `${held.length} of your clients already hold this — ${held.join(' · ')}.` : 'None of your clients hold this.'}
          </p>
        </Surface>

        {/* PRD §1.5 FUND MANAGER. */}
        <Surface ref={secRefs.manager}>
          <Eyebrow>FUND MANAGER</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <FigureRow label={mgr.name} value={`${mgr.years.toFixed(1)} years on this fund`} sub={{ label: 'Managing since', value: mgr.since }} />
          </div>
          <div style={{ marginTop: 'var(--space-8)' }}><Provenance text={managerProvenance()} /></div>
        </Surface>

        {/* PRD: "L1 is the first view; L2 is shown when Show More is clicked." */}
        {!l2 ? (
          <DarkButton full label="Show more" onClick={() => onL2(true)} />
        ) : (
          <Surface>
            <span ref={moreRef} />
            <Eyebrow>MORE</Eyebrow>
            <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
              <FigureRow label="Instrument type" value="Open-ended" />
              <FigureRow label="Top five holdings" value={`${h.concentration.top5CompaniesPct.toFixed(1)}% of the fund`}
                sub={{ label: 'Largest', value: `${h.concentration.largestCompany.name} · ${h.concentration.largestCompany.pct.toFixed(1)}%` }} />
              <FigureRow label="Sectors held" value={String(h.concentration.sectorsCount)}
                sub={{ label: 'Largest', value: `${h.concentration.largestSector.name} · ${h.concentration.largestSector.pct.toFixed(1)}%` }} />
            </div>
            <div style={{ marginTop: 'var(--space-10)' }}>
              <ConstraintCallout eyebrow="ON THE PRD'S L2 LIST, NOT ON FILE"
                body="Rolling-return windows, Sortino, active share, portfolio turnover and the fund's P/E have no feed. Named here rather than left out, so the gap is visible." />
            </div>
          </Surface>
        )}

        {/* PRD §1: the follow-ups an advisor takes from a one-pager. FollowUpRow takes the QUESTION
            an advisor would ask, not a button label — the two journeys it opens are the same ones the
            list's multi-select reaches. */}
        <FollowUpRow label="Next" items={['Compare with another fund', 'Overlap with another fund']}
          onAsk={(q) => (q.indexOf('Overlap') === 0 ? onOverlap() : onCompare())} />
        <StandingDisclosure />
      </div>
    </ScreenScaffold>
  );
}

/* ─── Step 5 · Compare — PRD §2, capped at three ────────────────────────────────────────────────── */
function Compare({ ids, onBack, onAdd }) {
  const entities = ids.map((id) => ({ id, name: fundById(id).name, meta: `${fundById(id).amc} · ${fundById(id).category}` }));
  const v = (fn) => Object.fromEntries(ids.map((id) => [id, fn(id)]));
  const rows = [
    { label: 'Rank in category', values: v((id) => { const r = categoryRank(id); return `${r.n} of ${r.of}`; }) },
    { label: '3-year return', values: v((id) => `${perfOf(id).r3.toFixed(1)}%`), better: 'high' },
    { label: 'Category average', values: v((id) => `${categoryAvgOf(id).r3.toFixed(1)}%`) },
    { label: 'Expense ratio', values: v((id) => `${perfOf(id).ter.toFixed(2)}%`), better: 'low' },
    { label: 'Fund size', values: v((id) => `₹${perfOf(id).aumCr.toLocaleString('en-IN')} cr`) },
    { label: 'Sharpe ratio', values: v((id) => riskOf(id).sharpe.toFixed(2)), better: 'high' },
    { label: 'Max drawdown', values: v((id) => `${riskOf(id).maxDD.toFixed(1)}%`), better: 'high' },
    { label: 'Volatility', values: v((id) => `${riskOf(id).sd.toFixed(1)}%`), better: 'low' },
    { label: 'Held by your clients', values: v((id) => holdersOf(id).length ? holdersOf(id).join(', ') : 'None') },
    { label: 'Exit load', values: v((id) => fundById(id).exitLoad) },
  ];
  const [a, b] = ids;
  const verdict = !b ? 'Pick a second fund to compare.' : (() => {
    const cheap = perfOf(a).ter <= perfOf(b).ter ? a : b;
    const strong = perfOf(a).r3 >= perfOf(b).r3 ? a : b;
    return cheap === strong
      ? `${fundById(cheap).name} is both cheaper and ahead on three years.`
      : `${fundById(cheap).name} is cheaper; ${fundById(strong).name} is ahead on three years — ${Math.abs(perfOf(a).r3 - perfOf(b).r3).toFixed(1)} points, for ${Math.abs(perfOf(a).ter - perfOf(b).ter).toFixed(2)}% more cost a year.`;
  })();
  return (
    <ScreenScaffold title="Compare" body="thread" anchor={0} onMenu={onBack}
      composer={<Composer placeholder="Ask about these funds" onAttach={() => {}} />}>
      <SentinelBlock><SentinelText text={verdict} /></SentinelBlock>
      <div style={{ marginTop: 'var(--space-12)' }}>
        <CompareTable entities={entities} rows={rows} cap={3} onAdd={onAdd} addLabel="Add a fund"
          capNote="Three is the ceiling on a phone. For more, the comparison downloads rather than renders."
          footnote={comparisonProvenance()} />
      </div>
      <div style={{ marginTop: 'var(--space-12)' }}><StandingDisclosure /></div>
    </ScreenScaffold>
  );
}

/* ─── Step 6 · Overlap — PRD §3 ─────────────────────────────────────────────────────────────────── */
function Overlap({ ids, onBack }) {
  const [prop, setProp] = useS1('top10');
  const funds = FUNDS.filter((f) => holdingsOf(f.id)).map((f) => ({ id: f.id, name: f.name, inComparison: ids.includes(f.id) }));
  const cells = [];
  ids.forEach((a) => ids.forEach((b) => { if (a < b) cells.push({ a, b, pct: overlapPct(a, b) }); }));
  const worst = cells.filter((c) => c.pct != null).sort((x, y) => y.pct - x.pct)[0];
  /* The names behind the number, from the same two lists it was computed from. */
  const shared = (() => {
    if (ids.length < 2) return [];
    const A = holdingsOf(ids[0]), B = holdingsOf(ids[1]);
    if (!A || !B) return [];
    const wb = Object.fromEntries(B.top.map((h) => [h.name, h.pct]));
    return A.top.filter((h) => wb[h.name] != null)
      .map((h) => ({ name: h.name, sector: h.sector, a: h.pct, b: wb[h.name] }))
      .sort((x, y) => Math.min(y.a, y.b) - Math.min(x.a, x.b)).slice(0, 5);
  })();
  return (
    <ScreenScaffold title="Overlap" body="thread" anchor={0} onMenu={onBack}
      composer={<Composer placeholder="Ask about the overlap" onAttach={() => {}} />}>
      <SentinelBlock>
        <SentinelText text={worst
          ? `${fundById(worst.a).name} and ${fundById(worst.b).name} share ${worst.pct.toFixed(0)}% of their top holdings — ${worst.pct >= 60 ? 'significant overlap, so the second adds cost more than diversification' : worst.pct >= 20 ? 'meaningful overlap; they are not independent bets' : 'little overlap, so they diversify each other'}.`
          : 'No holdings on file for these funds, so the overlap cannot be computed.'} />
      </SentinelBlock>
      <div style={{ marginTop: 'var(--space-12)' }}>
        {/* PAIRS FOR TWO, MATRIX FOR THREE. Looked at it: with two funds a matrix is a single cell,
            and the component draws a column header over one value with the row label beside it —
            correct but unreadable, and half the screen empty. `pairs` is what two funds are. */}
        <OverlapView mode={ids.length > 2 ? 'matrix' : 'pairs'} funds={funds} cells={cells}
          properties={[
            { id: 'top10', label: 'Top holdings', active: prop === 'top10' },
            { id: 'sector', label: 'Sector', active: prop === 'sector' },
            { id: 'market-cap', label: 'Market cap', active: prop === 'market-cap' },
          ]}
          onToggleProperty={setProp} maxFunds={3} footnote={holdingsProvenance()} />
      </div>

      {/* PRD §3: "which are the largest overlapping stocks". The percentage says how much; this says
          WHAT, which is the half an advisor repeats to a client. Computed from the same two top-ten
          lists the percentage is computed from, so the two cannot disagree. */}
      {shared.length > 0 && (
        <div style={{ marginTop: 'var(--space-12)' }}>
          <Surface>
            <Eyebrow>THE STOCKS THEY SHARE</Eyebrow>
            <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {shared.map((h) => (
                <FigureRow key={h.name} label={h.name} value={`${h.a.toFixed(1)}% · ${h.b.toFixed(1)}%`}
                  sub={{ label: h.sector, value: `${Math.min(h.a, h.b).toFixed(1)}% counts as overlap` }} />
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-8)' }}>
              <Provenance text={`top-ten holdings of each · ${fundById(ids[0]).name} first, ${fundById(ids[1]).name} second`} />
            </div>
          </Surface>
        </div>
      )}
      <div style={{ marginTop: 'var(--space-12)' }}><StandingDisclosure /></div>
    </ScreenScaffold>
  );
}

/* ─── The journey, driven ───────────────────────────────────────────────────────────────────────── */
const EXPLAIN = {
  'Sharpe ratio': ['Return earned for each unit of volatility.', 'Higher is better. Below 1 means the ride was rough for what it paid.'],
  'Max drawdown': ['The deepest fall from a peak in this window.', 'This is the loss a client would have had to sit through without selling.'],
  'Volatility': ['How far monthly returns swing from their average, annualised.', 'Higher means a bumpier ride, not a worse fund.'],
  'Beta': ['Movement against the benchmark. Above 1 amplifies the index both ways.',
    'Not on file. The fixture draws a fund and its benchmark as separate paths, so anything measured against the benchmark is undefined until a real series arrives.'],
};

function V1({ start = 'explore', startValue, startPicked = [], startId = 'ppfas-flexi', startL2 = false, startFilters = false, startView = 'cards', startAt }) {
  const [step, setStep] = useS1(start);
  const [bucket, setBucket] = useS1('Equity');
  /* NO FILTER IS APPLIED BEFORE THE ADVISOR APPLIES ONE. The first cut seeded { bucket: ['Equity'] },
     so the entry screen opened saying "Filters · 1 on" with an Equity chip nobody had chosen — the
     screen answering a question it had not been asked. */
  const [value, setValue] = useS1(startValue || {});
  const [sort, setSort] = useS1({ key: 'rank', dir: 'asc' });
  const [view, setView] = useS1(startView);
  const [filters, setFilters] = useS1(startFilters);
  const [picked, setPicked] = useS1(startPicked);
  const [openId, setOpenId] = useS1(startId);
  const [l2, setL2] = useS1(startL2);
  const [explain, setExplain] = useS1(null);
  const togglePick = (id) => setPicked((s) => s.includes(id) ? s.filter((x) => x !== id) : s.concat(id).slice(-3));
  const pair = picked.length >= 2 ? picked : ['ppfas-flexi', 'hdfc-flexi'];

  const sheets = (
    <React.Fragment>
      <FilterSheet open={filters} groups={filterGroups(value)} value={value} resultCount={applyFilters(value).length}
        onChange={(k, x) => setValue((s) => ({ ...s, [k]: x }))} onClearAll={() => setValue({})}
        onApply={() => setFilters(false)} onClose={() => setFilters(false)} />
      <ExplainerSheet open={!!explain} title={explain || ''} onClose={() => setExplain(null)}
        body={EXPLAIN[explain] || ['Computed from your own clients’ holdings and running SIPs, so it cannot drift from the portfolios the other journeys render.']} />
    </React.Fragment>
  );

  let screen;
  if (step === 'explore') screen = <Explore value={value} picked={picked} onPick={togglePick}
    onAsset={(b) => { setBucket(b); setValue({ bucket: [b] }); setStep('cats'); }}
    onPurpose={(v) => { setValue(v); setStep('list'); }}
    onOpen={(id) => { setOpenId(id); setL2(false); setStep('fund'); }}
    onFilters={() => setFilters(true)}
    onCompare={() => setStep('compare')} onOverlap={() => setStep('overlap')} />;
  else if (step === 'cats') screen = <Categories bucket={bucket} onBucket={(b) => { setBucket(b); setValue({ bucket: [b] }); }} onBack={() => setStep('explore')} onPick={() => setStep('list')} />;
  else if (step === 'fund') screen = <FundPage id={openId} l2={l2} onL2={setL2} openAt={startAt} onBack={() => setStep('list')} onExplain={setExplain}
    onCompare={() => { setPicked([openId, openId === 'ppfas-flexi' ? 'hdfc-flexi' : 'ppfas-flexi']); setStep('compare'); }}
    onOverlap={() => { setPicked([openId, openId === 'ppfas-flexi' ? 'hdfc-flexi' : 'ppfas-flexi']); setStep('overlap'); }} />;
  else if (step === 'compare') screen = <Compare ids={pair} onBack={() => setStep('list')} onAdd={() => setStep('list')} />;
  else if (step === 'overlap') screen = <Overlap ids={pair} onBack={() => setStep('list')} />;
  else screen = <FundList view={view} onView={setView} value={value} sort={sort} onSort={setSort} onFilters={() => setFilters(true)}
    onOpen={(id) => { setOpenId(id); setL2(false); setStep('fund'); }} onDrop={() => setValue({})}
    picked={picked} onPick={togglePick} onCompare={() => setStep('compare')} onOverlap={() => setStep('overlap')} />;

  return <React.Fragment>{screen}{sheets}</React.Fragment>;
}

function App_V1() {
  return (
    <ScreenShell journey="Fund explorer" n="Variation 1" name="The guided journey"
      job="Rebuilt against the Fund Discovery PRD: two levels to a sortable table with the PRD's five default columns, a one-pager that carries the line graph AND the table it toggles to, statistics with an info icon that says how to judge them, one horizontal bar chart switched by pills, comparison capped at three, and the overlap matrix. Ask Sentinel stays at the foot of every step — the journey is navigable, not only typed."
      without="reads five numbers with nothing to judge them against, and leaves the product to find the sixth.">

      <Section title="The journey, end to end" sub="Live. Mutual funds → a category → the table. Tap a row to expand it, the checkbox to select two, then Compare or See overlap. Open a fund; toggle its chart to a table; switch the composition pills; Show more for L2; tap a statistic's info for how to judge it.">
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}><PhoneFrame><V1 /></PhoneFrame></div>
      </Section>

      <Section title="Steps 1 and 2 · the PRD's two-level filter, with counts"
        sub="Asset class, then category — the shape every Indian funnel that works uses, and the one One Digital already uses. Four of the five asset classes have no feed and name the missing one rather than showing a zero.">
        <StateRow>
          <State label="Explore" note="Asset tiles and two purpose tiles, each a named pre-filled filter set."><V1 start="explore" /></State>
          <State label="Category" note="Counts computed from the book, so a tile can never promise rows it does not have."><V1 start="cats" /></State>
        </StateRow>
      </Section>

      <Section title="Step 3 · the fund list — PRD §5"
        sub="TWO densities over one list: cards to browse, a table to sort and compare — the same funds in the same order. The table is the PRD's five default columns. Sortable on every column; the row expands to the peer line and the reverse lookup that five columns cannot carry; two or more selected surfaces Compare and See overlap — and not before, because an action bar with nothing to act on is chrome.">
        <StateRow>
          <State label="Cards — to browse" note="The default. A card carries the peer line, who already holds it and the shelf note; a row cannot. This is where an advisor reads every fund."><V1 start="list" startView="cards" /></State>
          <State label="Table — to sort and compare" note="DataTable does the sorting, the sticky fund column and the expandable row. Same funds, same order, five columns."><V1 start="list" startView="table" /></State>
          {/* Filtered to the two flexi caps on purpose: with ten rows the action row sat below the
              fold and the state showed two ticks and no actions — a picture of the thing it is meant
              to demonstrate, missing the thing. */}
          <State label="Two selected" tone="under" note="The actions appear with the second checkbox, capped at three — the PRD's own ceiling."><V1 start="list" startView="table" startValue={{ category: 'Flexi cap' }} startPicked={['ppfas-flexi','hdfc-flexi']} /></State>
          <State label="Filters" note="Bands with counts; the commit carries the number the list will show."><V1 start="list" startFilters /></State>
        </StateRow>
      </Section>

      <Section title="Step 4 · the fund one-pager — PRD §1"
        sub="Narration first, then the headline as what ₹10,000 became, the curve against its benchmark with ranges, the score WITH its basis, four statistics each with an info icon, the composition as a ring switched by pills, the reverse lookup, the manager — and Show more for L2.">
        <StateRow>
          <State label="L1" note="Everything an advisor needs before they open their mouth."><V1 start="fund" /></State>
          <State label="COMPOSITION" note="The section strip jumps here for real now. A ring, not a bar: every lens sums to one whole, and the hole carries the holding count. Tap a legend row to push its segment out — it is never recoloured."><V1 start="fund" startAt="mix" /></State>
          <State label="L2" tone="under" note="Show more opens the second level and names the L2 metrics that have no feed rather than leaving them out."><V1 start="fund" startL2 /></State>
        </StateRow>
      </Section>

      <Section title="Steps 5 and 6 · compare and overlap — PRD §2 and §3"
        sub="A verdict sentence before the grid, three funds maximum with the cap stated, and the overlap matrix with its property pills. Both are reached from the list's selection or from a follow-up on the fund page.">
        <StateRow>
          <State label="Compare" note="CompareTable marks the better cell only where direction is a fact — cheaper is better; a deeper drawdown is not."><V1 start="compare" startPicked={['ppfas-flexi','hdfc-flexi']} /></State>
          <State label="Overlap" note="The matrix, with the band said in words above it. A pair with no holdings feed renders an em dash, never a zero."><V1 start="overlap" startPicked={['ppfas-flexi','hdfc-flexi']} /></State>
        </StateRow>
      </Section>

      {/* THE RESEARCH, WHERE THE DESIGN CAN BE SEEN (22 Sep 2026, the owner: "fable ne itni research
          kiya tha uska use to mujhe kahi laga nai"). Every row below is a decision on this screen and
          the evidence that forced it. The research is not a folder of documents beside the design; it
          is the reason each of these is the way it is, and it belongs where the design is. */}
      <Section title="What the research changed, line by line"
        sub="231 mined verbatims, 30+ Indian products torn down, 66 reference screens and the 2026 SEBI floor. Each row is a thing on this screen and the finding that put it there — not a document you have to go and read.">
        <Table head={['On this screen', 'The finding', 'Where it came from']} rows={[
          ['The peer line under every fund', 'Every explorer that survived contact gives a fund its category context ON ARRIVAL — INDmoney ranks inside the SEBI category, Groww carries Returns and Rankings, Kuvera opens Comparison pre-filled with four peers. A fund shown alone is a number.', 'Kabir · teardown §F.1'],
          ['“Held by Meera Nair · R. Sharma” on line one', 'NOBODY ships “not already held by this client” — not Morningstar’s X-ray, not Prudent edge+, not AssetPlus’s CAS import. Sentinel already reads the book, so it is free and uncontested.', 'Kabir · §I.6'],
          ['Bands, not sliders, in the filter', 'GoldenPi and IndiaBonds both run three or four NAMED bands where a desktop tool puts a slider — “AAA (Low risk)”, “8–11%”. A slider is a fine motor task mid-call and cannot carry a count.', 'Kabir · §F, bond explorers'],
          ['A count beside every option, and on the commit', 'Option counts and a live count on the apply control are the two highest-impact things a filter interface can do. Coin ships “View 1,731 funds”; One Digital ships “Equity 612 funds”.', 'Baymard, via Noor §E'],
          ['Intent tiles on the entry screen', 'Ten of the eleven guided paths in the Indian market are a SEPARATE surface from the screener. GoldenPi’s purpose tiles are the one that lives inside it.', 'Kabir · §H'],
          ['Two levels to a counted list, path as chips', 'Every funnel that works stops at two before a counted list — Coin, Kuvera, One Digital — and shows the path as chips on the list head, never a breadcrumb.', 'Noor · §B'],
          ['The fund page is one scroll with a sticky strip', 'A fund page is a CROSS-REFERENCE task, and the usability evidence against tabs is about exactly that: switching back and forth taxes memory and interaction cost. Groww’s four tabs are the Indian convention that causes it.', 'NN/g, via Noor §C'],
          ['Compare capped at three, verdict before the grid', 'A phone comfortably holds two side by side, five is the table ceiling — and Groww turned compare OFF in its app rather than ship three columns. INDmoney opens every compare with pros and cons.', 'NN/g + INDmoney, via Noor §D'],
          ['No “Recommended”, no auto-ranked default', 'An AMFI-registered distributor may not auto-display a ranking; filtering on criteria the advisor chose is permitted. The Fifth Schedule bars rankings in advertisements outright.', 'Anaya · §2.1, §2.3'],
          ['The score shown with its basis, marked placeholder', 'A proprietary score is a research report under the research-analyst rules — registered owner, published method. Sentinel’s weights are invented and the card says PLACEHOLDER twice.', 'Anaya · §2.4'],
          ['Beta and capture withheld, in words', 'What the product cannot say, it says. Computed from this fixture they came out at beta 0.03 and −512% down-capture, because the NAV series draws fund and benchmark as separate paths.', 'Measured here, 22 Sep'],
          ['Why none of this leads with “recommendation”', 'The LARGEST theme across 231 verbatims is not people who got no recommendation — it is people who GOT one and did not trust it (n=29, severity 4). The journey’s low point is Decide, not Search.', 'Ira · insight report §2, §5'],
        ]} />
      </Section>

      <Note title="Where this screen disagrees with the PRD, and why">
        The PRD leads the one-pager with the <strong>Centricity Score</strong>. Sentinel's score is a
        design placeholder with invented weights, and a proprietary ranking is a research report needing
        a registered owner and a published method, neither of which exists. So the score is rendered
        <em> with</em> its basis and marked for what it is, and the headline is what the data can
        defend. When compliance rules on it, promoting it is a one-line change.
        <br /><br />
        <strong>Beta and the capture ratios are withheld.</strong> They were computed and came out at
        beta 0.03 and a down-capture of −512% — not a near-miss, but what you get because the NAV
        fixture draws a fund and its benchmark as separate random walks with only the five-year endpoint
        tied. Anything measured against the benchmark is undefined until that series is regenerated with
        a real relationship, or a real feed arrives. Volatility, Sharpe and max drawdown read off one
        curve and are kept.
      </Note>
    </ScreenShell>
  );
}

/* The prototype page loads all three variation files, so each publishes its component and mounts its
   own board ONLY when it is the page being opened. */
Object.assign(window, { V1 });
if (!window.__EXPLORER_PROTOTYPE) mountScreen(<App_V1 />);
