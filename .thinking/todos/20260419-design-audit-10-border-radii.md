---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 2
audit_item: 10
tags:
  - design-audit
  - systems
  - border-radii
  - theme-override
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #border-radii #theme-override

# #10 — border radii standardization (tier 2, systems)

11 distinct `borderRadius` values across `src/`; 5 of them used at the same chrome level. `JoyButton` override in `theme.ts:106` hardcodes `28px` — bypasses `radius.xl=24px` token.

## fix

- standardize to 4 / 8 / 16 / 24 (guideline cap: 3-4 values)
- remove per-component radius overrides, especially `theme.ts:106` 28px
- grep `borderRadius:` across `src/` and re-point each to `var(--joy-radius-sm|md|lg|xl)` or numeric 4/8/16/24

## verification

- `pnpm test:run` green
- `npx tsc --noEmit` clean
- visual at `/v2` 1440×900 — chrome radii should look consistent; binder tabs and cards should match
- count: `grep -r "borderRadius" main/src/ | wc -l` before/after

## depends on

- no blockers — autonomous-safe
