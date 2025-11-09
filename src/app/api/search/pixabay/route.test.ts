import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock dependencies
vi.mock("@/lib/api/pixabay-client");
vi.mock("@/lib/api/rate-limiter");

const { searchPixabay } = await import("@/lib/api/pixabay-client");
const { checkRateLimit, getRateLimitHeaders, getRetryAfter } = await import(
  "@/lib/api/rate-limiter"
);

describe("Pixabay API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return search results successfully", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      info: {
        limit: 5000,
        remaining: 4999,
        reset: Date.now() + 3600000,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "5000",
      "X-RateLimit-Remaining": "4999",
      "X-RateLimit-Reset": String(Date.now() + 3600000),
    });

    vi.mocked(searchPixabay).mockResolvedValue({
      query: "nature",
      source: "pixabay",
      images: [
        {
          id: "1",
          url: "https://example.com/image.jpg",
          thumbnailUrl: "https://example.com/thumb.jpg",
          width: 800,
          height: 600,
          alt: "Nature photo",
          photographer: "Photographer",
          photographerUrl: "https://example.com/photographer",
          source: "pixabay",
        },
      ],
      totalResults: 100,
      page: 1,
      perPage: 20,
      totalPages: 5,
      timestamp: Date.now(),
    });

    const request = new Request(
      "http://localhost:3000/api/search/pixabay?query=nature&page=1&perPage=20&imageType=all",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.images).toHaveLength(1);
    expect(data.data.source).toBe("pixabay");
  });

  it("should use default imageType when not provided", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      info: {
        limit: 5000,
        remaining: 4999,
        reset: Date.now() + 3600000,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "5000",
      "X-RateLimit-Remaining": "4999",
      "X-RateLimit-Reset": String(Date.now() + 3600000),
    });

    vi.mocked(searchPixabay).mockResolvedValue({
      query: "nature",
      source: "pixabay",
      images: [],
      totalResults: 0,
      page: 1,
      perPage: 20,
      totalPages: 0,
      timestamp: Date.now(),
    });

    const request = new Request(
      "http://localhost:3000/api/search/pixabay?query=nature",
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(vi.mocked(searchPixabay)).toHaveBeenCalledWith(
      "nature",
      1,
      20,
      "all",
    );
  });

  it("should return rate limit error when rate limit exceeded", async () => {
    const resetTime = Date.now() + 3600000;

    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: false,
      info: {
        limit: 5000,
        remaining: 0,
        reset: resetTime,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "5000",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(resetTime),
    });

    vi.mocked(getRetryAfter).mockReturnValue(3600);

    const request = new Request(
      "http://localhost:3000/api/search/pixabay?query=nature",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("RATE_LIMIT_EXCEEDED");
  });

  it("should return validation error for invalid imageType", async () => {
    const request = new Request(
      "http://localhost:3000/api/search/pixabay?query=nature&imageType=invalid",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });
});
