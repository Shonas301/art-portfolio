// api route for signed cloudinary uploads
// requires admin authentication via next-auth

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import {
  uploadImage,
  PORTFOLIO_FOLDERS,
  CloudinaryUploadResponse,
} from "@/lib/cloudinary/config";

// allowed mime types for uploads
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

// max file size: 50mb
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// valid folder keys
type FolderKey = keyof typeof PORTFOLIO_FOLDERS;

export async function POST(request: NextRequest) {
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

    // parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderKey = formData.get("folder") as FolderKey | null;
    const customPublicId = formData.get("publicId") as string | null;
    const tagsString = formData.get("tags") as string | null;

    // validate file exists
    if (!file) {
      return NextResponse.json(
        { error: "no file provided" },
        { status: 400 }
      );
    }

    // validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `invalid file type: ${file.type}. allowed types: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `file too large: ${(file.size / 1024 / 1024).toFixed(2)}mb. max size: 50mb`,
        },
        { status: 400 }
      );
    }

    // determine folder path
    const folder = folderKey && folderKey in PORTFOLIO_FOLDERS
      ? PORTFOLIO_FOLDERS[folderKey]
      : PORTFOLIO_FOLDERS.artworks;

    // parse tags if provided
    const tags = tagsString
      ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    // convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // determine resource type based on mime type
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    // upload to cloudinary
    const result: CloudinaryUploadResponse = await uploadImage(buffer, {
      folder,
      publicId: customPublicId || undefined,
      tags,
      resourceType,
    });

    // return success response with relevant upload data
    return NextResponse.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        folder: result.folder,
        original_filename: result.original_filename,
      },
    });
  } catch (error) {
    console.error("upload error:", error);

    const errorMessage = error instanceof Error
      ? error.message
      : "unknown error occurred during upload";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// handle options request for cors preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
