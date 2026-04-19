# architecture

**generated:** 2026-04-16
**focus:** system design, data flow, state, v1/v2 separation, flipbook model

## overview

next.js 15 app router, react 19, mui joy 5-beta, framer-motion 12, supabase (postgres + storage). two parallel front-ends (v1 traditional gallery, v2 flipbook) share a root layout, theme, and component library. v2 is the primary product — `/` redirects to `/v2` (`src/app/page.tsx:4`). v1 remains reachable as a fallback.

all rendering is client-side. no server components for page content. data is loaded at mount via supabase browser client with a static fallback. api routes exist for a cms admin ui (`src/app/admin/`, `src/app/api/`).

## top-level component tree

```
RootLayout (src/app/layout.tsx)
└── ThemeProvider (MUI Joy CssVarsProvider)
    └── LayoutContent (src/components/LayoutContent.tsx:10 — branches on pathname)
        ├── /v2/*  -> children (no chrome)
        │   └── V2Layout (src/app/v2/layout.tsx — wraps in ThemeProvider AGAIN)
        │       └── V2Page (src/app/v2/page.tsx:389)
        │           └── AnalyticsProvider
        │               └── FlipBookProvider
        │                   └── FlipBookWithAnalytics
        │                       └── FlipBookContent
        │
        └── non-v2  -> Banner + <main>{children}</main> + Footer
            └── v1 pages / admin / root-level redirects
```

**double ThemeProvider wrap for v2 is intentional** — root layout wraps all children, v2 layout re-wraps. not a bug but worth knowing: state inside the inner provider is isolated.

## routing

| path | handler | behavior |
|------|---------|----------|
| `/` | `src/app/page.tsx:4` | `redirect('/v2')` |
| `/v2` | `src/app/v2/page.tsx:389` | flipbook spa, hash routing |
| `/v2#<section-id>` | same page | mount effect (`v2/page.tsx:73`) flips to section on load |
| `/v2#resume` | same page | opens ResumeModal |
| `/v2#admin` | same page | flips book over to AdminLogin/AdminDashboard |
| `/v1` | `src/app/v1/page.tsx` | v1 landing (`'use client'`) |
| `/v1/<slug>` | `src/app/v1/<slug>/page.tsx` | v1 gallery page with inline data |
| `/<slug>` (2d-work, 3d-work, code, contact, intro, pandy-series, resume) | redirect | `redirect('/v2#<slug>')` |
| `/demo-reel` | redirect | `redirect('/v1/demo-reel')` (no v2 equivalent) |
| `/admin`, `/admin/artworks` | `src/app/admin/*/page.tsx` | cms ui |
| `/api/*` | `src/app/api/*/route.ts` | rest endpoints |

**v2 hash routing** is entirely client-side — `window.history.replaceState` in `src/app/v2/page.tsx:51`. does not trigger navigation. valid hashes validated against `sectionMappings` at `v2/page.tsx:43`.

## v1 vs v2 separation

| concern | v1 | v2 |
|---------|----|----|
| location | `src/app/v1/` | `src/app/v2/` |
| chrome | Banner + Footer | full-bleed, no chrome (stripped by `LayoutContent.tsx:10`) |
| routing | next.js page-based | single page + hash |
| data | inline hardcoded per page | static fallback + supabase fetch |
| state | local `useState` | reducer + context |
| styling | linear-gradient headings, MUI Joy | paper-texture pages, 3d transforms |
| purpose | fallback, fast, simple | primary showcase |

boundary enforced at `src/components/LayoutContent.tsx:10` via `usePathname().startsWith('/v2')`. v1 pages import `@/components/{Banner,Footer,GalleryGrid,GalleryModal}`. v2 page components import `@/components/{GalleryGrid,ArtworkDetailModal}` for shared grid rendering.

## data flow: supabase -> client

```
┌─────────────────────┐
│ portfolio-content.ts│  static fallback (compiled into bundle)
│  sectionMappings    │
│  pageContent[]      │
└──────────┬──────────┘
           │ imported by
           ▼
┌─────────────────────┐     mount effect      ┌─────────────────────────┐
│ PageStack.tsx       │ ───fetchAllPageContentClient()──▶│ supabase browser client │
│ useState(content)   │                        │ (lib/supabase/client.ts)│
│ useEffect(fetch)    │                        └────────────┬────────────┘
└──────────┬──────────┘                                     │
           │ renderPageContent(physicalPage, content)       │ parallel queries:
           ▼                                                │  sections, site_settings,
┌─────────────────────┐                                     │  gallery_items join artworks
│ pages/*Page.tsx     │                                     ▼
│  LandingPage        │                         ┌───────────────────────┐
│  IntroPage          │                         │ postgres (supabase)   │
│  GalleryGridPage    │                         │  sections (7)         │
│  CodePage           │                         │  artworks (41)        │
│  ContactPage        │                         │  gallery_items (41)   │
└─────────────────────┘                         │  site_settings (5)    │
                                                │  inquiries            │
                                                └───────────────────────┘
```

