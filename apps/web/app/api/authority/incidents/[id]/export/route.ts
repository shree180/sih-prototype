import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, requireAuthorityRole } from "@/lib/api-auth";
import { getReportById, getReportMedia, getAiAssessments, getVerificationEvents, getReportNotes } from "@/lib/db/queries";

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
    const format = request.nextUrl.searchParams.get("format") || "json";

    const [report, media, assessments, events, notes] = await Promise.all([
      getReportById(id),
      getReportMedia(id),
      getAiAssessments(id),
      getVerificationEvents(id),
      getReportNotes(id),
    ]);

    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const exportData = {
      report,
      media,
      assessments,
      events,
      notes,
      exportedAt: new Date().toISOString(),
      exportedBy: authUser.userId,
    };

    if (format === "json") {
      return NextResponse.json(exportData, {
        headers: {
          "Content-Disposition": `attachment; filename="incident-${id}-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      });
    }

    // Generate CSV for single incident
    const headers = [
      "field", "value"
    ];
    
    const lines = [headers.join(",")];
    const addRow = (field: string, value: any) => {
      lines.push(`"${field}","${String(value ?? "").replace(/"/g, '""')}"`);
    };

    addRow("report_id", report.id);
    addRow("disaster_type", report.disaster_type);
    addRow("asset_type", report.asset_type);
    addRow("description", report.description);
    addRow("final_severity", report.final_severity);
    addRow("priority_score", report.priority_score);
    addRow("verification_status", report.verification_status);
    addRow("operational_status", report.operational_status);
    addRow("affected_people", report.affected_people);
    addRow("infrastructure_impact", report.infrastructure_impact);
    addRow("accessibility_blocked", report.accessibility_blocked);
    addRow("latitude", report.lat);
    addRow("longitude", report.lng);
    addRow("submitted_at", report.submitted_at);
    addRow("updated_at", report.updated_at);
    
    if (assessments.length > 0) {
      const ai = assessments[0];
      addRow("ai_predicted_severity", ai.predicted_severity);
      addRow("ai_confidence", ai.confidence);
      addRow("ai_provider", ai.provider);
      addRow("ai_model", ai.model_name);
      addRow("ai_explanation", ai.explanation);
    }

    for (let i = 0; i < events.length; i++) {
      addRow(`verification_event_${i}_date`, events[i].created_at);
      addRow(`verification_event_${i}_reviewer`, events[i].reviewer_name);
      addRow(`verification_event_${i}_prev_status`, events[i].previous_status);
      addRow(`verification_event_${i}_new_status`, events[i].new_status);
      addRow(`verification_event_${i}_reason`, events[i].reason);
      addRow(`verification_event_${i}_notes`, events[i].notes);
    }

    for (let i = 0; i < notes.length; i++) {
      addRow(`note_${i}_date`, notes[i].created_at);
      addRow(`note_${i}_author`, notes[i].author_name);
      addRow(`note_${i}_content`, notes[i].content);
    }

    const csv = lines.join("\n");
    
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="incident-${id}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}