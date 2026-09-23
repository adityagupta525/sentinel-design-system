#!/usr/bin/env node
/* THE CATALOGUE — generated from the product-catalogue sample the owner supplied on 23 Sep 2026, so
   the fund explorer reads REAL instruments instead of the eight I invented.

   This is not the same thing as `screens/data/book.jsx` and it does not replace it. The book is the
   ADVISOR'S OWN SHELF: which clients hold what, what the advisor has approved, what a drift is
   measured against. The catalogue is EVERYTHING INVESTABLE. A fund explorer needs both at once —
   the instrument comes from here, "2 of your clients already hold this" comes from the book — so
   they coexist rather than compete, and nothing in journeys A-F changes because of this file.

   WHAT THE SOURCE ACTUALLY CARRIES, measured rather than assumed (see the coverage table this
   script prints). Eight families, ten instruments each. Only mutual_fund and commodity carry a NAV
   history; pms and aif carry holdings and ratios but no series; bonds, fd, reit and unlisted carry
   the instrument and almost nothing else. That unevenness is the single most important fact about
   this data and it is a DESIGN REQUIREMENT, not a defect to paper over: a bond card has no return
   and no sparkline to draw, so the card has to be right without them. Sentinel's own rule already
   covers it — a value the product does not know is not passed at all — so this generator OMITS
   missing fields rather than writing zeros, and carries `pending` so a screen can say what is not
   on file instead of leaving a silent hole.

   NAV IS DOWNSAMPLED TO WEEKLY. 365 daily points x 30 instruments is 11,000 numbers in a file the
   preview pages parse on every load, and no chart in this system is wider than 311pt — at that
   width a daily series draws four points per pixel and reads as noise rather than a curve. Weekly
   keeps the real shape and the real endpoints.

   Run: npm run build:catalogue */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'studio/fund-explorer/data/instrument_samples.json');
const OUT = join(root, 'screens/data/catalogue.jsx');

const src = JSON.parse(readFileSync(SRC, 'utf8'));

/* The four asset classes are not a taxonomy anyone chose for this screen — they are the distinct
   `assetName` values the rows actually carry, which is why the explorer's first question can be
   answered from the data rather than from a guess. */
const ASSET_ORDER = ['Equity', 'Debt', 'Commodity', 'REITs / InvITs'];
const FAMILY_LABEL = {
  mutual_fund: 'Mutual fund', pms: 'PMS', aif: 'AIF', bonds: 'Bonds',
  fd: 'Fixed deposit', reit: 'REITs & InvITs', commodity: 'Commodity', unlisted: 'Unlisted',
};

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const round = (v, p = 2) => (v === undefined ? undefined : Math.round(v * 10 ** p) / 10 ** p);

/* Drop every key whose value is undefined, so the emitted object states only what is known — and
   drop empty containers too. `ratios: {}` on a bond looked like a section with nothing in it rather
   than a section that does not apply, and a screen checking `if (p.ratios)` would have rendered an
   empty heading. An absent key is the honest shape. */
const isEmpty = (v) => v === undefined
  || (Array.isArray(v) && v.length === 0)
  || (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);
const tidy = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => !isEmpty(v)));

/* A weighted breakdown, in the one shape every chart in this system takes: a label and a number.
   Rows with no weightage are dropped — the source carries a few ({"marketCap":"Small Cap"} with no
   figure) and a segment with no value is exactly the untrue thing ChartDonut refuses to draw. */
function weights(rows, nameKey, max = 8) {
  if (!Array.isArray(rows)) return undefined;
  const out = rows
    .map((r) => ({ name: str(r[nameKey]), pct: round(num(r.weightage), 1) }))
    .filter((r) => r.name && r.pct !== undefined && r.pct > 0)
    .slice(0, max);
  return out.length ? out : undefined;
}

