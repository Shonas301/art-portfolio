'use client'

import { useRef } from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
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
              <img
                src={item.src}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </Box>
          <CardContent>
            <Typography level="title-md" sx={{ mb: 0.5 }}>
              {item.title}
            </Typography>
            <Typography level="body-sm">
              {item.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
