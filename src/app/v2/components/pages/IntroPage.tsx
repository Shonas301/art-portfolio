'use client'

import Image from 'next/image'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import type { IntroData } from '../../data/portfolio-content'

interface IntroPageProps {
  title: string
  data: IntroData
}

export function IntroPage({ title, data }: IntroPageProps) {
  return (
    <Stack spacing={4} sx={{ height: '100%' }}>
      <Typography
        level="h2"
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 700,
          color: '#000000',
          textTransform: 'lowercase',
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'center',
        }}
      >
        {/* headshot */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: '200px', md: '250px' },
            height: { xs: '200px', md: '250px' },
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '4px solid #9333ea',
            boxShadow: '0 8px 24px rgba(147, 51, 234, 0.2)',
          }}
        >
          <Image
            src={data.headshot}
            alt={data.name}
            fill
            sizes="(max-width: 768px) 200px, 250px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>

        {/* bio */}
        <Box sx={{ flex: 1 }}>
          <Typography
            level="h3"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 600,
              color: '#000000',
              mb: 2,
              textTransform: 'lowercase',
            }}
          >
            {data.name}
          </Typography>
          <Typography
            level="body-lg"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: '#262626',
              lineHeight: 1.7,
            }}
          >
            {data.bio}
          </Typography>
        </Box>
      </Box>
    </Stack>
  )
}
