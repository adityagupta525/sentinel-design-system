# The note that goes with the handover

Copy this into the email or the message that carries `sentinel-handoff.zip`. It is kept here so it
is written once and stays true: every number in it is one the repository can be asked for
(`npm run check`, `node tools/check-previews.mjs`, `pages/_index.json`).

---

**Subject: Sentinel — design system and screens, design + code handover**

Hi team,

Attached is **`sentinel-handoff.zip`** (3.5 MB) — Sentinel's design system and every screen of the
product, as one folder. It is a **design and code handover in the same package**: the design is not a
picture of the product, it is the product's code, so what you build can be checked against it rather
than described to you.

You can also browse the whole thing here, no download needed:
**https://sentinel-design-systemsentinel-desi.vercel.app**

---

### Two doors

**To look at it** — unzip and open **`site/index.html`** in a browser (Chrome or Safari; not Quick
Look). Nothing to install. 131 pages, already built.

**To build it** — read `START-HERE.md`, then `README.md`, then `rules/HANDOVER.md`.

### What is inside

| Folder | What it is |
|---|---|
| `site/` | The whole thing, rendered. 131 pages: every screen, every journey, all 94 component specifications, and the foundations. This is the one to open. |
| `design-system/` | The system as source. 94 components, each an ESM `.jsx` with a hand-written `.d.ts` contract that carries the reasoning and a `.prompt.md` that says when to reach for it. `index.js` is the generated barrel and the **only** public entry — import from it, never from a component file. `tokens/` is every value the system allows. |
| `screens/` | 18 screen pages and 15 modules — six journeys plus the layer around them — and `data/book.jsx`, the single fixture all of them read. |
| `bundles/` | Two single files for a spike with no build step: the whole system (233 KB) and every screen (278 KB). |
| `rules/` | `HANDOVER.md` (install, import, the four rules, what gets a PR sent back) · `readme.md` (the 43 KB specification) · `DEMO-SCRIPT.md` (every sentence that reaches every screen) · `DNA.md` · `FEEL.md` · `contradictions.md` (the system's own list of known inconsistencies) · `CONTRIBUTING.md` |

### How `site/` is organised

The cover is one page, six sections, in the order you would actually need them:

1. **Start here** — the prototype. One phone, every journey, one router deciding which a sentence
   enters. Type into it; the sentences that work are in `rules/DEMO-SCRIPT.md`.
2. **The six journeys** — A Risk · B Drift · C Funds · D Proposal · E Rebalance · F Review. Each page
   renders the journey in **all of its states**, not only the one that goes well.
3. **The rest of the product** — the ledger, what it refuses, going back, the drawer, the client
   picker, home.
4. **The system — 94 components**, grouped (chat 17 · cards 15 · data 15 · actions 12 · shell 11 ·
   icons 11 · text 4 · composer 3 · forms 3 · lists 3). Each chip opens that component's own page:
   specimen, anatomy, variants, states, tokens, props, do/don't, and its motion table.
5. **Foundations** — spacing, type, colour, radius, shadows, texture, motion, the dark CTA, the
   wordmark. Rendered rather than listed, and generated from the token files, so the documented
   numbers cannot drift from the real ones.
6. **The four rules** — see below.

### Motion

One easing and seven duration tokens, no more. Press is `scale(0.98)`. Screens move with
`ds-screen-in` / `ds-screen-out`; there is deliberately **no shared-element transition**. Every
animation states its reduced-motion behaviour, and every component page carries a motion table.
`site/guidelines/motion.html` and `motion-screens.html` are the two pages for it.

### The four rules, which travel with the code

1. **Colour never encodes identity.** Rank is length, identity is the label. One hue. No pies, no
   donuts, no multi-hue stacked bars.
2. **Bad news is text on the peach bubble, never a fill.** There is no red panel in this product.
3. **The composer is on every screen.** One documented exception — the confirm sheet, which is
   commit-or-dismiss with no third path, and which holds that exception in its type.
4. **Indian grouping, and provenance.** `₹1,85,000`, and a line under the card saying where the
   figure came from and how complete it is.

A pull request that breaks one of these gets sent back. `rules/HANDOVER.md` says what else does.

### What this is **not**

It is not an application. There is no data layer, no authentication and no backend. `book.jsx` is a
fixture, and it is labelled as one on every screen that reads it. The scope is **one surface — the
mobile app at 375 × 812**; there is no desktop or web design in here, because there isn't one yet.

### First thirty minutes, if you are building

1. Open `site/index.html` → the prototype. Drive it with three sentences from `rules/DEMO-SCRIPT.md`.
2. Open the same journey's page in `site/screens/` and see every state it has.
3. Open `rules/HANDOVER.md` and import one component from `design-system/index.js`.
4. Open that component's page in `site/pages/` and check your render against it.

Questions to me. Anything that looks wrong probably is — send the page and what you saw.

---

**Note for whoever sends this:** the Vercel link is public to anyone who has it. If that is not
wanted, turn on Vercel Authentication first — Settings → Deployment Protection — and the link will
then only open for people on the team.
