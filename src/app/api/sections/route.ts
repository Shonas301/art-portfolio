// api routes for sections collection
// get: list all sections (public)
// post: create new section (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createClient } from '@/lib/supabase/server';
import type { SectionInsert } from '@/lib/supabase/types';

// get all sections ordered by display_order with artwork counts
export async function GET() {
  try {
    const supabase = await createClient();

    // fetch sections ordered by display_order
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (sectionsError) {
      console.error('error fetching sections:', sectionsError);
      return NextResponse.json(
        { error: 'failed to fetch sections' },
        { status: 500 }
      );
    }

    // fetch artwork counts per section
    const { data: counts, error: countsError } = await supabase
      .from('gallery_items')
      .select('section_id');

    if (countsError) {
      console.error('error fetching artwork counts:', countsError);
      return NextResponse.json(
        { error: 'failed to fetch artwork counts' },
        { status: 500 }
      );
    }

    // calculate artwork count per section
    const countMap = new Map<string, number>();
    counts?.forEach((item) => {
      const current = countMap.get(item.section_id) || 0;
      countMap.set(item.section_id, current + 1);
    });

    // add artwork_count to each section
    const sectionsWithCounts = sections?.map((section) => ({
      ...section,
      artwork_count: countMap.get(section.id) || 0,
    }));

    return NextResponse.json({ data: sectionsWithCounts });
  } catch (error) {
    console.error('unexpected error in GET /api/sections:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

// create a new section (requires admin auth)
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

    // check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'forbidden - admin access required' },
        { status: 403 }
      );
    }

    // parse request body
    const body = await request.json();
    const { slug, title, description, physical_page_start, display_order, is_visible } = body;

    // validate required fields
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'slug is required and must be a string' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'title is required and must be a string' },
        { status: 400 }
      );
    }

    if (typeof physical_page_start !== 'number') {
      return NextResponse.json(
        { error: 'physical_page_start is required and must be a number' },
        { status: 400 }
      );
    }

    if (typeof display_order !== 'number') {
      return NextResponse.json(
        { error: 'display_order is required and must be a number' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // check for slug uniqueness
    const { data: existingSection, error: checkError } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', slug)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is what we want
      console.error('error checking slug uniqueness:', checkError);
      return NextResponse.json(
        { error: 'failed to validate slug uniqueness' },
        { status: 500 }
      );
    }

    if (existingSection) {
      return NextResponse.json(
        { error: 'a section with this slug already exists' },
        { status: 409 }
      );
    }

    // prepare section data for insert
    const sectionData: SectionInsert = {
      slug,
      title,
      description: description || null,
      physical_page_start,
      display_order,
      is_visible: is_visible !== undefined ? is_visible : true,
    };

    // insert the new section
    const { data: newSection, error: insertError } = await supabase
      .from('sections')
      .insert(sectionData)
      .select()
      .single();

    if (insertError) {
      console.error('error creating section:', insertError);
      return NextResponse.json(
        { error: 'failed to create section' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: newSection },
      { status: 201 }
    );
  } catch (error) {
    console.error('unexpected error in POST /api/sections:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
