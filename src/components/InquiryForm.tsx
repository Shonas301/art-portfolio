'use client'

import { useState, type FormEvent } from 'react'
import Box from '@mui/joy/Box'
import Input from '@mui/joy/Input'
import Textarea from '@mui/joy/Textarea'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import Alert from '@mui/joy/Alert'
import CircularProgress from '@mui/joy/CircularProgress'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

type InquiryType = 'general' | 'commission' | 'purchase'

interface InquiryFormProps {
  // optional artwork id for when inquiring about a specific piece
  artworkId?: string
  artworkTitle?: string
  // callback when form submission completes
  onSuccess?: () => void
}

interface FormData {
  name: string
  email: string
  inquiryType: InquiryType
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  inquiryType?: string
  message?: string
}

// simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function InquiryForm({ artworkId, artworkTitle, onSuccess }: InquiryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    inquiryType: 'general',
    message: artworkTitle ? `i'm interested in "${artworkTitle}".\n\n` : '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'email is required'
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'please enter a valid email address'
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'please select an inquiry type'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          artworkId: artworkId || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'failed to submit inquiry')
      }

      setSubmitStatus('success')
      // reset form on success
      setFormData({
        name: '',
        email: '',
        inquiryType: 'general',
        message: '',
      })
      onSuccess?.()
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'something went wrong. please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // handle input changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // show success message if form was submitted successfully
  if (submitStatus === 'success') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
        <Typography level="h4" sx={{ mb: 1, color: '#000000' }}>
          message sent!
        </Typography>
        <Typography level="body-md" sx={{ color: '#525252' }}>
          thank you for reaching out. i&apos;ll get back to you soon.
        </Typography>
        <Button
          onClick={() => setSubmitStatus('idle')}
          variant="outlined"
          sx={{
            mt: 3,
            borderColor: '#9333ea',
            color: '#9333ea',
            '&:hover': {
              bgcolor: '#f3e8ff',
              borderColor: '#7e22ce',
            },
          }}
        >
          send another message
        </Button>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2.5}>
        {/* error alert */}
        {submitStatus === 'error' && (
          <Alert
            color="danger"
            startDecorator={<ErrorIcon />}
            sx={{ mb: 1 }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* name field */}
        <FormControl error={!!errors.name}>
          <FormLabel sx={{ color: '#262626', fontWeight: 500 }}>name</FormLabel>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="your name"
            disabled={isSubmitting}
            sx={{
              '--Input-focusedThickness': '2px',
              '--Input-focusedHighlight': '#9333ea',
              '&:focus-within': {
                borderColor: '#9333ea',
              },
            }}
          />
          {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
        </FormControl>

        {/* email field */}
        <FormControl error={!!errors.email}>
          <FormLabel sx={{ color: '#262626', fontWeight: 500 }}>email</FormLabel>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your@email.com"
            disabled={isSubmitting}
            sx={{
              '--Input-focusedThickness': '2px',
              '--Input-focusedHighlight': '#9333ea',
              '&:focus-within': {
                borderColor: '#9333ea',
              },
            }}
          />
          {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
        </FormControl>

        {/* inquiry type dropdown */}
        <FormControl error={!!errors.inquiryType}>
          <FormLabel sx={{ color: '#262626', fontWeight: 500 }}>inquiry type</FormLabel>
          <Select
            value={formData.inquiryType}
            onChange={(_, value) => handleChange('inquiryType', value as InquiryType)}
            disabled={isSubmitting}
            sx={{
              '&:focus-within': {
                borderColor: '#9333ea',
              },
            }}
          >
            <Option value="general">general inquiry</Option>
            <Option value="commission">commission request</Option>
            <Option value="purchase">purchase inquiry</Option>
          </Select>
          {errors.inquiryType && <FormHelperText>{errors.inquiryType}</FormHelperText>}
        </FormControl>

        {/* message textarea */}
        <FormControl error={!!errors.message}>
          <FormLabel sx={{ color: '#262626', fontWeight: 500 }}>message</FormLabel>
          <Textarea
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="tell me about your project or question..."
            minRows={4}
            maxRows={8}
            disabled={isSubmitting}
            sx={{
              '--Textarea-focusedThickness': '2px',
              '--Textarea-focusedHighlight': '#9333ea',
              '&:focus-within': {
                borderColor: '#9333ea',
              },
            }}
          />
          {errors.message && <FormHelperText>{errors.message}</FormHelperText>}
        </FormControl>

        {/* submit button */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          startDecorator={isSubmitting ? <CircularProgress size="sm" /> : <SendIcon />}
          sx={{
            mt: 1,
            background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #7e22ce 0%, #db2777 100%)',
            },
            '&:disabled': {
              background: '#d4d4d4',
            },
          }}
        >
          {isSubmitting ? 'sending...' : 'send message'}
        </Button>
      </Stack>
    </Box>
  )
}
