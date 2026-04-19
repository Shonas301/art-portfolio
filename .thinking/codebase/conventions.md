# coding conventions

**analysis date:** 2026-04-16

rewrite of prior doc — testing section moved to `testing.md`; file paths and line numbers updated to current state.

## naming

**files:**
- components: `PascalCase.tsx` (`src/components/Banner.tsx`, `src/app/v2/components/BinderTabs.tsx`)
- hooks: `camelCase.ts` with `use` prefix (`src/hooks/useArtworks.ts`, `src/app/v2/hooks/useTouchInput.ts`)
- utilities/libs/data: kebab-case (`src/app/v2/utils/furling-utils.ts`, `src/app/v2/data/portfolio-content.ts`, `src/lib/env.ts`)
- types: kebab-case (`src/types/gallery.ts`)
- api routes: always `route.ts` under a folder whose name is the segment (`src/app/api/artworks/route.ts`, `src/app/api/inquiries/route.ts`)
- tests: co-located under `src/__tests__/`, named after the subject file (`src/__tests__/FlipBookContext.test.tsx`, `src/__tests__/api-inquiries.test.ts`)

**functions:**
- components: `PascalCase` named function declarations — `export function BinderTabs()` (`src/app/v2/components/BinderTabs.tsx:9`)
- hooks: `camelCase` with `use` prefix — `export function useFlipBook()` (`src/app/v2/context/FlipBookContext.tsx`)
- utility fns: `camelCase`, no prefix — `getPhysicalPageForSection`, `buildArtworksKey` (`src/hooks/useArtworks.ts:39`)
- api handlers: HTTP verb uppercase — `GET`, `POST`, etc. (`src/app/api/inquiries/route.ts`)
- event handlers: `handle` prefix — `handleTabClick`, `handleResumeClick`, `handleKeyDown` (`src/app/v2/components/BinderTabs.tsx:12-21`)
- internal helpers inside routes: `camelCase` — `isRateLimited`, `getClientIp`, `cleanupRateLimitMap` (`src/app/api/inquiries/route.ts:48,66,33`)

**variables:**
- `camelCase` for locals and state (`currentPageIndex`, `selectedIndex`, `scrollAccumulator`)
- `UPPER_SNAKE_CASE` for module-scope constants — `TOTAL_PAGES`, `VALID_INQUIRY_TYPES`, `RATE_LIMIT_WINDOW_MS`, `EMAIL_REGEX` (`src/app/api/inquiries/route.ts:12,19,26`)
- boolean state: `is` prefix — `isFlipping`, `isBookFlipped`, `isSubmitting`, `isEngaged` (`src/app/v2/context/FlipBookContext.tsx:7-22`)

**types/interfaces:**
- `PascalCase` always — `FlipBookState`, `BendingPage`, `InquiryFormProps` (`src/app/v2/context/FlipBookContext.tsx:6,26`)
- discriminated-union action type strings: `UPPER_SNAKE_CASE` — `'FLIP_TO_PAGE'`, `'BOOK_FLIP_COMPLETE'` (`src/app/v2/context/FlipBookContext.tsx:39-58`)
- props interfaces: component name + `Props` — `InquiryFormProps` (`src/components/InquiryForm.tsx:23`)
- supabase row variants: base + `Insert` / `Update` — `ArtworkInsert`, `InquiryInsert` (`src/lib/supabase/types.ts`)

## comments

lowercase, terse, no trailing period (per CLAUDE.md project rule). mirror the user's voice.

```ts
// centralized env var validation
// throws descriptive errors when required vars are missing at startup
```
(`src/lib/env.ts:1-2`)

```ts
// hide on mobile — small colored slivers leak at viewport edge
display: { xs: 'none', md: 'block' },
```
(`src/app/v2/components/BinderTabs.tsx:38-39`)

```tsx
{/* flip book container */}
{/* front of book */}
```

**exception:** capitalize only when referencing a `PascalCase` type/method/variable (e.g. `// FlipBookProvider wraps ...`). jsdoc blocks exist only in `src/lib/youtube.ts` and should not be added elsewhere unless the user asks.

**silent catches:** never write bare `catch {}`. at minimum `console.error` with a context prefix — see `src/app/api/inquiries/route.ts` for the pattern (`console.error('[inquiries POST]', ...)` style).

## formatting

- no prettier config present; `.prettierrc*` absent. relies on editor defaults
- 2-space indentation throughout
- quotes: **inconsistent** — `.tsx` component files use single quotes (`src/app/v2/components/BinderTabs.tsx`, `src/components/InquiryForm.tsx`); api routes and auth/supabase libs use double quotes (`src/app/api/inquiries/route.ts`, `src/lib/auth/config.ts`). match the convention of the file you're editing
- semicolons: **inconsistent** — absent in most component files, present in api routes, lib files, and hooks. again, match surrounding file
- trailing commas: present in most multi-line object/array literals, not enforced

