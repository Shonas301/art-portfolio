import { createTheme } from '@mui/material/styles'

// bright, whimsical color palette for artist portfolio
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9333ea', // purple-600
      light: '#a855f7', // purple-500
      dark: '#7e22ce', // purple-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // pink-500
      light: '#f472b6', // pink-400
      dark: '#db2777', // pink-600
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b', // amber-500
      light: '#fbbf24', // amber-400
      dark: '#d97706', // amber-600
    },
    info: {
      main: '#06b6d4', // cyan-500
      light: '#22d3ee', // cyan-400
      dark: '#0891b2', // cyan-600
    },
    background: {
      default: '#fefefe',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          padding: '12px 32px',
          fontSize: '1.125rem',
        },
        contained: {
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
})
