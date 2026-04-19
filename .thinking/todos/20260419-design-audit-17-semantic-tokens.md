---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 2
audit_item: 17
tags:
  - design-audit
  - systems
  - tokens
  - surface-colors
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #tokens #surface-colors

# #17 — surface-page / surface-edge semantic tokens (tier 2, systems)

raw non-palette hex colors repeated across 5+ files without a shared token:

- `#faf8f3` — page surface
- `#e8e5df` — chrome surface
- `#c8c4bc` — chrome behind
- `#f1efe8` — edge surface (variant)

invisible coupling: changing palette means hunting hex codes.

## fix

- add CSS variables in `globals.css:root`: `--surface-page`, `--surface-edge`, `--surface-chrome`, `--surface-chrome-behind`
- mirror in Joy theme (`theme.ts`) so components can use `var(--surface-*)` or `sx={{ bgcolor: 'surface.page' }}`
- grep + replace each raw hex: `grep -rn "#faf8f3\|#e8e5df\|#c8c4bc\|#f1efe8" main/src/`

## verification

- `pnpm test:run` green
- `npx tsc --noEmit` clean
- visual diff at `/v2` — no visible change (pure token refactor)
- `grep -rn "#faf8f3" main/src/ | wc -l` → 0 (all moved to token)

## depends on

- no blockers
