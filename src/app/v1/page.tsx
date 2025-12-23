'use client'

import Link from 'next/link'
import Box from '@mui/joy/Box'
import Container from '@mui/joy/Container'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'

export default function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* hero section */}
      <Container maxWidth="lg" sx={{ px: 8, py: 8, textAlign: 'center' }}>
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(90deg, #7e22ce 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Christina Shi
          <br />
          3D Artist
        </Typography>
        <Typography
          level="title-lg"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.7,
          }}
        >
          Hello! I&apos;m a 3D artist based in NYC. I combine my background in tech and
          software engineering with my love of art and animation to create beautiful
          things!
        </Typography>
      </Container>

      {/* demo reel section */}
      <Container maxWidth="lg" sx={{ px: 8, py: 8 }}>
        <Stack spacing={4} alignItems="center">
          <Typography
            level="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DEMO REEL
          </Typography>
          <Sheet
            variant="outlined"
            sx={{
              width: '100%',
              borderRadius: 'lg',
              overflow: 'hidden',
              aspectRatio: '16/9',
              boxShadow: 'lg',
            }}
          >
            <Box
              component="iframe"
              src="https://www.youtube.com/embed/bdrST1IbN3k"
              title="Demo Reel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                width: '100%',
                height: '100%',
                display: 'block',
                border: 'none',
              }}
            />
          </Sheet>
          <Button
            component={Link}
            href="/v1/demo-reel"
            variant="solid"
            size="lg"
            sx={{
              fontSize: '1.25rem',
              px: 6,
              py: 2,
              background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #7e22ce 0%, #db2777 100%)',
              },
            }}
          >
            Learn more - reel breakdown
          </Button>
        </Stack>
      </Container>

      {/* pandy series section */}
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #f3e8ff 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="lg" sx={{ px: 8 }}>
          <Stack spacing={4} alignItems="center">
            <Typography
              level="h2"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Pandy Series
            </Typography>
            <Sheet
              variant="outlined"
              sx={{
                width: '100%',
                borderRadius: 'lg',
                overflow: 'hidden',
                aspectRatio: '16/9',
                border: '4px solid',
                borderColor: '#ec4899',
                boxShadow: 'lg',
              }}
            >
              <Box
                component="iframe"
                src="https://www.youtube.com/embed/bdrST1IbN3k"
                title="Pandy Series"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  border: 'none',
                }}
              />
            </Sheet>
            <Button
              component={Link}
              href="/v1/pandy-series"
              variant="solid"
              size="lg"
              sx={{
                fontSize: '1.25rem',
                px: 6,
                py: 2,
                background: 'linear-gradient(90deg, #fbbf24 0%, #ec4899 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #f59e0b 0%, #db2777 100%)',
                },
              }}
            >
              See more Pandy
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
