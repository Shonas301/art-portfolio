# technology stack

**analysis date:** 2026-04-16
**manifest:** `main/package.json` (ESM, `"type": "module"`, name `art-portfolio`, private)
**lockfile:** `main/pnpm-lock.yaml` (lockfile v9.0, autoInstallPeers true)

## languages

- typescript `~5.9.3` — all application code under `main/src/**/*.ts`, `**/*.tsx`
- javascript (esm) — config files (`main/eslint.config.js`, `main/vitest.config.ts` is .ts)
- sql (postgresql) — `main/supabase/migrations/001_initial_schema.sql`
- css — `main/src/styles/globals.css` only
- typescript node scripts — `main/scripts/seed-database.ts` (run via tsx)

no python, no shell scripts present in `main/scripts/` anymore (only `seed-database.ts`).

## runtime

**node:** no `.nvmrc` / `.node-version`. local machine runs v23.5.0. next 15 requires node ≥18.18. ES2022 target means modern node only.

**package manager:** pnpm pinned in `main/package.json:51` — `pnpm@10.10.0+sha512.d615db246fe70f25dcfea6d8d73dee782ce23e2245e3c4f6f888249fb568149318637dca73c2c5c8ef2a4ca0d5657fb9567188bfab47f566d1ee6ce987815c39`. local `pnpm --version` reports 9.15.0 (mismatch — corepack would auto-resolve to 10.10.0).

**module system:** `"type": "module"` in `main/package.json:5`. tsconfig `module: ESNext`, `moduleResolution: bundler`.

no workspace config, no monorepo. `main/` is the single package (the repo root is a bare git repo; `main/` is a worktree).

## frameworks

### core
- `next` `^15` — resolved **15.5.9** (app router, SWC bundler, server/client components, api routes). `main/pnpm-lock.yaml:37`
- `react` `^19.2.0` — resolved 19.2.3
- `react-dom` `^19.2.0` — resolved 19.2.3
- `@mui/joy` `5.0.0-beta.52` — **exact pin, not caret.** beta release, no stable 5.0 yet. primary ui library. `main/package.json:19`
- `@mui/icons-material` `^7.3.6` — material design icons (pulls peer `@mui/material@7.3.6`, resolved in lockfile line 19 — joy + material coexist via emotion peer deps)
- `@emotion/react` `^11.14.0`, `@emotion/styled` `^11.14.1` — css-in-js engine for joy

### animation
- `framer-motion` `^12.23.26` — motion components in 12 files (all flipbook chrome, page transitions, modals). primary animation engine.

### data fetching
- `swr` `^2.3.8` — client-side hooks (`main/src/hooks/useArtworks.ts`, `useSections.ts`, `useInquiries.ts`) and admin panel (`main/src/app/admin/artworks/ArtworkManager.tsx`)

### charting
- `recharts` `^3.6.0` — admin dashboard only (`main/src/app/v2/components/AdminDashboard.tsx`)

### backend sdks
- `@supabase/supabase-js` `^2.90.1` — core client
- `@supabase/ssr` `^0.8.0` — next.js 15 cookie-aware client
- `cloudinary` `^2.8.0` — server sdk (upload, delete, signing)
- `next-cloudinary` `^6.17.5` — `CldUploadWidget` in admin
- `next-auth` `^4.24.13` — v4 (not authjs v5). google oauth provider only.

## build/dev tooling

- next swc bundler (no webpack override). `main/next.config.ts` — no custom webpack, turbopack not explicitly enabled.
- `reactStrictMode: true`, `distDir: '.next'`, `ignoreBuildErrors: false`, `ignoreDuringBuilds: false` — ts + eslint errors fail the build.
- image optimization: webp + avif, deviceSizes `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`, imageSizes `[16, 32, 48, 64, 96, 128, 256, 384]`, `minimumCacheTTL: 60`, `dangerouslyAllowSVG: true`, `contentDispositionType: 'attachment'`.
- remote image pattern pinned: `hostname: 'ztpvqdqngykfrtqzyddy.supabase.co'` (`main/next.config.ts:20`).

## testing