**fetch path** (`src/lib/content/dynamic-content.ts:51`):

1. `PageStack.tsx:96` calls `fetchAllPageContentClient()` in a `useEffect` on mount. `isFetching` state gates a CircularProgress spinner (`PageStack.tsx:226`).
2. `dynamic-content.ts:23` checks for `NEXT_PUBLIC_SUPABASE_URL` and `_ANON_KEY` — if missing, returns static `pageContent` unmodified.
3. lazy-imports `@/lib/supabase/client` and calls `getClient()` (singleton at `lib/supabase/client.ts:19`).
4. parallel queries: `sections.select('*')` + `site_settings.select('*')`. then for each gallery section (`3d-work`, `2d-work`, `pandy-series`), fetches `gallery_items` joined with `artworks` via foreign key.
5. merges into the static `pageContent` shape: gallery data replaces `items[]`, intro/contact/code/landing merge settings into their `data` object.
6. any error at any step → `console.error` + returns static `pageContent`. **fallback is load-bearing** — site works fully offline from supabase.

**artwork -> GalleryItem converter** at `dynamic-content.ts:31` maps supabase `artworks` schema (snake_case, cloudinary_url, etc.) to the v2 GalleryItem shape defined in `src/types/gallery.ts`.

## v2 flipbook physical page model

**core invariant:** the flipbook simulates a 47-page physical book. 7 content sections are spread across it at specific physical page indices. pages between sections render blank (just a page number in the bottom corner, `PageStack.tsx:45`).

defined in `src/app/v2/data/portfolio-content.ts`:

```
TOTAL_PAGES = 47                        (portfolio-content.ts:4)

sectionMappings:                        (portfolio-content.ts:27)
  landing        -> physicalPage  0
  intro          -> physicalPage  7
  3d-work        -> physicalPage 14
  2d-work        -> physicalPage 22
  code           -> physicalPage 30
  pandy-series   -> physicalPage 38
  contact        -> physicalPage 46
```

```
page index:  0  ·  ·  ·  ·  ·  ·  7  ·  ·  ·  ·  ·  ·  14 ·  ·  ·  ·  ·  ·  ·  22 ·  ·  ·  ·  ·  ·  ·  30 ·  ·  ·  ·  ·  ·  ·  38 ·  ·  ·  ·  ·  ·  ·  46
section:     L              I              3D                     2D                     C                      P                      X
             landing        intro          3d-work                2d-work                code                   pandy-series           contact
```

**navigation uses physical page indices** (0-46) as the source of truth. section id ↔ physical page via helpers in `portfolio-content.ts:38-50`:
- `getPhysicalPageForSection(sectionId)` — id lookup
- `getSectionAtPage(physicalPage)` — returns SectionMapping or `null` if blank
- `getLastContentPage()` — returns 46 (contact)

**renderer** (`src/app/v2/components/PageStack.tsx:40`) does: physical page → section mapping → `sectionToContentIndex[id]` → `content[contentIndex]` → switch on `pageData.type`. returns `null` (blank) if not a section page.

## state management

### v2 flipbook reducer

single source of truth. defined in `src/app/v2/context/FlipBookContext.tsx`. consumed everywhere via `useFlipBook()` (line 355).

**state shape** (`FlipBookContext.tsx:6`):

```typescript
interface FlipBookState {
  currentPageIndex: number            // 0-46, physical page
  isFlipping: boolean                 // keyboard/tab nav active
  isRiffling: boolean                 // multi-page riffle active
  targetPageIndex: number | null      // destination during animation
  viewMode: 'grid' | 'carousel'       // gallery display
  resumeOpen: boolean                 // resume modal
  prefersReducedMotion: boolean       // a11y, detected + toggleable
  debugMode: boolean                  // debug overlay
  scrollAccumulator: number           // -100..100, touch drag
  scrollVelocity: number              // px/ms
  isEngaged: boolean                  // mid-touch
  bendingPages: BendingPage[]         // currently bending
  releasedPages: ReleasedPage[]       // flying to destination
  isBookFlipped: boolean              // viewing back (admin)
  isBookFlipping: boolean             // book flip animating
  adminAuthenticated: boolean         // admin session
  boundaryHit: 'start'|'end'|null    // edge feedback
}
```

