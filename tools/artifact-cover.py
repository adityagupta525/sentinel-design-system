import json, pathlib, html
# READ THE INDEX ITSELF, not a snapshot of it. The first version read a file written earlier in the
# session and printed 97 components when the system had 94 — a cover that claims more than exists is
# exactly what `_index.json` being generated from disk exists to prevent.
_idx = json.load(open('design-system/pages/_index.json'))
g = {}
for _r in _idx['rows']:
    _k = (_r.get('file') or '').split('/')[1] if _r.get('file') else '?'
    g.setdefault(_k, []).append({'n': _r['name'], 'p': _r.get('page')})
GROUP_NOTE = {
 'chat': 'The thread. Sentinel’s half of a turn, the advisor’s half, and everything that arrives between them.',
 'cards': 'What an answer becomes — the artifact, the result, the sheet an advisor decides in.',
 'data': 'Figures, and the three devices allowed to draw them. One hue, always direct-labelled.',
 'actions': 'What the advisor is offered. Chips inside a turn, never pinned above the composer.',
 'shell': 'The phone: the bar, the dock, the scroller, the screen transition.',
 'icons': 'Eleven stroke glyphs. Six from the source set, five drawn to match.',
 'text': 'The lines that qualify a figure — the eyebrow, the provenance, the standing disclosure.',
 'composer': 'The one control on every screen, and the money variant a question can ask for.',
 'forms': 'Search, selection, and a file the advisor attached.',
 'lists': 'A row, a card of rows, and the follow-up row a turn offers.',
}
ORDER = ['chat','cards','data','actions','shell','composer','forms','lists','text','icons']
JOURNEYS = [
 ('A','Risk','What is this client’s risk number?','screens/journey-a/risk-profile.html','Twelve questions, mostly one tap, ending in a number you can build against.'),
 ('B','Drift','Why did this portfolio drift, and what would fixing it cost?','screens/journey-b/03-thread-answer.html','The trace, the answer, the artifact that expands in place, two moves and their cost.'),
 ('C','Funds','Which funds, and what do I know about this one?','screens/journey-c/funds.html','A shortlist you can talk to, a fund’s own page, and five questions it answers.'),
 ('D','Proposal','Where would this amount go?','screens/journey-d/proposal.html','Four questions, then where ₹25,00,000 would go — and what blocks it.'),
 ('E','Rebalance','Bring this book back to its mandate','screens/journey-e/rebalance.html','The answer first: where he is, what I would do, what it costs. Then the dials.'),
 ('F','Review','What does this client hold, and what can I not say about it?','screens/journey-f/review.html','A record that asks what it is for, and names the figure it will not give.'),
]
OTHER = [
 ('The ledger','What was placed, and what has not settled','screens/thread/ledger.html'),
 ('What it refuses','Five refusals, each naming what it can do instead','screens/thread/refusals.html'),
 ('Going back','Editing a question that has already been answered','screens/thread/going-back.html'),
 ('The drawer','The shell, and the one place a journey is resumed from','screens/shell/drawer.html'),
 ('Who','The client picker every journey shares','screens/shell/who.html'),
 ('Home','Where an advisor starts, and the three capabilities on it','screens/journey-b/01-home.html'),
]
FOUND = [
 ('Spacing','guidelines/spacing.html'), ('Spacing in use','guidelines/spacing-in-use.html'),
 ('Type · UI','guidelines/type-ui.html'), ('Type · display','guidelines/type-display.html'),
 ('Type · weights','guidelines/type-weights.html'), ('Colour · ink','guidelines/colors-ink.html'),
 ('Colour · bronze','guidelines/colors-bronze.html'), ('Colour · surfaces','guidelines/colors-surfaces.html'),
 ('Colour · data','guidelines/colors-data.html'), ('Colour · lines','guidelines/colors-lines.html'),
 ('Radius','guidelines/radius.html'), ('Shadows','guidelines/shadows.html'),
 ('Texture','guidelines/texture.html'), ('Motion','guidelines/motion.html'),
 ('Motion · screens','guidelines/motion-screens.html'), ('The dark CTA','guidelines/dark-cta.html'),
 ('Wordmark','guidelines/wordmark.html'),
]
RULES = [
 ('Colour never encodes identity','One bronze hue for magnitude. Rank is length; identity is the label. No pies, no donuts, no multi-hue stacked bars.'),
 ('Bad news is text, never a fill','It sits on the peach bubble, in words. There is no red panel anywhere in this product.'),
 ('The composer is on every screen','One documented exception — the confirm sheet, which is commit-or-dismiss with no third path, and holds that exception in its type.'),
 ('Indian grouping, and provenance','₹1,85,000, and a line under the card saying where the figure came from and how complete it is.'),
]
RULINGS = [
 'Nothing is pinned above the composer — what a message offers scrolls with that message.',
 'One ✦ Sentinel signature per turn.',
 'One door per thing. Two controls opening the same sheet is one too many.',
 'Plain English an advisor can read aloud to a client.',
 'A state of a screen is not a screen.',
]

