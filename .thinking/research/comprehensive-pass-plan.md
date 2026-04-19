---
domain: implementation-plan
confidence: high
last_updated: 2026-04-09
tags:
  - tinamation-comprehensive-pass
  - files
  - agent
  - comprehensive-pass
  - agent-act-plan
  - tinamation-comprehensive
  - mui-joy-migration
  - phase
---










#tinamation-comprehensive-pass #files #agent #comprehensive-pass #agent-act-plan #tinamation-comprehensive #mui-joy-migration #phase


# tinamation comprehensive pass — agent-act plan

> **status: executed 2026-04-09** — all 3 phases, 8/8 worktrees merged. see `notes/2026-04-09T13-22-agent-act.md`.

## context

- v2 flipbook is the primary product, v1 is legacy
- supabase project live at ztpvqdqngykfrtqzyddy.supabase.co (schema exists, 0 data, 0 storage)
- tiers 1-2 already completed (feb 8 agent-act sessions)
- wix-assets exist in old repo at ../tinamation/scripts/ and ../tinamation/wix-assets/
- bare repo with main worktree at tinamation.git/main/

## supabase status (verified 2026-04-09)

- project: live, responding 200s
- storage buckets: none created
- tables: sections (0 rows), artworks (0 rows), inquiries (0 rows)
- needs: bucket creation, asset upload, content seeding

## phase 1 — foundation (parallel, file-disjoint)

### agent 1: auth & security
- consolidate admin on nextauth — remove NEXT_PUBLIC_ADMIN_USER/NEXT_PUBLIC_ADMIN_PASS
- replace AdminLogin.tsx sessionStorage auth with nextauth sign-in
- add env var validation module (src/lib/env.ts)
- add rate limiting to POST /api/inquiries
- update BookBack.tsx with aria-hidden when book isn't flipped
- update .env.example
- files: AdminLogin.tsx, BookBack.tsx, auth/config.ts, env.ts (new), api/inquiries/route.ts, .env.example

### agent 2: route + hydration + navigation
- change root redirect / → /v2 (src/app/page.tsx)
- fix hydration mismatch on LandingPage (framer-motion SSR)
- fix resume tab navigation (investigate sectionMappings)
- add SEO metadata for /v2
- files: src/app/page.tsx, LandingPage.tsx, v2/page.tsx or v2/layout.tsx

### agent 3: performance — animation system
- FurlingPage.tsx: useState progress → useRef + direct DOM manipulation
- FurlingRiffle.tsx: same pattern
- PageStack: reduce edge elements 30 → 10-15, memoize
- FlippedPagesStack: reduce layers 30 → 8
- scope willChange to active animations only
- files: FurlingPage.tsx, FurlingRiffle.tsx, PageStack.tsx, FlippedPagesStack.tsx, BendingPages.tsx

### agent 4: test infrastructure
- add vitest + @testing-library/react
- configure with tsconfig path aliases
- tests: FlipBookContext reducer, portfolio-content helpers, /api/inquiries, youtube.ts
- files: all new (vitest.config.ts, __tests__/, etc)

### agent 5: supabase setup + asset upload
- create storage buckets (images public, videos public)
- copy wix-assets from old repo
- upload assets using existing upload script or write new one
- seed sections + artworks tables from portfolio-content.ts data
- verify public URLs work
- files: scripts/, supabase/, possibly new seed script

## phase 2 — UX (after phase 1)

### agent 6: mobile (tier 3 — all 8 items)
- 3.1 scroll indicator on MobileNav
- 3.2 fix nav overlapping content
- 3.3 convert nav to proper buttons with ARIA
- 3.4 safe area insets
- 3.5 hide BinderTabs on mobile
- 3.6 tablet breakpoint (sm @ 768px)
- 3.7 scope hover to @media (hover: hover)
- 3.8 swipe affordance
- files: MobileNav.tsx, BinderTabs.tsx, various page components

### agent 7: accessibility (tier 6 — all 5 items)
- 6.1 ARIA on BinderTabs
- 6.2 admin form aria-hidden (coordinate with auth agent)
- 6.3 remove manual reduced-motion toggle from UI
- 6.4 CloudBackground prefers-reduced-motion CSS
- 6.5 increase touch targets on mobile
- files: BinderTabs.tsx, DebugOverlay.tsx, CloudBackground.tsx, gallery components

### agent 8: content wiring
- wire dynamic-content.ts → PageStack rendering
- replace static imports with fetchAllPageContent/fetchGalleryData
- add loading states + error fallbacks
- add error boundaries around content sections
- update portfolio-content.ts to reference supabase URLs
- files: dynamic-content.ts, PageStack.tsx, new ErrorBoundary component

## phase 3 — polish (after phase 2)

### agent 9: visual polish (tier 4 selective)
- 4.1 content entrance animation (framer-motion fade-in after flip)
- 4.6 adaptive gallery for sparse sections
- 4.7 book entrance animation on load
- 4.4 fix header visibility when deep in book
- CloudBackground pause when modals open / page hidden
- files: page content components, CloudBackground.tsx

### agent 10: integration validation
- browser-based verification using playbook
- additional tests for new features
- final tsc --noEmit + pnpm lint

## excluded (and why)

- tier 5 placeholder content — needs christina's real text/descriptions
- 4.2 custom video presentation — large standalone refactor
- 4.3 display typeface — design decision for christina
- next-auth v4→v5 — working fine, separate effort
- MUI Joy migration — monitoring only

## decisions to document as they happen

- performance thresholds (stack layer counts, etc)
- auth flow design for flipbook admin
- content loading strategy (SSG vs runtime vs ISR)
- any tier 4 additions/skips
