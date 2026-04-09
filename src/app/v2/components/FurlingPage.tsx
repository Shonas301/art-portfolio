'use client'

import { useEffect, useRef, useCallback } from 'react'
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
  // refs for direct DOM manipulation — no state, no re-renders
  const progressRef = useRef(0)
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([])
  const bindingShadowRef = useRef<HTMLDivElement | null>(null)
  const bottomShadowRef = useRef<HTMLDivElement | null>(null)
  // depth overlay refs — replacement for ::after pseudo-elements that need per-frame updates
  const depthOverlayRefs = useRef<(HTMLDivElement | null)[]>([])

  const onCompleteRef = useCallback(() => {
    onComplete()
  }, [onComplete])

  // apply transforms directly to DOM nodes — bypasses React reconciliation
  const applyTransforms = useCallback((progress: number) => {
    const segments = calculateSegmentTransforms(direction, progress, SINGLE_PAGE_CONFIG)

    segments.forEach((segment) => {
      const el = segmentRefs.current[segment.index]
      if (!el) return
      el.style.transform = `rotateY(${segment.flipAngle}deg) translateZ(${segment.furlDepth}px) rotateX(${segment.tiltAngle}deg)`

      // update box shadow on the inner surface element
      const surface = el.firstElementChild as HTMLElement | null
      if (surface) {
        surface.style.boxShadow = segment.furlDepth > 20
          ? `0 ${segment.furlDepth * 0.15}px ${segment.furlDepth * 0.4}px rgba(0,0,0,${0.15 + segment.furlDepth * 0.002})`
          : 'none'
      }

      // update depth overlay gradient (replaces ::after pseudo-element)
      const overlay = depthOverlayRefs.current[segment.index]
      if (overlay) {
        overlay.style.background = `linear-gradient(90deg, rgba(0,0,0,${segment.furlDepth * 0.001}) 0%, rgba(255,255,255,${segment.furlDepth * 0.002}) 50%, rgba(0,0,0,${segment.furlDepth * 0.0005}) 100%)`
      }
    })

    // update binding shadow
    const bindingEl = bindingShadowRef.current
    if (bindingEl) {
      const maxFurl = Math.max(...segments.map(s => s.furlDepth))
      const shadowIntensity = 0.25 + (maxFurl / SINGLE_PAGE_CONFIG.maxFurlDepth) * 0.25
      bindingEl.style.background = `linear-gradient(90deg, transparent 0%, rgba(0,0,0,${shadowIntensity * 0.6}) 50%, transparent 100%)`
      bindingEl.style.opacity = String(progress < 0.8 ? 1 : 1 - (progress - 0.8) / 0.2)
    }

    // update bottom shadow
    const bottomEl = bottomShadowRef.current
    if (bottomEl) {
      const maxFurl = Math.max(...segments.map(s => s.furlDepth))
      if (maxFurl > 30) {
        bottomEl.style.display = 'block'
        bottomEl.style.background = `radial-gradient(ellipse at center, rgba(0,0,0,${maxFurl * 0.003}) 0%, transparent 70%)`
        bottomEl.style.transform = `translateY(${maxFurl * 0.2}px)`
      } else {
        bottomEl.style.display = 'none'
      }
    }
  }, [direction])

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    // set willChange at animation start
    segmentRefs.current.forEach((el) => {
      if (el) el.style.willChange = 'transform'
    })

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const elapsed = (currentTime - startTime) / 1000
      const newProgress = Math.min(elapsed / TOTAL_DURATION, 1)

      progressRef.current = newProgress
      applyTransforms(newProgress)

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // clear willChange on completion — free GPU layers
        segmentRefs.current.forEach((el) => {
          if (el) el.style.willChange = 'auto'
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
      segmentRefs.current.forEach((el) => {
        if (el) el.style.willChange = 'auto'
      })
    }
  }, [onCompleteRef, applyTransforms])

  // build segment elements once — transforms applied via refs
  const segmentCount = SINGLE_PAGE_CONFIG.segmentCount
  const segmentWidth = 100 / segmentCount

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
        {Array.from({ length: segmentCount }, (_, i) => (
          <Box
            key={i}
            ref={(el: HTMLDivElement | null) => { segmentRefs.current[i] = el }}
            sx={{
              position: 'absolute',
              left: `${i * segmentWidth}%`,
              top: 0,
              width: `${segmentWidth + 0.5}%`,
              height: '100%',
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden',
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
              }}
            />
            {/* depth overlay — replaces ::after pseudo for per-frame gradient updates */}
            <Box
              ref={(el: HTMLDivElement | null) => { depthOverlayRefs.current[i] = el }}
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* shadow on the "binding" side */}
      <Box
        ref={bindingShadowRef}
        sx={{
          position: 'absolute',
          left: -10,
          top: '5%',
          width: '25px',
          height: '90%',
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      {/* bottom shadow for depth when furled */}
      <Box
        ref={bottomShadowRef}
        sx={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          bottom: -20,
          height: '40px',
          filter: 'blur(15px)',
          pointerEvents: 'none',
          display: 'none',
        }}
      />
    </Box>
  )
}
