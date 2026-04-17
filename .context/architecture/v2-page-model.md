# v2 physical page model

v2 flipbook simulates a 47-page physical book. 7 content sections sit at fixed physical-page indices. pages between sections render blank (just a page number).

## invariants

```
TOTAL_PAGES = 47
```

| section | physical page |
|---------|---------------|
| landing      | 0  |
| intro        | 7  |
| 3d-work      | 14 |
| 2d-work      | 22 |
| code         | 30 |
| pandy-series | 38 |
| contact      | 46 |

defined in `src/app/v2/data/portfolio-content.ts:4,27`.

## why it matters

- **physical page index is the source of truth** for navigation. `currentPageIndex` (0..46) lives on the reducer, not section id.
- section id → physical page via `getPhysicalPageForSection(id)`.
- physical page → section (or null for blank) via `getSectionAtPage(n)`.
- `getLastContentPage()` returns 46 — `End` key and boundary checks use this.
- blank pages are intentional — flipping through them is part of the book metaphor.

helpers: `portfolio-content.ts:38-50`.

## don't

- don't index content by section id directly — the physical page model breaks.
- don't add a section without picking a physical page and updating `sectionMappings`. a new section between existing ones shifts `TOTAL_PAGES` and the ascii layout below.
- don't assume contiguous pages. blank-page rendering is at `src/app/v2/components/PageStack.tsx:45` (returns just a page number).

## layout

```
page:   0  ·  ·  ·  ·  ·  ·  7  ·  ·  ·  ·  ·  ·  14 ·  ·  ·  ·  ·  ·  ·  22 ·  ·  ·  ·  ·  ·  ·  30 ·  ·  ·  ·  ·  ·  ·  38 ·  ·  ·  ·  ·  ·  ·  46
sect:   L              I              3D                     2D                     C                      P                      X
```

## renderer path

`PageStack.tsx:40`:
physical page → `getSectionAtPage(n)` → `sectionToContentIndex[id]` → `content[contentIndex]` → switch on `pageData.type` → return `null` if no section.

## source

`.thinking/codebase/architecture.md` (§ v2 flipbook physical page model).
