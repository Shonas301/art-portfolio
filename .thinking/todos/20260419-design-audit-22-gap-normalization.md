---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 3
audit_item: 22
tags:
  - design-audit
  - systems
  - spacing
  - polish
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #spacing #polish

# #22 — gap normalization (tier 3, systems)

non-square off-grid gap `12px 16px` in layout styles. `4px` half-grid is acceptable; `12 16` is not.

## fix

- grep: `grep -rn "gap.*12px 16px\|gap.*16px 12px" main/src/`
- normalize to either `12px` or `16px` square — pick based on surrounding rhythm
- prefer Joy spacing tokens (`var(--joy-spacing-*)`) if they cover the value

## verification

- `pnpm test:run` green
- `npx tsc --noEmit` clean
- visual at `/v2` — alignment should feel tighter, especially in grid layouts

## depends on

- no blockers
