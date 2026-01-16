// api routes for managing artworks within a section
// get: list artworks in section (public)
// post: add artwork to section (admin only)
// put: reorder artworks in section (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createClient } from '@/lib/supabase/server';
import type { GalleryItemInsert } from '@/lib/supabase/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// get all artworks for a section
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // verify section exists
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id')
      .eq('id', id)
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'section not found' },
        { status: 404 }
      );
    }

    // fetch gallery_items with joined artworks, ordered by display_order
    const { data: galleryItems, error: galleryError } = await supabase
      .from('gallery_items')
      .select(`
        id,
        display_order,
        artwork_id,
        created_at,
        artworks (*)
      `)
      .eq('section_id', id)
      .order('display_order', { ascending: true });

    if (galleryError) {
      console.error('error fetching artworks:', galleryError);
      return NextResponse.json(
        { error: 'failed to fetch artworks' },
        { status: 500 }
      );
    }

    // transform response for cleaner api
    const artworks = galleryItems?.map((item) => ({
      gallery_item_id: item.id,
      artwork_id: item.artwork_id,
      display_order: item.display_order,
      created_at: item.created_at,
      artwork: item.artworks,
    }));

    return NextResponse.json({ data: artworks });
  } catch (error) {
    console.error('unexpected error in GET /api/sections/[id]/artworks:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// add an artwork to a section (requires admin auth)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'unauthorized - please sign in' },
        { status: 401 }
      );
    }

    // check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'forbidden - admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { artwork_id, display_order } = body;

    // validate required fields
    if (!artwork_id || typeof artwork_id !== 'string') {
      return NextResponse.json(
        { error: 'artwork_id is required and must be a string' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // verify section exists
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id')
      .eq('id', id)
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'section not found' },
        { status: 404 }
      );
    }

    // verify artwork exists
    const { data: artwork, error: artworkError } = await supabase
      .from('artworks')
      .select('id')
      .eq('id', artwork_id)
      .single();

    if (artworkError || !artwork) {
      return NextResponse.json(
        { error: 'artwork not found' },
        { status: 404 }
      );
    }

    // check if artwork is already in this section
    const { data: existingItem, error: existingError } = await supabase
      .from('gallery_items')
      .select('id')
      .eq('section_id', id)
      .eq('artwork_id', artwork_id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('error checking existing gallery item:', existingError);
      return NextResponse.json(
        { error: 'failed to validate artwork assignment' },
        { status: 500 }
      );
    }

    if (existingItem) {
      return NextResponse.json(
        { error: 'artwork is already in this section' },
        { status: 409 }
      );
    }

    // determine display_order if not provided
    let finalDisplayOrder = display_order;
    if (typeof finalDisplayOrder !== 'number') {
      // get the current max display_order for this section
      const { data: maxOrderItem, error: maxError } = await supabase
        .from('gallery_items')
        .select('display_order')
        .eq('section_id', id)
        .order('display_order', { ascending: false })
        .limit(1)
        .single();

      if (maxError && maxError.code !== 'PGRST116') {
        console.error('error getting max display_order:', maxError);
        return NextResponse.json(
          { error: 'failed to determine display order' },
          { status: 500 }
        );
      }

      finalDisplayOrder = maxOrderItem ? maxOrderItem.display_order + 1 : 0;
    }

    // create the gallery_item
    const galleryItemData: GalleryItemInsert = {
      section_id: id,
      artwork_id,
      display_order: finalDisplayOrder,
    };

    const { data: newGalleryItem, error: insertError } = await supabase
      .from('gallery_items')
      .insert(galleryItemData)
      .select(`
        id,
        display_order,
        artwork_id,
        created_at,
        artworks (*)
      `)
      .single();

    if (insertError) {
      console.error('error creating gallery item:', insertError);
      return NextResponse.json(
        { error: 'failed to add artwork to section' },
        { status: 500 }
      );
    }

    // transform response for cleaner api
    const response = {
      gallery_item_id: newGalleryItem.id,
      artwork_id: newGalleryItem.artwork_id,
      display_order: newGalleryItem.display_order,
      created_at: newGalleryItem.created_at,
      artwork: newGalleryItem.artworks,
    };

    return NextResponse.json(
      { data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error('unexpected error in POST /api/sections/[id]/artworks:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// reorder artworks in a section (requires admin auth)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'unauthorized - please sign in' },
        { status: 401 }
      );
    }

    // check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'forbidden - admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { artworks } = body;

    // validate request body format
    if (!Array.isArray(artworks)) {
      return NextResponse.json(
        { error: 'artworks must be an array of { artwork_id, display_order }' },
        { status: 400 }
      );
    }

    // validate each item in the array
    for (const item of artworks) {
      if (!item.artwork_id || typeof item.artwork_id !== 'string') {
        return NextResponse.json(
          { error: 'each item must have a valid artwork_id string' },
          { status: 400 }
        );
      }
      if (typeof item.display_order !== 'number') {
        return NextResponse.json(
          { error: 'each item must have a valid display_order number' },
          { status: 400 }
        );
      }
    }

    const supabase = await createClient();

    // verify section exists
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id')
      .eq('id', id)
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'section not found' },
        { status: 404 }
      );
    }

    // update each gallery_item's display_order
    const updatePromises = artworks.map(async (item: { artwork_id: string; display_order: number }) => {
      const { error } = await supabase
        .from('gallery_items')
        .update({ display_order: item.display_order })
        .eq('section_id', id)
        .eq('artwork_id', item.artwork_id);

      if (error) {
        throw new Error(`failed to update display_order for artwork ${item.artwork_id}: ${error.message}`);
      }
    });

    try {
      await Promise.all(updatePromises);
    } catch (updateError) {
      console.error('error updating display orders:', updateError);
      return NextResponse.json(
        { error: 'failed to reorder artworks' },
        { status: 500 }
      );
    }

    // fetch the updated artworks to return
    const { data: updatedItems, error: fetchError } = await supabase
      .from('gallery_items')
      .select(`
        id,
        display_order,
        artwork_id,
        created_at,
        artworks (*)
      `)
      .eq('section_id', id)
      .order('display_order', { ascending: true });

    if (fetchError) {
      console.error('error fetching updated artworks:', fetchError);
      return NextResponse.json(
        { error: 'artworks reordered but failed to fetch updated list' },
        { status: 500 }
      );
    }

    // transform response for cleaner api
    const response = updatedItems?.map((item) => ({
      gallery_item_id: item.id,
      artwork_id: item.artwork_id,
      display_order: item.display_order,
      created_at: item.created_at,
      artwork: item.artworks,
    }));

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('unexpected error in PUT /api/sections/[id]/artworks:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
