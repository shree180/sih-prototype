"use client";

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_LABEL, SEVERITY_COLOR, VERIFICATION_LABEL } from "@/lib/rbac";
import type { Severity, VerificationStatus } from "@/lib/types";

interface RealTimeReport {
  id: string;
  disaster_type: string;
  final_severity: Severity | null;
  verification_status: VerificationStatus;
  priority_score: number | null;
  submitted_at: string;
}

export function RealTimeUpdates({ onUpdate }: { onUpdate?: (reports: RealTimeReport[]) => void }) {
  const [reports, setReports] = useState<RealTimeReport[]>([]);
  const [connected, setConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    fetchReports();

    // Set up real-time subscription
    const channel = supabase
      .channel("reports_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchReports();
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    // Also poll as fallback
    const interval = setInterval(fetchReports, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch("/api/authority/reports?pageSize=50");
      if (response.ok) {
        const data = await response.json();
        const typedReports = (data.reports || []).map((r: any) => ({
          id: r.id,
          disaster_type: r.disaster_type,
          final_severity: r.final_severity as Severity | null,
          verification_status: r.verification_status as VerificationStatus,
          priority_score: r.priority_score,
          submitted_at: r.submitted_at,
        }));
        setReports(typedReports);
        onUpdate?.(typedReports);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  }, [onUpdate]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
      <span>Live updates: {connected ? "Connected" : "Connecting..."}</span>
      <span className="text-gray-400">|</span>
      <span>Total: {reports.length}</span>
    </div>
  );
}

export function CriticalAlertsPanel({ reports }: { reports: RealTimeReport[] }) {
  const criticalReports = reports
    .filter((r) => r.final_severity === "critical" && r.verification_status !== "rejected")
    .sort((a, b) => (b.priority_score ?? 0) - (a.priority_score ?? 0))
    .slice(0, 5);

  if (!criticalReports.length) {
    return (
      <div className="rounded-md border bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Critical Alerts</h3>
        <p className="text-sm text-gray-400">No critical incidents at this time.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white p-4">
      <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Critical Alerts ({criticalReports.length})
      </h3>
      <div className="space-y-2">
        {criticalReports.map((r) => (
          <a
            key={r.id}
            href={`/authority/incidents/${r.id}`}
            className="block p-2 rounded border border-red-200 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{r.disaster_type}</span>
              <Badge className={SEVERITY_COLOR[r.final_severity ?? "unclear"]}>
                {SEVERITY_LABEL[r.final_severity ?? "unclear"]}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
              <span>Priority: {r.priority_score ?? "—"}</span>
              <Badge variant="muted">{VERIFICATION_LABEL[r.verification_status]}</Badge>
              <span>{new Date(r.submitted_at).toLocaleString()}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}