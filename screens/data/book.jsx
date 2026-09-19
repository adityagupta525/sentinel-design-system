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
      costParts: '[PLACEHOLDER — the split between exit load and tax needs the purchase dates on folio 9142/28]',
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

Object.assign(window, { ADVISOR, FUNDS, fundById, LIMITS, TAX, CLIENTS, clientById, LEDGER, LEDGER_PERIOD, LEDGER_EXPORT,
  PROPOSAL_AMOUNT, PROPOSAL_ASKED, PROPOSAL_SPLIT, PROPOSAL_CASH, PROPOSAL_VERSIONS, PROPOSAL_BLOCKERS,
  driftPoints, overSingleFund, inr });
