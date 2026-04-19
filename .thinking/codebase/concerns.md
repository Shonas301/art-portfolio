---
generated: 2026-04-16
depth: deep
focus: concerns
tags:
  - src
  - app
  - public
  - fixed
  - fix
  - page.tsx
  - supabase
  - page
---




#src #app #public #fixed #fix #page.tsx #supabase #page


# codebase concerns

**analysis date:** 2026-04-16
**supersedes:** 2026-02-01 revision — most tier 1 bugs and several security issues resolved. new deploy-blocking concerns surfaced.

status change summary since 2026-02-01:
- inquiry form field mismatch — **fixed** (`src/components/InquiryForm.tsx:107-113` sends snake_case)
- resume download no-op — **fixed** at component level (`src/app/v2/components/ResumeModal.tsx:103-118` has `href="/resume.pdf"`), **but the pdf file does not exist in `public/`** — new bug
- client-side admin credentials — **fixed** (`AdminLogin.tsx` now uses nextauth google oauth)
- vimeo helper missing — **fixed** (`src/lib/youtube.ts:50-100` has `getVimeoEmbedUrl`/`getVideoEmbedUrl`)
- no error boundaries — **fixed** (`src/app/v2/components/ErrorBoundary.tsx` wraps page content in `PageStack.tsx:209-223`)
- dynamic content layer unused — **fixed** (`PageStack.tsx:99` calls `fetchAllPageContentClient`)
- `!` non-null assertions on supabase env vars — **fixed** (`src/lib/env.ts` validates with throws; `supabase/server.ts` and `supabase/client.ts` use it)
- no tests — **partially fixed** (4 test files cover reducer, portfolio-content, youtube, inquiries api)
- zero debug overlay in prod — **fixed** (`DebugOverlay.tsx:52` gates on `NODE_ENV !== 'development'`)
- `requestAnimationFrame` + setState in furling — **fixed** (`FurlingPage.tsx`/`FurlingRiffle.tsx` now use refs + direct DOM mutation)
- cloudbackground runs in hidden tabs — **fixed** (`CloudBackground.tsx:11-18` pauses on `document.hidden`)
- `willChange` never cleared — **fixed** (`FurlingPage.tsx:100-104` clears on completion)

---

## critical (production-breakage risk)

**missing `public/resume.pdf`:**
- `src/app/v2/components/ResumeModal.tsx:103-107` renders `<IconButton component="a" href="/resume.pdf" download>`. file does not exist at `main/public/resume.pdf`.
- `public/` is gitignored (`main/.gitignore:34`) so the file can't be committed. any deploy that builds from git will 404 on resume download.
- fix: either (a) commit a real resume.pdf with an override in `.gitignore` (e.g. `!public/resume.pdf`), (b) host in supabase storage and link the cdn url, or (c) disable the download button until a real pdf is available.

**missing `public/images/headshot.png`:**
- `src/app/v2/data/portfolio-content.ts:104` references `/images/headshot.png`. file does not exist — `main/public/images/` is not present on disk.
- `src/app/v2/components/pages/IntroPage.tsx:50-57` uses `next/image` `priority` loading — missing image renders broken avatar with no fallback ui.
- `public/` is gitignored so headshot never makes it to deploy. intro page is visually broken.
- fix: migrate headshot to supabase storage (bucket already used for everything else at `src/app/v2/data/portfolio-content.ts:7`) and reference via `STORAGE_BASE`, or carve a `!public/images/` exception in `.gitignore`.

**`public/` directory entirely gitignored but referenced by code:**
- `main/.gitignore:34` has a bare `public` entry. any required static asset (resume, headshot, favicons, `720p_animation.mp4`, demo frames) is excluded from git.
- 1.6gb of `public/output/` exists locally but deploys will ship with only `public/vite.svg`.
- fix: remove the blanket `public` ignore; add targeted ignores for `public/output/frames/` and `public/output/*.mp4` instead. or commit a minimal `public/` (just required assets) and keep large media in supabase/cloudinary.

