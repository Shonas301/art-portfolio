import Box from '@mui/joy/Box'
import Container from '@mui/joy/Container'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'
import MailIcon from '@mui/icons-material/Mail'

export function Contact() {
  return (
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
            level="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
            }}
          >
            Get In Touch
          </Typography>

          <Typography level="title-lg">
            I'm always interested in new projects and collaborations.
            Feel free to reach out!
          </Typography>

          {/* email section */}
          <Stack spacing={2} alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <MailIcon sx={{ fontSize: '2rem' }} />
              <Typography level="h4" sx={{ fontWeight: 500 }}>
                Contact
              </Typography>
            </Stack>
            <Typography
              component="a"
              href="mailto:email@email.edu"
              level="title-lg"
              sx={{
                color: 'primary.500',
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
            <Typography level="title-lg" sx={{ fontWeight: 500 }}>
              Connect with me
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                size="lg"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                startDecorator={<LinkedInIcon />}
              >
                LinkedIn
              </Button>
              <Button
                variant="outlined"
                size="lg"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                startDecorator={<InstagramIcon />}
              >
                Instagram
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
