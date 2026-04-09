// helper functions for video embed handling (youtube + vimeo)

/**
 * extracts the youtube video id from a youtube url
 * supports formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)

    // handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      return urlObj.searchParams.get('v')
    }

    // handle youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    }

    // handle youtube.com/embed/VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      return urlObj.pathname.split('/')[2]
    }

    return null
  } catch {
    return null
  }
}

/**
 * converts a youtube url to an embed url
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

/**
 * extracts the vimeo video id from a vimeo url
 * supports formats:
 * - https://vimeo.com/VIDEO_ID
 * - https://player.vimeo.com/video/VIDEO_ID
 * - https://player.vimeo.com/video/VIDEO_ID?h=HASH
 */
export function getVimeoVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)

    // handle player.vimeo.com/video/VIDEO_ID
    if (urlObj.hostname === 'player.vimeo.com' && urlObj.pathname.startsWith('/video/')) {
      const id = urlObj.pathname.split('/')[2]
      return id || null
    }

    // handle vimeo.com/VIDEO_ID
    if (urlObj.hostname === 'vimeo.com' || urlObj.hostname === 'www.vimeo.com') {
      const segments = urlObj.pathname.split('/').filter(Boolean)
      // first non-empty segment should be the video id (numeric)
      if (segments.length > 0 && /^\d+$/.test(segments[0])) {
        return segments[0]
      }
      return null
    }

    return null
  } catch {
    return null
  }
}

/**
 * converts a vimeo url to an embed url
 * preserves the ?h= hash parameter for privacy-protected videos
 */
export function getVimeoEmbedUrl(url: string): string | null {
  const videoId = getVimeoVideoId(url)
  if (!videoId) return null

  try {
    const urlObj = new URL(url)
    const hash = urlObj.searchParams.get('h')
    const base = `https://player.vimeo.com/video/${videoId}`
    return hash ? `${base}?h=${hash}` : base
  } catch {
    return `https://player.vimeo.com/video/${videoId}`
  }
}

/**
 * generic video embed url resolver
 * tries youtube first, then vimeo. returns null if neither matches.
 */
export function getVideoEmbedUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url) ?? getVimeoEmbedUrl(url)
}
