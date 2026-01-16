'use client'

import { useState, FormEvent } from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import Typography from '@mui/joy/Typography'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Alert from '@mui/joy/Alert'
import { useFlipBook } from '../context/FlipBookContext'

// credentials from environment variables (fall back to demo values for development)
const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || ''

export function AdminLogin() {
  const { dispatch } = useFlipBook()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // simulate network delay
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        // store session
        sessionStorage.setItem('admin_authenticated', 'true')
        dispatch({ type: 'ADMIN_LOGIN' })
      } else {
        setError('Invalid credentials')
      }
      setIsLoading(false)
    }, 500)
  }

  const handleGoBack = () => {
    dispatch({ type: 'FLIP_BOOK_BACK' })
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
            mb: 3,
            textAlign: 'center',
            color: 'white',
            fontWeight: 300,
          }}
        >
          Admin Access
        </Typography>

        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Username
            </FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
              }}
            />
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Password
            </FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
              }}
            />
          </FormControl>

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            sx={{
              mb: 2,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Sign In
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
        </form>
      </Card>
    </Box>
  )
}
