import { Link, useLocation } from 'react-router-dom'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Box from '@mui/joy/Box'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Demo Reel', path: '/demo-reel' },
  { name: '3D Work', path: '/3d-work' },
  { name: 'Pandy Series', path: '/pandy-series' },
  { name: 'Code', path: '/code' },
  { name: '2D Work', path: '/2d-work' },
  { name: 'Resume', path: '/resume' },
  { name: 'Contact', path: '/contact' },
]

export function Banner() {
  const location = useLocation()

  return (
    <Sheet
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'linear-gradient(90deg, #7e22ce 0%, #9333ea 50%, #ec4899 100%)',
        mb: 4,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6, py: 2 }}>
        <Typography
          level="h3"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            color: 'white',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          Christina Shi
        </Typography>

        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 8,
            border: '4px solid',
            borderColor: '#fbbf24',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <Box
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 2,
                  px: 3,
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: isActive ? 'white' : '#7e22ce',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  borderRight: index < navItems.length - 1 ? '2px solid #fef3c7' : 'none',
                  background: isActive ? 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? undefined : '#fef3c7',
                    color: isActive ? 'white' : '#ec4899',
                  },
                }}
              >
                {item.name}
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* colorful bottom stripe */}
      <Box
        sx={{
          height: 8,
          background: 'linear-gradient(90deg, #fbbf24 0%, #ec4899 50%, #f59e0b 100%)',
        }}
      />
    </Sheet>
  )
}
