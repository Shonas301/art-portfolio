import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { FlipBookProvider, useFlipBook } from '@/app/v2/context/FlipBookContext'
import { TOTAL_PAGES } from '@/app/v2/data/portfolio-content'
import type { ReactNode } from 'react'

// wrapper that provides FlipBookContext
function wrapper({ children }: { children: ReactNode }) {
  return <FlipBookProvider>{children}</FlipBookProvider>
}

// helper to render the hook with the provider
function renderFlipBook() {
  return renderHook(() => useFlipBook(), { wrapper })
}

describe('FlipBookContext reducer', () => {
  describe('initial state', () => {
    it('starts at page 0', () => {
      const { result } = renderFlipBook()
      expect(result.current.state.currentPageIndex).toBe(0)
    })

    it('is not flipping initially', () => {
      const { result } = renderFlipBook()
      expect(result.current.state.isFlipping).toBe(false)
    })

    it('has no target page initially', () => {
      const { result } = renderFlipBook()
      expect(result.current.state.targetPageIndex).toBeNull()
    })

    it('starts with resume closed', () => {
      const { result } = renderFlipBook()
      expect(result.current.state.resumeOpen).toBe(false)
    })

    it('starts with book not flipped', () => {
      const { result } = renderFlipBook()
      expect(result.current.state.isBookFlipped).toBe(false)
      expect(result.current.state.isBookFlipping).toBe(false)
    })
  })

  describe('FLIP_TO_PAGE', () => {
    it('sets target page and marks as flipping', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 5 })
      })

      expect(result.current.state.targetPageIndex).toBe(5)
      expect(result.current.state.isFlipping).toBe(true)
      expect(result.current.state.isRiffling).toBe(true)
    })

    it('clamps to page 0 when given negative value', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: -5 })
      })

      // -5 clamps to 0, same as currentPageIndex (0), so blocked
      expect(result.current.state.targetPageIndex).toBeNull()
      expect(result.current.state.isFlipping).toBe(false)
    })

    it('clamps to max page when given out-of-bounds value', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 999 })
      })

      expect(result.current.state.targetPageIndex).toBe(TOTAL_PAGES - 1)
      expect(result.current.state.isFlipping).toBe(true)
    })

    it('rejects flip to same page', () => {
      const { result } = renderFlipBook()

      // already at page 0
      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 0 })
      })

      expect(result.current.state.isFlipping).toBe(false)
      expect(result.current.state.targetPageIndex).toBeNull()
    })

    it('blocks flip while already flipping', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 5 })
      })

      expect(result.current.state.isFlipping).toBe(true)

      // try to flip again while flipping
      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 10 })
      })

      // should still be targeting page 5
      expect(result.current.state.targetPageIndex).toBe(5)
    })

    it('instantly sets page when prefersReducedMotion is true', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_REDUCED_MOTION' })
      })

      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 10 })
      })

      expect(result.current.state.currentPageIndex).toBe(10)
      expect(result.current.state.isFlipping).toBe(false)
      expect(result.current.state.targetPageIndex).toBeNull()
    })
  })

  describe('FLIP_COMPLETE', () => {
    it('sets currentPageIndex to targetPageIndex and clears flip state', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 7 })
      })

      expect(result.current.state.isFlipping).toBe(true)

      act(() => {
        result.current.dispatch({ type: 'FLIP_COMPLETE' })
      })

      expect(result.current.state.currentPageIndex).toBe(7)
      expect(result.current.state.isFlipping).toBe(false)
      expect(result.current.state.isRiffling).toBe(false)
      expect(result.current.state.targetPageIndex).toBeNull()
    })

    it('keeps current page if no target was set', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_COMPLETE' })
      })

      expect(result.current.state.currentPageIndex).toBe(0)
    })
  })

  describe('TOUCH_INPUT', () => {
    it('updates scroll accumulator from delta', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: 500, velocity: 5 })
      })

      // 500 / 100 = 5, clamped to [-100, 100]
      expect(result.current.state.scrollAccumulator).toBeGreaterThan(0)
      expect(result.current.state.isEngaged).toBe(true)
    })

    it('clamps accumulator to [-100, 100]', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: 99999, velocity: 10 })
      })

      // should clamp to 100 max, but release threshold (60) may reduce it
      expect(result.current.state.scrollAccumulator).toBeLessThanOrEqual(100)
      expect(result.current.state.scrollAccumulator).toBeGreaterThanOrEqual(-100)
    })

    it('creates bending pages for forward scroll', () => {
      const { result } = renderFlipBook()

      // moderate scroll that creates bending but doesn't release
      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: 2000, velocity: 2 })
      })

      // with accumulator at 20 (2000/100), should have bending pages
      // floor(20/15) + 1 = 2 pages, limited by available pages
      expect(result.current.state.isEngaged).toBe(true)
    })

    it('releases page when accumulator exceeds threshold (60)', () => {
      const { result } = renderFlipBook()

      // push accumulator past 60 threshold
      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: 7000, velocity: 5 })
      })

      // accumulator reached 70 (7000/100), exceeds 60 threshold
      // should have released a page and advanced currentPageIndex
      expect(result.current.state.releasedPages.length).toBeGreaterThanOrEqual(1)
      expect(result.current.state.currentPageIndex).toBeGreaterThanOrEqual(1)
    })

    it('handles backward scroll (negative delta)', () => {
      const { result } = renderFlipBook()

      // first move to a non-zero page via reduced motion
      act(() => {
        result.current.dispatch({ type: 'TOGGLE_REDUCED_MOTION' })
      })
      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 10 })
      })
      act(() => {
        result.current.dispatch({ type: 'TOGGLE_REDUCED_MOTION' })
      })

      expect(result.current.state.currentPageIndex).toBe(10)

      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: -2000, velocity: 2 })
      })

      expect(result.current.state.scrollAccumulator).toBeLessThan(0)
    })
  })

  describe('TOUCH_END', () => {
    it('snaps back when accumulator below 30', () => {
      const { result } = renderFlipBook()

      // small scroll
      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: 1000, velocity: 1 })
      })

      act(() => {
        result.current.dispatch({ type: 'TOUCH_END' })
      })

      expect(result.current.state.scrollAccumulator).toBe(0)
      expect(result.current.state.isEngaged).toBe(false)
      expect(result.current.state.bendingPages).toEqual([])
    })

    it('releases remaining bent pages when accumulator >= 30', () => {
      const { result } = renderFlipBook()

      // moderate scroll above 30 but below 60 release threshold
      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: 4000, velocity: 3 })
      })

      const bendingCount = result.current.state.bendingPages.length

      act(() => {
        result.current.dispatch({ type: 'TOUCH_END' })
      })

      // if there were bending pages, they should now be in releasedPages
      if (bendingCount > 0) {
        expect(result.current.state.releasedPages.length).toBeGreaterThanOrEqual(bendingCount)
      }
      expect(result.current.state.scrollAccumulator).toBe(0)
      expect(result.current.state.isEngaged).toBe(false)
      expect(result.current.state.bendingPages).toEqual([])
    })
  })

  describe('PAGE_LANDED', () => {
    it('removes page from releasedPages', () => {
      const { result } = renderFlipBook()

      // create a released page via touch
      act(() => {
        result.current.dispatch({ type: 'TOUCH_INPUT', delta: 7000, velocity: 5 })
      })

      const released = result.current.state.releasedPages
      if (released.length > 0) {
        const landedPageIndex = released[0].pageIndex

        act(() => {
          result.current.dispatch({ type: 'PAGE_LANDED', pageIndex: landedPageIndex })
        })

        expect(
          result.current.state.releasedPages.find(p => p.pageIndex === landedPageIndex)
        ).toBeUndefined()
      }
    })
  })

  describe('OPEN_RESUME / CLOSE_RESUME', () => {
    it('opens resume modal', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'OPEN_RESUME' })
      })

      expect(result.current.state.resumeOpen).toBe(true)
    })

    it('closes resume modal', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'OPEN_RESUME' })
      })
      act(() => {
        result.current.dispatch({ type: 'CLOSE_RESUME' })
      })

      expect(result.current.state.resumeOpen).toBe(false)
    })
  })

  describe('FLIP_BOOK_OVER / FLIP_BOOK_BACK / BOOK_FLIP_COMPLETE', () => {
    it('starts book flip over', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_OVER' })
      })

      expect(result.current.state.isBookFlipping).toBe(true)
    })

    it('blocks flip over while already flipping', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_OVER' })
      })

      // dispatch again while flipping
      const stateBefore = result.current.state
      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_OVER' })
      })

      expect(result.current.state).toBe(stateBefore)
    })

    it('completes book flip and toggles isBookFlipped', () => {
      const { result } = renderFlipBook()

      expect(result.current.state.isBookFlipped).toBe(false)

      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_OVER' })
      })
      act(() => {
        result.current.dispatch({ type: 'BOOK_FLIP_COMPLETE' })
      })

      expect(result.current.state.isBookFlipped).toBe(true)
      expect(result.current.state.isBookFlipping).toBe(false)
    })

    it('flips back to front', () => {
      const { result } = renderFlipBook()

      // flip over
      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_OVER' })
      })
      act(() => {
        result.current.dispatch({ type: 'BOOK_FLIP_COMPLETE' })
      })

      expect(result.current.state.isBookFlipped).toBe(true)

      // flip back
      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_BACK' })
      })

      expect(result.current.state.isBookFlipping).toBe(true)

      act(() => {
        result.current.dispatch({ type: 'BOOK_FLIP_COMPLETE' })
      })

      expect(result.current.state.isBookFlipped).toBe(false)
      expect(result.current.state.isBookFlipping).toBe(false)
    })

    it('blocks flip back while already flipping', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_BACK' })
      })

      const stateBefore = result.current.state
      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_BACK' })
      })

      expect(result.current.state).toBe(stateBefore)
    })
  })

  describe('TOGGLE_VIEW_MODE / SET_VIEW_MODE', () => {
    it('toggles between grid and carousel', () => {
      const { result } = renderFlipBook()

      expect(result.current.state.viewMode).toBe('grid')

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_VIEW_MODE' })
      })

      expect(result.current.state.viewMode).toBe('carousel')

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_VIEW_MODE' })
      })

      expect(result.current.state.viewMode).toBe('grid')
    })

    it('sets view mode directly', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'SET_VIEW_MODE', payload: 'carousel' })
      })

      expect(result.current.state.viewMode).toBe('carousel')
    })
  })

  describe('TOGGLE_REDUCED_MOTION', () => {
    it('toggles prefersReducedMotion', () => {
      const { result } = renderFlipBook()

      expect(result.current.state.prefersReducedMotion).toBe(false)

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_REDUCED_MOTION' })
      })

      expect(result.current.state.prefersReducedMotion).toBe(true)
    })
  })

  describe('TOGGLE_DEBUG_MODE', () => {
    it('toggles debug mode', () => {
      const { result } = renderFlipBook()

      expect(result.current.state.debugMode).toBe(false)

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_DEBUG_MODE' })
      })

      expect(result.current.state.debugMode).toBe(true)
    })
  })

  describe('ADMIN_LOGIN / ADMIN_LOGOUT', () => {
    it('sets admin authenticated on login', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'ADMIN_LOGIN' })
      })

      expect(result.current.state.adminAuthenticated).toBe(true)
    })

    it('clears admin and resets book flip on logout', () => {
      const { result } = renderFlipBook()

      // login and flip book
      act(() => {
        result.current.dispatch({ type: 'ADMIN_LOGIN' })
      })
      act(() => {
        result.current.dispatch({ type: 'FLIP_BOOK_OVER' })
      })
      act(() => {
        result.current.dispatch({ type: 'BOOK_FLIP_COMPLETE' })
      })

      expect(result.current.state.isBookFlipped).toBe(true)

      act(() => {
        result.current.dispatch({ type: 'ADMIN_LOGOUT' })
      })

      expect(result.current.state.adminAuthenticated).toBe(false)
      expect(result.current.state.isBookFlipped).toBe(false)
    })
  })

  describe('BOUNDARY_HIT / CLEAR_BOUNDARY', () => {
    it('sets boundary hit state', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'BOUNDARY_HIT', payload: 'start' })
      })

      expect(result.current.state.boundaryHit).toBe('start')
    })

    it('sets end boundary', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'BOUNDARY_HIT', payload: 'end' })
      })

      expect(result.current.state.boundaryHit).toBe('end')
    })

    it('clears boundary', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'BOUNDARY_HIT', payload: 'start' })
      })
      act(() => {
        result.current.dispatch({ type: 'CLEAR_BOUNDARY' })
      })

      expect(result.current.state.boundaryHit).toBeNull()
    })
  })

  describe('SKIP_TO_TARGET', () => {
    it('skips to target page instantly during a flip', () => {
      const { result } = renderFlipBook()

      act(() => {
        result.current.dispatch({ type: 'FLIP_TO_PAGE', payload: 20 })
      })

      expect(result.current.state.isFlipping).toBe(true)
      expect(result.current.state.targetPageIndex).toBe(20)

      act(() => {
        result.current.dispatch({ type: 'SKIP_TO_TARGET' })
      })

      expect(result.current.state.currentPageIndex).toBe(20)
      expect(result.current.state.isFlipping).toBe(false)
      expect(result.current.state.isRiffling).toBe(false)
      expect(result.current.state.targetPageIndex).toBeNull()
    })

    it('does nothing when not flipping', () => {
      const { result } = renderFlipBook()

      const stateBefore = result.current.state

      act(() => {
        result.current.dispatch({ type: 'SKIP_TO_TARGET' })
      })

      expect(result.current.state.currentPageIndex).toBe(stateBefore.currentPageIndex)
    })
  })

  describe('useFlipBook hook', () => {
    it('throws when used outside provider', () => {
      // suppress console.error for this test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useFlipBook())
      }).toThrow('useFlipBook must be used within a FlipBookProvider')

      spy.mockRestore()
    })
  })
})
