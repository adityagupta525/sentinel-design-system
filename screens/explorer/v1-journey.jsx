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
/* THE SIGN GOES BEFORE THE SYMBOL. Straight concatenation gave "₹-320", which is a currency symbol
   applied to a minus rather than a negative amount of rupees — and the minus is U+2212, the one this
   product already uses for a negative return, not a hyphen. */
const rupees = (n) => {
  if (n == null) return null;
  const v = Math.round(n);
  return `${v < 0 ? '−₹' : '₹'}${Math.abs(v).toLocaleString('en-IN')}`;
};
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
    name: deShout(i.name.replace(/\s*-?\s*(Direct Plan|Direct)?\s*(Growth|Growth Option|Option)?\s*(-\s*Direct)?\s*$/i, (m) => (/(growth|direct|option|plan)/i.test(m) ? '' : m)).trim()),
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


/* ─── WHAT IT WOULD HAVE BECOME ─────────────────────────────────────────────────────────────────
   A return is a rate and nobody holds a rate. "9.76% over three years" and "₹10,000 became ₹13,229"
   are the same fact, and only the second one is the sentence an advisor says out loud to a client.
   The owner asked for both directions of it — the lump sum that was left alone and the SIP that was
   paid in monthly.

   EVERY FIGURE HERE IS COMPOUNDED FROM A RATE THE CATALOGUE ACTUALLY CARRIES, and the window is named
   beside it. A fund with no five-year return does not get a five-year row: the row is absent, never
   an em dash and never a projection dressed as a record. Nothing here is forecast — the words are
   "would have become", past tense, because that is all a historical return can honestly say. A
   forward projection is a different product with a different compliance burden and this screen does
   not make one.

   THE SIP IS THE STANDARD FUTURE-VALUE-OF-AN-ANNUITY-DUE, monthly, at the period's own CAGR: the
   instalment is paid at the START of each month, which is what a real SIP mandate does and what makes
   the figure match the ones an advisor sees elsewhere. */
const AMOUNTS = [
  { key: '10k', label: '₹10,000', value: 10000 },
  { key: '1L', label: '₹1 lakh', value: 100000 },
  { key: '10L', label: '₹10 lakh', value: 1000000 },
];
function lumpSum(amount, ratePc, years) { return amount * (1 + ratePc / 100) ** years; }
function sipValue(monthly, ratePc, years) {
  const m = (1 + ratePc / 100) ** (1 / 12) - 1;
  const n = Math.round(years * 12);
  if (m === 0) return monthly * n;
  return monthly * ((((1 + m) ** n) - 1) / m) * (1 + m);
}
const WINDOWS = [
  { key: 'y1', years: 1, label: 'one year' },
  { key: 'y3', years: 3, label: 'three years' },
  { key: 'y5', years: 5, label: 'five years' },
];

