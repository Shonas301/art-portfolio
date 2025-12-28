'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/joy/Box'

// number of vertical segments to create the curved effect
const SEGMENT_COUNT = 10
// animation timing
const TENSION_DURATION = 0.25 // seconds to build curve
const FLIP_DURATION = 0.45 // seconds to complete flip
const TOTAL_DURATION = TENSION_DURATION + FLIP_DURATION

interface FurlingPageProps {
  direction: 'forward' | 'backward'
  onComplete: () => void
}

// calculate the bend amount for each segment to create a curve
// segments near the free edge (right for forward, left for backward) bend more
function getSegmentBendAngle(segmentIndex: number, direction: 'forward' | 'backward', progress: number): number {
  const normalizedIndex = segmentIndex / (SEGMENT_COUNT - 1) // 0 to 1

  // for forward flip, rightmost segments curve most
  // for backward flip, leftmost segments curve most
  const bendPosition = direction === 'forward' ? normalizedIndex : 1 - normalizedIndex

  // create a bell curve for the bend - peaks at the middle of tension phase
  const tensionProgress = Math.min(progress / (TENSION_DURATION / TOTAL_DURATION), 1)
  const releaseProgress = Math.max(0, (progress - TENSION_DURATION / TOTAL_DURATION) / (FLIP_DURATION / TOTAL_DURATION))

  // bend increases during tension, then decreases during release
  const tensionBend = Math.sin(tensionProgress * Math.PI) * 35 // max 35 degrees bend at peak
  const releaseFade = 1 - releaseProgress

  // the curve: segments at the free edge bend more
  const curveFactor = Math.pow(bendPosition, 1.5) // power creates realistic curve falloff

  return tensionBend * curveFactor * releaseFade
}

// calculate the Y rotation (the main flip) for each segment
function getSegmentFlipAngle(segmentIndex: number, direction: 'forward' | 'backward', progress: number): number {
  const normalizedIndex = segmentIndex / (SEGMENT_COUNT - 1)

  // flip doesn't start until tension phase is partially complete
  const flipStart = 0.15
  const flipProgress = Math.max(0, (progress - flipStart) / (1 - flipStart))

  // all segments rotate, but outer ones lead slightly
  const leadFactor = direction === 'forward' ? normalizedIndex : 1 - normalizedIndex
  const segmentDelay = (1 - leadFactor) * 0.08 // inner segments lag by up to 8%
  const adjustedProgress = Math.max(0, Math.min(1, flipProgress - segmentDelay) / (1 - segmentDelay))

  // ease the flip - starts slow, accelerates, slows at end
  const eased = easeInOutCubic(adjustedProgress)

  // full rotation is 180 degrees
  const targetAngle = direction === 'forward' ? -180 : 180

  return targetAngle * eased
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function FurlingPage({ direction, onComplete }: FurlingPageProps) {
  const [progress, setProgress] = useState(0)

  // segment widths - each segment is an equal slice
  const segmentWidth = 100 / SEGMENT_COUNT

  const handleComplete = useCallback(() => {
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
        handleComplete()
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [handleComplete])

  // memoize segment calculations
  const segments = useMemo(() => {
    return Array.from({ length: SEGMENT_COUNT }, (_, i) => {
      const bendAngle = getSegmentBendAngle(i, direction, progress)
      const flipAngle = getSegmentFlipAngle(i, direction, progress)

      // combine bend (around X axis for vertical curve) and flip (around Y axis)
      // the bend creates the "tension" curve, flip does the page turn
      return {
        index: i,
        left: `${i * segmentWidth}%`,
        width: `${segmentWidth + 0.5}%`, // slight overlap to prevent gaps
        bendAngle,
        flipAngle,
        // depth offset to enhance 3d effect - curved parts come toward viewer
        zOffset: Math.abs(bendAngle) * 0.3,
      }
    })
  }, [progress, direction, segmentWidth])

  // calculate dynamic shadow based on current bend state
  const maxBend = Math.max(...segments.map(s => Math.abs(s.bendAngle)))
  const shadowIntensity = 0.3 + (maxBend / 35) * 0.2

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        perspective: '1200px',
        perspectiveOrigin: 'left center',
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
              // combine rotations: Y for page flip, X for vertical curve bend
              transform: `
                rotateY(${segment.flipAngle}deg)
                rotateX(${segment.bendAngle}deg)
                translateZ(${segment.zOffset}px)
              `,
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
                boxShadow: segment.index === SEGMENT_COUNT - 1
                  ? `0 0 20px rgba(0,0,0,${shadowIntensity})`
                  : 'none',
                // slight gradient to show depth on curved areas
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(
                    90deg,
                    rgba(0,0,0,${Math.abs(segment.bendAngle) * 0.002}) 0%,
                    transparent 50%,
                    rgba(255,255,255,${Math.abs(segment.bendAngle) * 0.003}) 100%
                  )`,
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
          width: '20px',
          height: '90%',
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(0,0,0,${shadowIntensity * 0.5}) 50%,
            transparent 100%
          )`,
          filter: 'blur(8px)',
          pointerEvents: 'none',
          opacity: progress < 0.8 ? 1 : 1 - (progress - 0.8) / 0.2,
        }}
      />
    </Box>
  )
}
