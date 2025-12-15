'use client'

import Box from '@mui/joy/Box'
import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Card from '@mui/joy/Card'
import Stack from '@mui/joy/Stack'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { GalleryItem } from '@/types/gallery'

interface GalleryModalProps {
  open: boolean
  item: GalleryItem | null
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export function GalleryModal({ open, item, onClose, onPrevious, onNext }: GalleryModalProps) {
  if (!item) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '85vw',
          height: '85vh',
          outline: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ModalClose
          variant="plain"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
          }}
        />

        <Box sx={{ display: 'flex', height: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* media section with carousel navigation */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'neutral.50',
              minHeight: { xs: '300px', md: '500px' },
              overflow: 'hidden',
            }}
          >
            {/* left navigation arrow */}
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
                transition: 'all 0.2s',
              }}
              size="lg"
            >
              <ChevronLeftIcon />
            </IconButton>

            {/* media */}
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
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </Box>

            {/* right navigation arrow */}
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
                transition: 'all 0.2s',
              }}
              size="lg"
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* text section */}
          <Box
            sx={{
              width: { xs: '100%', md: '350px' },
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflowY: 'auto',
            }}
          >
            <Stack spacing={2}>
              <Typography level="h3" sx={{ fontWeight: 700 }}>
                {item.title}
              </Typography>
              <Typography level="body-md" sx={{ lineHeight: 1.8 }}>
                {item.longDescription}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Card>
    </Modal>
  )
}