function GrowthCalc({ i, amount, onAmount }) {
  const [mode, setMode] = useS1('lump');
  const rows = WINDOWS.filter((w) => i.returns?.[w.key] != null);
  if (!rows.length) return null;
  const amt = AMOUNTS.find((a) => a.key === amount) || AMOUNTS[0];
  const isSip = mode === 'sip';

  return (
    <div>
      <SegmentedRow label="Put in" options={AMOUNTS.map((a) => a.label)}
        value={amt.label} onChange={(x) => onAmount(AMOUNTS.find((a) => a.label === x).key)} />
      <div style={{ marginTop: 'var(--space-8)' }}>
        <SegmentedRow label="How" options={['All at once', 'Every month']}
          value={isSip ? 'Every month' : 'All at once'}
          onChange={(x) => setMode(x === 'Every month' ? 'sip' : 'lump')} />
      </div>
      <div style={{ marginTop: 'var(--space-12)' }}>
        <MetricList>
          {rows.map((w) => {
            const r = i.returns[w.key];
            const end = isSip ? sipValue(amt.value, r, w.years) : lumpSum(amt.value, r, w.years);
            const put = isSip ? amt.value * w.years * 12 : amt.value;
            const gain = end - put;
            return (
              <MetricRow key={w.key} label={`Over ${w.label}`} value={rupees(end)}
                peers={[
                  { label: 'Put in', value: rupees(put) },
                  { label: 'Gained', value: rupees(gain), self: true },
                  { label: 'At', value: `${r.toFixed(2)}%` },
                ]}
                note={`${isSip ? `${rupees(amt.value)} a month for ${w.label}` : `${rupees(amt.value)} left alone for ${w.label}`}, compounded at the ${w.label} return the catalogue carries. What it did, not what it will do.`} />
            );
          })}
        </MetricList>
      </div>
      <p style={{ margin: `var(--space-8) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
        Past returns, compounded. Not a projection, and not advice.
      </p>
    </div>
  );
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

function OnePager({ i, onAct, onClose, shortlisted, amount, onAmount }) {
  const p = onePagerOf(i.id) || {};
  const [metric, setMetric] = useS1(null);
  const [lens, setLens] = useS1('sector');
  /* ONE SECTION OPEN AT A TIME, AND THE FIRST ONE BY DEFAULT. The owner's note was that the pager is
     right but too long — "usme sab information bhi dikhaye aur itna lamba bhi na ho". A section strip
     would have cost a permanent 44pt band; folding the sections costs nothing and uses the gesture
     the funnel already taught. `StepBlock` IS that gesture, so the pager folds with the same
     component the steps do rather than a second accordion with its own behaviour. */
  const [fold, setFold] = useS1('returns');
  const t = (k) => () => setMetric((x) => (x === k ? null : k));
  const f = (k) => () => setFold((x) => (x === k ? null : k));

  const nav = rebase(p.nav);
  const bench = rebase(p.bench);
  const held = holdersOf(i.id) || [];

  const lenses = [];
  if (p.sector) lenses.push({ key: 'sector', label: 'Sector' });
  if (p.marketCap) lenses.push({ key: 'cap', label: 'Market cap' });
  if (p.holdings) lenses.push({ key: 'holdings', label: 'Top holdings' });
  const useLens = lenses.some((l) => l.key === lens) ? lens : lenses[0]?.key;
  const rows = useLens === 'sector' ? p.sector : useLens === 'cap' ? p.marketCap : p.holdings;
  const oneSegment = rows && rows.length === 1;
  const mRows = metricRows(i, p);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', paddingTop: 'var(--space-8)', borderTop: 'var(--border-hairline) solid var(--color-line)' }}>
      <SentinelText text={narrate(i)} />

      {nav && (
        <StepBlock title="What ₹100 became" open={fold === 'returns'} onToggle={f('returns')}
          summary={`${Math.round(nav[nav.length - 1].y)} from 100${bench ? ` · benchmark ${Math.round(bench[bench.length - 1].y)}` : ''}`}>
          <ChartReadout label={monthYear(p.nav[p.nav.length - 1][0]) || 'Latest'}
            value={String(Math.round(nav[nav.length - 1].y))} idleNote="rebased from 100" />
          <div style={{ marginTop: 'var(--space-4)' }}>
            <ChartLine series={[{ label: 'This fund', points: nav }]} density="expanded" width={295}
              valueFormat={(v) => `${v.toFixed(0)}`} xFormat={(x) => (p.nav[x] ? monthYear(p.nav[x][0]) : '')} />
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
        </StepBlock>
      )}

      {i.returns?.y3 != null && p.ratios?.cat3 != null && (
        <PeerLine value={i.returns.y3} peer={p.ratios.cat3} period="3 years"
          peerLabel={`${(i.subTypeLabel || i.category || 'Category')} average`} unit="%" />
      )}

      {mRows.length > 0 && (
        <StepBlock title="How it has done" open={fold === 'metrics'} onToggle={f('metrics')}
          summary={`${mRows.length} figures, each against its peers`}>
          <MetricList>
            {mRows.map((m) => <MetricRow key={m.label} {...m} open={metric === m.label} onToggle={t(m.label)} />)}
          </MetricList>
        </StepBlock>
      )}

      {rows && (
        <StepBlock title="What it holds" open={fold === 'holds'} onToggle={f('holds')}
          summary={oneSegment ? `All ${rows[0].pct}% ${rows[0].name.toLowerCase()}` : `${rows.length} ${useLens === 'sector' ? 'sectors' : useLens === 'cap' ? 'bands' : 'holdings'}`}>
          {lenses.length > 1 && (
            <div style={{ marginBottom: 'var(--space-12)' }}>
              <SegmentedRow label="Breakdown" options={lenses.map((l) => l.label)}
                value={lenses.find((l) => l.key === useLens)?.label}
                onChange={(x) => setLens(lenses.find((l) => l.label === x).key)} />
            </div>
          )}
          {oneSegment ? (
            <p style={{ margin: 0, font: 'var(--type-body-font)', color: 'var(--color-ink)' }}>
              {`All of it — ${rows[0].pct}% — is ${rows[0].name.toLowerCase()}.`}
            </p>
          ) : (
            <ChartShare segments={rows.map((r) => ({ label: titleish(r.name), value: r.pct }))}
              valueFormat={(v) => `${v.toFixed(1)}%`}
              caveat={`top ${rows.length} · as of ${monthYear(i.priceDate) || 'the last file'}`} />
          )}
        </StepBlock>
      )}

      {i.returns && (i.returns.y1 != null || i.returns.y3 != null || i.returns.y5 != null) && (
        <StepBlock title="What ₹10,000 would have become" open={fold === 'calc'} onToggle={f('calc')}
          summary={i.returns.y5 != null ? `₹${Math.round(lumpSum(10000, i.returns.y5, 5)).toLocaleString('en-IN')} over five years`
            : i.returns.y3 != null ? `₹${Math.round(lumpSum(10000, i.returns.y3, 3)).toLocaleString('en-IN')} over three years`
            : `₹${Math.round(lumpSum(10000, i.returns.y1, 1)).toLocaleString('en-IN')} over one year`}>
          <GrowthCalc i={i} amount={amount} onAmount={onAmount} />
        </StepBlock>
      )}

      {(held.length > 0 || p.pending) && (
        <StepBlock title="On file" open={fold === 'file'} onToggle={f('file')}
          summary={held.length ? `${held.length} of your clients hold this` : `${p.pending.length} fields not on file`}>
          {held.length > 0 && (
            <p style={{ margin: 0, font: 'var(--type-body-font)', color: 'var(--color-ink)' }}>
              {`${held.length} of your clients already hold this — ${held.join(' · ')}.`}
            </p>
          )}
          {p.pending && (
            <div style={{ marginTop: held.length ? 'var(--space-12)' : 0 }}>
              <RejectCallout eyebrow="NOT ON FILE FOR THIS INSTRUMENT"
                body={`${p.pending.slice(0, 5).map(prettyField).join(', ')}${p.pending.length > 5 ? `, and ${p.pending.length - 5} more` : ''}. Named here rather than left out, so the gap is visible.`} />
            </div>
          )}
        </StepBlock>
      )}

      <Provenance text={`Catalogue · ${i.priceDate ? `priced ${monthYear(i.priceDate)}` : 'no price on file'}${i.benchmark ? ` · benchmark ${shortBench(i.benchmark)}` : ''}`} />

      {/* EVERY ONE OF THESE DOES SOMETHING NOW. They were `setActed(...)` — a string the screen then
          printed as a provenance line, which is the F-61 defect wearing a different hat: four controls
          that looked live and moved nothing. Compare and Shortlist act on this screen; proposal and
          rebalance belong to other journeys and say so in the turn they produce, which is the honest
          shape for a prototype boundary. */}
      <InlineActionRow actions={[
        { label: 'Compare', tone: 'primary', onClick: () => onAct('compare', i) },
        { label: shortlisted ? 'Shortlisted' : 'Shortlist', onClick: () => onAct('shortlist', i) },
        { label: 'Add to a proposal', onClick: () => onAct('proposal', i) },
        { label: 'Add to a rebalance', onClick: () => onAct('rebalance', i) },
      ]} />

      {/* CLOSING FROM THE BOTTOM. The owner had to scroll back to the card's head to shut a page he
          had just read to the end of — the one place he certainly was not. */}
      <InlineActionRow actions={[{ label: 'Close this fund', onClick: onClose }]} />
    </div>
  );
}

/* WHAT THE LIST IS, IN A SENTENCE. Not a count — the count is already on the step and in the filter
   row. This is the reading: the spread, and the one fact that decides between them. */
function listNote(rows, cats, fams) {
  const withRet = rows.filter((r) => r.returns?.y3 != null);
  if (withRet.length >= 2) {
    const sorted = [...withRet].sort((a, b) => b.returns.y3 - a.returns.y3);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    const cheapest = rows.filter((r) => r.ter != null).sort((a, b) => a.ter - b.ter)[0];
    return `${rows.length} match. Three-year returns run from ${pc(lo.returns.y3)} to ${pc(hi.returns.y3)} — ${cardFor(hi).name} at the top${cheapest ? `, and ${cardFor(cheapest).name} is the cheapest at ${cheapest.ter.toFixed(2)}%` : ''}.`;
  }
  const noRet = rows.filter((r) => r.returns?.y3 == null).length;
  if (noRet === rows.length) return `${rows.length} match. None of them carries a return in the catalogue — these are judged on their own terms: coupon, maturity, face value.`;
  return `${rows.length} match.`;
}

/* Sector names arrive SHOUTING from the source — "FINANCIALS", "PHARMA & HEALTHCARE" — beside ones
   that do not — "Consumer Cyclical". Rule 6 is sentence case, and a chart legend that is half caps is
   the data's formatting leaking onto the screen. */
/* Sector and company names arrive SHOUTING from the source — "FINANCIALS", "RELIANCE INDUSTRIES LTD"
   — beside ones that do not, and rule 6 is sentence case. But an ACRONYM is not shouting: ICICI, HDFC,
   SBI, NTPC and L&T are the names, and the first pass turned them into "Icici" and "Hdfc", which is a
   different and more embarrassing wrong than leaving them capitalised. So a word of five letters or
   fewer in full caps is kept — that is where Indian financial acronyms live — and anything longer is
   a shouted word and is lowered. */
function titleish(s) {
  if (!s) return s;
  return s.split(' ').map((w) => {
    const bare = w.replace(/[^A-Za-z]/g, '');
    if (bare.length <= 5 && w === w.toUpperCase()) return w;
    return w.length > 2 && w === w.toUpperCase() ? w[0] + w.slice(1).toLowerCase() : w;
  }).join(' ');
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


/* ─── THE COMPOSER DRIVES THE FUNNEL ────────────────────────────────────────────────────────────
   The owner's ruling: it does not all have to be chat, but a sentence typed into the composer has to
   move the same funnel the tiles move. Not a second way in with its own behaviour — the SAME state,
   reached differently. Typing "equity mutual funds under 0.5%" and tapping Equity, Mutual fund, then
   the expense filter must land in exactly the same place, because they are the same request.

   THE VOCABULARY IS THE CATALOGUE'S OWN. Every phrase this understands is built at parse time from
   the asset names, family labels, sub-type labels and house names that are actually in the data —
   so it cannot learn a word the catalogue does not have, and it cannot fall behind when the
   catalogue gains one. The only hand-written entries are abbreviations an advisor actually types
   ("mf", "fd", "ncd"), and each one maps to a label that must already exist.

   IT SAYS WHAT IT DID **AND WHAT IT DID NOT**. This is the part that matters. F-61 in this
   repository's own findings is the prototype claiming it had filtered a shortlist and not doing it,
   and a parser is where that defect is born: it matches two words out of nine, applies them, and the
   advisor believes the other seven landed. So every parse returns `ignored` — the words it could not
   place — and `ParseNote` prints them. A sentence that matched nothing changes nothing and says so.

   LONGEST PHRASE FIRST. "large cap fund" must beat "cap", and "mutual fund" must beat "fund", or the
   first match eats the words the better match needed. */
const ASK_ALIASES = {
  mf: 'Mutual fund', mfs: 'Mutual fund', 'mutual funds': 'Mutual fund',
  fd: 'Fixed deposit', fds: 'Fixed deposit', deposits: 'Fixed deposit',
  ncd: 'Bonds', ncds: 'Bonds', bond: 'Bonds', debentures: 'Bonds',
  pms: 'PMS', aif: 'AIF', aifs: 'AIF', reit: 'REITs & InvITs', reits: 'REITs & InvITs',
  invit: 'REITs & InvITs', invits: 'REITs & InvITs', gold: 'Commodity', sgb: 'Commodity',
  equities: 'Equity', shares: 'Equity', debt: 'Debt',
};
const ASK_STOP = new Set(['show', 'me', 'find', 'a', 'an', 'the', 'and', 'or', 'with', 'in', 'of', 'for',
  'that', 'which', 'any', 'all', 'some', 'please', 'give', 'want', 'need', 'looking', 'look', 'funds',
  'fund', 'instrument', 'instruments', 'under', 'over', 'above', 'below', 'than', 'more', 'less',
  'is', 'are', 'to', 'from', 'by', 'on', 'at', 'it', 'its', 'only', 'just', 'top', 'best', 'good',
  /* Qualifiers the BAND already names. "expense under 0.5%" is understood in full, and reporting
     "expense" as a word it could not place is the mirror of F-61: claiming it ignored something it
     acted on is as untrue as claiming it acted on something it ignored. */
  'expense', 'ratio', 'ter', 'cost', 'charge', 'charges', 'return', 'returns', 'size', 'aum',
  'yield', 'coupon', 'year', 'years', 'yr', 'cr', 'crore', 'crores']);

function parseAsk(raw) {
  const text = ` ${String(raw).toLowerCase().replace(/[^a-z0-9.%&₹ -]/g, ' ').replace(/\s+/g, ' ')} `;
  let left = text;
  const out = { assets: [], families: [], cats: [], facets: {}, q: '', understood: [], ignored: [] };
  /* The note reads in the order the FUNNEL asks — asset, product, category, house, band — not the
     order the phrases happened to be matched in, which is by length. "Read as Mutual fund · Equity"
     is the same facts in an order nobody thinks in. */
  const say = { asset: [], family: [], cat: [], house: [], band: [] };

  /* Every phrase the catalogue knows, longest first. */
  const vocab = [];
  for (const a of ASSETS) vocab.push({ phrase: a.label.toLowerCase(), kind: 'asset', value: a.label });
  const assetWords = new Set(ASSETS.map((a) => a.label.toLowerCase()));
  const familyWords = new Set(FAMILIES.map((f) => f.label.toLowerCase()));
  for (const f of FAMILIES) {
    vocab.push({ phrase: f.label.toLowerCase(), kind: 'family', value: f.key });
    for (const st of f.subTypes) {
      vocab.push({ phrase: st.label.toLowerCase(), kind: 'cat', value: `${f.key}:${st.key}` });
      /* AND THE CATEGORY WITHOUT ITS PRODUCT WORD. Testing caught it: an advisor types "small cap",
         never "Small Cap Fund", and the catalogue's own label carries the product on the end. The
         short form is registered ONLY when it is two words or more — "Debt PMS" would shorten to
         "debt", which is an asset class, and a parser that reads the asset as a category is worse
         than one that reads nothing.

         A short form that several families share — "large cap" is both a fund and a PMS — is applied
         to ALL of them, deliberately. "Large cap" means large cap wherever it lives, and a category
         whose family is not in the set simply matches nothing. */
      const short = st.label.toLowerCase().replace(/ (fund|pms|aif|bond|debenture)s?$/, '').trim();
      if (short !== st.label.toLowerCase() && short.split(' ').length >= 2
        && !assetWords.has(short) && !familyWords.has(short)) {
        vocab.push({ phrase: short, kind: 'cat', value: `${f.key}:${st.key}`, short: true });
      }
    }
  }
  for (const [k, v] of Object.entries(ASK_ALIASES)) {
    const fam = FAMILIES.find((f) => f.label === v);
    const asset = ASSETS.find((a) => a.label === v);
    if (fam) vocab.push({ phrase: k, kind: 'family', value: fam.key });
    else if (asset) vocab.push({ phrase: k, kind: 'asset', value: asset.label });
  }
  const houses = [...new Set(INSTRUMENTS.map(FACET_OF.amc).filter(Boolean))];
  for (const h of houses) {
    vocab.push({ phrase: h.toLowerCase(), kind: 'house', value: h });
    const first = h.split(' ')[0].toLowerCase();
    if (first.length > 3) vocab.push({ phrase: first, kind: 'house', value: h });
  }
  vocab.sort((a, b) => b.phrase.length - a.phrase.length);

  for (const v of vocab) {
    /* A TRAILING PLURAL IS THE SAME WORD. Testing caught this: "large cap funds" did not match the
       catalogue's "Large Cap Fund", because the lookahead demanded a non-letter after "fund" and
       found an "s". Advisors type plurals — "large cap funds", "bonds", "mutual funds" — and a
       parser that reports those as words it could not place is a parser nobody will type into
       twice. */
    const re = new RegExp(`(?<=[^a-z0-9])${v.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?(?=[^a-z0-9])`);
    if (!re.test(left)) continue;
    /* A SHORT CATEGORY DOES NOT CONSUME THE WORDS. "large cap" belongs to a fund and to a PMS, and
       whichever sorted first would otherwise eat it for the other. Only full phrases consume. */
    if (!v.short) left = left.replace(re, ' ');
    if (v.kind === 'asset' && !out.assets.includes(v.value)) { out.assets.push(v.value); say.asset.push(v.value); }
    if (v.kind === 'family' && !out.families.includes(v.value)) { out.families.push(v.value); say.family.push(familyByKey(v.value)?.label || v.value); }
    if (v.kind === 'cat' && !out.cats.includes(v.value)) { out.cats.push(v.value); say.cat.push(v.phrase.replace(/\b\w/g, (c) => c.toUpperCase())); }
    if (v.kind === 'house' && !(out.facets.amc || []).includes(v.value)) { out.facets.amc = (out.facets.amc || []).concat(v.value); say.house.push(v.value); }
  }

  /* NUMBERS ONLY WHERE A BAND EXISTS. "under 0.5%" is an expense ratio, "over 15%" a three-year
     return, "over 5000 cr" a fund size — and each one resolves to a band the facet builder already
     defines, so the sentence and the sheet cannot disagree about what the words mean. */
  const ter = left.match(/(under|below|less than)\s*([0-9.]+)\s*%/);
  if (ter && Number(ter[2]) <= 3) {
    const b = TER_BANDS.find((x) => Number(ter[2]) <= x.hi) || TER_BANDS[0];
    out.facets.ter = [b.key]; say.band.push(`expense ratio ${b.label.toLowerCase()}`);
    left = left.replace(ter[0], ' ');
  }
  const ret = left.match(/(over|above|more than)\s*([0-9.]+)\s*%/);
  if (ret) {
    const b = RET_BANDS.find((x) => Number(ret[2]) >= x.lo) || RET_BANDS[0];
    out.facets.r3 = [b.key]; say.band.push(`three-year return ${b.label.toLowerCase()}`);
    left = left.replace(ret[0], ' ');
  }
  /* AN AMOUNT WITHOUT "over" OR "under" IS A SUM TO INVEST, not a filter. "10000 in canara" and
     "1 lakh in large cap" are the calculator's question, and reading them as a fund-size band would
     be the parser confidently doing the wrong thing — which is worse than not understanding. */
  const amt = left.match(/(?<!(over|above|under|below|more than|less than)\s)₹?\s*([0-9][0-9,]*)\s*(lakhs|lakh|thousand|l|k)?(?!\s*(%|cr|crore))/);
  if (amt) {
    const n = Number(amt[2].replace(/,/g, '')) * (/^l/.test(amt[3] || '') ? 1e5 : /^(k|thousand)/.test(amt[3] || '') ? 1e3 : 1);
    const band = n >= 5e5 ? '10L' : n >= 5e4 ? '1L' : '10k';
    if (n >= 1000) {
      out.amount = band;
      say.band.push(`${AMOUNTS.find((a) => a.key === band).label} to put in`);
      left = left.replace(amt[0], ' ');
    }
  }

  const aum = left.match(/(over|above|more than)\s*₹?\s*([0-9,]+)\s*(cr|crore|crores)/);
  if (aum) {
    const n = Number(aum[2].replace(/,/g, '')) * 1e7;
    const b = AUM_BANDS.find((x) => n >= x.lo) || AUM_BANDS[AUM_BANDS.length - 1];
    out.facets.aum = [b.key]; say.band.push(`fund size ${b.label.toLowerCase()}`);
    left = left.replace(aum[0], ' ');
  }

  /* WHAT IS LEFT. Stopwords are dropped silently — they carried no request. Anything else is a word
     the advisor meant and this did not place, and it is reported rather than swallowed. */
  out.understood = [].concat(say.asset, say.family, say.cat, say.house, say.band);
  /* Short forms did not consume their words above, so they are cleared here — once, after every
     family has had its chance to claim them. */
  for (const v of vocab) {
    if (!v.short || !out.cats.includes(v.value)) continue;
    left = left.replace(new RegExp(`(?<=[^a-z0-9])${v.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?(?=[^a-z0-9])`, 'g'), ' ');
  }
  out.ignored = left.split(' ').map((w) => w.trim()).filter((w) => w.length > 2 && !ASK_STOP.has(w) && !/^[0-9.%₹,-]+$/.test(w));
  return out;
}

/* The sentence Sentinel says back. Built from the parse, never templated over it — a note that reads
   the same whether or not anything matched is the note that taught the advisor to stop reading it. */
function askNote(parse, count) {
  if (!parse.understood.length) {
    return parse.ignored.length
      ? `Nothing here matched the catalogue: ${parse.ignored.join(', ')}. The funnel is unchanged — try an asset class, a product, a category or a house.`
      : 'Nothing in that to act on. The funnel is unchanged.';
  }
  const did = `Read as ${parse.understood.join(' · ')} — ${count.toLocaleString('en-IN')} left.`;
  return parse.ignored.length ? `${did} Not used: ${parse.ignored.join(', ')}.` : did;
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

function CompareBlock({ ids, onClear, onDrop, onAdd, candidates = [] }) {
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
        onAdd={rows.length < 3 && candidates.length ? onAdd : undefined}
        addLabel="Add a third"
        capNote="Three at a time — a fourth column at 375 makes every figure unreadable, which is the PRD's own ceiling."
        footnote="Rows appear where at least one of the chosen instruments has the figure. A blank is never printed as a zero." />

      {/* ADDING THE THIRD WITHOUT LEAVING. The owner's note: inside the comparison there was no way
          to add one and no way to drop one — the only controls were back up in the list, which is
          exactly where he was not. The candidates are the rest of the CURRENT result set, so this
          cannot offer a fund the filters have already excluded. */}
      {rows.length < 3 && candidates.length > 0 && (
        <div style={{ marginTop: 'var(--space-12)' }}>
          <Eyebrow>ADD A THIRD</Eyebrow>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <ChipRow>
              {candidates.slice(0, 6).map((c) => (
                <Pill key={c.id} label={cardFor(c).name} size="sm" onClick={() => onAdd(c.id)} />
              ))}
            </ChipRow>
          </div>
        </div>
      )}
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

/* ─── OVERLAP — A MATRIX, AND WHAT IS ACTUALLY SHARED ──────────────────────────────────────────
   AND THIS IS WHERE THE DATA HAS TO BE ADMITTED. A real overlap is computed on the full portfolio,
   every holding by weight. The catalogue carries the TOP FIVE holdings and the TOP FIVE SECTORS per
   instrument, and nothing more. So what is computed here is the shared weight among those, and the
   footnote says so in the advisor's own words rather than letting a number imply a portfolio-level
   answer it cannot support. A figure whose basis is not stated is not a figure.

   TWO PROPERTIES, BECAUSE THEY ANSWER DIFFERENT QUESTIONS. Holdings overlap tells an advisor the two
   funds own the same companies — the concentration risk. Sector overlap tells them the two funds
   make the same BET even where the names differ, which is the risk that hides from a holdings check
   and is the one a client asks about after a bad quarter.

   A MATRIX AT THREE, PAIRS AT TWO. With two funds a matrix is one cell with two empty ones around it,
   which is a grid drawn to hold a single number. The owner's cap is three and three is where the
   matrix earns itself: three pairs, read at once, with the worst of them obvious. */
function sharedOn(a, b, key) {
  const A = (onePagerOf(a) || {})[key] || [], B = (onePagerOf(b) || {})[key] || [];
  if (!A.length || !B.length) return null;
  const byName = new Map(B.map((h) => [h.name.toLowerCase(), h.pct]));
  let sum = 0;
  for (const h of A) {
    const other = byName.get(h.name.toLowerCase());
    if (other != null) sum += Math.min(h.pct, other);
  }
  return +sum.toFixed(1);
}
const sharedPct = (a, b) => sharedOn(a, b, 'holdings');

/* The names behind the number. "62%" is not an answer on its own — the advisor's next question is
   always WHICH, and answering it is the difference between a figure and a finding. */
function sharedNames(ids, key) {
  const lists = ids.map((id) => (onePagerOf(id) || {})[key] || []);
  if (lists.some((l) => !l.length)) return [];
  const [first, ...rest] = lists;
  return first
    .map((h) => {
      const others = rest.map((l) => l.find((x) => x.name.toLowerCase() === h.name.toLowerCase()));
      if (others.some((o) => !o)) return null;
      return { name: h.name, pct: Math.min(h.pct, ...others.map((o) => o.pct)) };
    })
    .filter(Boolean)
    .sort((a, b) => b.pct - a.pct);
}

function OverlapBlock({ ids, onDrop, onAdd, candidates = [] }) {
  const rows = ids.map(instrumentById).filter(Boolean);
  const [prop, setProp] = useS1('holdings');
  const [mode, setMode] = useS1(null);
  if (rows.length < 2) return null;
  const key = prop === 'sector' ? 'sector' : 'holdings';
  const pairs = [];
  for (let x = 0; x < rows.length; x += 1) {
    for (let y = x + 1; y < rows.length; y += 1) {
      pairs.push({ a: rows[x].id, b: rows[y].id, pct: sharedOn(rows[x].id, rows[y].id, key) });
    }
  }
  const known = pairs.filter((c) => c.pct != null);
  const useMode = mode || (rows.length >= 3 ? 'matrix' : 'pairs');
  const shared = sharedNames(ids, key);

  return (
    <Surface>
      <Eyebrow>WHERE THEY HOLD THE SAME THING</Eyebrow>
      {/* THE LENS SWITCH IS A SEGMENTED ROW, not OverlapView's own "Add property" pill. That pill
          renders only when a property is INACTIVE and it is labelled for adding, which is a different
          promise from switching — and this screen already switches the composition lens with a
          SegmentedRow, so one control does one job across the whole funnel. */}
      {known.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          <SegmentedRow label="Computed on" options={['Top holdings', 'Sector']}
            value={prop === 'sector' ? 'Sector' : 'Top holdings'}
            onChange={(x) => setProp(x === 'Sector' ? 'sector' : 'holdings')} />
        </div>
      )}
      <div style={{ marginTop: 'var(--space-8)' }}>
        {known.length ? (
          <>
            <OverlapView mode={useMode}
              funds={rows.map((i) => ({ id: i.id, name: cardFor(i).name, inComparison: true }))}
              properties={[{ id: key, label: key === 'sector' ? 'Sector' : 'Top holdings', active: true }]}
              cells={pairs} maxFunds={3}
              onToggleFund={(id) => onDrop(id)}
              onChangeMode={(m) => setMode(m)}
              onAddFund={candidates.length ? onAdd : undefined}
              footnote={`Shared weight among the top five ${key === 'sector' ? 'sectors' : 'holdings'} the catalogue carries for each — not the whole portfolio. A true overlap needs every holding by weight, and that is not on file here.`} />

            {/* WHICH ONES. The number says how much; this says what — and an advisor asked "why do
                these two move together" needs the second one to answer a client. */}
            {shared.length > 0 && (
              <div style={{ marginTop: 'var(--space-12)' }}>
                <Eyebrow>{key === 'sector' ? 'THE SECTORS ALL OF THEM HOLD' : 'THE COMPANIES ALL OF THEM HOLD'}</Eyebrow>
                <div style={{ marginTop: 'var(--space-8)' }}>
                  <ChartLegend layout="stacked" items={shared.slice(0, 5).map((h) => ({
                    label: titleish(h.name), value: `${h.pct.toFixed(1)}%`, amount: h.pct,
                  }))} />
                </div>
              </div>
            )}
            {shared.length === 0 && (
              <p style={{ margin: `var(--space-12) 0 0`, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>
                {`No single ${key === 'sector' ? 'sector' : 'company'} appears in all ${rows.length} — the overlap above is pairwise.`}
              </p>
            )}
          </>
        ) : (
          <ConstraintCallout eyebrow="NO HOLDINGS ON FILE"
            body="Neither of these carries a holdings list in the catalogue, so there is nothing to intersect. Bonds, deposits and REITs have no portfolio to overlap." />
        )}
      </div>
    </Surface>
  );
}

/* ─── THE FUNNEL ────────────────────────────────────────────────────────────────────────────────
   One screen. Four questions, each a function of the one above, each collapsing into its answer. */
const STEP = { ASSET: 1, PRODUCT: 2, CATEGORY: 3 };

function Funnel({ startAssets = [], startFamilies = [], startCats = [], startOpen = STEP.ASSET, startFundId = null, startQ = '', startPicked = [], startSheet = false, startShow = null, startAsked = null }) {
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
  /* The composer's own state, and the LAST thing it was asked. One turn, not a log: a funnel that
     accumulates ten parse notes has stopped being a funnel and become a chat transcript with a list
     at the bottom. The note is replaced, and what it did is already visible in the steps above it. */
  const [ask, setAsk] = useS1('');
  const [shortlist, setShortlist] = useS1([]);
  const [said, setSaid] = useS1(null);
  /* The amount lives on the SCREEN, not on the card, so opening a second fund keeps the sum the
     advisor was working in. Changing it on one page changes it on the next, which is what a person
     comparing two funds at ten lakh actually wants. */
  const [amount, setAmount] = useS1('10k');
  const [asked, setAsked] = useS1(startAsked || null);
  /* WHEN A PAGE IS OPEN, THE THREAD RESTS ON IT. Without this the scaffold stayed at the top and the
     page the advisor just opened was below the fold — they tapped a card and nothing appeared to
     happen. Anchoring to the open card is not a navigation: the list is still there above it, and
     closing the card leaves the thread exactly where it was. */
  const openRef = React.useRef(null);
  const showRef = React.useRef(null);
  const askRef = React.useRef(null);

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
  /* THE STEP DOES NOT CLOSE ITSELF ON THE FIRST PICK. It used to: choosing Equity collapsed the
     asset step and opened the next one, which makes multi-select impossible — the owner's note was
     "main ek ya do bhi to click kar sakta hu". A step that decides you are finished the moment you
     touch it is a radio button pretending to be a checkbox.

     So the step stays open and an ACTION appears inside it once there is an answer. Tapping that is
     what collapses this step and opens the next, which is also the owner's earlier ruling that the
     action should appear after the selection. Nothing advances without being told to. */
  const advance = (to) => setOpen(to);
  /* The path, for the bar that never scrolls away. */
  const path = []
    .concat(assets.length ? [{ key: 'asset', label: assets.join(' · '), step: STEP.ASSET }] : [])
    .concat(fams.length ? [{ key: 'product', label: fams.map((f) => familyByKey(f)?.label || f).join(' · '), step: STEP.PRODUCT }] : [])
    .concat(cats.length ? [{ key: 'category', label: cats.map((c) => catRows.find((r) => r.key === c)?.label).filter(Boolean).join(' · '), step: STEP.CATEGORY }] : []);
  /* A TYPED SENTENCE LANDS IN THE SAME STATE THE TILES DO. It replaces rather than accumulates:
     "equity mutual funds" then "debt" means debt, which is what the words mean. Anything the parse
     did not place is left in the search box rather than dropped, so a fund name typed mid-sentence
     still does something. */
  const send = () => {
    const text = ask.trim();
    if (!text) return;
    const parse = parseAsk(text);
    /* A CATEGORY IMPLIES ITS FAMILY, AND A FAMILY ITS ASSET. "large cap funds from canara" names no
       asset class, and taking it literally left step 1 empty while the list below it was filtered —
       the funnel's own steps disagreeing with the funnel's own result. A category cannot exist
       without the product it belongs to; filling that in is not inventing a request, it is stating
       what the request already meant. The crumbs then read as a path rather than as one orphan. */
    const impliedFams = [...new Set(parse.families.concat(parse.cats.map((c) => c.split(':')[0])))];
    const impliedAssets = [...new Set(parse.assets.concat(
      impliedFams.flatMap((k) => familyByKey(k)?.assets || []),
    ))].filter((a) => ASSETS.some((x) => x.label === a));

    if (impliedAssets.length) { setAssets(impliedAssets); setFams([]); setCats([]); }
    if (impliedFams.length) { setFams(impliedFams); setCats([]); }
    if (parse.cats.length) setCats(parse.cats);
    setFacets(Object.keys(parse.facets).length ? parse.facets : {});
    if (parse.amount) setAmount(parse.amount);
    const leftovers = parse.ignored.join(' ');
    setQ(parse.understood.length ? '' : leftovers);
    const nextAssets = impliedAssets.length ? impliedAssets : assets;
    const nextFams = impliedFams.length ? impliedFams : (impliedAssets.length ? [] : fams);
    const nextCats = parse.cats.length ? parse.cats : ((impliedAssets.length || impliedFams.length) ? [] : cats);
    const n = applyFacets(instrumentsFor({ assets: nextAssets, families: nextFams, categories: nextCats }), parse.facets).length;
    setAsked({ text, note: askNote(parse, n), ok: parse.understood.length > 0 });
    setOpen(0); setFund(null); setShow(null); setAsk('');
  };

  /* WHAT EACH ACTION ACTUALLY DOES. Compare and Shortlist change this screen; proposal and rebalance
     belong to journeys D and E and say so. Every one of them produces a SENTENCE built from this
     instrument's own figures — two or three lines, which is what the owner asked for and also the
     only thing that makes a shortlist worth having a week later, when "why did I save this" is the
     whole question. */
  const reason = (inst) => {
    const pg = onePagerOf(inst.id) || {};
    const bits = [];
    if (inst.returns?.y3 != null && pg.ratios?.cat3 != null) {
      const d = +(inst.returns.y3 - pg.ratios.cat3).toFixed(2);
      bits.push(`${Math.abs(d).toFixed(2)} points ${d >= 0 ? 'ahead of' : 'behind'} its category over three years`);
    }
    if (inst.ter != null) {
      const peers = instrumentsFor({ categories: [`${inst.family}:${inst.subType}`] }).filter((x) => x.ter != null);
      const cheaper = peers.filter((x) => x.ter < inst.ter).length;
      bits.push(`costs ${inst.ter.toFixed(2)}%${peers.length > 1 ? `, ${cheaper === 0 ? 'the cheapest' : `${cheaper} cheaper`} of the ${peers.length} in this category` : ''}`);
    }
    const held = holdersOf(inst.id) || [];
    if (held.length) bits.push(`${held.length} of your clients already hold it`);
    return bits.length ? `${cardFor(inst).name} — ${bits.join('; ')}.` : `${cardFor(inst).name}. The catalogue carries no return, cost or holding for it, so there is nothing here to judge it on yet.`;
  };

  const act = (what, inst) => {
    if (what === 'compare') {
      setPicked((s2) => (s2.includes(inst.id) ? s2 : s2.concat(inst.id).slice(-3)));
      setShow('compare'); setFund(null);
      setSaid({ say: `Added ${cardFor(inst).name} to the comparison.`, body: reason(inst) });
      return;
    }
    if (what === 'shortlist') {
      const on = shortlist.includes(inst.id);
      setShortlist((s2) => (on ? s2.filter((x) => x !== inst.id) : s2.concat(inst.id)));
      setSaid(on
        ? { say: `Taken ${cardFor(inst).name} off the shortlist.`, body: null }
        : { say: `Shortlisted ${cardFor(inst).name}.`, body: reason(inst) });
      return;
    }
    /* A PROTOTYPE BOUNDARY, NAMED. These open journeys D and E, which this screen is not. Saying so
       is the honest shape — a control that silently does nothing is the defect; a control that says
       where it goes is a control. */
    setSaid({
      say: `${cardFor(inst).name} is staged for ${what === 'proposal' ? 'a proposal' : 'a rebalance'}.`,
      body: `${reason(inst)} The ${what} itself opens in its own journey — this screen stages the fund and hands it over.`,
    });
  };

  const resetAll = () => { setAssets([]); setFams([]); setCats([]); setFacets({}); setQ(''); setPicked([]); setShow(null); setFund(null); setOpen(STEP.ASSET); };

  return (
    <ScreenScaffold title="Explore" body="thread" rest="top"
      anchor={fund ? openRef : show ? showRef : asked ? askRef : 0}
      revision={fund || show || (asked && asked.text) || 'list'} onMenu={() => {}}
      composer={<Composer value={ask} onChange={setAsk} onSend={send}
        placeholder="Ask Sentinel — or name an asset, a product, a house" onAttach={() => {}} />}
      overlay={(
        /* THE SHEET IS THE SAME FILTERS THE BAR IS ALREADY SHOWING, opened for the ones that do not
           fit in a row. Nothing here is only reachable through the sheet — it is a wider view of the
           same state, which is why closing it changes nothing. It goes in `overlay` rather than in
           the thread: a bottom sheet placed among the thread's children resolves its `bottom: 0`
           against a scrolled content box and lands half off the top of the phone. */
        <FilterSheet open={sheet} title="Narrow it" groups={groups} value={facets}
          resultCount={rows.length} unit="instruments"
          onChange={(k, next) => setFacets((s2) => ({ ...s2, [k]: next }))}
          onClearAll={() => setFacets({})}
          onApply={() => setSheet(false)} onClose={() => setSheet(false)} />
      )}>

      <StepStack>
        <StepBlock step={1} title="Asset class" chips={assets} done={assets.length > 0}
          count={assets.length ? atAsset.length : undefined}
          open={open === STEP.ASSET} onToggle={() => toggleStep(STEP.ASSET)}>
          <IntentGrid>
            {ASSETS.map((a) => (
              <IntentTile key={a.label} label={a.label} count={a.count}
                mark={<AssetMark asset={a.label} size={52} />}
                selected={assets.includes(a.label)} onClick={() => chooseAsset(a.label)} />
            ))}
          </IntentGrid>
          {assets.length > 0 && (
            <div style={{ marginTop: 'var(--space-12)' }}>
              <InlineActionRow actions={[{ label: `Show ${familiesForAssets(assets).length} ${familiesForAssets(assets).length === 1 ? 'product' : 'products'}`, tone: 'primary', onClick: () => advance(STEP.PRODUCT) }]} />
            </div>
          )}
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
                mark={<AssetMark asset={f.assets[0]} size={52} />}
                selected={fams.includes(f.key)} onClick={() => chooseFam(f.key)} />
            ))}
          </IntentGrid>
          {fams.length > 0 && (
            <div style={{ marginTop: 'var(--space-12)' }}>
              <InlineActionRow actions={[
                { label: categoriesFor(assets, fams).length ? `Show ${categoriesFor(assets, fams).length} ${categoriesFor(assets, fams).length === 1 ? 'category' : 'categories'}` : `See ${atProduct.length} ${atProduct.length === 1 ? 'instrument' : 'instruments'}`,
                  tone: 'primary', onClick: () => advance(categoriesFor(assets, fams).length ? STEP.CATEGORY : 0) },
              ]} />
            </div>
          )}
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
          {cats.length > 0 && (
            <div style={{ marginTop: 'var(--space-12)' }}>
              <InlineActionRow actions={[{ label: `See ${all.length} ${all.length === 1 ? 'instrument' : 'instruments'}`, tone: 'primary', onClick: () => advance(0) }]} />
            </div>
          )}
        </StepBlock>
        )}
      </StepStack>

      {/* THE TURN SITS WHERE ITS EFFECT IS — under the steps it just changed, not at the foot of the
          thread. A parse note at the bottom of a list separates the cause from the thing it caused,
          and the advisor has to scroll between them to check the sentence did what they meant. */}
      {asked && (
        <div ref={askRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <UserTurn text={asked.text} />
          <ParseNote text={asked.note} />
        </div>
      )}

      {/* THE SCREEN OPENS ON ONE QUESTION AND NOTHING ELSE. The first build showed all eighty
          instruments under an unanswered first step, which undercuts the funnel: if the list is
          already there, the questions are decoration. Everything below appears with the first
          answer. */}
      {(assets.length > 0 || asked) && (
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
        {assets.length === 0 && !asked ? null : rows.length === 0 ? (
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
              <OnePager i={i} onAct={act} onClose={() => setFund(null)} shortlisted={shortlist.includes(i.id)}
                amount={amount} onAmount={setAmount} />
            </FundCard>
            </div>
          );
        })}
        {(assets.length > 0 || asked) && rows.length > 12 && (
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
          <OverlapBlock ids={picked}
          candidates={rows.filter((r) => !picked.includes(r.id))}
          onAdd={() => { const n = rows.find((r) => !picked.includes(r.id)); if (n) setPicked((s2) => s2.concat(n.id).slice(-3)); }}
          onDrop={(id) => setPicked((s2) => s2.filter((x) => x !== id))} />
        )}
      </div>
      {/* WHAT SENTINEL SAYS BACK. The owner's note was that once the cards are shown nothing follows
          them — the screen just stops. A list is an answer, and an answer in this product is followed
          by the thing that reads it and what can be done next. */}
      {said && (
        <SentinelTurn say={said.say} body={said.body
          ? <p style={{ margin: 0, font: 'var(--type-body-font)', color: 'var(--color-ink)' }}>{said.body}</p>
          : undefined} />
      )}
      {!said && assets.length > 0 && rows.length > 0 && !fund && !show && (
        <SentinelTurn say={listNote(rows, cats, fams)}
          body={shortlist.length ? (
            <p style={{ margin: 0, font: 'var(--type-body-font)', color: 'var(--color-ink)' }}>
              {`${shortlist.length} shortlisted so far — ${shortlist.map((id) => cardFor(instrumentById(id)).name).join(', ')}.`}
            </p>
          ) : undefined} />
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

      <Section title="A typed sentence moves the same funnel"
        sub="Not a second way in with its own behaviour — the SAME state, reached differently. Typing “equity mutual funds under 0.5%” and tapping the three tiles land in exactly the same place, because they are the same request. Every phrase it knows is built from the catalogue's own asset names, family labels, sub-type labels and houses, so it cannot learn a word the data does not have.">
        <StateRow>
          <State label="IT SAYS WHAT IT READ" note="The steps above are already changed. The note repeats nothing the screen is showing — it names the READING, which is the part the advisor cannot otherwise check."><Funnel startOpen={0} startAssets={['Equity']} startFamilies={['mutual_fund']} startCats={['mutual_fund:large_cap']} startAsked={{ text: 'large cap funds from canara', note: 'Read as Large Cap Fund · Canara Robeco — 1 left.', ok: true }} /></State>
          <State label="AND WHAT IT DID NOT" tone="under" note="F-61 in this repository is the prototype claiming it had filtered and not doing it. A parser is where that defect is born, so every word it could not place is printed and the funnel is left alone."><Funnel startOpen={0} startQ="something about crypto" startAsked={{ text: 'show me something about crypto', note: 'Nothing here matched the catalogue: something, about, crypto. The funnel is unchanged — try an asset class, a product, a category or a house.', ok: false }} /></State>
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
