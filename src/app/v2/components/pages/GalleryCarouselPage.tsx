'use client'

import Image from 'next/image'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Stack from '@mui/joy/Stack'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { GalleryData } from '../../data/portfolio-content'

interface GalleryCarouselPageProps {
  title: string
  data: GalleryData
  selectedIndex: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export function GalleryCarouselPage({
  title,
  data,
  selectedIndex,
  onClose,
  onPrevious,
  onNext,
}: GalleryCarouselPageProps) {
  const item = data.items[selectedIndex]

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* header with close button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          level="h2"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 700,
            color: '#000000',
            textTransform: 'lowercase',
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="lg"
          sx={{
            bgcolor: '#ec4899',
            color: 'white',
            '&:hover': {
              bgcolor: '#db2777',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* carousel content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* media section */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'neutral.50',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* navigation arrows */}
          <IconButton
            onClick={onPrevious}
            sx={{
              position: 'absolute',
              left: 16,
              zIndex: 2,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.1)',
              },
            }}
            size="lg"
          >
            <ChevronLeftIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              p: 2,
            }}
          >
            {item.type === 'video' ? (
              <video
                controls
                autoPlay
                loop
                preload="auto"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              >
                <source src={item.src} type="video/mp4" />
              </video>
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 85vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            )}
          </Box>

          <IconButton
            onClick={onNext}
            sx={{
              position: 'absolute',
              right: 16,
              zIndex: 2,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.1)',
              },
            }}
            size="lg"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* text section */}
        <Box
          sx={{
            width: { xs: '100%', md: '300px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Stack spacing={2}>
            <Typography
              level="h3"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 700,
                color: '#000000',
              }}
            >
              {item.title}
            </Typography>
            <Typography
              level="body-md"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: '#262626',
                lineHeight: 1.7,
              }}
            >
              {item.longDescription}
            </Typography>
            <Typography
              level="body-sm"
              sx={{
                fontSize: '1rem',
                color: '#737373',
              }}
            >
              {selectedIndex + 1} / {data.items.length}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
