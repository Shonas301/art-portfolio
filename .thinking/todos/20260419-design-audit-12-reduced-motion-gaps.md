---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 2
audit_item: 12
tags:
  - design-audit
  - craft
  - prefers-reduced-motion
  - a11y
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #craft #prefers-reduced-motion #a11y

# #12 — prefers-reduced-motion gaps (tier 2, craft)

flipbook layer correctly gates motion via `FlipBookContext`. shell chrome does not. three specific gaps:

- `BoundaryFeedback` — motion not suppressed
- `MobileNav.swipeHintFade` — animates unconditionally
- `LandingPage` hint bounce — unconditional
- (also) chrome CSS transitions not suppressed via `@media (prefers-reduced-motion: reduce)`

## fix

- read `prefersReducedMotion` from `FlipBookContext` (or `window.matchMedia('(prefers-reduced-motion: reduce)')`) and short-circuit animations in each component
- add `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }` fallback in `globals.css`

## verification

- system setting → Reduce Motion → reload `/v2` — no shell animations
- `pnpm test:run` green
- `npx tsc --noEmit` clean

## depends on

- no blockers — autonomous-safe
