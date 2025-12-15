import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'

export function DemoReel() {
  return (
    <Fade in timeout={600}>
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="lg" sx={{ px: 8, py: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, textAlign: 'center' }}>
            3D Generalist Reel
          </Typography>
        </Container>

        <Container maxWidth="lg" sx={{ px: 8, mb: 4 }}>
          <Paper
            elevation={6}
            sx={{
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
        </Container>

        <Container maxWidth="lg" sx={{ px: 8, py: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Reel Breakdown
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
              eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
              qui ratione voluptatem sequi nesciunt.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Fade>
  )
}
