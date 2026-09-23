/* FUND EXPLORER · V1 — THE FUNNEL.

   Rebuilt on 23 Sep 2026 against the owner's own sketch and against the real product catalogue. The
   first build was a sequence of SCREENS — explore, categories, list, fund page — and his note was
   that the stitch was wrong: four questions, four navigations, and the answers left behind each
   time. The ruling that replaced it is one sentence: everything on ONE screen, in one thread,
   nothing opening a second, and the fund's page opening inside the list rather than over it.

   SO THE SCREEN IS FOUR QUESTIONS AND A LIST, and the questions collapse into their own answers:

       (1) Asset class   Equity · Debt +2            60 funds   <- StepBlock, closed, carrying it
       (2) Product       Mutual fund                 10 funds
       (3) Category      Large Cap Fund               4 funds
       ------------------------------------------------------
       [ search · active filters · Filters ]                    <- always on screen, never a detour
       FundCard · FundCard · FundCard                           <- each opens its page IN PLACE

   EVERY LEVEL IS A FUNCTION OF THE ONE ABOVE, computed from the catalogue rather than written down:
   `familiesForAssets` decides which products exist under the chosen assets, `categoriesFor` which
   categories exist under those products, and both carry the count they will actually yield. A
   category that would open an empty list is not offered — which is only possible because the counts
   are derived. The first build hard-coded four asset names and three categories and they drifted
   from the data within a day.

   WHAT THE CARDS MAY PRINT IS ASKED, NOT ASSUMED. `shapeOf(id)` answers it per instrument, because
   four of the catalogue's eight families have no return, no AUM and no series at all. A bond's
   headline is its coupon; an FD whose rate is not on file says so. See `cardFor` below — it is the
   whole of the product's honesty about this data, in one function.

   THE COMPOSER IS NOT THE NAVIGATION. The owner's note: it does not all have to be chat, but "Ask
   Sentinel" is always at the bottom. So the funnel is operated by tapping and the composer is the
   escape hatch for the thing the funnel cannot ask — which is what a composer is for. */

const { useState: useS1 } = React;

/* ─── Formatting. Indian grouping, one decimal, and never a zero standing in for a gap ──────────── */
const crore = (n) => (n == null ? null : `₹${Math.round(n / 1e7).toLocaleString('en-IN')} Cr`);
const pc = (n) => (n == null ? null : `${n < 0 ? '−' : ''}${Math.abs(n).toFixed(2)}%`);
const rupees = (n) => (n == null ? null : `₹${Math.round(n).toLocaleString('en-IN')}`);
const monthYear = (iso) => {
  if (!iso) return null;
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : `${M[d.getMonth()]} ${d.getFullYear()}`;
};
/* Two letters for the AMC disc. Words, not characters — "Canara Robeco" is CR and "UTI" is UT, and
   slicing the first two characters would have given "Ca" and "UT". */
const initials = (s) => (s || '?').replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/)
  .slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

/* ─── WHAT THIS KIND OF INSTRUMENT'S CARD SAYS ──────────────────────────────────────────────────
   One function, because the alternative is each screen deciding again and a bond eventually getting
   a fund's card somewhere. Everything here is guarded by what the catalogue actually holds. */
function cardFor(i) {
  const p = onePagerOf(i.id) || {};
  const s = shapeOf(i.id);
  const chips = [];
  if (i.instrumentType) chips.push(i.instrumentType);

  let headline = null;
  const facts = [];

  if (s.hasReturn) {
    /* Three years where there are three, otherwise one — and the label says which, because a figure
       whose window is not stated is not a figure. */
    const y3 = i.returns?.y3, y1 = i.returns?.y1;
    headline = y3 != null ? { value: pc(y3), label: '3Y return' } : { value: pc(y1), label: '1Y return' };
  } else if (p.coupon != null) {
    headline = { value: `${p.coupon.toFixed(2)}%`, label: 'Coupon' };
  } else if (p.dividendYield != null) {
    headline = { value: `${p.dividendYield.toFixed(2)}%`, label: 'Dividend yield' };
  }

  if (s.hasAum) facts.push({ label: 'AUM', value: crore(i.aum) });
  if (s.hasTer) facts.push({ label: 'TER', value: `${i.ter.toFixed(2)}%` });
  if (p.maturity) facts.push({ label: 'Matures', value: monthYear(p.maturity) });
  if (p.faceValue != null && facts.length < 2) facts.push({ label: 'Face value', value: rupees(p.faceValue) });
  if (!facts.length && i.price != null) facts.push({ label: 'Price', value: rupees(i.price) });
  /* THE LAST RESORT IS A SENTENCE, NOT AN EMPTY CARD. Suryoday's FD carries its name and nothing
     else; its own record names `rate_of_interest` as pending. A card with no facts at all would read
     as a rendering failure, so the gap is printed as the fact it is. */
  if (!facts.length && !headline) facts.push({ label: 'Rate', value: 'not on file' });

  /* THE SUB LINE IS DEDUPED. `subTypeLabel` and `category` are frequently the same fact twice —
     "Non-Convertible Debenture" and "Non-Convertible Debentures" — and a card that prints both reads
     as a rendering bug rather than as two facts. */
  const parts = [];
  for (const x of [i.subTypeLabel, i.amc ? null : i.category]) {
    if (!x) continue;
    const k = x.toLowerCase().replace(/s$/, '');
    if (!parts.some((y) => y.toLowerCase().replace(/s$/, '').includes(k) || k.includes(y.toLowerCase().replace(/s$/, '')))) parts.push(x);
  }

  return {
    name: deShout(i.name.replace(/ Direct Plan Growth$| Growth Option - Direct$| Direct Growth$| Growth$/i, '').trim()),
    sub: parts.join(' · ') || i.category,
    logo: initials(i.amc || i.name),
    chips, headline, facts,
    spark: s.hasSeries ? p.nav.map((x) => x[1]) : undefined,
  };
}

/* NAMES ARRIVE SHOUTING FROM THE SOURCE — "8.75% RENEW AKSHAY URJA", "10.95% UNSECURED NON
   CONVERTIBLE DEBENTURES." — beside ones that do not, and rule 6 is sentence case. Only a name that
   is PREDOMINANTLY uppercase is touched, so "Canara Robeco Large Cap Fund" is left exactly alone;
   and `titleish` leaves words of two letters or fewer as they are, so NCD, SR and PPD survive. The
   cost is a camel-cased brand — "ReNew" becomes "Renew" — which is a smaller wrong than a card title
   in block capitals. */
