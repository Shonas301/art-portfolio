# mui joy imports

always import joy components from individual paths. **never barrel-import**.

## do

```ts
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
```

## don't

```ts
// not used anywhere in this codebase
import { Box, Typography, Button } from '@mui/joy'
```

## why

- tree-shaking on `@mui/joy` is unreliable at the barrel level. individual paths ship only the component you use.
- the codebase is consistent — ~44 files follow this pattern. mixing styles makes imports drift.

## import order (within a file)

1. `'use client'` (if needed, line 1, blank line below)
2. react (`useState`, `useEffect`, type-only `ReactNode`)
3. next.js (`next/navigation`, `next/image`, `next/link`, `next/server`)
4. **mui joy — individual paths**
5. `@mui/icons-material/<Icon>`
6. third-party (`framer-motion`, `swr`, `next-auth`, `@supabase/...`)
7. local via `@/` alias
8. local relative (`./`, `../`) — within the same feature area
9. `import type` — bottom of its group or mixed with value imports

example: `src/app/v2/components/BinderTabs.tsx:3-7`.

## styling

- `sx` prop is the only styling primitive. no `styled()`, no `css()`, no css modules, no styled-components.
- global css: `src/styles/globals.css` (body reset, 5 lines).
- theme at `src/lib/theme.ts` — `extendTheme`, light mode only via `CssVarsProvider` in `src/components/ThemeProvider.tsx`.
- known tech debt: components use hardcoded hex colors (`#9333ea`, `#ec4899`, etc.) instead of palette tokens. see `.thinking/codebase/concerns.md`.

## source

`.thinking/codebase/conventions.md` (§ import order, § mui joy usage).
