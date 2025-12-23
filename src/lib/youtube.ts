// helper functions for youtube embed handling

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
