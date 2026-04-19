# external integrations

**analysis date:** 2026-04-16

## summary

| service | purpose | auth env | sdk |
|---|---|---|---|
| supabase (postgres + storage) | primary cms for artworks/sections/inquiries + media buckets | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | `@supabase/supabase-js` `^2.90.1`, `@supabase/ssr` `^0.8.0` |
| cloudinary | media cdn + upload pipeline | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `cloudinary` `^2.8.0`, `next-cloudinary` `^6.17.5` |
| google oauth (via next-auth) | admin sign-in | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL` | `next-auth` `^4.24.13` |
| youtube | embed-only, no api | — | native iframe / url parsing via `main/src/lib/youtube.ts` |
| vimeo | embed-only, no api | — | native iframe / url parsing via `main/src/lib/youtube.ts` |

no analytics (no GA/plausible/posthog). no error tracking (no sentry). one local in-browser analytics context at `main/src/app/v2/context/AnalyticsContext.tsx` that writes to `localStorage` under key `portfolio_analytics` — not an external service.

## supabase

**project:** `ztpvqdqngykfrtqzyddy.supabase.co` (hardcoded in `main/next.config.ts:20` as a remote image pattern; also in `main/.env.local:1`).

**client factories:**
- `main/src/lib/supabase/client.ts` — `createClient()` + `getClient()` singleton using `createBrowserClient` from `@supabase/ssr`. reads env via `@/lib/env.ts` `client.supabaseUrl` / `client.supabaseAnonKey`.
- `main/src/lib/supabase/server.ts` — four variants:
  - `createClient()` — server component, async `cookies()` (next 15 api)
  - `createAdminClient()` — service role, bypasses RLS
  - `createRouteHandlerClient(cookieStore)` — pre-resolved cookie store for route handlers
  - `createRouteHandlerAdminClient(cookieStore)` — service role variant for route handlers

**env validation:** `main/src/lib/env.ts` centralizes env access. `server.supabaseServiceRoleKey` is `optional()` (empty fallback); admin client throws explicitly at runtime if missing.

**types:** hand-written in `main/src/lib/supabase/types.ts`. **not** auto-generated via `supabase gen types`. exported types include `Section`, `Artwork`, `GalleryItem`, `SiteSetting`, `Inquiry` + corresponding `Insert` / `Update` shapes.

**enum drift:** ts enums vs SQL CHECK constraints don't match:
- `MediaType` ts: `'image' | 'video' | 'model_3d' | 'gif'` — SQL: only `'image' | 'video'` (`supabase/migrations/001_initial_schema.sql:52`)
- `InquiryType` ts: `'general' | 'commission' | 'purchase' | 'collaboration'` — SQL: `'commission' | 'purchase' | 'general'`
- `InquiryStatus`: `'new' | 'read' | 'responded' | 'archived'` — matches.

### schema

all tables defined in `main/supabase/migrations/001_initial_schema.sql`.

| table | rows | rls | purpose |
|---|---|---|---|
| `sections` | 7 | public read, auth write | portfolio sections with `slug`, `title`, `physical_page_start`, `display_order`, `is_visible` |
| `artworks` | 41 | public read, auth write | art pieces; `media_type`, `cloudinary_public_id`, `cloudinary_url`, `thumbnail_url`, `external_url`, `materials`, `dimensions`, `year_created`, `is_for_sale`, `shop_url`, `price_range` |
| `gallery_items` | 41 | public read, auth write | junction linking `section_id` ↔ `artwork_id` with `display_order`; unique on `(section_id, artwork_id)` |
| `site_settings` | 5 | public read, auth write | jsonb key-value. seeded with `site_title`, `site_description`, `contact_email`, `social_links`, `theme` |
| `inquiries` | — | auth read, **public insert**, auth update/delete | contact form submissions; privacy: anon cannot select |

**trigger:** `update_updated_at_column()` fires `before update` on `sections`, `artworks`, `site_settings`.

**indexes:** slug, display_order, is_visible, media_type, is_for_sale, year_created, section_id, artwork_id (junction), email, inquiry_type, artwork_id (inquiries), status, created_at (desc).

### storage buckets

both public. 50MB limit each. provisioned by `main/scripts/seed-database.ts` or manually.

- `images` — 41 files (per project CLAUDE.md)
- `videos` — 3 files

serve-time URLs go through `ztpvqdqngykfrtqzyddy.supabase.co/storage/v1/object/public/...`; this is why `next.config.ts` whitelists that hostname as a remote image pattern.

### rls posture

**overly permissive for admin ops:** every table grants `to authenticated` for all mutations. but this app uses next-auth JWTs — there is no supabase auth session for the admin. mutations therefore route through `createAdminClient()` (service role, bypasses RLS). public anon inserts to `inquiries` succeed via the explicit `inquiries_public_insert` policy.

**implication:** RLS is not the enforcement layer. auth is enforced per-route via `getServerSession(authOptions)` + `session.user.isAdmin`.

## cloudinary

**config module:** `main/src/lib/cloudinary/config.ts`

**env surface** (direct `process.env.*` reads, not through `@/lib/env`):
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — url construction (client + server)
- `CLOUDINARY_API_KEY` — server signing
- `CLOUDINARY_API_SECRET` — server signing
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — referenced in `main/src/app/admin/artworks/ArtworkManager.tsx:605` by the `CldUploadWidget`. **not documented in `main/.env.example`** — drift.

### exported helpers (`main/src/lib/cloudinary/config.ts`)

- `configureCloudinary()` — init server sdk
- `uploadImage(file, options)` — accepts Buffer or base64; returns `CloudinaryUploadResponse`
- `deleteImage(publicId)` / `deleteImages(publicIds)`
- `getImageDetails(publicId)` — returns null on 404
- `generateSignedUploadParams(folder)` — signed params for browser direct upload
- `getOptimizedImageUrl(publicId, options)` — builds `https://res.cloudinary.com/{cloud}/image/upload/{transforms}/{publicId}`
- `getThumbnailUrl(publicId, size)` — small=150px, medium=300px, large=600px, crop=thumb, gravity=auto
- `getResponsiveSrcSet(publicId)` — widths `[320, 640, 960, 1280, 1920]`

