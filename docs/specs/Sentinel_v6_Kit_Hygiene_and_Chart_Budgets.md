# Sentinel v6 — kit hygiene, chart height budgets, states-page checklist

Addendum to v5. Nothing here replaces v5 Part 6; it closes the three things v5 left open, records two system-side fixes, and defines what "the states page is done" means.

---

## Part 0 — Accepted from the last two passes

- **Bundle refresh evidence: accepted.** Reading the changed default back from the project's own copy is exactly the evidence v5 Part 0 asked for. Keep that shape on every future refresh — the evidence is the read-back, not the claim that a refresh ran.
- **`ArtifactCard` expanded state and the no-nested-scroll contract: accepted**, and accepted specifically because it was demonstrated in an artboard rather than asserted in prose.
- **B/06b Expanded, foot: approved.** Journey B is 14 artboards. An artboard that exists because a real measurement overflowed is a better artboard than one drawn from intent.
- **B/11 clipping fix: accepted**, and it becomes a rule. A thread box shorter than its card is **anchored to the bottom with no vertical padding** — never padded toward fitting. Padding cannot solve a 463 px box inside a 465 px card and the next person should not have to rediscover that.
- **Contradiction 41: logged, and its trigger is now satisfied.** See §1.2.

---

## Part 1 — Two items the project correctly pushed upstream, and one ruling it asked for

### 1.1 The six bundle `__errors`

`b-board.jsx` fails with `B01 is not defined`. `a-screens.jsx`, `b-board.jsx` and `app.jsx` fail with minified React #299.

The project was right not to patch its own copy. It was also right to flag it rather than ignore it, and the reason is worth stating: **the kit is part of the system, not a demo of it.** A kit file that will not evaluate is a broken component in the system's own vitrine, and "nothing imports it" is a description of today, not a fix.

Diagnosis order:

1. **Decode the React number before assuming what it means.** Minified React errors have an official decoder; read the real message for #299 in the React version this kit builds against, and quote it in the fix note. Do not fix against a guess.
2. `B01 is not defined` — establish whether the identifier was **renamed, or lost its export**, when B/06 was repointed to Expanded. A repoint that renames an artboard and leaves a reference behind is the most likely cause and it is a one-line fix; a module-order problem is a different fix, so find out which before editing.
3. Fix the **cause in the kit source**. Not by deleting the file, not by wrapping the mount in a try/catch, not by removing it from the bundle manifest.

Closing evidence: the bundle builds and prints `__errors: []`. If one of the six turns out to be a platform issue rather than a source issue, say so with the decoded message and stop there — that is a real answer and I would rather have it than a silenced error.

### 1.2 Delete `onOpen`

The trigger recorded with contradiction 41 was "delete when the project has zero call sites". The project's last pass migrated every call site to `onToggle` and reported zero remaining. The trigger is satisfied.

Delete `onOpen` from the `.jsx`, the `.d.ts` and the `.prompt.md`. Close contradiction 41 with the date and the one line of evidence that satisfied it.

**No tombstone comment.** The contradiction log is the record of why the alias existed; a comment in the component is a second, weaker record that will outlive its own accuracy.

### 1.3 B/07 and B/11 still in the `CanvasHeader` frame — redraw them

The question was whether to redraw them or leave the README note marking them superseded. **Redraw.**

The instinct to flag rather than silently redraw was right. The outcome is wrong, for a reason this project has already paid for once: a README line saying an artboard is superseded is a footnote the next reader does not reach, and the hidden-disclosure drift proved that a **stale-but-plausible** artefact is more dangerous than a missing one. Someone will screenshot B/07 into a deck.

Standing rule for the kit, from here on: **the kit never ships an artboard that contradicts the current component set. Redraw it, or delete it. "Superseded" is not a state an artboard may be in.**

Redraw both into the expanded-`ArtifactCard` idiom established by B/06 and B/06b. No `CanvasHeader`, no header title row, no `‹ Back to chat`. If either one loses its reason to exist once the canvas framing is gone — B/07 in particular may just be B/06 again — delete it and say so, rather than drawing a near-duplicate to preserve a number.

---

## Part 2 — What v5 Part 6 left open

v5 §6.1–6.5 stand as written: line and bar yes, pie no with the validator table as the evidence, one theme, legend required whenever there are two or more series, tap-to-inspect instead of hover, table view from the card's `⋯`. Three things it did not settle.

### 2.1 A chart height budget — from measured evidence, not intent

B/06 overflowed by roughly 53 px: chart plus three stat tiles ≈ 550 px against 497 px of available thread, and the casualty was the card's own `Collapse ⌃` footer. That is not a padding problem. It is a missing budget.

