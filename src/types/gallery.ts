export interface GalleryItem {
  id: number
  title: string
  description: string
  longDescription: string
  type: 'image' | 'video'
  src: string
  thumbnail: string
}
