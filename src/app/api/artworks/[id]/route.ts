// api routes for single artwork operations
// get: fetch by id (public), put: update (admin), delete: remove (admin)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { authOptions } from '@/lib/auth/config';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import type { ArtworkUpdate, MediaType } from '@/lib/supabase/types';

// valid media types for validation
const VALID_MEDIA_TYPES: MediaType[] = ['image', 'video', 'model_3d', 'gif'];

// helper to validate uuid format
function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// route params type for next.js 15
type RouteContext = {
  params: Promise<{ id: string }>;
};

// get: fetch single artwork by id
// public endpoint - no auth required
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // validate id format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'invalid artwork id format' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // check if it's a not found error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'artwork not found' },
          { status: 404 }
        );
      }

      console.error('supabase error fetching artwork:', error);
      return NextResponse.json(
        { error: 'failed to fetch artwork' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('unexpected error in GET /api/artworks/[id]:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// put: update artwork by id
// requires admin authentication
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // validate id format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'invalid artwork id format' },
        { status: 400 }
      );
    }

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
    let body: Partial<ArtworkUpdate>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'invalid json body' }, { status: 400 });
    }

    // validate media_type if provided
    if (body.media_type && !VALID_MEDIA_TYPES.includes(body.media_type)) {
      return NextResponse.json(
        {
          error: `media_type must be one of: ${VALID_MEDIA_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // validate title if provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return NextResponse.json(
          { error: 'title must be a non-empty string' },
          { status: 400 }
        );
      }
      body.title = body.title.trim();
    }

    // build update data - only include fields that were provided
    const updateData: ArtworkUpdate = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.media_type !== undefined) updateData.media_type = body.media_type;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.long_description !== undefined)
      updateData.long_description = body.long_description;
    if (body.cloudinary_public_id !== undefined)
      updateData.cloudinary_public_id = body.cloudinary_public_id;
    if (body.cloudinary_url !== undefined)
      updateData.cloudinary_url = body.cloudinary_url;
    if (body.thumbnail_url !== undefined)
      updateData.thumbnail_url = body.thumbnail_url;
    if (body.external_url !== undefined)
      updateData.external_url = body.external_url;
    if (body.materials !== undefined) updateData.materials = body.materials;
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;
    if (body.year_created !== undefined)
      updateData.year_created = body.year_created;
    if (body.is_for_sale !== undefined)
      updateData.is_for_sale = body.is_for_sale;
    if (body.shop_url !== undefined) updateData.shop_url = body.shop_url;
    if (body.price_range !== undefined)
      updateData.price_range = body.price_range;

    // check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'no valid fields provided for update' },
        { status: 400 }
      );
    }

    // set updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    // first check if artwork exists
    const { data: existing, error: existsError } = await supabase
      .from('artworks')
      .select('id')
      .eq('id', id)
      .single();

    if (existsError || !existing) {
      return NextResponse.json({ error: 'artwork not found' }, { status: 404 });
    }

    // perform update
    const { data, error } = await supabase
      .from('artworks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('supabase error updating artwork:', error);
      return NextResponse.json(
        { error: 'failed to update artwork' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('unexpected error in PUT /api/artworks/[id]:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// delete: remove artwork by id
// requires admin authentication
// note: gallery_items referencing this artwork are deleted via cascade
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // validate id format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'invalid artwork id format' },
        { status: 400 }
      );
    }

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

    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    // first check if artwork exists
    const { data: existing, error: existsError } = await supabase
      .from('artworks')
      .select('id')
      .eq('id', id)
      .single();

    if (existsError || !existing) {
      return NextResponse.json({ error: 'artwork not found' }, { status: 404 });
    }

    // perform delete - cascade will handle gallery_items
    const { error } = await supabase.from('artworks').delete().eq('id', id);

    if (error) {
      console.error('supabase error deleting artwork:', error);
      return NextResponse.json(
        { error: 'failed to delete artwork' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'artwork deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('unexpected error in DELETE /api/artworks/[id]:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
