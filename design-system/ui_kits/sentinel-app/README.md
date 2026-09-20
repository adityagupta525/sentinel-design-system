# Sentinel · mobile app UI kit

The states a design system needs to show, composed from the bundle at 375 × 812 — **not** a copy of the product. Home, the thread (trace → artifact peek → expanded → rebalance → approve → success), the risk journey, and the drawer.

Screens · `home.jsx` (Home + Jump back in), `chat.jsx` (the drift thread, with the artifact expanding in place), `journey.jsx` (Risk profile — 5 of 12 questions + HeroNumberCard result), `drawer.jsx` (left drawer with its own composer). `data.jsx` holds the demo copy lifted from `src/screens` and `src/journeys.tsx`.

Try: tap a suggestion row ("Why did Sharma's portfolio drift…") → watch the trace → **Expand** the attribution card → Rebalance → Approve. Or "Jump back in → Meera's risk profile".

**The design system holds tokens, components and states; it does not hold product screens** (2026-09-17, contradiction 43 closed by deletion). `portfolio.jsx` and `proposal.jsx` — the client-review and proposal canvases — were deleted along with `app.jsx`'s `canvas` branch, `onOpenCanvas` and the `kit-canvas` keyframe. They duplicated Journey A and B artboards that the project owns and keeps current, and a product screen in the system's kit is stale by construction. Everything those two screens documented about *components* is on the component cards; everything they documented about *the product* belongs with the product.

Not recreated (source exists, left out for scope): Fund explorer, confirm sheet, on-screen keyboard.

**2026-09-20 — redrawn on the built screens, on the owner's word.** `home.jsx` drew "Jump back in" as four hand-written `<button>`s with their own chevron SVG and hairline, which is `List` + `ListRow variant='nav' trailing='chevron'` and has been since v9 — so every fix to the row reached the product and never reached this board. Its composer sat in a bare `<div>` with a hand-rolled flex-wrap of pills above it; both are the `Dock`'s now, and Home's starters are the one legitimate use of `Dock.chips` (no conversation, so no message for them to sit under and no scroll to outlive). `chat.jsx` and `journey.jsx` pinned their chips and their decisions in the Dock; `SentinelTurn` carries both now, the same grammar `screens/journey-b/answer.jsx` and `screens/journey-a/rail.jsx` use. `Dock.cta` was deleted the same day.
