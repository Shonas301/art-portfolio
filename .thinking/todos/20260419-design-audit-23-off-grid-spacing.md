---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 3
audit_item: 23
tags:
  - design-audit
  - systems
  - spacing
  - 8pt-grid
  - polish
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #spacing #8pt-grid #polish

# #23 — off-grid spacing (tier 3, systems)

three specific 8pt-grid violations:

- `BinderTabs` paddingRight `10px` → `8px`
- `MobileNav` button height `50px` → `48px`
- `LandingPage` inline `marginTop: '2rem'` → `var(--joy-spacing-4)` (or `32px`)

## fix

- edit the three sites directly
- prefer Joy spacing tokens where they exist

## verification

- `pnpm test:run` green
- `npx tsc --noEmit` clean
- visual at `/v2` — nothing noticeably shifts; grid alignment is cleaner

## depends on

- paired nicely with #22 — do together
