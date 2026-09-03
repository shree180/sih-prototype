import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, requireAuthorityRole } from "@/lib/api-auth";
import { getTeamMembers, assignReport, getReportAssignment } from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await authenticateApiRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireAuthorityRole(authUser)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const [teamMembers, assignment] = await Promise.all([
      getTeamMembers(),
      getReportAssignment(id),
    ]);

    return NextResponse.json({ teamMembers, assignment });
  } catch (error) {
    console.error("Assign API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await authenticateApiRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireAuthorityRole(authUser)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { assigneeId } = await request.json();

    if (!assigneeId) {
      return NextResponse.json({ error: "assigneeId required" }, { status: 400 });
    }

    const assignment = await assignReport(id, assigneeId, authUser.userId);
    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Assign POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}