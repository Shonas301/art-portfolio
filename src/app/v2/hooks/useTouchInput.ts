import { useEffect, useRef, type RefObject } from 'react'
import { useFlipBook } from '../context/FlipBookContext'

export function useTouchInput(containerRef: RefObject<HTMLElement | null>) {
  const { dispatch, state } = useFlipBook()
  const touchStartY = useRef<number | null>(null)
  const touchStartTime = useRef<number>(0)
  const lastTouchY = useRef<number | null>(null)
  const lastTouchTime = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return

      touchStartY.current = e.touches[0].clientY
      touchStartTime.current = performance.now()
      lastTouchY.current = e.touches[0].clientY
      lastTouchTime.current = performance.now()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || touchStartY.current === null) return

      e.preventDefault()

      if (state.prefersReducedMotion) {
        return
      }

      const currentY = e.touches[0].clientY
      const now = performance.now()

      const delta = lastTouchY.current !== null ? lastTouchY.current - currentY : 0
      const timeDelta = now - lastTouchTime.current
      const velocity = delta / Math.max(timeDelta, 16)

      lastTouchY.current = currentY
      lastTouchTime.current = now

      dispatch({
        type: 'TOUCH_INPUT',
        delta: delta,
        velocity: velocity,
      })
    }

    const handleTouchEnd = () => {
      if (state.prefersReducedMotion && touchStartY.current !== null && lastTouchY.current !== null) {
        const totalDelta = touchStartY.current - lastTouchY.current
        if (Math.abs(totalDelta) > 50) {
          const direction = totalDelta > 0 ? 1 : -1
          const newPage = Math.max(
            0,
            Math.min(49, state.currentPageIndex + direction)
          )
          dispatch({ type: 'FLIP_TO_PAGE', payload: newPage })
        }
        touchStartY.current = null
        lastTouchY.current = null
        return
      }

      if (touchStartY.current !== null) {
        dispatch({ type: 'TOUCH_END' })
      }

      touchStartY.current = null
      lastTouchY.current = null
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [containerRef, dispatch, state.prefersReducedMotion, state.currentPageIndex])
}
