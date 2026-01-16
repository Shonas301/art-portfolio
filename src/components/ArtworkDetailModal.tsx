'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Chip from '@mui/joy/Chip'
import Divider from '@mui/joy/Divider'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import EmailIcon from '@mui/icons-material/Email'
import type { GalleryItem } from '@/types/gallery'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

// social share icon components (simple svg icons)
function PinterestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

interface ArtworkDetailModalProps {
  item: GalleryItem
  isOpen: boolean
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  currentIndex?: number
  totalItems?: number
}

export function ArtworkDetailModal({
  item,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  currentIndex,
  totalItems,
}: ArtworkDetailModalProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

  // handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          e.preventDefault()
          setIsZoomed(false)
          onPrevious?.()
          break
        case 'ArrowRight':
          e.preventDefault()
          setIsZoomed(false)
          onNext?.()
          break
      }
    },
    [isOpen, onClose, onPrevious, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ensure zoom resets on navigation
  const handlePreviousWithReset = useCallback(() => {
    setIsZoomed(false)
    onPrevious?.()
  }, [onPrevious])

  const handleNextWithReset = useCallback(() => {
    setIsZoomed(false)
    onNext?.()
  }, [onNext])

  // handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // handle zoom mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || item.type === 'video') return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  // generate share urls
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `check out "${item.title}" by christina shi`

  const shareUrls = {
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(item.src)}&description=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
  }

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              width: '100%',
              maxWidth: '1400px',
              maxHeight: '90vh',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* header with close button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'neutral.200',
              }}
            >
              <Typography
                level="h3"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 700,
                  color: '#000000',
                  textTransform: 'lowercase',
                }}
              >
                {item.title}
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
                aria-label="close modal"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* main content area */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
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
                  minHeight: { xs: '300px', md: '400px' },
                  maxHeight: { xs: '50vh', lg: '80vh' },
                }}
              >
                {/* navigation arrows */}
                {onPrevious && (
                  <IconButton
                    onClick={handlePreviousWithReset}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      zIndex: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: 'sm',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                    size="lg"
                    aria-label="previous artwork"
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                )}

                {/* zoom controls for images */}
                {item.type === 'image' && (
                  <IconButton
                    onClick={() => setIsZoomed(!isZoomed)}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: 'sm',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                    }}
                    size="md"
                    aria-label={isZoomed ? 'zoom out' : 'zoom in'}
                  >
                    {isZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                  </IconButton>
                )}

                {/* media display */}
                <Box
                  onMouseMove={handleMouseMove}
                  onClick={() => item.type === 'image' && setIsZoomed(!isZoomed)}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: item.type === 'image' ? (isZoomed ? 'zoom-out' : 'zoom-in') : 'default',
                    overflow: 'hidden',
                  }}
                >
                  {item.type === 'video' ? (
                    <Box
                      component="iframe"
                      src={getYouTubeEmbedUrl(item.src) ?? undefined}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        aspectRatio: '16/9',
                        maxWidth: '90vw',
                        maxHeight: '70vh',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: isZoomed ? 'visible' : 'hidden',
                      }}
                    >
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 70vw"
                        style={{
                          objectFit: 'contain',
                          transform: isZoomed ? 'scale(2)' : 'scale(1)',
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          transition: 'transform 0.3s ease',
                        }}
                        priority
                      />
                    </Box>
                  )}
                </Box>

                {onNext && (
                  <IconButton
                    onClick={handleNextWithReset}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      zIndex: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: 'sm',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'scale(1.1)',
                      },
                    }}
                    size="lg"
                    aria-label="next artwork"
                  >
                    <ChevronRightIcon />
                  </IconButton>
                )}
              </Box>

              {/* details panel */}
              <Box
                sx={{
                  width: { xs: '100%', lg: '380px' },
                  p: 3,
                  borderLeft: { lg: '1px solid' },
                  borderColor: 'neutral.200',
                  overflow: 'auto',
                }}
              >
                <Stack spacing={3}>
                  {/* description */}
                  <Box>
                    <Typography
                      level="body-lg"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        color: '#262626',
                        lineHeight: 1.7,
                      }}
                    >
                      {item.longDescription || item.description}
                    </Typography>
                  </Box>

                  {/* artwork details */}
                  {(item.materials || item.dimensions || item.year) && (
                    <Box>
                      <Typography
                        level="title-sm"
                        sx={{
                          color: '#737373',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          mb: 1,
                        }}
                      >
                        details
                      </Typography>
                      <Stack spacing={1}>
                        {item.year && (
                          <Typography level="body-sm" sx={{ color: '#525252' }}>
                            <strong>year:</strong> {item.year}
                          </Typography>
                        )}
                        {item.materials && (
                          <Typography level="body-sm" sx={{ color: '#525252' }}>
                            <strong>materials:</strong> {item.materials}
                          </Typography>
                        )}
                        {item.dimensions && (
                          <Typography level="body-sm" sx={{ color: '#525252' }}>
                            <strong>dimensions:</strong> {item.dimensions}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {/* for sale section */}
                  {item.isForSale && (
                    <Box>
                      <Divider sx={{ my: 1 }} />
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        {item.priceRange && (
                          <Chip
                            size="lg"
                            variant="soft"
                            color="success"
                            sx={{
                              alignSelf: 'flex-start',
                              fontWeight: 600,
                            }}
                          >
                            {item.priceRange}
                          </Chip>
                        )}
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                          <Button
                            variant="solid"
                            startDecorator={<EmailIcon />}
                            sx={{
                              bgcolor: '#9333ea',
                              '&:hover': {
                                bgcolor: '#7e22ce',
                              },
                            }}
                            component="a"
                            href={`mailto:christina@example.com?subject=Inquiry about "${item.title}"&body=Hi, I'm interested in learning more about "${item.title}".`}
                          >
                            inquire about this piece
                          </Button>
                          {item.shopUrl && (
                            <Button
                              variant="outlined"
                              startDecorator={<ShoppingCartIcon />}
                              component="a"
                              href={item.shopUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                borderColor: '#9333ea',
                                color: '#9333ea',
                                '&:hover': {
                                  bgcolor: 'rgba(147, 51, 234, 0.1)',
                                },
                              }}
                            >
                              view in shop
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  )}

                  <Divider />

                  {/* social sharing */}
                  <Box>
                    <Typography
                      level="title-sm"
                      sx={{
                        color: '#737373',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        mb: 1.5,
                      }}
                    >
                      share
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleShare('pinterest')}
                        sx={{
                          bgcolor: '#E60023',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#c5001f',
                          },
                        }}
                        size="sm"
                        aria-label="share on pinterest"
                      >
                        <PinterestIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleShare('twitter')}
                        sx={{
                          bgcolor: '#000000',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#262626',
                          },
                        }}
                        size="sm"
                        aria-label="share on x (twitter)"
                      >
                        <TwitterIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleShare('facebook')}
                        sx={{
                          bgcolor: '#1877F2',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#0c5dc7',
                          },
                        }}
                        size="sm"
                        aria-label="share on facebook"
                      >
                        <FacebookIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* pagination indicator */}
                  {currentIndex !== undefined && totalItems !== undefined && (
                    <Typography
                      level="body-sm"
                      sx={{
                        color: '#a3a3a3',
                        textAlign: 'center',
                        pt: 1,
                      }}
                    >
                      {currentIndex + 1} / {totalItems}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