- **Collapsed card:** plot **132 px**, axis label band 14 px, whole chart block **≤ 156 px**.
- **Expanded card:** plot **180 px**, whole chart block **≤ 208 px**.
- **A chart plus three stat tiles does not fit a collapsed card.** Choose: chart collapsed with the tiles arriving on expand, or the tiles collapsed with the chart arriving on expand. Both are legitimate; pick per journey and say which.
- **The card's footer row is never the thing that gets cut.** If something must go, it is data, and the route for that data is the table view — not a smaller font.

Prop on every chart: `density?: 'collapsed' | 'expanded'`, defaulted from the card's state. **Charts never measure their own container.** A chart that reads its height from the parent is how a 132 px budget becomes 180 px in one screen and nobody notices.

### 2.2 `tone` — making v5 §6.3 a prop instead of three conventions

v5 ruled there is one theme doing three jobs. Encode it:

```ts
tone?: 'ramp' | 'status' | 'muted'
// ramp   — magnitude. CHART_RAMP, ordinal only, never categorical.
// status — state. One series, the status trio, breach/drift only.
// muted  — de-emphasis. Reference, benchmark, prior-period.
```

The guard: **`tone` never accepts a colour, and no chart takes a `color` prop.** Type-level, the same way tappable badges were made unrepresentable.

If the team asks for a fourth tone, that is the pie question in a new hat. Answer it with v5 §6.2's table, which is measured, rather than with a preference.

### 2.3 The draw-on motion exception

The motion law is `transform` and `opacity` only. A line chart cannot draw on inside that law, and quietly breaking it is worse than naming an exception.

**One named exception: `stroke-dashoffset` for path draw-on.** ≤ 600 ms (the data-reveal budget), `ease-out`, one pass, never looping, never on a re-render — only on first reveal. Bars keep `scaleY` with `transform-origin: bottom`, the same discipline as the allocation bar's `scaleX` from `left`. Under `prefers-reduced-motion`, both render their final state with an opacity fade and nothing else.

Record it in the motion section **as an exception, with its reason**, so the next reader sees a decision rather than a violation.

---

## Part 3 — The states page: what "complete" means

Pages 3/01 and 3/02 exist. Audit against the list below and **print what was already there** before adding — I want to see the delta, not a fresh page.

### 3.1 Free-text buckets

Take the bucket list from the **v2 spec's intent router table**, not from Pattern Plate 2. The plate drew the rejection-shaped cases only, which is why it looks like four. Every bucket the router can return gets an artboard: parse, reject, detour, unknown, scope, action.

Print the list you actually find in the spec. If it does not come to six, say what it comes to — do not invent a bucket to reach a number in this document.

### 3.2 Six assistant-response states

1. **Pending** — user bubble placed, assistant row breathing. Opacity only, ~1200 ms, static under `prefers-reduced-motion`.
2. **Reasoning** — a collapsible row: expanded while running, collapsed on completion. `--color-muted`, 11.5 px, no nested scroll, expand is a height-auto with an opacity fade.
3. **Streaming** — no layout jump as text lands. Auto-scroll only while the user is already at the bottom; a user who has scrolled up is never yanked down.
4. **Complete, with inline pills** — pills belonging to that one message, which scroll away with it. Placement law: dock pills act on current state and persist, inline pills belong to a message.
5. **Complete, with a collapsed `ArtifactCard`** — and the artboard's height must visibly obey §2.1.
6. **Failed** — one line in `--color-muted`, a `Retry` pill inline, and **the user's message preserved and editable**. This is where correction 6 earns its keep: a failure is the most common reason to edit and resend.

### 3.3 Empty states

Every list and every card that can be empty: clients, funds, proposals, drift/alerts, uploads, and the artifact card before it fills — `filling` is one state, empty is a different one.

Each: **one line of written copy in the product's voice, one action pill, no illustration.** The copy is real, not placeholder, and it is never "No data". "No drift to review — I'll flag it here when a portfolio moves" is the register.

### 3.4 The six corrections — print, do not rebuild

For each of the six, print one line: the artboard where it now renders, and the component that carries it. Correction 4's back-pill solution especially — I want to see which artboard shows it and how much screen it takes now. If any of the six has no artboard, that is the gap to close.

---

## Part 4 — Order from here

1. **Kit hygiene** — Part 1. Design-system session.
2. **States page completion** — Part 3. Project session. Runs on the bundle refreshed last pass; **no refresh needed**.
3. **Charts** with §2.1–2.3 into the system, then **one** refresh into the project.
4. **The team's nine components**, per the component request spec.

1 and 2 are independent and can run in either order.

Still locked, unchanged: the mandate ceiling (15 % vs 25 %), the source of fund performance data, the AMC offer terms. All three stay `[NEEDS DECISION]` and render visually locked. No agent guesses these.
