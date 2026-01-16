// dynamic content fetching layer
// fetches from supabase when available, falls back to static content

import type { GalleryItem } from '@/types/gallery'
import type { Artwork, Section } from '@/lib/supabase/types'
import {
  pageContent,
  type PageContent,
  type GalleryData,
  type IntroData,
  type ContactData,
  type CodeData,
  type LandingData,
} from '@/app/v2/data/portfolio-content'

// check if supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// convert supabase artwork to gallery item format
function artworkToGalleryItem(artwork: Artwork, index: number): GalleryItem {
  return {
    id: index + 1, // preserve numeric id for compatibility
    title: artwork.title,
    description: artwork.description || '',
    longDescription: artwork.long_description || artwork.description || '',
    type: artwork.media_type === 'video' ? 'video' : 'image',
    src: artwork.cloudinary_url || artwork.external_url || '',
    thumbnail: artwork.thumbnail_url || artwork.cloudinary_url || '',
    // extended fields
    materials: artwork.materials || undefined,
    dimensions: artwork.dimensions || undefined,
    year: artwork.year_created || undefined,
    isForSale: artwork.is_for_sale,
    priceRange: artwork.price_range || undefined,
    shopUrl: artwork.shop_url || undefined,
  }
}

// fetch gallery data from api with static fallback
export async function fetchGalleryData(sectionSlug: string): Promise<GalleryData | null> {
  // fall back to static content if supabase not configured
  if (!isSupabaseConfigured()) {
    const staticPage = pageContent.find(p => p.id === sectionSlug)
    if (staticPage?.type === 'gallery' && staticPage.data) {
      return staticPage.data as GalleryData
    }
    return null
  }

  try {
    const response = await fetch(`/api/sections/${sectionSlug}`, {
      next: { revalidate: 60 }, // cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error('failed to fetch section')
    }

    const { data } = await response.json()
    const section = data as Section & { artworks: Artwork[] }

    if (!section.artworks?.length) {
      // fall back to static if no artworks in db
      const staticPage = pageContent.find(p => p.id === sectionSlug)
      if (staticPage?.type === 'gallery' && staticPage.data) {
        return staticPage.data as GalleryData
      }
      return null
    }

    return {
      description: section.description || '',
      items: section.artworks.map((artwork, index) =>
        artworkToGalleryItem(artwork, index)
      ),
    }
  } catch (error) {
    console.error('error fetching gallery data:', error)
    // fall back to static content
    const staticPage = pageContent.find(p => p.id === sectionSlug)
    if (staticPage?.type === 'gallery' && staticPage.data) {
      return staticPage.data as GalleryData
    }
    return null
  }
}

// fetch all page content with dynamic data merged in
export async function fetchAllPageContent(): Promise<PageContent[]> {
  // if supabase not configured, return static content
  if (!isSupabaseConfigured()) {
    return pageContent
  }

  try {
    // fetch sections and settings in parallel
    const [sectionsRes, settingsRes] = await Promise.all([
      fetch('/api/sections', { next: { revalidate: 60 } }),
      fetch('/api/settings', { next: { revalidate: 60 } }).catch(() => null),
    ])

    if (!sectionsRes.ok) {
      return pageContent
    }

    const { data: sections } = await sectionsRes.json()
    const settings = settingsRes?.ok
      ? (await settingsRes.json()).data
      : null

    // merge dynamic content with static structure
    return pageContent.map(page => {
      const section = sections?.find((s: Section) => s.slug === page.id)

      switch (page.type) {
        case 'gallery':
          if (section?.artworks?.length) {
            return {
              ...page,
              data: {
                description: section.description || (page.data as GalleryData).description,
                items: section.artworks.map((artwork: Artwork, index: number) =>
                  artworkToGalleryItem(artwork, index)
                ),
              } as GalleryData,
            }
          }
          break

        case 'intro':
          if (settings?.intro) {
            return {
              ...page,
              data: {
                ...(page.data as IntroData),
                ...settings.intro,
              } as IntroData,
            }
          }
          break

        case 'contact':
          if (settings?.contact) {
            return {
              ...page,
              data: {
                ...(page.data as ContactData),
                ...settings.contact,
              } as ContactData,
            }
          }
          break

        case 'code':
          if (settings?.code) {
            return {
              ...page,
              data: {
                ...(page.data as CodeData),
                ...settings.code,
              } as CodeData,
            }
          }
          break

        case 'landing':
          if (settings?.landing) {
            return {
              ...page,
              title: settings.landing.title || page.title,
              data: {
                ...(page.data as LandingData),
                ...settings.landing,
              } as LandingData,
            }
          }
          break
      }

      return page
    })
  } catch (error) {
    console.error('error fetching page content:', error)
    return pageContent
  }
}

// client-side hook for fetching gallery data
export function useGalleryData(sectionSlug: string) {
  // this is a simple implementation - for production you'd use swr or react-query
  // the actual hooks are in src/hooks/useArtworks.ts and useSections.ts
  return {
    fallbackData: pageContent.find(p => p.id === sectionSlug)?.data as GalleryData | undefined,
  }
}
