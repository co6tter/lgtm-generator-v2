import { NextResponse } from "next/server";
import type { SuccessResponse } from "@/types";

interface HealthData {
  status: "ok";
  timestamp: number;
  version: string;
  uptime: number;
}

const startTime = Date.now();

export async function GET() {
  const response: SuccessResponse<HealthData> = {
    success: true,
    data: {
      status: "ok",
      timestamp: Date.now(),
      version: "1.0.0",
      uptime: Date.now() - startTime,
    },
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
