import Link from "next/link";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReportsByReporter } from "@/lib/db/queries";
import { SEVERITY_LABEL, SEVERITY_COLOR, VERIFICATION_LABEL, priorityBand } from "@/lib/rbac";
import type { Severity, VerificationStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MyReportsPage({
  searchParams,
}: {
  searchParams?: Promise<{ submitted?: string }> | { submitted?: string };
}) {
  const headersList = headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return null;
  }

  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const list = await getReportsByReporter(userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">My Reports</h1>
          <p className="text-xs text-navy-500 mt-1">
            Track AI triage, privacy status, and verification progress
          </p>
        </div>
        <Link href="/citizen/report">
          <Button size="sm">+ Report New Incident</Button>
        </Link>
      </div>

      {resolvedParams?.submitted && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs text-emerald-700 animate-fade-in-scale">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">
            ✓
          </div>
          <div>
            <p className="font-semibold text-emerald-800">Report Submitted</p>
            <p className="mt-0.5 text-emerald-600">
              Evidence secured, face redaction applied, AI triage generated.
            </p>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 border border-navy-100 text-2xl mb-4">
            📋
          </div>
          <h3 className="text-base font-semibold text-navy-900">No reports yet</h3>
          <p className="mt-1.5 text-xs text-navy-400 max-w-sm mx-auto leading-relaxed">
            When you submit photos of disaster damage, they will appear here with AI triage analysis.
          </p>
          <Link href="/citizen/report" className="mt-5 inline-block">
            <Button>Submit Your First Report</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r: any) => {
            const sev = (r.final_severity as Severity) ?? "unclear";
            const band = priorityBand(r.priority_score);
            const ai = r.assessments && r.assessments.length > 0 ? r.assessments[0] : null;

            return (
              <div key={r.id} className="rounded-2xl border border-navy-100/60 bg-white shadow-elevated p-5 overflow-hidden">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-navy-100/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900 text-sm capitalize">
                        {r.disaster_type.replace("_", " ")}
                      </span>
                      <span className="text-navy-300">·</span>
                      <span className="text-xs text-navy-500 capitalize">{r.asset_type || "Asset"}</span>
                    </div>
                    <p className="text-[11px] text-navy-400">
                      <code className="font-mono text-navy-500">{r.id.slice(0, 8)}</code> ·{" "}
                      {new Date(r.submitted_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={SEVERITY_COLOR[sev]}>
                      {SEVERITY_LABEL[sev]}
                    </Badge>
                    <Badge className={band.color}>
                      P{band.label} ({r.priority_score ?? "—"})
                    </Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="md:col-span-2 space-y-3">
                    {r.description && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-1.5">
                          Observation
                        </span>
                        <p className="text-xs text-navy-600 bg-navy-50/50 p-3 rounded-xl border border-navy-100/60 leading-relaxed">
                          {r.description}
                        </p>
                      </div>
                    )}

                    {ai && (
                      <div className="rounded-xl glass-tinted p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                            <span>🤖</span> Vision AI Triage
                          </span>
                          <span className="text-amber-600 font-mono text-[11px]">
                            {ai.confidence ? `${Math.round(ai.confidence * 100)}%` : "—"}
                          </span>
                        </div>
                        {ai.explanation && (
                          <p className="text-xs text-navy-600 leading-relaxed">{ai.explanation}</p>
                        )}
                        {ai.indicators && Array.isArray(ai.indicators) && ai.indicators.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {ai.indicators.map((ind: string, i: number) => (
                              <span key={i} className="rounded-full bg-white/60 border border-amber-200/50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                #{ind}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between rounded-xl bg-navy-50/50 p-3 text-xs border border-navy-100/60">
                      <span className="text-navy-500">
                        Status: <strong className="text-navy-700 uppercase font-mono">{r.operational_status}</strong>
                      </span>
                      <span className="text-navy-600">
                        Verification: <strong className="text-amber-600">{VERIFICATION_LABEL[r.verification_status as VerificationStatus] || r.verification_status}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 md:border-l md:border-navy-100/60 md:pl-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-1.5">Location</span>
                      <p className="text-xs font-mono text-navy-600">
                        {r.lat && r.lng ? `${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}` : "Not provided"}
                      </p>
                      <span className="text-[10px] text-navy-400 block mt-0.5">
                        Source: {r.location_source || "GPS"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-1.5">Privacy</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        🔒 Face Redacted
                      </span>
                    </div>

                    <div className="pt-2 border-t border-navy-100/60 text-[11px] text-navy-400 space-y-0.5">
                      <p>Impact: {r.infrastructure_impact ? "Infrastructure affected" : "Normal"}</p>
                      <p>Access: {r.accessibility_blocked ? "Road blocked" : "Clear"}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
