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
    title: 'Animated Scene 1',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'video',
    src: '/output/720p_animation.mp4',
    thumbnail: '/output/frames/720p_s69_frame_0000.png',
  },
  {
    id: 2,
    title: 'Character Design',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0001.png',
    thumbnail: '/output/frames/720p_s69_frame_0001.png',
  },
  {
    id: 3,
    title: 'Environment Study',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0002.png',
    thumbnail: '/output/frames/720p_s69_frame_0002.png',
  },
  {
    id: 4,
    title: 'Abstract Animation',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0003.png',
    thumbnail: '/output/frames/720p_s69_frame_0003.png',
  },
  {
    id: 5,
    title: 'Product Visualization',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/1080p_s52043_frame_0000.png',
    thumbnail: '/output/frames/1080p_s52043_frame_0000.png',
  },
  {
    id: 6,
    title: 'Concept Sculpture',
    description: 'Lorem ipsum dolor sit amet.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: 'image',
    src: '/output/frames/1080p_s52043_frame_0001.png',
    thumbnail: '/output/frames/1080p_s52043_frame_0001.png',
  },
]

export function ThreeDWork() {
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
            3D Work
          </Typography>
          <Typography level="title-lg" >
            I work primarily in Maya but also love working in Blender and Unreal Engine!
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
