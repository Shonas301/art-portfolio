'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'

export function CloudBackground() {
  return (
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
        '@keyframes cloudMove': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
      }}
    >
      {/* artist name on background */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 20, md: 32 },
          left: { xs: 20, md: 40 },
          zIndex: 1,
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
    </Box>
  )
}
