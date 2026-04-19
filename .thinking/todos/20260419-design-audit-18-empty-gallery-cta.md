---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 2
audit_item: 18
tags:
  - design-audit
  - systems
  - empty-state
  - gallery
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #empty-state #gallery

# #18 — empty gallery state CTA (tier 2, systems)

gallery page renders nothing if `items[]` is empty. this is the prime content area of the portfolio — should never be blank.

## fix

- add empty-state to `GalleryGridPage` (or equivalent): "no items yet" + link back to intro or contact
- keep the shell, binder tabs, and chrome visible
- match style of existing copy — terse, lowercase per project convention

## verification

- temporarily stub `items=[]` in dev and confirm the empty-state renders
- `pnpm test:run` green — add a test for the empty case
- remove the stub before committing

## depends on

- no blockers — autonomous-safe
