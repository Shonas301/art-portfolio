# api route testing

vitest pattern for testing next.js app-router api routes that depend on supabase + next-auth.

file that uses this pattern: `src/__tests__/api-inquiries.test.ts`.

## the pattern

```ts
import { beforeEach, describe, it, expect, vi } from 'vitest'

// 1. mock collaborators at module level, BEFORE importing the route
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))
vi.mock('@/lib/auth/config', () => ({ authOptions: {} }))

const mockInsert = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: vi.fn((table: string) => ({
        insert: mockInsert,
        // ...fake query builder chain
      })),
    })
  ),
}))

// 2. import the route AFTER mocks resolve — top-level await is supported
const { POST, _testResetRateLimit } = await import('@/app/api/inquiries/route')

beforeEach(() => {
  vi.clearAllMocks()
  _testResetRateLimit()
})

describe('POST /api/inquiries', () => {
  it('rejects invalid json', async () => {
    // ...
  })
})
```

## two key moves

1. **top-level `await import()`** — works because `package.json` has `"type": "module"` and vitest supports top-level await. this lets you declare mocks first, then pull the route after. importing the route eagerly at the top of the file would bind it to real supabase/next-auth before mocks apply.

2. **`_test`-prefixed reset exports** — when a route module holds stateful in-memory data (e.g. a rate-limit map), expose a reset helper with a `_test` prefix:
   ```ts
   // src/app/api/inquiries/route.ts:25
   export function _testResetRateLimit() { rateLimitMap.clear() }
   ```
   tests call it in `beforeEach`. avoids tests reaching into module internals and makes the test surface explicit.

## error-throw testing

always silence `console.error` around expected throws so test output stays clean:

```ts
const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
expect(() => renderHook(() => useFlipBook())).toThrow(
  'useFlipBook must be used within a FlipBookProvider'
)
spy.mockRestore()
```

(`src/__tests__/FlipBookContext.test.tsx:578-587`)

## conventions

- tests live at `src/__tests__/`, named after the subject file.
- command: `pnpm test:run` (vitest, 88 tests, ~2s).
- jsdom environment (set in `vitest.config.ts`). `matchMedia` stub in `vitest.setup.ts`.
- there is currently no ci — tests are a local gate only. see `.thinking/codebase/testing.md`.

## applying

when adding a new route with stateful in-memory data:

1. expose `_testResetX()` from the route module.
2. in the test file, declare `vi.mock()` for supabase, next-auth, and any other external collaborator.
3. import the route via top-level `await import()`.
4. `vi.clearAllMocks()` + call the reset in `beforeEach`.

## source

`.thinking/codebase/testing.md` (§ mocking).
