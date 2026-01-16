// api routes for individual section operations
// get: fetch single section with artworks (public)
// put: update section (admin only)
// delete: remove section with cascade (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createClient } from '@/lib/supabase/server';
import type { SectionUpdate } from '@/lib/supabase/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// get a single section with its artworks
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // fetch the section
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('*')
      .eq('id', id)
      .single();

    if (sectionError) {
      if (sectionError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'section not found' },
          { status: 404 }
        );
      }
      console.error('error fetching section:', sectionError);
      return NextResponse.json(
        { error: 'failed to fetch section' },
        { status: 500 }
      );
    }

    // fetch gallery_items with joined artworks, ordered by display_order
    const { data: galleryItems, error: galleryError } = await supabase
      .from('gallery_items')
      .select(`
        id,
        display_order,
        artwork_id,
        artworks (*)
      `)
      .eq('section_id', id)
      .order('display_order', { ascending: true });

    if (galleryError) {
      console.error('error fetching gallery items:', galleryError);
      return NextResponse.json(
        { error: 'failed to fetch section artworks' },
        { status: 500 }
      );
    }

    // transform the response to include artworks array
    const artworks = galleryItems?.map((item) => ({
      gallery_item_id: item.id,
      display_order: item.display_order,
      artwork: item.artworks,
    }));

    return NextResponse.json({
      data: {
        ...section,
        artworks,
        artwork_count: artworks?.length || 0,
      },
    });
  } catch (error) {
    console.error('unexpected error in GET /api/sections/[id]:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// update a section (requires admin auth)
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
    const { slug, title, description, physical_page_start, display_order, is_visible } = body;

    const supabase = await createClient();

    // check if section exists
    const { data: existingSection, error: checkError } = await supabase
      .from('sections')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingSection) {
      return NextResponse.json(
        { error: 'section not found' },
        { status: 404 }
      );
    }

    // if slug is being changed, check for uniqueness
    if (slug) {
      const { data: slugCheck, error: slugError } = await supabase
        .from('sections')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (slugError && slugError.code !== 'PGRST116') {
        console.error('error checking slug uniqueness:', slugError);
        return NextResponse.json(
          { error: 'failed to validate slug uniqueness' },
          { status: 500 }
        );
      }

      if (slugCheck) {
        return NextResponse.json(
          { error: 'a section with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // build update object with only provided fields
    const updateData: SectionUpdate = {};

    if (slug !== undefined) updateData.slug = slug;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (physical_page_start !== undefined) updateData.physical_page_start = physical_page_start;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_visible !== undefined) updateData.is_visible = is_visible;

    // always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // update the section
    const { data: updatedSection, error: updateError } = await supabase
      .from('sections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('error updating section:', updateError);
      return NextResponse.json(
        { error: 'failed to update section' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updatedSection });
  } catch (error) {
    console.error('unexpected error in PUT /api/sections/[id]:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// delete a section with cascade to gallery_items (requires admin auth)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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
    const supabase = await createClient();

    // check if section exists
    const { data: existingSection, error: checkError } = await supabase
      .from('sections')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingSection) {
      return NextResponse.json(
        { error: 'section not found' },
        { status: 404 }
      );
    }

    // delete associated gallery_items first (cascade)
    const { error: galleryDeleteError } = await supabase
      .from('gallery_items')
      .delete()
      .eq('section_id', id);

    if (galleryDeleteError) {
      console.error('error deleting gallery items:', galleryDeleteError);
      return NextResponse.json(
        { error: 'failed to delete associated gallery items' },
        { status: 500 }
      );
    }

    // delete the section
    const { error: deleteError } = await supabase
      .from('sections')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('error deleting section:', deleteError);
      return NextResponse.json(
        { error: 'failed to delete section' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'section deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('unexpected error in DELETE /api/sections/[id]:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
