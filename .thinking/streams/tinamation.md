---
stream: tinamation
started: 2026-02-01
last_active: 2026-04-19
status: active
primary: true
branches: []
parent: null
tags:
  - artist-portfolio-app
  - fixing-existing-behavior
  - mui-joy
  - mui-joy-beta
  - tinamation-focus-planning
  - notes
  - public
  - fixing-existing
---












#artist-portfolio-app #fixing-existing-behavior #mui-joy #mui-joy-beta #tinamation-focus-planning #notes #public #fixing-existing


# tinamation

## focus

planning changes/updates and debugging/fixing existing behavior in this 3d artist portfolio app (next.js 15 + mui joy + v2 flipbook).

## codebase context

see .thinking/codebase/ for detailed analysis:
- structure.md - directory organization, entry points, routing
- stack.md - technologies and dependencies (next.js 15, react 19, mui joy beta, framer-motion, supabase, cloudinary)
- conventions.md - code patterns, naming, styling approach
- architecture.md - system design, flipbook reducer, rendering layers, data flow
- testing.md - test approach (none configured — zero test coverage)
- integrations.md - external services (supabase, cloudinary, nextauth, youtube/vimeo)
- concerns.md - issues, tech debt, bugs, performance, security

## key findings from deep analysis

### bugs found
- inquiry form submission always fails (camelCase/snake_case field name mismatch between form and api)
- resume download button is a no-op (no click handler or href)
- FLIP_BOOK_OVER/FLIP_BOOK_BACK produce identical state transitions (direction not encoded in action)
- TOUCH_INPUT modifies currentPageIndex bypassing the animation state machine

### security
- admin credentials exposed in client bundle via NEXT_PUBLIC_ env vars
- no rate limiting on public inquiry endpoint
- non-null assertions on env vars cause runtime crashes if missing

### performance
- 1.5gb of image frames in public/output/frames/ (mostly unused)
- requestAnimationFrame + useState causes 60 react re-renders/second during animations
- 30+ willChange elements create excessive gpu compositing layers
- PageStack and FlippedPagesStack each render up to 30 dom elements for edge effects

### tech debt
- dual admin auth systems (nextauth vs client-side sessionStorage)
- dynamic content layer (supabase cms) fully wired but disconnected from rendering
- placeholder content throughout (lorem ipsum, all videos same url, edward elric resume)
- mui joy on beta with uncertain roadmap
- next-auth v4 (legacy) with next.js 15

### missing infrastructure
- zero test files or test framework
- no error boundaries
- no ci/cd pipeline
- no analytics/monitoring

### ast cache
- 270 files indexed, 19,223 symbols, 56,553 call sites
- available for structural queries via /tas:index-ast

---

## notes

### 2026-02-01

initialized thinking for tinamation.
codebase analyzed at deep depth across 4 parallel agents (tech, arch, quality, concerns).
7 analysis documents produced (98kb total).

ready to explore.

### 2026-02-08

tier 1 bug fixes executed via agent-act (5 agents, 5/5 completed).
followed by tier 2 nav improvements (6 agents, 6/6 completed).
this was the first real remediation pass — tackled the critical bugs and ux issues
surfaced during the deep analysis.

see: `notes/2026-02-08T00-11-agent-act.md` (tier 1), `notes/2026-02-08T09-47-agent-act.md` (tier 2).

### 2026-03-08

re-ran `/tas:init` to refresh codebase analysis. `.context/` was missing — created it.
spawned 4 deep analysis agents again (tech, arch, quality, concerns).
tech agent completed (stack.md + integrations.md). concerns agent finished analysis
but was blocked on file write permissions — had to extract output from agent transcript
manually. this was a codebase re-mapping after the feb 8 fixes changed things.

### 2026-04-08

converted repo from normal clone to bare clone + worktrees via `/tas:convert-worktree`.

- original: `/Users/jasonshipp/code/friends/tinamation` (normal clone)
- target: `/Users/jasonshipp/code/friends/tinamation.git` (bare clone)
- branches: main, v1 — both got worktrees
- .thinking/ preserved at bare repo level (shared across worktrees)
- remote fixed to `git@github.com:Shonas301/art-portfolio.git`
- stash restoration hit complications (untracked files + rtk proxy interference),
  resolved by manual extraction
- ORIGIN.md created for v1 worktree, obsidian vault refreshed

this is now the canonical repo layout. all dev work happens in `main/` worktree.

### 2026-04-09

comprehensive improvement pass — 8 worktrees, 40 files changed, 88 tests added.
covered auth/routing, performance, supabase integration, mobile/responsive,
accessibility, content/copy, visual polish, and test infrastructure.
this was the big push to production-ready quality.

see: `notes/2026-04-09T13-22-agent-act.md` (8/8 worktrees merged).

**bug found during visual verification (same session):**
`NEXT_PUBLIC_` env vars weren't reaching the browser bundle because `src/lib/env.ts`
used a dynamic `process.env[key]` lookup pattern. next.js only inlines public vars
when referenced as literal strings (`process.env.NEXT_PUBLIC_X`). fixed in a follow-up
commit. regression risk: if env.ts is ever refactored to use dynamic key access,
supabase content will silently fall back to static data.

**bug fixed (binder tabs depth offset):**
binder tab positioning uses `depthInStack * 1.5` offset (up to 40px), combined with
shrinking tab widths, creating a jagged staircase when on page 0. reduced max offset
to 8px and fixed tab width at 100px. see `notes/2026-04-09-bug-binder-tabs-drift.md`.

**bug iteration protocol established:**
`/bugfix` slash command saved to project `.claude/commands/bugfix.md`. 6-step protocol:
verify + screenshot → record in TAS → track down (no guessing) → fix surgically →
test in code + agent-browser → confirm with user.


