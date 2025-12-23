'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import BugReportIcon from '@mui/icons-material/BugReport'
import AccessibilityIcon from '@mui/icons-material/Accessibility'
import { useFlipBook } from '../context/FlipBookContext'

export function DebugOverlay() {
  const { state, dispatch } = useFlipBook()
  const [isMounted, setIsMounted] = useState(false)
  const [perfMetrics, setPerfMetrics] = useState({
    lastFlipDuration: 0,
    avgFlipDuration: 0,
    flipCount: 0,
  })
  const [flipStartTime, setFlipStartTime] = useState<number | null>(null)

  // ensure component only renders on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  // track flip performance
  useEffect(() => {
    if (!isMounted) return

    if (state.isFlipping && flipStartTime === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFlipStartTime(performance.now())
    } else if (!state.isFlipping && flipStartTime !== null) {
      const duration = performance.now() - flipStartTime
      setPerfMetrics((prev) => {
        const newCount = prev.flipCount + 1
        const newAvg = (prev.avgFlipDuration * prev.flipCount + duration) / newCount
        return {
          lastFlipDuration: duration,
          avgFlipDuration: newAvg,
          flipCount: newCount,
        }
      })
      setFlipStartTime(null)
      if (state.debugMode) {
        console.log(`[PERF] Flip completed in ${duration.toFixed(2)}ms`)
      }
    }
  }, [state.isFlipping, flipStartTime, state.debugMode, isMounted])

  // don't render anything on server to avoid hydration mismatch
  if (!isMounted) {
    return null
  }

  if (!state.debugMode) {
    // show minimal debug controls when debug mode is off
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 10000,
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          onClick={() => dispatch({ type: 'TOGGLE_DEBUG_MODE' })}
          sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
        >
          <BugReportIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="sm"
          variant="soft"
          color={state.prefersReducedMotion ? 'success' : 'neutral'}
          onClick={() => dispatch({ type: 'TOGGLE_REDUCED_MOTION' })}
          sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
        >
          <AccessibilityIcon fontSize="small" />
        </IconButton>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 10000,
        bgcolor: 'rgba(0, 0, 0, 0.85)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        p: 2,
        borderRadius: '8px',
        minWidth: '300px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 255, 0, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography level="title-sm" sx={{ color: '#00ff00', fontFamily: 'monospace' }}>
          debug overlay
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="sm"
            variant="soft"
            color={state.prefersReducedMotion ? 'success' : 'neutral'}
            onClick={() => dispatch({ type: 'TOGGLE_REDUCED_MOTION' })}
            title="Toggle reduced motion"
          >
            <AccessibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="sm"
            variant="soft"
            onClick={() => dispatch({ type: 'TOGGLE_DEBUG_MODE' })}
            title="Close debug overlay"
          >
            <BugReportIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>current page:</span>
          <span style={{ color: '#ffff00' }}>{state.currentPageIndex}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>target page:</span>
          <span style={{ color: '#ffff00' }}>{state.targetPageIndex ?? 'null'}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>is flipping:</span>
          <span style={{ color: state.isFlipping ? '#ff0000' : '#00ff00' }}>
            {state.isFlipping ? 'TRUE' : 'FALSE'}
          </span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>is riffling:</span>
          <span style={{ color: state.isRiffling ? '#ff0000' : '#00ff00' }}>
            {state.isRiffling ? 'TRUE' : 'FALSE'}
          </span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>view mode:</span>
          <span style={{ color: '#00ffff' }}>{state.viewMode}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>reduced motion:</span>
          <span style={{ color: state.prefersReducedMotion ? '#ffff00' : '#888' }}>
            {state.prefersReducedMotion ? 'ENABLED' : 'disabled'}
          </span>
        </Box>

        <Box sx={{ borderTop: '1px solid rgba(0, 255, 0, 0.3)', mt: 1, pt: 1 }}>
          <Typography level="body-xs" sx={{ color: '#00ff00', mb: 0.5, fontFamily: 'monospace' }}>
            performance metrics
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>last flip:</span>
            <span style={{ color: '#ff00ff' }}>{perfMetrics.lastFlipDuration.toFixed(2)}ms</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>avg flip:</span>
            <span style={{ color: '#ff00ff' }}>{perfMetrics.avgFlipDuration.toFixed(2)}ms</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>total flips:</span>
            <span style={{ color: '#ff00ff' }}>{perfMetrics.flipCount}</span>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
