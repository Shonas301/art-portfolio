# testing patterns

**analysis date:** 2026-04-16

full rewrite — prior doc (2026-02-01) declared "no tests exist". the project now has vitest + testing-library set up with 88 passing tests across 4 files.

## framework

- runner: **vitest ^3.2.1** (resolved 3.2.4)
- assertion/dom matchers: `@testing-library/jest-dom` ^6.6.3 (via `vitest.setup.ts`)
- react hook testing: `@testing-library/react` ^16.3.0 (`renderHook`, `act`)
- dom: `jsdom` ^26.1.0
- react plugin: `@vitejs/plugin-react` ^4.5.2
- all dev-only deps in `main/package.json:36-49`

## config

**`main/vitest.config.ts`** (17 lines):
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- `globals: true` — `describe`, `it`, `expect`, `vi` available without imports (though tests still import them explicitly; see `src/__tests__/youtube.test.ts:1`)
- `@` alias mirrors `tsconfig.json` so tests can `import from '@/lib/youtube'`
- `environment: 'jsdom'` — dom APIs available for hook and component tests

**`main/vitest.setup.ts`** (17 lines):
- imports `@testing-library/jest-dom/vitest` to register matchers
- stubs `window.matchMedia` — jsdom doesn't implement it, and reduced-motion checks in `FlipBookContext` blow up without the stub. returns `matches: false` by default

## run commands

```zsh
cd main/
pnpm test          # watch mode (vitest default)
pnpm test:run      # single pass — this is what gets run for verification
```

scripts declared in `main/package.json:12-13`:
- `"test": "vitest"`
- `"test:run": "vitest run"`

no coverage script is wired up. `vitest run --coverage` would work but requires adding `@vitest/coverage-v8` (not currently installed).

## layout

all tests live in a single directory:

```
main/src/__tests__/
  api-inquiries.test.ts       275 lines   13 tests
  FlipBookContext.test.tsx    589 lines   40 tests
  portfolio-content.test.ts   112 lines   19 tests
  youtube.test.ts              73 lines   16 tests
```

**total: 88 passing tests, 4 files, ~2.2s run time.**

convention: `src/__tests__/<subject>.test.{ts,tsx}` — not co-located with source. `.tsx` extension when jsx/react-rendering is involved, `.ts` otherwise.

## coverage areas

| subject | file | notes |
|---------|------|-------|
| `flipBookReducer` — 40 tests on the v2 reducer | `src/__tests__/FlipBookContext.test.tsx` | covers `FLIP_TO_PAGE` clamping, guarded dispatches, `TOUCH_INPUT` accumulator math, boundary feedback, admin login/logout, view-mode toggle, reduced-motion shortcutting, `useFlipBook` throwing outside provider |
| `getPhysicalPageForSection`, `getSectionAtPage`, `getLastContentPage`, `sectionMappings` integrity | `src/__tests__/portfolio-content.test.ts` | verifies unique ids, ascending page order, in-bounds pages, fallback to 0 for unknown section |
| `getYouTubeVideoId`, `getYouTubeEmbedUrl` | `src/__tests__/youtube.test.ts` | all url shapes (`youtube.com/watch`, `youtu.be`, `/embed`, query params, timestamps), returns `null` for non-youtube urls |
| `POST /api/inquiries` | `src/__tests__/api-inquiries.test.ts` | validates every field (name, email, inquiry_type, message), email regex, invalid json body, whitespace trimming, all three inquiry types (`general`, `commission`, `purchase`) |

**not covered yet** (from prior doc, still accurate):
- `GET/POST/PUT/DELETE /api/artworks`, `/api/sections`, `/api/inquiries` GET
- auth flow (`src/lib/auth/config.ts` callbacks)
- `src/app/v2/utils/furling-utils.ts` — pure math, easy target
- swr hooks (`useArtworks`, `useSections`, `useInquiries`)
- any react component rendering (nothing uses `render()` yet; only `renderHook`)
- no e2e — no playwright or cypress configured

## conventions

**imports at top of every test file:**
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
```
despite `globals: true`. explicit imports preferred — keep doing this.

**structure — nested `describe` blocks:**
```ts
describe('FlipBookContext reducer', () => {
  describe('FLIP_TO_PAGE', () => {
    it('clamps to page 0 when given negative value', () => { ... })
  })
})
```
(`src/__tests__/FlipBookContext.test.tsx:17-46`)

outer describe names the subject (reducer name, function name, route). inner describes name the action/branch. `it` starts with a verb in lowercase: `'returns null for empty string'`, `'clamps to max page'`.

**hook testing — `renderHook` + wrapper:**
```tsx
function wrapper({ children }: { children: ReactNode }) {
  return <FlipBookProvider>{children}</FlipBookProvider>
}

