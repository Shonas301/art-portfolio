/**
 * seed script to migrate existing portfolio content to supabase
 *
 * run with: npx tsx scripts/seed-database.ts
 *
 * requires environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

// existing content from portfolio-content.ts
const sectionMappings = [
  { id: 'landing', section: 'home', physicalPage: 0 },
  { id: 'intro', section: 'intro', physicalPage: 7 },
  { id: '3d-work', section: '3d work', physicalPage: 14 },
  { id: '2d-work', section: '2d work', physicalPage: 22 },
  { id: 'code', section: 'code', physicalPage: 30 },
  { id: 'pandy-series', section: 'pandy', physicalPage: 38 },
  { id: 'contact', section: 'contact', physicalPage: 46 },
]

const artworks = [
  // 3d work
  {
    title: 'animation demo',
    description: 'character animation showcase',
    long_description: 'a comprehensive demonstration of character rigging and animation techniques in autodesk maya.',
    media_type: 'video',
    external_url: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
    thumbnail_url: '/output/frames/720p_s69_frame_0000.png',
    section_slug: '3d-work',
  },
  {
    title: '3d scene composition',
    description: 'environment design study',
    long_description: 'detailed 3d environment showcasing lighting, texturing, and composition principles.',
    media_type: 'image',
    cloudinary_url: '/output/frames/1080p_s52043_frame_0001.png',
    thumbnail_url: '/output/frames/1080p_s69_frame_0001.png',
    section_slug: '3d-work',
  },
  {
    title: 'character model',
    description: '3d character design',
    long_description: 'original character design with detailed topology and texture work.',
    media_type: 'image',
    cloudinary_url: '/output/frames/720p_s69_frame_0050.png',
    thumbnail_url: '/output/frames/720p_s69_frame_0050.png',
    section_slug: '3d-work',
  },
  // 2d work
  {
    title: 'digital painting',
    description: 'concept art illustration',
    long_description: 'digital painting exploring color theory and composition.',
    media_type: 'image',
    cloudinary_url: '/output/frames/720p_s69_frame_0100.png',
    thumbnail_url: '/output/frames/720p_s69_frame_0100.png',
    section_slug: '2d-work',
  },
  {
    title: 'character concept',
    description: 'character design sketch',
    long_description: 'character design exploration with multiple iterations.',
    media_type: 'image',
    cloudinary_url: '/output/frames/1080p_s52043_frame_0001.png',
    thumbnail_url: '/output/frames/1080p_s52043_frame_0001.png',
    section_slug: '2d-work',
  },
  // pandy series
  {
    title: 'pandy animation 1',
    description: 'pandy character exploration',
    long_description: 'first animation in the pandy series, exploring character personality and movement.',
    media_type: 'video',
    external_url: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
    thumbnail_url: '/output/frames/720p_s69_frame_0000.png',
    section_slug: 'pandy-series',
  },
  {
    title: 'pandy animation 2',
    description: 'pandy in action',
    long_description: 'continued adventures of pandy with more complex animation sequences.',
    media_type: 'video',
    external_url: 'https://www.youtube.com/watch?v=bdrST1IbN3k',
    thumbnail_url: '/output/frames/720p_s69_frame_0050.png',
    section_slug: 'pandy-series',
  },
]

const siteSettings = {
  intro: {
    name: 'christina shi',
    bio: "hello! i'm a 3d artist based in nyc. i combine my background in tech and software engineering with my love of art and animation to create beautiful things!",
    headshot: '/images/headshot.png',
  },
  contact: {
    email: 'christina@example.com',
    linkedin: 'https://linkedin.com/in/christinashi',
    instagram: 'https://instagram.com/christinashi',
    message: "i'd love to hear from you! feel free to reach out via email or connect with me on social media.",
  },
  landing: {
    title: "welcome to christina shi's portfolio flipbook!",
    subtitle: 'interactive 3d art portfolio',
  },
  code: {
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
  },
  gallery_descriptions: {
    '3d-work': 'i work primarily in maya, creating character models, environments, and animations.',
    '2d-work': 'digital illustrations and concept art.',
    'pandy-series': 'my ongoing character animation series featuring pandy the panda.',
  },
}

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('missing environment variables:')
    console.error('- NEXT_PUBLIC_SUPABASE_URL')
    console.error('- SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log('seeding database...\n')

  // 1. insert sections
  console.log('inserting sections...')
  const sectionData = sectionMappings.map((s, index) => ({
    slug: s.id,
    title: s.section,
    physical_page_start: s.physicalPage,
    display_order: index,
    is_visible: true,
  }))

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .upsert(sectionData, { onConflict: 'slug' })
    .select()

  if (sectionsError) {
    console.error('error inserting sections:', sectionsError)
    process.exit(1)
  }
  console.log(`  inserted ${sections?.length} sections`)

  // create a map of section slugs to ids
  const sectionMap = new Map<string, string>()
  sections?.forEach(s => sectionMap.set(s.slug, s.id))

  // 2. insert artworks
  console.log('inserting artworks...')
  const artworkData = artworks.map(a => ({
    title: a.title,
    description: a.description,
    long_description: a.long_description,
    media_type: a.media_type,
    cloudinary_url: a.cloudinary_url || null,
    thumbnail_url: a.thumbnail_url,
    external_url: a.external_url || null,
  }))

  const { data: insertedArtworks, error: artworksError } = await supabase
    .from('artworks')
    .insert(artworkData)
    .select()

  if (artworksError) {
    console.error('error inserting artworks:', artworksError)
    process.exit(1)
  }
  console.log(`  inserted ${insertedArtworks?.length} artworks`)

  // 3. create gallery_items (link artworks to sections)
  console.log('creating gallery items...')
  const galleryItems: Array<{ section_id: string; artwork_id: string; display_order: number }> = []

  // group artworks by section
  const artworksBySection = new Map<string, typeof insertedArtworks>()
  artworks.forEach((a, index) => {
    const sectionSlug = a.section_slug
    if (!artworksBySection.has(sectionSlug)) {
      artworksBySection.set(sectionSlug, [])
    }
    artworksBySection.get(sectionSlug)?.push(insertedArtworks![index])
  })

  artworksBySection.forEach((sectionArtworks, sectionSlug) => {
    const sectionId = sectionMap.get(sectionSlug)
    if (!sectionId) return

    sectionArtworks.forEach((artwork, order) => {
      galleryItems.push({
        section_id: sectionId,
        artwork_id: artwork.id,
        display_order: order,
      })
    })
  })

  const { error: galleryError } = await supabase
    .from('gallery_items')
    .insert(galleryItems)

  if (galleryError) {
    console.error('error creating gallery items:', galleryError)
    process.exit(1)
  }
  console.log(`  created ${galleryItems.length} gallery items`)

  // 4. insert site settings
  console.log('inserting site settings...')
  const settingsData = Object.entries(siteSettings).map(([key, value]) => ({
    key,
    value,
  }))

  const { error: settingsError } = await supabase
    .from('site_settings')
    .upsert(settingsData, { onConflict: 'key' })

  if (settingsError) {
    console.error('error inserting site settings:', settingsError)
    process.exit(1)
  }
  console.log(`  inserted ${settingsData.length} site settings`)

  console.log('\nseeding complete!')
}

seed().catch(console.error)
