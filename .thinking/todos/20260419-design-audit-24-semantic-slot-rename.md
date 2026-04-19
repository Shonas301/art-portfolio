---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 3
audit_item: 24
tags:
  - design-audit
  - foundations
  - semantic-tokens
  - theme
  - breaking
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #foundations #semantic-tokens #theme #breaking

# #24 — color-semantic slot rename (tier 3, foundations)

MUI Joy color slots are being used decoratively rather than semantically:

- `danger=pink` — used decoratively (home/contact tabs), not for errors
- `warning=amber` — used for resume CTA (accent), not warnings

proper mapping:

- `primary=purple` (accent role)
- `accent=amber` (CTA role)
- free up `danger` for actual error states (e.g. ErrorBoundary — see #25)

## fix

- restructure `theme.ts` color palette slots
- grep every `color="danger"`, `color="warning"` consumer and re-point
- this is a breaking rename — sweep carefully

## verification

- `pnpm test:run` green — visual regressions likely in tests if any snapshot tests exist
- `npx tsc --noEmit` clean
- visual at `/v2` — no visible change (token refactor)
- confirm ErrorBoundary now uses `color="danger"` meaningfully (ties into #25)

## depends on

- coordinate with #25 so error states land on the freed `danger` slot
