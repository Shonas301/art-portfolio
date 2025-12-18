'use client'

import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'
import { pageContent } from '../data/portfolio-content'

export function FlippedPagesStack() {
  const { state } = useFlipBook()

  // show pages that have been flipped past (0 to currentPageIndex-1)
  const flippedPageCount = state.currentPageIndex

  console.log('[LEFT_STACK] Rendering with', flippedPageCount, 'flipped pages')

  // don't render if no pages flipped yet
  if (flippedPageCount === 0) {
    console.log('[LEFT_STACK] No pages to render yet')
    return null
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
        zIndex: 8, // above page stack but below flipping page
      }}
    >
      {/* render stacked flipped pages on the left */}
      {Array.from({ length: flippedPageCount }, (_, i) => {
        const pageIndex = i
        const stackPosition = i + 1 // how deep in the stack (1 = oldest/deepest)
        const isTopPage = i === flippedPageCount - 1

        return (
          <Box
            key={`flipped-${pageIndex}`}
            sx={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center', // spine edge (left side of page)
              // rotate pages past -90 degrees (-95 to -100) like being held back
              // NEGATIVE rotateY with left origin swings right edge to the LEFT
              transform: `
                rotateY(${-95 - stackPosition * 0.5}deg)
                rotateX(${5 - stackPosition * 0.3}deg)
                translateX(${-stackPosition * 1.5}px)
              `,
              backgroundColor: '#faf8f3',
              backgroundImage: `
                linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              boxShadow: isTopPage
                ? '8px 0 25px rgba(0,0,0,0.4), -3px 0 10px rgba(0,0,0,0.2)'
                : '5px 0 15px rgba(0,0,0,0.25)',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.1)',
              opacity: Math.max(0.7, 1 - (stackPosition * 0.04)),
            }}
          >
            {/* visible page edge */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '12px',
                background: 'linear-gradient(90deg, #d8d5cf 0%, #e8e5df 100%)',
                boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.15)',
                borderRadius: '8px 0 0 8px',
              }}
            />

            {/* DEBUG: bright marker to see where pages are */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                background: isTopPage ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.3)',
                border: '3px solid red',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 3px black',
              }}
            >
              {pageIndex}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
