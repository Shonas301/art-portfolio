'use client'

import { useCallback, useEffect } from 'react'
import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'
import { FurlingPage } from './FurlingPage'
import { FurlingRiffle } from './FurlingRiffle'

export function FlippingPage() {
  const { state, dispatch } = useFlipBook()

  const handleComplete = useCallback(() => {
    dispatch({ type: 'FLIP_COMPLETE' })
  }, [dispatch])

  // handle reduced motion preference - complete flip instantly via effect
  useEffect(() => {
    if (state.prefersReducedMotion && state.isFlipping && state.targetPageIndex !== null) {
      const timer = setTimeout(() => {
        dispatch({ type: 'FLIP_COMPLETE' })
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [state.prefersReducedMotion, state.isFlipping, state.targetPageIndex, dispatch])

  if (!state.isFlipping || state.targetPageIndex === null) {
    return null
  }

  // reduced motion users get instant transition (handled by effect above)
  if (state.prefersReducedMotion) {
    return null
  }

  const current = state.currentPageIndex
  const target = state.targetPageIndex
  const pageCount = Math.abs(target - current)
  const direction = target > current ? 'forward' : 'backward'

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
