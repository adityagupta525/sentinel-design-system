# Journey A — Meera's risk profile

Pass 2. Sixteen artboards at 375 × 812: intro + twelve questions + two interjections + the locked result. One client: **Meera Nair**.

Copy is verbatim from `src/journeys.tsx` (`Risk / 01 Intro` … `Risk / 16 Result`) — every sub-line, the smart-chip figures and both reflections.

Sixteen artboards, twelve questions: the rail counts questions, so it reads "of 12" throughout. The intro carries no rail (nothing has been asked yet); an interjection holds the rail at its preceding question and drops it to 40%; the result retires it.

Files: `a-data.jsx` (copy + the context-keyed placeholder map), `a-screens.jsx` (shell, one `Question` renderer, A01, A16, the board).

**2026-09-20 — redrawn on `screens/journey-a/rail.jsx`, on the owner's word.** Every question's chips and the locked result's "Build her a portfolio" sat in the `Dock`, pinned above the composer and outliving the question that offered them. They are inside the turn now: `SentinelTurn` takes `say` for the question and its sub-line, `chips` for the answers, `cta` for the one decision, and `bodyFirst` for the result whose answer IS the card. Three hand-built blocks went with them — a two-`SentinelText` column with its own gap, a muted `<p>` sub-line and a hand-placed `Provenance` — all of which the turn positions. A16 was also the one artboard here with a top-anchored scroller, which was fine while its decision was pinned and hid it the moment it was not; it is bottom-anchored like the rest.
