'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
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

export function FurlingRiffle({ pageCount, direction, onComplete }: FurlingRiffleProps) {
  const progressRef = useRef(0)
  // refs for each layer's container element, keyed by layer index
  // each layer has segmentCount segment refs inside it
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const bindingShadowRef = useRef<HTMLDivElement | null>(null)

  const layerCount = useMemo(() => getLayerCount(pageCount), [pageCount])

  const totalDuration = useMemo(() => {
    const rawDuration = pageCount * BASE_DURATION_PER_PAGE + layerCount * STAGGER_DELAY
    return Math.max(MIN_TOTAL_DURATION, Math.min(MAX_TOTAL_DURATION, rawDuration))
  }, [pageCount, layerCount])

  const onCompleteRef = useCallback(() => {
    onComplete()
  }, [onComplete])

  // apply transforms for all layers directly to DOM
  const applyTransforms = useCallback((globalProgress: number) => {
    for (let layerIdx = 0; layerIdx < layerCount; layerIdx++) {
      const layerEl = layerRefs.current[layerIdx]
      if (!layerEl) continue

      // per-layer progress with stagger
      const layerDelay = (layerIdx * STAGGER_DELAY) / totalDuration
      const layerDuration = (totalDuration - layerCount * STAGGER_DELAY) / totalDuration
      const layerStart = layerDelay
      const layerProgress = Math.max(0, Math.min(1, (globalProgress - layerStart) / layerDuration))

      // opacity envelope: fade in quickly, hold, fade out at end
      let opacity = 1
      if (layerProgress < 0.1) {
        opacity = layerProgress / 0.1
      } else if (layerProgress > 0.85) {
        opacity = (1 - layerProgress) / 0.15
      }
      opacity = Math.max(0, Math.min(1, opacity))
      layerEl.style.opacity = String(opacity)

      // calculate segment transforms for this layer's progress
      const segments = calculateSegmentTransforms(direction, layerProgress, RIFFLE_CONFIG)

      // update each segment DOM node inside this layer
      const segmentEls = layerEl.children
      for (let segIdx = 0; segIdx < segments.length; segIdx++) {
        const segEl = segmentEls[segIdx] as HTMLElement | undefined
        if (!segEl) continue
        const seg = segments[segIdx]
        segEl.style.transform = `rotateY(${seg.flipAngle}deg) translateZ(${seg.furlDepth}px) rotateX(${seg.tiltAngle}deg)`

        // update box shadow on inner surface
        const surface = segEl.firstElementChild as HTMLElement | null
        if (surface) {
          surface.style.boxShadow = seg.furlDepth > 15
            ? `0 ${seg.furlDepth * 0.12}px ${seg.furlDepth * 0.3}px rgba(0,0,0,${0.12 + seg.furlDepth * 0.0015})`
            : 'none'
        }
      }
    }

    // update binding shadow
    const bindingEl = bindingShadowRef.current
    if (bindingEl) {
      bindingEl.style.opacity = String(globalProgress < 0.85 ? 1 : 1 - (globalProgress - 0.85) / 0.15)
    }
  }, [direction, layerCount, totalDuration])

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    // set willChange at animation start for all segment elements
    layerRefs.current.forEach((layerEl) => {
      if (!layerEl) return
      const children = layerEl.children
      for (let i = 0; i < children.length; i++) {
        ;(children[i] as HTMLElement).style.willChange = 'transform'
      }
    })

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const elapsed = (currentTime - startTime) / 1000
      const newProgress = Math.min(elapsed / totalDuration, 1)

      progressRef.current = newProgress
      applyTransforms(newProgress)

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // clear willChange on completion
        layerRefs.current.forEach((layerEl) => {
          if (!layerEl) return
          const children = layerEl.children
          for (let i = 0; i < children.length; i++) {
            ;(children[i] as HTMLElement).style.willChange = 'auto'
          }
        })
        onCompleteRef()
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      // clean up willChange on unmount
      layerRefs.current.forEach((layerEl) => {
        if (!layerEl) return
        const children = layerEl.children
        for (let i = 0; i < children.length; i++) {
          ;(children[i] as HTMLElement).style.willChange = 'auto'
        }
      })
    }
  }, [totalDuration, onCompleteRef, applyTransforms])

  // pre-calculate static layout values
  const segmentCount = RIFFLE_CONFIG.segmentCount
  const segmentWidth = 100 / segmentCount

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
      {Array.from({ length: layerCount }, (_, layerIdx) => {
        const zIndex = 9999 + layerCount - layerIdx

        return (
          <Box
            key={layerIdx}
            ref={(el: HTMLDivElement | null) => { layerRefs.current[layerIdx] = el }}
            sx={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              opacity: 0,
              zIndex,
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: segmentCount }, (_, segIdx) => (
              <Box
                key={segIdx}
                sx={{
                  position: 'absolute',
                  left: `${segIdx * segmentWidth}%`,
                  top: 0,
                  width: `${segmentWidth + 0.5}%`,
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  backfaceVisibility: 'hidden',
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
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'transparent',
                      pointerEvents: 'none',
                    },
                  }}
                >
                  {/* faint content lines on the middle segment */}
                  {segIdx === Math.floor(segmentCount / 2) && (
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
      })}

      {/* binding shadow */}
      <Box
        ref={bindingShadowRef}
        sx={{
          position: 'absolute',
          left: -8,
          top: '8%',
          width: '16px',
          height: '84%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}