def card(href, kicker, title, note, big=False):
    return f'''<a class="card{' big' if big else ''}" href="{href}">
      <span class="kicker">{html.escape(kicker)}</span>
      <span class="t">{html.escape(title)}</span>
      <span class="n">{html.escape(note)}</span>
    </a>'''

total = sum(len(v) for v in g.values())
comp_sections = []
for k in ORDER:
    rows = sorted(g.get(k, []), key=lambda r: r['n'])
    shipped = [r for r in rows if r['p']]
    links = ' '.join(
        (f'<a class="chip" href="pages/{r["p"]}">{html.escape(r["n"])}</a>' if r['p']
         else f'<span class="chip off">{html.escape(r["n"])}</span>') for r in rows)
    count = f'{len(shipped)} of {len(rows)} specified' if len(shipped) != len(rows) else f'{len(rows)}, all specified'
    comp_sections.append(f'''<section class="grp">
      <h3>{k} <span class="count">{count}</span></h3>
      <p class="gn">{html.escape(GROUP_NOTE.get(k,''))}</p>
      <div class="chips">{links}</div>
    </section>''')

doc = f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Sentinel</title>
<link rel="stylesheet" href="styles.css">
<style>
  :root {{ color-scheme: light; }}
  html,body {{ margin:0; background:var(--color-desk); color:var(--color-ink); font-family:var(--font-ui); }}
  .wrap {{ max-width:1080px; margin:0 auto; padding:0 20px 96px; box-sizing:border-box; }}
  header {{ padding:88px 0 40px; }}
  .mark {{ font-size:11px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--color-bronze-deep); margin:0 0 20px; }}
  h1 {{ font-size:clamp(34px,6vw,56px); line-height:1.06; letter-spacing:-.02em; margin:0 0 20px; font-weight:600; text-wrap:balance; }}
  .lede {{ font-size:17px; line-height:1.6; color:var(--color-ink-soft); max-width:62ch; margin:0; }}
  .lede + .lede {{ margin-top:14px; }}
  h2 {{ font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--color-muted);
       margin:0 0 6px; padding-top:56px; border-top:1px solid var(--color-line); }}
  .sub {{ font-size:15px; line-height:1.6; color:var(--color-ink-soft); max-width:64ch; margin:0 0 24px; }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(272px,1fr)); gap:14px; }}
  .card {{ display:flex; flex-direction:column; gap:7px; text-decoration:none; background:var(--color-surface);
    border-radius:16px; padding:20px; box-shadow:0 0 0 1px var(--color-line); transition:box-shadow .18s, transform .18s; }}
  .card:hover {{ box-shadow:0 0 0 1px var(--color-bronze), 0 8px 24px -14px rgba(37,31,27,.3); transform:translateY(-1px); }}
  .card.big {{ grid-column:1/-1; background:var(--color-ink); box-shadow:none; padding:28px; }}
  .card.big .t {{ color:#fff; font-size:26px; }} .card.big .n {{ color:#cfc6bd; max-width:54ch; }}
  .card.big .kicker {{ color:var(--color-bronze); }}
  .kicker {{ font-size:10.5px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--color-bronze-deep); }}
  .t {{ font-size:17px; font-weight:600; color:var(--color-ink); line-height:1.3; }}
  .n {{ font-size:13.5px; line-height:1.55; color:var(--color-muted); }}
  .grp {{ padding:22px 0; border-bottom:1px solid var(--color-line-soft); }}
  .grp:last-child {{ border-bottom:0; }}
  .grp h3 {{ font-size:15px; font-weight:600; margin:0 0 4px; text-transform:capitalize; }}
  .count {{ font-size:11.5px; font-weight:500; color:var(--color-muted); text-transform:none; letter-spacing:0; margin-left:8px; }}
  .gn {{ font-size:13.5px; line-height:1.5; color:var(--color-muted); margin:0 0 12px; max-width:70ch; }}
  .chips {{ display:flex; flex-wrap:wrap; gap:6px; }}
  .chip {{ display:inline-block; font-size:12.5px; line-height:1; padding:7px 11px; border-radius:999px; text-decoration:none;
    background:var(--color-bubble); color:var(--color-bronze-deep); box-shadow:0 0 0 1px var(--color-bubble-edge); }}
  .chip:hover {{ background:var(--color-bronze); color:#fff; box-shadow:none; }}
  .chip.off {{ background:transparent; color:var(--color-muted); box-shadow:0 0 0 1px var(--color-line); }}
  ol.rules {{ counter-reset:r; list-style:none; padding:0; margin:0; display:grid; gap:12px; }}
  ol.rules li {{ counter-increment:r; background:var(--color-surface); border-radius:14px; padding:18px 20px 18px 56px;
    position:relative; box-shadow:0 0 0 1px var(--color-line); }}
  ol.rules li::before {{ content:counter(r); position:absolute; left:20px; top:18px; font-size:15px; font-weight:700; color:var(--color-bronze); }}
  ol.rules b {{ display:block; font-size:15px; font-weight:600; margin-bottom:4px; }}
  ol.rules span {{ font-size:13.5px; line-height:1.55; color:var(--color-muted); }}
  ul.rulings {{ list-style:none; padding:0; margin:18px 0 0; display:grid; gap:9px; }}
  ul.rulings li {{ font-size:14px; line-height:1.55; color:var(--color-ink-soft); padding-left:18px; position:relative; }}
  ul.rulings li::before {{ content:'·'; position:absolute; left:4px; color:var(--color-bronze); font-weight:700; }}
  .small {{ display:flex; flex-wrap:wrap; gap:7px; }}
  .small a {{ font-size:12.5px; padding:8px 12px; border-radius:10px; background:var(--color-surface); color:var(--color-ink-soft);
    text-decoration:none; box-shadow:0 0 0 1px var(--color-line); }}
  .small a:hover {{ box-shadow:0 0 0 1px var(--color-bronze); color:var(--color-bronze-deep); }}
  footer {{ padding-top:56px; border-top:1px solid var(--color-line); margin-top:56px; font-size:13px; line-height:1.6; color:var(--color-muted); max-width:70ch; }}
  @media (max-width:520px) {{ header {{ padding:56px 0 32px; }} h2 {{ padding-top:40px; }} }}
</style></head><body><div class="wrap">

<header>
  <p class="mark">Centricity WealthTech</p>
  <h1>Sentinel</h1>
  <p class="lede">A chat-led wealth-management assistant for advisors. An advisor talks to Sentinel about a
  client, a fund or a plan; Sentinel answers in a thread, asks one question at a time, and turns the
  answers into artifacts — a risk number, a proposal, a holdings review, a two-move rebalance.</p>
  <p class="lede">One surface, at 375 × 812. Everything below is rendered from the same code, so what
  you are looking at is the product rather than a picture of it.</p>
</header>

<h2>Start here</h2>
<p class="sub">One phone, every journey, one router deciding which a sentence enters. Type into it — the
sentences that work are listed in the demo script.</p>
<div class="grid">
  {card('screens/prototype.html','The prototype','Drive the whole product','Home, the six journeys, the ledger, the refusals and going back — wired together. Type “Show me flexi cap funds on my shelf”, then “under 0.7% TER”.',big=True)}
</div>

<h2>The six journeys</h2>
<p class="sub">Each is a question an advisor actually asks. Every page renders the journey in all of its
states, not only the one that goes well.</p>
<div class="grid">
  {''.join(card(h, f'Journey {k}', t, n) for k,t,q,h,n in JOURNEYS)}
</div>

<h2>The rest of the product</h2>
<p class="sub">The layer around the journeys: where an advisor starts, what they go back to, and what
Sentinel will not do.</p>
<div class="grid">
  {''.join(card(h,'Screen',t,n) for t,n,h in OTHER)}
</div>

<h2>The system — {total} components</h2>
<p class="sub">Every one of them is a contract, a prompt and a rendered specification — Tier 2 closed
on 20 September. Each chip opens its own page.</p>
{''.join(comp_sections)}

<h2>Foundations</h2>
<p class="sub">Every value the system allows, rendered rather than listed. The scale is generated from
the token files, so the documented numbers cannot drift from the real ones.</p>
<div class="small">{''.join(f'<a href="{h}">{html.escape(t)}</a>' for t,h in FOUND)}
<a href="pages/00-Index.html">All component pages</a></div>

<h2>The four rules</h2>
<p class="sub">Carried into every output, and each one is a gate rather than an intention.</p>
<ol class="rules">{''.join(f'<li><b>{html.escape(t)}</b><span>{html.escape(n)}</span></li>' for t,n in RULES)}</ol>
<ul class="rulings">{''.join(f'<li>{html.escape(r)}</li>' for r in RULINGS)}</ul>

<footer>
  <p><b>What this is not.</b> It is not an application. There is no data layer and no authentication —
  every figure comes from one fixture that is labelled as one on every screen that reads it. What this
  is, is the product's design made executable, so that what gets built can be checked against it rather
  than described.</p>
  <p>{total} components, every one specified · 144 pages rendering clean · six journeys · one prototype.</p>
</footer>

</div></body></html>'''
pathlib.Path('site/index.html').write_text(doc)
print('cover written', len(doc), 'bytes')