**actions** (`FlipBookContext.tsx:39`):

| action | purpose | notes |
|--------|---------|-------|
| `FLIP_TO_PAGE` | navigate to physical page | guards: bounds, not already flipping, not same page. respects reduced motion by jumping instantly. |
| `FLIP_COMPLETE` | finalize animation | commits `targetPageIndex` to `currentPageIndex` |
| `SKIP_TO_TARGET` | skip mid-flight | fired by ArrowLeft/Right during animation (`v2/page.tsx:195`) |
| `TOGGLE_VIEW_MODE` / `SET_VIEW_MODE` | gallery mode | grid ↔ carousel |
| `OPEN_RESUME` / `CLOSE_RESUME` | resume modal | |
| `TOGGLE_REDUCED_MOTION` / `TOGGLE_DEBUG_MODE` | a11y/debug | Ctrl+Shift+M / Ctrl+Shift+D |
| `TOUCH_INPUT` | process drag delta | calculates `bendingPages`, advances page if `absAccumulator >= 60` (`FlipBookContext.tsx:186`) |
| `TOUCH_END` | release or snap | bent pages cascade if accumulator > 30, else snap back |
| `PAGE_LANDED` | remove a released page | called on spring animation complete |
| `FLIP_BOOK_OVER` / `FLIP_BOOK_BACK` / `BOOK_FLIP_COMPLETE` | admin book flip lifecycle | rotateY(180) on container |
| `ADMIN_LOGIN` / `ADMIN_LOGOUT` | admin auth | sessionStorage flag; logout also un-flips |
| `BOUNDARY_HIT` / `CLEAR_BOUNDARY` | edge glow | fired when ArrowRight at last page or ArrowLeft at 0 |

**provider** (`FlipBookContext.tsx:335`) reads `prefers-reduced-motion` media query on mount and toggles state if set.

### analytics context

`src/app/v2/context/AnalyticsContext.tsx`. separate, parallel to flipbook state. tracks session + page view durations to `localStorage` under key `portfolio_analytics`. `FlipBookWithAnalytics` (`v2/page.tsx:374`) calls `trackPageView(sectionId)` on `currentPageIndex` change, finalizing the previous view's duration.

silent-catches localStorage failures with `console.error` — won't crash SSR or quota-exceeded cases.

### api-backed data

SWR hooks in `src/hooks/`:
- `useArtworks.ts` — CRUD over `/api/artworks`
- `useSections.ts` — over `/api/sections`
- `useInquiries.ts` — over `/api/inquiries`

used only by admin cms ui (`src/app/admin/artworks/ArtworkManager.tsx`). v2 flipbook does **not** use these — it reads supabase directly via `dynamic-content.ts`.

### v1 state

each `src/app/v1/*/page.tsx` has local `useState` for selected gallery item. no cross-page shared state.

## v2 rendering layers (z-index, back → front)

composited via absolute positioning inside the `perspective: 1200px` book container at `v2/page.tsx:288`:

| layer | file | z-index | purpose |
|-------|------|---------|---------|
| CloudBackground | `components/CloudBackground.tsx` | 0 (fixed) | animated gradient + artist name |
| FlippedPagesStack | `components/FlippedPagesStack.tsx` | 100 | up to 8 turned pages on left, framer-motion spring |
| PageStack (edges) | `components/PageStack.tsx:131` | 500 − depth | up to 12 paper edges on right, pure CSS |
| PageStack (current) | `components/PageStack.tsx:171` | 600 | actual content via `renderPageContent()` |
| BendingPages | `components/BendingPages.tsx` | 9000 − stack pos | touch-drag bent pages |
| CascadingRelease | `components/CascadingRelease.tsx` | 8000 − stack pos | released pages flying to destination |
| FlippingPage | `components/FlippingPage.tsx` | 9999 | keyboard/tab nav, delegates to FurlingPage or FurlingRiffle |
| BinderTabs | `components/BinderTabs.tsx` | 2000 | section tabs on right edge, follow stack depth |
| BookBack | `components/BookBack.tsx` | backface (rotateY 180) | AdminLogin/AdminDashboard |
| MobileNav | `components/MobileNav.tsx` | 1000 (fixed bottom) | md-breakpoint-hidden horizontal bar |
| ResumeModal | `components/ResumeModal.tsx` | 10000/10001 | right slide-in panel |
| DebugOverlay | `components/DebugOverlay.tsx` | 10000 | bottom-left state readout |
| PageIndicator | `components/PageIndicator.tsx` | 20 (fixed) | bottom-center page counter |
| BoundaryFeedback | `components/BoundaryFeedback.tsx` | — | edge glow on `boundaryHit` |
| KeyboardHelpModal | `components/KeyboardHelpModal.tsx` | — | `?` key toggle |

