# tinamation

## what this is

3d artist portfolio for christina shi built with next.js 15, mui joy, and typescript. features two presentation modes: traditional gallery (v1) and interactive 3d flipbook (v2). v2 is the primary product — `/` redirects to `/v2`.

## architecture

dual version structure:
- v1 (`src/app/v1/*`): traditional gallery layout with standard routing
- v2 (`src/app/v2/*`): interactive flipbook with physics-based page turning animations

v2 flipbook core: `FlipBookContext` reducer (single source of truth), 47-page physical model with 7 sections at fixed indices, css 3d transforms, framer-motion transitions, refs-based per-segment animation.

all rendering is client-side. data loads from supabase at mount with a static typescript fallback baked into the bundle.

crystallized patterns:
- [v2 physical page model](architecture/v2-page-model.md) — 47 pages, 7 sections at fixed physical-page indices

## active decisions

[none yet — decisions emerge from thinking]

## patterns

- [fallback data loading](patterns/fallback-data-loading.md) — supabase + static typescript fallback, site works offline from db
- [animation state reducer](patterns/animation-state-reducer.md) — single reducer drives all v2 navigation + animation state
- [mui joy imports](patterns/mui-joy-imports.md) — individual paths only, never barrel imports
- [api route testing](patterns/api-route-testing.md) — top-level `await import()` + `_test`-prefixed reset exports

## research

[none yet — research findings are promoted from .thinking/research/]

---

*context established: 2026-03-08*
*last updated: 2026-04-16*
