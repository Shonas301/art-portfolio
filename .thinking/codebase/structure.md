# structure

**generated:** 2026-04-16
**focus:** directory layout, entry points, module boundaries, naming

## top level

```
main/
├── src/                    # all application code
├── public/                 # static assets (images, demo reel video, video frames)
├── supabase/migrations/    # sql schema migrations
├── scripts/seed-database.ts # one-off db seeder
├── .claude/                # project claude instructions
├── .thinking/              # tas context (streams, research, codebase docs)
├── next.config.ts          # next.js config
├── tsconfig.json           # @/* -> ./src/* alias, strict, ES2022
├── eslint.config.js        # eslint flat config
├── vitest.config.ts
├── vitest.setup.ts
├── package.json            # pnpm 10.10.0, next 15, react 19, mui joy 5-beta.52
├── spec.md                 # original v1 spec
└── .env.local              # supabase + google oauth + admin creds (gitignored)
```

## src/ tree (3 levels)

```
src/
├── __tests__/                              # vitest suite, 1049 loc across 4 files
│   ├── api-inquiries.test.ts               # 275 loc - api route handler
│   ├── FlipBookContext.test.tsx            # 589 loc - reducer coverage
│   ├── portfolio-content.test.ts           # 112 loc - data integrity
│   └── youtube.test.ts                     #  73 loc - url parser
├── app/                                    # next.js app router
│   ├── layout.tsx                          # root: ThemeProvider + LayoutContent
│   ├── page.tsx                            # root: redirect('/v2')   <-- entry
│   ├── 2d-work/page.tsx                    # redirect -> /v2#2d-work
│   ├── 3d-work/page.tsx                    # redirect -> /v2#3d-work
│   ├── code/page.tsx                       # redirect -> /v2#code
│   ├── contact/page.tsx                    # redirect -> /v2#contact
│   ├── demo-reel/page.tsx                  # redirect -> /v1/demo-reel (NOTE: v1 target)
│   ├── intro/page.tsx                      # redirect -> /v2#intro
│   ├── pandy-series/page.tsx               # redirect -> /v2#pandy-series
│   ├── resume/page.tsx                     # redirect -> /v2#resume
│   ├── admin/                              # cms ui
│   │   ├── page.tsx
│   │   └── artworks/
│   ├── api/                                # route handlers
│   │   ├── artworks/
│   │   ├── auth/[...nextauth]/
│   │   ├── inquiries/
│   │   ├── sections/
│   │   ├── settings/
│   │   └── upload/
│   ├── v1/                                 # legacy gallery site (still reachable)
│   │   ├── page.tsx
│   │   ├── 2d-work/
│   │   ├── 3d-work/
│   │   ├── code/
│   │   ├── contact/
│   │   ├── demo-reel/
│   │   ├── pandy-series/
│   │   └── resume/
│   └── v2/                                 # primary product: flipbook
│       ├── layout.tsx                      # wraps children in ThemeProvider (second instance)
│       ├── page.tsx                        # 398 loc - FlipBookContent orchestrator
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       └── utils/
├── assets/                                 # legacy vite svg
├── components/                             # shared ui (v1 + v2)
│   ├── ArtworkDetailModal.tsx              # 20k, used by v2 GalleryGridPage
│   ├── Banner.tsx                          # v1-only top nav (hardcoded paths to /v1/*)
│   ├── Footer.tsx                          # v1-only
│   ├── GalleryGrid.tsx                     # shared grid, v1 pages + v2 GalleryGridPage
│   ├── GalleryModal.tsx                    # v1 modal
│   ├── InquiryForm.tsx                     # contact form
│   ├── InquiryModal.tsx
│   ├── Layout.tsx                          # legacy wrapper, unused by app router
│   ├── LayoutContent.tsx                   # routes chrome: strips banner/footer for /v2
│   ├── ShareableLink.tsx
│   ├── SocialShareButtons.tsx
│   └── ThemeProvider.tsx                   # MUI Joy CssVarsProvider wrapper
├── hooks/                                  # shared SWR hooks for api routes
│   ├── useArtworks.ts
│   ├── useInquiries.ts
│   └── useSections.ts
├── lib/                                    # infrastructure
│   ├── env.ts                              # required/optional env accessors, throws at read
│   ├── theme.ts                            # MUI Joy theme (purple/pink/amber)
│   ├── youtube.ts                          # url parser
│   ├── auth/config.ts                      # NextAuth google oauth
│   ├── cloudinary/config.ts                # 7.7k — sdk + url helpers
│   ├── content/dynamic-content.ts          # supabase-with-fallback loader
│   └── supabase/
│       ├── client.ts                       # getClient() singleton for browser
│       ├── server.ts                       # 4 server client factories
│       └── types.ts                        # hand-written Database schema type
├── styles/globals.css                      # 121b reset only
└── types/gallery.ts                        # GalleryItem interface (shared)
```

