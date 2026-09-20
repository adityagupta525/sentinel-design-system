/* THE ADVISOR'S BOOK — one dummy data set for every screen in this repository.

   Why it exists: until now each screen carried its own figures, and the same client could hold 43 funds
   on one page and 31 on another. This is the single source: every number already rendered on a built
   screen is either IN here or DERIVABLE from what is in here, and the derivations are written down.

   WHAT IS REAL AND WHAT IS ILLUSTRATIVE — the line matters more than the data:
     · REAL (structural, checked against the market on 19 Sep 2026): SEBI's scheme categories and the
       large/mid/small definitions (1st–100th, 101st–250th, 251st onward by full market capitalisation,
       SEBI/HO/IMD/DF3/CIR/P/2017/114; flexi cap added Nov 2020); one scheme per category per AMC;
       equity taxation — STCG 20% under twelve months, LTCG 12.5% on aggregate gains above ₹1.25 L a
       financial year, no indexation; the shape of a KYC record, a NACH mandate, an ARN/EUIN, a folio,
       a riskometer band and an exit load.
     · ILLUSTRATIVE: every rupee figure, every holding, every date. They are internally consistent and
       they are not anybody's real money.
     · UNKNOWN, AND LEFT UNKNOWN: fund performance, TER and AUM have no confirmed source in this
       project, so this file carries none. A screen that needs them renders locked and says why
       (InfoCard `locked`, RangePills `locked`, OverlapView's null cell). Adding them here later fills
       those cards in without redesigning anything.

   No top-level destructuring: every .jsx a page loads compiles into ONE scope. */

/* The advisor, and the two numbers every execution runs under. An ARN is the distributor's registration
   and an EUIN identifies the individual who advised the transaction — both appear on the confirm sheet's
   "runs under your ARN" line, which is the one place the product states whose authority is being used. */
const ADVISOR = {
  name: 'Ashish',
  firm: 'Centricity WealthTech',
  arn: "ARN-[PLACEHOLDER — the firm’s own registration]",
  euin: 'E[PLACEHOLDER]',
  clients: 512,            // the book's real size; the drawer shows eight and says "See all"
  asOf: '30 Sep 2026',
};

/* THE SHELF — the funds this firm will transact in, with the facts a compliance shelf actually holds.
   `category` is SEBI's, not a marketing name. `plan: 'direct'` matters because a regular plan pays the
   distributor and a direct one does not, and an advisor has to be able to say which they put a client in.
   No performance, TER or AUM: see the header. */
const FUNDS = [
  { id: 'ppfas-flexi',  name: 'Parag Parikh Flexi Cap', amc: 'PPFAS',  category: 'Flexi cap',          bucket: 'Equity', plan: 'direct', riskometer: 'Very high', exitLoad: '2% within 365 days',        onShelf: true },
  { id: 'hdfc-flexi',   name: 'HDFC Flexi Cap',         amc: 'HDFC',   category: 'Flexi cap',          bucket: 'Equity', plan: 'direct', riskometer: 'Very high', exitLoad: '1% within 365 days',        onShelf: true },
  { id: 'quant-small',  name: 'Quant Small Cap',        amc: 'Quant',  category: 'Small cap',          bucket: 'Equity', plan: 'direct', riskometer: 'Very high', exitLoad: '1% within 365 days',        onShelf: false, shelfNote: 'Off the shelf since Jun 2026 — concentration in the scheme, not a view on the house' },
  { id: 'icici-corp',   name: 'ICICI Corporate Bond',   amc: 'ICICI',  category: 'Corporate bond',     bucket: 'Debt',   plan: 'direct', riskometer: 'Moderate',  exitLoad: 'Nil',                        onShelf: true },
  { id: 'sbi-corp',     name: 'SBI Corporate Bond',     amc: 'SBI',    category: 'Corporate bond',     bucket: 'Debt',   plan: 'direct', riskometer: 'Moderate',  exitLoad: 'Nil',                        onShelf: true },
  { id: 'icici-baf',    name: 'ICICI Balanced Advantage', amc: 'ICICI', category: 'Balanced advantage', bucket: 'Hybrid', plan: 'direct', riskometer: 'High',     exitLoad: '1% above 10% units in 12m',  onShelf: true },
  { id: 'uti-nifty',    name: 'UTI Nifty 50 Index',     amc: 'UTI',    category: 'Index',              bucket: 'Index',  plan: 'direct', riskometer: 'Very high', exitLoad: 'Nil',                        onShelf: true },
  { id: 'hdfc-large',   name: 'HDFC Large Cap',         amc: 'HDFC',   category: 'Large cap',          bucket: 'Equity', plan: 'direct', riskometer: 'Very high', exitLoad: '1% within 365 days',        onShelf: true },
  { id: 'motilal-mid',  name: 'Motilal Oswal Midcap',   amc: 'Motilal Oswal', category: 'Mid cap',     bucket: 'Equity', plan: 'direct', riskometer: 'Very high', exitLoad: '1% within 365 days',        onShelf: true },
  { id: 'hdfc-stdebt',  name: 'HDFC Short Term Debt',   amc: 'HDFC',   category: 'Short duration',     bucket: 'Debt',   plan: 'direct', riskometer: 'Moderate',  exitLoad: 'Nil',                        onShelf: true },
];
const fundById = (id) => FUNDS.find((f) => f.id === id);

/* ─────────────────────────────────────────────────────────────────────────────────────────────────
   PERFORMANCE, TER AND AUM — A DESIGN FIXTURE, AND THE BOOK SAYS SO.

   Journeys C and F have been shipping `InfoCard locked` and an em-dash where a return should be,
   because this repository had no confirmed source for any of it. The owner has now asked for the data
   so the screens can be finished. It is INVENTED, and that fact lives here rather than in a footnote
   nobody reads:

     · The RETURNS are made up. They are not any real scheme's record and must not be read as one.
     · The TERs and AUMs are plausible rather than invented at random — direct-plan equity TERs sit
       roughly 0.3–1.2%, debt 0.2–0.6%, index 0.1–0.3%, and a large AMC's flagship runs to tens of
       thousands of crore. Those bands are public and general; the exact figures here are still ours.
     · `fixture: true` is on every row. A screen may use these numbers; it may NOT print a provenance
       line claiming they came from a scheme record. `perfProvenance()` below writes the only line this
       data is allowed to carry, and it says what it is.

   INTERNAL CONSISTENCY IS THE POINT, because that is what a design has to survive. Small cap beats
   flexi beats large over three years and swings hardest over one; debt is flat and boring; the index
   fund's TER is the lowest on the shelf and its return tracks the large-cap band. A designer who sorts
   this table must get an order that looks like a real one. */
const PERF_AS_OF = '30 Sep 2026';
const PERF = {
  'ppfas-flexi':  { nav: 82.14,  ter: 0.63, aumCr: 89400, r1: 18.2, r3: 21.4, r5: 23.1, benchmark: 'Nifty 500 TRI', fixture: true },
  'hdfc-flexi':   { nav: 1842.60, ter: 0.74, aumCr: 71230, r1: 16.9, r3: 22.8, r5: 21.6, benchmark: 'Nifty 500 TRI', fixture: true },
  'quant-small':  { nav: 271.38, ter: 0.71, aumCr: 26840, r1: 9.4,  r3: 27.6, r5: 34.2, benchmark: 'Nifty Smallcap 250 TRI', fixture: true },
  'icici-corp':   { nav: 29.86,  ter: 0.34, aumCr: 31570, r1: 7.8,  r3: 6.9,  r5: 7.2,  benchmark: 'CRISIL Corporate Bond A-II', fixture: true },
  'sbi-corp':     { nav: 15.42,  ter: 0.31, aumCr: 24110, r1: 7.6,  r3: 6.7,  r5: 7.0,  benchmark: 'CRISIL Corporate Bond A-II', fixture: true },
  'icici-baf':    { nav: 74.93,  ter: 0.86, aumCr: 62480, r1: 12.1, r3: 13.8, r5: 13.2, benchmark: 'CRISIL Hybrid 50+50', fixture: true },
  'uti-nifty':    { nav: 168.27, ter: 0.17, aumCr: 22960, r1: 13.7, r3: 15.9, r5: 16.4, benchmark: 'Nifty 50 TRI', fixture: true },
  'hdfc-large':   { nav: 1094.55, ter: 0.98, aumCr: 38720, r1: 14.3, r3: 16.2, r5: 16.8, benchmark: 'Nifty 100 TRI', fixture: true },
  'motilal-mid':  { nav: 108.71, ter: 0.66, aumCr: 29340, r1: 21.8, r3: 29.1, r5: 28.4, benchmark: 'Nifty Midcap 150 TRI', fixture: true },
  'hdfc-stdebt':  { nav: 31.05,  ter: 0.29, aumCr: 15680, r1: 7.4,  r3: 6.5,  r5: 6.8,  benchmark: 'CRISIL Short Duration A-II', fixture: true },
};
/* ─────────────────────────────────────────────────────────────────────────────────────────────────
   THE NAV SERIES — the curve the whole fund page rests on, and a FIXTURE like PERF above.

   Sixty monthly points, five years, and every one of them is **what ₹10,000 invested at the start
   would be worth on that date**. Not a NAV, not an index level — the figure an advisor reads to a
   client. `f` is the fund, `b` is its own benchmark.

   THE ENDPOINT IS FORCED TO THE STATED CAGR. A seeded random walk gives the shape, and then a
   geometric correction is distributed across every point so the last one lands exactly on PERF's
   five-year figure. Checked at generation: all ten agree to two decimals. A chart that disagrees with
   the number printed beside it is the defect this whole product exists to avoid.

   Volatility is by category, not by taste: small cap swings hardest, mid cap next, flexi/large/index
   together, hybrid less, debt almost not at all. And UTI Nifty 50 Index ends at ₹21,368 against its
   benchmark's ₹21,552 — an index fund TRAILING its index by about its expense ratio, which is the one
   relationship a reader would notice if we got it wrong.

   Invented, deterministic, and only ever shown through `perfProvenance()`. */
