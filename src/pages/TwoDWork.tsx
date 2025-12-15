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
    title: 'Character Concept',
    description: 'Digital painting concept art',
    longDescription: 'Character design exploration focusing on silhouette and color. Created in Photoshop using custom brushes. The design process involved multiple iterations to find the right balance between appeal and functionality.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0000.png',
    thumbnail: '/output/frames/720p_s69_frame_0000.png',
  },
  {
    id: 2,
    title: 'Environment Sketch',
    description: 'Background illustration',
    longDescription: 'Atmospheric environment painting emphasizing depth and mood. Techniques include layering, color theory, and compositional rules of thirds. Created as part of a larger world-building project.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0001.png',
    thumbnail: '/output/frames/720p_s69_frame_0001.png',
  },
  {
    id: 3,
    title: 'Motion Graphics',
    description: '2D animation piece',
    longDescription: 'Frame-by-frame animation exploring movement and timing. Created in Adobe Animate with emphasis on squash and stretch principles. The piece demonstrates understanding of traditional animation fundamentals.',
    type: 'video',
    src: '/output/720p_animation.mp4',
    thumbnail: '/output/frames/720p_s69_frame_0002.png',
  },
  {
    id: 4,
    title: 'Prop Design',
    description: 'Item illustration series',
    longDescription: 'A collection of prop designs for game assets. Each piece is rendered with consistent lighting and style. Focus on readability and visual clarity at various scales.',
    type: 'image',
    src: '/output/frames/720p_s69_frame_0003.png',
    thumbnail: '/output/frames/720p_s69_frame_0003.png',
  },
  {
    id: 5,
    title: 'Storyboard Sequence',
    description: 'Sequential art panels',
    longDescription: 'Storyboard panels for an animated sequence. Demonstrates understanding of camera angles, shot composition, and visual storytelling. Created with digital ink and wash techniques.',
    type: 'image',
    src: '/output/frames/1080p_s52043_frame_0000.png',
    thumbnail: '/output/frames/1080p_s52043_frame_0000.png',
  },
  {
    id: 6,
    title: 'UI/UX Design',
    description: 'Interface mockup',
    longDescription: 'User interface design for a game menu system. Balances aesthetics with usability. Created in Figma with careful attention to user flow and interaction design principles.',
    type: 'image',
    src: '/output/frames/1080p_s52043_frame_0001.png',
    thumbnail: '/output/frames/1080p_s52043_frame_0001.png',
  },
]

export function TwoDWork() {
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
              2D Work
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
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
    </Fade>
  )
}
