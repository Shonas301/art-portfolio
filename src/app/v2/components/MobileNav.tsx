'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import { useFlipBook } from '../context/FlipBookContext'
import { sectionMappings } from '../data/portfolio-content'

export function MobileNav() {
  const { state, dispatch } = useFlipBook()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showRightFade, setShowRightFade] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)

  const handleTabClick = (physicalPage: number) => {
    if (physicalPage === state.currentPageIndex) return
    dispatch({ type: 'FLIP_TO_PAGE', payload: physicalPage })
  }

  const handleResumeClick = () => {
    dispatch({ type: 'OPEN_RESUME' })
  }

  const handleKeyDown = (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
  }

  // check if nav is scrollable and update fade indicator
  const updateScrollIndicator = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const hasMoreToScroll = el.scrollWidth > el.clientWidth &&
      el.scrollLeft + el.clientWidth < el.scrollWidth - 2
    setShowRightFade(hasMoreToScroll)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollIndicator()
    el.addEventListener('scroll', updateScrollIndicator, { passive: true })
    window.addEventListener('resize', updateScrollIndicator)
    return () => {
      el.removeEventListener('scroll', updateScrollIndicator)
      window.removeEventListener('resize', updateScrollIndicator)
    }
  }, [updateScrollIndicator])

  // swipe affordance: show on first mobile visit, dismiss after interaction
  useEffect(() => {
    // only show on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouchDevice) return

    const dismissed = sessionStorage.getItem('swipe-hint-dismissed')
    if (!dismissed) {
      setShowSwipeHint(true)
    }
  }, [])

  // auto-dismiss swipe hint after 4 seconds
  useEffect(() => {
    if (!showSwipeHint) return
    const timer = setTimeout(() => {
      setShowSwipeHint(false)
      sessionStorage.setItem('swipe-hint-dismissed', 'true')
    }, 4000)
    return () => clearTimeout(timer)
  }, [showSwipeHint])

  // dismiss on any touch interaction
  const dismissSwipeHint = useCallback(() => {
    if (showSwipeHint) {
      setShowSwipeHint(false)
      sessionStorage.setItem('swipe-hint-dismissed', 'true')
    }
  }, [showSwipeHint])

  useEffect(() => {
    if (!showSwipeHint) return
    window.addEventListener('touchstart', dismissSwipeHint, { once: true })
    return () => window.removeEventListener('touchstart', dismissSwipeHint)
  }, [showSwipeHint, dismissSwipeHint])

  // find which section the current page belongs to (or is closest to)
  const currentSection = sectionMappings.reduce((closest, section) => {
    if (section.physicalPage <= state.currentPageIndex) {
      if (!closest || section.physicalPage > closest.physicalPage) {
        return section
      }
    }
    return closest
  }, null as typeof sectionMappings[0] | null)

  return (
    <>
      {/* swipe affordance overlay for touch users */}
      {showSwipeHint && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 80, md: 'none' },
            left: '50%',
            transform: 'translateX(-50%)',
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(147, 51, 234, 0.85)',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: '20px',
            zIndex: 1001,
            animation: 'swipeHintFade 4s ease-in-out forwards',
            '@keyframes swipeHintFade': {
              '0%': { opacity: 0, transform: 'translateX(-50%) translateY(8px)' },
              '15%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
              '75%': { opacity: 1 },
              '100%': { opacity: 0 },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.8rem',
              color: 'white',
              fontWeight: 500,
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ← swipe to turn pages →
          </Typography>
        </Box>
      )}

      {/* nav bar container with scroll fade indicator */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'block', md: 'none' },
          zIndex: 1000,
        }}
      >
        {/* right fade gradient indicating more tabs */}
        {showRightFade && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '40px',
              background: 'linear-gradient(to right, transparent, rgba(250, 248, 243, 0.95))',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}

        <Box
          ref={scrollRef}
          role="navigation"
          aria-label="page sections"
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            bgcolor: 'rgba(250, 248, 243, 0.95)',
            borderTop: '2px solid #e8e5df',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
            overflowX: 'auto',
            px: 1,
            py: 1,
            // safe area inset for notched iPhones
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
            // hide scrollbar
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {sectionMappings.map((section) => {
            const isActive = currentSection?.id === section.id
            return (
              <Box
                key={section.id}
                component="button"
                onClick={() => handleTabClick(section.physicalPage)}
                onKeyDown={handleKeyDown(() => handleTabClick(section.physicalPage))}
                aria-label={`jump to ${section.section}`}
                aria-current={isActive ? 'true' : undefined}
                sx={{
                  // reset button defaults
                  border: 'none',
                  font: 'inherit',
                  padding: 0,
                  minWidth: '60px',
                  height: '50px',
                  background: isActive
                    ? 'linear-gradient(180deg, #ec4899 0%, #f472b6 100%)'
                    : 'linear-gradient(180deg, #9333ea 0%, #a855f7 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive
                    ? '0 4px 12px rgba(236, 72, 153, 0.4)'
                    : '0 2px 8px rgba(147, 51, 234, 0.3)',
                  flexShrink: 0,
                  // scope hover to pointer devices only
                  '@media (hover: hover)': {
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isActive
                        ? '0 6px 16px rgba(236, 72, 153, 0.5)'
                        : '0 4px 12px rgba(147, 51, 234, 0.4)',
                    },
                  },
                  '&:focus-visible': {
                    outline: '2px solid #7e22ce',
                    outlineOffset: '2px',
                  },
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'lowercase',
                    userSelect: 'none',
                    textAlign: 'center',
                    px: 1,
                  }}
                >
                  {section.section}
                </Typography>
              </Box>
            )
          })}

          {/* resume button */}
          <Box
            component="button"
            onClick={handleResumeClick}
            onKeyDown={handleKeyDown(handleResumeClick)}
            aria-label="open resume"
            aria-pressed={state.resumeOpen ? 'true' : undefined}
            sx={{
              // reset button defaults
              border: 'none',
              font: 'inherit',
              padding: 0,
              minWidth: '60px',
              height: '50px',
              background: state.resumeOpen
                ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)'
                : 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              boxShadow: state.resumeOpen
                ? '0 4px 12px rgba(251, 191, 36, 0.4)'
                : '0 2px 8px rgba(245, 158, 11, 0.3)',
              flexShrink: 0,
              // scope hover to pointer devices only
              '@media (hover: hover)': {
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: state.resumeOpen
                    ? '0 6px 16px rgba(251, 191, 36, 0.5)'
                    : '0 4px 12px rgba(245, 158, 11, 0.4)',
                },
              },
              '&:focus-visible': {
                outline: '2px solid #d97706',
                outlineOffset: '2px',
              },
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'lowercase',
                userSelect: 'none',
                textAlign: 'center',
                px: 1,
              }}
            >
              resume
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
