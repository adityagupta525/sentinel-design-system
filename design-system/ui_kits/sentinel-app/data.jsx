/* Demo data lifted from src/screens + src/journeys.tsx. Demo only — no real client. */
window.DS = window.SentinelDesignSystem_0682a2;
window.KIT = {
  suggestions: ['Show me Diwali offer from HDFC AMC', 'Build a proposal for Mr. Amit Aggrawal', "Why did Sharma's portfolio drift this quarter?"],
  chips: ['Review a portfolio', 'Proposal', 'Fund explorer'],
  jump: [
    { label: "Meera's risk profile", meta: '12 questions', go: 'journey' },
    { label: '₹25 L proposal', meta: '6 funds', go: 'proposal' },
    { label: 'What Meera holds', meta: '43 funds', go: 'portfolio' },
    { label: "Sharma's rebalance", meta: '2 moves', go: 'chat' },
  ],
  alloc: [{ label: 'Equity', value: 71, color: 'var(--color-bronze)' }, { label: 'Debt', value: 24, color: 'var(--color-alloc-debt)' }, { label: 'Cash', value: 5, color: 'var(--color-bubble-edge)' }],
  drift: [{ label: 'Small-cap rally', value: 6.1, note: 'the market, not a decision of yours' }, { label: 'His July top-up', value: 2.0, note: 'went into Quant Small Cap' }, { label: 'Funds crept up-cap', value: 0.9, note: 'managers drifted toward large caps' }],
  holdings: [['HDFC Flexi Cap', 34, true], ['Axis Bluechip', 19, true], ['SBI Corporate Bond', 18, false], ['ICICI Balanced Adv.', 14, false], ['Parag Parikh Flexi', 10, false], ['Cash & liquid', 5, false]],
  proposal: [['Parag Parikh Flexi Cap', 'Flexi cap', '22%', '₹5,50,000'], ['HDFC Large Cap', 'Large cap', '18%', '₹4,50,000'], ['Motilal Oswal Midcap', 'Mid cap', '10%', '₹2,50,000'], ['Nippon Small Cap', 'Small cap', '5%', '₹1,25,000'], ['ICICI Corporate Bond', 'Debt', '30%', '₹7,50,000'], ['SBI Liquid', 'Liquid', '15%', '₹3,75,000']],
  history: ['R. Sharma — portfolio drift', 'Mr. Amit Aggrawal — proposal draft', 'HDFC Diwali offer', 'Meera Nair — Q3 review'],
  clients: ['Meera Nair', 'Mr. Amit Aggrawal', 'Sunita Nair', 'R. Sharma'],
  risk: [
    { q: 'How old is Meera?', short: 'How old is Meera?', chips: [['Use her KYC age — 38', 'smart'], ['Type it instead']], composer: 'or type an age' },
    { q: 'How steady is her income?', short: 'How steady is her income?', chips: [['Fixed salary'], ['Salary plus bonus'], ['Own business'], ['Freelance, varies'], ['Rent or pension']] },
    { q: 'What does she earn a month?', short: 'What does she earn a month?', chips: [['From her last ITR — ₹1,80,000', 'smart'], ['₹1,50,000'], ['₹2,00,000']], money: true },
    { q: 'How much has she kept aside for emergencies?', sub: 'Money she could reach by tomorrow.', short: 'How much for emergencies?', chips: [['₹3,00,000'], ['₹6,00,000'], ['₹10,00,000']], money: true },
    { q: 'The last time markets fell 20% or more — what did she actually do?', sub: 'What she did, not what she says she would do.', short: 'The last 20% fall — what did she do?', chips: [['Invested more'], ['Stayed put'], ['Sold some'], ['Sold everything']] },
  ],
};
window.card = { width: '100%', borderRadius: 16, background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', boxSizing: 'border-box' };
window.f = (w, s, l, c) => ({ fontFamily: 'var(--font-ui)', fontWeight: w, fontSize: s, lineHeight: l ? l + 'px' : 'normal', color: c || 'var(--color-ink)', margin: 0 });