const NAV_MONTHS = 60;
const NAV_BASE = 10000;
const NAV_SERIES = {
  'ppfas-flexi': { f: [10000,10332,10967,10926,11405,11904,11244,11334,11372,12158,12624,12393,12562,12974,13311,14216,13827,13865,13940,13787,14715,14217,15009,14934,14753,14902,15441,16277,17224,16587,17054,16596,16453,17588,18946,18772,20439,19950,21148,22599,22115,23104,23097,22631,23933,23782,25531,25232,25664,25409,27346,28963,28708,28065,26939,27621,27710,28792,28753,28622,28268],
    b: [10000,10105,10215,10002,10052,10002,10239,10309,10678,10409,10350,10546,10927,11287,11372,11694,11841,12341,12263,11973,11741,11832,12304,12850,13497,14261,13719,14694,15315,14976,14905,14944,15122,15808,14888,14098,14232,13903,14098,15055,15520,15430,15436,15449,15228,15282,15341,15022,15240,16349,17255,17506,18611,18835,19316,20003,21153,21638,21180,20902,21738] },
  'hdfc-flexi': { f: [10000,9954,10238,10882,10053,9790,9961,10896,10944,10512,10295,10370,9918,9652,9166,9430,9060,9177,9499,9807,10050,10808,10894,10298,11198,10608,10977,10685,11016,11331,11949,12502,12981,13834,14020,13715,14540,14596,14084,15049,16171,17685,17336,18542,19651,19729,21126,21659,23977,25687,25291,25328,27486,26643,25484,25939,26053,25806,27185,27061,26587],
    b: [10000,9590,9399,9176,8810,9437,9412,10212,9983,9416,9378,9262,9681,10013,10119,10038,9996,9793,9686,9795,9931,9895,10436,10905,10921,11167,11299,11727,11166,11421,11553,11696,11902,12754,13437,13124,13624,14439,14590,14244,14175,14708,14902,14793,15189,14759,14909,14851,14850,15765,16004,15555,16067,17158,18180,18475,19787,20741,20500,19832,21738] },
  'quant-small': { f: [10000,10701,10563,10938,11969,12795,12703,12391,12627,13679,14396,15448,17310,16691,17159,18463,20973,19248,18485,18033,20482,23131,23854,27694,23188,26091,28448,30902,29619,30842,30897,29154,32743,33108,35378,39472,37874,35053,38374,37964,35811,38651,41646,42085,39189,41960,39287,38954,39248,38611,44102,42673,41508,42475,41272,42872,46728,43806,47599,45410,43527],
    b: [10000,10179,10706,10239,10218,9405,9685,10658,11204,11388,11541,12766,12924,14052,15559,15148,14354,13921,13084,12411,11874,12895,13448,14452,16175,14821,16466,16043,14463,15220,16034,16891,17108,17580,17904,19147,20843,21280,20332,20428,21708,22868,21420,22079,22693,22469,21651,23828,23321,22924,22848,23795,24981,24634,25247,27268,27350,30496,28963,31051,29435] },
  'icici-corp': { f: [10000,10008,10119,10179,10183,10384,10388,10453,10495,10590,10720,10705,10663,10763,10766,10878,10995,11119,11211,11243,11188,11215,11374,11462,11545,11667,11704,11760,11779,11797,11916,11941,12028,12170,12160,12235,12211,12171,12332,12407,12568,12641,12802,12920,12919,12958,13027,13150,13182,13291,13456,13623,13736,13780,13889,13906,13959,13974,14008,14153,14157],
    b: [10000,9974,9949,10026,10158,10150,10212,10280,10336,10405,10443,10535,10619,10681,10713,10792,10904,10955,11053,11131,11209,11292,11300,11298,11311,11305,11264,11290,11424,11555,11619,11649,11746,11741,11845,11881,11952,12059,12091,12162,12298,12374,12427,12479,12512,12654,12780,12867,13018,13093,13151,13176,13128,13146,13286,13317,13358,13409,13536,13702,13765] },
  'sbi-corp': { f: [10000,10123,10127,10169,10175,10179,10156,10111,10205,10246,10162,10258,10295,10368,10489,10612,10678,10793,10789,10898,10834,10936,10920,10968,11059,11071,11238,11197,11278,11413,11531,11548,11721,11705,11858,11927,11925,12097,12003,11972,11974,12139,12251,12346,12402,12623,12723,12806,12889,12912,12882,12979,13022,13197,13341,13422,13513,13533,13647,13851,14026],
    b: [10000,10016,9995,10156,10189,10181,10282,10260,10364,10434,10504,10572,10519,10592,10513,10655,10700,10728,10766,10803,10824,10918,10997,11037,11111,11206,11208,11350,11363,11461,11582,11627,11707,11745,11854,11955,12033,12119,12193,12198,12294,12309,12277,12309,12401,12571,12666,12724,12803,12942,12961,12980,13084,13260,13318,13482,13583,13704,13619,13695,13765] },
  'icici-baf': { f: [10000,9583,10102,9802,9349,9722,10261,10572,10846,10418,10430,10357,10065,10644,11056,11461,11764,11730,11934,11615,12507,12833,12993,13245,13125,12860,12459,12510,13307,13221,13401,12863,12987,12884,12772,12851,12626,12676,12802,13011,13234,13019,13076,13083,13688,14567,14378,14371,14688,15398,16079,15989,15930,16699,17302,17117,16954,17144,16855,17702,18588],
    b: [10000,10539,10450,10434,10268,10326,10104,10031,10138,10211,10578,11030,11326,11306,11395,11946,11877,12214,12163,12061,12221,12140,12049,11987,11558,11629,11567,11274,11503,11383,11748,12081,12173,12711,13246,13165,13710,13797,13985,14231,14870,14475,14523,14556,14958,15432,15868,16289,15996,16331,15822,15864,16369,16202,16100,16565,16609,17266,17860,17941,17940] },
  'uti-nifty': { f: [10000,9926,10078,10487,10868,11202,10249,10821,10213,9610,9689,9802,9703,10143,10017,9694,10288,10617,10663,11029,11385,11262,11650,12240,12342,12675,12019,11504,11249,11131,11883,12361,12953,12621,11760,11888,11748,11061,11559,12276,13009,12147,12286,12662,12735,12505,12808,13298,14271,15013,15084,15286,15611,16794,18527,18465,19941,20227,20800,20462,21368],
    b: [10000,10310,10287,10304,10743,11038,10564,10634,10737,11093,11006,11095,10674,10878,11190,11157,11494,12125,11278,11607,11631,11977,11643,11107,11346,11370,11800,11598,11725,12166,12754,12867,13751,13823,14006,14631,14333,14727,15427,15604,16617,16560,17377,18104,19489,19346,18984,19713,19124,20947,20819,20672,20039,19897,19854,18661,19609,19506,20337,20358,21552] },
  'hdfc-large': { f: [10000,10522,10181,10000,10031,10271,10525,9666,9704,10148,10476,11141,11421,11318,11217,11327,11920,12804,12763,12944,13497,13757,13885,13005,13018,13183,13438,12820,13597,13228,14404,15660,15115,15098,14779,14678,14493,16000,16882,16523,16033,16734,17244,16670,17851,19235,19530,19590,20801,20603,21190,20857,22674,23259,22573,23349,23372,22465,22357,22377,21738],
    b: [10000,10184,10801,11159,11699,12432,11993,12683,12817,12696,13201,13124,12787,13179,12959,13240,12513,12234,11856,11761,11565,12104,12171,12317,13145,12737,12776,12848,12909,12260,12270,12535,12438,12992,13859,13155,13753,13949,13585,13910,14218,14026,14922,15615,16360,17222,16543,17611,18870,19820,19417,19412,19084,18923,18868,19893,20921,21354,20897,21173,20289] },
  'motilal-mid': { f: [10000,10322,10536,9514,9253,9236,9321,9308,9950,10441,10805,10860,10852,11594,12224,12650,12722,13209,13567,14668,15151,15732,15098,15498,14670,15551,16485,16909,16549,17065,17821,17067,18416,20822,20507,21220,21322,21285,20375,20617,22276,21161,22757,25138,25265,29179,30330,32461,33798,32620,33466,36909,40539,36908,36532,36420,35052,36187,32268,32813,34900],
    b: [10000,9774,10137,10529,11010,10554,11143,11649,11468,10940,11458,11961,11920,11444,11739,12339,12643,12395,13157,13581,13746,14060,13109,12938,12322,12542,11551,12050,12651,12619,13390,13030,12852,13184,14331,15169,16386,15581,17499,20019,21991,21431,20855,21740,23561,23853,25598,24372,25269,23622,27171,26950,27111,26096,25148,26910,28145,29267,28792,27689,30886] },
  'hdfc-stdebt': { f: [10000,10104,10252,10252,10309,10356,10388,10560,10518,10549,10661,10688,10754,10732,10744,10901,10895,10942,11155,11219,11281,11329,11436,11529,11601,11498,11498,11479,11445,11393,11506,11594,11703,11741,11748,11834,11945,12067,12107,12106,12149,12256,12397,12676,12700,12830,12916,12867,12856,12937,12883,12909,13112,13046,13163,13203,13432,13511,13480,13765,13895],
    b: [10000,9960,9996,10036,10000,10025,10172,10182,10171,10258,10355,10489,10657,10651,10757,10726,10759,10812,10873,10829,10773,10781,10843,10926,10931,10953,10952,11062,11132,11109,11197,11281,11372,11396,11517,11713,11819,11911,11881,11951,11958,11933,11971,12157,12386,12444,12489,12512,12646,12793,12775,12716,12823,12906,13014,13052,13142,13236,13328,13515,13573] },
};
/* ONE INDEX, ONE LINE (20 Sep 2026, found by measuring). Parag Parikh and HDFC Flexi Cap both quote
   **Nifty 500 TRI**, and the table above gave them two different benchmark paths — same endpoint, so
   the five-year headline agreed, but every month in between disagreed. It never showed, because until
   now only the endpoint was ever read. The moment the "against its category" turn asked the benchmark
   for a one-year figure it printed 42.6% for one fund and 46.4% for the other, off the same index.

   Two funds cannot see different histories of the same index. The first fund in FUNDS that names a
   benchmark owns its series and every other fund quoting that name reads the same array — derived,
   not hand-listed, so a fund arriving tomorrow joins the right line by naming it. Both shared groups
   already had equal endpoints (21738 for Nifty 500 TRI, 13765 for CRISIL Corporate Bond A-II), so no
   headline moved; the warning fires if that ever stops being true. */