function renderFlipBook() {
  return renderHook(() => useFlipBook(), { wrapper })
}

// then:
const { result } = renderFlipBook()
act(() => {
  result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 5 })
})
expect(result.current.state.targetPageIndex).toBe(5)
```
(`src/__tests__/FlipBookContext.test.tsx:8-15,50-56`)

every state-mutating dispatch goes inside `act()` — don't skip this or you'll get react warnings and stale reads.

**error-throw testing:**
```ts
const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
expect(() => renderHook(() => useFlipBook())).toThrow('useFlipBook must be used within a FlipBookProvider')
spy.mockRestore()
```
(`src/__tests__/FlipBookContext.test.tsx:578-587`) — always silence `console.error` around expected throws so logs stay clean.

## mocking

**api route tests mock supabase + next-auth at the module level, before importing the route:**
```ts
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))
vi.mock('@/lib/auth/config', () => ({ authOptions: {} }))

const mockInsert = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: vi.fn((table: string) => { /* fake query builder */ }),
    })
  ),
}))

// import route AFTER mocks
const { POST, _testResetRateLimit } = await import('@/app/api/inquiries/route')
```
(`src/__tests__/api-inquiries.test.ts:4-63`)

two things to note:
1. **top-level `await import()`** — vitest supports this. works because `type: module` is set in `package.json`
2. **`_testResetRateLimit`** is a test-only export from the route (`src/app/api/inquiries/route.ts:25`). when adding stateful modules, expose a reset hook with a `_test` prefix rather than reaching into internals

**rate-limit reset in `beforeEach`:**
```ts
beforeEach(() => {
  vi.clearAllMocks()
  _testResetRateLimit()
})
```
(`src/__tests__/api-inquiries.test.ts:66-69`)

**request construction — use plain `Request`, not `NextRequest`:**
```ts
function createMockRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
// then cast at call site: POST(request as any)
```
(`src/__tests__/api-inquiries.test.ts:54-60,79`) — `NextRequest` is a pain to construct in tests; the `as any` cast is pragmatic.

## ci

**no ci pipeline exists.** no `.github/workflows/`, no vercel config, no netlify.toml, no dockerfile. tests run locally only. quality gates at present:

- `pnpm test:run` — manual, local
- `pnpm lint` → `next lint` — manual
- `pnpm build` — enforces ts + eslint errors (`next.config.ts:11-16` sets `ignoreBuildErrors: false`, `ignoreDuringBuilds: false`)
- no pre-commit hook, no husky, no lint-staged

if ci is added later, the obvious wiring is a github action that runs `pnpm install --frozen-lockfile && pnpm lint && pnpm test:run && pnpm build` in `main/`.

## visual verification (out-of-band)

vitest does not cover visual regressions or full-page rendering. the project uses **agent-browser** for visual checks. playbook: `.thinking/research/visual-verification-playbook.md`.

key points for new claude sessions:

- start dev with `pnpm dev` from `main/` — app redirects `/` → `/v2` (307)
- `/v2` is the primary product (flipbook); `/v1` is the legacy gallery
- prefer binder-tab navigation over arrow keys — arrow keys crawl through blank interstitial pages
- `BinderTabs` and `MobileNav` both expose `aria-label="jump to {section}"`. `agent-browser find label "jump to intro"` now hits 2 elements (strict mode violation). **use `@ref` from `snapshot -i` and click by ref** — `agent-browser click @e4`
- flip animations are ~1–1.5s; `sleep 2` before screenshotting after a nav click
- expected dev errors when google oauth env vars are missing: `/api/auth/session` returns 500. this is fine — admin auth just won't work locally
- full section checklist at the bottom of the playbook

## recommended next test targets

in rough priority order (highest value, lowest effort first):

1. `src/app/v2/utils/furling-utils.ts` — pure math (`easeInOutCubic`, `getSegmentFurlDepth`, `calculateSegmentTransforms`). zero deps, trivial to test
2. api routes without complex deps: `GET /api/sections`, `GET /api/artworks` — mostly read paths
3. swr data hooks — use `renderHook` + a `SWRConfig` provider that injects a fake fetcher. `src/hooks/useArtworks.ts` is the canonical shape
4. `src/lib/auth/config.ts` — callback logic (signIn allowlist, session shape)
5. component rendering — start with a small pure component like `src/app/v2/components/PageIndicator.tsx`. will need `ThemeProvider` wrapper

---

*testing analysis: 2026-04-16*
