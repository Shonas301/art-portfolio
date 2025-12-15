'use client'

import { useRef } from 'react'
import Box from '@mui/joy/Box'
import Container from '@mui/joy/Container'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'

const codeProjects = [
  {
    id: 1,
    title: 'Physics Simulation',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'left' as const,
  },
  {
    id: 2,
    title: 'Animation Pipeline Tool',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'right' as const,
  },
  {
    id: 3,
    title: 'Procedural Generation System',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'left' as const,
  },
  {
    id: 4,
    title: 'Game Logic Framework',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    video: '/output/720p_animation.mp4',
    videoPosition: 'right' as const,
  },
]

export default function Code() {
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="lg" sx={{ px: 4, py: 6, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <Typography level="h2" sx={{ fontWeight: 700 }}>
            Scripts and Game Logic
          </Typography>
          <Typography level="title-lg" sx={{ maxWidth: 600 }}>
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
                    <Typography level="h4" sx={{ fontWeight: 700 }}>
                      {project.title}
                    </Typography>
                    <Typography level="body-md" sx={{ lineHeight: 1.8 }}>
                      {project.description}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Container>
    </Box>
  )
}
