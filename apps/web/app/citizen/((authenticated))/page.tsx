import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { query } from "@/lib/db/local";
import { SEVERITY_LABEL, SEVERITY_COLOR, VERIFICATION_LABEL } from "@/lib/rbac";
import type { Severity, VerificationStatus } from "@/lib/types";
import { Camera, ArrowRight, ShieldCheck, Zap, BadgeCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CitizenHome() {
  const headersList = headers();
  const userId = headersList.get("x-user-id");

  if (!userId) return null;

  const result = await query<{
    id: string;
    disaster_type: string;
    description: string | null;
    final_severity: string | null;
    ai_confidence: number | null;
    priority_score: number | null;
    verification_status: string;
    operational_status: string;
    submitted_at: Date;
  }>(
    `SELECT id, disaster_type, description, final_severity, ai_confidence, priority_score,
            verification_status, operational_status, submitted_at 
     FROM reports 
     WHERE reporter_id = $1 
     ORDER BY submitted_at DESC 
     LIMIT 5`,
    [userId]
  );
  const reports = result.rows;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-950 p-8 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/15 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Report Damage. Protect Your Community.
          </h1>
          <p className="mt-3 text-sm text-navy-300 leading-relaxed max-w-lg">
            Upload incident photos and location evidence. Privacy redaction and AI triage deliver verified intelligence to authorities.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/citizen/report">
              <Button size="lg" className="bg-amber-500 text-white hover:bg-amber-400 shadow-glow group px-6">
                + Report Damage
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/citizen/my-reports">
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/10 px-5">
                My Reports ({reports.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Privacy by Default", desc: "Automated face redaction. Originals stay restricted." },
          { icon: Zap, title: "AI-Assisted Triage", desc: "Instant severity estimation and confidence scores." },
          { icon: BadgeCheck, title: "Human Verification", desc: "Authorities verify before emergency dispatch." },
        ].map((item) => (
          <div key={item.title} className="glass-light rounded-xl p-4 border border-white/40">
            <item.icon className="h-5 w-5 text-amber-600 mb-2" />
            <h3 className="text-sm font-semibold text-navy-900">{item.title}</h3>
            <p className="text-xs text-navy-500 mt-1 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-900 tracking-tight">Recent Submissions</h2>
            <p className="text-xs text-navy-500">Status and AI triage results</p>
          </div>
          {reports.length > 0 && (
            <Link href="/citizen/my-reports" className="text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors">
              View all
            </Link>
          )}
        </div>

        {reports.length === 0 ? (
          <EmptyState
            icon={<Camera className="h-7 w-7" />}
            title="No reports yet"
            description="Submit your first damage report to get started."
            action={
              <Link href="/citizen/report">
                <Button size="sm">Submit First Report</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {reports.map((r) => {
              const sev = (r.final_severity as Severity) ?? "unclear";
              const sevColor = SEVERITY_COLOR[sev] || "";
              return (
                <Link key={r.id} href={`/citizen/my-reports`}>
                  <div className="rounded-xl border border-navy-100/60 bg-white p-4 shadow-elevated hover:shadow-elevated-lg transition-all duration-200 group">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-semibold text-navy-900 capitalize">
                          {r.disaster_type.replace("_", " ")}
                        </span>
                        <p className="text-[11px] text-navy-400 mt-0.5">
                          {new Date(r.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={sevColor}>{SEVERITY_LABEL[sev]}</Badge>
                    </div>
                    {r.description && (
                      <p className="mt-2 text-xs text-navy-600 line-clamp-2">{r.description}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-navy-100/60 text-[11px]">
                      <span className="text-navy-500">
                        {VERIFICATION_LABEL[r.verification_status as VerificationStatus] || r.verification_status}
                      </span>
                      <span className="font-mono text-navy-400">
                        P:{r.priority_score ?? "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