**tier 5 placeholder content in production code (owner-blocked):**
- resume modal shows edward elric from fullmetal alchemist (`ResumeModal.tsx:147, 156, 166, 190-195, 214, 245, 257, 290-294, 344-347`). live at `/v2#resume`.
- contact email `christina@example.com` (`portfolio-content.ts:234`) — mailto link is inert.
- all video items point to `https://www.youtube.com/watch?v=bdrST1IbN3k` (unrelated concert footage): `portfolio-content.ts:121, 186, 193, 213, 222`. same 2 video references in v1 pages: `src/app/v1/page.tsx`, `src/app/v1/3d-work/page.tsx`, `src/app/v1/2d-work/page.tsx`, `src/app/v1/code/page.tsx`, `src/app/v1/pandy-series/page.tsx`.
- gallery thumbnails are extracted video frames (`1080p_s52043_frame_*.png`, `720p_s69_frame_*.png`) — `portfolio-content.ts:122, 130-131, 139-140, 159-160, 168-169, 214, 223`.
- gallery titles are generic: "animation demo", "digital painting", "character concept", "pandy animation 1/2" — `portfolio-content.ts:117, 155, 164, 209, 218`.
- social media urls likely placeholder: `https://linkedin.com/in/christinashi`, `https://instagram.com/christinashi` — `portfolio-content.ts:235-236`. verify these resolve.
- blocks: real portfolio launch. tracked in `.thinking/streams/agent-browser.md` tier 5 (8 items, awaiting christina).
- v1 demo reel page still has 4 paragraphs of lorem ipsum: `src/app/v1/demo-reel/page.tsx:53-68`.

**deploy scripts not yet written:**
- `.thinking/todos/20260413-deploy-tinamation-write-scripts.md` — `scripts/bootstrap-vps.sh`, `scripts/deploy-tinamation.sh`, `.env.production.example`, `deploy/tinamation.service`, `deploy/Caddyfile` all designed in `.thinking/streams/deploy-tinamation.md` but not committed. `main/scripts/` contains only `seed-database.ts`.
- also blocked on manual dns + google oauth redirect uri setup (`.thinking/todos/20260413-deploy-tinamation-dns-and-oauth-prereqs.md`).
- site cannot be deployed to `tina.shippit.live` until these land.

---

## high

**v1 demo reel iframe has youtube permissions attached to a vimeo embed:**
- `src/app/v1/demo-reel/page.tsx:34-36` embeds `player.vimeo.com` but `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"` is the youtube default. vimeo ignores accelerometer/gyroscope; safer to match what `CodePage.tsx:67` uses (`autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media`).
- impact: fullscreen may not work on vimeo embed since `fullscreen` permission is missing; `allowFullScreen` attribute on line 37 covers the legacy path but modern permission policy prefers the explicit allow-list.

**v1 demo reel breakdown is lorem ipsum:**
- `src/app/v1/demo-reel/page.tsx:53-68` — four paragraphs of placeholder latin visible on `/v1/demo-reel` which is still reachable (v1 routes not removed).
- fix: replace or strip the breakdown section. consider removing v1 route tree entirely if v2 is the canonical product.

**v1 route tree exists in parallel with v2:**
- `src/app/v1/{2d-work,3d-work,code,contact,demo-reel,pandy-series,resume}/page.tsx` + `src/app/v1/page.tsx` are still mounted.
- root-level sibling routes (`src/app/{2d-work,3d-work,code,contact,intro,pandy-series,resume,demo-reel}/page.tsx`) are stub files that `redirect('/v2#...')`.
- `src/app/page.tsx` redirects root to `/v2`. nothing redirects `/v1` routes.
- risk: search indexers, backlinks, and the stale youtube video embeds in v1 pages can surface pre-launch. at minimum v1 should be behind a `NODE_ENV==='development'` guard or fully deleted.

