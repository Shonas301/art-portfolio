# cruft-next-react-monolith — build plan

created: 2026-04-12
source stream: [[tinamation/streams/next-cookiecutter|next-cookiecutter]]
repo: https://github.com/Crue-Studios/cruft-next-react-monolith
local bare clone: `/Users/jasonshipp/code/friends/cruft-next-react-monolith.git`

## what this is

opinionated cruft template producing a next.js 15 + react 19 + material ui v7 monolith. distilled from the next-cookiecutter stream decisions (2026-02-08 research + 2026-04-12 mui reversal).

**why cruft over cookiecutter**: cruft layers update-tracking on top of cookiecutter. generated projects can pull template changes via `cruft update`. important because this template will evolve; consumers shouldn't be stuck on the bootstrap-version forever.

**single-app, opinionated, owner-preferences-first.** no monorepo. no "choose your stack" prompts beyond identity/name variables.

## stack (locked)

- next.js 15 (app router, server components default)
- react 19
- typescript strict
- material ui v7 + emotion (MD3 defaults accepted)
- supabase (auth + db + storage; @supabase/ssr)
- pnpm
- vitest + testing-library + playwright
- eslint flat + prettier
- t3-env + zod
- husky + lint-staged
- github actions CI

## cookiecutter variables (initial draft)

keep the prompt list short — every variable is a decision the consumer must make at bootstrap.

```json
{
  "project_name": "My App",
  "project_slug": "{{ cookiecutter.project_name|lower|replace(' ', '-') }}",
  "project_description": "A next.js application",
  "author_name": "Jason Shipp",
  "author_email": "",
  "github_org": "Crue-Studios",
  "supabase_project_ref": "TODO-SUPABASE-REF",
  "node_version": "20",
  "_copy_without_render": ["public/*"]
}
```

supabase project ref is prompted because the template wires `@supabase/ssr` against a specific project. default is the literal string `TODO-SUPABASE-REF` — greppable, obviously-not-real, and if the consumer skips the prompt it shows up in `.env.example` as a clear "replace me" marker. pre_gen hook can optionally warn if the default value made it through (non-blocking).

## phases

### phase 0 — repo scaffolding

- [ ] README.md (what this is, how to use: `cruft create …`)
- [ ] LICENSE (MIT)
- [ ] .gitignore (ignore `_cruft.json` artifact? no — consumer needs it committed)
- [ ] cookiecutter.json (variables above)
- [ ] hooks/pre_gen_project.py — validate project_slug format
- [ ] hooks/post_gen_project.py — `git init`, initial commit, `pnpm install`
- [ ] Makefile or `scripts/test-generate.sh` — regenerates into a tmp dir to smoke-test the template locally
- [ ] .github/workflows/template-test.yml — CI that runs `test-generate.sh` + generated project's `pnpm lint && pnpm test` on every template PR

### phase 1 — next.js core

structure inside `{{cookiecutter.project_slug}}/`:

```
src/
  app/
    (public)/
      layout.tsx
      page.tsx
    (auth)/
      layout.tsx
      login/page.tsx
    layout.tsx              # root layout, ThemeProvider + metadata
    error.tsx               # root error boundary
    global-error.tsx
    not-found.tsx
  components/
  lib/
    env.ts                  # t3-env config
    theme.ts                # CssVarsProvider theme (minimal override)
    supabase/
      server.ts
      client.ts
      middleware.ts
  hooks/                    # SWR hooks
middleware.ts               # supabase auth middleware
```

- [ ] package.json (pinned versions for all deps, especially mui v7)
- [ ] tsconfig.json (strict, path alias `@/*` → `src/*`)
- [ ] next.config.ts
- [ ] eslint.config.mjs (flat config, next-core-web-vitals + typescript)
- [ ] .prettierrc + .prettierignore
- [ ] root layout with CssVarsProvider + AppRouterCacheProvider
- [ ] error boundaries (error.tsx, global-error.tsx)
- [ ] route groups wired with separate layouts

### phase 2 — env validation

