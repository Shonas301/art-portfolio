'use client'

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import { useFlipBook } from '../context/FlipBookContext'
import { pageContent } from '../data/portfolio-content'
import { LandingPage } from './pages/LandingPage'
import { IntroPage } from './pages/IntroPage'
import { GalleryGridPage } from './pages/GalleryGridPage'
import { CodePage } from './pages/CodePage'
import { ContactPage } from './pages/ContactPage'
import type { LandingData, IntroData, GalleryData, CodeData, ContactData } from '../data/portfolio-content'

export function FlippingPage() {
  const { state, dispatch } = useFlipBook()
  const controls = useAnimationControls()

  useEffect(() => {
    console.log('[FLIP] Effect triggered:', {
      isFlipping: state.isFlipping,
      target: state.targetPageIndex,
      current: state.currentPageIndex,
      isRiffling: state.isRiffling,
    })

    if (!state.isFlipping || state.targetPageIndex === null) {
      console.log('[FLIP] Exiting effect - not flipping or no target')
      return
    }

    console.log('[FLIP] Performing flip animation...')

    const performFlip = async () => {
      // wait one frame to ensure motion.div is fully mounted and ready
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
      console.log('[FLIP] Frame delayed, motion controls should be ready')

      const startTime = performance.now()
      const current = state.currentPageIndex
      const target = state.targetPageIndex!
      const distance = Math.abs(target - current)
      const direction = target > current ? 1 : -1

      console.log(`[FLIP] Starting riffle: ${current} → ${target} (distance: ${distance})`)

      // safety timeout to ensure we always complete
      const safetyTimeout = setTimeout(() => {
        console.error('[FLIP] ⚠️ Safety timeout triggered - forcing flip complete')
        dispatch({ type: 'FLIP_COMPLETE' })
      }, 10000) // 10 second safety net

      try {
        if (state.isRiffling && distance > 0) {
          // determine if this is a tab navigation or gallery carousel navigation
          // for tabs: show extra intermediate pages for blur effect
          // for gallery carousel (in carousel view mode): fewer pages, cleaner
          const isCarouselNav = state.viewMode === 'carousel'

          // for tab nav: multiply steps to create blur (min 8 flips even for distance=1)
          // for carousel: use actual distance
          const actualSteps = isCarouselNav ? distance : Math.max(8, distance * 4)

          // calculate base duration per flip based on total steps
          // more pages = faster individual flips
          const baseDuration = Math.max(0.04, 0.25 / Math.sqrt(actualSteps))
          const finalFlipDuration = 0.6

          console.log(`[FLIP] Riffle params: mode=${isCarouselNav ? 'carousel' : 'tabs'}, actualSteps=${actualSteps}, baseDuration=${baseDuration.toFixed(3)}s`)

          // animate through steps
          for (let i = 1; i <= actualSteps; i++) {
            const isLastFlip = i === actualSteps
            const flipDuration = isLastFlip ? finalFlipDuration : baseDuration

            // calculate which actual page we should show
            // for extra blur steps, interpolate between current and target
            const progress = i / actualSteps
            const interpolatedPage = Math.floor(current + (distance * progress * direction))

            if (i % 3 === 0) {
              console.log(`[FLIP] Step ${i}/${actualSteps} (page ${interpolatedPage}) - calling controls.start()`)
            }

            // add paper curl effect - bend slightly during flip
            // note: can't use keyframe arrays with spring, so only use spring for final flip without curl
            if (isLastFlip) {
              // final flip with spring physics for bounce
              // land at ~-97deg (past -90) with slight bend like being held by hand
              // NEGATIVE rotation with left origin swings right edge to the LEFT
              await controls.start({
                rotateY: direction * -97,
                rotateX: 3, // slight upward bend from hand pressure
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                },
              })
            } else {
              // intermediate flips with curl effect - quick flip to left stack
              await controls.start({
                rotateY: direction * -97,
                rotateX: [0, -8, 3], // curl during flip, land with hand bend
                scale: [1, 0.96, 1], // slight compression
                transition: {
                  duration: flipDuration,
                  ease: [0.22, 1, 0.36, 1], // smooth easing for fast flips
                },
              })
            }

            // reset transforms for next flip (but don't update page content during riffle)
            if (!isLastFlip) {
              // reset transforms for next flip
              controls.set({ rotateY: 0, rotateX: 0, scale: 1 })
              // DON'T dispatch RIFFLE_STEP - we want blank pages during riffle, not actual content
            }
          }
        } else if (distance > 0) {
          // single page flip (shouldn't normally hit this with unified actions)
          if (state.debugMode) console.log('[FLIP] Single flip mode')
          await controls.start({
            rotateY: direction * -180,
            transition: {
              duration: 0.8,
              ease: [0.4, 0.0, 0.2, 1],
            },
          })
        }

        const duration = performance.now() - startTime
        console.log(`[FLIP] ✓ Complete in ${duration.toFixed(2)}ms`)

        clearTimeout(safetyTimeout)
        dispatch({ type: 'FLIP_COMPLETE' })
      } catch (error) {
        console.error('[FLIP] ✗ Animation error:', error)
        console.log('[FLIP] Fallback: forcing page change without animation')

        clearTimeout(safetyTimeout)
        dispatch({ type: 'FLIP_COMPLETE' })
      }
    }

    performFlip()
  }, [state.isFlipping, state.targetPageIndex, state.isRiffling, state.currentPageIndex, controls, dispatch])

  // render page content - blank during riffle, actual content on final flip
  const renderPageContent = () => {
    // during riffle animation, show blank page
    // this creates the "flipping through pages" effect
    if (state.isRiffling && state.targetPageIndex !== null && state.currentPageIndex !== state.targetPageIndex) {
      return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          opacity: 0.3,
        }}>
          <Typography level="h4" sx={{ color: '#999' }}>
            ...
          </Typography>
        </Box>
      )
    }

    // show actual content when not riffling or on final flip
    const content = pageContent[state.currentPageIndex]

    switch (content.type) {
      case 'landing':
        return <LandingPage title={content.title} data={content.data as LandingData} />
      case 'intro':
        return <IntroPage title={content.title} data={content.data as IntroData} />
      case 'gallery':
        return <GalleryGridPage title={content.title} data={content.data as GalleryData} />
      case 'code':
        return <CodePage title={content.title} data={content.data as CodeData} />
      case 'contact':
        return <ContactPage title={content.title} data={content.data as ContactData} />
      default:
        return null
    }
  }

  if (!state.isFlipping) {
    console.log('[FLIP] Component not rendering - isFlipping is false')
    return null
  }

  console.log('[FLIP] Rendering FlippingPage component')

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        perspective: '1200px',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <motion.div
        animate={controls}
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center', // spine edge - pages rotate around left edge
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
              linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
              linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            boxShadow: '-5px 0 20px rgba(0,0,0,0.4)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: { xs: 4, md: 6, lg: 8 },
              height: '100%',
              overflow: 'auto',
            }}
          >
            {renderPageContent()}
          </Box>
        </Box>
      </motion.div>
    </Box>
  )
}
