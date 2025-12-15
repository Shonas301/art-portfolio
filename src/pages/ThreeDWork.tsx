import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import { GalleryGrid } from '@/components/GalleryGrid'
import { GalleryModal } from '@/components/GalleryModal'
import type { GalleryItem } from '@/types/gallery'

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Animated Scene 1',
    description: 'Beautiful 3D animated scene',
    longDescription: 'This is a detailed 3D animation created in Maya. The piece showcases advanced lighting techniques and particle effects. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    type: 'video',
    src: '/output/720p_animation.mp4',
    thumbnail: '/output/frames/720p_s69_frame_0000.png',
  },
  {
    id: 2,
    title: 'Character Design',
    description: 'Stylized character model',
    longDescription: 'A fully rigged character model with custom shaders and textures. Created using Maya and textured in Substance Painter. Sed do eiusmod tempor incididunt ut labore.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0001.png',
    thumbnail: '/output/frames/720p_s69_frame_0001.png',
  },
  {
    id: 3,
    title: 'Environment Study',
    description: 'Detailed environment render',
    longDescription: 'An atmospheric environment piece focusing on composition and mood. Built in Blender with procedural textures. Ut enim ad minim veniam, quis nostrud exercitation.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0002.png',
    thumbnail: '/output/frames/720p_s69_frame_0002.png',
  },
  {
    id: 4,
    title: 'Abstract Animation',
    description: 'Motion graphics piece',
    longDescription: 'Abstract motion graphics exploring shape and movement. Created using Houdini for procedural generation. Duis aute irure dolor in reprehenderit in voluptate.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0003.png',
    thumbnail: '/output/frames/720p_s69_frame_0003.png',
  },
  {
    id: 5,
    title: 'Product Visualization',
    description: 'Commercial product render',
    longDescription: 'High-quality product visualization for commercial use. Rendered in Arnold with photorealistic materials. Excepteur sint occaecat cupidatat non proident.',
    type: 'image',
    src: '/output/frames/1080p_s52043_frame_0000.png',
    thumbnail: '/output/frames/1080p_s52043_frame_0000.png',
  },
  {
    id: 6,
    title: 'Concept Sculpture',
    description: 'Digital sculpture study',
    longDescription: 'A digital sculpture created in ZBrush, retopologized in Maya. Focus on form and silhouette. Sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
    <Fade in timeout={600}>
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="lg" sx={{ px: 4, py: 6, textAlign: 'center' }}>
          <Stack spacing={2}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              3D Work
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
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
    </Fade>
  )
}
