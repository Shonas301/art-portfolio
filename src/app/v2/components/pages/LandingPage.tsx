'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import { motion, AnimatePresence } from 'framer-motion'
import type { LandingData } from '../../data/portfolio-content'

interface LandingPageProps {
  title: string
  data: LandingData
}

export function LandingPage({ title, data }: LandingPageProps) {
  // start false to match SSR, hydrate safely before showing hint
  const [showHint, setShowHint] = useState(false)
  const wasShown = useRef(false)

  // check sessionStorage on mount — avoids SSR/client mismatch
  useEffect(() => {
    const dismissed = sessionStorage.getItem('flipbook-hint-dismissed')
    if (!dismissed) {
      setShowHint(true) // eslint-disable-line react-hooks/set-state-in-effect
      wasShown.current = true
    }
  }, [])

  const dismissHint = useCallback(() => {
    setShowHint(false)
    // only persist if hint was actually shown this session
    if (wasShown.current) {
      sessionStorage.setItem('flipbook-hint-dismissed', 'true')
    }
  }, [])

  // fade out after 5 seconds
  useEffect(() => {
    if (!showHint) return
    const timer = setTimeout(dismissHint, 5000)
    return () => clearTimeout(timer)
  }, [showHint, dismissHint])

  // dismiss on any user interaction
  useEffect(() => {
    if (!showHint) return
    window.addEventListener('keydown', dismissHint, { once: true })
    window.addEventListener('pointerdown', dismissHint, { once: true })
    return () => {
      window.removeEventListener('keydown', dismissHint)
      window.removeEventListener('pointerdown', dismissHint)
    }
  }, [showHint, dismissHint])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <Typography
        level="h1"
        sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
          fontWeight: 700,
          color: '#000000',
          mb: 2,
          lineHeight: 1.2,
          textTransform: 'lowercase',
        }}
      >
        {title}
      </Typography>
      {data.subtitle && (
        <Typography
          level="h3"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 500,
            color: '#262626',
            textTransform: 'lowercase',
          }}
        >
          {data.subtitle}
        </Typography>
      )}

      {/* interaction hint - fades out after timeout or first interaction */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: '2rem' }}
          >
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  color: 'rgba(147, 51, 234, 0.55)',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  userSelect: 'none',
                }}
              >
                use arrow keys or swipe to explore →
              </Typography>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
