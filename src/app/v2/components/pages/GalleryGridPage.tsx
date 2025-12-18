'use client'

import { useState, useRef, useCallback } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import IconButton from '@mui/joy/IconButton'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel'
import { GalleryGrid } from '@/components/GalleryGrid'
import type { GalleryData } from '../../data/portfolio-content'
import { useFlipBook } from '../../context/FlipBookContext'
import { GalleryCarouselPage } from './GalleryCarouselPage'

interface GalleryGridPageProps {
  title: string
  data: GalleryData
}

export function GalleryGridPage({ title, data }: GalleryGridPageProps) {
  const { state, dispatch } = useFlipBook()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // calculate which item is at the top of the visible area
  const getTopVisibleIndex = useCallback(() => {
    if (!scrollContainerRef.current) return 0

    const container = scrollContainerRef.current
    const scrollTop = container.scrollTop

    // estimate items per row based on container width
    // grid uses: xs: 1, md: 2, lg: 3 columns
    const containerWidth = container.clientWidth
    let itemsPerRow = 1
    if (containerWidth >= 1024) {
      itemsPerRow = 3
    } else if (containerWidth >= 768) {
      itemsPerRow = 2
    }

    // estimate item height (16:9 aspect ratio + card content)
    // this is approximate, but good enough for our purpose
    const estimatedItemHeight = (containerWidth / itemsPerRow) * (9 / 16) + 100 // +100 for card content and gap

    // calculate which row is visible
    const topVisibleRow = Math.floor(scrollTop / estimatedItemHeight)

    // return first item in that row
    return Math.min(topVisibleRow * itemsPerRow, data.items.length - 1)
  }, [data.items.length])

  const handleItemClick = (index: number) => {
    setSelectedIndex(index)
    dispatch({ type: 'SET_VIEW_MODE', payload: 'carousel' })
  }

  const handleToggleView = () => {
    if (state.viewMode === 'grid') {
      // switching to carousel - select top visible item
      const topIndex = getTopVisibleIndex()
      setSelectedIndex(topIndex)
      dispatch({ type: 'SET_VIEW_MODE', payload: 'carousel' })
    } else {
      // switching to grid
      setSelectedIndex(null)
      dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })
    }
  }

  const handleCloseCarousel = () => {
    setSelectedIndex(null)
    dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })
  }

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + data.items.length) % data.items.length)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % data.items.length)
    }
  }

  // show carousel view if in carousel mode
  if (state.viewMode === 'carousel' && selectedIndex !== null) {
    return (
      <GalleryCarouselPage
        title={title}
        data={data}
        selectedIndex={selectedIndex}
        onClose={handleCloseCarousel}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    )
  }

  // default grid view
  return (
    <Stack spacing={3} sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

        <IconButton
          onClick={handleToggleView}
          size="lg"
          sx={{
            bgcolor: '#9333ea',
            color: 'white',
            '&:hover': {
              bgcolor: '#7e22ce',
            },
          }}
        >
          {state.viewMode === 'grid' ? <ViewCarouselIcon /> : <GridViewIcon />}
        </IconButton>
      </Box>

      <Typography
        level="body-lg"
        sx={{
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          color: '#262626',
        }}
      >
        {data.description}
      </Typography>

      <Box ref={scrollContainerRef} sx={{ flex: 1, overflow: 'auto' }}>
        <GalleryGrid items={data.items} onItemClick={handleItemClick} />
      </Box>
    </Stack>
  )
}
