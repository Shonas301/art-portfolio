import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'

export function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* hero section */}
      <Fade in timeout={800}>
        <Container maxWidth="lg" sx={{ px: 8, py: 8, textAlign: 'center' }}>
          <Typography
            variant="h1"
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
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Hello! I'm a 3D artist based in NYC. I combine my background in tech and
            software engineering with my love of art and animation to create beautiful
            things!
          </Typography>
        </Container>
      </Fade>

      {/* demo reel section */}
      <Fade in timeout={1000}>
        <Container maxWidth="lg" sx={{ px: 8, py: 8 }}>
          <Stack spacing={4} alignItems="center">
            <Typography
              variant="h2"
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
            <Paper
              elevation={6}
              sx={{
                width: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                aspectRatio: '16/9',
              }}
            >
              <Box
                component="video"
                controls
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
                src="/output/720p_animation.mp4"
              >
                Your browser does not support the video tag.
              </Box>
            </Paper>
            <Button
              component={Link}
              to="/demo-reel"
              variant="contained"
              size="large"
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
      </Fade>

      {/* pandy series section */}
      <Fade in timeout={1200}>
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
                variant="h2"
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
              <Paper
                elevation={8}
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  aspectRatio: '16/9',
                  border: '4px solid',
                  borderColor: '#ec4899',
                }}
              >
                <Box
                  component="video"
                  controls
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                  }}
                  src="/output/720p_animation.mp4"
                >
                  Your browser does not support the video tag.
                </Box>
              </Paper>
              <Button
                component={Link}
                to="/pandy-series"
                variant="contained"
                size="large"
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
      </Fade>
    </Box>
  )
}
