/* Journey B — R. Sharma only. Copy verbatim from Sentinel_v2_Spec §3.2 and the pattern plates. */
window.DS = window.SentinelDesignSystem_0682a2;
window.B = {
  query: "Why did Sharma's portfolio drift this quarter?",
  thinkingLine: 'Comparing 30 Jun against today across 18 holdings…',
  steps: ["Reading Sharma's holdings — 18 funds", 'Comparing against his mandate', 'Checking Q2 statements', 'Attributing the drift'],
  reasoning: 'Equity moved from 62% to 71% against a 60% target. Three inputs contributed; only one was a decision of yours.',
  answer: 'Equity went from 62% to 71% against a 60% target. Three things moved it, and only one of them was a decision.',
  cardEyebrow: 'Drift attribution · Q2 → Q3',
  cardTitle: '62% → 71%, mostly the market',
  provenance: 'As of 30 Sep · from his Q3 statement and mandate on file',
  canvasTitle: "What moved Sharma's equity",
  contributions: [
    { label: 'Small-cap rally', value: 6.1, note: 'the market, not a decision of yours' },
    { label: 'His own top-up in July', value: 3.4, note: 'went into Quant Small Cap' },
    { label: 'Your 4 Aug switch out', value: -1.2, note: 'this one was intentional', intentional: true },
    { label: 'Debt fund NAV drift', value: 0.7 },
  ],
  verdict: 'Two-thirds of the drift is the small-cap rally. You did not cause this, and selling into it has a cost — that is the trade-off below.',
  followUpQ: 'What would fixing it cost?',
  followUpA: 'Two moves, not seven. This alone brings equity from 71% back to 58%, and it costs ₹11,200.',
  moves: [
    { n: 1, title: 'Move ₹1,85,000 out of Quant Small Cap', body: 'Into ICICI Corporate Bond. Brings equity from 67% to 58%.' },
    { n: 2, title: 'Redirect her ₹30,000 monthly SIP', body: 'No exit load, no tax, and it stops the drift returning.' },
  ],
  costs: [
    { dir: 'down', label: 'Exit load', value: '₹0' },
    { dir: 'down', label: 'Short-term capital gains', value: '₹11,200' },
    { dir: 'eq', label: 'Total to fix now', value: '₹11,200' },
  ],
  confirmDisclosure: 'Sharma receives this under your ARN. He will see both switches, the new SIP destination and the disclosure — not your working, or the sixteen trades screened out.',
  /* A rebalance checks different things from a proposal — the single-fund ceiling was answered upstream. */
  compliance: [
    { label: 'Mandate after these moves', value: 'Equity 58% · within band', tone: 'ok' },
    { label: 'Exit load and tax', value: '₹11,240', tone: 'ok' },
    { label: 'Client consent', value: 'Required', tone: 'over' },
  ],
  draft: {
    eyebrow: 'Message draft · 1 recipient',
    title: 'Why your equity moved',
    body: "Hello Mr. Sharma — your equity share moved from 62% to 71% this quarter. Most of that was the small-cap rally rather than anything we changed; your own top-up in July added to it. I have proposed two switches to bring it back to the 60% we agreed, and I will walk you through both.",
    recipient: 'R. Sharma · WhatsApp',
  },
  successTitle: 'Two moves queued',
  successMeta: 'Placed 16 Sep, 9:41 · settles T+2',
  successBody: 'Sharma gets a note explaining both moves. Nothing else in his book changed.',
  suggestions: ['Show me Diwali offer from HDFC AMC', 'Build a proposal for Mr. Amit Aggrawal', "Why did Sharma's portfolio drift this quarter?"],
  homeChips: ['Review a portfolio', 'Proposal', 'Fund explorer'],
  jump: [{ label: "Meera's risk profile", meta: '12 questions' }, { label: '₹25 L proposal', meta: '6 funds' }, { label: 'What Meera holds', meta: '43 funds' }, { label: "Sharma's rebalance", meta: '2 moves' }],
};
/* One context-keyed placeholder map — the composer law, enforced in one place (§ readme placement law). */
window.PLACEHOLDER = {
  home: 'Ask Sentinel about a client, a fund, or a plan',
  thread: 'Ask Sentinel',
  answering: 'or type your answer',
  amount: 'or type an amount',
  canvas: 'Ask about this',
  expanded: 'Ask about this',
  sheet: 'Ask a follow-up',
  drawer: 'Ask Sentinel',
  streaming: 'Generating…',
  result: 'Ask about this',
};
window.f = (weight, size, lh, color) => ({ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: weight, fontSize: size, lineHeight: lh ? lh + 'px' : 'normal', color: color || 'var(--color-ink)' });
window.cardS = { width: '100%', borderRadius: 16, background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', boxSizing: 'border-box' };