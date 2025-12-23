'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Chip from '@mui/joy/Chip'
import type { CodeData } from '../../data/portfolio-content'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

interface CodePageProps {
  title: string
  data: CodeData
}

export function CodePage({ title, data }: CodePageProps) {
  return (
    <Stack spacing={3} sx={{ height: '100%' }}>
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

      <Typography
        level="body-lg"
        sx={{
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          color: '#262626',
        }}
      >
        {data.description}
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Stack spacing={4}>
          {data.projects.map((project, index) => (
            <Card
              key={project.id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                gap: 3,
                p: 3,
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  aspectRatio: '16/9',
                  bgcolor: 'neutral.100',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="iframe"
                  src={getYouTubeEmbedUrl(project.videoSrc) ?? undefined}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </Box>

              <CardContent sx={{ flex: 1, justifyContent: 'center' }}>
                <Typography
                  level="h3"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.75rem' },
                    fontWeight: 700,
                    color: '#000000',
                    mb: 1,
                    textTransform: 'lowercase',
                  }}
                >
                  {project.title}
                </Typography>
                <Typography
                  level="body-md"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    color: '#262626',
                    mb: 2,
                  }}
                >
                  {project.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {project.technologies.map((tech) => (
                    <Chip
                      key={tech}
                      size="lg"
                      sx={{
                        bgcolor: '#e9d5ff',
                        color: '#6b21a8',
                        fontWeight: 600,
                      }}
                    >
                      {tech}
                    </Chip>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}
