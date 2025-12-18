'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import type { LandingData } from '../../data/portfolio-content'

interface LandingPageProps {
  title: string
  data: LandingData
}

export function LandingPage({ title, data }: LandingPageProps) {
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
    </Box>
  )
}
