'use client'

import { Component, type ReactNode } from 'react'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

// catches render errors in children and shows a fallback instead of crashing
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '200px',
            p: 4,
          }}
        >
          <Typography
            level="body-lg"
            sx={{
              color: '#737373',
              fontStyle: 'italic',
            }}
          >
            this page couldn&apos;t load
          </Typography>
        </Box>
      )
    }

    return this.props.children
  }
}