function deShout(s) {
  const letters = (s.match(/[A-Za-z]/g) || []).length;
  const caps = (s.match(/[A-Z]/g) || []).length;
  return letters > 8 && caps / letters > 0.6 ? titleish(s) : s;
}

/* ─── THE INLINE ONE-PAGER ──────────────────────────────────────────────────────────────────────
   It is not a screen and it never was one. It opens inside the card, in the list, with the list
   still where it was — which is the whole of the owner's ruling and the reason nothing here calls a
   router.

   ONE CHART PER JOB, which was the second note. A donut where the parts make a whole and there are
   few of them; a horizontal bar where there are many and the comparison is length; a line where the
   quantity is time. The first build put a ring on everything.

   NAV AND ITS BENCHMARK ARE REBASED TO 100. A NAV of ₹70 and an index at 26,000 on one axis is a flat
   line under a flat line: the chart would be drawing the units, not the performance. Rebasing states
   the only thing the pair is for — which grew more from the same start. */
function rebase(series) {
  if (!series || series.length < 2) return null;
  const base = series[0][1];
  return base ? series.map((p, x) => ({ x, y: +((p[1] / base) * 100).toFixed(2) })) : null;
}

function OnePager({ i, onAct }) {
  const p = onePagerOf(i.id) || {};
  const s = shapeOf(i.id);
  const [metric, setMetric] = useS1(null);
  const [lens, setLens] = useS1('sector');
  const t = (k) => () => setMetric((x) => (x === k ? null : k));

  const nav = rebase(p.nav);
  const bench = rebase(p.bench);
  const held = holdersOf(i.id) || [];

  /* The composition lenses this instrument actually has. An empty lens is not offered — a pill that
     opens an empty chart is worse than a pill that is not there. */
  const lenses = [];
  if (p.sector) lenses.push({ key: 'sector', label: 'Sector' });
  if (p.marketCap) lenses.push({ key: 'cap', label: 'Market cap' });
  if (p.holdings) lenses.push({ key: 'holdings', label: 'Top holdings' });
  const useLens = lenses.some((l) => l.key === lens) ? lens : lenses[0]?.key;

  const rows = useLens === 'sector' ? p.sector : useLens === 'cap' ? p.marketCap : p.holdings;
  /* A SINGLE-SEGMENT BREAKDOWN IS A SENTENCE, NOT A RING. Canara Robeco is 100% large cap and a
     donut of one segment is a complete circle that says nothing an eight-word line does not. */
  const oneSegment = rows && rows.length === 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', paddingTop: 'var(--space-8)', borderTop: 'var(--border-hairline) solid var(--color-line)' }}>
      <SentinelText text={narrate(i)} />

      {/* THE CURVE IS ONE SERIES, AND THE BENCHMARK IS A ROW UNDER IT.

          The first build put both in `ChartLine` and the owner's note was that the two lines read as
          one — same weight, same colour, no difference. He was right, and the fix is not to restyle
          the chart: this system's own components already say the comparison better than a second
          line can. `ChartLine` is drawn for ONE series with an area fill (its spec page shows exactly
          that, and the fill is what makes the shape read); a second series is dashed, muted and
          drawn behind, which at 53 points of real NAV is two scribbles on top of each other.

          So the curve is the fund alone, and the benchmark is a `Dumbbell` — the component this
          system already has for "two measurements of different things, and neither becomes the
          other". It states the gap as a distance the eye measures in one look, which is the actual
          question, instead of asking the reader to separate two lines. */}
      {nav && (
        <div>
          <Eyebrow>WHAT ₹100 BECAME</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <ChartReadout label={p.nav[p.nav.length - 1][0] ? monthYear(p.nav[p.nav.length - 1][0]) : 'Latest'}
              value={String(Math.round(nav[nav.length - 1].y))} idleNote="rebased from 100" />
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <ChartLine series={[{ label: 'This fund', points: nav }]}
              density="expanded" width={311}
              valueFormat={(v) => `${v.toFixed(0)}`}
              xFormat={(x) => (p.nav[x] ? monthYear(p.nav[x][0]) : '')} />
          </div>
          {bench && (
            <div style={{ marginTop: 'var(--space-12)' }}>
              <Dumbbell relation="against" label={`Against ${shortBench(i.benchmark || 'its benchmark')}`}
                actual={Math.round(nav[nav.length - 1].y)} actualLabel="This fund"
                target={Math.round(bench[bench.length - 1].y)} targetLabel={shortBench(i.benchmark || 'Benchmark')}
                min={Math.min(90, Math.round(nav[nav.length - 1].y) - 5, Math.round(bench[bench.length - 1].y) - 5)}
                max={Math.max(115, Math.round(nav[nav.length - 1].y) + 5, Math.round(bench[bench.length - 1].y) + 5)} />
            </div>
          )}
          <p style={{ margin: `var(--space-8) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
            Both started at 100 on {monthYear(p.nav[0][0])}, so the two figures are comparable.
          </p>
        </div>
      )}

      {/* THE FUND AGAINST ITS CATEGORY, IN WORDS. `PeerLine` exists for this and its own rule is that
          the verdict is a word — "2.8 points ahead" — never a colour. It says in one line what the
          metric list says in five rows, which is why it sits above them. */}
      {i.returns?.y3 != null && p.ratios?.cat3 != null && (
        <PeerLine value={i.returns.y3} peer={p.ratios.cat3} period="over 3 years"
          peerLabel={`${(i.subTypeLabel || i.category || 'Category')} average`} unit="%" />
      )}

      <div>
        <Eyebrow>HOW IT HAS DONE</Eyebrow>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <MetricList>
            {metricRows(i, p).map((m) => (
              <MetricRow key={m.label} {...m} open={metric === m.label} onToggle={t(m.label)} />
            ))}
          </MetricList>
        </div>
      </div>

      {rows && (
        <div>
          <Eyebrow>WHAT IT HOLDS</Eyebrow>
          {lenses.length > 1 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <SegmentedRow label="Breakdown" options={lenses.map((l) => l.label)}
                value={lenses.find((l) => l.key === useLens)?.label}
                onChange={(x) => setLens(lenses.find((l) => l.label === x).key)} />
            </div>
          )}
          <div style={{ marginTop: 'var(--space-12)' }}>
            {oneSegment ? (
              <p style={{ margin: 0, font: 'var(--type-body-font)', color: 'var(--color-ink)' }}>
                {`All of it — ${rows[0].pct}% — is ${rows[0].name.toLowerCase()}.`}
              </p>
            ) : (
              /* PARTS OF ONE WHOLE IS `ChartShare` — one stacked bar and a ranked legend with the
                 figures on it. The first build reached for a donut and a bar chart; this system
                 already has the component for exactly this shape of question, and it is better at it
                 than either: the bar shows the proportions and the legend does the reading, so
                 nothing is left to colour alone. */
              <ChartShare
                segments={rows.map((r) => ({ label: titleish(r.name), value: r.pct }))}
                valueFormat={(v) => `${v.toFixed(1)}%`}
                caveat={`top ${rows.length} · as of ${monthYear(i.priceDate) || 'the last file'}`} />
            )}
          </div>
        </div>
      )}

      {held.length > 0 && (
        <div>
          <Eyebrow>YOUR CLIENTS</Eyebrow>
          <p style={{ margin: `var(--space-8) 0 0`, font: 'var(--type-body-font)', color: 'var(--color-ink)' }}>
            {`${held.length} of your clients already hold this — ${held.join(' · ')}.`}
          </p>
        </div>
      )}

      {p.pending && (
        <RejectCallout
          eyebrow="NOT ON FILE FOR THIS INSTRUMENT"
          body={`${p.pending.slice(0, 5).map(prettyField).join(', ')}${p.pending.length > 5 ? `, and ${p.pending.length - 5} more` : ''}. Named here rather than left out, so the gap is visible.`} />
      )}

      <Provenance text={`Catalogue · ${i.priceDate ? `priced ${monthYear(i.priceDate)}` : 'no price on file'}${i.benchmark ? ` · benchmark ${i.benchmark}` : ''}`} />

      {/* THE OPTIONS AFTER THE PAGE, which the owner asked to appear everywhere. `InlineActionRow`
          already is "pills placed inline in a message body, acting on the answer just given" — so
          this is the system's own component doing the job it was written for, not a new rail. */}
      <InlineActionRow actions={[
        { label: 'Compare', onClick: () => onAct('compare', i) },
        { label: 'Add to a proposal', onClick: () => onAct('proposal', i) },
        { label: 'Add to a rebalance', onClick: () => onAct('rebalance', i) },
        { label: 'Shortlist', onClick: () => onAct('shortlist', i) },
      ]} />
    </div>
  );
}

/* Sector names arrive SHOUTING from the source — "FINANCIALS", "PHARMA & HEALTHCARE" — beside ones
   that do not — "Consumer Cyclical". Rule 6 is sentence case, and a chart legend that is half caps is
   the data's formatting leaking onto the screen. */
function titleish(s) {
  if (!s) return s;
  return s.split(' ').map((w) => (w.length > 2 && w === w.toUpperCase()
    ? w[0] + w.slice(1).toLowerCase() : w)).join(' ');
}
const prettyField = (f) => String(f).replace(/^section:/, '').replace(/_/g, ' ');

/* One sentence, assembled only from what is known — which is why it is built rather than templated.
   Every clause here is guarded; a fund with no category average simply does not get that clause. */
function narrate(i) {
  const p = onePagerOf(i.id) || {};
  const name = cardFor(i).name;
  const bits = [];
  bits.push(`${name} is a ${(i.subTypeLabel || i.category || 'fund').toLowerCase()}`);
  /* "Canara Robeco Large Cap Fund ... from Canara Robeco" — the house is usually the first words of
     the fund's own name, and saying it twice in one sentence is the sentence admitting it was
     assembled rather than written. Named only where the name does not already carry it. */
  const house = i.amc ? i.amc.replace(/ (Asset Management|Mutual Fund|Co\.?|Ltd\.?|Limited).*$/i, '').trim() : null;
  if (house && !name.toLowerCase().startsWith(house.toLowerCase())) bits.push(`from ${house}`);
  let s = bits.join(' ') + '.';
  const y3 = i.returns?.y3, cat3 = p.ratios?.cat3;
  if (y3 != null && cat3 != null) {
    const d = +(y3 - cat3).toFixed(2);
    s += ` Over three years it did ${pc(y3)} against its category's ${pc(cat3)} — ${Math.abs(d).toFixed(2)} points ${d >= 0 ? 'ahead' : 'behind'}.`;
  } else if (y3 != null) {
    s += ` Over three years it did ${pc(y3)}.`;
  }
  if (i.ter != null) s += ` It costs ${i.ter.toFixed(2)}% a year.`;
  return s;
}

/* The rows a one-pager can honestly show, each with the peers the catalogue actually carries. The
   benchmark's own return is on file for none of the sample's mutual funds, so its tile is a named
   gap rather than a dropped column — we know WHICH benchmark, we do not have its number. */
function metricRows(i, p) {
  const out = [];
  const r = p.ratios || {};
  const peer = (self, cat, bmName) => {
    const rows = [{ label: 'This fund', value: pc(self), self: true }];
    if (cat != null) rows.push({ label: 'Category', value: pc(cat) });
    if (bmName) rows.push({ label: shortBench(bmName), value: 'not on file', missing: true });
    return rows;
  };
  if (i.returns?.y3 != null) {
    out.push({
      label: '3Y return', value: pc(i.returns.y3),
      peers: peer(i.returns.y3, r.cat3, i.benchmark),
      note: r.cat3 != null
        ? `${Math.abs(i.returns.y3 - r.cat3).toFixed(2)} points ${i.returns.y3 >= r.cat3 ? 'ahead of' : 'behind'} its category over three years.`
        : undefined,
    });
  }
  if (i.returns?.y1 != null) {
    out.push({
      label: '1Y return', value: pc(i.returns.y1),
      peers: peer(i.returns.y1, r.cat1, i.benchmark),
    });
  }
  if (r.alpha3 != null) out.push({ label: 'Alpha (3Y)', value: r.alpha3.toFixed(2), note: 'Return above what its beta would have predicted, over three years.' });
  if (r.beta3 != null) out.push({ label: 'Beta (3Y)', value: r.beta3.toFixed(2), note: `Moves about ${Math.abs(Math.round((1 - r.beta3) * 100))}% ${r.beta3 < 1 ? 'less' : 'more'} than its benchmark, up and down.` });
  if (i.ter != null) out.push({ label: 'Expense ratio', value: `${i.ter.toFixed(2)}%` });
  if (i.exitLoad) out.push({ label: 'Exit load', value: i.exitLoad.replace(/ Percentage upto /, '% up to ') });
  return out;
}
const shortBench = (b) => String(b).replace(/ Total Return Index$| TRI$| Index$/i, '');


/* ─── FACETS, DERIVED FROM THE ROWS IN FRONT OF THE ADVISOR ─────────────────────────────────────
   Not a fixed list of filters. A facet is offered only when the CURRENT result set can actually be
   cut by it, and every option carries the count it would leave — which is the single
   highest-impact element of a filter interface and the reason the first build's tiles carry one too.

   This matters more here than in most products because the catalogue is uneven: expense ratio exists
   for mutual funds and for nothing else, fund size for five of eight families. A fixed filter list
   would show an advisor looking at bonds a TER slider that can only ever return zero rows. So the
   groups are built from what the rows hold, and a group with fewer than two options is dropped — a
   filter with one choice filters nothing. */
function bandOf(v, bands) {
  for (const b of bands) if (v >= b.lo && v < b.hi) return b;
  return null;
}
const TER_BANDS = [
  { key: 'ter:lo', label: 'Under 0.50%', lo: -Infinity, hi: 0.5 },
  { key: 'ter:mid', label: '0.50% to 1.00%', lo: 0.5, hi: 1 },
  { key: 'ter:hi', label: 'Over 1.00%', lo: 1, hi: Infinity },
];
const AUM_BANDS = [
  { key: 'aum:lg', label: 'Over ₹10,000 Cr', lo: 1e11, hi: Infinity },
  { key: 'aum:md', label: '₹1,000 to 10,000 Cr', lo: 1e10, hi: 1e11 },
  { key: 'aum:sm', label: 'Under ₹1,000 Cr', lo: -Infinity, hi: 1e10 },
];
const RET_BANDS = [
  { key: 'r3:hi', label: 'Over 15%', lo: 15, hi: Infinity },
  { key: 'r3:md', label: '10% to 15%', lo: 10, hi: 15 },
  { key: 'r3:lo', label: 'Under 10%', lo: -Infinity, hi: 10 },
];

/* Which band or value a row falls in, per facet. One function, so the group builder and the filter
   cannot disagree about what "Over ₹10,000 Cr" means. */
const FACET_OF = {
  amc: (i) => (i.amc ? i.amc.replace(/ (Asset Management|Mutual Fund|Investment Managers?|Co\.?|Ltd\.?|Limited|Pvt\.?|Private).*$/i, '').trim() : null),
  type: (i) => i.instrumentType || null,
  ter: (i) => (i.ter == null ? null : bandOf(i.ter, TER_BANDS)?.key),
  aum: (i) => (i.aum == null ? null : bandOf(i.aum, AUM_BANDS)?.key),
  r3: (i) => (i.returns?.y3 == null ? null : bandOf(i.returns.y3, RET_BANDS)?.key),
};
const FACET_META = [
  { key: 'amc', label: 'House', note: 'The AMC, PMS manager or issuer.', order: null },
  { key: 'type', label: 'Structure', note: null, order: null },
  { key: 'r3', label: 'Three-year return', note: 'Only instruments that have one.', order: RET_BANDS },
  { key: 'aum', label: 'Fund size', note: null, order: AUM_BANDS },
  { key: 'ter', label: 'Expense ratio', note: 'Mutual funds only — nothing else in the catalogue carries one.', order: TER_BANDS },
];

function facetGroups(rows) {
  const groups = [];
  for (const m of FACET_META) {
    const counts = new Map();
    for (const i of rows) {
      const k = FACET_OF[m.key](i);
      if (k) counts.set(k, (counts.get(k) || 0) + 1);
    }
    if (counts.size < 2) continue;
    const opts = m.order
      ? m.order.filter((b) => counts.has(b.key)).map((b) => ({ value: b.key, label: b.label, count: counts.get(b.key) }))
      : [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 8).map(([k, n]) => ({ value: k, label: k, count: n }));
    groups.push({ key: m.key, label: m.label, note: m.note || undefined, mode: 'multi', options: opts });
  }
  return groups;
}

function applyFacets(rows, value) {
  return rows.filter((i) => FACET_META.every((m) => {
    const want = value[m.key];
    if (!want || (Array.isArray(want) && !want.length)) return true;
    const got = FACET_OF[m.key](i);
    return Array.isArray(want) ? want.includes(got) : want === got;
  }));
}

/* ─── THE FILTER BAR — always on screen, never a detour ─────────────────────────────────────────
   The owner's words: the advisor must be able to customise anywhere, and it must be visible, not
   only reachable through chat. So it is sticky at the top of the thread rather than a button in the
   app bar: a filter you have to go somewhere to find is a filter that gets used once.

   IT SHOWS WHAT IS ON, not just that something is. A bare "Filters (3)" makes the advisor open the
   sheet to remember which three — the same complaint the research recorded about every screener it
   read. The chips ARE the state, and each one removes itself. */
function FilterBar({ q, onQ, chips, onDrop, count }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <SearchField value={q} onChange={onQ} placeholder="Find a fund, AMC or category" />
      {chips.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          {chips.map((c) => <Pill key={c.key} label={c.label} size="sm" removable onClick={() => onDrop(c)} />)}
          <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {count.toLocaleString('en-IN')} left
          </span>
        </div>
      )}
    </div>
  );
}


/* ─── COMPARE, IN THE THREAD ────────────────────────────────────────────────────────────────────
   The owner's ruling covers this too: no separate screen. Picking a second checkbox opens the
   comparison as a block in the same thread, under the list it was picked from, and clearing it puts
   the list back untouched.

   THE ROWS ARE THE UNION OF WHAT THE CHOSEN INSTRUMENTS HAVE, not a fixed set. Comparing a fund with
   a bond is a real thing an advisor does, and a fixed row list would print an em dash down a whole
   column. A row appears when at least one of the chosen instruments has it, and the ones that do not
   say so in words — which is the same rule the card already follows. */
function missing() {
  return <span style={{ font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>not on file</span>;
}

function CompareBlock({ ids, onClear, onDrop }) {
  const rows = ids.map(instrumentById).filter(Boolean);
  if (rows.length < 2) return null;
  const val = (fn) => Object.fromEntries(rows.map((i) => {
    const v = fn(i, onePagerOf(i.id) || {});
    return [i.id, v == null ? missing() : v];
  }));
  const any = (fn) => rows.some((i) => fn(i, onePagerOf(i.id) || {}) != null);

  const spec = [
    { label: '3Y return', get: (i) => (i.returns?.y3 == null ? null : pc(i.returns.y3)), better: 'high' },
    { label: '1Y return', get: (i) => (i.returns?.y1 == null ? null : pc(i.returns.y1)), better: 'high' },
    { label: 'Fund size', get: (i) => crore(i.aum), better: 'high' },
    { label: 'Expense ratio', get: (i) => (i.ter == null ? null : `${i.ter.toFixed(2)}%`), better: 'low' },
    { label: 'Coupon', get: (i, p) => (p.coupon == null ? null : `${p.coupon.toFixed(2)}%`), better: 'high' },
    { label: 'Matures', get: (i, p) => monthYear(p.maturity) },
    { label: 'Beta (3Y)', get: (i, p) => (p.ratios?.beta3 == null ? null : p.ratios.beta3.toFixed(2)) },
    { label: 'Benchmark', get: (i) => (i.benchmark ? shortBench(i.benchmark) : null) },
  ].filter((r) => any(r.get));

  return (
    <Surface>
      <CompareTable
        title={`Side by side · ${rows.length}`}
        entities={rows.map((i) => ({ id: i.id, name: cardFor(i).name, meta: i.subTypeLabel || i.category }))}
        rows={spec.map((r) => ({ label: r.label, values: val(r.get), better: r.better }))}
        cap={3}
        capNote="Three at a time — a fourth column at 375 makes every figure unreadable, which is the PRD's own ceiling."
        footnote="Rows appear where at least one of the chosen instruments has the figure. A blank is never printed as a zero." />
      <div style={{ marginTop: 'var(--space-12)' }}>
        {/* THE HOUSE, NOT THE FIRST TWO WORDS OF THE NAME. Slicing gave "Drop UTI Large", which is
            not a thing — and in a comparison the house is exactly what tells two large cap funds
            apart, so it is also the right word to say. */}
        <InlineActionRow actions={rows.map((i) => ({ label: `Drop ${FACET_OF.amc(i) || cardFor(i).name}`, onClick: () => onDrop(i.id) }))
          .concat([{ label: 'Clear', onClick: onClear }])} />
      </div>
    </Surface>
  );
}

/* ─── OVERLAP, ON WHAT THE CATALOGUE ACTUALLY HAS ───────────────────────────────────────────────
   AND THIS IS WHERE THE DATA HAS TO BE ADMITTED. A real overlap is computed on the full portfolio —
   every holding, by weight. The catalogue carries the TOP FIVE holdings per instrument and nothing
   more. So what is computed here is the shared weight among those five, and the footnote says so in
   the advisor's own words rather than letting a number imply a portfolio-level answer it cannot
   support. A figure whose basis is not stated is not a figure. */
function sharedPct(a, b) {
  const A = (onePagerOf(a)?.holdings) || [], B = (onePagerOf(b)?.holdings) || [];
  if (!A.length || !B.length) return null;
  const byName = new Map(B.map((h) => [h.name.toLowerCase(), h.pct]));
  let sum = 0;
  for (const h of A) {
    const other = byName.get(h.name.toLowerCase());
    if (other != null) sum += Math.min(h.pct, other);
  }
  return +sum.toFixed(1);
}

function OverlapBlock({ ids, onDrop }) {
  const rows = ids.map(instrumentById).filter(Boolean);
  if (rows.length < 2) return null;
  const pairs = [];
  for (let x = 0; x < rows.length; x += 1) {
    for (let y = x + 1; y < rows.length; y += 1) {
      pairs.push({ a: rows[x], b: rows[y], pct: sharedPct(rows[x].id, rows[y].id) });
    }
  }
  const known = pairs.filter((c) => c.pct != null);

  /* THE BAR NOBODY COULD SEE. `OverlapView`'s pair row draws its magnitude as a --tint-bronze-06
     rectangle behind the label — 6% ink. The owner's words: "vo to mujhe visible hai, but as a user
     kisi ko visible nahi hai." He is right, and I had waved it off as the component working as
     designed, which was the wrong call: a magnitude you cannot see is not a magnitude, it is a
     smudge behind a word.

     So the pairs are drawn with `ChartLegend` instead, whose own spec page carries this exact case —
     "Parag Parikh Flexi <-> HDFC Large Cap ... 62%" under a variant called LONG LABELS WRAP. It
     ranks, it wraps rather than truncating a fund name, and its figure is TYPE at full ink rather
     than a tint. Nothing was restyled to get here; the system already had the right component and
     the first build reached for the wrong one. */
  return (
    <Surface>
      <Eyebrow>WHERE THEY HOLD THE SAME THING</Eyebrow>
      <div style={{ marginTop: 'var(--space-8)' }}>
        {known.length ? (
          <>
            <ChartLegend layout="stacked" items={known.map((c) => ({
              label: `${cardFor(c.a).name} ↔ ${cardFor(c.b).name}`,
              value: `${c.pct}%`, amount: c.pct,
            }))} />
            <p style={{ margin: `var(--space-12) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
              Shared weight among the top five holdings the catalogue carries for each — not the whole
              portfolio. A true overlap needs every holding by weight, and that is not on file here.
            </p>
          </>
        ) : (
          <ConstraintCallout eyebrow="NO HOLDINGS ON FILE"
            body="Neither of these carries a holdings list in the catalogue, so there is nothing to intersect. Bonds, deposits and REITs have no portfolio to overlap." />
        )}
      </div>
      <div style={{ marginTop: 'var(--space-12)' }}>
        <InlineActionRow actions={rows.map((i) => ({ label: `Drop ${FACET_OF.amc(i) || cardFor(i).name}`, onClick: () => onDrop(i.id) }))} />
      </div>
    </Surface>
  );
}

/* ─── THE FUNNEL ────────────────────────────────────────────────────────────────────────────────
   One screen. Four questions, each a function of the one above, each collapsing into its answer. */
const STEP = { ASSET: 1, PRODUCT: 2, CATEGORY: 3 };

function Funnel({ startAssets = [], startFamilies = [], startCats = [], startOpen = STEP.ASSET, startFundId = null, startQ = '', startPicked = [], startSheet = false, startShow = null }) {
  const [open, setOpen] = useS1(startOpen);
  const [assets, setAssets] = useS1(startAssets);
  const [fams, setFams] = useS1(startFamilies);
  const [cats, setCats] = useS1(startCats);
  const [q, setQ] = useS1(startQ);
  const [fund, setFund] = useS1(startFundId);
  const [picked, setPicked] = useS1(startPicked);
  const [acted, setActed] = useS1(null);
  const [facets, setFacets] = useS1({});
  const [sheet, setSheet] = useS1(startSheet);
  /* 'compare' | 'overlap' | null. One at a time: both open at once is two tables of the same three
     funds stacked on a phone, and the advisor scrolls past one to read the other. */
  const [show, setShow] = useS1(startShow);
  /* WHEN A PAGE IS OPEN, THE THREAD RESTS ON IT. Without this the scaffold stayed at the top and the
     page the advisor just opened was below the fold — they tapped a card and nothing appeared to
     happen. Anchoring to the open card is not a navigation: the list is still there above it, and
     closing the card leaves the thread exactly where it was. */
  const openRef = React.useRef(null);
  const showRef = React.useRef(null);

  /* Choosing higher up INVALIDATES what was chosen below it, and says so by simply dropping it. The
     alternative — keeping a category that no longer exists under the new product — is the bug every
     faceted filter ships first: a list filtered by something the advisor can no longer see. */
  const chooseAsset = (label) => {
    const next = assets.includes(label) ? assets.filter((x) => x !== label) : assets.concat(label);
    setAssets(next);
    const okFams = familiesForAssets(next).map((f) => f.key);
    setFams((s) => s.filter((k) => okFams.includes(k)));
    setCats((s) => s.filter((k) => okFams.includes(k.split(':')[0])));
  };
  const chooseFam = (key) => {
    const next = fams.includes(key) ? fams.filter((x) => x !== key) : fams.concat(key);
    setFams(next);
    setCats((s) => s.filter((k) => !next.length || next.includes(k.split(':')[0])));
  };
  const chooseCat = (key) => setCats((s) => (s.includes(key) ? s.filter((x) => x !== key) : s.concat(key)));

  const famRows = familiesForAssets(assets);
  const catRows = categoriesFor(assets, fams);
  /* EACH STEP COUNTS AT ITS OWN LEVEL. The first build put the fully-filtered total on every row, so
     the asset step read "4 funds" while the advisor was looking at a tile saying Equity has 36 — the
     same screen stating two different numbers for the same word. A step's count is what THAT answer
     yields, which is also the number the advisor is deciding with when they open it. */
  const atAsset = instrumentsFor({ assets });
  const atProduct = instrumentsFor({ assets, families: fams });
  const all = instrumentsFor({ assets, families: fams, categories: cats });
  const needle = q.trim().toLowerCase();
  const searched = needle
    ? all.filter((i) => `${i.name} ${i.amc || ''} ${i.category || ''}`.toLowerCase().includes(needle))
    : all;
  /* The facets are built from what the SEARCH left, not from the whole catalogue — so the counts in
     the sheet are the counts the advisor would actually get, and a house with nothing left in it is
     not offered. */
  const groups = facetGroups(searched);
  const rows = applyFacets(searched, facets);
  const facetChips = groups.flatMap((g) => (facets[g.key] || []).map((v) => ({
    key: `x:${g.key}:${v}`,
    label: g.options.find((o) => o.value === v)?.label || v,
    drop: () => setFacets((s2) => ({ ...s2, [g.key]: (s2[g.key] || []).filter((x) => x !== v) })),
  })));

  const chips = []
    .concat(assets.map((a) => ({ key: `a:${a}`, label: a, drop: () => chooseAsset(a) })))
    .concat(fams.map((f) => ({ key: `f:${f}`, label: familyByKey(f)?.label || f, drop: () => chooseFam(f) })))
    .concat(cats.map((c) => ({ key: `c:${c}`, label: catRows.find((r) => r.key === c)?.label || c, drop: () => chooseCat(c) })))
    .concat(facetChips);

  const toggleStep = (n) => setOpen((s2) => (s2 === n ? 0 : n));

  /* PROGRESSIVE REVEAL — a question that cannot be answered yet is NOT ON THE SCREEN.
     The first build rendered all three steps from the start, two of them saying "Choose an asset
     class first". The owner's note: when the asset question comes, only the asset question should
     be there. A row that exists only to say it is not ready is a row the eye reads and discards
     every time, and on a phone it is a third of the first screenful spent on nothing.

     So step 2 appears when step 1 has an answer, and step 3 when step 2 does. And the moment a new
     question appears the one above it COLLAPSES — which is the other half of his ruling, and the
     reason the funnel never grows taller than one open question plus its answers. */
  const reveal = { asset: true, product: assets.length > 0, category: fams.length > 0 };
  React.useEffect(() => { if (assets.length && open === STEP.ASSET) setOpen(STEP.PRODUCT); },
    [assets.length]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (fams.length && open === STEP.PRODUCT) setOpen(STEP.CATEGORY); },
    [fams.length]); // eslint-disable-line react-hooks/exhaustive-deps
  /* The path, for the bar that never scrolls away. */
  const path = []
    .concat(assets.length ? [{ key: 'asset', label: assets.join(' · '), step: STEP.ASSET }] : [])
    .concat(fams.length ? [{ key: 'product', label: fams.map((f) => familyByKey(f)?.label || f).join(' · '), step: STEP.PRODUCT }] : [])
    .concat(cats.length ? [{ key: 'category', label: cats.map((c) => catRows.find((r) => r.key === c)?.label).filter(Boolean).join(' · '), step: STEP.CATEGORY }] : []);
  const resetAll = () => { setAssets([]); setFams([]); setCats([]); setFacets({}); setQ(''); setPicked([]); setShow(null); setFund(null); setOpen(STEP.ASSET); };

  return (
    <ScreenScaffold title="Explore" body="thread"
      anchor={fund ? openRef : show ? showRef : 0} revision={fund || show || 'list'} onMenu={() => {}}
      composer={<Composer placeholder="Ask Sentinel" onAttach={() => {}} />}>

      <StepStack>
        <StepBlock step={1} title="Asset class" chips={assets} done={assets.length > 0}
          count={assets.length ? atAsset.length : undefined}
          open={open === STEP.ASSET} onToggle={() => toggleStep(STEP.ASSET)}>
          <IntentGrid>
            {ASSETS.map((a) => (
              <IntentTile key={a.label} label={a.label} count={a.count}
                mark={<AssetMark asset={a.label} size={76} />}
                selected={assets.includes(a.label)} onClick={() => chooseAsset(a.label)} />
            ))}
          </IntentGrid>
        </StepBlock>

        {reveal.product && (
        <StepBlock step={2} title="Product"
          chips={fams.map((f) => familyByKey(f)?.label || f)} done={fams.length > 0}
          summary={`${famRows.length} available`}
          count={fams.length ? atProduct.length : undefined}
          open={open === STEP.PRODUCT} onToggle={() => toggleStep(STEP.PRODUCT)}>
          {/* The products that exist under the chosen assets — derived, so this list cannot offer a
              product the catalogue would then have nothing for. */}
          <IntentGrid>
            {famRows.map((f) => (
              <IntentTile key={f.key} label={f.label} count={f.count} unit="instruments"
                mark={<AssetMark asset={f.assets[0]} size={76} />}
                selected={fams.includes(f.key)} onClick={() => chooseFam(f.key)} />
            ))}
          </IntentGrid>
        </StepBlock>
        )}

        {reveal.category && (
        <StepBlock step={3} title="Category"
          chips={cats.map((c) => catRows.find((r) => r.key === c)?.label).filter(Boolean)}
          done={cats.length > 0}
          count={cats.length ? all.length : undefined}
          summary={`${catRows.length} available`}
          open={open === STEP.CATEGORY} onToggle={() => toggleStep(STEP.CATEGORY)}>
          {catRows.length ? (
            /* `ChipRow` takes CHILDREN, not a chips array — it is the row's rhythm and stagger, and
               the pills are the caller's. Each carries its own count, which is the figure that saves
               the advisor opening a category to find out how many are in it. */
            <ChipRow>
              {catRows.map((c) => (
                <Pill key={c.key} label={`${c.label} · ${c.count}`}
                  selected={cats.includes(c.key)} onClick={() => chooseCat(c.key)} />
              ))}
            </ChipRow>
          ) : (
            <p style={{ margin: 0, font: 'var(--type-body-font)', color: 'var(--color-muted)' }}>
              Nothing under this product is categorised in the catalogue.
            </p>
          )}
        </StepBlock>
        )}
      </StepStack>

      {/* THE SCREEN OPENS ON ONE QUESTION AND NOTHING ELSE. The first build showed all eighty
          instruments under an unanswered first step, which undercuts the funnel: if the list is
          already there, the questions are decoration. Everything below appears with the first
          answer. */}
      {assets.length > 0 && (
        <>
          {/* ONE STICKY LINE, 36pt, and it is the only thing that never scrolls away. The search
              sits under it and scrolls, because searching is a deliberate act and orientation is
              not. */}
          <PathBar steps={path} onStep={(st) => setOpen(st.step)} onReset={resetAll}
            action={<Pill label={chips.length ? `Filters · ${chips.length}` : 'Filters'} size="sm"
              selected={chips.length > 0} onClick={() => setSheet(true)} />} />
          <FilterBar q={q} onQ={setQ} chips={chips} onDrop={(c) => c.drop()} count={rows.length} />
        </>
      )}

      {/* THE RESULT IS NOT A STEP. The three questions collapse; the list is what they were for, so it
          is always open and always the tallest thing on the screen. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {assets.length === 0 ? null : rows.length === 0 ? (
          <ConstraintCallout eyebrow="NOTHING MATCHES THAT YET"
            body={q ? `No instrument in the catalogue matches “${q}” under the filters above. Clear the search, or widen a step.` : 'Widen a step above — or clear a filter.'} />
        ) : rows.slice(0, 12).map((i) => {
          const c = cardFor(i);
          const isOpen = fund === i.id;
          return (
            <div key={i.id} ref={isOpen ? openRef : undefined}>
            <FundCard {...c}
              selectable selected={picked.includes(i.id)}
              onSelect={() => setPicked((s) => (s.includes(i.id) ? s.filter((x) => x !== i.id) : s.concat(i.id).slice(-3)))}
              open={isOpen} onToggle={() => setFund((s) => (s === i.id ? null : i.id))}>
              <OnePager i={i} onAct={(what, inst) => setActed(`${what}:${inst.id}`)} />
            </FundCard>
            </div>
          );
        })}
        {assets.length > 0 && rows.length > 12 && (
          <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)', textAlign: 'center' }}>
            {`${rows.length - 12} more — narrow a step above, or search.`}
          </p>
        )}
      </div>

      {picked.length >= 2 && (
        <InlineActionRow actions={[
          { label: show === 'compare' ? 'Hide the comparison' : `Compare ${picked.length}`, tone: show === 'compare' ? 'outline' : 'primary', onClick: () => setShow((s2) => (s2 === 'compare' ? null : 'compare')) },
          { label: show === 'overlap' ? 'Hide the overlap' : 'See overlap', onClick: () => setShow((s2) => (s2 === 'overlap' ? null : 'overlap')) },
          { label: 'Clear', onClick: () => { setPicked([]); setShow(null); } },
        ]} />
      )}
      {/* THE THREAD RESTS ON WHATEVER WAS JUST OPENED. Without the ref the comparison landed below
          the fold and tapping "Compare 2" appeared to do nothing — the same failure the fund page had
          before it got one. It is still not a navigation: the list is above it and closing puts the
          thread back. */}
      <div ref={show ? showRef : undefined}>
        {show === 'compare' && picked.length >= 2 && (
          <CompareBlock ids={picked}
            onClear={() => { setPicked([]); setShow(null); }}
            onDrop={(id) => setPicked((s2) => s2.filter((x) => x !== id))} />
        )}
        {show === 'overlap' && picked.length >= 2 && (
          <OverlapBlock ids={picked} onDrop={(id) => setPicked((s2) => s2.filter((x) => x !== id))} />
        )}
      </div>
      {acted && (
        <Provenance text={`Prototype: “${acted.split(':')[0]}” would open here. The catalogue is real; the destination is another journey.`} />
      )}

      {/* THE SHEET IS THE SAME FILTERS THE BAR IS ALREADY SHOWING, opened for the ones that do not fit
          in a row. Nothing here is only reachable through the sheet — it is a wider view of the same
          state, which is why closing it changes nothing. */}
      <FilterSheet open={sheet} title="Narrow it" groups={groups} value={facets}
        resultCount={rows.length} unit="instruments"
        onChange={(k, next) => setFacets((s2) => ({ ...s2, [k]: next }))}
        onClearAll={() => setFacets({})}
        onApply={() => setSheet(false)} onClose={() => setSheet(false)} />
    </ScreenScaffold>
  );
}

/* ─── The board ─────────────────────────────────────────────────────────────────────────────────── */
function App_V1() {
  return (
    <ScreenShell journey="Fund explorer · variation 1" n="" name="The funnel"
      job="Four questions on one screen, each collapsing into its own answer, and a fund's page opening inside the list rather than over it."
      without="walks four separate screens, leaves each answer behind as they go, and opens a fund page that navigates away from the list they were reading.">

      <Section title="The whole thing, live"
        sub="Real catalogue: 80 instruments, 8 families. Open a step and choose; the step collapses carrying its answer and the one below it narrows. Tap a card to open its page IN PLACE — the list does not move. Tap two checkboxes to compare.">
        <StateRow>
          <State label="AS IT OPENS" note="Nothing chosen, nothing claimed. The first question is open and the list below is the whole catalogue."><Funnel /></State>
          <State label="THREE ANSWERED" note="Each step is one row carrying its answer and its count. The funnel reads as a sentence: equity, mutual fund, large cap, four funds."><Funnel startAssets={['Equity']} startFamilies={['mutual_fund']} startCats={['mutual_fund:large_cap']} startOpen={0} /></State>
        </StateRow>
      </Section>

      <Section title="The page opens inside the list"
        sub="The owner's ruling, and the reason nothing here calls a router. The card grows into its page and the list stays where it was; closing it puts the list back exactly as it was left.">
        <StateRow>
          <State label="OPEN IN PLACE" note="Narration, the rebased curve against its benchmark, the metrics with their peers, what it holds, and the options — all inside the card."><Funnel startAssets={['Equity']} startFamilies={['mutual_fund']} startCats={['mutual_fund:large_cap']} startOpen={0} startFundId="F00000PDT6" /></State>
          <State label="A DIFFERENT KIND OF THING" tone="under" note="A bond. No return, no series, no AUM — a coupon, a maturity and a face value. Same card, different facts, and not one em dash."><Funnel startAssets={['Debt']} startFamilies={['bonds']} startOpen={0} /></State>
        </StateRow>
      </Section>

      <Section title="What the funnel refuses to offer"
        sub="Every level is computed from the catalogue, so a product with nothing under it is never shown and a category that would open an empty list is never offered.">
        <StateRow>
          <State label="SEARCH WITH NO MATCH" tone="under" note="The filters stay visible and the way out is named. The list does not silently empty."><Funnel startAssets={['Equity']} startQ="gilt" startOpen={0} /></State>
          <State label="COMMODITY" note="Ten instruments, four of which have a series. The six without one show their facts and no empty chart box."><Funnel startAssets={['Commodity']} startFamilies={['commodity']} startOpen={0} /></State>
        </StateRow>
      </Section>

      <Section title="Narrowing, comparing, overlapping — none of them a screen"
        sub="The sheet is a wider view of the filters the bar is already showing, so closing it changes nothing. Two checkboxes open the comparison in the same thread, under the list it was picked from.">
        <StateRow>
          <State label="THE SHEET" note="Facets built from the rows in front of the advisor: a house with nothing left in it is not offered, and expense ratio does not appear at all unless mutual funds are in the set."><Funnel startAssets={['Equity']} startFamilies={['mutual_fund']} startOpen={0} startSheet /></State>
          <State label="COMPARE, IN THE THREAD" note="Rows are the union of what the chosen instruments have. A row appears where at least one has the figure; the ones that do not say so."><Funnel startAssets={['Equity']} startFamilies={['mutual_fund']} startCats={['mutual_fund:large_cap']} startOpen={0} startPicked={['F00000PDT6', 'F00000PDLU']} startShow="compare" /></State>
        </StateRow>
      </Section>

      <Section title="Overlap, and the limit it has to admit"
        sub="A true overlap is computed on every holding by weight. The catalogue carries the top five per instrument, so that is what is intersected — and the footnote says so rather than letting a number imply a portfolio-level answer.">
        <StateRow>
          <State label="WHAT CAN BE COMPUTED" note="Shared weight among the top five each. Real names, real weights, a stated basis."><Funnel startAssets={['Equity']} startFamilies={['mutual_fund']} startCats={['mutual_fund:large_cap']} startOpen={0} startPicked={['F00000PDT6', 'F00000PDLU']} startShow="overlap" /></State>
          <State label="WHAT CANNOT" tone="under" note="Bonds have no portfolio to intersect. The block says that instead of drawing an empty matrix."><Funnel startAssets={['Debt']} startFamilies={['bonds']} startOpen={0} startPicked={['BD00021596', 'BD00021753']} startShow="overlap" /></State>
        </StateRow>
      </Section>

      <Note title="What is real here, and what is not">
        The instruments, names, AMCs, categories, returns, AUMs, expense ratios, NAV series, sector and
        market-cap weights, alpha and beta are all from the product catalogue export of 22 Sep 2026 —
        80 instruments, ten per family. What is <em>not</em> real: which clients hold what, which comes
        from the advisor's book, and the destinations behind the action pills, which are other journeys.
        The benchmark's own return is on file for none of the ten mutual funds, so every one of them
        shows that as a named gap rather than a number.
      </Note>

      <Section title="Why each chart is the chart it is"
        sub="The second note was that a ring had been put on everything. One chart per job:">
        <Table head={['Where', 'Chart', 'Because']} rows={[
          ['A row in the list', 'Sparkline', 'Two funds on the same three-year return are not the same fund. No axis, no grid — the figure beside it is its label.'],
          ['Fund vs benchmark, over time', 'Line, both rebased to 100', 'The quantity is time. A NAV of ₹70 and an index at 26,000 on one axis draws the units, not the performance.'],
          ['Market cap', 'Donut', 'Few parts of one whole. The hole carries the count.'],
          ['Sector, top holdings', 'Horizontal bar', 'Many parts, and the comparison is length. The ring\'s own spec says a bar wins past six segments.'],
          ['A breakdown with one segment', 'A sentence', 'A donut of one segment is a complete circle that says nothing an eight-word line does not.'],
        ]} />
      </Section>

      <Section title="Motion">
        <MotionTable rows={[
          ['A step opens or closes', 'grid-template-rows 0fr → 1fr on the panel; the chevron rotates 90° → −90°', '--dur-enter 240ms / --dur-fast 200ms', 'Both land in place with no travel — the global block cuts every transition to 1ms.'],
          ['A card opens into its page', 'The same 0fr → 1fr. One gesture, one behaviour, across StepBlock, FundCard and MetricRow', '--dur-enter 240ms', 'Appears at full height.'],
          ['A metric opens its peers', 'The same again, inside the page', '--dur-enter 240ms', 'Appears at full height.'],
          ['Selection', 'box-shadow --color-line → --color-bronze, and the tile\'s mark from 7% to 13%', '--dur-fast 200ms', 'Unchanged — colour and opacity, not movement.'],
          ['The curve draws', 'Inherited from ChartLine', '--dur-bar 480ms', 'Rendered whole on mount.'],
        ]} />
      </Section>
    </ScreenShell>
  );
}

/* The prototype page loads all three variations and mounts its own router, so each variation
   publishes its component and mounts its own board ONLY when it is the page being opened. */
const V1 = Funnel;
Object.assign(window, { V1, Funnel });
if (!window.__EXPLORER_PROTOTYPE) mountScreen(<App_V1 />);