**dangerouslyAllowSVG enabled in next/image:**
- `next.config.ts:25` sets `dangerouslyAllowSVG: true`. paired with `contentDispositionType: 'attachment'` which mitigates script-embedding risk, but any future svg source (cloudinary, supabase, user-uploaded artwork) bypasses the normal optimization pipeline and can execute embedded scripts if `contentDispositionType` is ever changed.
- fix: keep the attachment disposition strict, or disable svg allowance unless actively needed.

**admin dashboard still uses stale sessionStorage flag alongside nextauth:**
- `src/app/v2/components/AdminDashboard.tsx:54` calls `sessionStorage.removeItem('admin_authenticated')` on logout, and `src/app/v2/page.tsx:90` reads it during `#admin` hash boot.
- the nextauth migration made `state.adminAuthenticated` the real source of truth (dispatched by `AdminLogin.tsx:24,56` after session check). the sessionStorage read on v2 page mount is dead (never set by the new flow) but the logout write is misleading — someone may assume it represents auth state.
- fix: drop both sessionStorage references. rely on `getSession()` everywhere. tracked conceptually in agent-browser stream note 6.2.

**rate-limiting is in-memory only:**
- `src/app/api/inquiries/route.ts:22-64` — `rateLimitMap` is a module-level `Map`. works for single-instance dev/prod but breaks behind multiple replicas or on a restart-during-attack scenario.
- also in-memory state is lost on every next.js route handler module reload during dev.
- fix: when the vps deploy goes live with a single node instance this is acceptable short-term. long-term: move to supabase table with ttl or redis.

**nextauth v4 with next.js 15 app router:**
- `package.json:25` pins `next-auth@^4.24.13`. auth.js v5 is the recommended version for next 15 app router. `getServerSession(authOptions)` pattern in `src/app/api/*/route.ts` (inquiries, artworks, sections, upload) works but is the legacy pattern.
- impact: edge runtime and middleware don't play cleanly with v4; stuck on node runtime for all protected routes.
- migration path: auth.js v5 uses `auth()` export from a central config — 10+ call sites would need updating.

**mui joy beta pin:**
- `package.json:19` pins `@mui/joy: 5.0.0-beta.52`. still beta and mui has publicly deprioritized joy ui in favor of material + base ui.
- every component in `src/components/`, `src/app/v1/**`, `src/app/v2/**` uses joy. forced migration would be very large.
- fix: no immediate action. monitor mui roadmap. if joy is discontinued, plan a material v6 migration sprint.

---

## medium

**localStorage analytics unbounded:**
- `src/app/v2/context/AnalyticsContext.tsx:65-100, 137-140` — every new session appends to `portfolio_analytics` in localStorage. no cap, no ttl, no pruning. 5-10mb quota will be hit eventually on a heavily-viewed portfolio.
- `clearAnalytics` (`AnalyticsContext.tsx:137-140`) only exposed via admin dashboard.
- fix: cap at last N sessions (e.g. 100) and evict oldest when exceeded.

**useTouchInput re-registers listeners on state changes:**
- `src/app/v2/hooks/useTouchInput.ts:68-227` — effect dep array (line 227) includes `state.prefersReducedMotion`, `state.currentPageIndex`, `state.isFlipping`, `state.isEngaged`. every page change during touch mid-gesture tears down and re-attaches 5 event listeners.
- fix: move frequently-changing state to refs so the effect depends only on `containerRef` and `dispatch`.

**keyboard event handler can conflict with artwork modal:**
- `src/app/v2/page.tsx:151-256` registers window `keydown`; `src/components/ArtworkDetailModal.tsx:71-97` registers document `keydown`. both handle `ArrowLeft`/`ArrowRight`.
- modal calls `e.preventDefault()` (line 80, 85) but not `e.stopPropagation()`. when modal is open inside flipbook, both handlers fire. flipbook handler now checks `state.isBookFlipped` and `isFlipping` but not "modal open".
- fix: add `state.artworkModalOpen` (or similar) to FlipBookContext and bail early in the page.tsx handler. or have the modal call `stopPropagation`.

