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

      {nav && (
        <div>
          <Eyebrow>{bench ? `AGAINST ${(i.benchmark || 'ITS BENCHMARK').toUpperCase()}` : 'HOW IT MOVED'}</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <ChartLine
              series={[{ label: 'This fund', points: nav }].concat(bench ? [{ label: 'Benchmark', points: bench, tone: 'muted' }] : [])}
              density="expanded" width={311}
              valueFormat={(v) => `${v.toFixed(0)}`}
              xFormat={(x) => (p.nav[x] ? monthYear(p.nav[x][0]) : '')} />
          </div>
          <p style={{ margin: `var(--space-8) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
            Both rebased to 100 at the start of the window, so the two are comparable.
          </p>
        </div>
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
            ) : useLens === 'cap' ? (
              /* FEW PARTS OF ONE WHOLE — the ring, with the count in its hole. */
              <ChartDonut slices={rows.map((r) => ({ label: r.name, value: r.pct }))}
                max={rows.length} center={String(rows.length)} centerNote="bands"
                caveat={`as of ${monthYear(i.priceDate) || 'the last file'}`} />
            ) : (
              /* MANY, AND THE COMPARISON IS LENGTH — the horizontal bar, which is what the ring's own
                 spec says wins past six segments. */
              <ChartBar bars={rows.map((r) => ({ label: titleish(r.name), value: r.pct }))}
                orientation="horizontal" density="expanded"
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

/* ─── THE FILTER BAR — always on screen, never a detour ─────────────────────────────────────────
   The owner's words: the advisor must be able to customise anywhere, and it must be visible, not
   only reachable through chat. So it is sticky at the top of the thread rather than a button in the
   app bar: a filter you have to go somewhere to find is a filter that gets used once.

   IT SHOWS WHAT IS ON, not just that something is. A bare "Filters (3)" makes the advisor open the
   sheet to remember which three — the same complaint the research recorded about every screener it
   read. The chips ARE the state, and each one removes itself. */
function FilterBar({ q, onQ, chips, onDrop, onOpen, count }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 'var(--z-sticky)',
      margin: `0 calc(-1 * var(--gutter))`, padding: `var(--space-8) var(--gutter)`,
      background: 'var(--color-canvas)',
      boxShadow: 'inset 0 -1px 0 0 var(--color-line-soft)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-8)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <SearchField value={q} onChange={onQ} placeholder="Find a fund, AMC or category" />
        </span>
        <Pill label={chips.length ? `Filters · ${chips.length}` : 'Filters'} selected={chips.length > 0} onClick={onOpen} />
      </div>
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

/* ─── THE FUNNEL ────────────────────────────────────────────────────────────────────────────────
   One screen. Four questions, each a function of the one above, each collapsing into its answer. */
const STEP = { ASSET: 1, PRODUCT: 2, CATEGORY: 3 };

function Funnel({ startAssets = [], startFamilies = [], startCats = [], startOpen = STEP.ASSET, startFundId = null, startQ = '' }) {
  const [open, setOpen] = useS1(startOpen);
  const [assets, setAssets] = useS1(startAssets);
  const [fams, setFams] = useS1(startFamilies);
  const [cats, setCats] = useS1(startCats);
  const [q, setQ] = useS1(startQ);
  const [fund, setFund] = useS1(startFundId);
  const [picked, setPicked] = useS1([]);
  const [acted, setActed] = useS1(null);
  /* WHEN A PAGE IS OPEN, THE THREAD RESTS ON IT. Without this the scaffold stayed at the top and the
     page the advisor just opened was below the fold — they tapped a card and nothing appeared to
     happen. Anchoring to the open card is not a navigation: the list is still there above it, and
     closing the card leaves the thread exactly where it was. */
  const openRef = React.useRef(null);

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
  const rows = needle
    ? all.filter((i) => `${i.name} ${i.amc || ''} ${i.category || ''}`.toLowerCase().includes(needle))
    : all;

  const chips = []
    .concat(assets.map((a) => ({ key: `a:${a}`, label: a, drop: () => chooseAsset(a) })))
    .concat(fams.map((f) => ({ key: `f:${f}`, label: familyByKey(f)?.label || f, drop: () => chooseFam(f) })))
    .concat(cats.map((c) => ({ key: `c:${c}`, label: catRows.find((r) => r.key === c)?.label || c, drop: () => chooseCat(c) })));

  const toggleStep = (n) => setOpen((s) => (s === n ? 0 : n));

  return (
    <ScreenScaffold title="Explore" body="thread" anchor={fund ? openRef : 0} revision={fund || 'list'} onMenu={() => {}}
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

        <StepBlock step={2} title="Product"
          chips={fams.map((f) => familyByKey(f)?.label || f)} done={fams.length > 0}
          summary={assets.length ? `${famRows.length} available` : 'Choose an asset class first'}
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

        <StepBlock step={3} title="Category"
          chips={cats.map((c) => catRows.find((r) => r.key === c)?.label).filter(Boolean)}
          done={cats.length > 0}
          count={cats.length ? all.length : undefined}
          summary={fams.length ? `${catRows.length} available` : 'Choose a product first'}
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
              Categories appear once a product is chosen — the third question is a function of the second.
            </p>
          )}
        </StepBlock>
      </StepStack>

      <FilterBar q={q} onQ={setQ} chips={chips} onDrop={(c) => c.drop()} onOpen={() => {}} count={rows.length} />

      {/* THE RESULT IS NOT A STEP. The three questions collapse; the list is what they were for, so it
          is always open and always the tallest thing on the screen. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {rows.length === 0 ? (
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
        {rows.length > 12 && (
          <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)', textAlign: 'center' }}>
            {`${rows.length - 12} more — narrow a step above, or search.`}
          </p>
        )}
      </div>

      {picked.length >= 2 && (
        <InlineActionRow actions={[
          { label: `Compare ${picked.length}`, tone: 'solid' },
          { label: 'See overlap' },
          { label: 'Clear', onClick: () => setPicked([]) },
        ]} />
      )}
      {acted && (
        <Provenance text={`Prototype: “${acted.split(':')[0]}” would open here. The catalogue is real; the destination is another journey.`} />
      )}
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
