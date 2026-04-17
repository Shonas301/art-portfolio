# animation state reducer

v2 flipbook uses a single reducer (`useReducer`) as the source of truth for all animation + navigation state. keyboard, touch, wheel, tab clicks, and a11y preferences all dispatch into the same action union. components subscribe via `useFlipBook()` (throws if outside provider).

file: `src/app/v2/context/FlipBookContext.tsx`.

## state shape

```ts
interface FlipBookState {
  currentPageIndex: number            // 0..46, physical page
  isFlipping: boolean                 // keyboard/tab nav active
  isRiffling: boolean                 // multi-page riffle active
  targetPageIndex: number | null      // destination during animation
  viewMode: 'grid' | 'carousel'
  resumeOpen: boolean
  prefersReducedMotion: boolean       // a11y, detected + toggleable
  debugMode: boolean
  scrollAccumulator: number           // -100..100, touch drag
  scrollVelocity: number
  isEngaged: boolean
  bendingPages: BendingPage[]         // currently bending
  releasedPages: ReleasedPage[]       // flying to destination
  isBookFlipped: boolean              // admin back-side
  isBookFlipping: boolean
  adminAuthenticated: boolean
  boundaryHit: 'start' | 'end' | null
}
```

(`FlipBookContext.tsx:6`)

## action discipline

- all cases guard against invalid states at the top and `return state` unchanged. example guards: same-page flip, flip-during-flip, out-of-bounds. see `FlipBookContext.tsx` cases.
- reduced motion: `FLIP_TO_PAGE` jumps instantly (skips animation fields). `FlippingPage.tsx:18` returns `null` and dispatches `FLIP_COMPLETE` after 50ms.
- debug logs inside the reducer are gated on `state.debugMode`.

## why one reducer

- **mid-flight inputs compose** — a keyboard arrow during an animation dispatches `SKIP_TO_TARGET`, which cuts the animation and commits the destination. with local component state this would race.
- **touch physics derive new state** — `TOUCH_INPUT` computes `bendingPages[]` from `scrollAccumulator`. with scattered state, bending and currentPage would desync.
- **release → land lifecycle is explicit** — `TOUCH_END` moves bending pages into `releasedPages` with staggered `releaseTime`. `PAGE_LANDED` removes them on animation complete. you can see every released page's lifecycle in one place.
- **boundary feedback is a state field** — `BOUNDARY_HIT` sets `boundaryHit: 'start'|'end'`. `BoundaryFeedback.tsx` reads it; `CLEAR_BOUNDARY` clears it after a timeout.

## provider mount side-effects

`FlipBookContext.tsx:335` reads `prefers-reduced-motion` media query on mount and sets `prefersReducedMotion` if matched. components don't re-read the query — they read the reducer.

## boundary: refs escape reducer for perf

`FurlingPage.tsx:34` writes transforms directly to DOM refs via `requestAnimationFrame`, bypassing react reconciliation. the reducer doesn't track per-segment transforms — only start/complete. this is the escape hatch: the reducer owns lifecycle (isFlipping, targetPageIndex), refs own the hot loop.

## applying this pattern

when adding animation state:

1. if two inputs can race (e.g. keyboard during touch), they belong in the same reducer.
2. derive visual state from reducer state — don't duplicate in local `useState`.
3. guard invalid transitions at the top of each case. never throw from a reducer.
4. if an animation loop needs 60fps mutations, use refs + `requestAnimationFrame`. dispatch only lifecycle events (start / complete / cancel).
5. expose one hook (`useFlipBook`) that throws outside its provider.

## source

`.thinking/codebase/architecture.md` (§ state management, § v2 animation systems).
