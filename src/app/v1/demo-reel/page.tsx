import type { Metadata } from 'next'
import Box from '@mui/joy/Box'
import Container from '@mui/joy/Container'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'

export const metadata: Metadata = {
  title: 'demo reel - christina shi',
  description: '3d generalist reel showcasing animation and modeling work',
}

export default function DemoReel() {
  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="lg" sx={{ px: 8, py: 4 }}>
        <Typography level="h2" sx={{ fontWeight: 700, textAlign: 'center' }}>
          3D Generalist Reel
        </Typography>
      </Container>

      <Container maxWidth="lg" sx={{ px: 8, mb: 4 }}>
        <Sheet
          variant="outlined"
          sx={{
            borderRadius: 'lg',
            overflow: 'hidden',
            aspectRatio: '16/9',
            boxShadow: 'lg',
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
            src="/output/web_optimized.mp4"
          >
            Your browser does not support the video tag.
          </Box>
        </Sheet>
      </Container>

      <Container maxWidth="lg" sx={{ px: 8, py: 4 }}>
        <Typography level="h3" sx={{ fontWeight: 700, mb: 3 }}>
          Reel Breakdown
        </Typography>
        <Stack spacing={2}>
          <Typography level="body-lg" sx={{ lineHeight: 1.8 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Typography>
          <Typography level="body-lg" sx={{ lineHeight: 1.8 }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
          <Typography level="body-lg" sx={{ lineHeight: 1.8 }}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </Typography>
          <Typography level="body-lg" sx={{ lineHeight: 1.8 }}>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
            qui ratione voluptatem sequi nesciunt.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
