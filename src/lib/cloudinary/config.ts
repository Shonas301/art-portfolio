// cloudinary configuration and helper utilities for the art portfolio
// uses next-cloudinary for client-side components and cloudinary sdk for server operations

import { v2 as cloudinary } from "cloudinary";

// cloudinary cloud name from environment
export const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// default folder structure for portfolio uploads
export const PORTFOLIO_FOLDERS = {
  artworks: "portfolio/artworks",
  thumbnails: "portfolio/thumbnails",
  gallery2d: "portfolio/2d-work",
  gallery3d: "portfolio/3d-work",
  pandySeries: "portfolio/pandy-series",
  code: "portfolio/code",
} as const;

// type definitions for cloudinary upload responses
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  asset_id?: string;
  version: number;
  version_id?: string;
  signature?: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: "image" | "video" | "raw" | "auto";
  created_at: string;
  bytes: number;
  type: string;
  etag?: string;
  placeholder?: boolean;
  original_filename?: string;
  folder?: string;
}

export interface CloudinaryDeleteResponse {
  result: "ok" | "not found";
}

export interface CloudinaryError {
  message: string;
  http_code: number;
}

// transformation options for generating optimized urls
export interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "pad" | "crop" | "thumb";
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
  effect?: string;
  blur?: number;
}

// configure cloudinary sdk for server-side operations
export function configureCloudinary() {
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set for server operations");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

// helper function to generate optimized image urls
// uses cloudinary's automatic optimization by default
export function getOptimizedImageUrl(
  publicId: string,
  options: TransformationOptions = {}
): string {
  if (!cloudName) {
    console.warn("cloudinary cloud name not configured, returning public_id");
    return publicId;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
    effect,
    blur,
  } = options;

  // build transformation string
  const transformations: string[] = [];

  if (width || height) {
    let cropTransform = `c_${crop}`;
    if (width) cropTransform += `,w_${width}`;
    if (height) cropTransform += `,h_${height}`;
    if (gravity) cropTransform += `,g_${gravity}`;
    transformations.push(cropTransform);
  }

  // quality and format
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  // optional effects
  if (effect) transformations.push(`e_${effect}`);
  if (blur) transformations.push(`e_blur:${blur}`);

  const transformationString = transformations.join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
}

// helper function to generate thumbnail urls with preset transformations
// optimized for gallery grid display
export function getThumbnailUrl(
  publicId: string,
  size: "small" | "medium" | "large" = "medium"
): string {
  const sizeConfigs: Record<string, TransformationOptions> = {
    small: { width: 150, height: 150, crop: "thumb", gravity: "auto" },
    medium: { width: 300, height: 300, crop: "thumb", gravity: "auto" },
    large: { width: 600, height: 600, crop: "thumb", gravity: "auto" },
  };

  return getOptimizedImageUrl(publicId, {
    ...sizeConfigs[size],
    quality: "auto:good",
    format: "auto",
  });
}

// helper function to generate responsive image srcset
export function getResponsiveSrcSet(publicId: string): string {
  const widths = [320, 640, 960, 1280, 1920];

  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(publicId, {
        width,
        crop: "scale",
        quality: "auto",
        format: "auto",
      });
      return `${url} ${width}w`;
    })
    .join(", ");
}

// helper function to delete images from cloudinary (requires api key/secret)
// should only be called from server-side code with admin authentication
export async function deleteImage(publicId: string): Promise<CloudinaryDeleteResponse> {
  const cld = configureCloudinary();

  try {
    const result = await cld.uploader.destroy(publicId);
    return result as CloudinaryDeleteResponse;
  } catch (error) {
    const cloudinaryError = error as CloudinaryError;
    throw new Error(`failed to delete image: ${cloudinaryError.message}`);
  }
}

// helper function to delete multiple images
export async function deleteImages(publicIds: string[]): Promise<{ deleted: Record<string, string> }> {
  const cld = configureCloudinary();

  try {
    const result = await cld.api.delete_resources(publicIds);
    return result as { deleted: Record<string, string> };
  } catch (error) {
    const cloudinaryError = error as CloudinaryError;
    throw new Error(`failed to delete images: ${cloudinaryError.message}`);
  }
}

// generate a signed upload url for client-side uploads
// the signature ensures the upload params can't be tampered with
export function generateSignedUploadParams(folder: string = PORTFOLIO_FOLDERS.artworks): {
  timestamp: number;
  signature: string;
  folder: string;
  api_key: string;
  cloud_name: string;
} {
  const cld = configureCloudinary();
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cld.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY!,
    cloud_name: cloudName!,
  };
}

// upload image directly from server (buffer or base64)
export async function uploadImage(
  file: Buffer | string,
  options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
    resourceType?: "image" | "video" | "raw" | "auto";
  } = {}
): Promise<CloudinaryUploadResponse> {
  const cld = configureCloudinary();

  const {
    folder = PORTFOLIO_FOLDERS.artworks,
    publicId,
    tags = [],
    resourceType = "auto",
  } = options;

  try {
    // convert buffer to base64 data uri if needed
    const uploadSource =
      Buffer.isBuffer(file)
        ? `data:image/png;base64,${file.toString("base64")}`
        : file;

    const result = await cld.uploader.upload(uploadSource, {
      folder,
      public_id: publicId,
      tags,
      resource_type: resourceType,
      overwrite: true,
      invalidate: true,
    });

    return result as CloudinaryUploadResponse;
  } catch (error) {
    const cloudinaryError = error as CloudinaryError;
    throw new Error(`failed to upload image: ${cloudinaryError.message}`);
  }
}

// get details about an uploaded resource
export async function getImageDetails(publicId: string): Promise<CloudinaryUploadResponse | null> {
  const cld = configureCloudinary();

  try {
    const result = await cld.api.resource(publicId);
    return result as CloudinaryUploadResponse;
  } catch (error) {
    const cloudinaryError = error as CloudinaryError;
    if (cloudinaryError.http_code === 404) {
      return null;
    }
    throw new Error(`failed to get image details: ${cloudinaryError.message}`);
  }
}
