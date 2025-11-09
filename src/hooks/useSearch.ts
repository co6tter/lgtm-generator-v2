"use client";

import useSWR from "swr";
import { searchImages } from "@/lib/api-client";
import type { ImageSource, SearchResult } from "@/types";

interface UseSearchOptions {
  query: string;
  source: ImageSource;
  page?: number;
  perPage?: number;
  imageType?: "photo" | "illustration" | "vector" | "all";
}

interface UseSearchResult {
  data: SearchResult | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
}

export function useSearch({
  query,
  source,
  page = 1,
  perPage = 20,
  imageType,
}: UseSearchOptions): UseSearchResult {
  // Create a unique key for SWR cache
  const key =
    query.trim().length >= 2
      ? `/search/${source}?query=${query}&page=${page}&perPage=${perPage}${imageType ? `&imageType=${imageType}` : ""}`
      : null;

  const { data, error, isLoading, isValidating } = useSWR(
    key,
    () =>
      searchImages(source, {
        query,
        page,
        perPage,
        imageType,
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    },
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
  };
}
