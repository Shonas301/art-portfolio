// hook for fetching and mutating artworks
// uses swr for caching and revalidation

import useSWR, { mutate } from 'swr';
import type { Artwork, ArtworkInsert, ArtworkUpdate } from '@/lib/supabase/types';

// api response types
interface ArtworksResponse {
  data: Artwork[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    section_id?: string;
  };
}

interface ArtworkResponse {
  data: Artwork;
}

interface ErrorResponse {
  error: string;
}

// fetcher function for swr
async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new Error(errorData.error || 'failed to fetch');
  }

  return response.json() as Promise<T>;
}

// build cache key for artworks endpoint
function buildArtworksKey(sectionId?: string): string {
  const baseUrl = '/api/artworks';
  if (sectionId) {
    return `${baseUrl}?section_id=${sectionId}`;
  }
  return baseUrl;
}

// hook options
interface UseArtworksOptions {
  sectionId?: string;
}

// hook return type
interface UseArtworksReturn {
  artworks: Artwork[];
  isLoading: boolean;
  error: Error | null;
  createArtwork: (data: ArtworkInsert) => Promise<Artwork>;
  updateArtwork: (id: string, data: ArtworkUpdate) => Promise<Artwork>;
  deleteArtwork: (id: string) => Promise<void>;
}

export function useArtworks(options: UseArtworksOptions = {}): UseArtworksReturn {
  const { sectionId } = options;
  const cacheKey = buildArtworksKey(sectionId);

  const { data, error, isLoading } = useSWR<ArtworksResponse>(
    cacheKey,
    fetcher
  );

  // create a new artwork
  const createArtwork = async (artworkData: ArtworkInsert): Promise<Artwork> => {
    const response = await fetch('/api/artworks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artworkData),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to create artwork');
    }

    const result = (await response.json()) as ArtworkResponse;

    // invalidate all artwork caches to ensure fresh data
    await mutate(
      (key) => typeof key === 'string' && key.startsWith('/api/artworks'),
      undefined,
      { revalidate: true }
    );

    return result.data;
  };

  // update an existing artwork
  const updateArtwork = async (id: string, artworkData: ArtworkUpdate): Promise<Artwork> => {
    const response = await fetch(`/api/artworks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artworkData),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to update artwork');
    }

    const result = (await response.json()) as ArtworkResponse;

    // invalidate all artwork caches
    await mutate(
      (key) => typeof key === 'string' && key.startsWith('/api/artworks'),
      undefined,
      { revalidate: true }
    );

    return result.data;
  };

  // delete an artwork
  const deleteArtwork = async (id: string): Promise<void> => {
    const response = await fetch(`/api/artworks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to delete artwork');
    }

    // invalidate all artwork caches
    await mutate(
      (key) => typeof key === 'string' && key.startsWith('/api/artworks'),
      undefined,
      { revalidate: true }
    );
  };

  return {
    artworks: data?.data ?? [],
    isLoading,
    error: error ?? null,
    createArtwork,
    updateArtwork,
    deleteArtwork,
  };
}
