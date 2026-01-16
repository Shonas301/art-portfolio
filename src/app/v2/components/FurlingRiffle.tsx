'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/joy/Box'
import {
  RIFFLE_CONFIG,
  calculateSegmentTransforms,
} from '../utils/furling-utils'

// timing constants
const BASE_DURATION_PER_PAGE = 0.06 // seconds per page in riffle
const MIN_TOTAL_DURATION = 0.6
const MAX_TOTAL_DURATION = 1.4
const STAGGER_DELAY = 0.04 // delay between each page starting

interface FurlingRiffleProps {
  pageCount: number
  direction: 'forward' | 'backward'
  onComplete: () => void
}

// calculate visual layer count based on page count
function getLayerCount(pageCount: number): number {
  if (pageCount <= 3) return 3
  if (pageCount <= 6) return 4
  if (pageCount <= 12) return 5
  if (pageCount <= 20) return 6
  return 7
}

interface PageLayerProps {
  layerIndex: number
  totalLayers: number
  direction: 'forward' | 'backward'
  progress: number // 0-1 for this specific layer
  opacity: number
}

function PageLayer({ totalLayers, direction, progress, opacity, layerIndex }: PageLayerProps) {
  // memoize segment transforms using shared utility
  const segments = useMemo(() => {
    return calculateSegmentTransforms(direction, progress, RIFFLE_CONFIG)
  }, [progress, direction])

  // calculate z-index based on layer position
  const zIndex = 9999 + totalLayers - layerIndex

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transformOrigin: 'left center',
        opacity: opacity,
        zIndex: zIndex,
        pointerEvents: 'none',
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
            transformOrigin: 'left center',
            transform: `rotateY(${segment.flipAngle}deg) translateZ(${segment.furlDepth}px) rotateX(${segment.tiltAngle}deg)`,
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
                linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px),
                linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              boxShadow: segment.furlDepth > 15
                ? `0 ${segment.furlDepth * 0.12}px ${segment.furlDepth * 0.3}px rgba(0,0,0,${0.12 + segment.furlDepth * 0.0015})`
                : 'none',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg, rgba(0,0,0,${segment.furlDepth * 0.001}) 0%, rgba(255,255,255,${segment.furlDepth * 0.0015}) 50%, rgba(0,0,0,${segment.furlDepth * 0.0005}) 100%)`,
                pointerEvents: 'none',
              },
            }}
          >
            {/* faint content lines */}
            {segment.index === Math.floor(RIFFLE_CONFIG.segmentCount / 2) && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '15%',
                  left: 0,
                  right: 0,
                  height: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  opacity: 0.08,
                  overflow: 'hidden',
                }}
              >
                {Array.from({ length: 6 }).map((_, lineIdx) => (
                  <Box
                    key={lineIdx}
                    sx={{
                      height: '4px',
                      backgroundColor: '#888',
                      borderRadius: '2px',
                      width: '80%',
                      marginLeft: '10%',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export function FurlingRiffle({ pageCount, direction, onComplete }: FurlingRiffleProps) {
  const [globalProgress, setGlobalProgress] = useState(0)

  const layerCount = useMemo(() => getLayerCount(pageCount), [pageCount])

  const totalDuration = useMemo(() => {
    const rawDuration = pageCount * BASE_DURATION_PER_PAGE + layerCount * STAGGER_DELAY
    return Math.max(MIN_TOTAL_DURATION, Math.min(MAX_TOTAL_DURATION, rawDuration))
  }, [pageCount, layerCount])

  // use ref-like callback to avoid stale closure
  const onCompleteRef = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const elapsed = (currentTime - startTime) / 1000
      const newProgress = Math.min(elapsed / totalDuration, 1)

      setGlobalProgress(newProgress)

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
  }, [totalDuration, onCompleteRef])

  // calculate per-layer progress and opacity
  const layers = useMemo(() => {
    return Array.from({ length: layerCount }, (_, i) => {
      // each layer starts with a staggered delay
      const layerDelay = (i * STAGGER_DELAY) / totalDuration
      const layerDuration = (totalDuration - layerCount * STAGGER_DELAY) / totalDuration

      const layerStart = layerDelay
      const layerProgress = Math.max(0, Math.min(1, (globalProgress - layerStart) / layerDuration))

      // opacity: fade in quickly, hold, fade out at end
      let opacity = 1
      if (layerProgress < 0.1) {
        opacity = layerProgress / 0.1
      } else if (layerProgress > 0.85) {
        opacity = (1 - layerProgress) / 0.15
      }

      return {
        index: i,
        progress: layerProgress,
        opacity: Math.max(0, Math.min(1, opacity)),
      }
    })
  }, [globalProgress, layerCount, totalDuration])

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        perspective: '1500px',
        perspectiveOrigin: 'center center',
        pointerEvents: 'none',
      }}
    >
      {layers.map((layer) => (
        <PageLayer
          key={layer.index}
          layerIndex={layer.index}
          totalLayers={layerCount}
          direction={direction}
          progress={layer.progress}
          opacity={layer.opacity}
        />
      ))}

      {/* binding shadow */}
      <Box
        sx={{
          position: 'absolute',
          left: -8,
          top: '8%',
          width: '16px',
          height: '84%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
          opacity: globalProgress < 0.85 ? 1 : 1 - (globalProgress - 0.85) / 0.15,
        }}
      />
    </Box>
  )
}
