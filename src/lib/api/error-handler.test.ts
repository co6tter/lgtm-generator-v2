import { describe, expect, it } from "vitest";
import {
  APIError,
  createErrorResponse,
  getStatusCode,
  handleAPIError,
} from "./error-handler";

describe("Error Handler", () => {
  describe("APIError", () => {
    it("should create APIError instance", () => {
      const error = new APIError("VALIDATION_ERROR", "Invalid input", 400);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.name).toBe("APIError");
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.message).toBe("Invalid input");
      expect(error.statusCode).toBe(400);
    });

    it("should use default status code 500", () => {
      const error = new APIError("INTERNAL_SERVER_ERROR", "Server error");

      expect(error.statusCode).toBe(500);
    });

    it("should include details", () => {
      const details = { field: "email" };
      const error = new APIError(
        "VALIDATION_ERROR",
        "Invalid email",
        400,
        details,
      );

      expect(error.details).toEqual(details);
    });
  });

  describe("getStatusCode", () => {
    it("should return correct status code for VALIDATION_ERROR", () => {
      expect(getStatusCode("VALIDATION_ERROR")).toBe(400);
    });

    it("should return correct status code for RATE_LIMIT_EXCEEDED", () => {
      expect(getStatusCode("RATE_LIMIT_EXCEEDED")).toBe(429);
    });

    it("should return correct status code for EXTERNAL_API_ERROR", () => {
      expect(getStatusCode("EXTERNAL_API_ERROR")).toBe(502);
    });

    it("should return correct status code for INTERNAL_SERVER_ERROR", () => {
      expect(getStatusCode("INTERNAL_SERVER_ERROR")).toBe(500);
    });

    it("should return 500 for unknown error code", () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing unknown error code handling
      expect(getStatusCode("UNKNOWN_CODE" as any)).toBe(500);
    });
  });

  describe("createErrorResponse", () => {
    it("should create error response without details", () => {
      const response = createErrorResponse("VALIDATION_ERROR", "Invalid input");

      expect(response.success).toBe(false);
      expect(response.error.code).toBe("VALIDATION_ERROR");
      expect(response.error.message).toBe("Invalid input");
      expect(response.meta.timestamp).toBeDefined();
    });

    it("should include details in development mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const details = { field: "email" };
      const response = createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid email",
        details,
      );

      expect(response.error.details).toEqual(details);

      process.env.NODE_ENV = originalEnv;
    });

    it("should exclude details in production mode", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const details = { field: "email" };
      const response = createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid email",
        details,
      );

      expect(response.error.details).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("handleAPIError", () => {
    it("should handle APIError", () => {
      const error = new APIError("VALIDATION_ERROR", "Invalid input", 400);
      const result = handleAPIError(error);

      expect(result.status).toBe(400);
      expect(result.response.success).toBe(false);
      expect(result.response.error.code).toBe("VALIDATION_ERROR");
      expect(result.response.error.message).toBe("Invalid input");
    });

    it("should handle network TypeError", () => {
      const error = new TypeError("fetch failed");
      const result = handleAPIError(error);

      expect(result.status).toBe(502);
      expect(result.response.error.code).toBe("NETWORK_ERROR");
      expect(result.response.error.message).toBe(
        "ネットワークエラーが発生しました",
      );
    });

    it("should handle generic Error", () => {
      const error = new Error("Unknown error");
      const result = handleAPIError(error);

      expect(result.status).toBe(500);
      expect(result.response.error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(result.response.error.message).toBe(
        "サーバーエラーが発生しました",
      );
    });

    it("should handle unknown error types", () => {
      const error = "string error";
      const result = handleAPIError(error);

      expect(result.status).toBe(500);
      expect(result.response.error.code).toBe("INTERNAL_SERVER_ERROR");
    });

    it("should include error details in response", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const details = { stack: "error stack" };
      const error = new APIError(
        "INTERNAL_SERVER_ERROR",
        "Server error",
        500,
        details,
      );
      const result = handleAPIError(error);

      expect(result.response.error.details).toEqual(details);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
