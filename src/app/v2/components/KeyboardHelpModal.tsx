'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import CloseIcon from '@mui/icons-material/Close'

interface KeyboardHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { keys: ['←'], description: 'turn page backward' },
  { keys: ['→'], description: 'turn page forward' },
  { keys: ['Page Up'], description: 'jump to previous section' },
  { keys: ['Page Down'], description: 'jump to next section' },
  { keys: ['Home'], description: 'jump to first page' },
  { keys: ['End'], description: 'jump to last content page' },
  { keys: ['?'], description: 'toggle this help panel' },
  { keys: ['Escape'], description: 'close modals' },
]

export function KeyboardHelpModal({ isOpen, onClose }: KeyboardHelpModalProps) {
  // close on escape key press
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
            }}
          />

          {/* modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10001,
              width: '90%',
              maxWidth: '420px',
            }}
          >
            <Box
              role="dialog"
              aria-modal="true"
              aria-label="keyboard shortcuts"
              sx={{
                backgroundColor: '#faf8f3',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                p: { xs: 3, md: 4 },
                position: 'relative',
              }}
            >
              {/* header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  level="h3"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 700,
                    color: '#000000',
                    textTransform: 'lowercase',
                  }}
                >
                  keyboard shortcuts
                </Typography>
                <IconButton
                  onClick={onClose}
                  size="sm"
                  sx={{
                    bgcolor: '#ec4899',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#db2777',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* shortcut list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {shortcuts.map((shortcut) => (
                  <Box
                    key={shortcut.description}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.5, minWidth: '100px', justifyContent: 'flex-end' }}>
                      {shortcut.keys.map((key) => (
                        <Box
                          key={key}
                          component="kbd"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '28px',
                            px: 1,
                            py: 0.25,
                            fontSize: '0.8rem',
                            fontFamily: 'inherit',
                            fontWeight: 600,
                            color: '#374151',
                            backgroundColor: '#e5e7eb',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {key}
                        </Box>
                      ))}
                    </Box>
                    <Typography
                      level="body-sm"
                      sx={{
                        fontSize: '0.9rem',
                        color: '#374151',
                      }}
                    >
                      {shortcut.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
