import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { handleAPIError } from "@/lib/api/error-handler";
import { searchPixabay } from "@/lib/api/pixabay-client";
import {
  checkRateLimit,
  getRateLimitHeaders,
  getRetryAfter,
} from "@/lib/api/rate-limiter";
import { pixabaySearchQuerySchema } from "@/lib/api/validators";
import type { SearchResult, SuccessResponse } from "@/types";

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("perPage") || "20";
    const imageType = searchParams.get("imageType") || "all";

    // Validate input
    const validatedParams = pixabaySearchQuerySchema.parse({
      query,
      page,
      perPage,
      imageType,
    });

    // Check rate limit
    const { allowed, info } = checkRateLimit("pixabay");
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message:
              "検索回数の上限に達しました。しばらく経ってから再度お試しください。",
          },
          meta: {
            timestamp: Date.now(),
          },
        },
        {
          status: 429,
          headers: {
            ...getRateLimitHeaders(info),
            "Retry-After": String(getRetryAfter(info.reset)),
          },
        },
      );
    }

    // Search images
    const result = await searchPixabay(
      validatedParams.query,
      validatedParams.page,
      validatedParams.perPage,
      validatedParams.imageType,
    );

    const response: SuccessResponse<SearchResult> = {
      success: true,
      data: result,
      meta: {
        timestamp: Date.now(),
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: getRateLimitHeaders(info),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: firstError?.message || "バリデーションエラー",
          },
          meta: {
            timestamp: Date.now(),
          },
        },
        { status: 400 },
      );
    }

    const { response, status } = handleAPIError(error);
    return NextResponse.json(response, { status });
  }
}
