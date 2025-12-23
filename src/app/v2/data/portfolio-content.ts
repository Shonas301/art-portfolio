import type { GalleryItem } from '@/types/gallery'

// flipbook physical model
export const TOTAL_PAGES = 50

// page content types
export type PageType = 'landing' | 'intro' | 'gallery' | 'code' | 'contact' | 'blank'

export interface PageContent {
  id: string
  type: PageType
  title: string
  section: string // for binder tabs
  data?: LandingData | IntroData | GalleryData | CodeData | ContactData
}

// sections mapped to physical pages (spread across the 50-page book)
export interface SectionMapping {
  id: string
  section: string
  physicalPage: number
}

export const sectionMappings: SectionMapping[] = [
  { id: 'landing', section: 'home', physicalPage: 0 },
  { id: 'intro', section: 'intro', physicalPage: 7 },
  { id: '3d-work', section: '3d work', physicalPage: 14 },
  { id: '2d-work', section: '2d work', physicalPage: 22 },
  { id: 'code', section: 'code', physicalPage: 30 },
  { id: 'pandy-series', section: 'pandy', physicalPage: 38 },
  { id: 'contact', section: 'contact', physicalPage: 46 },
]

// helper to get physical page for a section
export function getPhysicalPageForSection(sectionId: string): number {
  return sectionMappings.find(s => s.id === sectionId)?.physicalPage ?? 0
}

// helper to get section at a physical page (or null if blank page)
export function getSectionAtPage(physicalPage: number): SectionMapping | null {
  return sectionMappings.find(s => s.physicalPage === physicalPage) ?? null
}

export interface LandingData {
  subtitle?: string
}

export interface IntroData {
  name: string
  bio: string
  headshot: string
}

export interface GalleryData {
  description: string
  items: GalleryItem[]
}

export interface CodeData {
  description: string
  projects: Array<{
    id: number
    title: string
    description: string
    videoSrc: string
    technologies: string[]
  }>
}

export interface ContactData {
  email: string
  linkedin: string
  instagram: string
  message: string
}

// centralized portfolio content
export const pageContent: PageContent[] = [
  {
    id: 'landing',
    type: 'landing',
    title: 'welcome to christina shi\'s portfolio flipbook!',
    section: 'home',
    data: {
      subtitle: 'interactive 3d art portfolio',
    } as LandingData,
  },
  {
    id: 'intro',
    type: 'intro',
    title: 'about me',
    section: 'intro',
    data: {
      name: 'christina shi',
      bio: 'hello! i\'m a 3d artist based in nyc. i combine my background in tech and software engineering with my love of art and animation to create beautiful things!',
      headshot: '/images/headshot.png',
    } as IntroData,
  },
  {
    id: '3d-work',
    type: 'gallery',
    title: '3d work',
    section: '3d work',
    data: {
      description: 'i work primarily in maya, creating character models, environments, and animations.',
      items: [
        {
          id: 1,
          title: 'animation demo',
          description: 'character animation showcase',
          longDescription: 'a comprehensive demonstration of character rigging and animation techniques in autodesk maya.',
          type: 'video',
          src: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
          thumbnail: '/output/frames/720p_s69_frame_0000.png',
        },
        {
          id: 2,
          title: '3d scene composition',
          description: 'environment design study',
          longDescription: 'detailed 3d environment showcasing lighting, texturing, and composition principles.',
          type: 'image',
          src: '/output/frames/1080p_s52043_frame_0001.png',
          thumbnail: '/output/frames/1080p_s69_frame_0001.png',
        },
        {
          id: 3,
          title: 'character model',
          description: '3d character design',
          longDescription: 'original character design with detailed topology and texture work.',
          type: 'image',
          src: '/output/frames/720p_s69_frame_0050.png',
          thumbnail: '/output/frames/720p_s69_frame_0050.png',
        },
      ],
    } as GalleryData,
  },
  {
    id: '2d-work',
    type: 'gallery',
    title: '2d work',
    section: '2d work',
    data: {
      description: 'digital illustrations and concept art.',
      items: [
        {
          id: 4,
          title: 'digital painting',
          description: 'concept art illustration',
          longDescription: 'digital painting exploring color theory and composition.',
          type: 'image',
          src: '/output/frames/720p_s69_frame_0100.png',
          thumbnail: '/output/frames/720p_s69_frame_0100.png',
        },
        {
          id: 5,
          title: 'character concept',
          description: 'character design sketch',
          longDescription: 'character design exploration with multiple iterations.',
          type: 'image',
          src: '/output/frames/1080p_s52043_frame_0001.png',
          thumbnail: '/output/frames/1080p_s52043_frame_0001.png',
        },
      ],
    } as GalleryData,
  },
  {
    id: 'code',
    type: 'code',
    title: 'code projects',
    section: 'code',
    data: {
      description: 'technical projects combining art and programming.',
      projects: [
        {
          id: 1,
          title: 'procedural animation system',
          description: 'custom animation pipeline built in python for maya',
          videoSrc: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
          technologies: ['python', 'maya', 'pymel'],
        },
        {
          id: 2,
          title: 'rendering optimization tool',
          description: 'batch rendering utility for improved workflow',
          videoSrc: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
          technologies: ['python', 'arnold', 'maya'],
        },
      ],
    } as CodeData,
  },
  {
    id: 'pandy-series',
    type: 'gallery',
    title: 'pandy series',
    section: 'pandy series',
    data: {
      description: 'my ongoing character animation series featuring pandy the panda.',
      items: [
        {
          id: 6,
          title: 'pandy animation 1',
          description: 'pandy character exploration',
          longDescription: 'first animation in the pandy series, exploring character personality and movement.',
          type: 'video',
          src: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
          thumbnail: '/output/frames/720p_s69_frame_0000.png',
        },
        {
          id: 7,
          title: 'pandy animation 2',
          description: 'pandy in action',
          longDescription: 'continued adventures of pandy with more complex animation sequences.',
          type: 'video',
          src: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
          thumbnail: '/output/frames/720p_s69_frame_0050.png',
        },
      ],
    } as GalleryData,
  },
  {
    id: 'contact',
    type: 'contact',
    title: 'get in touch',
    section: 'contact',
    data: {
      email: 'christina@example.com',
      linkedin: 'https://linkedin.com/in/christinashi',
      instagram: 'https://instagram.com/christinashi',
      message: 'i\'d love to hear from you! feel free to reach out via email or connect with me on social media.',
    } as ContactData,
  },
]
