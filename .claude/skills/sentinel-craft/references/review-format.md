# Review output

One report, one table, one verdict. Five separate domain reports stapled together is not a review.

## Scope and coverage

State what was inspected and what was not. Never imply an uninspected surface was reviewed.

| Area | Evidence inspected | Result |
| --- | --- | --- |
| The four rules | Which components, which states | Findings count or `Clear` |
| Operability | | |
| Alignment and scale | | |
| Type and numbers | | |
| Motion | | |
| Copy | | |

`Clear` means inspected with nothing actionable. `Not reviewed` must say why.

## Findings

One table, most severe first, then by reach. A token or shared-component fix outranks the same symptom
in one leaf. **Each row is one root cause** — list every confirmed location in that row rather than
repeating the row per occurrence.

| # | Severity | Area | Location | Now | Change to | Why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Operability | `components/cards/ArtifactCard.jsx:57` | `<Pressable>{body}</Pressable>` wraps `children` | Press target as a sibling behind the content | Any interactive child becomes a button inside a button |

Severity:

- **HIGH** — breaks one of the four rules, blocks a task, hides content or a control, misleads about a
  number, or is a systemic failure repeated across components.
- **MEDIUM** — harms comprehension, consistency or efficiency.
- **LOW** — isolated polish.

Every row cites `path:line` and shows what is there now. A row without evidence does not go in the
table.

## Considered and rejected

Two to five real candidates that were inspected and deliberately left alone. This is the section that
proves the review looked rather than pattern-matched — and the section that keeps someone else's
numbers out of this system.

| Location | Candidate | Rejected because |
| --- | --- | --- |
| `tokens/spacing.css` | Round `--space-13` and `--space-14` onto an 8pt grid | Both are named exceptions with stated uses — a 13px pill inset, 14px card padding. The scale is 4/8/12/16/20/24 **plus** documented exceptions; flattening it would restyle every card |
| `components/actions/Pressable.jsx` | Press at `scale(0.96)` per common guidance | Sentinel presses at `--press-scale` 0.98 and 0.94 on discs, set in the token layer and documented in readme.md |

Not filler. If the scope genuinely held fewer borderline candidates, list the ones that existed and say
so.

## Verification

Each check, the exact command, and what came back. Separate what passed from what is **Not verified**.
A verification gap is never converted into a finding.

```
npm run build:bundle      →  83 modules, 103 exports
npm run check             →  barrel current, 338 files intact, adherence clean
node tools/check-previews.mjs  →  47/47 pages render clean
```

A visual claim needs a render. Say which screenshot, at which viewport.

## Verdict

Exactly one:

- **`Block`** — a rule is broken, or a HIGH finding stands.
- **`Needs changes`** — only MEDIUM or LOW remain.
- **`Approve`** — nothing actionable, and the claimed coverage was verified.

`Approve` with an open actionable finding is the one output this skill treats as a failure of the
review itself.
