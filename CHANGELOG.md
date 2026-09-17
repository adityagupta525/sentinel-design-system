# Changelog

Notable changes to the Sentinel design system. Dates are day-first, as everywhere else in this product.

## Unreleased

### Added
- Repository scaffolding around the imported design system: preview server, barrel generator, index
  runner, integrity check, CI, contribution rules.
- `design-system/index.js` and `index.d.ts` — the public entry point `_adherence.oxlintrc.json`
  already pointed consumers at and exempted from its own import rule, but which the bundle did not
  ship. Generated from disk by `tools/build-barrel.mjs`; 83 modules, 103 exports.
- `baseline/design-system.sha256` — 338 file hashes pinning the imported tree.
- `docs/FINDINGS.md` — the craft and correctness backlog.

### Imported
- The **Sentinel Design System** project from Claude Design, verbatim: 82 components across ten
  groups with `.d.ts` contracts, the five-file token layer, 16 guideline pages, 17 component spec
  pages, three UI kits, the icon set, and the 43 KB system specification (`design-system/readme.md`).
- `docs/specs/` — the v2 → v11 specification history, component request specs and pattern plates that
  the system was built from.
