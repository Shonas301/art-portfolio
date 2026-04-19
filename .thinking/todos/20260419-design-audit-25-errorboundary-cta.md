---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 3
audit_item: 25
tags:
  - design-audit
  - systems
  - error-boundary
  - cta
  - polish
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #error-boundary #cta #polish

# #25 — ErrorBoundary "try again" + support CTA (tier 3, systems)

`ErrorBoundary` shows "this page couldn't load" with no actionable path forward.

## fix

- add "try again" button → resets boundary state (or `window.location.reload()` as fallback)
- add support email link (mailto: to tina's address — check `contact/page.tsx` for canonical email)
- keep the visual treatment restrained; error state, not a feature
- apply freed `danger` semantic slot here after #24 lands

## verification

- temporarily throw in a child component → boundary catches → both CTAs visible
- click "try again" → component remounts, error clears
- `pnpm test:run` green — add boundary test for the CTAs
- `npx tsc --noEmit` clean

## depends on

- #24 — ideally use the semantic `danger` slot post-rename
