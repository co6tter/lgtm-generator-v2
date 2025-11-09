import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock dependencies
vi.mock("@/lib/api/pexels-client");
vi.mock("@/lib/api/rate-limiter");

const { searchPexels } = await import("@/lib/api/pexels-client");
const { checkRateLimit, getRateLimitHeaders, getRetryAfter } = await import(
  "@/lib/api/rate-limiter"
);

describe("Pexels API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return search results successfully", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      info: {
        limit: 200,
        remaining: 199,
        reset: Date.now() + 3600000,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "200",
      "X-RateLimit-Remaining": "199",
      "X-RateLimit-Reset": String(Date.now() + 3600000),
    });

    vi.mocked(searchPexels).mockResolvedValue({
      query: "dog",
      source: "pexels",
      images: [
        {
          id: "1",
          url: "https://example.com/image.jpg",
          thumbnailUrl: "https://example.com/thumb.jpg",
          width: 800,
          height: 600,
          alt: "Dog photo",
          photographer: "Jane Doe",
          photographerUrl: "https://example.com/jane",
          source: "pexels",
        },
      ],
      totalResults: 100,
      page: 1,
      perPage: 20,
      totalPages: 5,
      timestamp: Date.now(),
    });

    const request = new Request(
      "http://localhost:3000/api/search/pexels?query=dog&page=1&perPage=20",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.images).toHaveLength(1);
    expect(data.data.source).toBe("pexels");
  });

  it("should return rate limit error when rate limit exceeded", async () => {
    const resetTime = Date.now() + 3600000;

    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: false,
      info: {
        limit: 200,
        remaining: 0,
        reset: resetTime,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "200",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(resetTime),
    });

    vi.mocked(getRetryAfter).mockReturnValue(3600);

    const request = new Request(
      "http://localhost:3000/api/search/pexels?query=dog",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("RATE_LIMIT_EXCEEDED");
  });

  it("should return validation error for invalid query", async () => {
    const request = new Request(
      "http://localhost:3000/api/search/pexels?query=",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });
});