### folder taxonomy

`PORTFOLIO_FOLDERS` constant:
```
artworks      → portfolio/artworks   (default)
thumbnails    → portfolio/thumbnails
gallery2d     → portfolio/2d-work
gallery3d     → portfolio/3d-work
pandySeries   → portfolio/pandy-series
code          → portfolio/code
```

upload widget in admin uses folder `art-portfolio` (`main/src/app/admin/artworks/ArtworkManager.tsx:610`) — **drift from the `PORTFOLIO_FOLDERS` scheme above.**

### upload route: `POST /api/upload`

`main/src/app/api/upload/route.ts`

- admin-gated via `getServerSession(authOptions)` + `session.user.isAdmin` (401/403).
- multipart form: `file`, `folder` (key of `PORTFOLIO_FOLDERS`), `publicId` (optional), `tags` (csv, optional).
- allowed mime: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/avif`, `video/mp4`, `video/webm`, `video/quicktime`.
- max size: 50MB.
- `OPTIONS` preflight handler allows `POST, OPTIONS` + `Content-Type, Authorization`.
- returns `{ public_id, secure_url, width, height, format, resource_type, bytes, folder, original_filename }`.

## next-auth (google oauth)

**config:** `main/src/lib/auth/config.ts`
**handler route:** `main/src/app/api/auth/[...nextauth]/route.ts`

- provider: `GoogleProvider` only.
- session strategy: `jwt` (no db sessions).
- session `maxAge`: 7 days (`7 * 24 * 60 * 60`).
- `callbacks.jwt` compares `user.email` against `server.adminEmail` to set `token.isAdmin`.
- `callbacks.session` lifts `isAdmin` onto `session.user`.
- typescript `declare module "next-auth"` extends `Session.user` with `isAdmin?: boolean`; same for `JWT`.
- `debug: process.env.NODE_ENV === "development"` — verbose oauth logs in dev.
- no custom pages. default next-auth sign-in UI.

**env:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL` — optional with `http://localhost:3000` fallback (`main/src/lib/env.ts:29`)
- `NEXTAUTH_SECRET` — required, throws if missing
- `ADMIN_EMAIL` — optional; if absent, nobody is admin (all mutations 403)

