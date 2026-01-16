import type { Metadata } from 'next'

// base url for the portfolio site - should be set in environment variables
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://christinashi.art'

// generates a shareable url for an artwork
export function getArtworkShareUrl(artworkId: string): string {
  return `${BASE_URL}/artwork/${artworkId}`
}

// generates a shareable url for a gallery section
export function getGalleryShareUrl(section: string): string {
  return `${BASE_URL}/v2?section=${encodeURIComponent(section)}`
}

// generates a shareable url for the portfolio
export function getPortfolioShareUrl(): string {
  return BASE_URL
}

// generates a shareable url for the contact page
export function getContactShareUrl(): string {
  return `${BASE_URL}/v2?section=contact`
}

// types for artwork metadata
export interface ArtworkMetadata {
  id: string
  title: string
  description?: string
  image: string
  type?: 'image' | 'video'
  category?: string
}

// generates open graph metadata for an artwork page
// use this in your artwork detail page's generateMetadata function
export function generateArtworkMetadata(artwork: ArtworkMetadata): Metadata {
  const url = getArtworkShareUrl(artwork.id)

  return {
    title: `${artwork.title} - christina shi`,
    description: artwork.description || `${artwork.title} by christina shi`,
    openGraph: {
      title: artwork.title,
      description: artwork.description || `${artwork.title} by christina shi`,
      url,
      siteName: 'christina shi portfolio',
      images: [
        {
          url: artwork.image,
          width: 1200,
          height: 630,
          alt: artwork.title,
        },
      ],
      type: artwork.type === 'video' ? 'video.other' : 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: artwork.title,
      description: artwork.description || `${artwork.title} by christina shi`,
      images: [artwork.image],
    },
  }
}

// generates open graph metadata for a gallery section
export function generateGalleryMetadata(
  sectionTitle: string,
  description?: string,
  coverImage?: string
): Metadata {
  const defaultDescription = `explore ${sectionTitle.toLowerCase()} artwork by christina shi`

  return {
    title: `${sectionTitle} - christina shi`,
    description: description || defaultDescription,
    openGraph: {
      title: `${sectionTitle} - christina shi`,
      description: description || defaultDescription,
      siteName: 'christina shi portfolio',
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: sectionTitle,
            },
          ]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: coverImage ? 'summary_large_image' : 'summary',
      title: `${sectionTitle} - christina shi`,
      description: description || defaultDescription,
      images: coverImage ? [coverImage] : undefined,
    },
  }
}

// generates default portfolio metadata
export function generatePortfolioMetadata(): Metadata {
  return {
    title: 'christina shi - 3d artist portfolio',
    description: 'portfolio of christina shi, showcasing 3d art, 2d work, and creative projects',
    openGraph: {
      title: 'christina shi - 3d artist portfolio',
      description: 'portfolio of christina shi, showcasing 3d art, 2d work, and creative projects',
      siteName: 'christina shi portfolio',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'christina shi - 3d artist portfolio',
      description: 'portfolio of christina shi, showcasing 3d art, 2d work, and creative projects',
    },
  }
}

// hook for generating share data on the client side
// useful when you need to dynamically generate share urls
export function useShareableLink() {
  // returns the current page url (client-side only)
  const getCurrentUrl = (): string => {
    if (typeof window === 'undefined') return BASE_URL
    return window.location.href
  }

  // returns the base url
  const getBaseUrl = (): string => BASE_URL

  return {
    getCurrentUrl,
    getBaseUrl,
    getArtworkShareUrl,
    getGalleryShareUrl,
    getPortfolioShareUrl,
    getContactShareUrl,
  }
}
