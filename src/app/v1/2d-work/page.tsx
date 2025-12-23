'use client'

import { useState } from 'react'
import Box from '@mui/joy/Box'
import Container from '@mui/joy/Container'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import { GalleryGrid } from '@/components/GalleryGrid'
import { GalleryModal } from '@/components/GalleryModal'
import type { GalleryItem } from '@/types/gallery'

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Character Concept',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0000.png',
    thumbnail: '/output/frames/720p_s69_frame_0000.png',
  },
  {
    id: 2,
    title: 'Environment Sketch',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0001.png',
    thumbnail: '/output/frames/720p_s69_frame_0001.png',
  },
  {
    id: 3,
    title: 'Motion Graphics',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'video',
    src: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
    thumbnail: '/output/frames/720p_s69_frame_0002.png',
  },
  {
    id: 4,
    title: 'Prop Design',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0003.png',
    thumbnail: '/output/frames/720p_s69_frame_0003.png',
  },
  {
    id: 5,
    title: 'Storyboard Sequence',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/1080p_s52043_frame_0000.png',
    thumbnail: '/output/frames/1080p_s52043_frame_0000.png',
  },
  {
    id: 6,
    title: 'UI/UX Design',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/1080p_s52043_frame_0001.png',
    thumbnail: '/output/frames/1080p_s52043_frame_0001.png',
  },
]

export default function TwoDWork() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + galleryItems.length) % galleryItems.length)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % galleryItems.length)
    }
  }

  const selectedItem = selectedIndex !== null ? galleryItems[selectedIndex] : null

  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="lg" sx={{ px: 4, py: 6, textAlign: 'center' }}>
        <Stack spacing={2}>
          <Typography level="h2" sx={{ fontWeight: 700 }}>
            2D Work
          </Typography>
          <Typography level="title-lg" sx={{ maxWidth: 600, mx: 'auto' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Digital illustration,
            concept art, and motion graphics exploring color, composition, and visual storytelling.
          </Typography>
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ px: 4, pb: 8 }}>
        <GalleryGrid items={galleryItems} onItemClick={setSelectedIndex} />
      </Container>

      <GalleryModal
        open={selectedIndex !== null}
        item={selectedItem}
        onClose={() => setSelectedIndex(null)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </Box>
  )
}