const BENCH_CANON = {};
FUNDS.forEach((f) => {
  const name = (PERF[f.id] || {}).benchmark; const own = NAV_SERIES[f.id];
  if (!name || !own) return;
  if (!BENCH_CANON[name]) { BENCH_CANON[name] = f.id; return; }
  const src = NAV_SERIES[BENCH_CANON[name]];
  if (src.b[NAV_MONTHS] !== own.b[NAV_MONTHS] && typeof console !== 'undefined') {
    console.warn(`book: ${f.id} and ${BENCH_CANON[name]} both quote ${name} but end at different values — the headline will move`);
  }
  own.b = src.b;
});

/* Points for ChartLine: x is the month index, y is the rupee value. */
const navSeries = (id) => {
  const s = NAV_SERIES[id];
  if (!s) return null;
  return {
    fund: s.f.map((y, x) => ({ x, y })),
    bench: s.b.map((y, x) => ({ x, y })),
  };
};
/* THE HEADLINE. The best idea in the whole reference set: not "23.1% CAGR" but "₹10,000 would be
   ₹28,268". A percentage has to be translated before an advisor can say it to a client; a rupee figure
   does not. The benchmark is quoted beside it, because a number with nothing to sit against is a claim. */
const tenKAfter = (id) => {
  const s = NAV_SERIES[id]; const p = PERF[id];
  if (!s || !p) return null;
  return { fund: s.f[NAV_MONTHS], bench: s.b[NAV_MONTHS], base: NAV_BASE, years: 5,
           cagr: p.r5, benchmark: p.benchmark };
};

/* THE BENCHMARK'S OWN CAGR, derived rather than stored — the series already holds both endpoints, so
   writing the benchmark's return down separately would give it a second place to drift from the line
   the chart draws. One decimal, because that is the product's rule for a rate. */
const benchCagr = (id) => {
  const t = tenKAfter(id);
  return t ? +(((Math.pow(t.bench / t.base, 1 / t.years) - 1) * 100).toFixed(1)) : null;
};
/* AND AT ONE AND THREE YEARS — as a table, not from the series, and the difference was found by
   measuring (20 Sep 2026). The "against its category" turn puts three marks on one scale — category
   average · this fund · its benchmark — at a period the advisor chooses, so the benchmark needs a
   figure at each one. The obvious move was to read the same series over a shorter window. It returned
   **42.6% for Nifty 500 TRI over one year**, because the series' intermediate path was never
   constrained: only its endpoint was ever read, so only its endpoint is trustworthy.

   So the benchmark's shorter periods are a fixture, one row per index, exactly the shape CATEGORY_AVG
   already has. FIVE YEARS IS STILL DERIVED from the series, so the number under the chart and the line
   in it cannot disagree — the one figure that has a second source keeps the source it always had. */
const BENCH_SHORT = {
  'Nifty 500 TRI':              { r1: 13.1, r3: 15.4 },
  'Nifty 50 TRI':               { r1: 12.9, r3: 14.8 },
  'Nifty 100 TRI':              { r1: 12.2, r3: 14.1 },
  'Nifty Midcap 150 TRI':       { r1: 16.4, r3: 27.2 },
  'Nifty Smallcap 250 TRI':     { r1: 4.2,  r3: 22.5 },
  'CRISIL Hybrid 50+50':        { r1: 9.8,  r3: 11.3 },
  'CRISIL Corporate Bond A-II': { r1: 6.9,  r3: 6.4 },
  'CRISIL Short Duration A-II': { r1: 6.8,  r3: 6.1 },
};
const benchReturnAt = (id, key = 'r5') => {
  if (key === 'r5') return benchCagr(id);
  const name = (PERF[id] || {}).benchmark; const row = name ? BENCH_SHORT[name] : null;
  return row && row[key] != null ? row[key] : null;
};
const benchProvenance = (key) => (key === 'r5'
  ? 'benchmark · derived from the same five-year series the chart draws'
  : 'benchmark · illustrative index figures for design, not an index record');

const perfOf = (id) => PERF[id] || null;
/* THE ONLY PROVENANCE LINE THIS DATA MAY CARRY. A screen that prints anything else about where these
   numbers came from is lying, and the lie would be in the one place this product promises never to. */
/* WHO HAS RUN IT, AND FOR HOW LONG — a FIXTURE, on the same terms as PERF above (20 Sep 2026).

   The manager is the sharpest sentence a comparison can make: "HDFC beat its benchmark by more, but it
   changed managers in 2024, so its three-year record is not one person's work." The v2 spec names it
   as a compare row and `InfoCard kind='manager'` was built for it and has been on no screen since v12,
   because nothing in this repository knew who runs a fund.

   The NAMES here are invented. They are not the real managers of these schemes and must not be read as
   one; `fixture: true` is on every row and `managerProvenance()` writes the only line this data may
   carry. `fundYears` is how long the SCHEME has run, which is what makes the tenure share mean
   something — three years under a manager who arrived last year is not that manager's record. */
const MANAGERS = {
  'ppfas-flexi':  { name: 'R. Thakkar',   since: 'May 2013', years: 13.4, fundYears: 13.4, fixture: true },
  'hdfc-flexi':   { name: 'S. Iyer',      since: 'Jul 2024', years: 2.2,  fundYears: 31.0, fixture: true },
  'quant-small':  { name: 'A. Mohanty',   since: 'Nov 2020', years: 5.9,  fundYears: 29.0, fixture: true },
  'icici-corp':   { name: 'R. Lakhotia',  since: 'Jan 2019', years: 7.7,  fundYears: 16.0, fixture: true },
  'sbi-corp':     { name: 'P. Deshmukh',  since: 'Feb 2022', years: 4.6,  fundYears: 12.0, fixture: true },
  'icici-baf':    { name: 'S. Naren',     since: 'Dec 2015', years: 10.8, fundYears: 19.0, fixture: true },
  'uti-nifty':    { name: 'Index, not a manager', since: null, years: null, fundYears: 26.0, fixture: true },
  'hdfc-large':   { name: 'M. Bhandari',  since: 'Mar 2024', years: 2.5,  fundYears: 30.0, fixture: true },
  'motilal-mid':  { name: 'N. Agrawal',   since: 'Feb 2018', years: 8.6,  fundYears: 12.0, fixture: true },
  'hdfc-stdebt':  { name: 'A. Pathak',    since: 'Jun 2017', years: 9.3,  fundYears: 15.0, fixture: true },
};
const managerOf = (id) => MANAGERS[id] || null;
/* "R. Thakkar · 13.4 yr", or the honest answer for a fund that has no manager to name. */
const managerLine = (id) => {
  const m = MANAGERS[id];
  if (!m) return null;
  return m.years == null ? m.name : `${m.name} · ${m.years} yr`;
};
const managerProvenance = () => `manager tenure is illustrative for design, not a scheme record · as of ${PERF_AS_OF}`;
/* ONE LINE FOR A CARD THAT CARRIES BOTH FIXTURES. Concatenating perfProvenance() and
   managerProvenance() printed "illustrative for design, not a scheme record · as of 30 Sep 2026"
   TWICE on the comparison, which reads as a stutter and makes the disclosure easier to skip rather
   than harder. Named here, beside the data, because the rule this file states is that these numbers
   may only be shown through a line this file writes. */
const comparisonProvenance = () => `returns, cost, size and manager tenure · illustrative figures for design, not a scheme record · as of ${PERF_AS_OF}`;

/* ─────────────────────────────────────────────────────────────────────────────────────────────────
   HOLDINGS, MONTHLY CHANGES, CATEGORY AVERAGES, SWITCH COST — the four feeds the explorer lacked, as
   FIXTURES on PERF's terms (20 Sep 2026, docs/FUND-EXPLORER-V2-PLAN.md §1).

   Generated at load, deterministically, from a seed per fund — the same way NAV_SERIES got its shape —
   so the numbers are stable across renders and nobody hand-typed three hundred weights. The COMPANY
   NAMES are real listed companies chosen to fit each fund's category (an index fund holds the Nifty's
   largest; a corporate-bond fund holds AAA issuers). THE WEIGHTS ARE OURS. `fixture: true` on every row,
   and `holdingsProvenance()` writes the only line a card may carry about where they came from.

   Internal consistency is the point: top-ten weights descend; an index fund is more concentrated at the
   top than a flexi cap; a small cap is flatter; the three months of sector weights drift by fractions,
   never jump; concentration figures are COMPUTED from the same list the table shows, so the two cannot
   disagree; and overlap between two funds is computed from the names they actually share. */
