// dynamic content fetching layer
// fetches from supabase when available, falls back to static content

import type { GalleryItem } from '@/types/gallery'
import type { Artwork, Section, SiteSetting } from '@/lib/supabase/types'
import {
  pageContent,
  type PageContent,
  type GalleryData,
  type IntroData,
  type ContactData,
  type CodeData,
  type LandingData,
} from '@/app/v2/data/portfolio-content'

// gallery_items joined with artworks via foreign key
interface GalleryItemWithArtwork {
  display_order: number
  artworks: Artwork
}

// check if supabase env vars are present before attempting client creation
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// convert supabase artwork to gallery item format
function artworkToGalleryItem(artwork: Artwork, index: number): GalleryItem {
  return {
    id: index + 1,
    title: artwork.title,
    description: artwork.description || '',
    longDescription: artwork.long_description || artwork.description || '',
    type: artwork.media_type === 'video' ? 'video' : 'image',
    src: artwork.cloudinary_url || artwork.external_url || '',
    thumbnail: artwork.thumbnail_url || artwork.cloudinary_url || '',
    materials: artwork.materials || undefined,
    dimensions: artwork.dimensions || undefined,
    year: artwork.year_created || undefined,
    isForSale: artwork.is_for_sale,
    priceRange: artwork.price_range || undefined,
    shopUrl: artwork.shop_url || undefined,
  }
}

// fetch all page content from supabase with static fallback
// designed for client-side use in 'use client' components
export async function fetchAllPageContentClient(): Promise<PageContent[]> {
  if (!isSupabaseConfigured()) {
    return pageContent
  }

  try {
    // lazy import to avoid throwing when env vars are missing
    const { getClient } = await import('@/lib/supabase/client')
    const supabase = getClient()

    // fetch sections and settings in parallel
    const [sectionsResult, settingsResult] = await Promise.all([
      supabase
        .from('sections')
        .select('*')
        .order('display_order', { ascending: true }),
      supabase
        .from('site_settings')
        .select('*'),
    ])

    if (sectionsResult.error) {
      console.error('error fetching sections:', sectionsResult.error)
      return pageContent
    }

    const sections = sectionsResult.data as Section[]
    const settings = settingsResult.data as SiteSetting[] | null

    // build a settings map keyed by settings key
    const settingsMap: Record<string, unknown> = {}
    if (settings) {
      for (const s of settings) {
        settingsMap[s.key] = s.value
      }
    }

    // for each gallery section, fetch its artworks via gallery_items join
    const gallerySections = sections.filter(s =>
      ['3d-work', '2d-work', 'pandy-series'].includes(s.slug)
    )

    const galleryDataMap: Record<string, Artwork[]> = {}

    if (gallerySections.length > 0) {
      const galleryResults = await Promise.all(
        gallerySections.map(section =>
          supabase
            .from('gallery_items')
            .select('display_order, artworks (*)')
            .eq('section_id', section.id)
            .order('display_order', { ascending: true })
        )
      )

      gallerySections.forEach((section, idx) => {
        const result = galleryResults[idx]
        if (!result.error && result.data) {
          // cast join result — supabase types don't infer FK joins
          const items = result.data as unknown as GalleryItemWithArtwork[]
          galleryDataMap[section.slug] = items
            .map(item => item.artworks)
            .filter(Boolean)
        }
      })
    }

    // merge dynamic data into static page structure
    return pageContent.map(page => {
      const section = sections.find(s => s.slug === page.id)

      switch (page.type) {
        case 'gallery': {
          const artworks = galleryDataMap[page.id]
          if (artworks?.length) {
            return {
              ...page,
              data: {
                description: section?.description || (page.data as GalleryData).description,
                items: artworks.map((artwork, index) =>
                  artworkToGalleryItem(artwork, index)
                ),
              } as GalleryData,
            }
          }
          break
        }

        case 'intro': {
          const introSettings = settingsMap['intro'] as Record<string, string> | undefined
          if (introSettings) {
            return {
              ...page,
              data: {
                ...(page.data as IntroData),
                ...introSettings,
              } as IntroData,
            }
          }
          break
        }

        case 'contact': {
          const contactSettings = settingsMap['contact'] as Record<string, string> | undefined
          if (contactSettings) {
            return {
              ...page,
              data: {
                ...(page.data as ContactData),
                ...contactSettings,
              } as ContactData,
            }
          }
          break
        }

        case 'code': {
          const codeSettings = settingsMap['code'] as Record<string, unknown> | undefined
          if (codeSettings) {
            return {
              ...page,
              data: {
                ...(page.data as CodeData),
                ...codeSettings,
              } as CodeData,
            }
          }
          break
        }

        case 'landing': {
          const landingSettings = settingsMap['landing'] as Record<string, string> | undefined
          if (landingSettings) {
            return {
              ...page,
              title: landingSettings.title || page.title,
              data: {
                ...(page.data as LandingData),
                ...landingSettings,
              } as LandingData,
            }
          }
          break
        }
      }

      return page
    })
  } catch (error) {
    console.error('error fetching page content:', error)
    return pageContent
  }
}
