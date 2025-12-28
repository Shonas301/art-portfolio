'use client'

import { useCallback } from 'react'
import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'
import { FurlingPage } from './FurlingPage'
import { FurlingRiffle } from './FurlingRiffle'

export function FlippingPage() {
  const { state, dispatch } = useFlipBook()

  const handleComplete = useCallback(() => {
    dispatch({ type: 'FLIP_COMPLETE' })
  }, [dispatch])

  if (!state.isFlipping || state.targetPageIndex === null) {
    return null
  }

  const current = state.currentPageIndex
  const target = state.targetPageIndex
  const pageCount = Math.abs(target - current)
  const direction = target > current ? 'forward' : 'backward'

  // use reduced motion fallback if enabled
  if (state.prefersReducedMotion) {
    // instant transition for reduced motion
    setTimeout(() => dispatch({ type: 'FLIP_COMPLETE' }), 50)
    return null
  }

  // single page flip uses furling animation
  if (pageCount === 1) {
    return (
      <FurlingPage
        direction={direction}
        onComplete={handleComplete}
      />
    )
  }

  // multi-page flip uses furling riffle
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        perspective: '1200px',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <FurlingRiffle
        pageCount={pageCount}
        direction={direction}
        onComplete={handleComplete}
      />
    </Box>
  )
}
