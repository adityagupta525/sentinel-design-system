/* SHARED PARTS FOR THE THREE EXPLORER VARIATIONS.

   These are SCREEN functions, not components, and the test is the owner's own (20 Sep): a function that
   reads the book or is journey-specific stays on the screen; one that is neither is a component. Every
   function here reads `book.jsx` — the fund list, the reverse lookup, the category averages — so none
   of them belongs in the design system. What they compose IS the system: `PeerLine`, `ClientChip`,
   `IntentTile`, `Pill`, `Surface`.

   They live in one file rather than three because V1, V2 and V3 are three surfaces over ONE answer.
   If the fund row read differently in each, the comparison the owner asked for would be a comparison of
   three different products rather than three ways into the same one. */

/* The system's components come off the published namespace, the way every other screen reaches them
   (`funds.jsx:14`) — a `text/babel` script has no import. */
const EX_DS = window.SentinelDesignSystem_0682a2;
const {
  ArtifactCard, Badge, ChartBar, ChartDonut, ChartLine, ChartSpark, ChipRow, ClientChip, CompareTable, Composer, ConstraintCallout,
  DarkButton, DataTable, DisclosureBlock, Drawer, Dumbbell, ExplainerSheet, ExplorerSheet, Eyebrow,
  FigureRow, FilterSheet, FollowUpRow, InfoCard, InfoDot, InlineActionRow, IntentGrid, IntentTile, List,
  ListRow, OverlapView, PeerLine, Pill, Pressable, Provenance, RangePills, RejectCallout, ScreenScaffold,
  SearchField, SectionStrip, SegmentedRow, SelectionMark, SentinelBlock, SentinelText, ShortlistCard,
  StandingDisclosure, StatTile, Surface, UserBubble,
  AssetMark, FundCard, MetricList, MetricRow, StepBlock, StepStack, ChartLegend, ChartReadout, ChartShare, PathBar, ParseNote, UserTurn
} = EX_DS;

const holdersOf = (fundId) => CLIENTS.filter((c) =>
  (c.holdings || []).some((h) => h.fundId === fundId) || (c.sips || []).some((sp) => sp.fundId === fundId)).map((c) => c.name);

/* ONE fund row, used by all three variations, carrying the three things the research said a shortlist
   row must carry and the rejected one did not:
     1. the peer line — a fund shown alone is a number, a fund shown beside its category is a judgement;
     2. who already holds it, on the FIRST line and not in column three — the one facet no product in
        the market ships, and the only one Sentinel can compute today;
     3. the unit, next to the number, because "21.4%" without "three-year CAGR" is not defensible. */
function FundRow({ id, period = 'r3', onOpen, trailing, compact = false }) {
  const f = fundById(id);
  const p = perfOf(id);
  const cat = categoryAvgOf(id);
  const held = holdersOf(id);
  const periodWords = period === 'r1' ? '1 year' : period === 'r3' ? '3 years' : '5 years';
  const body = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
        <span style={{ font: 'var(--type-title-font)', color: 'var(--color-ink)' }}>{f.name}</span>
        {p && <span style={{ flexShrink: 0, font: 'var(--type-row-strong-font)', color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>{p.ter.toFixed(2)}%</span>}
      </div>
      {p && cat ? (
        <PeerLine value={p[period]} peer={cat[period]} period={periodWords} peerLabel={`${f.category} average`} />
      ) : (
        <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>No performance on file for this scheme yet.</p>
      )}
      {/* THE REVERSE LOOKUP, ON LINE ONE OF WHAT MATTERS. Nobody in the market ships it; Sentinel can,
          because it already reads the advisor's own book. When nobody holds it, that is also an answer
          and is said rather than left blank. */}
      <p style={{ margin: 0, font: 'var(--type-caption-font)', color: held.length ? 'var(--color-bronze-deep)' : 'var(--color-muted)' }}>
        {held.length ? `Held by ${held.join(' · ')}` : 'None of your clients hold it'}
        {!f.onShelf && ' · off your shelf'}
      </p>
      {!compact && f.shelfNote && (
        <p style={{ margin: 0, font: 'var(--type-caption-font)', color: 'var(--color-muted)' }}>{f.shelfNote}</p>
      )}
    </div>
  );
  const inner = (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-10)', width: '100%' }}>
      {body}
      {trailing}
    </div>
  );
  if (!onOpen) return <Surface padding={12}>{inner}</Surface>;
  return (
    <Pressable onClick={onOpen} label={`Open ${f.name}`}
      style={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: 'var(--radius-16)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-12)', boxSizing: 'border-box' }}>
      {inner}
    </Pressable>
  );
}

/* The provenance line every one of these surfaces carries, written by the book rather than by a screen,
   so no screen can claim a source the data does not have. */
const explorerProvenance = () => `${perfProvenance()} · expense and category averages as of ${PERF_AS_OF}`;

/* THE FILTER VOCABULARY, AS BANDS — the shape the bond explorers proved on a phone, applied to what
   this book actually knows. Counts are COMPUTED from the list, never typed, so an option can never
   promise rows it does not have. */
