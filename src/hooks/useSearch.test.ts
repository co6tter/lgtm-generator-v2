import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { SWRConfig } from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SearchResult } from "@/types";
import { useSearch } from "./useSearch";

// Mock api-client
vi.mock("@/lib/api-client");

const { searchImages } = await import("@/lib/api-client");

// Wrapper component for SWR
const createWrapper = () => {
  return ({ children }: { children: ReactNode }) =>
    createElement(
      SWRConfig,
      {
        value: {
          dedupingInterval: 0,
          provider: () => new Map(),
        },
      },
      children,
    );
};

describe("useSearch Hook", () => {
  const mockSearchResult: SearchResult = {
    query: "cat",
    source: "unsplash",
    images: [
      {
        id: "1",
        url: "https://example.com/image.jpg",
        thumbnailUrl: "https://example.com/thumb.jpg",
        width: 800,
        height: 600,
        alt: "Cat photo",
        photographer: "John Doe",
        photographerUrl: "https://example.com/john",
        source: "unsplash",
        sourceUrl: "https://unsplash.com/photos/1",
      },
    ],
    totalResults: 100,
    page: 1,
    perPage: 20,
    totalPages: 5,
    timestamp: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return search results when query is valid", async () => {
    vi.mocked(searchImages).mockResolvedValue(mockSearchResult);

    const { result } = renderHook(
      () =>
        useSearch({
          query: "cat",
          source: "unsplash",
          page: 1,
          perPage: 20,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSearchResult);
    expect(result.current.error).toBeUndefined();
  });

  it("should not fetch when query is too short", async () => {
    const { result } = renderHook(() =>
      useSearch({
        query: "a",
        source: "unsplash",
      }),
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(vi.mocked(searchImages)).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const error = new Error("API Error");
    vi.mocked(searchImages).mockRejectedValue(error);

    const { result } = renderHook(
      () =>
        useSearch({
          query: "cat",
          source: "unsplash",
        }),
      { wrapper: createWrapper() },
    );

    // Wait for initial loading to complete and error to be set
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeDefined();
      },
      { timeout: 10000, interval: 100 },
    );

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe("API Error");
  });

  it("should call searchImages with correct parameters", async () => {
    vi.mocked(searchImages).mockResolvedValue(mockSearchResult);

    renderHook(
      () =>
        useSearch({
          query: "dog",
          source: "pexels",
          page: 2,
          perPage: 15,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(vi.mocked(searchImages)).toHaveBeenCalledWith("pexels", {
        query: "dog",
        page: 2,
        perPage: 15,
        imageType: undefined,
      });
    });
  });

  it("should include imageType for pixabay", async () => {
    vi.mocked(searchImages).mockResolvedValue(mockSearchResult);

    renderHook(
      () =>
        useSearch({
          query: "nature",
          source: "pixabay",
          imageType: "photo",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(vi.mocked(searchImages)).toHaveBeenCalledWith("pixabay", {
        query: "nature",
        page: 1,
        perPage: 20,
        imageType: "photo",
      });
    });
  });

  it("should use default page and perPage values", async () => {
    vi.mocked(searchImages).mockResolvedValue(mockSearchResult);

    const { result } = renderHook(
      () =>
        useSearch({
          query: "cat",
          source: "unsplash",
        }),
      { wrapper: createWrapper() },
    );

    // Wait for the hook to make the API call
    await waitFor(
      () => {
        expect(vi.mocked(searchImages)).toHaveBeenCalled();
      },
      { timeout: 3000, interval: 50 },
    );

    // Then verify it was called with correct default values
    expect(vi.mocked(searchImages)).toHaveBeenCalledWith("unsplash", {
      query: "cat",
      page: 1,
      perPage: 20,
      imageType: undefined,
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should trim query before checking length", async () => {
    vi.mocked(searchImages).mockResolvedValue(mockSearchResult);

    const { result } = renderHook(
      () =>
        useSearch({
          query: "  cat  ",
          source: "unsplash",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(vi.mocked(searchImages)).toHaveBeenCalled();
  });
});