**framework:** vitest `^3.2.1` (resolved 3.2.4) — **this is new, previous stack doc said "no test framework installed".**

**test config:** `main/vitest.config.ts` — jsdom environment, globals enabled, setup file `main/vitest.setup.ts` (stubs `window.matchMedia` for reduced-motion checks), `@/` alias resolved to `./src`.

**setup shim:** `main/vitest.setup.ts` imports `@testing-library/jest-dom/vitest`.

**testing libraries:**
- `vitest` `^3.2.1`
- `@vitejs/plugin-react` `^4.5.2`
- `@testing-library/react` `^16.3.0`
- `@testing-library/jest-dom` `^6.6.3`
- `jsdom` `^26.1.0`

**test locations:** `main/src/__tests__/` (4 files: `api-inquiries.test.ts`, `FlipBookContext.test.tsx`, `portfolio-content.test.ts`, `youtube.test.ts`). project CLAUDE.md claims 88+ tests.

**scripts:** `pnpm test` (watch), `pnpm test:run` (once).

## linting

**config:** `main/eslint.config.js` (flat config).

```js
import nextConfig from 'eslint-config-next'
export default [...nextConfig, { ignores: ['dist', 'node_modules'] }]
```

**deps:**
- `eslint` `^9.39.1` (resolved 9.39.2)
- `eslint-config-next` `^16.0.10` — **note: config-next v16 on next v15.5** (cross-major, intentional)
- `@next/eslint-plugin-next` `^15`
- `eslint-plugin-react-hooks` `^7.0.1`
- `typescript-eslint` `^8.46.4` (resolved 8.49.0)
- `@eslint/js` `^9.39.1`, `@eslint/eslintrc` `^3.3.3`, `globals` `^16.5.0`

**no prettier / biome.** no formatter enforced.

## typescript

**config:** `main/tsconfig.json`

- `target: ES2022`, `lib: [ES2022, DOM, DOM.Iterable]`
- `module: ESNext`, `moduleResolution: bundler`
- `strict: true`
- `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`
- `forceConsistentCasingInFileNames: true`
- `jsx: preserve` (next swc handles transform)
- `incremental: true`, `noEmit: true`, `isolatedModules: true`
- `skipLibCheck: true`, `esModuleInterop: true`, `resolveJsonModule: true`, `allowJs: true`
- path alias `@/* → ./src/*`
- plugins: `[{ name: "next" }]`

**types installed:**
- `@types/node` `^24.10.1` (resolved 24.10.4)
- `@types/react` `^19.2.5` (resolved 19.2.7)
- `@types/react-dom` `^19.2.3`

**generated:** `main/next-env.d.ts`, `main/tsconfig.tsbuildinfo`.

## dependency breakdown

### runtime (`dependencies`, 14 total)
| pkg | version | use |
|---|---|---|
| `next` | `^15` → 15.5.9 | framework |
| `react`, `react-dom` | `^19.2.0` → 19.2.3 | ui |
| `@mui/joy` | `5.0.0-beta.52` | component lib (pinned exact) |
| `@mui/icons-material` | `^7.3.6` | icons (drags in `@mui/material@7.3.6` as peer) |
| `@emotion/react` | `^11.14.0` | css-in-js |
| `@emotion/styled` | `^11.14.1` | styled api |
| `framer-motion` | `^12.23.26` | animation |
| `swr` | `^2.3.8` | client data fetching |
| `recharts` | `^3.6.0` | admin charts |
| `@supabase/supabase-js` | `^2.90.1` | db client |
| `@supabase/ssr` | `^0.8.0` | next 15 cookie client |
| `cloudinary` | `^2.8.0` | media sdk |
| `next-cloudinary` | `^6.17.5` | upload widget |
| `next-auth` | `^4.24.13` | auth |

