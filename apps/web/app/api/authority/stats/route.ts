import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, requireAuthorityRole } from "@/lib/api-auth";
import { getDashboardStats } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const authUser = await authenticateApiRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireAuthorityRole(authUser)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}