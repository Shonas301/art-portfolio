// api route for single inquiry operations
// get: get single inquiry (admin only)
// put: update inquiry status (admin only)
// delete: delete inquiry (admin only)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { createClient } from "@/lib/supabase/server";
import type { InquiryStatus } from "@/lib/supabase/types";

// valid statuses for updating
const VALID_STATUSES: InquiryStatus[] = ["new", "read", "responded", "archived"];

// route params type
interface RouteParams {
  params: Promise<{ id: string }>;
}

// get: get single inquiry by id (requires admin auth)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    // check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "unauthorized - please sign in" },
        { status: 401 }
      );
    }

    // check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "forbidden - admin access required" },
        { status: 403 }
      );
    }

    // get inquiry id from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "inquiry id is required" },
        { status: 400 }
      );
    }

    // create supabase client
    const supabase = await createClient();

    // fetch inquiry with artwork info
    const { data, error } = await supabase
      .from("inquiries")
      .select(
        `
        *,
        artwork:artworks (
          id,
          title,
          description,
          thumbnail_url,
          cloudinary_url,
          media_type
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "inquiry not found" },
          { status: 404 }
        );
      }
      console.error("error fetching inquiry:", error);
      return NextResponse.json(
        { error: "failed to fetch inquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("get inquiry error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "unknown error occurred while fetching inquiry";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// put: update inquiry status (requires admin auth)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "unauthorized - please sign in" },
        { status: 401 }
      );
    }

    // check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "forbidden - admin access required" },
        { status: 403 }
      );
    }

    // get inquiry id from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "inquiry id is required" },
        { status: 400 }
      );
    }

    // parse request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "invalid json in request body" },
        { status: 400 }
      );
    }

    const { status } = body as { status?: string };

    // validate that only status field is being updated
    const allowedFields = ["status"];
    const providedFields = Object.keys(body);
    const invalidFields = providedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          error: `only status field can be updated. invalid fields: ${invalidFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // validate status is provided
    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    // validate status value
    if (!VALID_STATUSES.includes(status as InquiryStatus)) {
      return NextResponse.json(
        {
          error: `invalid status: ${status}. valid statuses: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // create supabase client
    const supabase = await createClient();

    // check if inquiry exists first
    const { data: existing, error: existingError } = await supabase
      .from("inquiries")
      .select("id")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: "inquiry not found" },
        { status: 404 }
      );
    }

    // update inquiry status
    const { data, error } = await supabase
      .from("inquiries")
      .update({ status: status as InquiryStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("error updating inquiry:", error);
      return NextResponse.json(
        { error: "failed to update inquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "inquiry status updated successfully",
    });
  } catch (error) {
    console.error("put inquiry error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "unknown error occurred while updating inquiry";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// delete: delete inquiry (requires admin auth)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    // check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "unauthorized - please sign in" },
        { status: 401 }
      );
    }

    // check if user is admin
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "forbidden - admin access required" },
        { status: 403 }
      );
    }

    // get inquiry id from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "inquiry id is required" },
        { status: 400 }
      );
    }

    // create supabase client
    const supabase = await createClient();

    // check if inquiry exists first
    const { data: existing, error: existingError } = await supabase
      .from("inquiries")
      .select("id")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: "inquiry not found" },
        { status: 404 }
      );
    }

    // delete inquiry
    const { error } = await supabase.from("inquiries").delete().eq("id", id);

    if (error) {
      console.error("error deleting inquiry:", error);
      return NextResponse.json(
        { error: "failed to delete inquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "inquiry deleted successfully",
    });
  } catch (error) {
    console.error("delete inquiry error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "unknown error occurred while deleting inquiry";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// handle options request for cors preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
