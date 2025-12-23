'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/joy/Box'
import type { ReleasedPage } from '../context/FlipBookContext'

interface CascadingReleaseProps {
  releasedPages: ReleasedPage[]
  onPageLanded: (pageIndex: number) => void
}

export function CascadingRelease({
  releasedPages,
  onPageLanded,
}: CascadingReleaseProps) {
  return (
    <>
      {releasedPages.map((page, index) => (
        <ReleasingPage
          key={`release-${page.pageIndex}-${page.releaseTime}`}
          page={page}
          stackPosition={index}
          onComplete={() => onPageLanded(page.pageIndex)}
        />
      ))}
    </>
  )
}

interface ReleasingPageProps {
  page: ReleasedPage
  stackPosition: number
  onComplete: () => void
}

function ReleasingPage({ page, stackPosition, onComplete }: ReleasingPageProps) {
  const springConfig = useMemo(
    () => ({
      stiffness: 180 + page.initialVelocity * 50,
      damping: 25 + page.initialVelocity * 5,
      mass: 1 - stackPosition * 0.05,
    }),
    [page.initialVelocity, stackPosition]
  )

  const cascadeDelay = stackPosition * 0.04

  const targetRotation = page.direction === 'forward' ? -180 : 180
  const sign = page.direction === 'forward' ? -1 : 1

  return (
    <motion.div
      initial={{
        rotateY: 45 * sign,
        rotateX: 8,
        skewY: 3 * sign,
        scaleX: 0.95,
        translateZ: 20,
        translateX: 30 * sign,
      }}
      animate={{
        rotateY: targetRotation,
        rotateX: 0,
        skewY: 0,
        scaleX: 1,
        translateZ: 0,
        translateX: 0,
      }}
      transition={{
        ...springConfig,
        delay: cascadeDelay,
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transformOrigin: 'left center',
        zIndex: 8000 - stackPosition,
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#faf8f3',
          borderRadius: '8px',
          boxShadow: '-5px 0 20px rgba(0,0,0,0.4)',
          backfaceVisibility: 'hidden',
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 35px,
              rgba(0,0,0,0.02) 35px,
              rgba(0,0,0,0.02) 36px
            ),
            linear-gradient(
              90deg,
              #e8e5df 0%,
              #faf8f3 3%,
              #faf8f3 97%,
              #e8e5df 100%
            )
          `,
        }}
      />
    </motion.div>
  )
}