const seeded = (key) => { let h = 2166136261; for (const ch of key) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; };
const HOLDINGS_AS_OF = 'Jun 2026';
const HOLD_MONTHS = ['Jun 2026', 'May 2026', 'Apr 2026'];
/* What each category holds, by name and sector. Real companies; invented weights. */
const NAMES = {
  /* Fourteen names for the diversified equity funds and each fund draws TEN of them in its own seeded
     order — so two flexi caps share some of their top ten and not all of it. Measured before this:
     every 'large' fund read the same list top-down and ppfas↔hdfc-flexi overlapped 98%, which no two
     real flexi caps do. The index fund is the exception: its top ten IS the index's, in index order. */
  large:  [['HDFC Bank','Financial services'],['ICICI Bank','Financial services'],['Infosys','IT'],['Reliance Industries','Energy'],['Bharti Airtel','Telecom'],['ITC','Consumer'],['Larsen & Toubro','Industrials'],['TCS','IT'],['Axis Bank','Financial services'],['Coal India','Energy'],['Power Grid','Utilities'],['Maruti Suzuki','Consumer'],['Sun Pharma','Healthcare'],['Bajaj Finance','Financial services']],
  index:  [['HDFC Bank','Financial services'],['Reliance Industries','Energy'],['ICICI Bank','Financial services'],['Infosys','IT'],['Bharti Airtel','Telecom'],['Larsen & Toubro','Industrials'],['ITC','Consumer'],['TCS','IT'],['Axis Bank','Financial services'],['State Bank of India','Financial services']],
  mid:    [['Coforge','IT'],['Persistent Systems','IT'],['Polycab India','Industrials'],['Trent','Consumer'],['Dixon Technologies','Industrials'],['Max Healthcare','Healthcare'],['Bharat Electronics','Industrials'],['Indian Hotels','Consumer'],['Voltas','Consumer'],['Kalyan Jewellers','Consumer']],
  small:  [['RBL Bank','Financial services'],['Aegis Logistics','Energy'],['Bikaji Foods','Consumer'],['Jyothy Labs','Consumer'],['KEI Industries','Industrials'],['Cyient DLM','Industrials'],['Godrej Agrovet','Consumer'],['Welspun Living','Consumer'],['Sun Pharma Advanced','Healthcare'],['CESC','Utilities']],
  hybrid: [['HDFC Bank','Financial services'],['ICICI Bank','Financial services'],['Govt of India G-Sec 2033','Sovereign'],['Infosys','IT'],['Reliance Industries','Energy'],['Govt of India G-Sec 2030','Sovereign'],['Bharti Airtel','Telecom'],['NABARD 2028 bond','PSU finance'],['ITC','Consumer'],['Larsen & Toubro','Industrials']],
  debt:   [['HDFC Bank NCD 2028','Housing finance'],['REC 2029 bond','PSU finance'],['PFC 2028 bond','PSU finance'],['NABARD 2027 bond','PSU finance'],['Bajaj Finance NCD 2028','NBFC'],['LIC Housing Finance 2029','Housing finance'],['SIDBI 2027 bond','PSU finance'],['NHAI 2030 bond','Infrastructure'],['IRFC 2029 bond','PSU finance'],['Govt of India G-Sec 2029','Sovereign']],
};
const CAT_KEY = { 'Flexi cap': 'large', 'Large cap': 'large', 'Index': 'index', 'Mid cap': 'mid', 'Small cap': 'small', 'Balanced advantage': 'hybrid', 'Corporate bond': 'debt', 'Short duration': 'debt' };
/* Top-ten shape by category: first weight and the slope down. Index funds are top-heavy; small caps flat. */
const SHAPE = { large: [8.4, 0.62], index: [12.1, 0.95], mid: [5.6, 0.32], small: [4.1, 0.18], hybrid: [7.2, 0.55], debt: [6.8, 0.45] };
const CAPS = { large: [65, 20, 6], index: [100, 0, 0], mid: [12, 74, 8], small: [4, 18, 74], hybrid: [58, 8, 4], debt: [0, 0, 0] };
const round1 = (n) => Math.round(n * 10) / 10;
const HOLDINGS = {};
FUNDS.forEach((f) => {
  const key = CAT_KEY[f.category] || 'large'; const rnd = seeded('hold:' + f.id);
  const [w0, slope] = SHAPE[key];
  const pool = key === 'index' ? NAMES[key] : [...NAMES[key]].sort(() => rnd() - 0.5);
  const top = pool.slice(0, 10).map(([name, sector], i) => {
    const pct = round1(w0 - slope * i + (rnd() - 0.5) * 0.6);
    /* Last month's weight drifts by fractions of a point, so H3's change column reads as a real month. */
    return { name, sector, pct, prevPct: round1(pct - (rnd() - 0.5) * 0.9) };
  });
  const isDebt = key === 'debt';
  const equity = isDebt ? 0 : key === 'hybrid' ? 70 : key === 'index' ? 99.4 : round1(84 + rnd() * 10);
  const debtCash = round1(100 - equity);
  const [L, M, S] = CAPS[key]; const capScale = equity / (L + M + S || 1);
  const caps = isDebt ? [] : [['Large cap', L], ['Mid cap', M], ['Small cap', S]].filter(([, v]) => v > 0).map(([label, v]) => ({ label, pct: round1(v * capScale) }));
  /* Sector weights for three months: the newest is summed from the top ten plus a tail; the older two
     drift back by fractions so a month-over-month reading is real and small. */
  const bySector = {};
  top.forEach((h) => { bySector[h.sector] = (bySector[h.sector] || 0) + h.pct; });
  const tail = 100 - top.reduce((a, h) => a + h.pct, 0);
  const secNames = Object.keys(bySector);
  secNames.forEach((n) => { bySector[n] = round1(bySector[n] + tail * (0.5 + rnd()) / secNames.length * 0.9); });
  const sectors = {};
  HOLD_MONTHS.forEach((m, mi) => {
    sectors[m] = secNames.map((n) => ({ name: n, pct: round1(bySector[n] - mi * (rnd() - 0.4) * 1.4) })).sort((a, b) => b.pct - a.pct);
  });
  const count = isDebt ? 38 + Math.round(rnd() * 20) : key === 'index' ? 50 : 60 + Math.round(rnd() * 60);
  const top5 = round1(top.slice(0, 5).reduce((a, h) => a + h.pct, 0));
  const secNow = sectors[HOLDINGS_AS_OF];
  HOLDINGS[f.id] = {
    asOf: HOLDINGS_AS_OF, count, split: { equity, debtCash }, caps, sectors, top,
    concentration: { top5CompaniesPct: top5, largestCompany: top[0], sectorsCount: secNames.length + (isDebt ? 0 : 3),
      top5SectorsPct: round1(secNow.slice(0, 5).reduce((a, x) => a + x.pct, 0)), largestSector: secNow[0] },
    fixture: true,
  };
});
const holdingsOf = (id) => HOLDINGS[id] || null;
const holdingsProvenance = () => `holdings and sector weights · illustrative for design, not a scheme portfolio · as of ${HOLDINGS_AS_OF}`;
/* OVERLAP, computed: the weight two funds share in the names their top tens have in common, as a
   share of the smaller fund's top-ten weight. Null when either side has no holdings on file — an em
   dash, never a zero, which is OverlapView's own rule. */
const overlapPct = (a, b) => {
  const A = HOLDINGS[a], B = HOLDINGS[b]; if (!A || !B) return null;
  const wb = Object.fromEntries(B.top.map((h) => [h.name, h.pct]));
  const shared = A.top.reduce((s, h) => s + (wb[h.name] != null ? Math.min(h.pct, wb[h.name]) : 0), 0);
  const base = Math.min(A.top.reduce((s, h) => s + h.pct, 0), B.top.reduce((s, h) => s + h.pct, 0));
  return base ? Math.round((shared / base) * 100) : 0;
};

/* WHAT CHANGED — three months per fund, as facts a sentence can be built from. `aumChangeCr` is
   scaled to the fund's size; returns are monthly, not annualised, and the benchmark's sits beside. */
const MONTHLY = {};
FUNDS.forEach((f) => {
  const rnd = seeded('month:' + f.id); const p = PERF[f.id]; const h = HOLDINGS[f.id];
  const vol = { 'Small cap': 4.2, 'Mid cap': 3.4, 'Flexi cap': 2.4, 'Large cap': 2.2, 'Index': 2.2, 'Balanced advantage': 1.4, 'Corporate bond': 0.35, 'Short duration': 0.3 }[f.category] || 2;
  MONTHLY[f.id] = HOLD_MONTHS.map((month) => {
    const bench = round1((rnd() - 0.45) * vol * 1.6);
    const fund = round1(bench + (rnd() - 0.42) * vol * 0.8);
    const names = h.top.map((x) => x.name);
    const picks = [...names].sort(() => rnd() - 0.5);
    return { month, aumChangeCr: Math.round(p.aumCr * (0.004 + rnd() * 0.02) * (rnd() > 0.25 ? 1 : -1)),
      fundReturn: fund, benchReturn: bench,
      gainers: picks.slice(0, 3).map((n) => ({ name: n, pct: round1(2 + rnd() * 9) })),
      losers: picks.slice(3, 6).map((n) => ({ name: n, pct: round1(-(1 + rnd() * 9)) })), fixture: true };
  });
});
const monthlyOf = (id) => MONTHLY[id] || null;
const monthlyProvenance = () => `monthly changes · illustrative figures for design, not a scheme record · as of ${HOLDINGS_AS_OF}`;

/* CATEGORY AVERAGES — one row per category, so two funds in one category are read against the same
   number. Set below the good funds and above the index fund's tracking, which is how a category
   average sits in the real tables this was read from. */
