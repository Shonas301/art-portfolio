'use client'

import { ReactNode } from 'react'
import Box from '@mui/joy/Box'

export interface PageProps {
  children: ReactNode
  isActive?: boolean
  showEdge?: boolean
  edgeOffset?: number
  zIndex?: number
}

export function Page({
  children,
  showEdge = false,
  edgeOffset = 0,
  zIndex = 1
}: PageProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#faf8f3',
        // paper texture using CSS gradient
        backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
          linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        boxShadow: showEdge
          ? '-5px 0 15px rgba(0,0,0,0.3)'
          : '-5px 0 15px rgba(0,0,0,0.2)',
        borderRadius: '8px',
        zIndex,
        overflow: 'hidden',
        transform: showEdge ? `translateX(${edgeOffset}px)` : 'none',
      }}
    >
      {/* visible page edge for stacked pages */}
      {showEdge && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '8px',
            background: '#e8e5df',
            boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.1)',
          }}
        />
      )}

      {/* content area */}
      <Box
        sx={{
          p: { xs: 4, md: 6, lg: 8 },
          height: '100%',
          overflow: 'auto',
          // custom scrollbar styling
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
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#b0aca4',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
