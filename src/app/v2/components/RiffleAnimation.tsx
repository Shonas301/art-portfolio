'use client'

import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Box from '@mui/joy/Box'

// animation timing - tuned for smooth riffle feel
const BASE_DURATION = 0.08 // seconds per page flip
const MIN_DURATION = 0.5 // minimum total animation time
const MAX_DURATION = 1.2 // maximum total animation time
const STAGGER_FACTOR = 0.015 // delay between layers
const BLUR_AMOUNT = 3

interface RiffleAnimationProps {
  pageCount: number // how many pages to flip
  direction: 'forward' | 'backward'
  onComplete: () => void
}

export function RiffleAnimation({ pageCount, direction, onComplete }: RiffleAnimationProps) {
  // calculate how many visual layers to show based on page count
  // more pages = more layers for denser riffle effect
  const layerCount = useMemo(() => {
    if (pageCount <= 3) return 4
    if (pageCount <= 8) return 6
    if (pageCount <= 15) return 8
    if (pageCount <= 25) return 10
    return 12
  }, [pageCount])

  // calculate total duration based on page count
  const totalDuration = useMemo(() => {
    const rawDuration = pageCount * BASE_DURATION
    return Math.max(MIN_DURATION, Math.min(MAX_DURATION, rawDuration))
  }, [pageCount])

  // duration per layer
  const layerDuration = totalDuration / layerCount

  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete()
    }, totalDuration * 1000 + 100) // small buffer

    return () => clearTimeout(timeout)
  }, [onComplete, totalDuration])

  // rotation direction: forward = flip left (negative rotateY), backward = flip right (positive)
  const rotationEnd = direction === 'forward' ? -180 : 180

  return (
    <AnimatePresence mode="sync">
      {Array.from({ length: layerCount }).map((_, i) => {
        // stagger delay - spread across the animation
        const delay = i * STAGGER_FACTOR * (pageCount / 10 + 1)

        return (
          <motion.div
            key={`riffle-layer-${i}`}
            initial={{
              rotateY: 0,
              opacity: 0,
              filter: 'blur(0px)',
              scale: 1,
            }}
            animate={{
              rotateY: rotationEnd,
              opacity: [0, 0.8, 0.8, 0],
              filter: [
                'blur(0px)',
                `blur(${BLUR_AMOUNT}px)`,
                `blur(${BLUR_AMOUNT}px)`,
                'blur(0px)',
              ],
              scale: [1, 0.98, 0.98, 1],
            }}
            transition={{
              duration: layerDuration * 1.5,
              delay: delay,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { times: [0, 0.15, 0.85, 1] },
              filter: { times: [0, 0.15, 0.85, 1] },
              scale: { times: [0, 0.3, 0.7, 1] },
            }}
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden',
              willChange: 'transform, opacity, filter',
              zIndex: 9999 + i,
              pointerEvents: 'none',
            }}
          >
            {/* page surface with paper texture */}
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
                boxShadow: '-8px 0 25px rgba(0,0,0,0.4)',
                borderRadius: '8px',
              }}
            >
              {/* faint content lines to suggest pages have content */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '12%',
                  left: '8%',
                  right: '8%',
                  height: '76%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  opacity: 0.12,
                }}
              >
                {Array.from({ length: 10 }).map((_, lineIdx) => (
                  <Box
                    key={lineIdx}
                    sx={{
                      height: '6px',
                      backgroundColor: '#888',
                      borderRadius: '3px',
                      width: `${50 + (lineIdx * 7) % 40}%`,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}
