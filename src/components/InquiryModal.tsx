'use client'

import { useState, useCallback, type ReactNode } from 'react'
import Box from '@mui/joy/Box'
import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import Card from '@mui/joy/Card'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { InquiryForm } from './InquiryForm'

interface InquiryModalProps {
  // optional artwork info for when inquiring about a specific piece
  artworkId?: string
  artworkTitle?: string
  // control whether the modal is open (controlled mode)
  open?: boolean
  onClose?: () => void
  // custom trigger button content
  triggerContent?: ReactNode
  // whether to show the trigger button (false when using controlled mode)
  showTrigger?: boolean
}

export function InquiryModal({
  artworkId,
  artworkTitle,
  open: controlledOpen,
  onClose: controlledOnClose,
  triggerContent,
  showTrigger = true,
}: InquiryModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  // support both controlled and uncontrolled modes
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const handleOpen = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(true)
    }
  }, [isControlled])

  const handleClose = useCallback(() => {
    if (isControlled) {
      controlledOnClose?.()
    } else {
      setInternalOpen(false)
    }
  }, [isControlled, controlledOnClose])

  const handleSuccess = useCallback(() => {
    // optionally close modal after successful submission
    // for now, let the user see the success message and close manually
  }, [])

  // default trigger button content
  const defaultTriggerContent = artworkTitle ? (
    <>interested in this piece?</>
  ) : (
    <>send me a message</>
  )

  return (
    <>
      {/* trigger button */}
      {showTrigger && (
        <Button
          onClick={handleOpen}
          size="lg"
          startDecorator={<MailOutlineIcon />}
          sx={{
            background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #7e22ce 0%, #db2777 100%)',
            },
          }}
        >
          {triggerContent || defaultTriggerContent}
        </Button>
      )}

      {/* modal */}
      <Modal
        open={isOpen}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none',
            position: 'relative',
            p: { xs: 2.5, md: 4 },
          }}
        >
          <ModalClose
            variant="plain"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
            }}
          />

          {/* header */}
          <Box sx={{ mb: 3, pr: 4 }}>
            <Typography
              level="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                color: '#000000',
                textTransform: 'lowercase',
              }}
            >
              get in touch
            </Typography>
            {artworkTitle && (
              <Typography
                level="body-md"
                sx={{
                  mt: 1,
                  color: '#525252',
                  fontStyle: 'italic',
                }}
              >
                regarding: &quot;{artworkTitle}&quot;
              </Typography>
            )}
          </Box>

          {/* form */}
          <InquiryForm
            artworkId={artworkId}
            artworkTitle={artworkTitle}
            onSuccess={handleSuccess}
          />
        </Card>
      </Modal>
    </>
  )
}