/* Weekly, and always keeping the LAST point — the endpoint is the figure the card prints beside the
   chart, and a downsample that drops it would put a number next to a line that never reaches it. */
function weekly(rows, dateKey, valKey) {
  if (!Array.isArray(rows) || rows.length < 2) return undefined;
  const pts = rows
    .map((r) => [str(r[dateKey]), num(r[valKey])])
    .filter(([d, v]) => d && v !== undefined);
  if (pts.length < 2) return undefined;
  const step = Math.max(1, Math.round(pts.length / 52));
  const out = [];
  for (let i = 0; i < pts.length; i += step) out.push(pts[i]);
  if (out[out.length - 1][0] !== pts[pts.length - 1][0]) out.push(pts[pts.length - 1]);
  return out.map(([d, v]) => [d, round(v, 2)]);
}

const instruments = [];
const onePagers = {};
const familyRows = [];
const coverage = [];

for (const [famKey, fam] of Object.entries(src.families)) {
  const tax = src.taxonomy[famKey] || {};
  const assets = new Set();
  let withReturn = 0, withAum = 0, withNav = 0;

  for (const it of fam.instruments) {
    const L = it.listing || {};
    const asset = str(L.assetName);
    if (asset) assets.add(asset);

    const returns = tidy({
      m3: round(num(L.return3m), 2), m6: round(num(L.return6m), 2),
      y1: round(num(L.return1yr), 2), y3: round(num(L.return3yr), 2),
      y5: round(num(L.return5yr), 2), since: round(num(L.returnInception), 2),
    });
    if (returns.y1 !== undefined) withReturn += 1;
    if (num(L.instrumentAum)) withAum += 1;

    instruments.push(tidy({
      id: str(it.bos_code), name: str(it.name) || str(L.instrumentFullName),
      family: famKey, subType: str(it.sub_type), subTypeLabel: str(it.sub_type_label),
      category: str(it.category) || str(L.categoryName),
      asset, code: str(it.product_source_code),
      amc: str(L.amcName), amcLogo: str(L.amcImageUrl) || str(L.logoUrl),
      benchmark: str(L.benchmarkName), instrumentType: str(L.instrumentType),
      manager: str(L.fundManagerName), isin: str(L.isinCode),
      aum: num(L.instrumentAum), ter: round(num(L.expenseRatio), 2),
      exitLoad: str(L.exitLoad), price: round(num(L.latestPrice), 2), priceDate: str(L.latestPriceDate),
      returns: Object.keys(returns).length ? returns : undefined,
    }));

    const O = it.one_pager || {};
    const F = O.fund || {};
    const nav = weekly(O.navHistory, 'd', 'nav');
    if (nav) withNav += 1;
    const page = tidy({
      nav,
      bench: weekly(O.benchmarkHistory, 'd', 'tr') || weekly(O.benchmarkHistory, 'd', 'pr'),
      sector: weights(O.sector, 'sectorName') || weights(O.top5Sector, 'sectorName'),
      marketCap: weights(O.marketCap, 'marketCap'),
      holdings: weights(O.instrument, 'instrumentName') || weights(O.top5Security, 'securityName'),
      issuers: weights(O.issuer, 'issuerName'),
      rating: weights(O.rating, 'ratingName'),
      /* The ratios the source actually has. Beta and alpha were `null` in the invented book and are
         real here, which is what finally makes a risk section honest. */
      ratios: tidy({
        alpha3: round(num(F.alpha3yr), 2), alpha5: round(num(F.alpha5yr), 2),
        beta3: round(num(F.beta3yr), 2), beta5: round(num(F.beta5yr), 2),
        bm1: round(num(F.bmReturn1yr), 2), bm3: round(num(F.bmReturn3yr), 2), bm5: round(num(F.bmReturn5yr), 2),
        cat1: round(num(F.catReturn1yr), 2), cat3: round(num(F.catReturn3yr), 2), cat5: round(num(F.catReturn5yr), 2),
      }),
      about: str(F.description),
      strategy: str(F.deploymentStrategy),
      liquidity: str(F.liquidityMaturity), lockIn: str(F.lockIn),
      coupon: round(num(F.couponRate), 2), yield: round(num(F.bondYield), 2),
      faceValue: num(F.faceValue), maturity: str(F.maturityDate) || str(F.callOptionDate),
      payFrequency: str(F.interestPaymentFrequencyLabel) || str(F.interestPaymentFrequency),
      dividendYield: round(num(F.dividendYield), 2),
      fees: Array.isArray(O.feeStructure) && O.feeStructure.length ? O.feeStructure.map((f) => tidy({
        cls: str(f.class), fixed: round(num(f.fixedFeePa), 2), perf: round(num(f.performanceFee), 2),
        hurdle: round(num(f.hurdleRate), 2), min: num(Number(f.minInvestment)),
      })) : undefined,
      /* What the product does NOT have for this instrument. Carried so a screen can name the gap —
         the alternative is a section that silently is not there, which reads as "nothing to say". */
      pending: Array.isArray(O.dataCompleteness?.pending) && O.dataCompleteness.pending.length
        ? O.dataCompleteness.pending.slice(0, 24) : undefined,
    });
    if (Object.keys(page).length) onePagers[it.bos_code] = page;
  }

  familyRows.push({
    key: famKey, label: FAMILY_LABEL[famKey] || famKey,
    codes: tax.product_codes || fam.product_codes, count: fam.count,
    assets: [...assets].sort(),
    subTypes: (tax.sub_types || []).map((s) => ({ key: s.key, label: s.label, count: s.count })),
  });
  coverage.push({ famKey, n: fam.instruments.length, withReturn, withAum, withNav, assets: [...assets] });
}

