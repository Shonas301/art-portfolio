'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'

export function CloudBackground() {
  // pause animation when document is hidden (tab switch, minimize)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPaused(document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: `linear-gradient(135deg,
            #fdf2f8 0%,
            #fae8ff 20%,
            #ddd6fe 40%,
            #bfdbfe 60%,
            #e0e7ff 80%,
            #fdf2f8 100%
          )`,
          backgroundSize: '200% 200%',
          animation: 'cloudMove 20s ease infinite',
          animationPlayState: paused ? 'paused' : 'running',
          '@keyframes cloudMove': {
            '0%, 100%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
          },
          // respect reduced motion preference
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
      />

      {/* artist name — own stacking context above flipped pages (z-index 100 in book) */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 20, md: 32 },
          left: { xs: 20, md: 40 },
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 700,
            background: 'linear-gradient(90deg, #7e22ce 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'lowercase',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          christina shi
        </Typography>
      </Box>
    </>
  )
}
