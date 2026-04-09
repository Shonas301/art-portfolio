'use client'

import { useState, useEffect, useCallback } from 'react'
import { signIn, getSession } from 'next-auth/react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Alert from '@mui/joy/Alert'
import CircularProgress from '@mui/joy/CircularProgress'
import { useFlipBook } from '../context/FlipBookContext'

export function AdminLogin() {
  const { dispatch } = useFlipBook()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // check for existing nextauth session on mount
  const checkSession = useCallback(async () => {
    try {
      const session = await getSession()
      if (session?.user?.isAdmin) {
        dispatch({ type: 'ADMIN_LOGIN' })
      }
    } catch (err) {
      console.error('session check failed:', err)
    } finally {
      setIsChecking(false)
    }
  }, [dispatch])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const handleSignIn = async () => {
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: window.location.href,
      })

      if (result?.error) {
        setError('sign in failed — ensure your google account is authorized')
        setIsLoading(false)
        return
      }

      // after sign-in, check session for admin status
      const session = await getSession()
      if (session?.user?.isAdmin) {
        dispatch({ type: 'ADMIN_LOGIN' })
      } else if (session?.user) {
        setError('access denied — this account is not an admin')
      } else {
        setError('sign in was cancelled or failed')
      }
    } catch (err) {
      console.error('sign in error:', err)
      setError('an unexpected error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    dispatch({ type: 'FLIP_BOOK_BACK' })
  }

  // show spinner while checking existing session
  if (isChecking) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <CircularProgress sx={{ '--CircularProgress-trackColor': 'rgba(255,255,255,0.1)' }} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          level="h2"
          sx={{
            mb: 1,
            textAlign: 'center',
            color: 'white',
            fontWeight: 300,
          }}
        >
          Admin Access
        </Typography>

        <Typography
          level="body-sm"
          sx={{
            mb: 3,
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          sign in with your authorized google account
        </Typography>

        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          loading={isLoading}
          fullWidth
          onClick={handleSignIn}
          sx={{
            mb: 2,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          Sign in with Google
        </Button>

        <Button
          variant="plain"
          color="neutral"
          fullWidth
          onClick={handleGoBack}
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            '&:hover': { color: 'white' },
          }}
        >
          Go Back
        </Button>
      </Card>
    </Box>
  )
}
