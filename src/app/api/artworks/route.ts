// api routes for artwork collection
// get: list artworks (public), post: create artwork (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { authOptions } from '@/lib/auth/config';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import type { ArtworkInsert, MediaType } from '@/lib/supabase/types';

// valid media types for validation
const VALID_MEDIA_TYPES: MediaType[] = ['image', 'video', 'model_3d', 'gif'];

// get: list all artworks with optional filtering
// public endpoint - no auth required
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    // parse query params
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('section_id');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // validate limit and offset
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'offset must be a non-negative integer' },
        { status: 400 }
      );
    }

    // if section_id provided, join with gallery_items and filter
    if (sectionId) {
      const { data, error, count } = await supabase
        .from('gallery_items')
        .select(
          `
          display_order,
          artwork:artworks (*)
        `,
          { count: 'exact' }
        )
        .eq('section_id', sectionId)
        .order('display_order', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('supabase error fetching artworks by section:', error);
        return NextResponse.json(
          { error: 'failed to fetch artworks' },
          { status: 500 }
        );
      }

      // extract artworks from the joined result
      const artworks = data?.map((item) => item.artwork).filter(Boolean) || [];

      return NextResponse.json({
        data: artworks,
        meta: {
          total: count || 0,
          limit,
          offset,
          section_id: sectionId,
        },
      });
    }

    // no section filter - get all artworks ordered by created_at
    const { data, error, count } = await supabase
      .from('artworks')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('supabase error fetching artworks:', error);
      return NextResponse.json(
        { error: 'failed to fetch artworks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      meta: {
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('unexpected error in GET /api/artworks:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// post: create new artwork
// requires admin authentication
export async function POST(request: NextRequest) {
  try {
    // check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'unauthorized - please sign in' },
        { status: 401 }
      );
    }

    // check admin access
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'forbidden - admin access required' },
        { status: 403 }
      );
    }

    // parse request body
    let body: Partial<ArtworkInsert>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'invalid json body' },
        { status: 400 }
      );
    }

    // validate required fields
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json(
        { error: 'title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!body.media_type || !VALID_MEDIA_TYPES.includes(body.media_type)) {
      return NextResponse.json(
        {
          error: `media_type is required and must be one of: ${VALID_MEDIA_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // construct the insert data with defaults
    const artworkData: ArtworkInsert = {
      title: body.title.trim(),
      media_type: body.media_type,
      description: body.description || null,
      long_description: body.long_description || null,
      cloudinary_public_id: body.cloudinary_public_id || null,
      cloudinary_url: body.cloudinary_url || null,
      thumbnail_url: body.thumbnail_url || null,
      external_url: body.external_url || null,
      materials: body.materials || null,
      dimensions: body.dimensions || null,
      year_created: body.year_created || null,
      is_for_sale: body.is_for_sale ?? false,
      shop_url: body.shop_url || null,
      price_range: body.price_range || null,
    };

    // create supabase client and insert
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    const { data, error } = await supabase
      .from('artworks')
      .insert(artworkData)
      .select()
      .single();

    if (error) {
      console.error('supabase error creating artwork:', error);
      return NextResponse.json(
        { error: 'failed to create artwork' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('unexpected error in POST /api/artworks:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
