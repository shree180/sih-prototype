import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, requireAuthorityRole } from "@/lib/api-auth";
import { bulkVerifyReports, getReportsForExport } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const authUser = await authenticateApiRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireAuthorityRole(authUser)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action, reportIds, ...params } = await request.json();

    if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
      return NextResponse.json({ error: "reportIds array required" }, { status: 400 });
    }

    if (action === "verify") {
      const { verification_status, reason } = params;
      if (!verification_status) {
        return NextResponse.json({ error: "verification_status required" }, { status: 400 });
      }
      const results = await bulkVerifyReports(reportIds, verification_status, authUser.userId, reason);
      return NextResponse.json({ results });
    }

    if (action === "export") {
      const filters = {
        disaster_type: params.disaster_type,
        final_severity: params.final_severity,
        verification_status: params.verification_status,
        operational_status: params.operational_status,
        date_from: params.date_from,
        date_to: params.date_to,
        search: params.search,
        has_location: params.has_location,
      };
      
      // If specific IDs provided, we need to filter by them
      let reports: any[];
      if (reportIds.length > 0 && !filters.disaster_type && !filters.final_severity && !filters.verification_status && !filters.operational_status && !filters.date_from && !filters.date_to && !filters.search) {
        // Direct ID-based export
        const placeholders = reportIds.map((_, i) => `$${i + 1}`).join(",");
        const { query } = await import("@/lib/db/local");
        const result = await query(
          `SELECT * FROM reports WHERE id IN (${placeholders}) ORDER BY submitted_at DESC`,
          reportIds
        );
        reports = result.rows;
      } else {
        reports = await getReportsForExport(filters);
      }

      const format = params.format || "csv";
      if (format === "csv") {
        return generateCsvResponse(reports);
      }
      return NextResponse.json(reports);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Bulk API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateCsvResponse(reports: any[]) {
  const headers = [
    "report_id", "submitted_at", "disaster_type", "asset_type",
    "latitude", "longitude", "ai_severity", "ai_confidence",
    "final_severity", "priority_score", "verification_status", "operational_status",
    "description", "affected_people", "infrastructure_impact", "accessibility_blocked",
  ];

  const lines = [headers.join(",")];
  
  for (const r of reports) {
    lines.push([
      r.id,
      r.submitted_at,
      r.disaster_type,
      r.asset_type ?? "",
      r.lat ?? "",
      r.lng ?? "",
      r.ai_severity ?? "",
      r.ai_confidence ?? "",
      r.final_severity ?? "",
      r.priority_score ?? "",
      r.verification_status,
      r.operational_status,
      `"${String(r.description ?? "").replace(/"/g, '""')}"`,
      r.affected_people ?? "",
      r.infrastructure_impact ? "yes" : "no",
      r.accessibility_blocked ? "yes" : "no",
    ].join(","));
  }

  const csv = lines.join("\n");
  
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="incidents-bulk-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}