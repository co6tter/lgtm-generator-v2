import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/json",
    },
  });
}