const CATEGORY_AVG = {
  'Flexi cap': { r1: 14.9, r3: 18.6, r5: 19.2 }, 'Large cap': { r1: 12.8, r3: 15.1, r5: 15.4 }, 'Index': { r1: 13.5, r3: 15.7, r5: 16.3 },
  'Mid cap': { r1: 17.2, r3: 25.3, r5: 24.8 }, 'Small cap': { r1: 6.1, r3: 24.9, r5: 29.6 }, 'Balanced advantage': { r1: 10.4, r3: 12.1, r5: 11.9 },
  'Corporate bond': { r1: 7.4, r3: 6.6, r5: 6.9 }, 'Short duration': { r1: 7.2, r3: 6.4, r5: 6.6 },
};
const categoryAvgOf = (id) => { const f = fundById(id); return f ? CATEGORY_AVG[f.category] || null : null; };

/* THE COST OF A SWITCH, line by line. A switch is a redemption plus a purchase, so it is taxable, and
   the tax depends on when each lot was bought — which is why this returns NULL when the folio has no
   purchase dates on file: the uncosted case is a missing input with a name, not a zero. For Sharma's
   one costed move the split reproduces the ₹11,200 the product has stated since Journey B, so the total
   printed on the confirm and the breakdown printed above it cannot disagree. */
const SWITCH_LOTS = {
  /* 42% of the ₹1,85,000 was bought inside the last year (the 2024–25 small-cap run), so the exit load
     bites only there; the rest is long-term. The three lines sum to the ₹11,200 Journey B has stated. */
  'quant-small': { forAmountRs: 185000, underYearRs: 77700, gainUnderYearRs: 25865, gainOverYearRs: 42000, datesOnFile: true },
};
const switchCost = (fromId, amountRs) => {
  const f = fundById(fromId); const lots = SWITCH_LOTS[fromId];
  if (!f || !lots || !lots.datesOnFile) return null;
  /* The lots are written for the ₹1,85,000 the product has always moved; a different amount scales them
     pro rata, so a dial that moves less (or the whole holding) costs in proportion. */
  const k = amountRs / lots.forAmountRs;
  const loadPct = parseFloat(f.exitLoad) || 0;
  const exitLoadRs = Math.round(lots.underYearRs * k * loadPct / 100);
  const stcgRs = Math.round(lots.gainUnderYearRs * k * TAX.stcgPct / 100);
  const ltcgRs = Math.round(lots.gainOverYearRs * k * TAX.ltcgPct / 100);
  return { exitLoadRs, stcgRs, ltcgRs, totalRs: exitLoadRs + stcgRs + ltcgRs,
    lines: [
      { label: 'Exit load', value: inr(exitLoadRs), rule: `${f.exitLoad} — on the units under a year old` },
      { label: 'Short-term gains tax', value: inr(stcgRs), rule: `${TAX.stcgPct}% on gains under twelve months` },
      { label: 'Long-term gains tax', value: inr(ltcgRs), rule: `${TAX.ltcgPct}% above the ₹1.25 L annual allowance` },
    ] };
};

const perfProvenance = (period) => `${period ? period + ' returns · ' : ''}illustrative figures for design, not a scheme record · as of ${PERF_AS_OF}`;
const PERF_PERIODS = [{ key: 'r1', label: '1Y' }, { key: 'r3', label: '3Y' }, { key: 'r5', label: '5Y' }];
/* Returns are annualised past 1Y, and saying so is not optional — SEBI's own presentation rule, and the
   difference between 27.6 meaning "a year like that" and "every year for three". */
const perfNote = (key) => (key === 'r1' ? 'Last 12 months' : `${key === 'r3' ? 'Three' : 'Five'}-year CAGR`);


/* THE RULES THIS BOOK IS CHECKED AGAINST. Two of them carry the number 25 and they are NOT the same rule
   (contradiction 32): one caps a single fund, the other caps the small-cap sleeve. */
const LIMITS = {
  singleFund: 25,          // % of a portfolio in one scheme
  smallCapSleeve: 25,      // % of a portfolio in small cap overall
  driftBand: 5,            // points either side of the mandate before a review is raised
};

/* TAX, as it stands for equity-oriented schemes on 19 Sep 2026. Checked, not remembered: STCG 20% under
   twelve months (s.111A, from 23 Jul 2024), LTCG 12.5% on aggregate equity gains above ₹1.25 L in a
   financial year, no indexation. A switch is a redemption plus a purchase, so it is taxable — which is
   why "no exit load, no tax" on Sharma's SIP redirect is a claim the book has to support. */
const TAX = { stcgPct: 20, ltcgPct: 12.5, ltcgExemptionRs: 125000, equityHoldingMonths: 12 };

/* ───────────────────────────── THE CLIENTS ─────────────────────────────
   Four are carried in full because four journeys are built on them. The rest are the drawer's book:
   name, city and enough to be reached, which is what the drawer actually shows. */
const CLIENTS = [
  {
    id: 'meera', name: 'Meera Nair', age: 38, city: 'Kochi', since: 2019,
    pan: 'ABCPN••••K', kyc: { status: 'Valid', mode: 'CKYC', updated: '11 Feb 2026' },
    nominee: { name: 'Rahul Nair', relation: 'Spouse', share: 100 },
    income: { monthly: 180000, source: 'Salary plus bonus', evidence: 'ITR, AY 2025-26' },
    spendMonthly: 95000, emergencyFund: 600000,
    goal: { label: 'Corpus', amountRs: 20000000, byYear: 2041 },     // ₹2 crore — the journey's own goal
    /* The risk profile the rail produces. Three scores, and the rule is the LOWEST of them. */
    risk: { score: 54, band: 'Moderate', lockedOn: '15 Sep 2026',
      rows: [{ label: 'What her finances can absorb', value: 71 },
             { label: 'What she can sit through calmly', value: 54, binding: true },
             { label: 'What her ₹2 crore goal needs', value: 62 }] },
    mandate: { equity: 55, debt: 30, cash: 15 },
    portfolio: { valueRs: 1840000, funds: 43, asOf: '30 Sep 2026' },  // ₹18.4 L across 43 funds
    /* The long tail is the point of her review: 14 funds hold 80% and the other 29 are under 1.5% each. */
    tail: { topFunds: 14, topSharePct: 80, tinyFunds: 29, tinyUnderPct: 1.5 },
    sips: [{ fundId: 'ppfas-flexi', amountRs: 15000, day: 5, mandate: 'NACH' }],
    flags: ['Review due — 43 funds, 29 of them under 1.5%'],
  },
  {
    id: 'sharma', name: 'R. Sharma', age: 46, city: 'Pune', since: 2017,
    pan: 'AXSPS••••M', kyc: { status: 'Valid', mode: 'KRA', updated: '3 Aug 2025' },
    nominee: { name: 'Anita Sharma', relation: 'Spouse', share: 100 },
    income: { monthly: 240000, source: 'Own business', evidence: 'ITR, AY 2025-26' },
    spendMonthly: 130000, emergencyFund: 1200000,
    goal: { label: 'Retirement', amountRs: 40000000, byYear: 2040 },
    risk: { score: 58, band: 'Moderate', lockedOn: '22 Mar 2026',
      rows: [{ label: 'What his finances can absorb', value: 74 },
             { label: 'What he can sit through calmly', value: 58, binding: true },
             { label: 'What his retirement needs', value: 66 }] },
    mandate: { equity: 60, debt: 30, cash: 10 },
    /* ₹14.2 L IS DERIVED, NOT INVENTED. The product says the switch of ₹1,85,000 moves equity from 71%
       to 58% — thirteen points — and a switch changes today's allocation while a SIP redirect does not.
       ₹1,85,000 ÷ 0.13 = ₹14,23,077, so the portfolio is ₹14.2 L and every percentage on the drift
       screens resolves against it. If the portfolio figure is ever changed, the ₹1,85,000 has to move
       with it or screen 5 starts lying. */
    portfolio: { valueRs: 1423000, funds: 18, asOf: '30 Sep 2026' },
    allocation: { equity: 71, debt: 24, cash: 5 },                    // today, from his Q3 statement
    /* R4, from the research: "only a part of asset allocation shown that too it says equity no mention of
       mid large or small" — an MFD's own words. Equity / Debt / Cash is one level too coarse to act on,
       and BOTH of this product's 25% ceilings are written against caps the three-row card never showed.
       Split from his holdings: small 31 + flexi 14 + large 11 + 15 across the thirteen funds under 5%. */
    allocationByCap: [
      { label: 'Small cap', pct: 31, over: 'smallCapSleeve' },
      { label: 'Other equity', pct: 15 },
      { label: 'Flexi cap', pct: 14 },
      { label: 'Large cap', pct: 11 },
    ],
    /* R1, from the research: the top theme was a total that was silently short because one AMC had not
       reported. Provenance says WHERE a figure came from; this says HOW COMPLETE it is. */
    reporting: { funds: 18, reported: 18, asOf: '30 Sep 2026' },
    allocationPrior: { equity: 62 },                                  // Q2 — the drift is 62 → 71
    /* Quant Small Cap at 31% breaches the single-fund ceiling of 25%: 31% of ₹14.2 L is ₹4,41,130, and
       taking ₹1,85,000 out leaves ₹2,56,130 — 18% — which is why the confirm sheet can state "No fund
       over 25%" after the moves and not before. */
    holdings: [
      { fundId: 'quant-small', pct: 31, valueRs: 441130, folio: '9142/28', over: 'single-fund ceiling' },
      { fundId: 'ppfas-flexi', pct: 14, valueRs: 199220, folio: '9142/29' },
      { fundId: 'hdfc-large',  pct: 11, valueRs: 156530, folio: '9142/31' },
      { fundId: 'icici-corp',  pct: 10, valueRs: 142300, folio: '7761/04' },
      { fundId: 'hdfc-stdebt', pct: 8,  valueRs: 113840, folio: '7761/05' },
    ],
    holdingsShown: 5,                                                 // of 18 — the rest are under 5% each
    holdingsTailNote: '13 more, each under 5%',
    sips: [{ fundId: 'quant-small', amountRs: 30000, day: 7, mandate: 'NACH', note: 'the redirect in move 2' }],
    /* The rebalance the built screens decide on. The cost is stated on the simulation and again on the
       sheet, and it is a switch — a redemption plus a purchase — so it is taxable by definition. */
    rebalance: {
      moves: [
        { n: 1, kind: 'switch', fromId: 'quant-small', toId: 'icici-corp', amountRs: 185000 },
        { n: 2, kind: 'sip-redirect', fromId: 'quant-small', toId: 'hdfc-large', amountRs: 30000 },
      ],
      equityAfter: 58, costRs: 11200,
      /* The split is no longer a placeholder: `switchCost` produces it from SWITCH_LOTS, which
         carries the purchase dates for this folio. ₹777 exit load + ₹5,173 short-term + ₹5,250
         long-term = the ₹11,200 this book has stated since Journey B. */
      costParts: 'exit load ₹777 · short-term ₹5,173 · long-term ₹5,250',
      settles: 'T+2',
    },
    flags: ['Equity 11 points over mandate', 'Quant Small Cap over the single-fund ceiling'],
  },
  {
    id: 'amit', name: 'Mr. Amit Aggrawal', age: 52, city: 'Delhi', since: 2026,
    pan: 'AGGPA••••R', kyc: { status: 'In process', mode: 'CKYC', updated: '—', note: 'PAN–Aadhaar seeding pending' },
    nominee: null,
    income: { monthly: 400000, source: 'Own business', evidence: 'Declared — no ITR on file yet' },
    spendMonthly: 180000, emergencyFund: 2500000,
    goal: { label: 'Wealth', amountRs: 50000000, byYear: 2045 },
    risk: { score: null, band: null, lockedOn: null, note: 'Not profiled — the proposal is built against the mandate he stated' },
    /* ceilingRs is the most he has agreed to commit, and it is part of the mandate he STATED rather
       than a number anyone scored. It is what the refusal in thread/refusals.jsx holds the line at
       (₹60,00,000 is above it), and it is why the proposal is headed "Where ₹25 lakh would go"
       when the advisor answered ₹50,00,000 — which is SCREENS-PLAN open question 2, answered:
       both numbers are real, one is the ask and the other is the ceiling. */
    mandate: { equity: 65, debt: 30, cash: 5, ceilingRs: 2500000 },
    portfolio: { valueRs: 0, funds: 0, asOf: '30 Sep 2026' },
    proposal: { amountRs: 2500000, funds: 6, drafted: '14 Sep 2026', versions: 3, sentVersion: 2 },
    sips: [],
    flags: ['KYC in process — nothing can be executed until it clears', 'No risk profile'],
  },
  {
    id: 'sunita', name: 'Sunita Nair', age: 41, city: 'Kochi', since: 2020,
    pan: 'BNSPS••••J', kyc: { status: 'Valid', mode: 'CKYC', updated: '19 Jan 2026' },
    nominee: { name: 'Meera Nair', relation: 'Sister', share: 100 },
    income: { monthly: 150000, source: 'Fixed salary', evidence: 'Form 16, FY 2025-26' },
    spendMonthly: 80000, emergencyFund: 500000,
    goal: { label: "Daughter's education", amountRs: 6000000, byYear: 2034 },
    risk: { score: 47, band: 'Moderately conservative', lockedOn: '8 Jul 2026',
      rows: [{ label: 'What her finances can absorb', value: 61 },
             { label: 'What she can sit through calmly', value: 47, binding: true },
             { label: 'What her goal needs', value: 55 }] },
    mandate: { equity: 45, debt: 45, cash: 10 },
    portfolio: { valueRs: 920000, funds: 31, asOf: '30 Sep 2026' },
    holdings: [{ fundId: 'hdfc-flexi', pct: 12, valueRs: 110400, folio: '5520/11' },
               { fundId: 'icici-baf', pct: 10, valueRs: 92000, folio: '5520/12' }],
    sips: [{ fundId: 'icici-baf', amountRs: 10000, day: 10, mandate: 'NACH' }],
    /* The exit-load question in her thread: units bought inside twelve months carry the load AND short-term
       tax, which is the pair an advisor has to state together. */
    flags: ['Exit load on the Jun 2026 purchase until 12 Jun 2027'],
  },
  /* The rest of the drawer's book. Enough to be reached and named; no portfolio detail, because none of
     the built screens shows any and inventing it would be inventing. */
  { id: 'kavita',  name: 'Kavita Rao',       city: 'Bengaluru', since: 2021, kyc: { status: 'Valid' } },
  { id: 'anil',    name: 'Anil Menon',       city: 'Chennai',   since: 2018, kyc: { status: 'Valid' } },
  { id: 'priya',   name: 'Priya Deshpande',  city: 'Pune',      since: 2022, kyc: { status: 'Valid' } },
  { id: 'vikram',  name: 'Vikram Shah',      city: 'Ahmedabad', since: 2019, kyc: { status: 'Re-KYC due' } },
  { id: 'lakshmi', name: 'Lakshmi Iyer',     city: 'Coimbatore',since: 2023, kyc: { status: 'Valid' } },
  { id: 'rohan',   name: 'Rohan Gupta',      city: 'Gurugram',  since: 2024, kyc: { status: 'Valid' } },
];
const clientById = (id) => CLIENTS.find((x) => x.id === id);

