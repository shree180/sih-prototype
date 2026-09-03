import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/local";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await getSession(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const metrics: string[] = [];

  try {
    const activeUsers = await query(`SELECT COUNT(*) as count FROM profiles WHERE status = 'active'`);
    metrics.push(`drm04_active_users ${activeUsers.rows[0]?.count || 0}`);

    const reportsByStatus = await query(`SELECT verification_status, COUNT(*) as count FROM reports GROUP BY verification_status`);
    for (const r of reportsByStatus.rows) {
      metrics.push(`drm04_reports_by_status{status="${r.verification_status}"} ${r.count}`);
    }

    const reportsByType = await query(`SELECT disaster_type, COUNT(*) as count FROM reports GROUP BY disaster_type`);
    for (const r of reportsByType.rows) {
      metrics.push(`drm04_reports_by_type{disaster_type="${r.disaster_type}"} ${r.count}`);
    }

    const reportsBySeverity = await query(`SELECT COALESCE(final_severity, 'unclear') as severity, COUNT(*) as count FROM reports GROUP BY final_severity`);
    for (const r of reportsBySeverity.rows) {
      metrics.push(`drm04_reports_by_severity{severity="${r.severity}"} ${r.count}`);
    }

    const totalReports = await query(`SELECT COUNT(*) as count FROM reports`);
    metrics.push(`drm04_total_reports ${totalReports.rows[0]?.count || 0}`);

    const totalAssessments = await query(`SELECT COUNT(*) as count FROM ai_assessments`);
    metrics.push(`drm04_total_ai_assessments ${totalAssessments.rows[0]?.count || 0}`);

    const assessmentsByStatus = await query(`SELECT status, COUNT(*) as count FROM ai_assessments GROUP BY status`);
    for (const r of assessmentsByStatus.rows) {
      metrics.push(`drm04_ai_assessments_by_status{status="${r.status}"} ${r.count}`);
    }

    const totalVerifications = await query(`SELECT COUNT(*) as count FROM verification_events`);
    metrics.push(`drm04_total_verifications ${totalVerifications.rows[0]?.count || 0}`);

    const storageStats = await query(`SELECT is_original, COALESCE(SUM(file_size), 0) as total FROM report_media GROUP BY is_original`);
    for (const r of storageStats.rows) {
      metrics.push(`drm04_storage_bytes{bucket="${r.is_original ? "originals" : "redacted"}"} ${r.total}`);
    }

    const mem = process.memoryUsage();
    metrics.push(`nodejs_memory_heap_used_bytes ${mem.heapUsed}`);
    metrics.push(`nodejs_memory_heap_total_bytes ${mem.heapTotal}`);
    metrics.push(`nodejs_memory_external_bytes ${mem.external}`);
    metrics.push(`nodejs_uptime_seconds ${process.uptime()}`);

    return new NextResponse(metrics.join("\n") + "\n", {
      headers: { "Content-Type": "text/plain; version=0.0.4; charset=utf-8" },
    });
  } catch (error) {
    console.error("Metrics error:", error);
    return new NextResponse("Error generating metrics", { status: 500 });
  }
}
