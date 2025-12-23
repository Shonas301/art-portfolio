'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'
import { RiffleAnimation } from './RiffleAnimation'

export function FlippingPage() {
  const { state, dispatch } = useFlipBook()

  const handleRiffleComplete = useCallback(() => {
    dispatch({ type: 'FLIP_COMPLETE' })
  }, [dispatch])

  if (!state.isFlipping || state.targetPageIndex === null) {
    return null
  }

  const current = state.currentPageIndex
  const target = state.targetPageIndex
  const pageCount = Math.abs(target - current)
  const direction = target > current ? 'forward' : 'backward'

  if (pageCount === 1) {
    const rotationEnd = direction === 'forward' ? -180 : 180

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
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: rotationEnd }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 30,
          }}
          onAnimationComplete={() => dispatch({ type: 'FLIP_COMPLETE' })}
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#faf8f3',
              backgroundImage: `
                linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              boxShadow: '-5px 0 20px rgba(0,0,0,0.4)',
              borderRadius: '8px',
            }}
          />
        </motion.div>
      </Box>
    )
  }

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
      <RiffleAnimation
        pageCount={pageCount}
        direction={direction}
        onComplete={handleRiffleComplete}
      />
    </Box>
  )
}
