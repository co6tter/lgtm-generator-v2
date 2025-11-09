import type { ErrorCode, ErrorResponse } from "@/types";

export class APIError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export function getStatusCode(code: ErrorCode): number {
  const statusMap: Record<ErrorCode, number> = {
    VALIDATION_ERROR: 400,
    MISSING_QUERY: 400,
    INVALID_SOURCE: 400,
    RATE_LIMIT_EXCEEDED: 429,
    EXTERNAL_API_ERROR: 502,
    NETWORK_ERROR: 502,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    API_RATE_LIMIT: 429,
    API_ERROR: 502,
    GENERATION_ERROR: 500,
  };
  return statusMap[code] || 500;
}

export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: unknown,
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details: process.env.NODE_ENV === "development" ? details : undefined,
    },
    meta: {
      timestamp: Date.now(),
    },
  };
}

export function handleAPIError(error: unknown): {
  response: ErrorResponse;
  status: number;
} {
  if (error instanceof APIError) {
    return {
      response: createErrorResponse(error.code, error.message, error.details),
      status: getStatusCode(error.code),
    };
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      response: createErrorResponse(
        "NETWORK_ERROR",
        "ネットワークエラーが発生しました",
        error,
      ),
      status: 502,
    };
  }

  // Default error
  return {
    response: createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "サーバーエラーが発生しました",
      error,
    ),
    status: 500,
  };
}