const bandFns = {
  bucket: (f, v) => f.bucket === v,
  category: (f, v) => f.category === v,
  amc: (f, v) => f.amc === v,
  ter: (f, v) => { const p = perfOf(f.id); return p && p.ter < Number(v); },
  risk: (f, v) => f.riskometer === v,
  shelf: (f, v) => (v === 'on' ? f.onShelf : !f.onShelf),
};
function matches(f, value) {
  return Object.keys(value || {}).every((k) => {
    const v = value[k];
    if (v == null || (Array.isArray(v) && !v.length)) return true;
    const fn = bandFns[k];
    if (!fn) return true;
    return Array.isArray(v) ? v.some((one) => fn(f, one)) : fn(f, v);
  });
}
const applyFilters = (value) => FUNDS.filter((f) => matches(f, value));
/* A count beside an option is what that option would leave WITH the rest of the selection still on —
   not how many rows exist in the book. The second is a bigger number and a lie. */
const countFor = (value, key, optValue) => {
  const next = { ...value, [key]: optValue };
  return FUNDS.filter((f) => matches(f, next)).length;
};
function filterGroups(value) {
  const c = (k, v) => countFor(value, k, v);
  return [
    { key: 'bucket', label: 'Asset', mode: 'multi', options: [
      { value: 'Equity', label: 'Equity', count: c('bucket', ['Equity']) },
      { value: 'Debt', label: 'Debt', count: c('bucket', ['Debt']) },
      { value: 'Hybrid', label: 'Hybrid', count: c('bucket', ['Hybrid']) },
      { value: 'Index', label: 'Index', count: c('bucket', ['Index']) } ] },
    { key: 'ter', label: 'Expense ratio', note: 'Bands an advisor says aloud, not a slider they cannot hit mid-call.',
      options: [
        { value: '0.3', label: 'Under 0.3%', count: c('ter', '0.3') },
        { value: '0.7', label: 'Under 0.7%', count: c('ter', '0.7') },
        { value: '1.0', label: 'Under 1.0%', count: c('ter', '1.0') } ] },
    { key: 'risk', label: 'Riskometer', mode: 'multi', options: [
      { value: 'Moderate', label: 'Moderate', count: c('risk', ['Moderate']) },
      { value: 'High', label: 'High', count: c('risk', ['High']) },
      { value: 'Very high', label: 'Very high', count: c('risk', ['Very high']) } ] },
    { key: 'shelf', label: 'Your shelf', options: [
      { value: 'on', label: 'On your shelf', count: c('shelf', 'on') },
      { value: 'off', label: 'Off the shelf', count: c('shelf', 'off') } ] },
  ];
}
/* What the advisor reads aloud. Derived from the same `value` the list is derived from — one truth. */
function filterLabels(value) {
  const out = [];
  filterGroups(value).forEach((g) => {
    const v = value[g.key];
    const vals = Array.isArray(v) ? v : (v == null ? [] : [v]);
    vals.forEach((one) => { const o = g.options.find((x) => x.value === one); if (o) out.push(o.label); });
  });
  return out;
}

/* THE ASSET CLASSES CENTRICITY SELLS, and the honest state of each. Four of the five have no rows in
   the book at all, and the tile says which feed is missing rather than showing a zero — the whole
   reason `IntentTile` has an `unavailable` state. */
const ASSET_TILES = [
  { key: 'mf', label: 'Mutual funds', count: FUNDS.length, note: 'Direct plans, on and off your shelf' },
  { key: 'bonds', label: 'Bonds', unavailable: true, unavailableNote: 'No feed yet — rating, yield and tenure are not on file.' },
  { key: 'pms', label: 'PMS', unavailable: true, unavailableNote: 'No feed yet — strategy, manager and benchmark are not on file.' },
  { key: 'aif', label: 'AIF', unavailable: true, unavailableNote: 'No feed yet — category, lock-in and PPM terms are not on file.' },
];

/* Published to `window` because each `text/babel` script is compiled and run on its own, so a top-level
   binding here is not visible to the variation files. Journey C does the same at the foot of funds.jsx. */
Object.assign(window, {
  EX_DS,
  ArtifactCard, Badge, ChartBar, ChartDonut, ChartLine, ChartSpark, ChipRow, ClientChip, CompareTable, Composer, ConstraintCallout,
  DarkButton, DataTable, DisclosureBlock, Drawer, Dumbbell, ExplainerSheet, ExplorerSheet, Eyebrow,
  FigureRow, FilterSheet, FollowUpRow, InfoCard, InfoDot, InlineActionRow, IntentGrid, IntentTile, List,
  ListRow, OverlapView, PeerLine, Pill, Pressable, Provenance, RangePills, RejectCallout, ScreenScaffold,
  SearchField, SectionStrip, SegmentedRow, SelectionMark, SentinelBlock, SentinelText, ShortlistCard,
  StandingDisclosure, StatTile, Surface, UserBubble,
  AssetMark, FundCard, MetricList, MetricRow, StepBlock, StepStack, ChartLegend, ChartReadout, ChartShare, PathBar, ParseNote, UserTurn,
  holdersOf, FundRow, explorerProvenance, applyFilters, countFor, filterGroups, filterLabels, matches, ASSET_TILES,
});