## entry points

| path | purpose |
|------|---------|
| `src/app/page.tsx:4` | root route, `redirect('/v2')` — v2 is the primary product |
| `src/app/layout.tsx` | root layout, wraps in `<ThemeProvider><LayoutContent>` |
| `src/app/v2/layout.tsx` | nested layout, wraps in another `<ThemeProvider>` (double-wrap is intentional since LayoutContent strips chrome but doesn't un-theme) |
| `src/app/v2/page.tsx:389` | `V2Page`: `<AnalyticsProvider><FlipBookProvider><FlipBookWithAnalytics>` |
| `src/app/v1/page.tsx` | v1 landing (`'use client'`, inline data) |
| `src/app/admin/page.tsx` | cms admin landing (1.3k) |
| `src/app/admin/artworks/page.tsx` + `ArtworkManager.tsx` | 28.8k artwork crud ui |

**root-level legacy slugs** (`/2d-work`, `/3d-work`, `/code`, `/contact`, `/intro`, `/pandy-series`, `/resume`) all redirect to `/v2#<hash>`. `/demo-reel` redirects to `/v1/demo-reel` (the one outlier — `demo-reel` has no v2 section).

## module boundaries

**shared code** lives at `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`. importable from anywhere via `@/...`.

**v2-scoped code** lives inside `src/app/v2/*/`. subdirs `context/`, `components/`, `data/`, `hooks/`, `utils/` are v2-only and not intended for reuse.

**shared component crossover** into v2:
- `@/components/GalleryGrid` imported by `src/app/v2/components/pages/GalleryGridPage.tsx`
- `@/components/ArtworkDetailModal` imported by same
- `@/lib/content/dynamic-content` imported by `src/app/v2/components/PageStack.tsx:13`
- `@/types/gallery` GalleryItem imported by `src/app/v2/data/portfolio-content.ts:1`

**v1-scoped code** lives inside `src/app/v1/*/page.tsx`. each page file has `'use client'` + hardcoded `galleryItems` array + GalleryGrid/GalleryModal. `Banner.tsx`/`Footer.tsx` are v1-only chrome, enforced by `LayoutContent.tsx:10` which checks `pathname?.startsWith('/v2')`.

**api routes** in `src/app/api/` consume `@/lib/supabase/server` and `@/lib/auth/config`. never imported by v2 flipbook directly — v2 reads supabase through the browser client via `dynamic-content.ts`.

## naming

**files:**
- react components → `PascalCase.tsx` (`FurlingPage.tsx`, `PageStack.tsx`, `GalleryGridPage.tsx`)
- hooks → `useThing.ts` (`useTouchInput.ts`, `useArtworks.ts`)
- utilities/data → `kebab-case.ts` (`portfolio-content.ts`, `furling-utils.ts`, `dynamic-content.ts`)
- types → `kebab-case.ts` (`gallery.ts`)
- config modules → `kebab-case.ts` or `config.ts` (`theme.ts`, `client.ts`, `server.ts`)
- next.js route files → literal `page.tsx`, `layout.tsx`, `route.ts`
- tests → `Thing.test.tsx` / `thing.test.ts` in `src/__tests__/`

**directories:**
- route segments → kebab-case (`3d-work/`, `pandy-series/`, `demo-reel/`)
- feature dirs inside v2 → lowercase singular/plural (`context/`, `components/`, `pages/`, `hooks/`, `utils/`, `data/`)
- dynamic segments → `[id]/`, `[...nextauth]/`

**exports:**
- components → named: `export function PageStack()`
- providers + hooks → named pair: `FlipBookProvider` / `useFlipBook`
- constants → UPPER_SNAKE_CASE: `TOTAL_PAGES`, `SINGLE_PAGE_CONFIG`, `Z_LAYERS`, `MAX_VISIBLE_EDGES`
- types/interfaces → PascalCase: `FlipBookState`, `PageContent`, `BendingPage`
- default exports → only next.js page/layout components

## where shared code lives

| need | location | example file |
|------|----------|--------------|
| reusable UI used by v1 and v2 | `src/components/` | `GalleryGrid.tsx`, `ArtworkDetailModal.tsx` |
| SWR hooks over api routes | `src/hooks/` | `useArtworks.ts` |
| supabase clients | `src/lib/supabase/` | `client.ts`, `server.ts` |
| auth / third-party config | `src/lib/auth/`, `src/lib/cloudinary/` | `config.ts` |
| content loader (supabase + fallback) | `src/lib/content/dynamic-content.ts` | — |
| env var accessors | `src/lib/env.ts` | — |
| joy theme | `src/lib/theme.ts` | — |
| cross-cutting types | `src/types/` | `gallery.ts` |

## where v2-internal code lives

| need | location |
|------|----------|
| reducer / state / provider / hook | `src/app/v2/context/FlipBookContext.tsx` |
| analytics (localStorage) | `src/app/v2/context/AnalyticsContext.tsx` |
| physical page model + static content | `src/app/v2/data/portfolio-content.ts` |
| animation math (pure) | `src/app/v2/utils/furling-utils.ts` |
| touch/wheel input handler | `src/app/v2/hooks/useTouchInput.ts` |
| content page renderers | `src/app/v2/components/pages/` |
| everything else v2 | `src/app/v2/components/` |

## where to add new code

**new v2 section:**
1. add entry to `pageContent` in `src/app/v2/data/portfolio-content.ts:86`
2. add mapping to `sectionMappings` at `portfolio-content.ts:27` (pick a physical page index)
3. add page component to `src/app/v2/components/pages/`
4. add case to `renderPageContent` switch in `src/app/v2/components/PageStack.tsx:66`
5. update `sectionToContentIndex` in `PageStack.tsx:30`
6. `BinderTabs` (`src/app/v2/components/BinderTabs.tsx:42`) and `MobileNav` pick up the new section automatically via `sectionMappings`
7. if content should be database-driven, extend `fetchAllPageContentClient` in `src/lib/content/dynamic-content.ts:51`

**new v1 route:** create `src/app/v1/<slug>/page.tsx` with `'use client'` + inline gallery data. add entry to `navItems` in `src/components/Banner.tsx:9`.

**new api endpoint:** `src/app/api/<resource>/route.ts`. follow existing pattern: `createRouteHandlerClient` from `@/lib/supabase/server`, session check via `getServerSession(authOptions)`, return `NextResponse.json({ error }, { status })` on failure.

**new shared component:** `src/components/PascalName.tsx` with `'use client'` if it uses hooks. import as `@/components/PascalName`.

**new v2 animation component:** drop in `src/app/v2/components/`. pure math → add to `src/app/v2/utils/furling-utils.ts`. if it needs state, `useFlipBook()` from context.

**new v2 hook:** drop in `src/app/v2/hooks/`. follow `useTouchInput.ts` shape — accept a ref, `useFlipBook()`, attach listeners in `useEffect`, return nothing.

**new supabase migration:** append numbered sql to `supabase/migrations/` (next is `002_*.sql`). hand-update `src/lib/supabase/types.ts` Database interface.

## config files reference

| file | purpose |
|------|---------|
| `tsconfig.json` | ES2022, strict, noUnusedLocals/Parameters, `@/* -> ./src/*` |
| `next.config.ts` | image remote patterns, strict linting on build |
| `eslint.config.js` | flat config, next + typescript-eslint |
| `vitest.config.ts` / `vitest.setup.ts` | jsdom env, `@testing-library/jest-dom` |
| `.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, google oauth, admin creds |
| `public/output/720p_animation.mp4` | 76mb demo reel, referenced by v1 `demo-reel/page.tsx` |
| `public/output/frames/` | extracted thumbnails |
