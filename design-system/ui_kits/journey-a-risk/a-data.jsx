/* Journey A — Meera Nair only. Copy verbatim from src/journeys.tsx (Risk / 01 … Risk / 16).
   Sixteen steps = intro + twelve questions + two interjections + the result. */
window.DS = window.SentinelDesignSystem_0682a2;
const q = (n, sentinel, chips, opts = {}) => ({ n, sentinel, chips, ...opts });
window.A = {
  intro: {
    provenance: 'As of 15 Sep · from her account record and September statement',
    lines: ['Meera Nair, 38, Kochi. Your client since 2019. ₹18.4 L across 43 funds.', 'Her risk profile was never completed, so nothing after it can be checked against anything. Let us fix that first — twelve short questions, mostly one tap each.'],
    chips: [["Let's go", 'primary'], ['Why twelve questions?', 'tertiary'], ['Skip to the result', 'muted']],
  },
  steps: [
    q(1, 'How old is Meera?', [['Use her KYC age — 38', 'smart'], ['Type it instead']], { composer: 'or type an age', short: 'How old is Meera?', answer: 'Use her KYC age — 38' }),
    q(2, 'How steady is her income?', [['Fixed salary'], ['Salary plus bonus'], ['Own business'], ['Freelance, varies'], ['Rent or pension']], { short: 'How steady is her income?', answer: 'Freelance, varies', subtitled: true }),
    q(3, 'What does she earn a month?', [['From her last ITR — ₹1,80,000', 'smart'], ['₹1,50,000'], ['₹2,00,000']], { money: true, short: 'What does she earn a month?', answer: '₹1,80,000', parse: 'understood as ₹1,80,000' }),
    q(4, 'And what does she spend a month?', [['₹75,000'], ['₹95,000'], ['₹1,20,000']], { money: true, short: 'And what does she spend a month?', answer: '₹95,000' }),
    q(5, 'How much has she kept aside for emergencies?', [['₹3,00,000'], ['₹6,00,000'], ['₹10,00,000']], { sub: 'Money she could reach by tomorrow.', money: true, short: 'How much for emergencies?', answer: '₹6,00,000' }),
    q(6, 'How many people depend on this income?', [['Nobody'], ['1'], ['2'], ['3'], ['4 or more']], { short: 'How many people depend on this?', answer: '2' }),
    q(7, 'When will she need this money?', [['Within a year'], ['1 to 3 years'], ['3 to 7 years'], ['7 to 15 years'], ['More than 15 years']], { short: 'When will she need this money?', answer: '7 to 15 years' }),
    q(8, 'What is she saving towards, in rupees?', [['₹50 lakh'], ['₹1 crore'], ['₹2 crore'], ["She isn't sure yet", 'muted']], { sub: 'Without a figure we cannot work out the return she needs, and the risk number.', money: true, short: 'What is she saving towards?', answer: '₹2 crore' }),
    q(9, 'The last time markets fell 20% or more — what did she actually do?', [['Invested more'], ['Stayed put'], ['Sold some'], ['Sold everything']], { sub: 'What she did, not what she says she would do.', short: 'The last 20% fall — what did she do?', answer: 'Stayed put' }),
    q(10, 'How big a fall could she sit through without calling you?', [['Almost none'], ['About 10%'], ['About 20%'], ['About 30%'], ['More than that']], { short: 'How big a fall could she sit through?', answer: 'About 20%' }),
    q(11, 'What is she asking this money to do?', [['Protect it'], ['Give steady income'], ['Grow steadily'], ['Grow it properly'], ['Push for the most']], { short: 'What is this money asked to do?', answer: 'Grow steadily' }),
    q(12, 'How well does she understand what she holds?', [['New to this'], ['Knows the basics'], ['Fairly experienced'], ['Works in finance']], { sub: 'This limits how complicated the portfolio may get — not how much risk she takes.', short: 'How well does she understand it?', answer: 'Knows the basics' }),
  ],
  reflect1: { after: 5, text: 'That is about six months of her spending. Comfortable — it means a fall in the market will not force her to sell.' },
  reflect2: { after: 9, text: 'Good — that is the most useful answer in the whole set. Saying you can handle a fall and living through one are different things.' },
  subtitles: { 'Fixed salary': 'Same every month', 'Salary plus bonus': 'Most of it fixed, some of it not', 'Own business': 'Draws a variable amount from profits', 'Freelance, varies': 'Income swings more than 25% month to month', 'Rent or pension': 'Fixed, and not tied to her working' },
  result: {
    lines: ['We score three things and take the lowest: what her finances can absorb (71), what she can sit through calmly (54) and what her ₹2 crore goal needs (62).', 'The lowest is what binds. She is a 54, Moderate — her finances could carry more, but she would not sleep through it.'],
    chips: [['How is 54 worked out?', 'tertiary'], ['Share with Meera on WhatsApp', 'outline']],
    cta: 'Build her a portfolio',
    meters: [{ label: 'What her finances can absorb', value: 71 }, { label: 'What she can sit through calmly', value: 54, binding: true }, { label: 'What her ₹2 crore goal needs', value: 62 }],
  },
};
window.PLACEHOLDER = { thread: 'Ask Sentinel', answering: 'or type your answer', amount: 'or type an amount', result: 'Ask about this' };
window.f = (weight, size, lh, color) => ({ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: weight, fontSize: size, lineHeight: lh ? lh + 'px' : 'normal', color: color || 'var(--color-ink)' });
window.cardS = { width: '100%', borderRadius: 16, background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)', boxSizing: 'border-box' };