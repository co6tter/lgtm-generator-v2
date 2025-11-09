import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("Health API Route", () => {
  it("should return health status with success true", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it("should return correct health data structure", async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.data).toHaveProperty("status", "ok");
    expect(data.data).toHaveProperty("timestamp");
    expect(data.data).toHaveProperty("version", "1.0.0");
    expect(data.data).toHaveProperty("uptime");
  });

  it("should return timestamp as number", async () => {
    const response = await GET();
    const data = await response.json();

    expect(typeof data.data.timestamp).toBe("number");
    expect(data.data.timestamp).toBeGreaterThan(0);
  });

  it("should return uptime as number", async () => {
    const response = await GET();
    const data = await response.json();

    expect(typeof data.data.uptime).toBe("number");
    expect(data.data.uptime).toBeGreaterThanOrEqual(0);
  });

  it("should have Cache-Control header set to no-cache", async () => {
    const response = await GET();
    const cacheControl = response.headers.get("Cache-Control");

    expect(cacheControl).toBe("no-cache, no-store, must-revalidate");
  });

  it("should return increasing uptime on subsequent calls", async () => {
    const response1 = await GET();
    const data1 = await response1.json();

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 10));

    const response2 = await GET();
    const data2 = await response2.json();

    expect(data2.data.uptime).toBeGreaterThanOrEqual(data1.data.uptime);
  });
});
