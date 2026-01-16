// api route for site settings
// GET: fetch all site settings (public)
// PUT: update site settings (admin only)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { authOptions } from '@/lib/auth/config'
import { createRouteHandlerClient, createAdminClient } from '@/lib/supabase/server'
import type { SiteSetting, SiteSettingInsert } from '@/lib/supabase/types'

// GET /api/settings - fetch all site settings
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient(cookieStore)

    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')

    if (error) {
      console.error('error fetching settings:', error)
      return NextResponse.json(
        { error: 'failed to fetch settings' },
        { status: 500 }
      )
    }

    // convert array to object keyed by setting key
    const settingsMap: Record<string, unknown> = {}
    settings?.forEach((setting: SiteSetting) => {
      settingsMap[setting.key] = setting.value
    })

    return NextResponse.json({
      success: true,
      data: settingsMap,
    })
  } catch (error) {
    console.error('settings GET error:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - update site settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    // check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'key and value are required' },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()

    const settingData: SiteSettingInsert = {
      key,
      value,
      updated_at: new Date().toISOString(),
    }

    const { data: setting, error } = await supabase
      .from('site_settings')
      .upsert(settingData, { onConflict: 'key' })
      .select()
      .single()

    if (error) {
      console.error('error updating setting:', error)
      return NextResponse.json(
        { error: 'failed to update setting' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: setting,
    })
  } catch (error) {
    console.error('settings PUT error:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}