## v2 animation systems

**1. FurlingPage** (`src/app/v2/components/FurlingPage.tsx`) — single-page flip (arrow keys, single-page tab jump)

- splits page into 12 vertical segments (`furling-utils.ts:17` SINGLE_PAGE_CONFIG)
- two-phase: tension (0→37.5%) builds the curve, release (37.5%→100%) completes the flip
- each segment: `furlDepth` (Z translate, gaussian peak at 65% fwd / 35% back), `flipAngle` (Y rotate 0→−180, eased cubic in-out, center leads edges by `centerLeadAmount: 0.12`), `tiltAngle` (X rotate proportional to furl depth, max ±8°)
- `requestAnimationFrame` loop, 0.8s total (0.3s tension + 0.5s flip)
- **bypasses react reconciliation** — writes transforms directly to DOM via refs (`FurlingPage.tsx:34`). sets `willChange: transform` at start, clears at end.
- math in pure functions at `src/app/v2/utils/furling-utils.ts` (`calculateSegmentTransforms`, `getSegmentFurlDepth`, `getSegmentFlipAngle`, `getSegmentTilt`)

**2. FurlingRiffle** (`src/app/v2/components/FurlingRiffle.tsx`) — multi-page flip (PageUp/Down, distant tab click)

- 3-7 visual layers (based on page count), each is its own furling page
- staggered start times (0.04s between layers)
- uses `RIFFLE_CONFIG` (`furling-utils.ts:28`): 10 segments, 90px max depth
- duration 0.6s-1.4s depending on distance
- opacity envelope: fade in, hold, fade out

**3. BendingPages + CascadingRelease** — touch/drag physics

reducer-driven (`FlipBookContext.tsx:154`). on `TOUCH_INPUT`:
- `scrollAccumulator` clamps -100..100 from drag delta / 100
- `bendingCount = floor(absAccumulator/15) + 1` (capped at remaining pages in direction)
- for each bending page: `bendAmount = min(1, (absAccumulator/50) * 0.7^i)` — exponential falloff
- if `absAccumulator >= 60`: top page moves to `releasedPages`, `currentPageIndex` advances, accumulator decrements by 40

`BendingPages.tsx` renders with framer-motion spring (stiffness 400, damping 40). transform: `rotateY(45deg) rotateX(8deg) skewY(3deg) scaleX(0.95) translateZ(20px)` scaled by bendAmount.

on `TOUCH_END` (`FlipBookContext.tsx:215`): if accumulator < 30, snap back (empty bending). otherwise all bending pages become released with staggered `releaseTime` (40ms apart) and inherited velocity. `CascadingRelease.tsx` runs framer-motion spring per page, calls `onPageLanded` on complete → reducer removes from `releasedPages`.

**4. Book flip** — admin panel

`v2/page.tsx:302` outer motion.div with `rotateY: isBookFlipped ? 180 : 0`. 0.8s cubic-bezier. front face (`backfaceVisibility: hidden`) has the flipbook; `BookBack.tsx` renders on the inverse face with `AdminLogin` or `AdminDashboard` (recharts).

## input handling

**keyboard** (`src/app/v2/page.tsx:151`, window listener):

| key | action |
|-----|--------|
| `ArrowRight` | next page (or `BOUNDARY_HIT end` if at last content page) |
| `ArrowLeft` | prev page (or `BOUNDARY_HIT start` if at 0) |
| `ArrowLeft/Right` during flip | `SKIP_TO_TARGET` |
| `PageDown` | next section via `getAdjacentSection` (`v2/page.tsx:25`) |
| `PageUp` | prev section |
| `Home` | page 0 |
| `End` | `getLastContentPage()` (46) |
| `?` | toggle KeyboardHelpModal (ignored in inputs) |
| `Ctrl+Shift+D` | toggle debug overlay |
| `Ctrl+Shift+M` | toggle reduced motion |
| `Ctrl+Shift+A` | flip book over to admin |

