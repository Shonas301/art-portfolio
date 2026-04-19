---
type: bug
status: fixed
created: 2026-04-16
stream: tinamation
tags:
  - page
  - flashing-origin-page
  - origin-page-reproduction
  - page-reproduction
  - flashing-origin
  - flip
  - animation
  - end
---






#page #flashing-origin-page #origin-page-reproduction #page-reproduction #flashing-origin #flip #animation #end


# page flip animation hangs at end, flashing origin page

## reproduction
1. open /v2 (lands on home page)
2. click any binder tab (e.g. "3d work") or scroll to trigger a page flip
3. observe the animation — at the very end, there's a split-second hang showing the starting page before completing

## observed
animation plays, then briefly freezes on the origin page at the tail end before snapping to the destination. breaks the book-turning illusion.

## expected
smooth continuous flip from origin to destination with no hang or flash-back at the end.

## screenshots
- before: tina-bug-before.png (home page)
- after flip: tina-bug-after-flip.png (3d work page — arrived correctly, but animation had a hang)
