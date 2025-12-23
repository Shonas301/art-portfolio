'use client'

import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'
import {
  TOTAL_PAGES,
  sectionMappings,
  pageContent,
} from '../data/portfolio-content'
import { LandingPage } from './pages/LandingPage'
import { IntroPage } from './pages/IntroPage'
import { GalleryGridPage } from './pages/GalleryGridPage'
import { CodePage } from './pages/CodePage'
import { ContactPage } from './pages/ContactPage'
import type { LandingData, IntroData, GalleryData, CodeData, ContactData } from '../data/portfolio-content'

const Z_LAYERS = {
  UNFLIPPED_STACK_BASE: 500,
  CURRENT_PAGE: 600,
} as const

const sectionToContentIndex: Record<string, number> = {
  'landing': 0,
  'intro': 1,
  '3d-work': 2,
  '2d-work': 3,
  'code': 4,
  'pandy-series': 5,
  'contact': 6,
}

function renderPageContent(physicalPage: number) {
  const section = sectionMappings.find(s => s.physicalPage === physicalPage)

  if (!section) {
    return null
  }

  const contentIndex = sectionToContentIndex[section.id]
  const content = pageContent[contentIndex]

  switch (content.type) {
    case 'landing':
      return <LandingPage title={content.title} data={content.data as LandingData} />
    case 'intro':
      return <IntroPage title={content.title} data={content.data as IntroData} />
    case 'gallery':
      return <GalleryGridPage title={content.title} data={content.data as GalleryData} />
    case 'code':
      return <CodePage title={content.title} data={content.data as CodeData} />
    case 'contact':
      return <ContactPage title={content.title} data={content.data as ContactData} />
    default:
      return null
  }
}

export function PageStack() {
  const { state } = useFlipBook()
  const { currentPageIndex } = state

  const pagesAhead = TOTAL_PAGES - currentPageIndex - 1

  return (
    <>
      {Array.from({ length: pagesAhead }, (_, i) => {
        const physicalPage = currentPageIndex + 1 + i
        const distanceFromCurrent = i + 1
        const edgeOffset = Math.min(distanceFromCurrent * 1.5, 40)

        if (distanceFromCurrent > 30) return null

        return (
          <Box
            key={`page-${physicalPage}`}
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#faf8f3',
              backgroundImage: `
                linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              zIndex: Z_LAYERS.UNFLIPPED_STACK_BASE - distanceFromCurrent,
              transform: `translateX(${edgeOffset}px)`,
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                background: 'linear-gradient(90deg, #e8e5df 0%, #d8d5cf 100%)',
                boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.08)',
              },
            }}
          />
        )
      })}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#faf8f3',
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
          borderRadius: '8px',
          zIndex: Z_LAYERS.CURRENT_PAGE,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: { xs: 4, md: 6, lg: 8 },
            height: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1efe8',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c8c4bc',
              borderRadius: '4px',
            },
          }}
        >
          {renderPageContent(currentPageIndex)}
        </Box>
      </Box>
    </>
  )
}
