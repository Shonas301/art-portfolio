import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'

export function Footer() {
  return (
    <Box component="footer" sx={{ mt: 'auto', width: '100%' }}>
      {/* top colorful stripe */}
      <Box
        sx={{
          height: 8,
          background: 'linear-gradient(90deg, #f59e0b 0%, #ec4899 50%, #fbbf24 100%)',
        }}
      />

      <Box
        sx={{
          background: 'linear-gradient(90deg, #ec4899 0%, #9333ea 50%, #7e22ce 100%)',
          py: 3,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* left side - contact */}
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: 500,
            }}
          >
            Contact:{' '}
            <Box
              component="a"
              href="mailto:email@email.edu"
              sx={{
                color: '#fef3c7',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#fbbf24',
                },
              }}
            >
              email@email.edu
            </Box>
          </Typography>

          {/* right side - social icons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{
                color: 'white',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fbbf24',
                },
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              sx={{
                color: 'white',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fbbf24',
                },
              }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
