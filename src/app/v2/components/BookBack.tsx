'use client'

import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'
import { AdminLogin } from './AdminLogin'
import { AdminDashboard } from './AdminDashboard'

export function BookBack() {
  const { state } = useFlipBook()

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {state.adminAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </Box>
  )
}
