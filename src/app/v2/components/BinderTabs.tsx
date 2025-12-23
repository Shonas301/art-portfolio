'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import { useFlipBook } from '../context/FlipBookContext'
import { sectionMappings, TOTAL_PAGES } from '../data/portfolio-content'

export function BinderTabs() {
  const { state, dispatch } = useFlipBook()

  const handleTabClick = (physicalPage: number) => {
    if (physicalPage === state.currentPageIndex) return
    dispatch({ type: 'FLIP_TO_PAGE', payload: physicalPage })
  }

  const handleResumeClick = () => {
    dispatch({ type: 'OPEN_RESUME' })
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 0, // tabs extend beyond this
        zIndex: 2000,
        pointerEvents: 'none',
      }}
    >
      {sectionMappings.map((section) => {
        const { physicalPage } = section
        const isActive = state.currentPageIndex === physicalPage

        const isBehind = physicalPage < state.currentPageIndex
        const isCurrent = physicalPage === state.currentPageIndex

        // calculate position in the stack (how deep this page is)
        const pagesFromCurrent = Math.abs(physicalPage - state.currentPageIndex)
        const depthInStack = isBehind ? 0 : pagesFromCurrent

        // tab sticks out from the page edge
        // depth affects how far right the tab appears (follows page edge offset)
        const pageEdgeOffset = isBehind ? 0 : Math.min(depthInStack * 1.5, 40)

        // vertical position - spread tabs across height, adjusted by page position
        // tabs should be at consistent vertical positions relative to book
        const tabIndex = sectionMappings.findIndex(s => s.id === section.id)
        const totalTabs = sectionMappings.length
        const verticalPercent = 12 + (tabIndex * (76 / (totalTabs - 1))) // 12% to 88%

        // tab width - slightly shorter for deeper pages
        const tabWidth = isBehind ? 100 : 100 - depthInStack * 0.8

        // opacity - flipped tabs are ghosted, deeper tabs fade slightly
        const tabOpacity = isBehind ? 0.35 : isCurrent ? 1 : Math.max(0.7, 1 - depthInStack * 0.015)

        return (
          <Box
            key={section.id}
            onClick={() => handleTabClick(physicalPage)}
            sx={{
              position: 'absolute',
              right: 0,
              top: `${verticalPercent}%`,
              transform: `translateX(calc(100% + ${pageEdgeOffset}px)) translateY(-50%)`,
              width: `${tabWidth}px`,
              height: '32px',
              background: isBehind
                ? 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)' // lighter/desaturated for flipped
                : isActive
                  ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                  : 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '10px',
              borderRadius: '0 6px 6px 0',
              transition: 'all 0.25s ease',
              boxShadow: isBehind
                ? '1px 1px 4px rgba(147, 51, 234, 0.15)'
                : isActive
                  ? '3px 2px 10px rgba(236, 72, 153, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                  : `2px 2px 8px rgba(147, 51, 234, ${0.35 - depthInStack * 0.008})`,
              pointerEvents: 'auto',
              opacity: tabOpacity,
              zIndex: isBehind ? 1 : TOTAL_PAGES - physicalPage,
              // left edge connects to page
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: isBehind
                  ? 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
                borderRadius: '0 0 0 0',
              },
              '&:hover': {
                width: `${tabWidth + 12}px`,
                boxShadow: isBehind
                  ? '2px 2px 8px rgba(147, 51, 234, 0.3)'
                  : isActive
                    ? '4px 3px 14px rgba(236, 72, 153, 0.6)'
                    : '3px 3px 12px rgba(147, 51, 234, 0.5)',
                opacity: isBehind ? 0.6 : 1,
              },
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '0.72rem',
                textTransform: 'lowercase',
                userSelect: 'none',
                letterSpacing: '0.03em',
                textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                whiteSpace: 'nowrap',
              }}
            >
              {section.section}
            </Typography>
          </Box>
        )
      })}

      {/* resume tab - special, always visible at bottom */}
      <Box
        onClick={handleResumeClick}
        sx={{
          position: 'absolute',
          right: 0,
          bottom: '8%',
          transform: 'translateX(100%)',
          width: '100px',
          height: '32px',
          background: state.resumeOpen
            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '10px',
          borderRadius: '0 6px 6px 0',
          transition: 'all 0.25s ease',
          boxShadow: state.resumeOpen
            ? '3px 2px 10px rgba(251, 191, 36, 0.5)'
            : '2px 2px 8px rgba(245, 158, 11, 0.35)',
          pointerEvents: 'auto',
          zIndex: TOTAL_PAGES + 10,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.12) 0%, transparent 100%)',
          },
          '&:hover': {
            width: '112px',
            boxShadow: state.resumeOpen
              ? '4px 3px 14px rgba(251, 191, 36, 0.6)'
              : '3px 3px 12px rgba(245, 158, 11, 0.5)',
          },
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontWeight: 600,
            fontSize: '0.72rem',
            textTransform: 'lowercase',
            userSelect: 'none',
            letterSpacing: '0.03em',
            textShadow: '0 1px 2px rgba(0,0,0,0.25)',
          }}
        >
          resume
        </Typography>
      </Box>
    </Box>
  )
}