**admin single-user model.** `ADMIN_EMAIL` in `main/.env.local:6` is `jason.s.shipp@gmail.com` locally (dev use); production whitelisted to the site owner.

**no `middleware.ts`.** auth is checked per-route inside each admin handler, not at the edge.

## api routes

all under `main/src/app/api/`. file-based routing (`route.ts`).

### public (no auth)
- `GET /api/artworks` — list; query: `section_id`, `limit`, `offset`
- `GET /api/artworks/[id]` — single by uuid
- `GET /api/sections` — list, includes artwork counts, ordered by `display_order`
- `GET /api/sections/[id]` — with joined artworks
- `GET /api/sections/[id]/artworks` — list artworks in section
- `GET /api/settings` — key-value map
- `POST /api/inquiries` — submit inquiry; email format validation
- `GET/POST /api/auth/[...nextauth]` — next-auth handlers

### admin (require `session.user.isAdmin`)
- `POST /api/artworks` — create (validates `title`, `media_type`)
- `PUT/DELETE /api/artworks/[id]` — update / delete (cascade to `gallery_items`)
- `POST /api/sections` — create (slug uniqueness)
- `PUT/DELETE /api/sections/[id]` — update / delete (manually cascades `gallery_items` before section delete)
- `POST /api/sections/[id]/artworks` — add to section (dedup, auto display_order)
- `PUT /api/sections/[id]/artworks` — batch reorder
- `GET /api/inquiries` — list, optional `status` filter
- `GET /api/inquiries/[id]` — with artwork join
- `PUT /api/inquiries/[id]` — **status-field only** (whitelist)
- `DELETE /api/inquiries/[id]`
- `POST /api/upload` — see cloudinary above
- `PUT /api/settings` — upsert (uses admin client to bypass RLS)

### cors preflight
manual `OPTIONS` handlers on `/api/upload`, `/api/inquiries`, `/api/inquiries/[id]`.

## dynamic content fallback

**file:** `main/src/lib/content/dynamic-content.ts`

pattern: graceful degradation. `isSupabaseConfigured()` checks for presence of `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` at runtime (`main/src/lib/content/dynamic-content.ts:23-28`). if missing, returns static content from `main/src/app/v2/data/portfolio-content.ts`.

- `fetchAllPageContentClient()` — client-side, lazy imports `@/lib/supabase/client`.
- server-side fetch paths use next's native `fetch(..., { next: { revalidate: 60 } })` for 60s ISR.

**static content** is the ground-truth fallback: `portfolio-content.ts` contains page mappings, gallery items, social links.

## swr hooks

all three use `@/lib/supabase/client` via the underlying fetch api:

- `main/src/hooks/useArtworks.ts` — CRUD
- `main/src/hooks/useSections.ts` — CRUD
- `main/src/hooks/useInquiries.ts` — read/update/delete

mutations call SWR's `mutate()` for cache invalidation.

also: `main/src/components/useArtworks.ts`, `useInquiries.ts`, `useSections.ts` exist in the components dir (per earlier listing) — drift or duplication to audit.

## admin panel

**location:** `main/src/app/admin/`
- `main/src/app/admin/page.tsx`
- `main/src/app/admin/artworks/page.tsx`
- `main/src/app/admin/artworks/ArtworkManager.tsx` — CRUD ui + `CldUploadWidget`

**AdminDashboard** charts: `main/src/app/v2/components/AdminDashboard.tsx` — `recharts`.

**AdminLogin:** `main/src/app/v2/components/AdminLogin.tsx` — imports `signIn, getSession` from `next-auth/react`.

## video embed integrations (no api)

**youtube / vimeo parsing:** `main/src/lib/youtube.ts` handles three youtube url shapes and two vimeo shapes:

- `youtube.com/watch?v=ID`
- `youtu.be/ID`
- `youtube.com/embed/ID`
- `player.vimeo.com/video/ID[?h=HASH]`
- `vimeo.com/ID` / `www.vimeo.com/ID`

returns standardized embed urls (`youtube.com/embed/ID`, `player.vimeo.com/video/ID`).

**embedded video references:**
- `https://www.youtube.com/watch?v=bdrST1IbN3k` — used across `main/src/app/v2/data/portfolio-content.ts:121,186,193,213,222` and `main/src/app/v1/page.tsx:74,143`, `main/src/app/v1/3d-work/page.tsx:19`
- `https://player.vimeo.com/video/1018084842?h=82717f6b50` — `main/src/app/v1/demo-reel/page.tsx` (v1 only; v2 does not use vimeo)

