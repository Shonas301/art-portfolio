---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 2
audit_item: 16
tags:
  - design-audit
  - systems
  - craft
  - transition-all
  - perf
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #craft #transition-all #perf

# #16 — `transition: 'all'` sweep (tier 2, systems/craft)

14 instances of `transition: 'all ...'` across `src/` — risks jank (forces animation of every changing property, incl. layout) and reads as low-craft.

## fix

- grep: `grep -rn "transition.*all" main/src/` (last audit count 14, incl. `theme.ts:110,118`)
- replace each `all` with explicit property list — typically `transform, opacity, color, box-shadow` depending on what's actually animating
- never animate `width`/`height` unless unavoidable; prefer `transform: scale()` or `transform: translateX()`

## verification

- `pnpm test:run` green
- `npx tsc --noEmit` clean
- visual at `/v2`: hover states still transition smoothly
- DevTools → Rendering → Paint flashing — no layout flashes on hover

## depends on

- related to #7 (already done for BinderTabs) — extend the same treatment site-wide
