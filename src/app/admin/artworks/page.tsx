// admin artworks management page
// server component that handles authentication and initial data fetch

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { authOptions } from '@/lib/auth/config'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { ArtworkManager } from './ArtworkManager'
import type { Artwork } from '@/lib/supabase/types'

export const metadata = {
  title: 'Artwork Management | Admin',
  description: 'Manage portfolio artworks',
}

export default async function ArtworksAdminPage() {
  // check authentication
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    // redirect to sign in if not authenticated
    redirect('/api/auth/signin?callbackUrl=/admin/artworks')
  }

  if (!session.user.isAdmin) {
    // redirect to home if not admin
    redirect('/')
  }

  // fetch initial artworks from supabase
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient(cookieStore)

  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('failed to fetch artworks:', error)
  }

  return (
    <ArtworkManager initialArtworks={(artworks as Artwork[]) || []} />
  )
}
