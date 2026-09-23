/* THE APP ITSELF, lifted out of the page that documented it (21 Sep 2026).
   `Proto` is the product: one phone, one composer, and the router that decides which journey a
   sentence enters. It lived inside `prototype.html`, wrapped in that page's documentation — the
   control panel, the event log, the router table, the four-questions table. That was right while
   there was one reader. It stopped being right the moment the app had to ship on its own, to a
   phone, with none of that around it.

   So it moves here, which is the move this repository has already made three times — the ledger
   table, the fund shortlist and the live rail were lifted out of their pages for exactly this
   reason, and the prototype's own page says why: two copies drift, one copy cannot.

   `prototype.html` keeps its documentation and renders `<Proto/>` inside a PhoneFrame on a desk.
   `app.html` renders the same `Proto` full-bleed at device size. Neither owns it.

   No second destructure: every .jsx a page loads compiles into ONE scope, so the names below are
   declared once, here, and the page that loads this file reads them from that same scope. */
/* home.jsx already declares Composer, Dock, Pill and ChipRow in this one Babel scope; only the names
   this file adds are destructured. The preview gate fails the page if both declare one. */
const { ScreenStack, SentinelBlock, SentinelText, SentinelTurn, AnswerChip, ProgressTrace, ExplainerSheet, ConfirmSheet, MoveCard, ConstraintCallout, Drawer } = window.SentinelDesignSystem_0682a2;

/* WHAT THIS FILE BORROWS, written down (21 Sep 2026).
   Every `.jsx` a page loads compiles into ONE scope, so the names below are already declared — by
   `home.jsx`, by the journey modules, and by the React UMD build — and re-declaring any of them here
   would be a redeclaration that renders the page blank. They are aliased instead, through a single
   uniquely-named const each and read through in JSX, which is the convention `thread.jsx` states.

   It also makes the linter's view true. `oxlint` reads each file alone, so a bare `<ReviewResult/>`
   here is an undefined component to it; that is not a false positive worth silencing in the config,
   because the coupling is real. A module's borrowings ARE its dependency surface, and this list is
   that surface — the only place in the repository where it is visible at all. */
const PROTO_R = React;
const PROTO_DS = window.SentinelDesignSystem_0682a2;
const BORROWED = {
  ComparePicker, FundCompare, FundInfo, FundVerbs, HoldingsTurn, PropCarried,
  RebCarried, RebalanceAnswer, RevCarried, ReviewEnding, ReviewResult, ShareDraftTurn,
};

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STEP_MS = 850;
const FILL_MS = 900;

/* ─────────────────────────────────────────────────────────────────────────────────────────────────
   THE ROUTER — and it is PATTERNS, not a model. Said plainly here because the whole product rests on
   it: the archive's six-bucket router is a set of regular expressions over the advisor's sentence, and
   every screen in this repository is downstream of which bucket it picked. A prototype that pretended
   to understand language would be demonstrating something nobody has built.

   The order matters and is not alphabetical. An ACT instruction ("sell all of…") is tested before the
   fund search, because "sell all of Sharma's Quant Small Cap" contains a fund name and matching it as a
   search would turn an instruction into a browse — the failure that costs the most. Bucket 4, "I did not
   follow that", is last and is the default: nothing here guesses at the closest journey. */