**touch/wheel** (`src/app/v2/hooks/useTouchInput.ts`):

- touch: `handleTouchStart` captures origin; `handleTouchMove` determines swipe axis from first 10px of movement. if on scrollable content (walks ancestors checking `overflow-y`), requires horizontal to be ≥2× vertical. horizontal swipes `e.preventDefault()` + dispatch `TOUCH_INPUT`. `handleTouchEnd` dispatches `TOUCH_END` (or direct `FLIP_TO_PAGE` if reduced motion).
- wheel: debounced 150ms. if target has scrollable ancestor with room to scroll in that direction, skip (let native handle). otherwise clamp to `[0, lastContentPage]` and `FLIP_TO_PAGE`.

## api layer

`src/app/api/*/route.ts`. next.js app router route handlers. all return JSON.

| route | methods | auth |
|-------|---------|------|
| `artworks/route.ts` | GET (list) / POST | POST admin |
| `artworks/[id]/route.ts` | GET / PUT / DELETE | mutations admin |
| `sections/route.ts` | GET (counts) / POST | POST admin |
| `sections/[id]/route.ts` | GET (with artworks) / PUT / DELETE | mutations admin |
| `sections/[id]/artworks/route.ts` | GET / POST / PUT (reorder) | mutations admin |
| `inquiries/route.ts` | GET (admin) / POST (public) | GET admin |
| `inquiries/[id]/route.ts` | GET / PUT / DELETE | all admin |
| `auth/[...nextauth]/route.ts` | GET / POST | NextAuth catch-all |
| `upload/route.ts` | POST | admin |
| `settings/route.ts` | GET / PUT | PUT admin |

**supabase server clients** at `src/lib/supabase/server.ts` — 4 variants:
- `createClient()` — cookie-aware, async, anon key
- `createAdminClient()` — service role, async
- `createRouteHandlerClient(cookieStore)` — sync, anon
- `createRouteHandlerAdminClient(cookieStore)` — sync, service role

**auth:** two separate systems.

1. **NextAuth + Google OAuth** for api admin routes (`src/lib/auth/config.ts`). `isAdmin` derived from `ADMIN_EMAIL` env match. `getServerSession(authOptions)` used in route handlers.
2. **username/password** for v2 book-back admin panel (`AdminLogin.tsx`). reads `NEXT_PUBLIC_ADMIN_USER` / `NEXT_PUBLIC_ADMIN_PASS` literals (must be literal per `src/lib/env.ts` comment at line 40 — next.js inlining requirement). sessionStorage-backed. independent from api auth.

## error handling

- **api routes:** try/catch boundary, structured `{ error: string }` + http status. supabase `PGRST116` (not found) mapped to 404.
- **dynamic-content.ts:** errors fall through to static fallback, logged via `console.error`. load-bearing — the site works without supabase.
- **FlipBookContext:** guards against invalid states (returns unchanged state if flipping while flipping, same page, etc.).
- **PageStack:** wraps content in `ErrorBoundary` (`src/app/v2/components/ErrorBoundary.tsx`) to isolate content page crashes.
- **AnalyticsContext:** silent catches with `console.error` for localStorage quota/disabled cases.

## cross-cutting concerns

**logging:** `console.log` / `console.error`. reducer logs gated by `state.debugMode` (`FlipBookContext.tsx:83`). DebugOverlay shows live state + performance timing.

**validation:** api routes hand-validate request bodies (type + required field + uuid + enum checks). no validation library.

**accessibility:** `prefersReducedMotion` detected at mount (`FlipBookContext.tsx:338`). when enabled: `FLIP_TO_PAGE` jumps instantly, `FlippingPage` returns null and dispatches `FLIP_COMPLETE` after 50ms (`FlippingPage.tsx:18`), touch handlers still dispatch but bending is skipped.

**url sync:** three effects in `v2/page.tsx` (`73`, `113`, `133`) keep `#section-id` hash in sync with `currentPageIndex`. blank pages map to nearest previous section. `#resume` overrides while modal open; `#admin` when book flipped.

**env vars:** centralized in `src/lib/env.ts`. getters throw with descriptive errors. `NEXT_PUBLIC_*` must be accessed as literal `process.env.NEXT_PUBLIC_X` (next.js inlining constraint documented at `env.ts:40`).

**testing:** vitest + jsdom + @testing-library. 4 suites at `src/__tests__/` totaling 1049 loc. heavy coverage on `FlipBookContext` reducer (589 loc), lighter on data integrity, api handler, youtube parser.
