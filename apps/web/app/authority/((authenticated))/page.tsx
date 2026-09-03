import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IncidentMap, MapReport } from "@/features/map/IncidentMap";
import { query } from "@/lib/db/local";
import { SEVERITY_LABEL, SEVERITY_COLOR, VERIFICATION_LABEL, priorityBand } from "@/lib/rbac";
import type { Severity, VerificationStatus } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuthorityDashboard() {
  const result = await query<{
    id: string;
    disaster_type: string;
    asset_type: string | null;
    description: string | null;
    final_severity: string | null;
    ai_severity: string | null;
    ai_confidence: number | null;
    priority_score: number | null;
    verification_status: string;
    operational_status: string;
    location_lat: number | null;
    location_lng: number | null;
    submitted_at: Date;
  }>(
    `SELECT id, disaster_type, asset_type, description, final_severity, ai_severity, ai_confidence, 
            priority_score, verification_status, operational_status,
            location_lat, location_lng, submitted_at
     FROM reports 
     ORDER BY submitted_at DESC`
  );
  const rows = result.rows;

  const total = rows.length;
  const critical = rows.filter((r) => r.final_severity === "critical").length;
  const needsReview = rows.filter((r) => r.verification_status === "needs_review").length;
  const verified = rows.filter((r) => r.verification_status === "verified").length;
  const escalated = rows.filter((r) => r.verification_status === "escalated").length;
  const inProgress = rows.filter((r) => r.operational_status === "in_progress").length;

  const priorityQueue = rows
    .slice()
    .sort((a, b) => (b.priority_score ?? 0) - (a.priority_score ?? 0))
    .slice(0, 6);

  const mapReports: MapReport[] = rows
    .filter((r) => r.location_lat != null && r.location_lng != null)
    .map((r) => ({
      id: r.id,
      lat: r.location_lat!,
      lng: r.location_lng!,
      severity: (r.final_severity as Severity) ?? null,
      disaster_type: r.disaster_type,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-navy-900">Operations Overview</h1>
          <p className="text-xs text-navy-500">Real-time geospatial damage intelligence</p>
        </div>
        <Link href="/authority/incidents" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors">
          View full map ({rows.length})
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total" value={total} />
        <KpiCard label="Critical" value={critical} tone="critical" />
        <KpiCard label="Needs Review" value={needsReview} tone="severe" />
        <KpiCard label="Verified" value={verified} tone="minor" />
        <KpiCard label="Escalated" value={escalated} tone="critical" />
        <KpiCard label="In Progress" value={inProgress} tone="moderate" />
      </div>

      {/* Map + Priority Queue */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy-900">Live Incident Map</h2>
            <div className="flex items-center gap-3 text-[10px] text-navy-500">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Critical</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Severe</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Minor</span>
            </div>
          </div>
          <div className="rounded-xl border border-navy-100/60 bg-white overflow-hidden shadow-elevated">
            <IncidentMap reports={mapReports} height="h-[420px]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-navy-900">Priority Queue</h2>
          <div className="space-y-2">
            {priorityQueue.map((r) => {
              const band = priorityBand(r.priority_score);
              const sev = (r.final_severity as Severity) ?? "unclear";
              return (
                <Link key={r.id} href={`/authority/incidents/${r.id}`}>
                  <div className="rounded-xl border border-navy-100/60 bg-white p-3.5 shadow-elevated hover:shadow-elevated-lg transition-all duration-200 group cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-navy-900 capitalize group-hover:text-amber-600 transition-colors">
                          {r.disaster_type.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-navy-400 ml-1.5">{r.asset_type || ""}</span>
                        {r.description && (
                          <p className="text-[11px] text-navy-500 line-clamp-1 mt-0.5">{r.description}</p>
                        )}
                      </div>
                      <Badge className={`${SEVERITY_COLOR[sev]} text-[10px]`}>{SEVERITY_LABEL[sev]}</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between pt-2 border-t border-navy-100/60 text-[10px]">
                      <Badge className={`${band.color} px-1.5 py-0 text-[9px]`}>{band.label} {r.priority_score ?? "—"}</Badge>
                      <span className="text-amber-600 font-semibold group-hover:underline">Review</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            {priorityQueue.length === 0 && (
              <p className="text-xs text-navy-400 py-8 text-center">No active incidents</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  const toneColors: Record<string, string> = {
    critical: "text-red-600",
    severe: "text-orange-600",
    moderate: "text-amber-600",
    minor: "text-emerald-600",
  };

  return (
    <div className="glass-light rounded-xl p-4 border border-white/40">
      <div className="text-[11px] font-medium text-navy-500 mb-1">{label}</div>
      <p className={`text-2xl font-bold tracking-tight ${tone ? toneColors[tone] : "text-navy-900"}`}>
        {value}
      </p>
    </div>
  );
}
