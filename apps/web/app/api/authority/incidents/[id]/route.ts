import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, requireAuthorityRole } from "@/lib/api-auth";
import {
  getReportById,
  getReportMedia,
  getAiAssessments,
  getVerificationEvents,
  getReportAssignment,
  getReportNotes,
} from "@/lib/db/queries";

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

    const [report, media, assessments, events, assignment, notes] = await Promise.all([
      getReportById(id),
      getReportMedia(id),
      getAiAssessments(id),
      getVerificationEvents(id),
      getReportAssignment(id),
      getReportNotes(id),
    ]);

    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      report,
      media,
      assessments,
      events,
      assignment,
      notes,
    });
  } catch (error) {
    console.error("Incident detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}