import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
        {/* left side - media */}
        <Box
          sx={{
            flex: 1,
            bgcolor: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              mb: 2,
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

          {/* navigation buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={onPrevious}
              startIcon={<ChevronLeftIcon />}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={onNext}
              endIcon={<ChevronRightIcon />}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
            >
              Next
            </Button>
          </Box>
        </Box>

        {/* right side - info */}
        <Box
          sx={{
            width: 400,
            bgcolor: 'white',
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {item.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {item.longDescription}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  )
}
