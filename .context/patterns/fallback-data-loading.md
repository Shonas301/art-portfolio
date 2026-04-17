# fallback data loading

v2 flipbook loads content from supabase at mount, with a static typescript fallback compiled into the bundle. if supabase is missing, misconfigured, or throws at any step, the static fallback serves. **the fallback is load-bearing** — the site is fully functional offline from supabase.

## shape

```
┌─────────────────────┐
│ portfolio-content.ts│  static fallback (in-bundle)
│  sectionMappings    │
│  pageContent[]      │
└──────────┬──────────┘
           │ imported by
           ▼
┌─────────────────────┐     mount effect      ┌─────────────────────────┐
│ PageStack.tsx       │──fetchAllPageContentClient()─▶│ supabase browser client │
│ useState(content)   │                        └────────────┬────────────┘
│ useEffect(fetch)    │                                     │
└──────────┬──────────┘                                     ▼
           │                                      parallel queries merge
           ▼                                      into static shape
       rendered content
```

## implementation

`src/lib/content/dynamic-content.ts:23,51`:

1. if `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` are absent → return static `pageContent` untouched.
2. lazy-import `@/lib/supabase/client`, call `getClient()` singleton.
3. parallel queries: `sections`, `site_settings`. then for each gallery section, fetch `gallery_items` joined with `artworks`.
4. merge supabase rows into the static `pageContent` shape. gallery data replaces `items[]`; intro/contact/code/landing merge settings into `data`.
5. any error at any step → `console.error` + return static `pageContent`.

consumer: `src/app/v2/components/PageStack.tsx:96` — `useEffect` on mount, `isFetching` state gates a CircularProgress spinner at `PageStack.tsx:226`.

## why this shape

- **no hydration mismatch** — content loads on client after initial render, so SSR serves a deterministic page.
- **full offline operation** — supabase outage doesn't blank the site.
- **bundled fallback stays current** — static content lives in `src/app/v2/data/portfolio-content.ts`, edited with the code. supabase is an overlay, not a replacement.
- **schema translator lives in one place** — `artworkToGalleryItem()` at `dynamic-content.ts:31` maps snake_case supabase rows to the camelCase `GalleryItem` type. if supabase schema changes, one file moves.

## applying this pattern

when adding a new content source:

1. define the static shape first in typescript. import it into the component.
2. add a fetch helper in `src/lib/content/` that returns the same shape.
3. gate the fetch on env var presence. return static immediately if missing.
4. wrap every db call in try/catch. on error, `console.error('[context]', err)` and return static.
5. in the consumer, `useEffect(fetch → setState)` on mount. render static until fetch resolves.

## don't

- don't throw from the fetch — static fallback must remain reachable.
- don't silent-catch. always `console.error` with a context prefix (project rule).
- don't make the static content a stub — it must be rendering-complete on its own.

## source

`.thinking/codebase/architecture.md` (§ data flow: supabase → client).