### dev (`devDependencies`, 15 total)
| pkg | version | use |
|---|---|---|
| `typescript` | `~5.9.3` | compiler (tilde = patch only) |
| `vitest` | `^3.2.1` → 3.2.4 | test runner |
| `@vitejs/plugin-react` | `^4.5.2` | react jsx transform for vitest |
| `@testing-library/react` | `^16.3.0` | component testing |
| `@testing-library/jest-dom` | `^6.6.3` | dom matchers |
| `jsdom` | `^26.1.0` | dom env for vitest |
| `eslint` | `^9.39.1` | linter |
| `eslint-config-next` | `^16.0.10` | next rules |
| `@next/eslint-plugin-next` | `^15` | plugin pair |
| `eslint-plugin-react-hooks` | `^7.0.1` | hooks rules |
| `typescript-eslint` | `^8.46.4` | ts rules |
| `@eslint/js` | `^9.39.1` | core rules |
| `@eslint/eslintrc` | `^3.3.3` | legacy config support |
| `globals` | `^16.5.0` | env globals |
| `@types/node`, `@types/react`, `@types/react-dom` | see above | types |

## notable pins & risks

- `@mui/joy@5.0.0-beta.52` is a **beta, exact-pinned**. no upgrade path to stable without breaking changes. review release notes before touching.
- `typescript@~5.9.3` uses tilde — only patch upgrades allowed. minors blocked on purpose.
- `eslint-config-next@^16` while `next@^15` — config-next was released ahead of next 16; works with 15 but not a stable combination.
- `next-auth@^4` — authjs v5 (next-auth v5) is available. intentionally on v4.
- `@mui/joy` is beta; `@mui/material@7.3.6` is pulled transitively via `@mui/icons-material` — two mui universes present in the bundle.
- no `.nvmrc` — node version drift between devs possible.
- packageManager sha is pinned but local machine reports a different pnpm version (9.15.0 vs pinned 10.10.0); corepack will resolve this for `pnpm` invocations.

## scripts

from `main/package.json:6-14`:

```
pnpm dev       → next dev
pnpm build     → next build   (fails on ts/eslint errors)
pnpm start     → next start
pnpm lint      → next lint
pnpm clean     → rm -rf .next
pnpm test      → vitest       (watch)
pnpm test:run  → vitest run   (single pass, 88+ tests per CLAUDE.md)
```

type check is not wired to a script — run manually: `npx tsc --noEmit`.

utility scripts:
- `main/scripts/seed-database.ts` — seeds supabase from static content. run via `npx tsx scripts/seed-database.ts`.

## platform requirements

**dev:**
- node ≥18.18 (effectively v20+ given ES2022 target). local dev uses v23.
- pnpm 10.10.0 via corepack (from packageManager field).
- no docker.
- no `.nvmrc` / `.node-version`.

**prod:**
- vercel implied (`.vercel` in `main/.gitignore`). no `vercel.json` present, so defaults apply.
- no `Dockerfile`, no `.github/workflows/`, no CI config.
- standard `pnpm build && pnpm start`.

## configuration files

| path | purpose |
|---|---|
| `main/package.json` | deps, scripts, packageManager pin |
| `main/pnpm-lock.yaml` | resolved versions |
| `main/tsconfig.json` | strict ts, `@/*` alias |
| `main/next.config.ts` | image optimization, strict mode, supabase remote pattern |
| `main/eslint.config.js` | flat config, extends `eslint-config-next` |
| `main/vitest.config.ts` | jsdom, globals, setup file, `@/` alias |
| `main/vitest.setup.ts` | jest-dom matchers + `matchMedia` stub |
| `main/.env.example` | env var template |
| `main/.env.local` | local secrets (gitignored via `*.local`) |
| `main/.gitignore` | ignores `.next`, `.vercel`, `*.local`, `dist`, `node_modules` |

## gotchas

- `NEXT_PUBLIC_*` env vars must be accessed as literal `process.env.NEXT_PUBLIC_X` for next to inline them in the client bundle (see `main/src/lib/env.ts:41-45`). dynamic `process.env[key]` lookups silently fail in client code.
- `@mui/joy` is beta-pinned; upgrading invites breakage.
- ts `noUnusedLocals` / `noUnusedParameters` are on — leaving stub params will break the build. use `_` prefix or remove.
- `isolatedModules: true` means every ts file must be independently compilable — no type-only re-exports without `export type`.
- `skipLibCheck: true` means third-party type errors won't surface at build time.

---

*stack analysis: 2026-04-16*
