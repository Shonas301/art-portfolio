'use client'

import { memo, useMemo, useState, useEffect } from 'react'
import Box from '@mui/joy/Box'
import CircularProgress from '@mui/joy/CircularProgress'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlipBook } from '../context/FlipBookContext'
import {
  TOTAL_PAGES,
  sectionMappings,
  pageContent as staticContent,
} from '../data/portfolio-content'
import { fetchAllPageContentClient } from '@/lib/content/dynamic-content'
import { ErrorBoundary } from './ErrorBoundary'
import { LandingPage } from './pages/LandingPage'
import { IntroPage } from './pages/IntroPage'
import { GalleryGridPage } from './pages/GalleryGridPage'
import { CodePage } from './pages/CodePage'
import { ContactPage } from './pages/ContactPage'
import type { PageContent, LandingData, IntroData, GalleryData, CodeData, ContactData } from '../data/portfolio-content'

const Z_LAYERS = {
  UNFLIPPED_STACK_BASE: 500,
  CURRENT_PAGE: 600,
} as const

// max visible edge pages — deeper ones are fully occluded
const MAX_VISIBLE_EDGES = 12

const sectionToContentIndex: Record<string, number> = {
  'landing': 0,
  'intro': 1,
  '3d-work': 2,
  '2d-work': 3,
  'code': 4,
  'pandy-series': 5,
  'contact': 6,
}

function renderPageContent(physicalPage: number, content: PageContent[]) {
  const section = sectionMappings.find(s => s.physicalPage === physicalPage)

  if (!section) {
    // blank page — show subtle page number
    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          color: '#d4d4d4',
          fontSize: '0.7rem',
          userSelect: 'none',
        }}
      >
        {physicalPage + 1}
      </Box>
    )
  }

  const contentIndex = sectionToContentIndex[section.id]
  const pageData = content[contentIndex]

  if (!pageData) return null

  switch (pageData.type) {
    case 'landing':
      return <LandingPage title={pageData.title} data={pageData.data as LandingData} />
    case 'intro':
      return <IntroPage title={pageData.title} data={pageData.data as IntroData} />
    case 'gallery':
      return <GalleryGridPage title={pageData.title} data={pageData.data as GalleryData} />
    case 'code':
      return <CodePage title={pageData.title} data={pageData.data as CodeData} />
    case 'contact':
      return <ContactPage title={pageData.title} data={pageData.data as ContactData} />
    default:
      return null
  }
}

export const PageStack = memo(function PageStack() {
  const { state } = useFlipBook()
  const { currentPageIndex, prefersReducedMotion } = state

  // start with static content, replace with dynamic on fetch
  const [content, setContent] = useState<PageContent[]>(staticContent)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchAllPageContentClient()
      .then(data => {
        if (!cancelled) {
          setContent(data)
        }
      })
      .catch(err => {
        console.error('failed to load dynamic content, using static fallback:', err)
      })
      .finally(() => {
        if (!cancelled) {
          setIsFetching(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const pagesAhead = TOTAL_PAGES - currentPageIndex - 1

  // memoize edge elements — only recompute when currentPageIndex changes
  const edgeElements = useMemo(() => {
    const visibleCount = Math.min(pagesAhead, MAX_VISIBLE_EDGES)

    return Array.from({ length: visibleCount }, (_, i) => {
      const physicalPage = currentPageIndex + 1 + i
      const distanceFromCurrent = i + 1
      const edgeOffset = Math.min(distanceFromCurrent * 1.5, 40)

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
    })
  }, [currentPageIndex, pagesAhead])

  // entrance animation variants — subtle fade-in after page flip
  const contentVariants = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }

  return (
    <>
      {edgeElements}

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
            position: 'relative',
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
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPageIndex}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                {renderPageContent(currentPageIndex, content)}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>

          {/* subtle loading indicator while supabase data loads */}
          {isFetching && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: 0.5,
              }}
            >
              <CircularProgress
                size="sm"
                sx={{
                  '--CircularProgress-trackColor': 'rgba(0,0,0,0.05)',
                  '--CircularProgress-progressColor': '#c8c4bc',
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
})
