import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "alive",
    service: "drm04-web",
    version: process.env.npm_package_version || "1.0.0",
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
    },
    nodeVersion: process.version,
  });
}