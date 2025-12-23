'use client'

import { useEffect, useRef, useCallback } from 'react'
import Box from '@mui/joy/Box'
import { FlipBookProvider, useFlipBook } from './context/FlipBookContext'
import { CloudBackground } from './components/CloudBackground'
import { BinderTabs } from './components/BinderTabs'
import { MobileNav } from './components/MobileNav'
import { PageStack } from './components/PageStack'
import { FlippingPage } from './components/FlippingPage'
import { FlippedPagesStack } from './components/FlippedPagesStack'
import { ResumeModal } from './components/ResumeModal'
import { DebugOverlay } from './components/DebugOverlay'
import { BendingPages } from './components/BendingPages'
import { CascadingRelease } from './components/CascadingRelease'
import { useTouchInput } from './hooks/useTouchInput'
import { TOTAL_PAGES, sectionMappings } from './data/portfolio-content'

function getAdjacentSection(currentPage: number, direction: 'next' | 'prev'): number | null {
  const sortedSections = [...sectionMappings].sort((a, b) => a.physicalPage - b.physicalPage)

  if (direction === 'next') {
    const next = sortedSections.find(s => s.physicalPage > currentPage)
    return next?.physicalPage ?? null
  } else {
    const prev = [...sortedSections].reverse().find(s => s.physicalPage < currentPage)
    return prev?.physicalPage ?? null
  }
}

function FlipBookContent() {
  const { state, dispatch } = useFlipBook()
  const containerRef = useRef<HTMLDivElement>(null)

  useTouchInput(containerRef)

  const handlePageLanded = useCallback(
    (pageIndex: number) => {
      dispatch({ type: 'PAGE_LANDED', pageIndex })
    },
    [dispatch]
  )

  const direction = state.scrollAccumulator >= 0 ? 'forward' : 'backward'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_DEBUG_MODE' })
        return
      }

      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_REDUCED_MOTION' })
        return
      }

      if (state.isFlipping || state.isEngaged) return

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          if (state.currentPageIndex < TOTAL_PAGES - 1) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: state.currentPageIndex + 1 })
          }
          break

        case 'ArrowLeft':
          e.preventDefault()
          if (state.currentPageIndex > 0) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: state.currentPageIndex - 1 })
          }
          break

        case 'PageDown': {
          e.preventDefault()
          const nextSection = getAdjacentSection(state.currentPageIndex, 'next')
          if (nextSection !== null) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: nextSection })
          }
          break
        }

        case 'PageUp': {
          e.preventDefault()
          const prevSection = getAdjacentSection(state.currentPageIndex, 'prev')
          if (prevSection !== null) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: prevSection })
          }
          break
        }

        case 'Home':
          e.preventDefault()
          if (state.currentPageIndex !== 0) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: 0 })
          }
          break

        case 'End':
          e.preventDefault()
          if (state.currentPageIndex !== TOTAL_PAGES - 1) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: TOTAL_PAGES - 1 })
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.currentPageIndex, state.isFlipping, state.isEngaged, dispatch])

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CloudBackground />
      <MobileNav />
      <ResumeModal />
      <DebugOverlay />

      {/* flip book container */}
      <Box
        ref={containerRef}
        sx={{
          position: 'absolute',
          top: { xs: '2.5%', md: '7.5%' },
          left: { xs: '2.5%', md: '7.5%' },
          width: { xs: '95%', md: '70%' },
          height: { xs: '95%', md: '85%' },
          perspective: '1200px',
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <FlippedPagesStack />
          <PageStack />

          {state.bendingPages.length > 0 && !state.prefersReducedMotion && (
            <BendingPages bendingPages={state.bendingPages} direction={direction} />
          )}

          {state.releasedPages.length > 0 && !state.prefersReducedMotion && (
            <CascadingRelease
              releasedPages={state.releasedPages}
              onPageLanded={handlePageLanded}
            />
          )}

          {/* for keyboard/tab navigation */}
          <FlippingPage />

          <BinderTabs />
        </Box>
      </Box>
    </Box>
  )
}

export default function V2Page() {
  return (
    <FlipBookProvider>
      <FlipBookContent />
    </FlipBookProvider>
  )
}
