import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'

const videoContent = [
  {
    id: 1,
    src: '/output/720p_animation.mp4',
    description: 'The first episode introduces Pandy and their whimsical world. Through careful animation and storytelling, we explore themes of curiosity and wonder. The character design emphasizes soft shapes and vibrant colors to create an inviting atmosphere.',
  },
  {
    id: 2,
    src: '/output/720p_animation.mp4',
    description: 'Episode two delves deeper into Pandy\'s adventures. The animation focuses on fluid movement and expressive character acting. Special attention was paid to timing and spacing to enhance the comedic moments.',
  },
  {
    id: 3,
    src: '/output/720p_animation.mp4',
    description: 'The third installment showcases advanced lighting techniques and environmental storytelling. Each frame is carefully composed to guide the viewer\'s eye and maintain visual interest throughout the sequence.',
  },
]

export function PandySeries() {
  return (
    <Fade in timeout={600}>
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="md" sx={{ px: 4, py: 6 }}>
          <Stack spacing={3}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Pandy Series
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', color: 'text.secondary', lineHeight: 1.8 }}>
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
                      component="video"
                      controls
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      src={item.src}
                    >
                      Your browser does not support the video tag.
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>
    </Fade>
  )
}
