import type { ImageSource } from "@/types";

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

// In-memory rate limit store (simple implementation)
// For production, consider using Redis or similar
const rateLimitStore = new Map<ImageSource, RateLimitInfo>();

export const RATE_LIMITS: Record<ImageSource, number> = {
  unsplash: 50, // requests per hour
  pexels: 200,
  pixabay: 5000,
};

export function checkRateLimit(source: ImageSource): {
  allowed: boolean;
  info: RateLimitInfo;
} {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  const resetTime = now + hourInMs;

  let info = rateLimitStore.get(source);

  // Initialize or reset if expired
  if (!info || now >= info.reset) {
    info = {
      limit: RATE_LIMITS[source],
      remaining: RATE_LIMITS[source],
      reset: resetTime,
    };
    rateLimitStore.set(source, info);
  }

  const allowed = info.remaining > 0;

  if (allowed) {
    info.remaining -= 1;
    rateLimitStore.set(source, info);
  }

  return { allowed, info };
}

export function getRateLimitHeaders(
  info: RateLimitInfo,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(info.limit),
    "X-RateLimit-Remaining": String(info.remaining),
    "X-RateLimit-Reset": String(Math.floor(info.reset / 1000)),
  };
}

export function getRetryAfter(resetTime: number): number {
  return Math.ceil((resetTime - Date.now()) / 1000);
}