if you add tooling, don't silently reformat the whole tree — it will explode the diff.

## typescript

`tsconfig.json`:
- `strict: true`
- `noUnusedLocals: true` — unused locals fail the build
- `noUnusedParameters: true` — prefix unused params with `_` if you must keep them
- `noFallthroughCasesInSwitch: true`
- `forceConsistentCasingInFileNames: true`
- `moduleResolution: "bundler"`, `target: "ES2022"`, `jsx: "preserve"`
- path alias `@/*` → `./src/*` (`tsconfig.json:22-24`)

build enforcement:
- `next.config.ts:11-16` — `typescript.ignoreBuildErrors: false`, `eslint.ignoreDuringBuilds: false`. ts errors and lint errors both block `next build`
- no test runner in the build path — tests are a separate gate (see `testing.md`)

preferred patterns:
- `import type { Foo } from '...'` for pure-type imports (`src/hooks/useArtworks.ts:5`)
- non-null assertion `!` on env vars is **discouraged** — use the `env.ts` getters instead (see `src/lib/env.ts:43-57`)
- `NEXT_PUBLIC_` vars must be accessed as literal `process.env.NEXT_PUBLIC_X` on the client side (`src/lib/env.ts:40-57`). dynamic `process.env[key]` lookups don't get inlined in the next.js client bundle

## eslint

`eslint.config.js` — flat config, 9 lines:
```js
import nextConfig from 'eslint-config-next'

export default [
  ...nextConfig,
  { ignores: ['dist', 'node_modules'] },
]
```

- base: `eslint-config-next` spread in full
- no custom rules
- `typescript-eslint` and `eslint-plugin-react-hooks` installed as deps but not configured beyond what next brings
- run via `pnpm lint` → `next lint`

## component patterns

**client vs server:**
- `'use client'` is the default for any interactive component. ~44 files carry it
- server components: `src/app/layout.tsx` (metadata export), `src/app/page.tsx` (redirect), `src/components/Footer.tsx`
- `'use client'` goes on line 1, no blank line above; blank line below, then imports

**component skeleton:**
```tsx
'use client'

// react
import { useState, useCallback } from 'react'
// next
import Image from 'next/image'
// mui joy (individual paths only)
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
// mui icons
import SendIcon from '@mui/icons-material/Send'
// local (@/alias for cross-area, relative for same area)
import { GalleryGrid } from '@/components/GalleryGrid'
import { useFlipBook } from '../context/FlipBookContext'
import type { GalleryData } from '../../data/portfolio-content'

interface FooProps {
  title: string
}

export function Foo({ title }: FooProps) {
  // hooks first
  const { state, dispatch } = useFlipBook()
  const [open, setOpen] = useState(false)

  // handlers next
  const handleClick = () => { /* ... */ }

  // early returns
  if (!state.ready) return null

  // render
  return <Box sx={{ /* ... */ }}>{title}</Box>
}
```

see `src/app/v2/components/BinderTabs.tsx` and `src/components/InquiryForm.tsx` for real examples.

**page components:**
- v1: `export default function PageName()` — next requires default exports for `page.tsx`
- v2: `src/app/v2/page.tsx:389` — `export default function V2Page()` wraps internal `FlipBookContent` + `FlipBookWithAnalytics` (named, not exported)
- section components under `src/app/v2/components/pages/` are named exports

**context + reducer (v2):**
- one file holds state type, action union, reducer, provider, and hook
- `src/app/v2/context/FlipBookContext.tsx` — `FlipBookState` (`:6`), `FlipBookAction` union (`:39-58`), provider and `useFlipBook` hook
- hook throws if used outside provider: `throw new Error('useFlipBook must be used within a FlipBookProvider')`
- same pattern in `src/app/v2/context/AnalyticsContext.tsx`

**custom hooks:**
- shared: `src/hooks/` — swr-based data hooks return `{ data, isLoading, error, ...mutationFns }` (`src/hooks/useArtworks.ts`)
- v2-only: `src/app/v2/hooks/` — dom-interaction hooks accept refs (`useTouchInput(containerRef)`)

## import order

observed everywhere:

1. `'use client'` directive (if needed)
2. react / react-dom (`useState`, `useEffect`, type-only `ReactNode`)
3. next.js (`next/navigation`, `next/image`, `next/link`, `next/server`)
4. mui joy — always from individual paths: `@mui/joy/Box`, `@mui/joy/Typography`. **never barrel**: `import { Box, Typography } from '@mui/joy'` is not used in this codebase
5. mui icons — `@mui/icons-material/SendIcon`
6. third-party (`framer-motion`, `swr`, `next-auth`, `@supabase/...`)
7. local via `@/` alias (`@/components/...`, `@/lib/...`, `@/types/...`)
8. local relative (`./`, `../`, `../../`) — used within the same feature area, especially inside `src/app/v2/`
9. `import type` — either at the bottom of its group or mixed with value imports