**`TOUCH_INPUT` reducer mutates `currentPageIndex` outside the flip state machine:**
- `src/app/v2/context/FlipBookContext.tsx:154-213` — when the touch-release threshold is hit, `currentPageIndex` changes directly without `isFlipping`/`targetPageIndex`/`isRiffling` being set. analytics tracking (`page.tsx:379-384`) and url hash sync (`page.tsx:132-148`) still fire but the animation state machine is in a different shape than after a `FLIP_TO_PAGE` → `FLIP_COMPLETE` cycle.
- intentional for touch physics but creates two navigation code paths. any new feature that relies on `isFlipping`/`targetPageIndex` during a transition will silently skip touch-based page changes.

**`FLIP_BOOK_OVER` and `FLIP_BOOK_BACK` produce identical reducer state:**
- `src/app/v2/context/FlipBookContext.tsx:257-271` — both actions set `isBookFlipping: true` and nothing else. direction is determined solely by current `isBookFlipped` at animation-complete time (`BOOK_FLIP_COMPLETE`, line 273-279).
- the keyboard shortcut at `page.tsx:167-173` correctly checks `state.isBookFlipped` before dispatching. but hash-based entry at `page.tsx:88-98` always dispatches `FLIP_BOOK_OVER`, and if the book is already flipped, `isBookFlipped` toggles to `false` — opposite of intent.
- fix: collapse to one `TOGGLE_BOOK_FLIP` action, or have each action guard on the expected starting state.

**test coverage narrow but targeted:**
- 4 test files in `src/__tests__/`: `FlipBookContext.test.tsx` (reducer), `api-inquiries.test.ts` (route validation), `portfolio-content.test.ts` (helper functions), `youtube.test.ts` (url parsing).
- untested critical areas: `useTouchInput.ts` (hook gesture logic), `dynamic-content.ts` (supabase fallback behavior), `AnalyticsContext.tsx` (session tracking), `cloudinary/config.ts` (signing/upload helpers), all v2 page components, all admin pages, the 3 other api route modules (artworks, sections, settings).
- priority: touch input logic next (most fragile untested surface).

**silent catch in supabase cookie writes:**
- `src/lib/supabase/server.ts:26-30, 64-67, 96-99, 130-133` — `setAll` wraps `cookieStore.set` in try/catch but does log `console.error` ("non-critical"). acceptable.
- `src/lib/youtube.ts:30-32, 71-73` — bare `catch { return null }`. acceptable for url parsing (invalid url is the expected failure mode) but there's zero log if a genuinely malformed input shows up in production. low priority since the function is pure and returns null signals a problem upstream.

**`!` non-null assertions remain in cloudinary config:**
- `src/lib/cloudinary/config.ts:213, 220` — `process.env.CLOUDINARY_API_SECRET!` and `process.env.CLOUDINARY_API_KEY!` inside `generateSignedUploadParams`. `configureCloudinary()` at line 68-73 already validates these vars and throws. so by the time `!` is used they've been checked — but the `generateSignedUploadParams` function calls `configureCloudinary` first, so the `!` is technically safe. still, the `env.ts` pattern should be extended to cloudinary vars for consistency.

**3d artwork commerce schema exists but unused on display:**
- `src/lib/supabase/types.ts` and `src/lib/content/dynamic-content.ts:42-45` pass `isForSale`, `priceRange`, `shopUrl` through to `GalleryItem`. `src/components/ArtworkDetailModal.tsx` has cart/email icons imported (lines 18, 19). but the admin management ui (`src/app/admin/artworks/ArtworkManager.tsx`) is where items get tagged.
- low risk: feature is incomplete, not broken. if christina wants to sell prints, the wiring is partially there.

---

## low

**v1 stacked on top of v2 duplicates styling work:**
- v1 directory uses mui joy with manual capitalization ("3D Generalist Reel", "Reel Breakdown") which violates the project's lowercase-everywhere convention.
- if v1 is retained for archival, align casing. if not, delete.

