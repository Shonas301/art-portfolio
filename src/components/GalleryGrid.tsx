import { useRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import type { GalleryItem } from '@/types/gallery'

interface GalleryGridProps {
  items: GalleryItem[]
  onItemClick: (index: number) => void
}

export function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
        gap: 3,
      }}
    >
      {items.map((item, index) => (
        <Card
          key={item.id}
          onClick={() => onItemClick(index)}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '16/9',
              bgcolor: 'grey.200',
              overflow: 'hidden',
            }}
            onMouseEnter={() => {
              if (item.type === 'video' && videoRefs.current[item.id]) {
                videoRefs.current[item.id]?.play()
              }
            }}
            onMouseLeave={() => {
              if (item.type === 'video' && videoRefs.current[item.id]) {
                videoRefs.current[item.id]?.pause()
              }
            }}
          >
            {item.type === 'video' ? (
              <video
                ref={(el) => {
                  videoRefs.current[item.id] = el
                }}
                muted
                loop
                poster={item.thumbnail}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <source src={item.src} type="video/mp4" />
              </video>
            ) : (
              <CardMedia
                component="img"
                image={item.src}
                alt={item.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </Box>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
