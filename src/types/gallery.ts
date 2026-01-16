export interface GalleryItem {
  id: number
  title: string
  description: string
  longDescription: string
  type: 'image' | 'video'
  src: string
  thumbnail: string
  // optional extended fields for artwork details
  materials?: string
  dimensions?: string
  year?: number
  isForSale?: boolean
  priceRange?: string // e.g., "$500 - $1,000"
  shopUrl?: string
}
