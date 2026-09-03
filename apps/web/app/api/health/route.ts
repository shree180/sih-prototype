import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "drm04-web",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString(),
  });
}