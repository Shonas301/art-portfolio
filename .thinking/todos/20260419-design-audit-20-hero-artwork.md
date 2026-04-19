---
type: todo
status: pending
created: 2026-04-19
stream: tinamation
tier: 2
audit_item: 20
tags:
  - design-audit
  - foundations
  - taste-dependent
  - hero
  - landing
related:
  - 2026-04-17-design-audit.md
  - 2026-04-17-design-audit-resume.md
---

#design-audit #foundations #taste-dependent #hero #landing

# #20 — hero artwork selection (tier 2, foundations) — TASTE-DEPENDENT

portfolio site whose first viewport is a headline + nav chrome, no artwork. anti-pattern for a visual portfolio.

## options

**A.** add a best-in-class 3d render behind/beside the hero headline on `LandingPage`. keep the "welcome to" framing.
**B.** drop the welcome page entirely; open `/v2` directly on a curated piece (edit the redirect in `src/app/page.tsx` or equivalent).

## process when resuming

1. survey `portfolio-content.ts` (and supabase `artworks` table) for the strongest single piece — 3d render preferred for immediate craft read
2. confirm with user (Christina) — her taste, not ours
3. if option A: composite the render into `LandingPage` behind hero, test contrast at hero H1 letter-spacing `-0.025em`
4. if option B: change default route target; update metadata/OG images

## verification

- `pnpm test:run` green
- WCAG contrast at hero heading — 3:1 min (large text) against whatever bg the piece provides
- mobile 390×844 — render must not crowd the CTA

## blockers

- needs Christina's pick on option + specific piece — do not spawn autonomously