**stale `public/output/` on disk:**
- `du -sh public/output/` = 1.6gb (455 png frames + 76mb mp4). only a handful are referenced as thumbnails via the supabase cdn.
- gitignore covers it, but it's 1.6gb of disk per worktree. running `pnpm build` copies to `.next/standalone` for ssr output.
- fix: delete the directory, update any references to use supabase `STORAGE_BASE`. or move to external workspace.

**`vite.svg` in `public/`:**
- `main/public/vite.svg` — leftover from pre-nextjs migration. referenced nowhere. delete.

**`react.svg` in `src/assets/`:**
- `main/src/assets/react.svg` — another pre-nextjs leftover. not imported anywhere. delete the entire `src/assets/` directory.

**`spec.md` at repo root, gitignored via `*spec*`:**
- `main/.gitignore:33` and `main/spec.md` — initial project brief, not checked in but present. low risk; document should move to `.thinking/` or be deleted when stale.

**four eslint-disable pragmas for `react-hooks/set-state-in-effect`:**
- `src/app/v2/components/DebugOverlay.tsx:23, 31` and `src/app/v2/components/pages/LandingPage.tsx:23` — the classic "set state after mount to avoid ssr hydration mismatch" pattern. acceptable exception, but worth noting if react 19 ever adds a cleaner hydration primitive.
- two `@next/next/no-img-element` disables in `src/app/admin/artworks/ArtworkManager.tsx:404, 596` — admin-only views using `<img>` instead of `next/image` for thumbnail previews. low priority because admin is not crawled/indexed.

**dual codebase for `page.tsx` at root + `/v2`:**
- `src/app/page.tsx` just redirects. `src/app/v2/page.tsx` is the real entry. this works but means the redirect chain is `/` → `/v2` → hash route — one extra hop than needed. when v2 is canonical, consider flattening (move v2 up to app root and delete v1 tree).

**debug console.logs in reducer:**
- `src/app/v2/context/FlipBookContext.tsx:83, 88` — `if (state.debugMode) console.log(...)`. gated by `debugMode` which the debug overlay can toggle. fine.
- `src/app/v2/context/FlipBookContext.tsx:342` — unconditional `console.log('[CONTEXT] Browser prefers reduced motion - enabling')` on mount when os has reduced-motion set. minor; runs once per session.

**`@next/eslint-plugin-next@^15` but `eslint-config-next@^16.0.10`:**
- `package.json:35, 43` — peer versions straddle the next 15↔16 boundary. might surface as warnings when upgrading. low priority.

---

## scaling limits

**localStorage analytics (5-10mb quota):**
- see medium / "localStorage analytics unbounded". same entry.

**50→47 page hardcoded book model:**
- `src/app/v2/data/portfolio-content.ts:4` — `TOTAL_PAGES = 47`. `sectionMappings` (lines 27-35) uses physical pages 0, 7, 14, 22, 30, 38, 46. if a new section is added, `TOTAL_PAGES` must be bumped manually, and `FlipBookContext.tsx:85` bounds check must hold.
- no runtime validation that all `physicalPage` values are within `[0, TOTAL_PAGES-1]`.
- fix: derive `TOTAL_PAGES` as `Math.max(...sectionMappings.map(s => s.physicalPage)) + N_BLANK_PAGES_BUFFER`.

---

## missing features

**no SEO metadata for v2 route:**
- `src/app/v2/page.tsx:389` — client component, no `metadata` export. search engines see only the root layout metadata (`src/app/layout.tsx:10-13`). `/v2` is effectively the landing page and needs dedicated og tags, especially since the `/` redirect points there.
- fix: extract a server wrapper component that exports `metadata` and renders the client flipbook as children. or use `generateMetadata` at the layout level.

**no captcha/honeypot on inquiry form:**
- `src/app/api/inquiries/route.ts:189` — rate-limited (5/min/ip) but no bot protection beyond that. a determined spammer with rotating ips would still get through. low-volume site so real-world risk is low, but budget for hcaptcha/honeypot before launch.

**no structured logging:**
- all error paths use `console.error`. fine for single-instance deploy. if the site ever goes multi-instance or wants retention, add pino/winston + a log shipper.

---

*concerns audit: 2026-04-16*
