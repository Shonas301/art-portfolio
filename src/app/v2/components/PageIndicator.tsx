'use client'

import { useMemo } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import { AnimatePresence, motion } from 'framer-motion'
import { useFlipBook } from '../context/FlipBookContext'
import { getSectionAtPage, sectionMappings } from '../data/portfolio-content'

export function PageIndicator() {
  const { state } = useFlipBook()

  const isAnimating = state.isFlipping || state.isRiffling

  const currentSection = useMemo(
    () => getSectionAtPage(state.currentPageIndex),
    [state.currentPageIndex]
  )

  // find the index of the current section within sectionMappings
  const sectionIndex = useMemo(() => {
    if (!currentSection) return -1
    return sectionMappings.findIndex((s) => s.id === currentSection.id)
  }, [currentSection])

  const totalSections = sectionMappings.length

  return (
    <AnimatePresence mode="wait">
      {!isAnimating && (
        <motion.div
          key={currentSection?.id ?? `page-${state.currentPageIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              userSelect: 'none',
            }}
          >
            {currentSection ? (
              <>
                <Typography
                  level="body-xs"
                  sx={{
                    color: '#737373',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                >
                  {currentSection.section}
                </Typography>
                {/* dot indicators */}
                <Box aria-hidden="true" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {sectionMappings.map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: i === sectionIndex ? 6 : 4,
                        height: i === sectionIndex ? 6 : 4,
                        borderRadius: '50%',
                        backgroundColor: i === sectionIndex ? '#525252' : '#d4d4d4',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  level="body-xs"
                  sx={{
                    color: '#525252',
                    fontSize: '0.7rem',
                  }}
                >
                  {sectionIndex + 1} / {totalSections}
                </Typography>
              </>
            ) : (
              <Typography
                level="body-xs"
                sx={{
                  color: '#525252',
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                }}
              >
                between sections · page {state.currentPageIndex + 1}
              </Typography>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