/* ── R3 · WHAT ACTUALLY HAPPENED ───────────────────────────────────────────────────────────────────
   The research asked for this in almost every app: "There is no option check all transactions day wise
   & type wise" · "Could not download statement" · "monthly sip Reports not available". The drawer is the
   history of CONVERSATIONS; this is the history of MONEY, and they are not the same thing.

   Every row is one instruction and its outcome. `status` is the honest set, and it is the same set the
   in-flight states use (R2) — placed · settled · rejected · sent (no confirmation yet). A row never says
   "done" for something the RTA has not confirmed. Illustrative figures, consistent with the journeys:
   the two Sharma moves are the ones screens 5 to 7 decide on. */
/* ─────────────────────────────────────────────────────────────────────────────────────────────────
   THE TWO SCORES — CENTRICITY FUND SCORE AND CLIENT HEALTH SCORE · 20 Sep 2026

   THESE ARE DESIGN PLACEHOLDERS AND THE SCREEN SAYS SO IN WORDS. The Fund Discovery PRD leads with a
   "Centricity Score" and this repository has never seen its definition. Inventing one quietly is the
   single worst thing this product could do: a score is the one number an advisor has to defend in
   front of a client, and a number with a hidden methodology cannot be defended at all.

   So the placeholder is built the only way a placeholder may be: **every input is a field already in
   this book, every weight is stated on the card, and the card names the component dragging the score
   down.** Nothing is a black box. When Centricity's real definition arrives, the weights and the five
   mappings below are what change — the card, the band words and the turn do not.

   Two rules the maths obeys:
   - **A missing input is reported, never assumed.** Sharma is the only client with a current
     allocation on file, so the other two score on the inputs that exist and the card says which one
     it could not read. A score quietly computed over four of five components is the "total AUM shown
     is less" defect (docs/RESEARCH.md R1) wearing a different hat.
   - **The band is a word, never a colour** (rule 1). Strong · Sound · Mixed · Weak. */
const clamp100 = (v) => Math.max(0, Math.min(100, Math.round(v)));
const SCORE_BANDS = [[75, 'Strong'], [60, 'Sound'], [45, 'Mixed'], [0, 'Weak']];
const scoreBand = (v) => (SCORE_BANDS.find(([floor]) => v >= floor) || [0, 'Weak'])[1];

/* One weighted mean over the components that could be read, plus the list of the ones that could not.
   `weakest` is the lowest component that carries weight — the card distinguishes it, and the sentence
   names it, because "78" on its own tells an advisor nothing they can act on. */
const rollUp = (rows) => {
  const read = rows.filter((r) => r.value != null);
  const missing = rows.filter((r) => r.value == null);
  const w = read.reduce((t, r) => t + r.weight, 0);
  const value = clamp100(read.reduce((t, r) => t + r.value * r.weight, 0) / (w || 1));
  const weakest = read.slice().sort((a, b) => a.value - b.value)[0] || null;
  /* AND A SCORE OVER A THIRD OF ITS INPUTS IS NOT A SCORE. Meera has a fund count and clean records
     and nothing else on file: 30 of the 100 points of weight. Printing "62" from that is the same
     defect as a total that is quietly short — it reads as confident and it is not. Under half the
     weight the number is withheld and the turn says what is missing instead. Above it, the number
     stands and the card names what it could not read. */
  const coverage = w / 100;
  return { value, band: scoreBand(value), rows: read.map((r) => ({ ...r, binding: weakest && r.label === weakest.label })),
           missing, weakest, coverage, readWeight: w, enough: w >= 50 };
};

/* `short` is what the card's weights line prints — the full label names the meter, and repeating five
   full labels in a sentence above five meters that already carry them is the repetition this product
   gets pulled up on. */
/* TWO HALVES, ON THE OWNER'S WORD (20 Sep 2026): "centricity score ki definition abhi nei hai, fund
   performance and client holding par hai." The methodology is still not written down anywhere, so the
   weights below remain invented and the card still says PLACEHOLDER — but the BASIS is now the
   owner's rather than mine, and the two halves are named on the card so the difference is visible.

   **The trap this shape walks into, stated rather than hidden:** a fund does not become better
   because more of an advisor's clients hold it. Scoring popularity would make every new fund look
   weak and every crowded one look strong, which is the opposite of useful. So the second half does
   not measure popularity — it measures HOW THIS BOOK ALREADY SITS IN THE FUND: the weight it already
   carries, and the headroom left under the ceilings. And when no client holds it at all, those two
   rows are MISSING rather than zero: the fund is scored on its own record, out of 70, and the card
   says so. A fund nobody holds yet is not a bad fund. */
