'use client'

import { useEffect, useRef, useCallback } from 'react'
import Box from '@mui/joy/Box'
import { motion } from 'framer-motion'
import { FlipBookProvider, useFlipBook } from './context/FlipBookContext'
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext'
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
import { BookBack } from './components/BookBack'
import { useTouchInput } from './hooks/useTouchInput'
import { TOTAL_PAGES, sectionMappings, getSectionAtPage } from './data/portfolio-content'

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

// get section id from URL hash
function getSectionFromHash(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.slice(1) // remove #
  if (!hash) return null
  // validate it's a known section
  const section = sectionMappings.find(s => s.id === hash)
  return section ? hash : null
}

// update URL hash without triggering navigation
function updateUrlHash(sectionId: string | null) {
  if (typeof window === 'undefined') return
  const newHash = sectionId ? `#${sectionId}` : ''
  const newUrl = window.location.pathname + newHash
  window.history.replaceState(null, '', newUrl)
}

function FlipBookContent() {
  const { state, dispatch } = useFlipBook()
  const containerRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  useTouchInput(containerRef)

  const handlePageLanded = useCallback(
    (pageIndex: number) => {
      dispatch({ type: 'PAGE_LANDED', pageIndex })
    },
    [dispatch]
  )

  const direction = state.scrollAccumulator >= 0 ? 'forward' : 'backward'

  // on mount, check URL hash and flip to that section or open resume/admin
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''

    // special case: resume hash opens the resume modal
    if (hash === 'resume') {
      setTimeout(() => {
        dispatch({ type: 'OPEN_RESUME' })
      }, 100)
      return
    }

    // special case: admin hash flips the book over
    if (hash === 'admin') {
      // check for existing session
      const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true'
      if (isAuthenticated) {
        dispatch({ type: 'ADMIN_LOGIN' })
      }
      setTimeout(() => {
        dispatch({ type: 'FLIP_BOOK_OVER' })
      }, 100)
      return
    }

    const sectionId = getSectionFromHash()
    if (sectionId) {
      const section = sectionMappings.find(s => s.id === sectionId)
      if (section && section.physicalPage !== state.currentPageIndex) {
        // use a small delay to ensure the component is fully mounted
        setTimeout(() => {
          dispatch({ type: 'FLIP_TO_PAGE', payload: section.physicalPage })
        }, 100)
      }
    }
  }, [dispatch, state.currentPageIndex])

  // update URL hash when page changes (after initial load)
  useEffect(() => {
    // find the current section (if any) for the current page
    const currentSection = getSectionAtPage(state.currentPageIndex)
    if (currentSection) {
      updateUrlHash(currentSection.id)
    } else {
      // on a blank page, find the nearest previous section
      const nearestSection = [...sectionMappings]
        .filter(s => s.physicalPage <= state.currentPageIndex)
        .sort((a, b) => b.physicalPage - a.physicalPage)[0]
      if (nearestSection) {
        updateUrlHash(nearestSection.id)
      }
    }
  }, [state.currentPageIndex])

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

      // secret admin shortcut: Ctrl+Shift+A
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        if (state.isBookFlipped) {
          dispatch({ type: 'FLIP_BOOK_BACK' })
          updateUrlHash(null)
        } else {
          dispatch({ type: 'FLIP_BOOK_OVER' })
          window.history.replaceState(null, '', window.location.pathname + '#admin')
        }
        return
      }

      // don't handle navigation while book is flipped or flipping
      if (state.isBookFlipped || state.isBookFlipping) return

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
  }, [state.currentPageIndex, state.isFlipping, state.isEngaged, state.isBookFlipped, state.isBookFlipping, dispatch])

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
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateY: state.isBookFlipped ? 180 : 0,
          }}
          transition={{
            duration: state.prefersReducedMotion ? 0 : 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationComplete={() => {
            if (state.isBookFlipping) {
              dispatch({ type: 'BOOK_FLIP_COMPLETE' })
            }
          }}
        >
          {/* front of book */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
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

          {/* back of book - admin panel */}
          <BookBack />
        </motion.div>
      </Box>
    </Box>
  )
}

function FlipBookWithAnalytics() {
  const { state } = useFlipBook()
  const { trackPageView } = useAnalytics()

  // track page views when current page changes
  useEffect(() => {
    const currentSection = getSectionAtPage(state.currentPageIndex)
    if (currentSection) {
      trackPageView(currentSection.id)
    }
  }, [state.currentPageIndex, trackPageView])

  return <FlipBookContent />
}

export default function V2Page() {
  return (
    <AnalyticsProvider>
      <FlipBookProvider>
        <FlipBookWithAnalytics />
      </FlipBookProvider>
    </AnalyticsProvider>
  )
}
