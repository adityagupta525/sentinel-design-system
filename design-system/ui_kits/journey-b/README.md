# Journey B — "Why did Sharma's portfolio drift this quarter?"

**Status.** Four of these artboards are documentation — B/05, B/06, B/09, B/11 — because each is the only example of a pattern no component card covers. The rest are narrative: reference source for copy and sequence. Journeys are rebuilt in consuming projects, not migrated from here.

**Standing rule.** The kit never ships an artboard that contradicts the current component set. Redraw it, or delete it — **"superseded" is not a state an artboard may be in.** A README footnote is not a fix: a stale-but-plausible artboard is more dangerous than a missing one, because the next reader screenshots it into a deck. a stale-but-plausible artboard is more dangerous than a missing one, because the next reader screenshots it into a deck. B/06 (2026-09-16), then B/07 and B/11 (2026-09-16), were redrawn under this rule; `b-fallback.jsx` was deleted under it, having shimmed three components the bundle now carries with a prop that no longer exists.

**2026-09-20 — the whole board redrawn on the built thread, on the owner's word.** Six artboards pinned their chips and their decision in the `Dock`; the ruling of 18 Sep puts both inside the turn that offered them, and `SentinelTurn` is the grammar the built thread uses. Three of `b-parts.jsx`'s helpers were hand-drawn copies of devices the system now owns and had been invisible to every fix since: `AttributionPreview` (its own 108pt label column and bars → `ChartBar density='peek'`), `ComplianceCard` (its own label/value rows with a quiet note and an over tone → `FigureRow` in a `Surface`), and `CostBreakdown` (a rail of dots, ring icons and a rotated chevron → `FigureRow`, total strong and lines quiet, as `screens/journey-b/moves.jsx` draws it). B/09 hand-drew the entire confirm surface — scrim, grabber, 24px radius, a raw shadow literal and a `Dock` with no composer — and is `ConfirmSheet` now, which holds rule 3's one documented exception in its type rather than in a caller's discipline. `Dock.cta` was deleted the same day; these six artboards were the last thing keeping it alive.

Pass 1. Eleven artboards at 375 × 812, composed from the design-system bundle. One client: **R. Sharma**, never blended.

| Artboard | What it proves |
|---|---|
| B / 01 Home | The three capability classes as suggestion rows (external · generative · diagnostic), verbatim |
| B / 02 Query | Bottom-anchored thread; the typed sentence stays editable |
| B / 03 Trace | Progress trace naming real work; Stop in the send slot |
| B / 04 Filling in | Collapsed reasoning + artifact card filling in with live row labels |
| B / 05 Artifact | A1 artifact card: 96px preview, three-slot footer, provenance |
| B / 06 Expanded | The expanded `ArtifactCard` — its own header row (eyebrow, title, ⋯), V3 diverging bar and stat tiles in situ, `Collapse ⌃` in the footer, and the **no-nested-scroll** contract: the thread scrolls, the card never does. **Was "B / 06 Canvas"** — it defined the A2 canvas frame (back pill, ⋯, docked composer, no scrim) until that surface was removed from the product (v5 Part 1). Repointed rather than deleted: documentation for a surface that does not exist is worse than none, because the next reader builds from it |
| B / 07 Follow-up | A follow-up asked **while the card stays expanded**: nothing collapses and nothing is pushed aside — the thread scrolls past the card, so only its `Collapse ⌃` foot is in view and the newest turn sits at the bottom. The no-nested-scroll contract seen from the other end. Content 448 px in a 463 px box. **Redrawn out of the canvas frame 2026-09-16** |
| B / 08 Rebalance | Two move cards + cost breakdown on the trace rail; CTA above the composer |
| B / 09 Confirm | Modal sheet — scrim, disclosure above the numbers, compliance status rows |
| B / 10 Success | Drawn check, timestamp, settlement line |
| B / 11 Share | The message draft as an **expanded `ArtifactCard` in the thread** — no canvas, no back pill; disclosure locked above the body, recipient named by the CTA, and the thread box anchored to the bottom with no vertical padding (a box shorter than its card is never padded toward fitting). Card 440 px in a 463 px box — it fits whole, footer included. **Redrawn out of the canvas frame 2026-09-16** |

Files: `b-data.jsx` (all copy + the context-keyed placeholder map), `b-parts.jsx` (artboard shell, skeleton row, attribution preview, compliance card, cost breakdown, result dock), `b-screens.jsx` (B01–B11, registered on `window` at the foot of the file), `b-board.jsx` (the board — it resolves screens from `window` at render time, because the bundle compiles `b-board` before `b-screens`).

Note on numbering: the brief named nine artboards (B/01–09). Drawing it, the trace and the artifact-fill are two distinct screens and the confirm sheet cannot double as the success state, so the journey is **ten**. Nothing was added for its own sake — B/04 exists because Plate 1 devotes a panel to it.