const FUND_SCORE_WEIGHTS = [
  ['Return against its category', 30, 'return', 'Its own record'],
  ['Beats its category', 20, 'consistency', 'Its own record'],
  ['Cost', 20, 'cost', 'Its own record'],
  ['Share of your whole book', 15, 'share', 'How your book holds it'],
  ['Headroom under the ceilings', 15, 'headroom', 'How your book holds it'],
];
const fundScore = (id) => {
  const f = fundById(id); const p = perfOf(id); const cat = categoryAvgOf(id);
  if (!f || !p) return null;
  /* Six points of score per point of three-year lead, centred at 50 — so matching the category is a
     50 and beating it by eight points is a 98. The slope is a guess; it is written here rather than
     buried so that replacing it is a one-line edit. */
  const ret = cat ? 50 + (p.r3 - cat.r3) * 6 : null;
  /* 1.2% is the practical top of a direct-plan expense ratio in this book; 0 is free. */
  const cost = 100 - (p.ter / 1.2) * 100;
  /* How many of the three periods clear the category average — the plainest reading of "consistent". */
  const beats = cat ? (['r1', 'r3', 'r5'].filter((k) => p[k] >= cat[k]).length / 3) * 100 : null;
  /* HOW YOUR BOOK HOLDS IT. Positions on file only; a SIP running in with no position yet is counted
     as a holder for the count on the fund card and NOT here, because there is no weight to measure.
     A fund no client holds leaves both rows null and is scored on its own record, out of 70. */
  const pos = CLIENTS.flatMap((c) => (c.holdings || []).filter((h) => h.fundId === id).map((h) => ({ c, h })));
  /* WEIGHT IS ACROSS THE PRACTICE, NOT INSIDE ONE CLIENT — the two rows have to say different
     things or the second is decoration. This one is the advisor's own concentration: how much of
     every rupee they advise sits in this one scheme. Under 10% is unremarkable and scores full;
     it falls to zero at 30%, where a single scheme moving badly moves the whole practice.

     A FIRST ATTEMPT SCORED THE AVERAGE CLIENT POSITION AGAINST AN 8% IDEAL and marked a fund down
     for being held at 14%, which is a perfectly ordinary weight in a twelve-fund book. It also made
     every unheld fund outscore every held one — the popularity trap running backwards. Being small
     in a book is not a fault; being most of one is. */
  const totalBook = CLIENTS.reduce((t, c) => t + ((c.portfolio && c.portfolio.valueRs) || 0), 0);
  const heldRs = pos.reduce((t, x) => t + x.h.valueRs, 0);
  const sharePct = pos.length && totalBook ? (heldRs / totalBook) * 100 : null;
  const weight = sharePct == null ? null : 100 - (Math.max(0, sharePct - 10) / 20) * 100;
  /* The heaviest holder against the single-fund ceiling. At the ceiling there is no headroom left and
     this fund cannot take another rupee of theirs without a rule being broken — which is a fact about
     what an advisor can DO with it, and the reason this half belongs in a score at all. */
  const big = pos.length ? Math.max(...pos.map((x) => x.h.pct)) : null;
  const headroom = big == null ? null : Math.max(0, (LIMITS.singleFund - big) / LIMITS.singleFund) * 100;
  const vals = { 'Return against its category': ret, 'Cost': cost, 'Beats its category': beats,
                 'Share of your whole book': weight, 'Headroom under the ceilings': headroom };
  /* A MISSING INPUT CARRIES ITS REASON. "Could not be read" is not something an advisor can act on;
     "no client of yours holds it yet, so there is no weight to read" is, and it also says the absence
     is not a fault. */
  const noneHeld = 'no client of yours holds it yet, so there is nothing of yours to measure';
  const why = { 'Share of your whole book': noneHeld, 'Headroom under the ceilings': noneHeld,
                'Return against its category': 'no category average on file for this one',
                'Beats its category': 'no category average on file for this one' };
  return rollUp(FUND_SCORE_WEIGHTS.map(([label, weight2, short, group]) => ({ label, weight: weight2, short, group, why: why[label],
    value: vals[label] == null ? null : clamp100(vals[label]) })));
};
const fundScoreProvenance = () => 'Centricity Fund Score · a DESIGN PLACEHOLDER, not Centricity’s methodology · every input is on this card';

const HEALTH_WEIGHTS = [
  ['Sticking to the mandate', 30, 'mandate'], ['Concentration', 25, 'concentration'], ['Cost of what they hold', 15, 'cost'],
  ['Spread across funds', 15, 'spread'], ['Records in order', 15, 'records'],
];
const clientHealth = (clientId) => {
  const c = clientById(clientId);
  if (!c || !c.portfolio || !c.portfolio.valueRs) return null;
  /* Drift is measured on equity, which is the leg every mandate in this book states and the one the
     drift band is written against. Fifteen points out is a zero; on the band is a hundred. */
  const drift = c.allocation && c.mandate ? Math.abs(c.allocation.equity - c.mandate.equity) : null;
  const mandate = drift == null ? null : 100 - (Math.max(0, drift - LIMITS.driftBand) / 15) * 100;
  const big = (c.holdings || []).reduce((t, h) => Math.max(t, h.pct), 0) || null;
  const conc = big == null ? null : 100 - (Math.max(0, big - LIMITS.singleFund) / LIMITS.singleFund) * 100;
  /* Weighted by what they actually hold, so one large cheap fund counts for more than three small
     expensive ones. Only the holdings on file are read, and the card says how much of the book that
     is when it is not all of it. */
  const held = (c.holdings || []).map((h) => ({ pct: h.pct, ter: (perfOf(h.fundId) || {}).ter })).filter((h) => h.ter != null);
  const heldPct = held.reduce((t, h) => t + h.pct, 0);
  const wTer = heldPct ? held.reduce((t, h) => t + h.ter * h.pct, 0) / heldPct : null;
  const cost = wTer == null ? null : 100 - (wTer / 1.2) * 100;
  /* Twelve to twenty funds is a book somebody is managing; forty-three is a book nobody is. */
  const n = c.portfolio.funds;
  const spread = n == null ? null : n <= 20 ? 100 : 100 - ((n - 20) / 30) * 100;
  const records = clamp100([c.kyc && c.kyc.status === 'Valid' ? 50 : 0, c.nominee ? 35 : 0, (c.holdings || []).every((h) => h.folio) ? 15 : 0].reduce((a, b) => a + b, 0));
  const vals = { 'Sticking to the mandate': mandate, 'Concentration': conc, 'Cost of what they hold': cost, 'Spread across funds': spread, 'Records in order': records };
  const why = { 'Sticking to the mandate': 'the current equity / debt / cash split is not on file',
                'Concentration': 'no holdings on file, only the fund count',
                'Cost of what they hold': 'no holdings on file, so nothing to weigh the expense ratios by' };
  const out = rollUp(HEALTH_WEIGHTS.map(([label, weight, short]) => ({ label, weight, short, why: why[label],
    value: vals[label] == null ? null : clamp100(vals[label]) })));
  return { ...out, heldPct: heldPct || 0, funds: n, drift, big };
};
const healthProvenance = (c) => `Client Health Score · a DESIGN PLACEHOLDER, not Centricity’s methodology · from ${c && c.portfolio ? c.portfolio.asOf : '30 Sep 2026'} holdings and the mandate on file`;

const LEDGER = [
  { id: 'l1', date: '19 Sep 2026', client: 'sharma', kind: 'Switch', detail: '₹1,85,000 · Quant Small Cap → ICICI Corporate Bond', amountRs: 185000, status: 'placed', ref: 'ord 8841/22', settles: '23 Sep' },
  { id: 'l2', date: '19 Sep 2026', client: 'sharma', kind: 'SIP change', detail: 'Redirect ₹30,000 SIP → HDFC Large Cap', amountRs: 30000, status: 'rejected', ref: '—', note: 'NACH mandate registered for the old amount' },
  { id: 'l3', date: '12 Sep 2026', client: 'meera', kind: 'SIP', detail: '₹15,000 · Parag Parikh Flexi Cap', amountRs: 15000, status: 'settled', ref: 'ord 8712/09', settles: '16 Sep' },
  { id: 'l4', date: '10 Sep 2026', client: 'sunita', kind: 'Purchase', detail: '₹50,000 · ICICI Balanced Advantage', amountRs: 50000, status: 'settled', ref: 'ord 8698/41', settles: '12 Sep' },
  { id: 'l5', date: '5 Sep 2026', client: 'meera', kind: 'Redemption', detail: '₹1,20,000 · UTI Nifty 50 Index', amountRs: 120000, status: 'sent', ref: '—', note: 'No confirmation from the RTA yet' },
];
const LEDGER_PERIOD = 'Sep 2026';
/* What an export would carry, named so a screen never implies more than the file holds. */
const LEDGER_EXPORT = { formats: ['CSV', 'PDF'], columns: ['Date', 'Client', 'Type', 'Detail', 'Amount', 'Status', 'Reference'] };

/* MEERA'S REVIEW — and the shape of it is decided by what the book DOES NOT have.

   Her record carries the value, the fund count, the as-of date, the long tail, her SIP, her mandate,
   her risk number and her goal. It does NOT carry her 43 holdings, and it does not carry her actual
   equity / debt / cash split. So a review of Meera can describe the SHAPE of her book exactly and
   cannot say whether she is on her mandate — which is the single most useful thing a review would say.

   That is not a gap to paper over with a plausible 57%. It is the finding: the statement was loaded
   fund-wise and nobody has mapped the 29 tail funds to categories, so the split is a figure to supply.
   `StatTile locked` exists for exactly this and had been on no screen since v9.

   Every figure below is derived from `portfolio.valueRs` and `tail`, so changing either moves all of
   them together and none of them can drift. */
