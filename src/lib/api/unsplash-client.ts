import type { SearchResult, UnsplashSearchResponse } from "@/types";
import { APIError } from "./error-handler";
import { convertUnsplashToImage } from "./transformers";

const UNSPLASH_API_URL = "https://api.unsplash.com";

export async function searchUnsplash(
  query: string,
  page = 1,
  perPage = 20,
): Promise<SearchResult> {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    throw new APIError(
      "INTERNAL_SERVER_ERROR",
      "Unsplash API key is not configured",
      500,
    );
  }

  const url = new URL(`${UNSPLASH_API_URL}/search/photos`);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    });

    if (response.status === 429) {
      throw new APIError(
        "RATE_LIMIT_EXCEEDED",
        "検索回数の上限に達しました。しばらく経ってから再度お試しください。",
        429,
      );
    }

    if (!response.ok) {
      throw new APIError(
        "EXTERNAL_API_ERROR",
        `Unsplash API error: ${response.statusText}`,
        response.status,
      );
    }

    const data: UnsplashSearchResponse = await response.json();

    return {
      query,
      source: "unsplash",
      images: data.results.map(convertUnsplashToImage),
      totalResults: data.total,
      page,
      perPage,
      totalPages: data.total_pages,
      timestamp: Date.now(),
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      "NETWORK_ERROR",
      "ネットワークエラーが発生しました",
      502,
      error,
    );
  }
}
