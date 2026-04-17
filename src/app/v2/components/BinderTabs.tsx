'use client'

import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Tooltip from '@mui/joy/Tooltip'
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

  const handleKeyDown = (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
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
        // hide on mobile — small colored slivers leak at viewport edge
        display: { xs: 'none', md: 'block' },
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

        // tab sticks out from the page edge with subtle depth cue
        const pageEdgeOffset = isBehind ? 0 : Math.min(depthInStack * 0.5, 8)

        // vertical position - spread tabs across height
        const posIndex = sectionMappings.findIndex(s => s.id === section.id)
        const totalTabs = sectionMappings.length
        const verticalPercent = 12 + (posIndex * (76 / (totalTabs - 1))) // 12% to 88%

        // consistent tab width regardless of depth
        const tabWidth = 100

        // opacity - flipped tabs are ghosted, deeper tabs fade slightly
        const tabOpacity = isBehind ? 0.35 : isCurrent ? 1 : Math.max(0.7, 1 - depthInStack * 0.015)

        return (
          <Tooltip
            key={section.id}
            title={`jump to ${section.section}`}
            placement="left"
            arrow
          >
            <Box
              component="button"
              onClick={() => handleTabClick(physicalPage)}
              onKeyDown={handleKeyDown(() => handleTabClick(physicalPage))}
              aria-label={`jump to ${section.section}`}
              aria-current={isActive ? 'true' : undefined}
              sx={{
                // reset button defaults
                border: 'none',
                font: 'inherit',
                padding: 0,
                position: 'absolute',
                right: 0,
                top: `${verticalPercent}%`,
                transform: `translateX(calc(100% + ${pageEdgeOffset}px)) translateY(-50%)`,
                width: `${tabWidth}px`,
                height: '32px',
                background: isBehind
                  ? '#d6d2c8' // chrome-behind neutral for flipped
                  : isActive
                    ? '#b45309' // amber accent — WCAG AA white text
                    : '#e8e5df', // neutral chrome
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '10px',
                borderRadius: '0 6px 6px 0',
                transition: 'box-shadow 0.25s ease, opacity 0.25s ease, width 0.25s ease',
                boxShadow: isBehind
                  ? '1px 1px 4px rgba(0, 0, 0, 0.05)'
                  : isActive
                    ? '3px 2px 10px rgba(180, 83, 9, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : `2px 2px 8px rgba(0, 0, 0, ${0.08 - depthInStack * 0.002})`,
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
                    ? 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, transparent 100%)'
                    : 'linear-gradient(90deg, rgba(0,0,0,0.12) 0%, transparent 100%)',
                  borderRadius: '0 0 0 0',
                },
                // scope hover to pointer devices only
                '@media (hover: hover)': {
                  '&:hover': {
                    width: `${tabWidth + 12}px`,
                    boxShadow: isBehind
                      ? '2px 2px 8px rgba(0, 0, 0, 0.1)'
                      : isActive
                        ? '4px 3px 14px rgba(180, 83, 9, 0.5)'
                        : '3px 3px 12px rgba(0, 0, 0, 0.15)',
                    opacity: isBehind ? 0.6 : 1,
                  },
                },
                '&:focus-visible': {
                  outline: '2px solid #b45309',
                  outlineOffset: '2px',
                },
              }}
            >
              <Typography
                sx={{
                  color: isActive ? 'white' : isBehind ? '#737373' : '#1c1917',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'lowercase',
                  userSelect: 'none',
                  letterSpacing: '0.03em',
                  textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.25)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {section.section}
              </Typography>
            </Box>
          </Tooltip>
        )
      })}

      {/* resume tab - special, always visible at bottom */}
      <Tooltip title="open resume" placement="left" arrow>
        <Box
          component="button"
          onClick={handleResumeClick}
          onKeyDown={handleKeyDown(handleResumeClick)}
          aria-label="open resume"
          aria-pressed={state.resumeOpen ? 'true' : undefined}
          sx={{
            // reset button defaults
            border: 'none',
            font: 'inherit',
            padding: 0,
            position: 'absolute',
            right: 0,
            bottom: '8%',
            transform: 'translateX(100%)',
            width: '100px',
            height: '32px',
            background: '#b45309', // amber accent, flat
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '10px',
            borderRadius: '0 6px 6px 0',
            transition: 'box-shadow 0.25s ease, width 0.25s ease, opacity 0.25s ease',
            boxShadow: state.resumeOpen
              ? '3px 2px 10px rgba(180, 83, 9, 0.45)'
              : '2px 2px 8px rgba(180, 83, 9, 0.3)',
            pointerEvents: 'auto',
            opacity: state.resumeOpen ? 1 : 0.9,
            zIndex: TOTAL_PAGES + 10,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
            },
            // scope hover to pointer devices only
            '@media (hover: hover)': {
              '&:hover': {
                width: '112px',
                opacity: 1,
                boxShadow: '4px 3px 14px rgba(180, 83, 9, 0.5)',
              },
            },
            '&:focus-visible': {
              outline: '2px solid #b45309',
              outlineOffset: '2px',
            },
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'lowercase',
              userSelect: 'none',
              letterSpacing: '0.03em',
              textShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
          >
            resume
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  )
}
