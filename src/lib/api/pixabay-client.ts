import type { PixabaySearchResponse, SearchResult } from "@/types";
import { APIError } from "./error-handler";
import { convertPixabayToImage } from "./transformers";

const PIXABAY_API_URL = "https://pixabay.com/api";

export async function searchPixabay(
  query: string,
  page = 1,
  perPage = 20,
  imageType: "photo" | "illustration" | "vector" | "all" = "all",
): Promise<SearchResult> {
  const apiKey = process.env.PIXABAY_API_KEY;

  if (!apiKey) {
    throw new APIError(
      "INTERNAL_SERVER_ERROR",
      "Pixabay API key is not configured",
      500,
    );
  }

  const url = new URL(PIXABAY_API_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  if (imageType !== "all") {
    url.searchParams.set("image_type", imageType);
  }

  try {
    const response = await fetch(url.toString());

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
        `Pixabay API error: ${response.statusText}`,
        response.status,
      );
    }

    const data: PixabaySearchResponse = await response.json();

    const totalPages = Math.ceil(data.totalHits / perPage);

    return {
      query,
      source: "pixabay",
      images: data.hits.map(convertPixabayToImage),
      totalResults: data.totalHits,
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