- [ ] `src/lib/env.ts` with t3-env + zod
- [ ] `.env.example` with every required var documented
- [ ] **critical**: `NEXT_PUBLIC_*` vars accessed as literals per [[tinamation/streams/tinamation|tinamation]] lesson (dynamic `process.env[key]` doesn't inline in next.js client bundle)

### phase 3 — supabase integration

- [ ] @supabase/ssr clients (server, client, middleware variants)
- [ ] middleware.ts with session refresh
- [ ] login page using supabase auth directly (not auth.js)
- [ ] protected route example in `(auth)/` group
- [ ] `supabase/` dir with config.toml, placeholder migrations
- [ ] RLS-ready example table migration (showing `auth.uid()` pattern in policies)

### phase 4 — testing infra

- [ ] vitest.config.ts (jsdom env for component tests, node for unit)
- [ ] @testing-library/react + @testing-library/jest-dom setup
- [ ] playwright.config.ts + e2e/ dir with smoke test hitting `/`
- [ ] example unit test, example component test, example e2e test
- [ ] `pnpm test`, `pnpm test:run`, `pnpm test:e2e` scripts

### phase 5 — quality gate

- [ ] husky install via postinstall
- [ ] pre-commit: lint-staged (prettier + eslint --fix on staged files)
- [ ] pre-push: `pnpm typecheck && pnpm test:run`
- [ ] .github/workflows/ci.yml (lint, typecheck, test:run, build)
- [ ] dependabot.yml for weekly dep updates

### phase 6 — server actions + mutation patterns

- [ ] example server action in `src/app/(auth)/example/actions.ts`
- [ ] pattern: server action for mutations, route handlers only for webhooks/external consumers
- [ ] example SWR hook paired with server-action-based revalidation

### phase 7 — cookiecutter polish + first consumer

- [ ] full end-to-end generation test: `cruft create` → `pnpm install` → `pnpm dev` → smoke test at localhost:3000
- [ ] template README with: prerequisites, usage, variable reference, update workflow (`cruft update`)
- [ ] migrate [[bunnymuffins/streams/bunnymuffins-redux|bunnymuffins-redux]] (first consumer) onto this template via `cruft link` or regeneration if not too far along

## what's explicitly excluded

- monorepo / turborepo (single-app only)
- configurable color scheme (MD3 defaults, override in one file if needed)
- custom ThemeProvider wrapper (use CssVarsProvider directly — reversed from tinamation)
- auth.js / nextauth (supabase auth direct)
- cloudinary (supabase storage only)
- v1/v2 parallel routes (single production route tree)
- pigment-css (stays on emotion until v7 makes pigment default)
- template drift remediation (deliberately unsolved; `cruft update` handles it at the consumer's pace)

## open questions

- [ ] does cruft hook logic (`post_gen_project.py`) run `pnpm install` or leave it to the consumer? (lean: install, but fail gracefully if pnpm not on path)
- [ ] include a `components/` example or keep it empty? (lean: empty, avoid craft bias leaking in)
- [ ] include an example SWR hook or only document the pattern? (lean: one example for fetch + cache pattern, nothing domain-specific)
- [ ] storybook? (lean: no for v1 — added friction; template consumers add if they want it)
- [ ] analytics / error reporting (sentry)? (lean: no defaults — project-specific; document in README as "common additions")

## success criteria

- `cruft create gh:Crue-Studios/cruft-next-react-monolith` → generated project runs `pnpm dev` cleanly on first try
- all CI gates green on generated project out of the box
- [[bunnymuffins/streams/bunnymuffins-redux|bunnymuffins-redux]] successfully rebased/linked onto the template
- `cruft update` works on a stale consumer without merge catastrophe

## links

- cruft docs: https://cruft.github.io/cruft/
- mui v7 migration notes: https://mui.com/material-ui/migration/upgrade-to-v7/
- @supabase/ssr: https://supabase.com/docs/guides/auth/server-side/nextjs
- t3-env: https://env.t3.gg/