**social links** (static, `main/src/app/v2/data/portfolio-content.ts:235-236`):
- `https://linkedin.com/in/christinashi`
- `https://instagram.com/christinashi`

**linkedin share url** construction in `main/src/components/SocialShareButtons.tsx:67` — no api key, just url-building.

## data storage topology

| layer | what | where |
|---|---|---|
| primary db | sections, artworks, gallery_items, inquiries, site_settings | supabase postgres (`ztpvqdqngykfrtqzyddy`) |
| dynamic media upload | new artwork uploads via admin | cloudinary (`portfolio/*` folders, also `art-portfolio`) |
| migrated wix media | 41 images + 3 videos | supabase storage (`images`, `videos` buckets) |
| static fallback | full site content | `main/src/app/v2/data/portfolio-content.ts` |
| in-bundle static assets | headshot, svg icons | `main/public/` (output/, vite.svg) |
| client-side analytics | page view log | `localStorage["portfolio_analytics"]` (not external) |

## caching layers

- swr — in-memory client cache, per-session
- next fetch — `{ next: { revalidate: 60 } }` ISR on server-side fetches (`main/src/lib/content/dynamic-content.ts`)
- cloudinary — cdn + transform cache
- next image — `minimumCacheTTL: 60` in `main/next.config.ts:24`
- no redis, no external cache

## monitoring / observability

- **error tracking:** none (no sentry, datadog, rollbar).
- **structured logs:** none. raw `console.error`/`console.warn` throughout api routes + client code.
- **analytics:** **none external.** local-only analytics context in `main/src/app/v2/context/AnalyticsContext.tsx` that tracks page views to localStorage key `portfolio_analytics`; surfaced in admin dashboard.
- **apm / uptime:** none.

## ci/cd & deployment

- **hosting:** vercel assumed (`.vercel/` gitignored in `main/.gitignore`). no `vercel.json` — pure defaults.
- **no `.github/workflows/`**, no Jenkinsfile, no CircleCI, no buildkite.
- **no Dockerfile.**
- **deploy cmd:** `pnpm build` → `pnpm start`. build enforces ts + eslint correctness.

## environment configuration

### required (from `main/.env.example`)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
ADMIN_EMAIL
```

### referenced but not in `.env.example` (drift)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — read in `main/src/app/admin/artworks/ArtworkManager.tsx:605`
- `NEXT_PUBLIC_BASE_URL` — read in `main/src/components/ShareableLink.tsx:4`, fallback `https://christinashi.art`

### access patterns
- centralized: `main/src/lib/env.ts` exposes `server.*` (lazy getters that throw on required missing) and `client.*` (literal `process.env.NEXT_PUBLIC_X` so next can inline).
- **critical:** client-side env access MUST use literal keys. see `main/src/lib/env.ts:41-45` comment. dynamic `process.env[key]` does not work in the browser bundle.
- bypass: cloudinary config reads raw `process.env.*` directly (`main/src/lib/cloudinary/config.ts`). the admin-panel upload widget reads `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` directly as well.

### secrets management
- local: `main/.env.local` (gitignored via `*.local` pattern in `main/.gitignore`).
- production: set via vercel env dashboard.

## webhooks & callbacks

**incoming:**
- `GET /api/auth/callback/google` — google oauth callback, handled by next-auth route handler.

**outgoing:** none. app does not post webhooks or send email. inquiries are stored in db only; no transactional email / sendgrid / resend integration.

## ancillary details

- **supabase project url** is baked into `main/next.config.ts:20` as an image remote pattern. switching projects requires editing this file too.
- **auth secret** in `main/.env.local:7` is present but the file has no trailing newline — edit carefully.
- **no middleware.ts** means public routes cannot be gated at the edge; all auth enforcement is inside route handlers.
- **admin client leak risk:** `createAdminClient()` is only called from server-only paths (route handlers, server components). no client-side import chain reaches it — service role never shipped to browser.
- **storage direct url writes** bypass cloudinary; two media backends mean delete paths need to target the right one.

---

*integrations audit: 2026-04-16*
