import { useRef } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'

const codeProjects = [
  {
    id: 1,
    title: 'Physics Simulation',
    description: 'A custom physics engine built in Python for real-time particle simulations. Implements collision detection, gravity, and environmental forces. Used in several animation projects to create realistic movement.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'left' as const,
  },
  {
    id: 2,
    title: 'Animation Pipeline Tool',
    description: 'Maya plugin developed to streamline the animation workflow. Automates repetitive tasks, manages scene organization, and provides batch processing capabilities. Written in Python using Maya\'s API.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'right' as const,
  },
  {
    id: 3,
    title: 'Procedural Generation System',
    description: 'Houdini-based tool for generating procedural environments. Uses noise functions and algorithmic approaches to create varied, natural-looking landscapes. Highly customizable with exposed parameters for art direction.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'left' as const,
  },
  {
    id: 4,
    title: 'Game Logic Framework',
    description: 'Unreal Engine blueprint system for interactive installations. Handles user input, state management, and real-time rendering. Designed for modularity and reusability across different projects.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'right' as const,
  },
]

export function Code() {
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  return (
    <Fade in timeout={600}>
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="lg" sx={{ px: 4, py: 6, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Scripts and Game Logic
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Combining technical expertise
              with creative problem-solving to build tools and systems that enhance the artistic process.
            </Typography>
          </Stack>
        </Container>

        <Container maxWidth="lg" sx={{ px: 4, py: 4 }}>
          <Stack spacing={8}>
            {codeProjects.map((project) => (
              <Stack
                key={project.id}
                direction={{ xs: 'column', md: project.videoPosition === 'right' ? 'row-reverse' : 'row' }}
                spacing={4}
                alignItems="center"
              >
                <Box sx={{ width: { xs: '100%', md: '66%' }, flexShrink: 0 }}>
                  <Box
                    sx={{
                      aspectRatio: '16/9',
                      bgcolor: 'grey.200',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                    onMouseEnter={() => {
                      if (videoRefs.current[project.id]) {
                        videoRefs.current[project.id]?.play()
                      }
                    }}
                    onMouseLeave={() => {
                      if (videoRefs.current[project.id]) {
                        videoRefs.current[project.id]?.pause()
                      }
                    }}
                  >
                    <Box
                      component="video"
                      ref={(el: HTMLVideoElement | null) => {
                        videoRefs.current[project.id] = el
                      }}
                      muted
                      loop
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      src={project.video}
                    >
                      Your browser does not support the video tag.
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={2}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                      {project.description}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>
    </Fade>
  )
}
