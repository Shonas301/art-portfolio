import { useEffect, useRef, type RefObject } from 'react'
import { useFlipBook } from '../context/FlipBookContext'

// minimum horizontal distance to consider a swipe for page navigation
const HORIZONTAL_SWIPE_THRESHOLD = 30

export function useTouchInput(containerRef: RefObject<HTMLElement | null>) {
  const { dispatch, state } = useFlipBook()
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchStartTime = useRef<number>(0)
  const lastTouchX = useRef<number | null>(null)
  const lastTouchY = useRef<number | null>(null)
  const lastTouchTime = useRef<number>(0)
  const isHorizontalSwipe = useRef<boolean | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // check if touch started on scrollable content
    const isOnScrollableContent = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false

      let element: Element | null = target
      while (element && element !== container) {
        const style = window.getComputedStyle(element)
        const overflowY = style.overflowY
        const overflowX = style.overflowX

        // check if element has scrollable overflow
        if (overflowY === 'auto' || overflowY === 'scroll') {
          const el = element as HTMLElement
          // check if content actually overflows
          if (el.scrollHeight > el.clientHeight) {
            return true
          }
        }
        if (overflowX === 'auto' || overflowX === 'scroll') {
          const el = element as HTMLElement
          if (el.scrollWidth > el.clientWidth) {
            return true
          }
        }

        element = element.parentElement
      }
      return false
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return

      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      touchStartTime.current = performance.now()
      lastTouchX.current = e.touches[0].clientX
      lastTouchY.current = e.touches[0].clientY
      lastTouchTime.current = performance.now()
      isHorizontalSwipe.current = null // reset direction detection
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || touchStartX.current === null || touchStartY.current === null) return

      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const now = performance.now()

      const deltaX = touchStartX.current - currentX
      const deltaY = touchStartY.current - currentY

      // determine swipe direction on first significant movement
      if (isHorizontalSwipe.current === null) {
        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)

        // need minimum movement to determine direction
        if (Math.max(absDeltaX, absDeltaY) > 10) {
          // check if touch is on scrollable content - if so, prefer vertical scroll
          if (isOnScrollableContent(e.target)) {
            // on scrollable content, only treat as horizontal if clearly horizontal
            isHorizontalSwipe.current = absDeltaX > absDeltaY * 2
          } else {
            // not on scrollable content, use standard detection
            isHorizontalSwipe.current = absDeltaX > absDeltaY
          }
        }
      }

      // if vertical scroll (or not determined yet), don't intercept
      if (isHorizontalSwipe.current !== true) {
        return
      }

      // horizontal swipe for page navigation - prevent default scrolling
      e.preventDefault()

      if (state.prefersReducedMotion) {
        return
      }

      const moveDeltaX = lastTouchX.current !== null ? lastTouchX.current - currentX : 0
      const timeDelta = now - lastTouchTime.current
      const velocity = moveDeltaX / Math.max(timeDelta, 16)

      lastTouchX.current = currentX
      lastTouchY.current = currentY
      lastTouchTime.current = now

      // convert horizontal swipe to the same action as vertical
      // (positive delta = swipe left = forward page)
      dispatch({
        type: 'TOUCH_INPUT',
        delta: moveDeltaX * 0.5, // reduce sensitivity for horizontal
        velocity: velocity,
      })
    }

    const handleTouchEnd = () => {
      if (touchStartX.current === null) {
        return
      }

      // only dispatch if this was a horizontal swipe
      if (isHorizontalSwipe.current === true) {
        if (state.prefersReducedMotion && lastTouchX.current !== null) {
          const totalDeltaX = touchStartX.current - lastTouchX.current
          if (Math.abs(totalDeltaX) > HORIZONTAL_SWIPE_THRESHOLD) {
            const direction = totalDeltaX > 0 ? 1 : -1
            const newPage = Math.max(
              0,
              Math.min(49, state.currentPageIndex + direction)
            )
            dispatch({ type: 'FLIP_TO_PAGE', payload: newPage })
          }
        } else {
          dispatch({ type: 'TOUCH_END' })
        }
      }

      touchStartX.current = null
      touchStartY.current = null
      lastTouchX.current = null
      lastTouchY.current = null
      isHorizontalSwipe.current = null
    }

    // add mouse wheel support for desktop
    const handleWheel = (e: WheelEvent) => {
      // check if wheel is on scrollable content
      if (isOnScrollableContent(e.target)) {
        // check if the scrollable element can actually scroll in this direction
        const target = e.target as Element
        let scrollable: HTMLElement | null = null

        let element: Element | null = target
        while (element && element !== container) {
          const style = window.getComputedStyle(element)
          if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
            const el = element as HTMLElement
            if (el.scrollHeight > el.clientHeight) {
              scrollable = el
              break
            }
          }
          element = element.parentElement
        }

        if (scrollable) {
          const canScrollDown = scrollable.scrollTop < scrollable.scrollHeight - scrollable.clientHeight
          const canScrollUp = scrollable.scrollTop > 0

          // if scrollable can scroll in the wheel direction, let it handle
          if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
            return // let native scroll handle it
          }
        }
      }

      // page navigation via wheel when not scrolling content
      // use horizontal scroll primarily for page turns
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

      if (Math.abs(delta) < 10) return // ignore tiny movements

      e.preventDefault()

      if (state.isFlipping || state.isEngaged) return

      // navigate pages based on scroll direction
      const direction = delta > 0 ? 1 : -1
      const newPage = Math.max(0, Math.min(49, state.currentPageIndex + direction))

      if (newPage !== state.currentPageIndex) {
        dispatch({ type: 'FLIP_TO_PAGE', payload: newPage })
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchEnd)
      container.removeEventListener('wheel', handleWheel)
    }
  }, [containerRef, dispatch, state.prefersReducedMotion, state.currentPageIndex, state.isFlipping, state.isEngaged])
}
