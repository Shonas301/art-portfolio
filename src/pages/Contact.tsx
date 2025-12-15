import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'
import MailIcon from '@mui/icons-material/Mail'

export function Contact() {
  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ px: 4, py: 8, textAlign: 'center' }}>
          <Stack spacing={6} alignItems="center">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 700,
              }}
            >
              Get In Touch
            </Typography>

            <Typography variant="h6" color="text.secondary">
              I'm always interested in new projects and collaborations.
              Feel free to reach out!
            </Typography>

            {/* email section */}
            <Stack spacing={2} alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MailIcon sx={{ fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  Contact
                </Typography>
              </Stack>
              <Typography
                component="a"
                href="mailto:email@email.edu"
                sx={{
                  fontSize: '1.25rem',
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                email@email.edu
              </Typography>
            </Stack>

            {/* social links */}
            <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Connect with me
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LinkedInIcon />}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<InstagramIcon />}
                >
                  Instagram
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Fade>
  )
}
