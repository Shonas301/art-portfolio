'use client'

import { useState } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import Button from '@mui/joy/Button'
import Divider from '@mui/joy/Divider'
import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import type { ContactData } from '../../data/portfolio-content'
import { InquiryModal } from '@/components/InquiryModal'

interface ContactPageProps {
  title: string
  data: ContactData
}

export function ContactPage({ title, data }: ContactPageProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        overflow: 'auto',
        py: 2,
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: '600px', width: '100%' }}>
        <Typography
          level="h2"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 700,
            color: '#000000',
            textTransform: 'lowercase',
          }}
        >
          {title}
        </Typography>

        <Typography
          level="body-lg"
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: '#262626',
            lineHeight: 1.7,
          }}
        >
          {data.message}
        </Typography>

        <Stack spacing={2}>
          <Button
            component="a"
            href={`mailto:${data.email}`}
            size="lg"
            startDecorator={<EmailIcon />}
            sx={{
              fontSize: '1.125rem',
              py: 1.5,
              background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #7e22ce 0%, #db2777 100%)',
              },
            }}
          >
            {data.email}
          </Button>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component="a"
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              startDecorator={<LinkedInIcon />}
              variant="outlined"
              sx={{
                fontSize: '1rem',
                borderColor: '#9333ea',
                color: '#9333ea',
                '&:hover': {
                  bgcolor: '#f3e8ff',
                  borderColor: '#7e22ce',
                },
              }}
            >
              linkedin
            </Button>

            <Button
              component="a"
              href={data.instagram}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              startDecorator={<InstagramIcon />}
              variant="outlined"
              sx={{
                fontSize: '1rem',
                borderColor: '#ec4899',
                color: '#ec4899',
                '&:hover': {
                  bgcolor: '#fdf2f8',
                  borderColor: '#db2777',
                },
              }}
            >
              instagram
            </Button>
          </Box>
        </Stack>

        {/* divider with inquiry form option */}
        <Divider sx={{ my: 1 }}>
          <Typography level="body-sm" sx={{ color: '#737373' }}>
            or
          </Typography>
        </Divider>

        {/* send a message button that opens the inquiry modal */}
        <Button
          onClick={() => setModalOpen(true)}
          size="lg"
          variant="soft"
          startDecorator={<MailOutlineIcon />}
          sx={{
            fontSize: '1.125rem',
            py: 1.5,
            bgcolor: '#f3e8ff',
            color: '#9333ea',
            '&:hover': {
              bgcolor: '#e9d5ff',
            },
          }}
        >
          send me a message
        </Button>

        {/* inquiry modal */}
        <InquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          showTrigger={false}
        />

        <Typography
          level="body-sm"
          sx={{
            fontSize: '0.875rem',
            color: '#737373',
            mt: 2,
          }}
        >
          this is the final page of the flipbook.
          <br />
          click the resume tab to view my resume!
        </Typography>
      </Stack>
    </Box>
  )
}