const REVIEW_TOP_RS  = Math.round(1840000 * 0.80);          // 14 funds hold 80% → ₹14,72,000
const REVIEW_TAIL_RS = 1840000 - REVIEW_TOP_RS;             // 29 funds hold the rest → ₹3,68,000
const REVIEW_TAIL_AVG_RS = Math.round(REVIEW_TAIL_RS / 29); // ₹12,690 each, on average
const REVIEW_TINY_CAP_RS = Math.round(1840000 * 0.015);     // 1.5% of her book is ₹27,600

/* WHAT A REVIEW IS FOR, and it is the one thing Sentinel cannot infer. The facts are identical in all
   three; what changes is what is left out and what is proposed. A product that quietly turns a record
   into a proposal has sold something, and the advisor is the one who signed it. */
const REVIEW_AUDIENCES = [
  { id: 'record', label: 'Her annual record', chip: 'Her annual record',
    ending: 'A record, not a proposal. Dated, with what I could not check stated on it, and nothing suggested.',
    note: 'This is the one you file.' },
  { id: 'meeting', label: 'A meeting with her', chip: 'A meeting with her',
    ending: 'Plain words she would use, the tail explained, and the one question worth asking her.',
    note: 'This is the one you read aloud.' },
  { id: 'invest', label: 'Before she invests more', chip: 'Before she invests more',
    ending: 'Headroom against her mandate — which I cannot work out until her split is on file.',
    note: 'This is the one I cannot finish yet.' },
];

/* HOW FAR TO TAKE A REBALANCE — the one question the rail asks, and the three answers are three
   different RULES rather than three appetites.

     · to the mandate   equity 71 → 60. The number he agreed to. 11 points of ₹14,23,000 = ₹1,56,530.
     · inside the band  equity 71 → 65. LIMITS.driftBand is 5 either side, so 65 is the edge at which a
                        review stops being raised. 6 points = ₹85,380. The cheapest thing that ends the
                        breach, and it leaves him at the edge rather than at the middle.
     · clear the fund   equity 71 → 58. NOT an appetite: Quant Small Cap is 31% of the book and is the
                        WHOLE small-cap sleeve, so one holding breaches the single-fund ceiling and the
                        sleeve ceiling at once, both 25 and both different rules (contradiction 32).
                        Taking ₹1,85,000 out leaves it at 18%, and the equity lands at 58 — past the
                        mandate — because the ceiling sized the move, not the drift did.

   COST IS WHERE THIS STOPS BEING A MENU. Only the third is costed. `sharma.rebalance.costRs` is a
   figure the book carries and `switchCost` now produces its three-line split from SWITCH_LOTS, which
   holds the purchase dates for folio 9142/28. The other two targets have no lots on file, so they can
   be SIZED and cannot be COSTED, and the screen says so rather than printing a zero or a guess.

   The first two amounts are exactly points × ₹14,23,000. The third is ₹1,85,000 and NOT ₹1,84,990,
   because ₹1,85,000 is the anchor the whole drift story is derived from and 13 points is the figure
   derived from it — see the portfolio comment above. Do not "correct" it. */
const REBALANCE_TARGETS = [
  { id: 'mandate', label: 'To the mandate', equityAfter: 60, points: 11, amountRs: 156530,
    why: 'The mix he agreed to. The furthest of the three, and the one you can read to him in his own words.',
    rule: 'His mandate', costRs: null },
  { id: 'band', label: 'Inside the band', equityAfter: 65, points: 6, amountRs: 85380,
    why: 'The cheapest thing that ends the breach. It leaves him at the edge of the band, so a small move next quarter puts him back outside it.',
    rule: `The ±${LIMITS.driftBand}-point drift band`, costRs: null },
  { id: 'ceiling', label: 'Clear the fund ceiling', equityAfter: 58, points: 13, amountRs: 185000,
    why: 'Sized by the ceiling rather than by the drift: it takes Quant Small Cap from 31% to 18%. Equity lands past the mandate as a consequence, not as a choice.',
    rule: `The ${LIMITS.singleFund}% single-fund ceiling`, costRs: 11200 },
];

/* THE PROPOSAL FOR AMIT — ₹25,00,000 split six ways, and every line of it is checked against something
   in this file rather than chosen. The mandate he stated is equity 65 / debt 30 / cash 5, so the sleeves
   are ₹16,25,000 / ₹7,50,000 / ₹1,25,000 and they add to the whole. Cash is not a fund and is not given
   one: it is the 5% he asked to keep liquid, and a proposal that quietly invested it would be answering
   a question he did not ask. Six funds, which is what his record already said (`proposal.funds: 6`).

   THE CEILING IS LIVE, NOT DECORATIVE. LIMITS.singleFund is 25%, and the largest line here is 24% —
   deliberately just under, so the card can state the headroom instead of claiming there is none. Every
   fund is on the shelf; Quant Small Cap is not, and does not appear. */
const PROPOSAL_AMOUNT = 2500000;
const PROPOSAL_ASKED  = 5000000;   /* what the advisor typed before the ceiling was stated */
const PROPOSAL_SPLIT = [
  { fund: 'ppfas-flexi', amountRs: 600000, pct: 24.0, why: 'The core. Flexi cap, so the manager moves between sizes rather than you doing it.' },
  { fund: 'hdfc-large',  amountRs: 500000, pct: 20.0, why: 'Large cap ballast — the part of the equity he is least likely to flinch at.' },
  { fund: 'motilal-mid', amountRs: 300000, pct: 12.0, why: 'The only mid-cap line. Small cap is absent on purpose: he has no risk profile yet.' },
  { fund: 'hdfc-flexi',  amountRs: 225000, pct:  9.0, why: 'A second flexi cap under a different house, so one AMC does not hold the whole core.' },
  { fund: 'icici-corp',  amountRs: 450000, pct: 18.0, why: 'Corporate bond, nil exit load — the debt he can reach without a penalty.' },
  { fund: 'hdfc-stdebt', amountRs: 300000, pct: 12.0, why: 'Short duration, to keep the debt sleeve from taking a rate view.' },
];
const PROPOSAL_CASH = { amountRs: 125000, pct: 5.0, why: 'Left in cash, because that is the 5% he asked to keep liquid.' };
/* Three versions, and version 2 is the one the client has seen. The going-back layer is not a demo here:
   an advisor who sends a proposal and then edits it has two documents in the world, and only one of them
   is the one being discussed on the phone. */
/* The summaries are SHORT because VersionRow's column is 235px and the preview gate measures it: the
   first cut said "Mid-cap trimmed from ₹4,00,000 to ₹3,00,000" and needed 269. What changed goes here in
   the advisor's words; the rupees are in the table the version produced. */
const PROPOSAL_VERSIONS = [
  { v: 3, at: '19 Sep 2026, 11:20 am', note: 'Mid-cap trimmed by ₹1,00,000', state: 'draft' },
  { v: 2, at: '16 Sep 2026, 4:05 pm',  note: 'Sent to Mr. Aggrawal', state: 'sent' },
  { v: 1, at: '14 Sep 2026, 6:40 pm',  note: 'Draft, before the ceiling', state: 'superseded' },
];
/* WHAT STOPS THIS BEING PLACED, and it is not a design state — it is his record. KYC is in process and he
   has no nominee, so the proposal can be built, saved and SENT, and nothing in it can be executed. Every
   row is a fact from CLIENTS, so a screen cannot show a green tick the book does not support. */
const PROPOSAL_BLOCKERS = [
  { label: 'KYC', value: 'In process · CKYC', blocking: true,  note: 'PAN–Aadhaar seeding pending. Nothing can be placed until it clears.' },
  { label: 'Nominee', value: 'Not on file', blocking: true, note: 'An AMC will not accept a folio without a nominee or a signed opt-out.' },
  { label: 'Risk profile', value: 'Not done', blocking: false, note: 'Built against the mandate he stated, not against a score. Say so when you send it.' },
  { label: 'Mandate', value: 'Equity 65 / Debt 30 / Cash 5', blocking: false, note: 'Stated by him on 14 Sep. The split matches it to the rupee.' },
];

/* Derived, so a screen never hand-computes a figure the book can answer. */
const driftPoints = (c) => (c.allocation && c.mandate ? c.allocation.equity - c.mandate.equity : null);
const overSingleFund = (c) => (c.holdings || []).filter((h) => h.pct > LIMITS.singleFund);
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

Object.assign(window, { ADVISOR, FUNDS, fundById, PERF, PERF_AS_OF, PERF_PERIODS, perfOf, perfProvenance, perfNote, MANAGERS, managerOf, managerLine, managerProvenance, comparisonProvenance, HOLDINGS, HOLDINGS_AS_OF, HOLD_MONTHS, holdingsOf, holdingsProvenance, overlapPct, MONTHLY, monthlyOf, monthlyProvenance, CATEGORY_AVG, categoryAvgOf, switchCost, LIMITS, TAX, CLIENTS, clientById, LEDGER, LEDGER_PERIOD, LEDGER_EXPORT,
  REVIEW_TOP_RS, REVIEW_TAIL_RS, REVIEW_TAIL_AVG_RS, REVIEW_TINY_CAP_RS, REVIEW_AUDIENCES, REBALANCE_TARGETS, PROPOSAL_AMOUNT, PROPOSAL_ASKED, PROPOSAL_SPLIT, PROPOSAL_CASH, PROPOSAL_VERSIONS, PROPOSAL_BLOCKERS,
  clamp100, scoreBand, SCORE_BANDS, FUND_SCORE_WEIGHTS, fundScore, fundScoreProvenance, HEALTH_WEIGHTS, clientHealth, healthProvenance,
  NAV_SERIES, NAV_MONTHS, NAV_BASE, BENCH_CANON, navSeries, tenKAfter, benchCagr, BENCH_SHORT, benchReturnAt, benchProvenance,
  driftPoints, overSingleFund, inr });
