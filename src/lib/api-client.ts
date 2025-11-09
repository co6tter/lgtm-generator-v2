import type {
  APIResponse,
  ErrorCode,
  ImageSource,
  SearchResult,
} from "@/types";

class APIClientError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "APIClientError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/api";

interface SearchParams {
  query: string;
  page?: number;
  perPage?: number;
  imageType?: "photo" | "illustration" | "vector" | "all";
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data: APIResponse<T> = await response.json();

      if (!data.success) {
        throw new APIClientError(
          data.error.code,
          data.error.message,
          response.status,
        );
      }

      return data.data;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (
        error instanceof APIClientError &&
        error.statusCode &&
        error.statusCode >= 400 &&
        error.statusCode < 500
      ) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * 2 ** attempt, 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Request failed after retries");
}

export async function searchImages(
  source: ImageSource,
  params: SearchParams,
): Promise<SearchResult> {
  const url = new URL(`${BASE_URL}/search/${source}`);
  url.searchParams.set("query", params.query);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.perPage) url.searchParams.set("perPage", String(params.perPage));
  if (params.imageType && source === "pixabay") {
    url.searchParams.set("imageType", params.imageType);
  }

  return fetchWithRetry<SearchResult>(url.toString());
}

export async function checkHealth(): Promise<{
  status: string;
  timestamp: number;
  version: string;
  uptime: number;
}> {
  return fetchWithRetry(`${BASE_URL}/health`);
}

export { APIClientError };
