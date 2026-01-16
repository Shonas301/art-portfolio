// api route for commission/contact inquiries
// get: list all inquiries (admin only)
// post: submit new inquiry (public)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { createClient } from "@/lib/supabase/server";
import type { InquiryInsert, InquiryStatus } from "@/lib/supabase/types";

// valid inquiry types for validation
const VALID_INQUIRY_TYPES = ["commission", "purchase", "general"] as const;
type ValidInquiryType = (typeof VALID_INQUIRY_TYPES)[number];

// valid statuses for filtering
const VALID_STATUSES: InquiryStatus[] = ["new", "read", "responded", "archived"];

// email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// get: list all inquiries (requires admin auth)
export async function GET(request: NextRequest) {
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

    // parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as InquiryStatus | null;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `invalid status: ${status}. valid statuses: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // validate limit and offset
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "limit must be a number between 1 and 100" },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: "offset must be a non-negative number" },
        { status: 400 }
      );
    }

    // create supabase client
    const supabase = await createClient();

    // build query - select inquiries with optional artwork join
    let query = supabase
      .from("inquiries")
      .select(
        `
        *,
        artwork:artworks (
          id,
          title,
          thumbnail_url,
          cloudinary_url
        )
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // apply status filter if provided
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("error fetching inquiries:", error);
      return NextResponse.json(
        { error: "failed to fetch inquiries" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        limit,
        offset,
        count: count ?? data?.length ?? 0,
      },
    });
  } catch (error) {
    console.error("get inquiries error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "unknown error occurred while fetching inquiries";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// post: submit new inquiry (public, no auth required)
export async function POST(request: NextRequest) {
  try {
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

    const { name, email, inquiry_type, message, artwork_id } = body as {
      name?: string;
      email?: string;
      inquiry_type?: string;
      message?: string;
      artwork_id?: string;
    };

    // validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    // validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "invalid email format" },
        { status: 400 }
      );
    }

    if (!inquiry_type || typeof inquiry_type !== "string") {
      return NextResponse.json(
        { error: "inquiry_type is required" },
        { status: 400 }
      );
    }

    // validate inquiry_type is one of the allowed values
    if (!VALID_INQUIRY_TYPES.includes(inquiry_type as ValidInquiryType)) {
      return NextResponse.json(
        {
          error: `invalid inquiry_type: ${inquiry_type}. must be one of: ${VALID_INQUIRY_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    // validate artwork_id if provided
    if (artwork_id !== undefined && artwork_id !== null) {
      if (typeof artwork_id !== "string") {
        return NextResponse.json(
          { error: "artwork_id must be a string" },
          { status: 400 }
        );
      }
    }

    // create supabase client
    const supabase = await createClient();

    // if artwork_id is provided, verify it exists
    if (artwork_id) {
      const { data: artwork, error: artworkError } = await supabase
        .from("artworks")
        .select("id")
        .eq("id", artwork_id)
        .single();

      if (artworkError || !artwork) {
        return NextResponse.json(
          { error: "artwork not found" },
          { status: 404 }
        );
      }
    }

    // prepare inquiry data
    const inquiryData: InquiryInsert = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      inquiry_type: inquiry_type as ValidInquiryType,
      message: message.trim(),
      artwork_id: artwork_id || null,
      status: "new",
    };

    // insert inquiry
    const { data, error } = await supabase
      .from("inquiries")
      .insert(inquiryData)
      .select()
      .single();

    if (error) {
      console.error("error creating inquiry:", error);
      return NextResponse.json(
        { error: "failed to submit inquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "inquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("post inquiry error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "unknown error occurred while submitting inquiry";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// handle options request for cors preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
