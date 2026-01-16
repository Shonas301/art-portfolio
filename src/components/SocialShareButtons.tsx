'use client'

import { useState } from 'react'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import Button from '@mui/joy/Button'
import Snackbar from '@mui/joy/Snackbar'
import Tooltip from '@mui/joy/Tooltip'
import PinterestIcon from '@mui/icons-material/Pinterest'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkIcon from '@mui/icons-material/Link'
import CheckIcon from '@mui/icons-material/Check'

// x/twitter icon - mui doesn't have the new x logo, so we use a custom svg
function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// platform-specific brand colors
const BRAND_COLORS = {
  pinterest: '#E60023',
  twitter: '#000000',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  copy: '#737373',
}

interface SocialShareButtonsProps {
  url: string
  title: string
  image?: string
  description?: string
  variant?: 'compact' | 'full'
  className?: string
}

// generates share urls for each platform
function getShareUrl(
  platform: 'pinterest' | 'twitter' | 'facebook' | 'linkedin',
  url: string,
  title: string,
  image?: string
): string {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  switch (platform) {
    case 'pinterest':
      const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`
      return image ? `${pinterestUrl}&media=${encodeURIComponent(image)}` : pinterestUrl
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    case 'linkedin':
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`
  }
}

// opens share dialog in a popup window (better ux than new tab)
function openShareWindow(url: string, platform: string) {
  const width = 600
  const height = 400
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2

  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  )
}

export function SocialShareButtons({
  url,
  title,
  image,
  variant = 'compact',
  className,
}: SocialShareButtonsProps) {
  const [showCopied, setShowCopied] = useState(false)
  const [justCopied, setJustCopied] = useState(false)

  // handles the copy link action
  const handleCopyLink = async () => {
    try {
      // try native share api on mobile first
      if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
        await navigator.share({
          title,
          url,
        })
        return
      }

      // fallback to clipboard api
      await navigator.clipboard.writeText(url)
      setShowCopied(true)
      setJustCopied(true)
      setTimeout(() => setJustCopied(false), 2000)
    } catch (error) {
      // fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopied(true)
      setJustCopied(true)
      setTimeout(() => setJustCopied(false), 2000)
    }
  }

  // handles share button click
  const handleShare = (platform: 'pinterest' | 'twitter' | 'facebook' | 'linkedin') => {
    const shareUrl = getShareUrl(platform, url, title, image)
    openShareWindow(shareUrl, platform)
  }

  // common icon button styles with platform-specific hover colors
  const getIconButtonSx = (color: string) => ({
    transition: 'all 0.2s ease',
    '&:hover': {
      bgcolor: `${color}15`,
      color: color,
      transform: 'translateY(-2px)',
    },
  })

  // compact variant - icons only
  if (variant === 'compact') {
    return (
      <>
        <Box
          className={className}
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Tooltip title="share on pinterest">
            <IconButton
              variant="plain"
              onClick={() => handleShare('pinterest')}
              aria-label="share on pinterest"
              sx={getIconButtonSx(BRAND_COLORS.pinterest)}
            >
              <PinterestIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="share on x">
            <IconButton
              variant="plain"
              onClick={() => handleShare('twitter')}
              aria-label="share on x"
              sx={getIconButtonSx(BRAND_COLORS.twitter)}
            >
              <XIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="share on facebook">
            <IconButton
              variant="plain"
              onClick={() => handleShare('facebook')}
              aria-label="share on facebook"
              sx={getIconButtonSx(BRAND_COLORS.facebook)}
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="share on linkedin">
            <IconButton
              variant="plain"
              onClick={() => handleShare('linkedin')}
              aria-label="share on linkedin"
              sx={getIconButtonSx(BRAND_COLORS.linkedin)}
            >
              <LinkedInIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={justCopied ? 'copied!' : 'copy link'}>
            <IconButton
              variant="plain"
              onClick={handleCopyLink}
              aria-label="copy link"
              sx={{
                ...getIconButtonSx(BRAND_COLORS.copy),
                color: justCopied ? 'success.500' : undefined,
              }}
            >
              {justCopied ? <CheckIcon /> : <LinkIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Snackbar
          open={showCopied}
          autoHideDuration={3000}
          onClose={() => setShowCopied(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          color="success"
        >
          link copied to clipboard!
        </Snackbar>
      </>
    )
  }

  // full variant - icons with labels
  return (
    <>
      <Box
        className={className}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <Button
          variant="outlined"
          size="sm"
          startDecorator={<PinterestIcon />}
          onClick={() => handleShare('pinterest')}
          sx={{
            borderColor: BRAND_COLORS.pinterest,
            color: BRAND_COLORS.pinterest,
            '&:hover': {
              bgcolor: `${BRAND_COLORS.pinterest}15`,
              borderColor: BRAND_COLORS.pinterest,
            },
          }}
        >
          pinterest
        </Button>

        <Button
          variant="outlined"
          size="sm"
          startDecorator={<XIcon />}
          onClick={() => handleShare('twitter')}
          sx={{
            borderColor: BRAND_COLORS.twitter,
            color: BRAND_COLORS.twitter,
            '&:hover': {
              bgcolor: `${BRAND_COLORS.twitter}15`,
              borderColor: BRAND_COLORS.twitter,
            },
          }}
        >
          x
        </Button>

        <Button
          variant="outlined"
          size="sm"
          startDecorator={<FacebookIcon />}
          onClick={() => handleShare('facebook')}
          sx={{
            borderColor: BRAND_COLORS.facebook,
            color: BRAND_COLORS.facebook,
            '&:hover': {
              bgcolor: `${BRAND_COLORS.facebook}15`,
              borderColor: BRAND_COLORS.facebook,
            },
          }}
        >
          facebook
        </Button>

        <Button
          variant="outlined"
          size="sm"
          startDecorator={<LinkedInIcon />}
          onClick={() => handleShare('linkedin')}
          sx={{
            borderColor: BRAND_COLORS.linkedin,
            color: BRAND_COLORS.linkedin,
            '&:hover': {
              bgcolor: `${BRAND_COLORS.linkedin}15`,
              borderColor: BRAND_COLORS.linkedin,
            },
          }}
        >
          linkedin
        </Button>

        <Button
          variant="outlined"
          size="sm"
          startDecorator={justCopied ? <CheckIcon /> : <LinkIcon />}
          onClick={handleCopyLink}
          color={justCopied ? 'success' : 'neutral'}
          sx={{
            borderColor: justCopied ? undefined : BRAND_COLORS.copy,
            color: justCopied ? undefined : BRAND_COLORS.copy,
            '&:hover': {
              bgcolor: justCopied ? undefined : `${BRAND_COLORS.copy}15`,
              borderColor: justCopied ? undefined : BRAND_COLORS.copy,
            },
          }}
        >
          {justCopied ? 'copied!' : 'copy link'}
        </Button>
      </Box>

      <Snackbar
        open={showCopied}
        autoHideDuration={3000}
        onClose={() => setShowCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        color="success"
      >
        link copied to clipboard!
      </Snackbar>
    </>
  )
}
