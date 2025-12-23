'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'

const Z_LAYER_FLIPPED_STACK = 100

export function FlippedPagesStack() {
  const { state } = useFlipBook()

  const flippedPageCount = state.currentPageIndex

  if (flippedPageCount === 0) {
    return null
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
        zIndex: Z_LAYER_FLIPPED_STACK,
      }}
    >
      <AnimatePresence mode="popLayout">
        {Array.from({ length: Math.min(flippedPageCount, 30) }, (_, i) => {
          const pageIndex = flippedPageCount - 1 - i
          const stackPosition = flippedPageCount - pageIndex
          const isTopPage = stackPosition === 1
          const depthOffset = Math.min(stackPosition * 1.5, 40)

          return (
            <motion.div
              key={`flipped-${pageIndex}`}
              initial={{
                rotateY: -70,
                opacity: 0,
              }}
              animate={{
                rotateY: -95 - stackPosition * 0.3,
                rotateX: 3 - stackPosition * 0.15,
                x: -depthOffset,
                opacity: Math.max(0.6, 1 - stackPosition * 0.02),
              }}
              exit={{
                rotateY: -70,
                opacity: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: isTopPage ? 0 : stackPosition * 0.01,
              }}
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
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
                  boxShadow: isTopPage
                    ? '8px 0 20px rgba(0,0,0,0.35)'
                    : '4px 0 12px rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '8px',
                    background: 'linear-gradient(90deg, #d8d5cf 0%, #e8e5df 100%)',
                    boxShadow: 'inset 2px 0 3px rgba(0,0,0,0.12)',
                    borderRadius: '8px 0 0 8px',
                  }}
                />
              </Box>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </Box>
  )
}
