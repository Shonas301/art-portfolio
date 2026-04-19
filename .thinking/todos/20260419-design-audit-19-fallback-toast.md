---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 2
audit_item: 19
tags:
  - design-audit
  - systems
  - supabase
  - static-fallback
  - dev-only
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #systems #supabase #static-fallback #dev-only

# #19 — dev-mode toast on static fallback (tier 2, systems)

when supabase content fetch fails, `portfolio-content.ts` static fallback fires silently. good for resilience in prod, bad for admin debugging — no signal that the live data isn't flowing.

## fix

- in the fetch path that chooses between supabase and static, log a single warning when fallback fires: prefix with `[tinamation:fallback]` and include the fetch error
- in dev mode only (`process.env.NODE_ENV === 'development'`), surface as a MUI Joy toast / snackbar at bottom-right
- don't spam — log once per mount, use a ref or module-level flag

## verification

- kill supabase connection locally (bad env var or block hostname) → reload `/v2` → toast visible in dev; silent in prod build
- `pnpm test:run` green
- `npx tsc --noEmit` clean

## depends on

- supabase stream for fetch-path location
