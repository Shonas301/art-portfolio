'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/joy/Box'
import {
  SINGLE_PAGE_CONFIG,
  calculateSegmentTransforms,
} from '../utils/furling-utils'

// animation timing
const TENSION_DURATION = 0.3 // seconds to build curve
const FLIP_DURATION = 0.5 // seconds to complete flip
const TOTAL_DURATION = TENSION_DURATION + FLIP_DURATION

interface FurlingPageProps {
  direction: 'forward' | 'backward'
  onComplete: () => void
}

export function FurlingPage({ direction, onComplete }: FurlingPageProps) {
  const [progress, setProgress] = useState(0)

  // use ref to avoid stale closure in animation loop
  const onCompleteRef = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const elapsed = (currentTime - startTime) / 1000 // convert to seconds
      const newProgress = Math.min(elapsed / TOTAL_DURATION, 1)

      setProgress(newProgress)

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        onCompleteRef()
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [onCompleteRef])

  // memoize segment calculations using shared utility
  const segments = useMemo(() => {
    return calculateSegmentTransforms(direction, progress, SINGLE_PAGE_CONFIG)
  }, [progress, direction])

  // calculate dynamic shadow based on current furl state
  const maxFurl = Math.max(...segments.map(s => s.furlDepth))
  const shadowIntensity = 0.25 + (maxFurl / SINGLE_PAGE_CONFIG.maxFurlDepth) * 0.25

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        perspective: '1500px',
        perspectiveOrigin: 'center center',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* container for all segments with shared transform origin */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
        }}
      >
        {segments.map((segment) => (
          <Box
            key={segment.index}
            sx={{
              position: 'absolute',
              left: segment.left,
              top: 0,
              width: segment.width,
              height: '100%',
              transformStyle: 'preserve-3d',
              // each segment's transform origin is at its left edge for proper hinging
              transformOrigin: 'left center',
              // combine: Y rotation for flip, Z translation for furl depth, X rotation for tilt
              transform: `rotateY(${segment.flipAngle}deg) translateZ(${segment.furlDepth}px) rotateX(${segment.tiltAngle}deg)`,
              backfaceVisibility: 'hidden',
              willChange: 'transform',
            }}
          >
            {/* page surface */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#faf8f3',
                backgroundImage: `
                  linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px),
                  linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                // shadow on the furled part
                boxShadow: segment.furlDepth > 20
                  ? `0 ${segment.furlDepth * 0.15}px ${segment.furlDepth * 0.4}px rgba(0,0,0,${0.15 + segment.furlDepth * 0.002})`
                  : 'none',
                // gradient to show depth on curved areas
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(90deg, rgba(0,0,0,${segment.furlDepth * 0.001}) 0%, rgba(255,255,255,${segment.furlDepth * 0.002}) 50%, rgba(0,0,0,${segment.furlDepth * 0.0005}) 100%)`,
                  pointerEvents: 'none',
                },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* shadow on the "binding" side */}
      <Box
        sx={{
          position: 'absolute',
          left: -10,
          top: '5%',
          width: '25px',
          height: '90%',
          background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,${shadowIntensity * 0.6}) 50%, transparent 100%)`,
          filter: 'blur(10px)',
          pointerEvents: 'none',
          opacity: progress < 0.8 ? 1 : 1 - (progress - 0.8) / 0.2,
        }}
      />

      {/* bottom shadow for depth when furled */}
      {maxFurl > 30 && (
        <Box
          sx={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: -20,
            height: '40px',
            background: `radial-gradient(ellipse at center, rgba(0,0,0,${maxFurl * 0.003}) 0%, transparent 70%)`,
            filter: 'blur(15px)',
            pointerEvents: 'none',
            transform: `translateY(${maxFurl * 0.2}px)`,
          }}
        />
      )}
    </Box>
  )
}
