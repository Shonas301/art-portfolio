import type { Metadata } from 'next'
import Box from '@mui/joy/Box'
import Container from '@mui/joy/Container'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'

export const metadata: Metadata = {
  title: 'pandy series - christina shi',
  description: 'character-driven animation series',
}

const videoContent = [
  {
    id: 1,
    src: 'https://www.youtube.com/embed/bdrST1IbN3k',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 2,
    src: 'https://www.youtube.com/embed/bdrST1IbN3k',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 3,
    src: 'https://www.youtube.com/embed/bdrST1IbN3k',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

export default function PandySeries() {
  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="md" sx={{ px: 4, py: 6 }}>
        <Stack spacing={3}>
          <Typography level="h2" sx={{ fontWeight: 700 }}>
            Pandy Series
          </Typography>
          <Typography level="body-lg" sx={{ lineHeight: 1.8 }}>
            The Pandy Series was inspired by a desire to create joyful, character-driven animation that brings
            smiles to viewers of all ages. Drawing from my background in both technical animation and storytelling,
            each episode combines hand-crafted animation with thoughtful narratives. The series explores themes of
            friendship, discovery, and the simple pleasures of everyday adventures.
          </Typography>
        </Stack>
      </Container>

        <Container maxWidth="lg" sx={{ px: 4, py: 4 }}>
          <Stack spacing={6}>
            {videoContent.map((item) => (
              <Stack
                key={item.id}
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                alignItems="center"
              >
                <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                  <Box
                    sx={{
                      aspectRatio: '9/16',
                      bgcolor: 'grey.200',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="iframe"
                      src={item.src}
                      title={`Pandy Series Episode ${item.id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography level="body-md" sx={{ lineHeight: 1.8 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Container>
    </Box>
  )
}
