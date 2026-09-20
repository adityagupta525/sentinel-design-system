# Sentinel

**Sentinel** is the chat-led wealth-management assistant for financial advisors — mutual-fund
distributors and partners — at **Centricity WealthTech**. An advisor talks to Sentinel about a client,
a fund or a plan; Sentinel answers in a thread, asks one question at a time, and turns the answers
into artifacts: a risk number, a proposal, a holdings review, a two-move rebalance.

One surface: the mobile app, at **375 × 812**. This repository is the product's design, made
executable — the system it is built from, every screen it has, and a prototype that runs all of them.

---

## Three ways in

Pick the row that describes you. Each is a short path, not a tour.

| You are | Start here | Then |
|---|---|---|
| **Driving the product** — demo, review, or seeing what it does | `npm run preview` → [the prototype](http://localhost:4321/screens/prototype.html) | **[`docs/DEMO-SCRIPT.md`](docs/DEMO-SCRIPT.md)** — every sentence that reaches every screen |
| **Building it** — a development team | **[`docs/HANDOVER.md`](docs/HANDOVER.md)** — install, import, the four rules, what gets a PR sent back | `npm run build:handoff` → one folder with the system, the screens and the rules |
| **Designing on it** | **[`design-system/readme.md`](design-system/readme.md)** — the specification, 43 KB | [the component pages](http://localhost:4321/pages/00-Index.html), and `CLAUDE.md` for the working rules |

```bash
npm install
npm run preview          # http://localhost:4321
npm run check            # barrel · bundle · integrity · adherence
npm run build:handoff    # handoff/ — the folder you give a development team
```

---

## What is in here

```
design-system/      the system: 97 components, tokens, guidelines, per-component spec pages
screens/            every screen and journey, plus the single fixture they all read
docs/               the plans, the research, the findings, the demo script
dist/               two single files: the system, and every screen
tools/              the build and the gates
studio/             the research the product rests on
```

### The design system — 97 components

Each one is an ESM `.jsx`, a hand-written `.d.ts` contract that carries the reasoning, and a
`.prompt.md` that says when to reach for it. **54 also have a rendered spec page**, which is what
`shipped` means here: a row in `pages/_index.json` is shipped only when all three files exist, and
that index is generated from disk so it cannot claim a component exists when it does not.

| Group | | Group | |
|---|---|---|---|
| `chat` | 17 | `cards` | 15 |
| `data` | 15 | `actions` | 13 |
| `shell` | 12 | `icons` | 11 |
| `text` | 5 | `composer` | 3 |
| `forms` | 3 | `lists` | 3 |

`design-system/index.js` is the generated barrel and the **only** public entry.
`design-system/tokens/` is every value the system allows — `npm run build:scale` regenerates the
scale from it, so the documented numbers cannot drift from the real ones.

### The screens — six journeys and a prototype

| | Journey | The question it answers |
|---|---|---|
| A | `screens/journey-a/` | What is this client's risk number? |
| B | `screens/journey-b/` | Why did this portfolio drift, and what would fixing it cost? |
| C | `screens/journey-c/` | Which funds, and what do I know about this one? |
| D | `screens/journey-d/` | Where would this amount go? |
| E | `screens/journey-e/` | Bring this book back to its mandate |
| F | `screens/journey-f/` | What does this client hold, and what can I not say about it? |

Plus the shell (`screens/shell/`), the thread layer (`screens/thread/` — the ledger, the refusals,
going back) and **`screens/prototype.html`**, which is all six wired together behind one router.

Every journey is a `.jsx` module plus an `.html` page that renders its states. The module is the
code; the page is the specification of what that code must look like in every state.

---

## The four hard rules

Carried into every output, and each one is a gate rather than an intention.

1. **Colour never encodes identity.** One bronze hue for magnitude; rank is length and identity is the
   label. No pies, no donuts, no multi-hue stacked bars.
2. **Bad news is text on the peach bubble, never a fill.** There is no red panel in this product.
3. **The composer is on every screen.** One documented exception — the confirm sheet, which is
   commit-or-dismiss with no third path, and `ConfirmSheet` holds that exception in its type rather
   than in a caller's discipline.
4. **Indian grouping, and every figure says where it came from.** `₹1,85,000`, and a provenance line
   under the card that carries it.

Five interface rulings sit beside them: nothing is pinned above the composer · one `✦ Sentinel`
signature per turn · one door per thing · plain English an advisor can read aloud · a state of a
screen is not a screen.

---

## The gates

Nothing here is judged by assertion. Every claim in this repository has a command behind it.

| Command | What it proves |
|---|---|
| `npm run check:integrity` | The imported system has not drifted without the baseline moving in the same commit |
| `node tools/check-previews.mjs` | All 100 pages render, with no console errors, no 404s and nothing that mounts empty |
| `npm run lint:adherence` | No raw hex, no raw `px`, no raw `font-family` — ceiling 61, and it only ever comes down |
| `npm run lint:adherence:screens` | The same, on the screens, at **zero** |
| `npm run check:tokens` | Every token a screen references is defined |
| `npm run report:parallel` | How many components appear on a screen. The owner's standing rule: nothing in the system that is on no screen |

The preview pages read `_ds_bundle.js`, not the source, so **`npm run build:bundle` after every
component change** — otherwise you are looking at the previous build.

---

## Using it in a product

```jsx
import { SentinelTurn, UserTurn, ArtifactCard, ConfirmSheet } from '@centricity/sentinel-design-system';
import '@centricity/sentinel-design-system/styles.css';
```

`index.js` is the only supported entry; the paths under `components/` are an implementation detail.
`design-system/_adherence.oxlintrc.json` enforces that and the token discipline — point your own
linter at it:

```bash
oxlint --config node_modules/@centricity/sentinel-design-system/design-system/_adherence.oxlintrc.json src
```

---

## Where the work stands

Open craft debt is tracked in **[`docs/FINDINGS.md`](docs/FINDINGS.md)** (F-1 … F-70, none open) and,
by the system's own hand, in `design-system/guidelines/contradictions.md` (8 open, every one dated and
triggered). **[`docs/CONTINUE-HERE.md`](docs/CONTINUE-HERE.md)** carries the state of the work and the
rulings that were made in conversation and are not visible in the code.

> **Provenance.** `design-system/` began as the Claude Design project *Sentinel Design System*,
> imported verbatim. `baseline/design-system.sha256` pins every file in that tree, and
> `npm run check:integrity` fails if any of them drifts without the baseline being updated in the same
> commit. That is the mechanism that keeps every later edit visible rather than silent.
