import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, requireAuthorityRole } from "@/lib/api-auth";
import { updateReportVerification, createVerificationEvent, getReportById } from "@/lib/db/queries";

const VALID_SEVERITIES = ["unclear", "minor", "moderate", "severe", "critical"];
const VALID_VERIFICATION_STATUSES = ["unverified", "needs_review", "verified", "rejected", "escalated"];
const VALID_OPERATIONAL_STATUSES = ["new", "in_progress", "resolved", "archived"];

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
    const body = await request.json();
    const { final_severity, verification_status, operational_status, reason, notes } = body;

    if (final_severity !== null && final_severity !== undefined && !VALID_SEVERITIES.includes(final_severity)) {
      return NextResponse.json({ error: "Invalid final_severity value" }, { status: 400 });
    }
    if (verification_status !== null && verification_status !== undefined && !VALID_VERIFICATION_STATUSES.includes(verification_status)) {
      return NextResponse.json({ error: "Invalid verification_status value" }, { status: 400 });
    }
    if (operational_status !== null && operational_status !== undefined && !VALID_OPERATIONAL_STATUSES.includes(operational_status)) {
      return NextResponse.json({ error: "Invalid operational_status value" }, { status: 400 });
    }

    const current = await getReportById(id);
    if (!current) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    await updateReportVerification(id, {
      final_severity,
      verification_status,
      operational_status,
      reason,
      notes,
    }, authUser.userId);

    await createVerificationEvent(id, authUser.userId, {
      previous_severity: current.final_severity,
      new_severity: final_severity ?? current.final_severity,
      previous_status: current.verification_status,
      new_status: verification_status ?? current.verification_status,
      reason,
      notes,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}