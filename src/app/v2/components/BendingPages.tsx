'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/joy/Box'
import type { BendingPage } from '../context/FlipBookContext'

interface BendingPagesProps {
  bendingPages: BendingPage[]
  direction: 'forward' | 'backward'
}

function getPageTransform(
  bendAmount: number,
  stackPosition: number,
  direction: 'forward' | 'backward'
) {
  const sign = direction === 'forward' ? -1 : 1

  return {
    rotateY: bendAmount * 45 * sign,
    rotateX: bendAmount * 8 * (1 - stackPosition * 0.2),
    skewY: bendAmount * 3 * sign,
    scaleX: 1 - bendAmount * 0.05,
    scaleY: 1 - bendAmount * 0.02,
    translateZ: bendAmount * 20 + stackPosition * 3,
    translateX: bendAmount * 30 * sign,
  }
}

const MAX_VISIBLE_BENDING = 15

export function BendingPages({ bendingPages, direction }: BendingPagesProps) {
  const visiblePages = useMemo(
    () => bendingPages.slice(0, MAX_VISIBLE_BENDING),
    [bendingPages]
  )

  return (
    <>
      {visiblePages.map((page, index) => (
        <MemoizedBendingPage
          key={`bending-${page.pageIndex}`}
          page={page}
          index={index}
          direction={direction}
        />
      ))}
    </>
  )
}

interface BendingPageProps {
  page: BendingPage
  index: number
  direction: 'forward' | 'backward'
}

const MemoizedBendingPage = memo(function BendingPage({
  page,
  index,
  direction,
}: BendingPageProps) {
  const transform = getPageTransform(page.bendAmount, index, direction)

  return (
    <motion.div
      animate={transform}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 40,
        mass: 0.5,
      }}
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transformOrigin: 'left center',
        zIndex: 9000 - index,
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#faf8f3',
          borderRadius: '8px',
          boxShadow: `
            ${-5 - page.bendAmount * 10}px
            ${page.bendAmount * 5}px
            ${15 + page.bendAmount * 10}px
            rgba(0,0,0,${0.2 + page.bendAmount * 0.15})
          `,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 35px,
              rgba(0,0,0,0.02) 35px,
              rgba(0,0,0,0.02) 36px
            )
          `,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(
              to right,
              transparent 0%,
              rgba(0,0,0,${0.02 + page.bendAmount * 0.08}) 30%,
              rgba(0,0,0,${0.05 + page.bendAmount * 0.1}) 50%,
              rgba(0,0,0,${0.02 + page.bendAmount * 0.08}) 70%,
              transparent 100%
            )`,
            borderRadius: 'inherit',
          },
        }}
      />
    </motion.div>
  )
})
