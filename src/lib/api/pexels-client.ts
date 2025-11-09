import type { PexelsSearchResponse, SearchResult } from "@/types";
import { APIError } from "./error-handler";
import { convertPexelsToImage } from "./transformers";

const PEXELS_API_URL = "https://api.pexels.com/v1";

export async function searchPexels(
  query: string,
  page = 1,
  perPage = 20,
): Promise<SearchResult> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    throw new APIError(
      "INTERNAL_SERVER_ERROR",
      "Pexels API key is not configured",
      500,
    );
  }

  const url = new URL(`${PEXELS_API_URL}/search`);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
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
        `Pexels API error: ${response.statusText}`,
        response.status,
      );
    }

    const data: PexelsSearchResponse = await response.json();

    const totalPages = Math.ceil(data.total_results / perPage);

    return {
      query,
      source: "pexels",
      images: data.photos.map(convertPexelsToImage),
      totalResults: data.total_results,
      page,
      perPage,
      totalPages,
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
