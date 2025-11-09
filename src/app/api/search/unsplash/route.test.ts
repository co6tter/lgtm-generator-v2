import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock dependencies
vi.mock("@/lib/api/unsplash-client");
vi.mock("@/lib/api/rate-limiter");

const { searchUnsplash } = await import("@/lib/api/unsplash-client");
const { checkRateLimit, getRateLimitHeaders, getRetryAfter } = await import(
  "@/lib/api/rate-limiter"
);

describe("Unsplash API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return search results successfully", async () => {
    // Mock rate limiter
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      info: {
        limit: 50,
        remaining: 49,
        reset: Date.now() + 3600000,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "50",
      "X-RateLimit-Remaining": "49",
      "X-RateLimit-Reset": String(Date.now() + 3600000),
    });

    // Mock search result
    vi.mocked(searchUnsplash).mockResolvedValue({
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
    });

    const request = new Request(
      "http://localhost:3000/api/search/unsplash?query=cat&page=1&perPage=20",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.images).toHaveLength(1);
    expect(data.data.query).toBe("cat");
    expect(data.data.source).toBe("unsplash");
  });

  it("should return validation error for invalid query", async () => {
    const request = new Request(
      "http://localhost:3000/api/search/unsplash?query=&page=1&perPage=20",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return rate limit error when rate limit exceeded", async () => {
    const resetTime = Date.now() + 3600000;

    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: false,
      info: {
        limit: 50,
        remaining: 0,
        reset: resetTime,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "50",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(resetTime),
    });

    vi.mocked(getRetryAfter).mockReturnValue(3600);

    const request = new Request(
      "http://localhost:3000/api/search/unsplash?query=cat&page=1&perPage=20",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(response.headers.get("Retry-After")).toBe("3600");
  });

  it("should validate page parameter", async () => {
    const request = new Request(
      "http://localhost:3000/api/search/unsplash?query=cat&page=0&perPage=20",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("should validate perPage parameter", async () => {
    const request = new Request(
      "http://localhost:3000/api/search/unsplash?query=cat&page=1&perPage=101",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("should use default values when parameters not provided", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      info: {
        limit: 50,
        remaining: 49,
        reset: Date.now() + 3600000,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "50",
      "X-RateLimit-Remaining": "49",
      "X-RateLimit-Reset": String(Date.now() + 3600000),
    });

    vi.mocked(searchUnsplash).mockResolvedValue({
      query: "ab",
      source: "unsplash",
      images: [],
      totalResults: 0,
      page: 1,
      perPage: 20,
      totalPages: 0,
      timestamp: Date.now(),
    });

    const request = new Request(
      "http://localhost:3000/api/search/unsplash?query=ab",
    );
    const response = await GET(request);
    await response.json();

    expect(response.status).toBe(200);
    expect(vi.mocked(searchUnsplash)).toHaveBeenCalledWith("ab", 1, 20);
  });

  it("should include rate limit headers in response", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: true,
      info: {
        limit: 50,
        remaining: 49,
        reset: Date.now() + 3600000,
      },
    });

    vi.mocked(getRateLimitHeaders).mockReturnValue({
      "X-RateLimit-Limit": "50",
      "X-RateLimit-Remaining": "49",
      "X-RateLimit-Reset": String(Date.now() + 3600000),
    });

    vi.mocked(searchUnsplash).mockResolvedValue({
      query: "cat",
      source: "unsplash",
      images: [],
      totalResults: 0,
      page: 1,
      perPage: 20,
      totalPages: 0,
      timestamp: Date.now(),
    });

    const request = new Request(
      "http://localhost:3000/api/search/unsplash?query=cat",
    );
    const response = await GET(request);

    expect(response.headers.get("X-RateLimit-Limit")).toBe("50");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("49");
    expect(response.headers.get("X-RateLimit-Reset")).toBeTruthy();
  });
});
