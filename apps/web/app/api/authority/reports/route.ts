import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, requireAuthorityRole } from "@/lib/api-auth";
import {
  getReports,
  getDashboardStats,
  getAnalyticsData,
  getReportsForExport,
  ReportFilters,
} from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const authUser = await authenticateApiRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireAuthorityRole(authUser)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      const stats = await getDashboardStats();
      return NextResponse.json(stats);
    }

    if (action === "analytics") {
      const days = parseInt(searchParams.get("days") || "30", 10);
      const analytics = await getAnalyticsData(days);
      return NextResponse.json(analytics);
    }

    if (action === "export") {
      const filters: ReportFilters = {
        disaster_type: searchParams.get("disaster_type") || undefined,
        final_severity: searchParams.get("final_severity") || undefined,
        verification_status: searchParams.get("verification_status") || undefined,
        operational_status: searchParams.get("operational_status") || undefined,
        date_from: searchParams.get("date_from") || undefined,
        date_to: searchParams.get("date_to") || undefined,
        search: searchParams.get("search") || undefined,
        has_location: searchParams.get("has_location") === "true",
      };
      const reports = await getReportsForExport(filters);
      
      const format = searchParams.get("format") || "csv";
      if (format === "csv") {
        return generateCsvResponse(reports);
      }
      return NextResponse.json(reports);
    }

    // Default: paginated reports list
    const filters: ReportFilters = {
      disaster_type: searchParams.get("disaster_type") || undefined,
      final_severity: searchParams.get("final_severity") || undefined,
      verification_status: searchParams.get("verification_status") || undefined,
      operational_status: searchParams.get("operational_status") || undefined,
      date_from: searchParams.get("date_from") || undefined,
      date_to: searchParams.get("date_to") || undefined,
      search: searchParams.get("search") || undefined,
      has_location: searchParams.get("has_location") === "true",
    };

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20", 10), 100);
    const sortField = searchParams.get("sort") || "submitted_at";
    const sortDirection = (searchParams.get("direction") || "desc") as "asc" | "desc";

    const result = await getReports(filters, { page, pageSize }, { field: sortField, direction: sortDirection });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
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
      "Content-Disposition": `attachment; filename="incidents-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}