### 2026-04-13

**hosting decision made:** deploy to `tina.shippit.live` on hetzner VPS (`87.99.130.166`).
stack: caddy + systemd + pnpm (no docker). VPS is a clean Ubuntu 24.04 slate.
supabase stays hosted (not self-hosted). DNS via Cloudflare.

full deployment plan in `streams/deploy-tinamation.md`. plan not yet executed —
blocked on owner completing Cloudflare DNS records + Google OAuth redirect URI update.


### 2026-04-17

**design audit — tier-1 shell + display face landed.** commit `eee34fc` on main worktree. see `main/.thinking/notes/2026-04-17-design-audit.md` for full audit, `main/.thinking/notes/2026-04-17-design-audit-resume.md` for resume-point + next-batch queue.

**picks (preserved for future revisit):**
- display typeface: **Cormorant** (wired via `next/font/google` → `theme.ts` `fontFamily.display`)
- shell palette: **warm cream `#faf8f3`** body + **amber `#b45309`** accent
- rejected candidates + 12-variant matrix preserved at `main/mockups/{hero-typography,shell-palette}.html` + `-PICK.md`

**what shipped:** WCAG AA fixes (#1-3), Cormorant wire (#4), flat cream shell (#5), BinderTabs transition explicit (#7), `#000000` → `#111827` sweep (#9), easing tokens (#11), chrome accent (#13), hero letter-spacing (#14), optical-sizing + font-features (#21). 20 files changed, 949+/120-, 88/88 tests pass, typecheck clean.

**paused here, next batch unblocked:**
- #6 shadow consolidation (15 → 4 elevation tokens) — autonomous-safe
- #8 font-size scale (10 → 6-8) + ResumeModal overrides — autonomous, Cormorant-aware
- #15 drop weight 500 (rebalance to 400/600/700) — autonomous

**still deferred:** #20 hero artwork selection (taste), and the tier-2/3 polish backlog (#10, #12, #16-19, #22-25) not yet scheduled.

resolves the 2026-04-17 display-typeface decision (see `notes/2026-04-17-display-typeface-shortlist.md` — marked resolved) and closes the display-typeface todo.

### 2026-04-17 (later)

**codebase re-mapped with opus 4.7** — re-ran `/tas:init`, 4 parallel mappers refreshed all 7 codebase docs. config.json patched to newer schema (added `content_type`, `scm`).

new findings worth surfacing:
- **2 new critical concerns (launch blockers):**
  - `public/` is gitignored but `/resume.pdf` and `/images/headshot.png` are referenced — both will 404 on deploy. see `codebase/concerns.md:44-58`. needs fix before launch.
  - deploy scripts still unwritten — blocks `deploy-tinamation` stream execution.
- **env var drift:** `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` + `NEXT_PUBLIC_BASE_URL` referenced in code but missing from `.env.example`.
- **stack delta:** vitest infra now captured, eslint-next@16/next@15 version pairing, pnpm version drift noted.
- **architecture delta:** `/` redirects to `/v2`, `TOTAL_PAGES=47`, new reducer actions (`SKIP_TO_TARGET`, `BOUNDARY_HIT`, `CLEAR_BOUNDARY`), PageStack wired to Supabase (was disconnected last map).
- **testing delta:** 88 tests pass in 2.16s. no CI. quote/semicolon style inconsistency documented.

**promotion candidates surfaced** (not auto-promoted — ready for `/tas:surface` if we want them in `.context/`):
- `v2-page-model.md` (47 pages, 7 fixed-index sections)
- `fallback-data-loading.md` (supabase + static fallback)
- `animation-state-reducer.md`
- `mui-joy-imports.md`
- `api-route-testing.md` (`_testResetRateLimit`)

many prior concerns resolved — this remap captures the state after the 2026-04-09 comprehensive pass and 2026-04-17 design audit tier-1 shell.

### 2026-04-19

**design-audit status re-verified against main/ code.** tier-1 shell + Cormorant still the last design work on main (commit `eee34fc`, no subsequent design commits). next batch unblocked but not yet picked up.

**verified shipped:**
- tier-1: #1 amber `#b45309` WCAG fix (BinderTabs), #2 active-tab pink → `#be185d`, #3 hint `#44403c`, #4 Cormorant wired (`theme.ts:77`), #5 flat cream body + CloudBackground reduced to artist-name only, #7 BinderTabs explicit transition (width still animated), #9 `#000` → `#111827` sweep (only `ArtworkDetailModal:528` bgcolor remains — intentional)
- tier-2: #11 easing tokens in `globals.css:1-6`, #13 amber accent, #14 `letter-spacing: -0.025em` on hero
- tier-3: #21 `font-optical-sizing: auto` + `font-feature-settings` in globals.css

**still outstanding (counts verified 2026-04-19):**
- tier-1: #6 shadow consolidation (35 `box-shadow` sites, 0 `--elevation-*` tokens defined), #8 ResumeModal body-sm overrides (fontSize scale itself now 8 values — ok)
- tier-2: #10 radii (still 11 distinct borderRadius values incl. `28px` override in `theme.ts:106`), #12 reduced-motion gaps in BoundaryFeedback/MobileNav/LandingPage, #15 `fontWeight: 500` — 12 consumers, #16 `transition: 'all'` — 12 occurrences, #17 semantic tokens, #18 empty gallery state, #19 dev toast on fallback, #20 hero artwork
- tier-3: #22 non-square gaps, #23 off-grid spacing (MobileNav `50px`, BinderTabs `10px`, LandingPage `2rem`), #24 semantic slot rename, #25 ErrorBoundary CTA

**new todo captured:** `todos/20260419-design-audit-next-batch.md` — bundles #6 + #8 + #15 as the next autonomous-safe batch per resume doc.
