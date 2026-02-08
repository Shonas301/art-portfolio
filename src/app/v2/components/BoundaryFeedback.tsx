'use client'

import { useEffect } from 'react'
import { motion, useAnimate, AnimatePresence } from 'framer-motion'
import Box from '@mui/joy/Box'
import { useFlipBook } from '../context/FlipBookContext'

export function BoundaryFeedback() {
  const { state, dispatch } = useFlipBook()
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (!state.boundaryHit) return
    if (!scope.current) return
    let cancelled = false

    // run a brief shake animation then clear boundary
    animate(scope.current, { x: [-3, 3, -2, 2, 0] }, { duration: 0.4 }).then(() => {
      if (!cancelled) dispatch({ type: 'CLEAR_BOUNDARY' })
    })

    // fallback: clear after 600ms regardless
    const timeout = setTimeout(() => {
      if (!cancelled) dispatch({ type: 'CLEAR_BOUNDARY' })
    }, 600)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [state.boundaryHit, animate, scope, dispatch])

  return (
    <AnimatePresence>
      {state.boundaryHit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            width: '4px',
            ...(state.boundaryHit === 'start' ? { left: 0 } : { right: 0 }),
            zIndex: 9999,
          }}
        >
          <Box
            ref={scope}
            sx={{
              width: '100%',
              height: '100%',
              background: state.boundaryHit === 'start'
                ? 'linear-gradient(90deg, rgba(236, 72, 153, 0.6), transparent)'
                : 'linear-gradient(270deg, rgba(236, 72, 153, 0.6), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
