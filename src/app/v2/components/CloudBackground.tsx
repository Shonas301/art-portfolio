'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'

export function CloudBackground() {
  // body bg in globals.css provides the flat cream shell — no backdrop Box needed
  return (
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
          color: '#111827',
          textTransform: 'lowercase',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        christina shi
      </Typography>
    </Box>
  )
}
