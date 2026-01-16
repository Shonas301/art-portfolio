// hook for fetching and mutating sections
// uses swr for caching and revalidation

import useSWR, { mutate } from 'swr';
import type { Section, SectionInsert, SectionUpdate } from '@/lib/supabase/types';

// section with artwork count returned from api
interface SectionWithCount extends Section {
  artwork_count: number;
}

// api response types
interface SectionsResponse {
  data: SectionWithCount[];
}

interface SectionResponse {
  data: Section;
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

// cache key for sections endpoint
const SECTIONS_KEY = '/api/sections';

// hook return type
interface UseSectionsReturn {
  sections: SectionWithCount[];
  isLoading: boolean;
  error: Error | null;
  createSection: (data: SectionInsert) => Promise<Section>;
  updateSection: (id: string, data: SectionUpdate) => Promise<Section>;
  deleteSection: (id: string) => Promise<void>;
}

export function useSections(): UseSectionsReturn {
  const { data, error, isLoading } = useSWR<SectionsResponse>(
    SECTIONS_KEY,
    fetcher
  );

  // create a new section
  const createSection = async (sectionData: SectionInsert): Promise<Section> => {
    const response = await fetch('/api/sections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sectionData),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to create section');
    }

    const result = (await response.json()) as SectionResponse;

    // invalidate sections cache to refetch with new data
    await mutate(SECTIONS_KEY);

    return result.data;
  };

  // update an existing section
  const updateSection = async (id: string, sectionData: SectionUpdate): Promise<Section> => {
    const response = await fetch(`/api/sections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sectionData),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to update section');
    }

    const result = (await response.json()) as SectionResponse;

    // invalidate sections cache
    await mutate(SECTIONS_KEY);

    return result.data;
  };

  // delete a section
  const deleteSection = async (id: string): Promise<void> => {
    const response = await fetch(`/api/sections/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to delete section');
    }

    // invalidate sections cache
    await mutate(SECTIONS_KEY);
  };

  return {
    sections: data?.data ?? [],
    isLoading,
    error: error ?? null,
    createSection,
    updateSection,
    deleteSection,
  };
}

// re-export the section with count type for convenience
export type { SectionWithCount };
