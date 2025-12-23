'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import { useFlipBook } from '../context/FlipBookContext'
import { sectionMappings } from '../data/portfolio-content'

export function MobileNav() {
  const { state, dispatch } = useFlipBook()

  const handleTabClick = (physicalPage: number) => {
    if (physicalPage === state.currentPageIndex) return
    dispatch({ type: 'FLIP_TO_PAGE', payload: physicalPage })
  }

  const handleResumeClick = () => {
    dispatch({ type: 'OPEN_RESUME' })
  }

  // find which section the current page belongs to (or is closest to)
  const currentSection = sectionMappings.reduce((closest, section) => {
    if (section.physicalPage <= state.currentPageIndex) {
      if (!closest || section.physicalPage > closest.physicalPage) {
        return section
      }
    }
    return closest
  }, null as typeof sectionMappings[0] | null)

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'flex', md: 'none' },
        justifyContent: 'space-around',
        alignItems: 'center',
        bgcolor: 'rgba(250, 248, 243, 0.95)',
        borderTop: '2px solid #e8e5df',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        overflowX: 'auto',
        px: 1,
        py: 1,
      }}
    >
      {sectionMappings.map((section) => {
        const isActive = currentSection?.id === section.id
        return (
          <Box
            key={section.id}
            onClick={() => handleTabClick(section.physicalPage)}
            sx={{
              minWidth: '60px',
              height: '50px',
              background: isActive
                ? 'linear-gradient(180deg, #ec4899 0%, #f472b6 100%)'
                : 'linear-gradient(180deg, #9333ea 0%, #a855f7 100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              boxShadow: isActive
                ? '0 4px 12px rgba(236, 72, 153, 0.4)'
                : '0 2px 8px rgba(147, 51, 234, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isActive
                  ? '0 6px 16px rgba(236, 72, 153, 0.5)'
                  : '0 4px 12px rgba(147, 51, 234, 0.4)',
              },
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'lowercase',
                userSelect: 'none',
                textAlign: 'center',
                px: 1,
              }}
            >
              {section.section}
            </Typography>
          </Box>
        )
      })}

      {/* resume button */}
      <Box
        onClick={handleResumeClick}
        sx={{
          minWidth: '60px',
          height: '50px',
          background: state.resumeOpen
            ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)'
            : 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          boxShadow: state.resumeOpen
            ? '0 4px 12px rgba(251, 191, 36, 0.4)'
            : '0 2px 8px rgba(245, 158, 11, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: state.resumeOpen
              ? '0 6px 16px rgba(251, 191, 36, 0.5)'
              : '0 4px 12px rgba(245, 158, 11, 0.4)',
          },
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'lowercase',
            userSelect: 'none',
            textAlign: 'center',
            px: 1,
          }}
        >
          resume
        </Typography>
      </Box>
    </Box>
  )
}
