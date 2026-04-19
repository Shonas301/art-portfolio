---
type: bug
status: fixed
created: 2026-04-09
stream: tinamation
tags:
  - navigation-reproduction
  - drift-after-navigation
  - binder-tabs-drift
  - tabs
  - binder-tabs
  - page
  - depthinstack
  - tabs-drift
---










#navigation-reproduction #drift-after-navigation #binder-tabs-drift #tabs #binder-tabs #page #depthinstack #tabs-drift


# binder tabs drift after navigation

## reproduction
1. load /v2 (desktop viewport)
2. click several binder tabs (e.g. 3d work → code → pandy)
3. click home tab to return to page 0
4. binder tabs on the right side have shifted — spacing/offsets have changed

## observed
- tabs spread out with different vertical offsets compared to initial load
- the positioning appears tied to the page stack depth — tabs follow the "book edge" position
- after navigating deep and returning to page 0, the depth-based positioning doesn't fully reset

## screenshots
- initial: /tmp/tina-bug-tabs-initial.png
- after nav: /tmp/tina-bug-tabs-floated.png

## suspected area
- src/app/v2/components/BinderTabs.tsx — tab positioning uses depth-based logic that follows the page stack

## root cause

`pageEdgeOffset = depthInStack * 1.5` (max 40px) combined with `tabWidth = 100 - depthInStack * 0.8`
created a non-linear staircase: narrower tabs translated less in absolute px despite having larger
offsets, making the spread look jagged/random rather than a smooth depth cue.

## fix

reduced max offset to 8px (`depthInStack * 1.5` capped at 8px instead of 40px).
removed width shrinking — tabs now uniform 100px.

commit: `1d20c60`

## status: fixed
