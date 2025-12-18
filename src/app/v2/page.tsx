'use client'

import { useEffect } from 'react'
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
import { pageContent } from './data/portfolio-content'

function FlipBookContent() {
  const { state, dispatch } = useFlipBook()

  // keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // debug mode toggle: Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_DEBUG_MODE' })
        return
      }

      // reduced motion toggle: Ctrl+Shift+M
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_REDUCED_MOTION' })
        return
      }

      // prevent navigation during flip
      if (state.isFlipping) return

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          if (state.currentPageIndex < pageContent.length - 1) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: state.currentPageIndex + 1 })
          }
          break

        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          if (state.currentPageIndex > 0) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: state.currentPageIndex - 1 })
          }
          break

        case 'Home':
          e.preventDefault()
          if (state.currentPageIndex !== 0) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: 0 })
          }
          break

        case 'End':
          e.preventDefault()
          if (state.currentPageIndex !== pageContent.length - 1) {
            dispatch({ type: 'FLIP_TO_PAGE', payload: pageContent.length - 1 })
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.currentPageIndex, state.isFlipping, dispatch])

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
      <BinderTabs />
      <MobileNav />
      <ResumeModal />
      <DebugOverlay />

      {/* flip book container */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '2.5%', md: '7.5%' },
          left: { xs: '2.5%', md: '7.5%' },
          width: { xs: '95%', md: '85%' },
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
          <FlippingPage />
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
