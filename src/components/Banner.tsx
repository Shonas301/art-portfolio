import { Link, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

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
  const currentTabIndex = navItems.findIndex(item => item.path === location.pathname)

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(90deg, #7e22ce 0%, #9333ea 50%, #ec4899 100%)',
        mb: 4,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 6, py: 2 }}>
        <Typography
          variant="h4"
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
          }}
        >
          <Tabs
            value={currentTabIndex !== -1 ? currentTabIndex : false}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {navItems.map((item, index) => (
              <Tab
                key={item.path}
                label={item.name}
                component={Link}
                to={item.path}
                sx={{
                  minHeight: 'auto',
                  py: 2,
                  px: 3,
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: '#7e22ce',
                  textTransform: 'none',
                  transition: 'all 0.2s',
                  borderRight: index < navItems.length - 1 ? '2px solid #fef3c7' : 'none',
                  '&.Mui-selected': {
                    background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                    color: 'white',
                  },
                  '&:hover': {
                    bgcolor: '#fef3c7',
                    color: '#ec4899',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Toolbar>

      {/* colorful bottom stripe */}
      <Box
        sx={{
          height: 8,
          background: 'linear-gradient(90deg, #fbbf24 0%, #ec4899 50%, #f59e0b 100%)',
        }}
      />
    </AppBar>
  )
}