const ROUTES = [
  { id: 'caps',     re: /what can i (ask|do)|help|capabilit/i,                      why: 'asks what the product can do' },
  /* AN INSTRUCTION IS AN INSTRUCTION AT ANY SIZE (F-45). This read `sell|redeem|switch|buy` followed
     by `all|everything|full`, so "Sell all of Sharma's Quant Small Cap" was caught and
     "Sell 2 lakh of Quant Small Cap" fell through to bucket 4 — the ordinary phrasing, missed by the
     rule whose whole stated purpose is to catch an instruction before the fund search reads it as a
     browse. A verb plus an amount, a holding, or a totality is the instruction. */
  { id: 'act',      re: /\b(sell|redeem|switch|buy|exit|book)\b[^.?!]*?(\b(all|everything|full|everything)\b|\u20b9\s?[\d,]+|\b\d[\d,.]*\s?(lakh|lac|l|cr|crore|k)\b|\bunits?\b|\bout of\b)/i, why: 'an instruction that would ACT' },
  { id: 'over',     re: /₹\s?[6-9]\d,?\d{2},?\d{3}|₹\s?[1-9]\d*\s?(cr|crore)/i,      why: 'an amount above a mandate ceiling' },
  { id: 'outside',  re: /\b(itr|file .*return|tax return|gst)\b/i,                   why: 'in the domain, outside what this product does' },
  { id: 'rebal',    re: /\brebalanc|bring .*back|fix (his|her|the) (mix|drift)/i,        why: 'a rebalance, asked for cold' },
  { id: 'who',      re: /^\s*(meera|sharma|amit|sunita)\s*$/i,                       why: 'a name with no intent' },
  /* REVIEW BEFORE DRIFT. Both can name a client's portfolio, and drift's pattern matches
     "sharma's portfolio" — so "Review Sharma's portfolio" opened a drift trace. The word `review` is
     unambiguous and `drift` carries its own word, so testing review first costs drift nothing. */
  { id: 'review',   re: /\breview\b|what does (she|he) hold|holdings of/i,          why: 'a client review' },
  { id: 'drift',    re: /\bdrift\b|why .*\b(mix|allocation)|sharma(?:'|\u2019)s (portfolio|mix|book)/i, why: 'a drift question' },
  { id: 'propose',  re: /\bproposal\b|\bpropose\b|build .*(for|to) (mr|ms|mrs)?\.? ?\w*ag+ra?wal/i, why: 'a proposal' },
  { id: 'risk',     re: /\brisk\b|\bprofile\b/i,                                     why: 'a risk profile' },
  { id: 'ledger',   re: /placed|ledger|this month|what did i (do|send)/i,            why: 'a question about money already sent' },
  /* BROWSE AND SEARCH ARE NOT THE SAME QUESTION, and this is why `explore` is tested before
     `funds`. "Flexi cap funds under 0.7%" is a search: it has an answer, and journey C gives it as a
     shortlist in the thread. "What's available in debt" is a BROWSE: it has no answer, it has a
     catalogue, and the explorer walks it — four questions, each collapsing into its own answer. The
     old rule caught both with the word `fund` and gave both the shortlist, which is why asking what
     exists returned four funds somebody had already picked. */
  /* THREE THINGS THIS MISSED, and the owner found them by tapping (23 Sep 2026):
       · `\bexplore\b` does not match \"explorer\" — so the HOME SCREEN'S OWN CHIP, labelled
         \"Fund explorer\", opened journey C, and the word the product uses for the screen fell all
         the way through to bucket 4. A control that does not do what it is named is the worst kind.
       · A bare \"fund\" or \"funds\" is a BROWSE. It carries no criterion, so there is nothing to
         search for, and answering it with a two-row shortlist somebody already picked answers a
         different question. Anchored to the whole sentence, so \"flexi cap funds under 0.7%\" is
         still a search and journey C's two demo sentences are untouched — both were checked. */
  { id: 'explore',  re: /\bexplor(?:e|er|ers|ing)\b|\bbrowse\b|what(?:'|’)?s (?:available|on the shelf)|asset class|show me (?:all |the )?(?:funds|products|instruments)|^\s*(?:all |the )?(?:funds?|products?|instruments?|catalogue|catalog)\s*\??\s*$|\b(?:bonds?|fds?|deposits?|pms|aifs?|reits?|invits?|unlisted|gold|sgb)\b/i, why: 'a browse of the catalogue' },
  { id: 'funds',    re: /\bfund|flexi|small cap|large cap|shelf|search\b/i,          why: 'a fund search' },
  { id: 'miss',     re: /.*/,                                                        why: 'nothing matched — and nothing is guessed at' },
];
const route = (text) => ROUTES.find((r) => r.re.test(text || ''));

/* ─────────────────────────────────────────────────────────────────────────────────────────────────
   THE WHO GATE. Six journeys are about a client and cannot start without one. The rule is NOT "always
   ask" — it is "ask only for what the advisor has not already said". A sentence that names a client
   skips this entirely, because being made to pick Meera from a list after typing her name is the
   product telling you it was not listening.

   The journey each fixture belongs to is also checked: this repository has Sharma's drift, Meera's
   risk profile and Amit's proposal, and nothing for Sunita. Picking a client we have no data for is a
   real state and it says so, rather than opening an empty journey. */
const NEEDS_CLIENT = { risk: 'meera', propose: 'amit', rebal: 'sharma', review: 'meera', drift: 'sharma', ledger: null };
/* WHO IS NAMED IN THE SENTENCE — and it took the FIRST word, which for "R. Sharma" is the initial.
   Found by driving the rebalance on 20 Sep: typing "rebalance Sharma" asked "whose portfolio are we
   rebalancing?", which is the one thing the WHO step promises never to do. Initials and titles are
   dropped, and every remaining part of the name is a match.

   AN AMBIGUOUS NAME BINDS NOBODY. Meera Nair and Sunita Nair share a surname, so "review Nair" matches
   two clients — and silently taking the first is worse than asking. Two matches fall through to the
   WHO step, which is exactly the surface for "which one". */
const namedClient = (text) => {
  const hit = CLIENTS.filter((c) => c.name.replace(/^(Mr|Ms|Mrs)\.?\s+/i, '').split(/\s+/)
    .map((w) => w.replace(/\.$/, ''))
    .filter((w) => w.length > 1)
    .some((w) => new RegExp(`\\b${w}\\b`, 'i').test(text || '')));
  return hit.length === 1 ? hit[0] : null;
};

/* What the advisor can do from here, and how to get back — derived from the state rather than written
   per screen, because a list of affordances kept by hand is a list that goes stale the first time a
   screen changes. This function IS the "intelligent control" the product claims to have: if a control
   is not in here, it is not on the screen. */
function affordances(s) {
  const back = [];
  const next = [];
  if (s.screen === 'home') {
    next.push('Tap a client row', 'Tap a starter', 'Type anything — the router decides', 'Attach a statement', 'Open the menu');
    back.push('Nothing to go back from — this is the front door');
    return { next, back, where: 'Home', journey: '—', step: 'at rest' };
  }
  /* THE EXPLORER IS THE FOURTH SURFACE, so the panel answers the same four questions on it. It is the
     only screen in the product whose controls are all visible at once — the four steps, the filter bar
     and the composer — which is the point of it: nothing here is reached by opening something else. */
  if (s.screen === 'explore') {
    next.push('Pick an asset class — more than one is allowed', 'Narrow by product, then by category',
      'Open a fund — its page opens inside the list, not over it', 'Filter by house, cost or size — the bar or the sheet',
      'Type a sentence — “PMS under 1.5%”, “₹25,000 a month” — the funnel reads it');
    back.push('Collapse any step — the answer stays in its header', 'Tap a crumb to reopen that step',
      'Leave by the menu or a new thread — this product has no back arrow');
    return { next, back, where: 'Explorer', journey: 'The shelf', step: 'four questions, one screen' };
  }
  if (s.screen === 'rail') {
    const J = { propose: 'D · Amit’s proposal', rebal: 'E · Sharma’s rebalance', review: 'F · Meera’s review', risk: 'A · Meera’s risk profile' }[s.railJourney] || 'A · Meera’s risk profile';
    /* The panel is produced from the live state, so it names the carried fund only when there is one. */
    if (s.carried) back.push('The fund came with you from the explorer — a new sentence drops it');
    if (s.railJourney === 'review') {
      next.push(s.audience ? 'Save it, or take the PDF' : 'Say what the review is for', s.audience ? 'Take what the ending offers' : 'Three audiences, three endings');
      back.push('Edit the answer above — the ending changes, the card does not', 'New thread (the app bar)');
      return { next, back, where: s.audience ? 'Thread' : 'Journey rail', journey: J, step: s.audience ? 'a review, with an ending' : 'one question: what is it for' };
    }
    /* JOURNEY E IS A THREAD NOW (20 Sep 2026) — answer first, the three rules as dials underneath — so
       every one of its states goes back the way a thread does, not the way a rail does. */
    if (s.railJourney === 'rebal') {
      if (s.rebalPicked) next.push('Save the plan, or take the PDF', 'Approve both moves');
      else if (s.uncosted) next.push('Ask the RTA for the purchase dates', 'Take the one I can cost — the Approve comes back with it');
      else next.push('Approve both moves', 'Size it by a different rule — two of the three have no cost', 'Move into a different fund', 'Why these two moves?');
      back.push('Edit the prompt above — sending it replaces the plan', 'New thread (the app bar)', 'Open the menu for saved work');
      return { next, back, where: 'Thread', journey: J, step: s.rebalPicked ? 'a plan, costed' : s.uncosted ? 'a rule nobody can cost' : 'answered, with the dials under it' };
    }
    back.push('Edit any answer above — the journey reopens there', 'Leave by the menu or a new thread — this product has no back arrow');
    const isProp = s.railJourney === 'propose';
    next.push('Answer the question', 'Ask why this question exists', isProp ? 'Take the ceiling, or raise it first' : 'Skip to the result', 'Type an answer instead');
    return { next, back, where: 'Journey rail', journey: J, step: isProp ? 'one of four' : 'a question at a time' };
  }
  const J = { drift: 'B · Sharma’s drift', funds: 'C · the funds', ledger: 'The ledger', caps: 'What I can do',
    act: 'Refusal · would act', over: 'Refusal · over a ceiling', outside: 'Refusal · out of scope', miss: 'Refusal · not understood', who: 'A name, no intent' }[s.journey] || '—';
  back.push('Edit the prompt above — sending it replaces everything below', 'New thread (the app bar)', 'Open the menu for saved work');
  if (s.journey === 'drift') {
    if (s.phase === 'trace') { next.push('Stop the trace — it keeps what it has'); return { next, back, where: 'Thread', journey: J, step: 'working' }; }
    if (s.phase === 'stopped') { next.push('Continue from where it stopped'); return { next, back, where: 'Thread', journey: J, step: 'stopped' }; }
    if (s.phase === 'answer') {
      next.push(s.artifact === 'expanded' ? 'Collapse the breakdown' : 'Expand the breakdown in place', 'Why is 31% a problem?', 'Show the 18 holdings', 'Rebalance to his mandate');
      return { next, back, where: 'Thread', journey: J, step: 'answered' };
    }
    if (s.phase === 'moves') { next.push('Run the what-if', 'Why was one skipped?', 'Approve — opens the confirm sheet'); return { next, back, where: 'Thread', journey: J, step: 'two moves proposed' }; }
    if (s.phase === 'flight') { next.push('Check with the RTA', 'Nothing else — it is in flight'); return { next, back, where: 'Thread', journey: J, step: 'sent, no answer yet' }; }
    if (s.phase === 'done') { next.push('Read it back to the client', 'Back to his portfolio', 'Drop a note on the file'); return { next, back, where: 'Thread', journey: J, step: 'placed' }; }
  }
  if (s.journey === 'funds') {
    if (s.fundPhase === 'fund') next.push('Ask what it is holding — or type “by sector”, “top 10”, “overlap with…”', 'Compare it with another fund', 'Add it to a proposal — asks which client first', 'Attach it to a rebalance', 'Send it for review');
    else if (s.fundPhase === 'pick') next.push('Pick a fund, or search the shelf');
    else if (s.fundPhase === 'compare') next.push('Add a third — the cap is three', 'Drop one', 'Which suits a 54 Moderate?');
    else next.push('Open a fund — it arrives as a turn', 'Type “sort by cost”, “under 0.7% TER”, “add Motilal”, “show 3Y”', 'Drop a filter');
  }
  if (s.journey === 'ledger') next.push('Open a row for the RTA’s reason', 'Change the period', 'Take the CSV');
  if (s.journey === 'caps') next.push('Ask any of the five');
  if (['act', 'over', 'outside', 'miss', 'who'].includes(s.journey)) next.push('Take the nearest thing it offered — every refusal names one');
  return { next, back, where: 'Thread', journey: J, step: 'answered' };
}

/* ──────────────────────────────────────────────────────────────────────────────────────────────── */
function Proto({ onEvent }) {
  const [screen, setScreen] = React.useState('home');
  const [dir, setDir] = React.useState('forward');
  const [journey, setJourney] = React.useState(null);
  const [ask, setAsk] = React.useState('');
  const [phase, setPhase] = React.useState('trace');
  const [artifact, setArtifact] = React.useState('filling');
  const [view, setView] = React.useState('chart');
  const [stoppedAt, setStoppedAt] = React.useState(0);
  const [resumeFrom, setResumeFrom] = React.useState(0);
  const [traceKey, setTraceKey] = React.useState(0);
  /* WHICH confirm is open, not whether one is: two journeys reach a confirm sheet and they commit to
     completely different things — one places money, the other sends a document that places nothing. */
  const [confirm, setConfirm] = React.useState(null);
  const [why, setWhy] = React.useState(null);
  const [menu, setMenu] = React.useState(false);
  /* The composer is a REAL controlled field here, not a frozen specimen. Screens that only had to show
     a composer passed value="" with a no-op onChange; this page claims the router reads what you type,
     and a claim you cannot test by typing is a claim the page does not keep. Found by typing into it. */
  const [draft, setDraft] = React.useState('');
  /* WHICH journey the rail is running. The rail is one surface with two journeys on it, per
     SCREENS-PLAN's count of 22 steps across it. */
  const [railJourney, setRailJourney] = React.useState('risk');
  const [uncosted, setUncosted] = React.useState(null);
  const [rebalPicked, setRebalPicked] = React.useState(false);
  const [audience, setAudience] = React.useState(null);
  /* The bound client, and the journey waiting on it. */
  const [client, setClient] = React.useState(null);
  const [pending, setPending] = React.useState(null);
  /* The share draft and the client note are two states of one thing — a document Sentinel wrote and
     the advisor has not sent. One door per thing (18 Sep): the artifact's Share and the success
     turn's "Read the note to Sharma" both open a draft, and neither sends anything. */
  /* SAVE HAS TO SAVE. Three result cards drew a Save that logged and left the card in `draft`, so an
     advisor pressed it and the badge stayed a draft — the one piece of feedback the control exists to
     give. `ResultCard` has carried `state='saved'` with a date since v9. The date is the product's
     own clock, not today's, because every other figure on these screens is dated 30 Sep. */
  const SAVED_ON = '30 Sep';
  const [saved, setSaved] = React.useState({});
  const saveIt = (k, what) => () => { setSaved((m) => ({ ...m, [k]: SAVED_ON })); log(`${what} — the badge is a date now, not a draft`, 'the badge changes in place'); };
  const [shared, setShared] = React.useState(false);
  const [note, setNote] = React.useState(false);
  /* JOURNEY C, PAST THE SHORTLIST. `list` is the four funds; `fund` is one of them with the four verbs
     under it; `pick` is "compare it with which fund?"; `compare` is the comparison. The fund an advisor
     is looking at is held here rather than in the table, because three of the four verbs hand it to
     another journey and a fund held inside a table row cannot be handed anywhere. */
  const [fundPhase, setFundPhase] = React.useState('list');
  const [fundId, setFundId] = React.useState(null);
  const [compareIds, setCompareIds] = React.useState([]);
  /* THE FUND A JOURNEY WAS ENTERED WITH. It survives the WHO step, because the advisor named the fund
     before they named the client and a door that drops what you carried through it is not a hand-off.
     It is cleared by a NEW sentence, never by finishing a journey — an advisor who goes back to the
     rail is still working on the fund they came in with. */
  const [carried, setCarried] = React.useState(null);
  /* THE HOLDINGS TURNS, in the order they were asked. A thread is its own tab history: each ask adds a
     turn and scrolling back IS going back, so this is a list and not a mode. `otherId` is the second
     fund an overlap was asked against; null until the picker answers. */
  const [asks, setAsks] = React.useState([]);
  /* The shortlist's view and its typed refinements. Sort and period are held apart from the query for
     the reason the fund page holds them apart: they never change WHICH funds match, only the order and
     the period every figure is read at, and a view that showed up as a filter chip would make the
     count look negotiable. */
  const [query, setQuery] = React.useState(FUND_QUERY);
  const [sort, setSort] = React.useState(null);
  const [period, setPeriod] = React.useState('r5');
  const [refines, setRefines] = React.useState([]);
  const askHoldings = (kind, label) => {
    setAsks((a) => [...a, { kind, otherId: null }]);
    log(`“${label || kind}” — a holdings question, answered as its own turn`, reduced() ? 'fades in' : 'ds-rise · 240ms');
  };
  const scroller = React.useRef(null);
  const card = React.useRef(null);
  const savedScroll = React.useRef(0);
  const traceStart = React.useRef(0);
  const att = useAttachment();
  const log = (what, motion) => onEvent && onEvent(what, motion);

  /* One entry point for every sentence in the product, typed or tapped. */
  const send = (text) => {
    /* EVERY CHIP IS ALSO A SENTENCE. A fund is open and the words are a holdings question, so it is
       answered as one — before the router, which would otherwise read "holdings" as a fund search. */
    if (journey === 'funds' && fundId && holdAsk(text)) { setDraft(''); askHoldings(holdAsk(text), text); return; }
    /* AND A REFINEMENT IS NOT A NEW SEARCH. With the shortlist on screen, "sort by cost" or "under
       0.7%" changes THIS list; sending it back through the router would throw the list away and start
       again, which is the silent rewrite the query chips exist to prevent. */
    if (journey === 'funds' && !fundId) {
      const r = refine(text, FUND_QUERY);
      if (r.kind !== 'miss') {
        setDraft(''); setAsk(text);
        if (r.kind === 'sort') setSort(r.sort);
        else if (r.kind === 'period') setPeriod(r.period);
        else if (r.kind === 'compare') { setFundId(r.ids[0]); setCompareIds([r.ids[1]]); setFundPhase('compare'); }
        else if (r.kind !== 'ambiguous') setQuery((q) => applyRefine(r, q));
        setRefines((a) => [...a, { text, r }]);
        log(`“${text}” → ${r.kind} on the shortlist, not a new search`, '');
        return;
      }
    }
    const r = route(text);
    setAsk(text);
    /* THE WHO GATE, before anything opens. */
    if (r.id in NEEDS_CLIENT) {
      const named = namedClient(text) || client;
      if (!named) {
        setPending(r.id); setJourney('who');
        if (screen !== 'thread') { setDir('forward'); setScreen('thread'); }
        log(`“${text}” → ${r.id}, but no client named`, 'the WHO step — asked once, and never for something already said');
        return;
      }
      setClient(named);
    }
    setJourney(r.id);
    if (r.id === 'funds') { setFundPhase('list'); setFundId(null); setCompareIds([]); setAsks([]); setRefines([]); setSort(null); setPeriod('r5'); setQuery(FUND_QUERY); }
    /* A sentence is a new question. The fund only rides along when a VERB carried it. */
    setCarried(null);
    log(`“${text}” → ${r.id}`, `the router matched: ${r.why}`);
    if (r.id === 'risk' || r.id === 'propose' || r.id === 'rebal' || r.id === 'review') {
      setRailJourney(r.id);
      setDir('forward'); setScreen('rail');
      /* Journey E is a THREAD now, so it does not "open a rail" — it answers. The other three still do. */
      log(r.id === 'rebal'
        ? 'Sentinel answers — where he is, the two moves, what they cost, then the dials; there is no question to ask first'
        : `The rail opens — ${({ propose: 'four steps for a proposal', review: 'one question: what is it for', risk: 'sixteen for a risk profile' })[r.id]}; a journey is its own surface`,
        reduced() ? 'ds-screen-in as a fade · 320ms' : 'ScreenStack forward · 320ms');
      return;
    }
    /* THE EXPLORER IS A SURFACE, LIKE THE RAIL — it brings its own composer and its own app bar, so
       it replaces the phone rather than sitting in a turn. It opens with the sentence already read:
       "what's available in debt" arrives at an explorer whose asset step is answered. */
    if (r.id === 'explore') {
      setDir('forward'); setScreen('explore');
      log('The explorer opens — one screen, four questions, and the sentence is its first answer',
        reduced() ? 'ds-screen-in as a fade · 320ms' : 'ScreenStack forward · 320ms');
      return;
    }
    if (screen !== 'thread') { setDir('forward'); setScreen('thread'); log('Thread in, Home out', reduced() ? 'a fade · 320ms' : 'ScreenStack forward: ds-screen-in over ds-screen-out · 320ms'); }
    if (r.id === 'drift') {
      setPhase('trace'); setArtifact('filling'); setResumeFrom(0); setTraceKey((k) => k + 1); traceStart.current = performance.now();
      log('Trace running — step 1 of 4', `ProgressTrace · ${STEP_MS}ms a step, clock real`);
    }
  };

  /* Picking resumes the journey the advisor asked for — it does not start a new one. */
  const pick = (c) => {
    setClient(c);
    const j = pending;
    const want = NEEDS_CLIENT[j];
    if (want && c.id !== want) {
      /* `pending` is deliberately NOT cleared: the retry chips resume the same journey, and a journey
         the advisor asked for should survive a wrong client. */
      setJourney('nodata');
      log(`Picked ${c.name}, and this build has no ${j} data for them`, 'said out loud rather than opening an empty journey');
      return;
    }
    setPending(null);
    if (j === 'risk' || j === 'propose' || j === 'rebal' || j === 'review') {
      setRailJourney(j === 'risk' ? 'risk' : j); setDir('forward'); setScreen('rail');
      log(`${c.name} bound — the rail opens`, 'ScreenStack forward · 320ms');
      return;
    }
    setJourney(j);
    if (j === 'drift') { setPhase('trace'); setArtifact('filling'); setResumeFrom(0); setTraceKey((k) => k + 1); traceStart.current = performance.now(); }
    log(`${c.name} bound — ${j} resumes`, 'the chip stays in the composer');
  };

  const traceDone = () => {
    setPhase('answer'); setArtifact('filling');
    log('Answer in, artifact filling', reduced() ? 'fades · 240ms' : 'ds-rise 240ms; ds-artifact 300ms then shimmer');
    setTimeout(() => { setArtifact('peek'); log('Breakdown arrived — peek', reduced() ? 'bars drawn full' : 'bars scaleX · 480ms, 60ms stagger'); }, FILL_MS);
  };
  const stop = () => {
    const idx = Math.min(Math.floor((performance.now() - traceStart.current) / STEP_MS), DRIFT_STEPS.length - 1);
    setStoppedAt(idx); setPhase('stopped');
    log(`Stop — frozen at step ${idx + 1} of 4`, 'immediate; the partial trace stays');
  };
  const resume = () => { setResumeFrom(stoppedAt); setTraceKey((k) => k + 1); traceStart.current = performance.now() - stoppedAt * STEP_MS; setPhase('trace'); log(`Continue — from step ${stoppedAt + 1}`, 'the clock restarts at 0 — ProgressTrace cannot resume it, and that is logged, not hidden'); };

  const toggleArtifact = () => {
    const el = scroller.current, c = card.current;
    if (artifact === 'peek') {
      if (el && c) savedScroll.current = el.scrollTop;
      setArtifact('expanded');
      log('Artifact expands in place', reduced() ? 'height only' : 'natural height; chevron 180°; bars 200ms each');
      requestAnimationFrame(() => { if (el && c) el.scrollTo({ top: el.scrollTop + (c.getBoundingClientRect().top - el.getBoundingClientRect().top), behavior: reduced() ? 'auto' : 'smooth' }); });
    } else if (artifact === 'expanded') {
      setArtifact('peek');
      requestAnimationFrame(() => requestAnimationFrame(() => { if (el) el.scrollTo({ top: savedScroll.current, behavior: reduced() ? 'auto' : 'smooth' }); }));
      log('Artifact collapses to its peek', 'the thread scrolls back to the card');
    }
  };

  /* NEW THREAD UNBINDS THE CLIENT — found by driving the whole prototype end to end, 20 Sep 2026.
     Home cleared the journey, the ask, the phase, the artifact and the attachment, and left the bound
     client chip sitting in the composer. So a review of Meera's book, then New thread, then "Sell all
     of Sharma's Quant Small Cap" put the refusal on screen with **Meera Nair** bound above it — a
     sentence about one client carrying another client's name into the next thing the advisor types.
     A bound client is a property of the thread, and this ends the thread. */
  /* The RTA is a real party this build does not talk to, and saying so precisely is the product's own
     discipline: name what the control would do, and what stands between it and doing it. */
  const RTA_SHEET = { title: 'Checking with the RTA', body: [
    'A switch is a redemption and a purchase at the registrar. Checking means asking the RTA whether both legs have settled and what NAV each got.',
    'This build has no RTA connection, so the status you see is the instruction\u2019s own — sent, acknowledged — and not the registrar\u2019s. It will say "sent" whatever the registrar does.',
    'In the real build this is where a settlement failure would surface, and it is the one thing a placed instruction cannot be trusted about until it does.'] };
  const goHome = () => { setDir('back'); setScreen('home'); setJourney(null); setAsk(''); setPhase('trace'); setArtifact('filling'); setClient(null); setPending(null); setShared(false); setNote(false); setSaved({}); setCarried(null); att.clear && att.clear(); log('Back to Home — the thread ends, and the bound client and the carried fund go with it', reduced() ? 'a fade · 320ms' : 'ScreenStack BACK: the same two keyframes, reversed — you came out, not in'); };


  /* The body of the thread is the journey, and nothing else changes. One surface, one composer. */
  /* The shortlist as it stands after every typed command — one value, so the list, the count and the
     chips that open a fund can never disagree. Offering a fund by name that the filters have just
     removed is the same defect as a total that is quietly short. */
  const fundShortlist = sortFunds(fundsFor(query, true), sort, period);
  const body = () => {
    if (journey === 'drift') return (
      <PROTO_R.Fragment>
        {phase === 'trace' && <ProgressTrace key={traceKey} steps={DRIFT_STEPS} reasoning={DRIFT_REASONING} stepMs={STEP_MS} initialActive={resumeFrom} onDone={traceDone} />}
        {phase === 'stopped' && (
          <PROTO_R.Fragment>
            <ProgressTrace key={`s-${traceKey}`} steps={DRIFT_STEPS} reasoning={DRIFT_REASONING} autoplay={false} initialActive={stoppedAt} seconds={Math.max(1, Math.round((stoppedAt + 1) * STEP_MS / 1000))} />
            <SentinelBlock>
              <SentinelText text="Stopped. I kept what I had worked out — I was partway through attributing his drift." />
              <div style={{ marginTop: 'var(--space-12)' }}><AnswerChip label="Continue" variant="primary" onClick={resume} /></div>
            </SentinelBlock>
          </PROTO_R.Fragment>
        )}
        {(phase === 'answer' || phase === 'moves' || phase === 'flight' || phase === 'done') && (
          <PROTO_R.Fragment>
            <ProgressTrace key={`d-${traceKey}`} steps={DRIFT_STEPS} reasoning={DRIFT_REASONING} autoplay={false} initialActive={DRIFT_STEPS.length} seconds={Math.round(DRIFT_STEPS.length * STEP_MS / 1000)} initialCollapsed />
            <AnswerTurn artifact={artifact} view={view} run enter cardRef={card} onToggle={toggleArtifact}
              onShare={() => { setShared(true); log('Share — the draft arrives as an artifact in the thread, not a canvas', reduced() ? 'fades in' : 'ds-rise · 240ms'); }}
              onMenu={() => { setView((v) => (v === 'table' ? 'chart' : 'table')); log('⋯ — the table view every chart owes, in place', ''); }}
              actions={artifact === 'filling' || phase !== 'answer' ? undefined : <AnswerActions animate
                onWhy={() => { setWhy(WHY_71); log('Explainer opens', reduced() ? 'a fade · 300ms' : 'ds-sheet 300ms; scrim to 0.4'); }}
                onHoldings={() => { if (artifact === 'peek') toggleArtifact(); setView('table'); log('“Show the 18 holdings” — the chart’s own table, because his holdings are not in the book', ''); }}
                onRebalance={() => { setPhase('moves'); log('“Rebalance to his mandate” — two moves, and the what-if', reduced() ? 'fades in' : 'ds-rise · 240ms'); }} />} />
          </PROTO_R.Fragment>
        )}
        {/* THE DRAFT IS A TURN, not a second surface. It sits after the answer it was drafted from,
            and it scrolls with it. */}
        {shared && <BORROWED.ShareDraftTurn enter
          onEdit={() => log('Change the wording — the draft is editable in the real build; here it is the pattern', '')}
          onSend={() => { setShared(false); log('Send from WhatsApp — the OS sheet, outside Sentinel. Nothing is sent from here.', ''); }} />}
        {phase === 'moves' && <MovesTurn enter actions={<MovesActions animate
          onSkipped={() => { setWhy({ title: 'Why was the third move skipped?', body: [SKIPPED] }); log('Why one was skipped', 'ds-sheet 300ms'); }}
          onApprove={() => { setConfirm('moves'); log('Confirm sheet opens — the one screen with no composer', reduced() ? 'a fade · 300ms' : 'ds-sheet 300ms; scrim to 0.4'); }} />} />}
        {phase === 'flight' && <ExecutionTurn state="flight" enter />}
        {phase === 'done' && <SuccessTurn enter note={note}
          onCheck={() => { setWhy(RTA_SHEET); log('“Has it settled?” — what checking would do, and why this build cannot', 'ds-sheet 300ms'); }}
          onRead={() => { setNote(true); log('The note to Sharma — drafted, not sent', reduced() ? 'fades in' : 'ds-rise · 240ms'); }}
          onDrop={() => { setNote(false); log('Draft dropped — nothing was sent, so nothing is undone', ''); }}
          onBack={() => send("Review Sharma's portfolio")} />}
      </PROTO_R.Fragment>
    );
    /* THE EXPLORER IS NOT A TURN — it is `screen === 'explore'`, below. Returning it from here drew
       the whole phone twice: its own status bar, app bar, composer and home indicator inside the
       thread's, which already had all four. A component that renders a ScreenScaffold is a surface,
       and a surface belongs in the ScreenStack. */
    if (journey === 'funds') return (
      <PROTO_R.Fragment>
        <FundResults funds={fundShortlist} period={period} openRow={null}
          onExplain={() => log('A fund’s own explainer', '')} />
        {/* What the advisor typed, and what it did to the list — each one its own turn, because a
            shortlist that quietly rewrote itself is one nobody can defend. Each ARRIVES, so each
            carries `ds-rise`: the system has one keyframe for a turn appearing and this thread was
            using it on three turns out of twenty. */}
        {refines.map((x, i) => (
          <PROTO_R.Fragment key={i}>
            <UserTurn text={x.text} editable={false} actions={false} />
            {x.r.kind === 'miss' ? <SentinelTurn enter say={REFINE_MISS.body}
                chips={<PROTO_DS.ChipRow>{REFINE_MISS.chips.map((c) => <AnswerChip key={c} label={c} onClick={() => send(c)} />)}</PROTO_DS.ChipRow>} />
              : x.r.kind === 'ambiguous' ? <SentinelTurn enter say={refineAmbiguous(x.r).body}
                chips={<PROTO_DS.ChipRow>{refineAmbiguous(x.r).chips.map((c) => <AnswerChip key={c} label={c} onClick={() => send(`add ${c}`)} />)}</PROTO_DS.ChipRow>} />
              : <SentinelTurn enter say={refineSaid(x.r, period, fundShortlist)} />}
          </PROTO_R.Fragment>
        ))}
        {/* The shortlist offers the funds by NAME, because in a thread "open a fund" is a question you
            ask, not a row you click into a page. Two, not four: the chips answer the sentence Sentinel
            just said ("two of them clear it comfortably"). */}
        {fundPhase === 'list' && (
          <PROTO_DS.ChipRow>
            {fundShortlist.slice(0, 2).map((f) => (
              <AnswerChip key={f.id} label={f.name} onClick={() => {
                setFundId(f.id); setFundPhase('fund');
                log(`Opened ${f.name} — the fund's page arrives as a turn, not as a screen`, reduced() ? 'fades in' : 'ds-rise · 240ms');
              }} />
            ))}
          </PROTO_DS.ChipRow>
        )}
        {fundPhase === 'fund' && fundId && (
          <PROTO_R.Fragment>
            <BORROWED.FundInfo id={fundId} enter onExplain={() => log('A figure explains itself', 'ds-sheet 300ms')} />
            {/* THE FOUR ASKS are questions ABOUT the fund; the four verbs below DO something with it.
                Two rows, so an advisor reads four to find either. All four open a turn now — the
                three that used to answer "not built yet" are the last of plan §2. */}
            <PROTO_DS.ChipRow animate>
              {FUND_CHIPS.map((c) => (
                <AnswerChip key={c} label={c} onClick={() => askHoldings(ASK_KINDS[c], c)} />
              ))}
            </PROTO_DS.ChipRow>
            <BORROWED.FundVerbs animate onVerb={(v) => {
              if (v.id === 'compare') {
                setFundPhase('pick');
                log('“Compare with…” — the same searchable list the WHO step uses', '');
                return;
              }
              /* THE THREE HAND-OFFS GO THROUGH THE SAME QUESTION EVERY OTHER JOURNEY DOES. The fund
                 explorer is the one surface that does not already know the client, so the verb sets
                 the pending journey and the WHO step answers it — the verbs do not each invent a
                 picker. `send` is not used: the advisor did not type a sentence, they tapped a verb
                 on a fund, and routing a synthesised sentence back through the router would be the
                 product pretending it had been asked. */
              setCarried(fundId);
              const named = client;
              if (!named) {
                setPending(v.journey); setJourney('who');
                log(`“${v.label}” on ${fundById(fundId).name} → ${v.journey}, but no client named — the fund is held and comes with you`, 'the WHO step');
                return;
              }
              setRailJourney(v.journey); setJourney(v.journey);
              setDir('forward'); setScreen('rail');
              log(`“${v.label}” on ${fundById(fundId).name} → journey ${v.journey.toUpperCase()}, with ${named.name} already bound`, reduced() ? 'ds-screen-in as a fade · 320ms' : 'ScreenStack forward · 320ms');
            }} />
          </PROTO_R.Fragment>
        )}
        {fundPhase === 'fund' && asks.map((a, i) => (
          <BORROWED.HoldingsTurn key={i} enter kind={a.kind} id={fundId} otherId={a.otherId} onEvent={log}
            onChip={(kind, label) => askHoldings(kind, label)}
            onPick={(other) => { setAsks((list) => list.map((x, j) => (j === i ? { ...x, otherId: other } : x))); log(`Overlap against ${fundById(other).name}`, 'the picker becomes the answer, in place'); }} />
        ))}
        {fundPhase === 'pick' && (
          <BORROWED.ComparePicker exclude={[fundId, ...compareIds]} onEvent={log}
            onPick={(id) => {
              setCompareIds((c) => (c.length ? [...c, id] : [id]));
              setFundPhase('compare');
            }} />
        )}
        {fundPhase === 'compare' && (
          <BORROWED.FundCompare enter ids={[fundId, ...compareIds]}
            onAdd={() => { setFundPhase('pick'); log('Add a third — the picker comes back, minus the two already in', ''); }}
            onRemove={(id) => { setCompareIds((c) => c.filter((x) => x !== id)); log('Dropped one — the comparison re-lays out; nothing slides', ''); }}
            onChip={(c) => {
              if (c === 'Add a third') { setFundPhase('pick'); return; }
              /* ANSWERABLE FROM THE BOOK, SO ANSWERED. The riskometer beside the client's number, and
                 the rule that follows — never a recommendation. */
              if (/suits a/i.test(c)) { setWhy(suitsBody([fundId, ...compareIds])); log(`“${c}” — the riskometer beside the number`, 'ds-sheet 300ms'); return; }
              if (/save this comparison/i.test(c)) { log('Saving a comparison is not built — the ledger holds instructions, not comparisons', ''); return; }
              log(`“${c}” — not built in this prototype`, '');
            }} />
        )}
      </PROTO_R.Fragment>
    );
    if (journey === 'ledger') return <LedgerArtifact onDownload={() => { log('CSV — the control holds its own loading state, because this product has no toasts', 'DownloadAction, on itself'); return new Promise((r) => setTimeout(r, 900)); }} />;
    if (journey === 'who') return CLIENTS.length
      ? <WhoPicker journey={pending} onPick={pick} onEvent={log} />
      : <WhoEmpty journey={pending} />;
    if (journey === 'nodata') return (
      <SentinelBlock>
        <SentinelText text={`I have ${client ? client.name : 'that client'} on your book, and not the statement this needs.`} />
        <div style={{ marginTop: 'var(--space-10)' }}>
          <SentinelText weight="Regular" text="This build carries one statement each for Sharma, Meera and Amit. Pick one of those, or attach the statement and I will read it." />
        </div>
        <div style={{ marginTop: 'var(--space-12)' }}>
          <PROTO_DS.ChipRow>{['R. Sharma', 'Meera Nair', 'Mr. Amit Aggrawal'].map((n) => (
            <AnswerChip key={n} label={n} onClick={() => pick(CLIENTS.find((x) => x.name === n))} />
          ))}</PROTO_DS.ChipRow>
        </div>
      </SentinelBlock>
    );
    if (journey === 'caps') return <CapabilitiesTurn enter onAsk={(q) => send(q)} />;
    if (journey === 'who') return <RefusalTurn enter body={DISAMBIGUATE.body} chips={DISAMBIGUATE.chips} onChip={send} />;
    if (journey === 'over') return <RefusalTurn enter body={BUCKET_2.body} chips={BUCKET_2.chips} onChip={send} />;
    if (journey === 'outside') return <RefusalTurn enter body={BUCKET_5.body} chips={BUCKET_5.chips} onChip={send} />;
    if (journey === 'miss') return <RefusalTurn enter body={BUCKET_4.body} chips={BUCKET_4.chips} onChip={send} />;
    if (journey === 'act') return (
      <SentinelBlock>
        <SentinelText text={BUCKET_6.body} />
        <div style={{ marginTop: 'var(--space-12)' }}><ConstraintCallout eyebrow="Would run" body={BUCKET_6.preview} /></div>
        <div style={{ marginTop: 'var(--space-12)' }}><AnswerChip label={BUCKET_6.chip} variant="primary" onClick={() => { setConfirm('moves'); log('Even a typed instruction goes through the confirm sheet', 'ds-sheet 300ms'); }} /></div>
      </SentinelBlock>
    );
    return null;
  };

  const thread = (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Thread scrollRef={scroller} revision={`${journey}-${phase}-${artifact}-${!!att.file}`}
        onMenu={() => { setMenu(true); log('Menu opens', reduced() ? 'the panel fades in · 320ms' : 'panel translateX −100% → 0 · 320ms; scrim to 0.25'); }}
        onNew={goHome}
        composer={<PROTO_DS.Composer value={draft} onChange={setDraft} placeholder="Ask Sentinel" streaming={journey === 'drift' && phase === 'trace'}
          bound={<WhoBound client={client} onClear={() => { setClient(null); log('Client unbound', 'the next question asks who again'); }} />}
          onStop={stop} onSend={(t) => { setDraft(''); send(t || draft); }} onAttach={att.onAttach} />}>
        {/* The same UserTurn on every screen in the product: the last prompt is editable wherever editing
            it is a real thing to do, and sending the edit replaces what is below it — which the cost line
            says out loud before it happens. */}
        <UserTurn text={ask} busy={journey === 'drift' && phase === 'trace'}
          costNote={phase === 'answer' || journey !== 'drift' ? 'Sending this replaces the answer below it.' : undefined}
          onCancel={() => log('Edit cancelled — nothing was discarded', '')}
          onSave={(next) => { log('Edit sent — the answer below it is replaced, as the line said', 'the turn re-runs'); send(next); }} />
        {body()}
        <AttachmentTurn file={att.file} caption="Here is his Q3 statement." onRemove={att.clear} />
      </Thread>
    </div>
  );

  const home = <Home hour={15} time="3:04"
    onMenu={() => { setMenu(true); log('Menu opens', 'panel 320ms; scrim to 0.25'); }}
    onAttach={(f) => { att.onAttach(f); setAsk('Read this and tell me what moved.'); setJourney('drift'); setDir('forward'); setScreen('thread'); setPhase('answer'); setArtifact('peek'); log(`Attached ${f.name} on Home — it opens a thread with the file in it`, 'ScreenStack forward · 320ms'); }}
    onRow={(label) => send(label)} onStarter={(c) => send(c)} onSend={send} />;

  /* THE EXPLORER — the same component its own board mounts, not a copy, so a fix there is a fix here.
     It is a SURFACE: it brings its own app bar and its own composer, which is why it sits in the
     ScreenStack beside home and the rail rather than inside the thread. Two things the board cannot do
     and the app can: the menu is the real drawer, and "Add to a proposal" opens journey D carrying the
     fund, through the same `carried` hand-off a fund's own journey makes. */
  const explore = <Funnel key={ask} startAsk={ask} onNew={goHome}
    onMenu={() => { setMenu(true); log('Menu opens from the explorer — the same door as everywhere else', 'panel 320ms; scrim to 0.25'); }}
    onHandOff={(what, fid, name) => {
      setCarried(fid);
      setRailJourney(what === 'proposal' ? 'propose' : 'rebal');
      setJourney(what === 'proposal' ? 'propose' : 'rebal');
      setAsk(`Add ${name} to a ${what === 'proposal' ? 'proposal' : 'rebalance'}`);
      setDir('forward'); setScreen(what === 'proposal' ? 'rail' : 'thread');
      log(`“${name}” handed from the explorer to journey ${what === 'proposal' ? 'D' : 'E'} — the fund rides along, the shelf does not`,
        reduced() ? 'ds-screen-in as a fade · 320ms' : 'ScreenStack forward · 320ms');
    }} />;

  /* The rail leaves by the same two doors as everything else — the menu's "Back to home", or a new
     thread. There is no back arrow in this product and the prototype does not invent one. */
  /* ONE RAIL, TWO JOURNEYS. The steps and the result are arguments, so the loop that decides what
     "edit answer 3" does exists once. The way out is the same two doors as every other surface. */
  const railMenu = () => { setMenu(true); log('Menu opens from the rail — the way out is the same door as everywhere else', 'panel 320ms; scrim to 0.25'); };
  const rail = railJourney === 'review'
    ? <LiveRail steps={REV_STEPS} total={REV_TOTAL} attachCaption="Here is her September statement."
        lead={carried ? <BORROWED.RevCarried fundId={carried} /> : null}
        onEvent={log} onNew={goHome} onMenu={railMenu}
        onAnswer={(step, chip) => { if (chip.audience) { setAudience(chip.audience); log(`Review is for: ${chip.label}`, 'the card does not change — only what follows it'); } }}
        result={() => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack)' }}>
            <BORROWED.ReviewResult state={saved.review ? 'saved' : 'draft'} savedAt={saved.review}
              onExplain={(x) => { setWhy(x); log(`“${x.title}” — the figure explains itself`, reduced() ? 'a fade · 300ms' : 'ds-sheet 300ms; scrim to 0.4'); }}
              onSave={saveIt('review', 'Saved to her file')}
              onDownload={() => { log('PDF — no file is written', 'DownloadAction, on itself'); return new Promise((r) => setTimeout(r, 900)); }} />
            {/* A REVIEW'S ENDING CHIPS ARE SENTENCES, so they go through the router like any other.
                One that reaches a journey opens it; one that does not says so, by name. */}
            {audience && <BORROWED.ReviewEnding audience={audience} onChip={(l) => { if (route(l)) { send(l); return; } log(`“${l}” — not built in this prototype`, ''); }} />}
          </div>
        )} />
    : railJourney === 'rebal'
    /* JOURNEY E IS A THREAD, NOT A RAIL (20 Sep 2026). It was a rail because it opened with a question —
       how far — and a rail is the surface for a question Sentinel must ask before it can answer. It can
       answer: it recommends the move it can cost, and the two rules it cannot are dials underneath. So
       there is nothing to ask, and nothing for a rail to carry. `railJourney` still routes it, because
       that is how `send` classifies the sentence; only the surface changed. */
    ? <Thread anchor={rebalPicked || uncosted ? 'bottom' : 2} revision={`rebal-${rebalPicked}-${uncosted ? uncosted.id : ''}-${!!att.file}`}
        scrollRef={scroller} onMenu={railMenu} onNew={goHome}
        composer={<PROTO_DS.Composer value={draft} onChange={setDraft} placeholder="Ask Sentinel" onSend={(t) => { setDraft(''); send(t || draft); }} onAttach={att.onAttach} />}>
        <UserTurn text={ask} costNote="Sending this replaces the plan below it."
          onCancel={() => log('Edit cancelled — nothing was discarded', '')}
          onSave={(next) => { log('Edit sent — the plan below it is replaced', 'the turn re-runs'); send(next); }} />
        {carried && <BORROWED.RebCarried fundId={carried} />}
        {rebalPicked
          /* Saved or approved, the plan becomes the ARTIFACT an advisor keeps — ResultCard, with its
             provenance, a Save, a Download and exactly ONE approve. */
          ? <RebalanceResult state={saved.rebal ? 'saved' : 'draft'} savedAt={saved.rebal}
              onSave={saveIt('rebal', 'Saved the plan — it exists; nothing is placed')}
              onDownload={() => { log('PDF — the control holds its own loading state; no file is written', 'DownloadAction, on itself'); return new Promise((r) => setTimeout(r, 900)); }}
              onPrimary={() => { setConfirm('moves'); log('Approve — the same sheet, the same disclosure and the same three rows as Journey B, because it is the same money', 'ds-sheet 300ms'); }} />
          : <BORROWED.RebalanceAnswer
              /* NO APPROVE WHILE AN UNCOSTED MOVE IS ON SCREEN. The CTA commits the two costed moves,
                 not the dial just asked for — but it sat ABOVE the refusal, so an advisor reading
                 "Inside the band: I cannot cost it" had an Approve in view. Found by driving it.
                 The refusal's own "Take the one I can cost" is the way back, and it brings the CTA
                 with it. The journey's argument is that there is no path from an uncosted move to a
                 confirm sheet; this is the screen keeping it rather than the code claiming it. */
              onApprove={uncosted ? undefined : () => { setRebalPicked(true); log('Approve — the plan becomes the artifact, then the confirm', reduced() ? 'fades in' : 'ds-rise · 240ms'); }}
              onDial={(d) => {
                if (d.id === 'why') { setWhy({ title: 'Why these two moves?', body: [SKIPPED] }); log('Why these two — the explainer', 'ds-sheet 300ms'); return; }
                if (d.id === 'fund') { log('“Move into a different fund” — the fund picker, not built on this route yet', ''); return; }
                /* The two rules Sentinel cannot cost. Sized, refused a figure, and the nearest real
                   thing offered — and there is no path from here to a confirm sheet. */
                const t2 = REBALANCE_TARGETS.find((x) => x.id === d.id);
                setUncosted(t2);
                log(`“${d.label}” is sized and not costed — and there is no path from it to a confirm sheet`, '');
              }} />}
        {uncosted && !rebalPicked && (
          <UncostedTurn target={uncosted}
            onChip={(l) => { if (/can cost/.test(l)) { setUncosted(null); log('Back to the one with a cost', ''); } else log(`“${l}” — this build has no RTA`, ''); }} />
        )}
        <AttachmentTurn file={att.file} caption="Here is his Q3 statement." onRemove={att.clear} />
      </Thread>
    : railJourney === 'propose'
    ? <LiveRail steps={PROP_STEPS} total={PROP_TOTAL} attachCaption="Here is the mandate he signed."
        lead={carried ? <BORROWED.PropCarried fundId={carried} /> : null}
        onEvent={log} onNew={goHome} onMenu={railMenu}
        result={() => <ProposalResult state={saved.propose ? 'saved' : 'draft'} savedAt={saved.propose}
          onSave={saveIt('propose', 'Saved — version 4 exists; nobody has seen it')}
          onDownload={() => { log('PDF — the control holds its own loading state; no file is written', 'DownloadAction, on itself'); return new Promise((r) => setTimeout(r, 900)); }}
          onPrimary={() => { setConfirm('propose'); log('Send opens the confirm — and the disclosure is the whole journey: it places nothing', 'ds-sheet 300ms'); }} />} />
    : <LiveRail onEvent={log} onNew={goHome} onMenu={railMenu} />;

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <ScreenStack screen={screen} direction={dir} render={(s) => (s === 'home' ? home : s === 'rail' ? rail : s === 'explore' ? explore : thread)}
        onSettle={(to, from) => log(`Settled on ${to}`, `${from} unmounted after --dur-screen`)} />
      <ExplainerSheet open={!!why} title={(why || {}).title || ''} body={(why || {}).body || []} onClose={() => { setWhy(null); log('Explainer closes — focus returns to the chip', 'immediate'); }} />
      {/* BOTH CONFIRM SHEETS MOUNT HERE, above the ScreenStack, because a confirm is a SURFACE and not
          part of the screen that opened it. The moves sheet lived inside the thread's tree until Journey
          E reached it from the RAIL and nothing happened — the state changed and the sheet was not
          mounted on that screen. A sheet that only exists on one of the two screens that can open it is
          a sheet that works by luck. Same component, opposite disclosures: one places money, one sends a
          document that places nothing. */}
      <ConfirmSheet open={confirm === 'moves'} title="Approve · R. Sharma" disclosure={CONFIRM_DISCLOSURE} rows={CONFIRM_ROWS}
        commitLabel="Approve both moves"
        onCommit={() => { setConfirm(null); setPhase('flight'); setRebalPicked(false); if (railJourney === 'rebal') { setDir('back'); setScreen('thread'); setJourney('drift'); } log('Approved — in flight', 'the sheet closes; the thread takes over'); setTimeout(() => { setPhase('done'); log('Placed — both moves, with their references', reduced() ? 'the check is drawn' : 'DrawnCheck · ds-draw'); }, 1400); }}
        onClose={() => { setConfirm(null); log('Dismissed — nothing was placed', 'the sheet closes'); }}>
        {MOVES.map((m) => <MoveCard key={m.n} n={m.n} title={m.title} body={m.body} />)}
      </ConfirmSheet>
      <ConfirmSheet open={confirm === 'propose'} title="Send · Mr. Amit Aggrawal" disclosureEyebrow="Before you send"
        disclosure={PROP_DISCLOSURE} rows={PROP_CONFIRM_ROWS} commitLabel="Send the proposal"
        onCommit={() => { setConfirm(null); log('Sent — the document has gone and nothing has been placed', 'the sheet closes; a drawn check in the turn'); }}
        onClose={() => { setConfirm(null); log('Dismissed — nothing was sent', 'the sheet closes'); }}>
        <SentinelText weight="Regular" text="He has seen version 2. This is version 3, with the mid-cap trimmed." />
      </ConfirmSheet>
      <Drawer open={menu} onClose={() => { setMenu(false); log('Menu closes', 'immediate'); }} onNew={() => { setMenu(false); goHome(); }}
        saved={MENU_SAVED} recent={MENU_RECENT} clients={MENU_CLIENTS}
        footer={<MenuFooter onHome={() => { setMenu(false); goHome(); }} />} />
      {/* THREE KEYS THE PANEL READS AND NOBODY SENT (23 Sep 2026). `affordances` branches on `carried`,
          `uncosted` and `fundPhase`; none of the three was in this object, so "the fund came with you
          from the explorer", the uncosted rule's two exits and every one of journey C's four states
          were unreachable lines in a function whose whole claim is that it IS the screen's control
          list. Found by wiring the explorer's hand-off, which sets `carried`. */}
      <Bridge state={{ screen, journey, phase, artifact, railJourney, rebalPicked, audience, carried, uncosted, fundPhase }} />
    </div>
  );
}

/* The phone tells the panel what it knows, without the panel reaching into the phone's state. */
const StateBus = React.createContext(null);
function Bridge({ state }) {
  const set = React.useContext(StateBus);
  React.useEffect(() => { if (set) set(state); }, [state.screen, state.journey, state.phase, state.artifact, state.railJourney, state.rebalPicked, state.audience, state.carried, state.uncosted && state.uncosted.id, state.fundPhase]);
  return null;
}


/* Published on `window` as well as left in scope, so a page can read them either way — the
   convention every other screen module in here follows. */
Object.assign(window, { Proto, StateBus, Bridge, route, ROUTES, affordances, namedClient, NEEDS_CLIENT });