/* An asset is offered only where instruments exist under it, and a family is offered under an asset
   only where that family actually has rows carrying it. Both are derived, so the explorer's first
   two questions cannot drift from what the catalogue can answer. */
const assets = ASSET_ORDER
  .map((label) => {
    const fams = familyRows.filter((f) => f.assets.includes(label));
    const count = instruments.filter((i) => i.asset === label).length;
    return { label, families: fams.map((f) => f.key), count };
  })
  .filter((a) => a.count > 0);

const meta = {
  generatedAt: src.meta?.generated_at,
  source: src.meta?.source,
  instruments: instruments.length,
  families: familyRows.length,
  note: 'Sample of 10 per family from the product catalogue. Not the whole shelf, and not priced for '
    + 'transaction — enough to design against real names, real weights and real series.',
};

const j = (v) => JSON.stringify(v, null, 1).replace(/\n/g, '\n');
const out = `/* GENERATED by tools/build-catalogue.mjs — do not edit by hand.
   Source: studio/fund-explorer/data/instrument_samples.json (${meta.generatedAt})
   ${meta.instruments} instruments across ${meta.families} families.

   This is the CATALOGUE — everything investable. It is not \`book.jsx\`, which is the advisor's own
   shelf and clients; the explorer reads both, and journeys A-F are untouched by this file.

   Missing values are OMITTED rather than zeroed, so \`i.returns?.y1 === undefined\` means the product
   does not know it — never that the return was zero. \`pending\` names what the source itself flags as
   not on file. */

const CATALOGUE_META = ${j(meta)};

/* The explorer's first question. Derived from the rows' own \`assetName\`, never hand-written. */
const ASSETS = ${j(assets)};

/* The second question — which products exist under the chosen assets. */
const FAMILIES = ${j(familyRows)};

const INSTRUMENTS = ${j(instruments)};

/* The fund one-pager's payload, by instrument id. Absent means there is no page-level data at all. */
const ONE_PAGERS = ${j(onePagers)};

/* ── Lookups, so no screen re-implements them ─────────────────────────────────────────────────── */
const BY_ID = new Map(INSTRUMENTS.map((i) => [i.id, i]));
function instrumentById(id) { return BY_ID.get(id); }
function onePagerOf(id) { return ONE_PAGERS[id]; }
function familyByKey(k) { return FAMILIES.find((f) => f.key === k); }

/* Families available under a set of chosen assets — the product step is a function of the asset step
   rather than a fixed list, which is the whole point of asking the asset question first. */
function familiesForAssets(assetLabels) {
  if (!assetLabels || !assetLabels.length) return FAMILIES;
  return FAMILIES.filter((f) => f.assets.some((a) => assetLabels.includes(a)));
}

/* Sub-types (the explorer's third question) under the chosen families, each with the count it will
   actually yield — a category that would open an empty list is not offered. */
function categoriesFor(assetLabels, familyKeys) {
  const fams = familiesForAssets(assetLabels).filter((f) => !familyKeys?.length || familyKeys.includes(f.key));
  const out = [];
  for (const f of fams) {
    for (const s of f.subTypes) {
      const n = INSTRUMENTS.filter((i) => i.family === f.key && i.subType === s.key
        && (!assetLabels?.length || assetLabels.includes(i.asset))).length;
      if (n > 0) out.push({ key: \`\${f.key}:\${s.key}\`, label: s.label, family: f.key, subType: s.key, count: n });
    }
  }
  return out;
}

function instrumentsFor({ assets: a, families: f, categories: c } = {}) {
  return INSTRUMENTS.filter((i) => (!a?.length || a.includes(i.asset))
    && (!f?.length || f.includes(i.family))
    && (!c?.length || c.includes(\`\${i.family}:\${i.subType}\`)));
}

/* WHAT A CARD MAY PRINT for this instrument. The explorer asks before it draws, because four of the
   eight families have no return and no series at all and a card that assumes otherwise renders an
   em dash where a figure should be — or worse, a zero. */
function shapeOf(id) {
  const i = BY_ID.get(id), p = ONE_PAGERS[id] || {};
  return {
    hasReturn: i?.returns?.y1 !== undefined || i?.returns?.y3 !== undefined,
    hasSeries: Array.isArray(p.nav) && p.nav.length > 1,
    hasHoldings: !!p.holdings, hasSector: !!p.sector, hasMarketCap: !!p.marketCap,
    hasRatios: !!(p.ratios && Object.keys(p.ratios).length),
    hasFees: !!p.fees, hasAum: i?.aum !== undefined, hasTer: i?.ter !== undefined,
  };
}

/* Published to \`window\`, exactly as book.jsx is: every \`text/babel\` script on a screen page is
   compiled and run on its own, so a top-level binding here is invisible to the screen file. */
Object.assign(typeof window !== 'undefined' ? window : globalThis, {
  CATALOGUE_META, ASSETS, FAMILIES, INSTRUMENTS, ONE_PAGERS,
  instrumentById, onePagerOf, familyByKey, familiesForAssets, categoriesFor, instrumentsFor, shapeOf,
});
`;

writeFileSync(OUT, out, 'utf8');

const kb = (Buffer.byteLength(out) / 1024).toFixed(0);
console.log(`catalogue.jsx: ${instruments.length} instruments, ${familyRows.length} families, ${Object.keys(onePagers).length} one-pagers, ${kb} KB`);
console.log(`\n${'family'.padEnd(13)}${'n'.padStart(3)}${'1Y'.padStart(5)}${'AUM'.padStart(5)}${'NAV'.padStart(5)}  assets`);
for (const c of coverage) {
  console.log(`${c.famKey.padEnd(13)}${String(c.n).padStart(3)}${String(c.withReturn).padStart(5)}${String(c.withAum).padStart(5)}${String(c.withNav).padStart(5)}  ${c.assets.join(', ')}`);
}
console.log(`\nassets: ${assets.map((a) => `${a.label} (${a.count})`).join(' · ')}`);
