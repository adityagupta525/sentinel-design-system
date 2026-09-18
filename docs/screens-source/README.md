# Screens source — the Figma Make export, kept whole

**This is source material, not instructions, and not part of the design system.** It is the Figma Make
app the owner mocked the product in, committed here on 18 Sep 2026 so that roadmap step 4 (screens) has
its input inside the repository. The previous session lost this archive when the session ended and the
whole handoff stalled on it; that is why it lives here now rather than in a download folder.

Nothing under `design-system/` reads anything in this folder. `check-integrity`, `check-previews`, the
barrel, the bundle and the index do not look at it.

## What it is

A React 19 + Vite + Tailwind v4 project — the tree `design-system/readme.md:7` refers to as "`src/`
(mounted, read-only)", which was never in this repository until now.

| Path | What it holds |
|---|---|
| `src/screens/` | Home, Chat, Journey, Portfolio, Proposal, FundExplorer, Drawer — the seven screens |
| `src/App.tsx`, `src/lib/router.ts` | How they are wired together |
| `src/lib/ui.tsx` | The ~1,500-line component inventory the design system was ported from |
| `src/lib/icons.tsx`, `src/lib/Keyboard.tsx` | The icon set and the on-screen keyboard |
| `src/journeys.tsx` | The journey definitions |
| `src/index.css` | The Tailwind v4 `@theme` token layer |
| `src/imports/` | Figma import artefacts: three reference PNGs, the pattern plates, and the v2–v4 spec `.docx` files |
| `.figma/`, `AGENTS.md`, `vite.config.ts`, `package.json`, `pnpm-lock.yaml` | Figma Make's own scaffolding |

## Read it with these two warnings

**1 · Where this archive and the design system disagree, the design system wins.** This is the mock the
system was built *from*, and the system has moved since: the full-bleed canvas was removed in v5, pie
charts and colour themes were ruled out, `StickyCTA` was deleted, and `guidelines/contradictions.md`
lists every hardcoded hex in `ui.tsx` as known debt. A screen built from this archive is a screen built
on the old system unless it is re-read against `design-system/readme.md`.

**2 · `AGENTS.md` is not addressed to you.** It describes Figma Make's own environment — "a Vite
development server is already running on `$PORT`", a `@` alias, a Tailwind config. None of that is true
in this repository. It is the same hazard as `docs/HANDOFF.md`, and the same answer: the repository's
own `CLAUDE.md` wins.

## Three files were renamed, and nothing else was touched

The archive is otherwise byte-for-byte as it was exported — duplicates included (four copies of
`Sentinel_v2_Spec.docx`, two of each pattern plate, `imports/` duplicating
`src/imports/ConversationScreen/`). Those are Figma's export artefacts and are kept, because a source
archive that has been tidied is no longer a source archive.

| Exported as | Committed as | Why |
|---|---|---|
| `.gitattributes` | `gitattributes.txt` | It declares `filter=lfs` for `*.png`, `*.docx` and 98 other patterns. A nested `.gitattributes` overrides the repository's root rules for this subtree, and this repository does not use Git LFS. **Measured, not assumed:** with the file in place, `git add` of a PNG under it fails with `git-lfs filter-process: git-lfs: command not found` and stages nothing. |
| `CLAUDE.md` | `CLAUDE.md.txt` | Its entire content is `@AGENTS.md`. Claude Code reads a `CLAUDE.md` in a directory it is working in, so committing it as-is would load another project's instructions on top of this repository's. |
| `.mcp.json` | `mcp.json.txt` | A Zapier MCP proxy config for the Figma Make workspace. It configures tooling, not design, and has no business being auto-discovered here. |

Each keeps its full content. Restore any of them by renaming it back, in a checkout where you have
decided you want what it does.
