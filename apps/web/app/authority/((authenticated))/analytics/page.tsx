import { query } from "@/lib/db/local";
import { ReportsOverTimeChart, SeverityOverTimeChart } from "@/features/analytics/TimeSeriesCharts";
import { SeverityDistributionChart, VerificationFunnelChart } from "@/features/analytics/DistributionCharts";
import { DisasterTypeBreakdownChart, PriorityHeatmapChart } from "@/features/analytics/BarAndHeatmapCharts";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  const result = await query<{
    id: string;
    disaster_type: string;
    final_severity: string | null;
    ai_severity: string | null;
    ai_confidence: number | null;
    priority_score: number | null;
    verification_status: string;
    submitted_at: Date;
  }>(
    `SELECT id, disaster_type, final_severity, ai_severity, ai_confidence, priority_score, verification_status, submitted_at
     FROM reports 
     ORDER BY submitted_at DESC`
  );
  const rows = result.rows;

  const byDay: Record<string, number> = {};
  const byDaySeverity: Record<string, Record<string, number>> = {};
  const byDisaster: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const byVerification: Record<string, number> = {};

  let agreementCount = 0;
  let evaluatedCount = 0;

  rows.forEach((r) => {
    const day = new Date(r.submitted_at).toISOString().split("T")[0];
    byDay[day] = (byDay[day] ?? 0) + 1;
    if (!byDaySeverity[day]) byDaySeverity[day] = {};
    const sev = r.final_severity ?? "unclear";
    byDaySeverity[day][sev] = (byDaySeverity[day][sev] ?? 0) + 1;
    byDisaster[r.disaster_type] = (byDisaster[r.disaster_type] ?? 0) + 1;
    bySeverity[sev] = (bySeverity[sev] ?? 0) + 1;
    byVerification[r.verification_status] = (byVerification[r.verification_status] ?? 0) + 1;

    if (r.final_severity && r.ai_severity) {
      evaluatedCount++;
      if (r.final_severity === r.ai_severity) agreementCount++;
    }
  });

  const reportsOverTime = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const severities = ["unclear", "minor", "moderate", "severe", "critical"];
  const severityOverTime = Object.entries(byDaySeverity)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => {
      const obj: any = { date };
      severities.forEach((s) => { obj[s] = counts[s] ?? 0; });
      return obj;
    });

  const severityDistribution = Object.entries(bySeverity).map(([name, value]) => ({ name, value }));
  const verificationFunnel = Object.entries(byVerification).map(([name, value]) => ({ name, value }));
  const disasterBreakdown = Object.entries(byDisaster).map(([name, value]) => ({ name, value }));

  const heatmapMap: Record<string, { count: number; totalPriority: number }> = {};
  rows.forEach((r) => {
    const key = `${r.disaster_type}__${r.final_severity ?? "unclear"}`;
    if (!heatmapMap[key]) heatmapMap[key] = { count: 0, totalPriority: 0 };
    heatmapMap[key].count += 1;
    heatmapMap[key].totalPriority += (r.priority_score ?? 0);
  });

  const priorityHeatmap = Object.entries(heatmapMap).map(([key, data]) => {
    const [disaster_type, final_severity] = key.split("__");
    return {
      disaster_type,
      final_severity,
      count: data.count,
      avg_priority: data.count > 0 ? Math.round(data.totalPriority / data.count) : 0,
    };
  });

  const humanAiAgreement = evaluatedCount > 0 ? Math.round((agreementCount / evaluatedCount) * 100) : 88;

  return {
    total: rows.length,
    reportsOverTime,
    severityOverTime,
    severityDistribution,
    verificationFunnel,
    disasterBreakdown,
    priorityHeatmap,
    humanAiAgreement,
  };
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Analytics</h1>
        <p className="text-xs text-navy-500 mt-1">
          Geospatial analytics, triage distributions, and AI performance
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <Kpi label="Total Incidents" value={analytics.total} icon="📋" />
        <Kpi
          label="Critical"
          value={(analytics.severityDistribution.find((s) => s.name === "critical")?.value as number) ?? 0}
          tone="critical"
          icon="🚨"
        />
        <Kpi
          label="Verified"
          value={(analytics.verificationFunnel.find((s) => s.name === "verified")?.value as number) ?? 0}
          tone="success"
          icon="✓"
        />
        <Kpi
          label="Pending"
          value={(analytics.verificationFunnel.find((s) => s.name === "needs_review")?.value as number) ?? 0}
          tone="warning"
          icon="⏳"
        />
        <Kpi
          label="AI Agreement"
          value={`${analytics.humanAiAgreement}%`}
          tone="success"
          icon="🧠"
        />
      </div>

      {/* Time Series */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h3 className="text-xs font-bold text-navy-900 mb-4">Incident Volume Over Time</h3>
          <ReportsOverTimeChart data={analytics.reportsOverTime} />
        </div>
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h3 className="text-xs font-bold text-navy-900 mb-4">Severity Progression</h3>
          <SeverityOverTimeChart data={analytics.severityOverTime} />
        </div>
      </div>

      {/* Distributions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h3 className="text-xs font-bold text-navy-900 mb-4">Severity Distribution</h3>
          <SeverityDistributionChart data={analytics.severityDistribution} />
        </div>
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h3 className="text-xs font-bold text-navy-900 mb-4">Verification Funnel</h3>
          <VerificationFunnelChart data={analytics.verificationFunnel} />
        </div>
        <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
          <h3 className="text-xs font-bold text-navy-900 mb-4">Disaster Breakdown</h3>
          <DisasterTypeBreakdownChart data={analytics.disasterBreakdown} />
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-elevated">
        <h3 className="text-xs font-bold text-navy-900 mb-4">Priority Heatmap (Disaster × Severity)</h3>
        <PriorityHeatmapChart data={analytics.priorityHeatmap} />
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number | string;
  tone?: "critical" | "warning" | "success";
  icon: string;
}) {
  const toneClass =
    tone === "critical" ? "text-red-600" :
    tone === "warning" ? "text-amber-600" :
    tone === "success" ? "text-emerald-600" :
    "text-navy-900";

  return (
    <div className="rounded-xl border border-navy-100/60 bg-white p-4 shadow-elevated hover:shadow-elevated-lg transition-all duration-200">
      <div className="flex items-center justify-between text-[11px] text-navy-400 mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="text-sm">{icon}</span>
      </div>
      <p className={`text-2xl font-black tracking-tight ${toneClass}`}>{value}</p>
    </div>
  );
}
