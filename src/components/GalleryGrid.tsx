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

// detect youtube urls so we don't try to play them in a native video element
const isYouTubeUrl = (url: string) =>
  url.includes('youtube.com') || url.includes('youtu.be')

interface GalleryGridProps {
  items: GalleryItem[]
  onItemClick: (index: number) => void
  onInfoClick?: (index: number) => void
}

// adaptive column layout — use 2 columns with larger cards for sparse sections
function getGridColumns(itemCount: number) {
  if (itemCount <= 2) {
    return {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(2, 1fr)',
      lg: 'repeat(2, 1fr)',
    }
  }
  return {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
  }
}

export function GalleryGrid({ items, onItemClick, onInfoClick }: GalleryGridProps) {
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})
  const isSparse = items.length <= 2

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(items.length),
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
              // taller aspect ratio for sparse grids to fill the space
              aspectRatio: isSparse ? '4/3' : '16/9',
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
            {item.type === 'video' && isYouTubeUrl(item.src) ? (
              // youtube urls can't be played in native video elements,
              // so show thumbnail with a play overlay that links out
              <Box
                component="a"
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                sx={{
                  display: 'block',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  priority={index < 3}
                />
                {/* play icon overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: 'white',
                      fontSize: '1.5rem',
                      lineHeight: 1,
                      ml: '3px', // optical centering for play triangle
                    }}
                  >
                    ▶
                  </Box>
                </Box>
              </Box>
            ) : item.type === 'video' ? (
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
                sizes="(max-width: 600px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
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
                  // increase touch target to 44px on mobile for WCAG compliance
                  minWidth: { xs: '44px', md: '32px' },
                  minHeight: { xs: '44px', md: '32px' },
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