example: `src/app/v2/components/BinderTabs.tsx:3-7`.

## mui joy usage

**theme (`src/lib/theme.ts`):**
- `extendTheme` in `src/lib/theme.ts:4-126`
- full purple/pink/amber palette defined under `palette.primary`, `palette.danger`, `palette.warning`
- system font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (`:76-78`)
- radius scale xs–xl (`:95-101`)
- `JoyButton` override: 28px radius, 12px 32px padding, weight 600 (`:102-113`)
- `JoyCard` override: 16px radius, translateY(-4px) on hover (`:114-124`)
- wrapped via `CssVarsProvider` in `src/components/ThemeProvider.tsx`, light mode only

**styling approach:**
- `sx` prop is the only styling primitive. no css modules, no styled-components, no `styled()`, no `css()`
- global css: `src/styles/globals.css` — 5 lines, body reset only

**sx patterns:**
```ts
// responsive via object syntax
sx={{ fontSize: { xs: '2rem', md: '3rem' }, display: { xs: 'none', md: 'block' } }}

// spacing uses numeric shorthand (theme spacing units)
sx={{ p: 4, mb: 2, gap: 3 }}

// colors: hardcoded hex, NOT theme palette tokens (see concerns.md for why this is tech debt)
sx={{ color: '#9333ea', bgcolor: '#fef3c7' }}

// gradients inline
sx={{ background: 'linear-gradient(90deg, #7e22ce 0%, #9333ea 50%, #ec4899 100%)' }}
// (see src/components/Banner.tsx:29)

// hover via pseudo-selector
sx={{
  transition: 'all 0.2s ease',
  '&:hover': { transform: 'scale(1.05)', bgcolor: '#7e22ce' },
}}

// scrollbar styling via pseudos
sx={{
  '&::-webkit-scrollbar': { width: '8px' },
  '&::-webkit-scrollbar-thumb': { background: '#c8c4bc', borderRadius: '4px' },
}}
```

**hardcoded color families in use (not theme tokens):**
- primary purple: `#9333ea`, `#7e22ce`, `#a855f7`, `#c084fc`
- accent pink: `#ec4899`, `#db2777`, `#f472b6`
- amber/gold: `#fbbf24`, `#f59e0b`, `#d97706`
- neutrals: `#000000`, `#262626`, `#525252`, `#fefefe`

**a11y on tab-like controls:** use `aria-label` with the pattern `"jump to {section}"` (`src/app/v2/components/BinderTabs.tsx:78`). both `BinderTabs` and `MobileNav` now share this pattern — scripting with `agent-browser find label` will hit strict mode violations; use `@ref` from `snapshot -i` instead (see `.thinking/research/visual-verification-playbook.md`).

## error handling

**api routes:**
- wrap the whole handler in try/catch
- separate inner try/catch around `request.json()` → 400 `'invalid json in request body'`
- validate inputs before any db call
- return structured json: `{ error: 'lowercase message' }` + http status
- log with `console.error` and a context prefix

```ts
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'invalid json in request body' }, { status: 400 })
    }
    // validate, then insert...
  } catch (err) {
    console.error('[inquiries POST]', err)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}
```
(`src/app/api/inquiries/route.ts`)

**client components:**
- context hooks throw on missing provider
- swr surfaces fetch failures via the `error` return
- form submission tracks status via discriminated state: `'idle' | 'success' | 'error'` (`src/components/InquiryForm.tsx:58`)
- no global error boundary — only `src/app/v2/components/ErrorBoundary.tsx` wraps the flipbook

**reducer:**
- guard clauses at top of each case; return `state` unchanged if the action is invalid (mid-flip, out of bounds, etc.) — `src/app/v2/context/FlipBookContext.tsx`

## logging

- no structured logging lib. `console.log` / `console.error` only
- debug `console.log` is gated behind `state.debugMode` inside reducer and components
- api `console.error` prefixes: `'[inquiries POST]'`, `'[artworks GET]'`, etc.
- analytics context logs localStorage failures via `console.error`

## function & module design

- components range from ~15 lines (`LandingPage`) to 300+ (`FlipBookContent` in `src/app/v2/page.tsx`)
- props destructured in signature: `function Foo({ title, data }: FooProps)`
- hooks take an options object with defaults: `useArtworks(options: UseArtworksOptions = {})` (`src/hooks/useArtworks.ts:48`)
- named exports for every component/hook/util; default export **only** for next.js `page.tsx` and `layout.tsx`
- no barrel `index.ts` files anywhere — import direct paths
- re-export types with `export type` (e.g. `src/lib/supabase/server.ts`)
- `as const` used for locked-down literal objects — `Z_LAYERS`, `VALID_INQUIRY_TYPES` (`src/app/api/inquiries/route.ts:12`)

---

*convention analysis: 2026-04-16*
