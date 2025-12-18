'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import { useFlipBook } from '../context/FlipBookContext'
import { pageContent } from '../data/portfolio-content'

export function BinderTabs() {
  const { state, dispatch } = useFlipBook()

  const handleTabClick = (pageIndex: number) => {
    if (state.debugMode) {
      console.log('[TAB] Clicked:', pageIndex, 'Current:', state.currentPageIndex)
    }

    if (pageIndex === state.currentPageIndex) {
      if (state.debugMode) console.log('[TAB] Same page, ignoring')
      return
    }

    if (state.debugMode) console.log('[TAB] Dispatching flip to page:', pageIndex)
    dispatch({ type: 'FLIP_TO_PAGE', payload: pageIndex })
  }

  const handleResumeClick = () => {
    dispatch({ type: 'OPEN_RESUME' })
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: '10%',
        height: '80%',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      {pageContent.map((page, index) => {
        const isActive = state.currentPageIndex === index
        const isPastPage = index < state.currentPageIndex
        const isFuturePage = index > state.currentPageIndex

        // calculate depth offset
        // future pages (in the stack) should be offset based on their distance
        // past pages should be flush with the edge (they've been flipped past)
        const depthOffset = isFuturePage
          ? (index - state.currentPageIndex) * 6 // matches page edge offset
          : 0

        return (
          <Box
            key={page.id}
            onClick={() => handleTabClick(index)}
            sx={{
              // thin post-it style tab
              width: '140px',
              height: '28px',
              background: isActive
                ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                : isPastPage
                  ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
                  : 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '12px',
              borderRadius: '4px 0 0 4px',
              transition: 'all 0.3s ease',
              boxShadow: isActive
                ? '-3px 2px 8px rgba(236, 72, 153, 0.4)'
                : `-2px 1px 6px rgba(147, 51, 234, ${0.3 - (depthOffset * 0.02)})`,
              pointerEvents: 'auto',
              // position based on depth in stack
              transform: `translateX(-${depthOffset}px)`,
              opacity: isFuturePage ? Math.max(0.7, 1 - (depthOffset * 0.025)) : 1,
              // add slight paper texture
              backgroundImage: `
                linear-gradient(135deg, ${isActive ? '#ec4899' : isPastPage ? '#6366f1' : '#9333ea'} 0%, ${isActive ? '#f472b6' : isPastPage ? '#818cf8' : '#a855f7'} 100%),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)
              `,
              // subtle fold effect at the edge
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
                pointerEvents: 'none',
              },
              '&:hover': {
                width: '150px',
                boxShadow: isActive
                  ? '-4px 3px 12px rgba(236, 72, 153, 0.5)'
                  : `-3px 2px 10px rgba(147, 51, 234, 0.4)`,
                opacity: 1,
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
                letterSpacing: '0.02em',
              }}
            >
              {page.section}
            </Typography>
          </Box>
        )
      })}

      {/* resume tab - special behavior */}
      <Box
        onClick={handleResumeClick}
        sx={{
          width: '140px',
          height: '28px',
          background: state.resumeOpen
            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '12px',
          borderRadius: '4px 0 0 4px',
          transition: 'all 0.3s ease',
          boxShadow: state.resumeOpen
            ? '-3px 2px 8px rgba(251, 191, 36, 0.4)'
            : '-2px 1px 6px rgba(245, 158, 11, 0.3)',
          pointerEvents: 'auto',
          backgroundImage: `
            linear-gradient(135deg, ${state.resumeOpen ? '#fbbf24' : '#f59e0b'} 0%, ${state.resumeOpen ? '#f59e0b' : '#d97706'} 100%),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)
          `,
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
            pointerEvents: 'none',
          },
          '&:hover': {
            width: '150px',
            boxShadow: state.resumeOpen
              ? '-4px 3px 12px rgba(251, 191, 36, 0.5)'
              : '-3px 2px 10px rgba(245, 158, 11, 0.4)',
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
            letterSpacing: '0.02em',
          }}
        >
          resume
        </Typography>
      </Box>
    </Box>
  )
}
