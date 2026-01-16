'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Chip from '@mui/joy/Chip'
import InfoIcon from '@mui/icons-material/Info'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import type { GalleryItem } from '@/types/gallery'

interface GalleryGridProps {
  items: GalleryItem[]
  onItemClick: (index: number) => void
  onInfoClick?: (index: number) => void
}

export function GalleryGrid({ items, onItemClick, onInfoClick }: GalleryGridProps) {
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
                preload="none"
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
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                loading={index < 3 ? 'eager' : 'lazy'}
                priority={index < 3}
              />
            )}
            {/* for sale badge */}
            {item.isForSale && (
              <Chip
                size="sm"
                variant="solid"
                startDecorator={<LocalMallIcon sx={{ fontSize: 14 }} />}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: '#16a34a',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {item.priceRange || 'for sale'}
              </Chip>
            )}
          </Box>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography level="title-md" sx={{ mb: 0.5 }}>
                {item.title}
              </Typography>
              <Typography level="body-sm">
                {item.description}
              </Typography>
            </Box>
            {onInfoClick && (
              <IconButton
                size="sm"
                variant="soft"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  onInfoClick(index)
                }}
                aria-label={`view details for ${item.title}`}
                sx={{
                  ml: 1,
                  flexShrink: 0,
                  bgcolor: '#9333ea',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#7e22ce',
                  },
                }}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
