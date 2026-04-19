---
stream: next-cookiecutter
started: 2026-02-01
last_active: 2026-04-12
status: active
branches: []
parent: null
tags:
  - tinamation
  - next-cookiecutter-focus-building
  - streams
  - auth
  - patterns
  - template
  - mui
  - supabase
---












#tinamation #next-cookiecutter-focus-building #streams #auth #patterns #template #mui #supabase


# next-cookiecutter

## focus

building a reusable cookiecutter/scaffold for new next.js projects based on patterns from the [[tinamation/streams/tinamation|tinamation]] codebase. extracting what works into a repeatable starting point for future projects.

## initial thoughts

starting angles:
- **what to keep vs drop**: figuring out which patterns from [[tinamation/streams/tinamation|tinamation]] belong in a template (theme system, supabase integration, auth flow, api route structure) and which are project-specific (flipbook, gallery, portfolio content)
- **stack decisions**: mui joy is beta with uncertain future — evaluate alternatives. auth patterns (nextauth v4 vs auth.js v5). database choices (supabase vs prisma vs drizzle). styling approach (emotion vs tailwind vs css modules)
- **monorepo vs single**: whether the template should support turborepo/nx monorepo patterns or stay single-package. tradeoffs for shared libs, multiple apps, deploy targets

---

## notes

### 2026-02-01

stream started. this grows from the deep analysis of [[tinamation/streams/tinamation|tinamation]] — the concerns doc surfaced several patterns worth standardizing (env var validation, error boundaries, test infrastructure) and several to avoid (dual auth systems, beta dependencies, hardcoded colors instead of theme tokens).

key questions to explore:
- what's the ideal next.js 15 starter in 2026? what has the ecosystem settled on?
- which [[tinamation/streams/tinamation|tinamation]] patterns are genuinely good vs just happened to work?
- should the cookiecutter be opinionated (one right way) or configurable (choose your stack)?
- how do you handle the "template drift" problem — keeping the template updated as deps evolve?

### 2026-02-08

deep research session with 2 parallel agents: (1) codebase pattern analysis, (2) next.js 15 ecosystem research.

**decisions made:**
- **opinionated template** — owner's preferences first, others second
- **single-app** — no monorepo/turborepo, unnecessary complexity for single projects
- **keep stack**: next.js 15, react 19, mui joy (beta acknowledged), supabase, emotion, pnpm
- **keep patterns**: project structure, strict TS config, eslint flat config, ThemeProvider pattern, API route patterns, SWR hooks, path aliases, metadata exports
- **drop**: all flipbook/animation code, portfolio content, cloudinary, dual auth, v1/v2 parallel routes, color scheme (make configurable)
- **template drift**: deliberately ignored — not solving this problem

**critical finding — auth decision:**
use supabase auth directly, NOT auth.js/nextauth. supabase auth integrates with RLS via `auth.uid()` in policies. auth.js + supabase adapter creates dual-auth friction (the exact anti-pattern [[tinamation/streams/tinamation|tinamation]] has with nextauth + client-side sessionStorage).

**additions to template (missing from [[tinamation/streams/tinamation|tinamation]]):**
- t3-env + zod for env validation (replaces non-null assertions)
- vitest + testing-library + playwright (zero test infra in [[tinamation/streams/tinamation|tinamation]])
- prettier for formatting
- husky + lint-staged for pre-commit quality gate
- github actions CI/CD pipeline
- error boundaries (error.tsx + component-level)
- .env.example documentation
- server actions for mutations (not just API routes)
- route groups: (public)/ and (auth)/ for layout separation

**mui joy risk:**
still beta, development slowed. fine for owner's projects. pin version. material ui v6 is lateral escape hatch (same @mui/system foundation). community is moving toward shadcn/ui + tailwind but that's a fundamentally different styling approach.

**ecosystem consensus (2026):**
- server-first RSC model, server actions for mutations, direct DB calls in server components
- vitest won over jest, playwright won over cypress
- eslint flat config is the standard, prettier still dominant formatter
- t3-env is the env validation standard
- supabase + @supabase/ssr is the recommended integration pattern

**first consumer:**
[[bunnymuffins/streams/bunnymuffins-redux|bunnymuffins-redux]] project started at /Users/jasonshipp/code/personal/[[bunnymuffins/streams/bunnymuffins-redux|bunnymuffins-redux]] — re-envisioning a TFT streamer's website. architecture stream seeded with all decisions from this research.

### 2026-04-12

**reversal: mui joy → material ui v7**

priorities shifted in the last ~2 months. goal is still an excellent, well-engineered starting point, but defaults shouldn't bend over backward for craft. beta libraries create preemptive friction and require more design opinions to "look okay" out of the box. material ui ships pre-themed with MD3 — less work to reach an acceptable baseline, more time for project-specific work.

**cascading decisions from the switch:**
- **material ui v7**, not v6 — want the modern feel (MD3 defaults, newer component APIs)
- **emotion stays** — v7 still defaults to emotion; pigment-css is the roadmap but migration work at bootstrap isn't worth it. the "modern feel" comes from v7's components, not the styling engine
- **drop the custom ThemeProvider wrapper pattern** — use `CssVarsProvider` with a minimal theme override file. the tinamation pattern of centralizing theme tokens was a craft move; projects override when they actually need to
- **drop "configurable color scheme" from the template adds** — accept MD3 defaults, let projects override in one file if needed. the old lesson from tinamation (don't hardcode colors) still holds, but the answer isn't "make it configurable," it's "inherit from framework defaults"
- **roboto + material icons baked in** — don't fight the framework

**shadcn/ui acknowledgment:**
shadcn/ui + tailwind is the community direction for teams that want pre-themed + ship-fast, which is the same pressure driving this reversal. consciously choosing MUI v7 over shadcn for **continuity** reasons — existing fluency with the @mui/system foundation, SWR+emotion stack coherence, pattern familiarity from [[tinamation/streams/tinamation|tinamation]]. not a rejection of shadcn on merits.

**open question:**
when/if to revisit pigment-css migration — probably when v7 makes it the default, not before.
