'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/joy/Box'

// number of vertical segments to create the curved effect
const SEGMENT_COUNT = 12
// animation timing
const TENSION_DURATION = 0.3 // seconds to build curve
const FLIP_DURATION = 0.5 // seconds to complete flip
const TOTAL_DURATION = TENSION_DURATION + FLIP_DURATION

// furl intensity - how much the page bows outward (in pixels)
const MAX_FURL_DEPTH = 120 // increased from ~35px equivalent

interface FurlingPageProps {
  direction: 'forward' | 'backward'
  onComplete: () => void
}

// calculate how much each segment bows toward the viewer (Z depth)
// creates a horizontal curve with the middle bulging out most
function getSegmentFurlDepth(segmentIndex: number, direction: 'forward' | 'backward', progress: number): number {
  const normalizedIndex = segmentIndex / (SEGMENT_COUNT - 1) // 0 to 1

  // for forward flip, the curve peaks more toward the right (free edge)
  // for backward flip, peaks toward the left
  const peakPosition = direction === 'forward' ? 0.65 : 0.35

  // bell curve centered at peak position - this creates the "bow" shape
  const distanceFromPeak = Math.abs(normalizedIndex - peakPosition)
  const curveFactor = Math.exp(-Math.pow(distanceFromPeak * 2.5, 2)) // gaussian curve

  // tension builds then releases
  const tensionPhase = TENSION_DURATION / TOTAL_DURATION
  let furlIntensity: number

  if (progress < tensionPhase) {
    // building tension - furl increases
    furlIntensity = Math.sin((progress / tensionPhase) * Math.PI * 0.5) // ease in
  } else {
    // releasing - furl decreases as page flips
    const releaseProgress = (progress - tensionPhase) / (1 - tensionPhase)
    furlIntensity = Math.cos(releaseProgress * Math.PI * 0.5) // ease out
  }

  return MAX_FURL_DEPTH * curveFactor * furlIntensity
}

// calculate the Y rotation (the main flip) for each segment
// all segments rotate together for a uniform middle-out flip
function getSegmentFlipAngle(segmentIndex: number, direction: 'forward' | 'backward', progress: number): number {
  const normalizedIndex = segmentIndex / (SEGMENT_COUNT - 1)

  // flip starts after tension builds a bit
  const flipStart = 0.2
  const flipProgress = Math.max(0, (progress - flipStart) / (1 - flipStart))

  // for middle-out: segments near center start first, edges follow
  // this creates a wave-like unfurling from center
  const centerDistance = Math.abs(normalizedIndex - 0.5) * 2 // 0 at center, 1 at edges
  const segmentDelay = centerDistance * 0.12 // center leads by up to 12%

  const adjustedProgress = Math.max(0, Math.min(1, (flipProgress - segmentDelay) / (1 - segmentDelay)))

  // ease the flip
  const eased = easeInOutCubic(adjustedProgress)

  // full rotation is 180 degrees
  const targetAngle = direction === 'forward' ? -180 : 180

  return targetAngle * eased
}

// small tilt to enhance the curve appearance
function getSegmentTilt(segmentIndex: number, direction: 'forward' | 'backward', furlDepth: number): number {
  const normalizedIndex = segmentIndex / (SEGMENT_COUNT - 1)
  const peakPosition = direction === 'forward' ? 0.65 : 0.35

  // tilt based on position relative to the curve peak
  // segments before peak tilt one way, after peak tilt the other
  const tiltDirection = normalizedIndex < peakPosition ? 1 : -1

  // tilt proportional to furl depth for natural curve appearance
  const tiltAmount = (furlDepth / MAX_FURL_DEPTH) * 8 * tiltDirection

  return tiltAmount
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
      const furlDepth = getSegmentFurlDepth(i, direction, progress)
      const flipAngle = getSegmentFlipAngle(i, direction, progress)
      const tiltAngle = getSegmentTilt(i, direction, furlDepth)

      return {
        index: i,
        left: `${i * segmentWidth}%`,
        width: `${segmentWidth + 0.5}%`, // slight overlap to prevent gaps
        furlDepth,
        flipAngle,
        tiltAngle,
      }
    })
  }, [progress, direction, segmentWidth])

  // calculate dynamic shadow based on current furl state
  const maxFurl = Math.max(...segments.map(s => s.furlDepth))
  const shadowIntensity = 0.25 + (maxFurl / MAX_FURL_DEPTH) * 0.25

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
              transform: `
                rotateY(${segment.flipAngle}deg)
                translateZ(${segment.furlDepth}px)
                rotateX(${segment.tiltAngle}deg)
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
                // shadow on the furled part
                boxShadow: segment.furlDepth > 20
                  ? `0 ${segment.furlDepth * 0.15}px ${segment.furlDepth * 0.4}px rgba(0,0,0,${0.15 + segment.furlDepth * 0.002})`
                  : 'none',
                // gradient to show depth on curved areas
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(
                    90deg,
                    rgba(0,0,0,${segment.furlDepth * 0.001}) 0%,
                    rgba(255,255,255,${segment.furlDepth * 0.002}) 50%,
                    rgba(0,0,0,${segment.furlDepth * 0.0005}) 100%
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
          width: '25px',
          height: '90%',
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(0,0,0,${shadowIntensity * 0.6}) 50%,
            transparent 100%
          )`,
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
