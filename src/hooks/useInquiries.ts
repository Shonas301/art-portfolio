// hook for fetching and mutating inquiries (admin only)
// uses swr for caching and revalidation

import useSWR, { mutate } from 'swr';
import type {
  InquiryWithArtwork,
  InquiryStatus,
  InquiryUpdate,
} from '@/lib/supabase/types';

// api response types
interface InquiriesResponse {
  success: boolean;
  data: InquiryWithArtwork[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
  };
}

interface InquiryResponse {
  success: boolean;
  data: InquiryWithArtwork;
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

// build cache key for inquiries endpoint
function buildInquiriesKey(status?: InquiryStatus): string {
  const baseUrl = '/api/inquiries';
  if (status) {
    return `${baseUrl}?status=${status}`;
  }
  return baseUrl;
}

// hook options
interface UseInquiriesOptions {
  status?: InquiryStatus;
}

// hook return type
interface UseInquiriesReturn {
  inquiries: InquiryWithArtwork[];
  isLoading: boolean;
  error: Error | null;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<InquiryWithArtwork>;
  deleteInquiry: (id: string) => Promise<void>;
}

export function useInquiries(options: UseInquiriesOptions = {}): UseInquiriesReturn {
  const { status } = options;
  const cacheKey = buildInquiriesKey(status);

  const { data, error, isLoading } = useSWR<InquiriesResponse>(
    cacheKey,
    fetcher
  );

  // update an inquiry's status
  const updateInquiryStatus = async (
    id: string,
    newStatus: InquiryStatus
  ): Promise<InquiryWithArtwork> => {
    const updateData: InquiryUpdate = { status: newStatus };

    const response = await fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to update inquiry status');
    }

    const result = (await response.json()) as InquiryResponse;

    // invalidate all inquiries caches to ensure fresh data
    await mutate(
      (key) => typeof key === 'string' && key.startsWith('/api/inquiries'),
      undefined,
      { revalidate: true }
    );

    return result.data;
  };

  // delete an inquiry
  const deleteInquiry = async (id: string): Promise<void> => {
    const response = await fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse;
      throw new Error(errorData.error || 'failed to delete inquiry');
    }

    // invalidate all inquiries caches
    await mutate(
      (key) => typeof key === 'string' && key.startsWith('/api/inquiries'),
      undefined,
      { revalidate: true }
    );
  };

  return {
    inquiries: data?.data ?? [],
    isLoading,
    error: error ?? null,
    updateInquiryStatus,
    deleteInquiry,
  };
}
