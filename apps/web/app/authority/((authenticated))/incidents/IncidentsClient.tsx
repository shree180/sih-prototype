"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterBar } from "@/features/reports/FilterBar";
import { IncidentMap, MapReport } from "@/features/map/IncidentMap";
import { SEVERITY_LABEL, SEVERITY_COLOR, VERIFICATION_LABEL, priorityBand } from "@/lib/rbac";
import type { Severity, VerificationStatus } from "@/lib/types";

interface IncidentsClientProps {
  rows: any[];
}

export function IncidentsClient({ rows }: IncidentsClientProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"verify" | "export" | "">("");
  const [bulkStatus, setBulkStatus] = useState<VerificationStatus>("verified");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");

  const mapReports: MapReport[] = rows
    .filter((r) => r.location_lat != null && r.location_lng != null)
    .map((r) => ({
      id: r.id,
      lat: r.location_lat!,
      lng: r.location_lng!,
      severity: (r.final_severity as Severity) ?? null,
      disaster_type: r.disaster_type,
    }));

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? rows.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;
    setBulkBusy(true);
    try {
      if (bulkAction === "verify") {
        const res = await fetch("/api/authority/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify",
            reportIds: selectedIds,
            verification_status: bulkStatus,
            reason: "Bulk verification by authority operator",
          }),
        });
        if (res.ok) {
          router.refresh();
          setSelectedIds([]);
        }
      } else if (bulkAction === "export") {
        const res = await fetch("/api/authority/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "export", reportIds: selectedIds, format: "csv" }),
        });
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `incidents-${new Date().toISOString().slice(0, 10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setBulkBusy(false);
      setBulkAction("");
    }
  };

  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Incidents</h1>
          <p className="text-xs text-navy-500 mt-1">
            {rows.length} records · Filter, verify, and export
          </p>
        </div>
        <div className="flex rounded-lg border border-navy-200 bg-white p-0.5 shadow-sm">
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              viewMode === "table" ? "bg-navy-900 text-white shadow-sm" : "text-navy-600 hover:text-navy-900"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              viewMode === "map" ? "bg-navy-900 text-white shadow-sm" : "text-navy-600 hover:text-navy-900"
            }`}
          >
            Map
          </button>
        </div>
      </div>

      <FilterBar />

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl glass-tinted p-3 text-xs animate-fade-in-scale">
          <span className="font-semibold text-amber-700">
            {selectedIds.length} selected
          </span>
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as any)}
              className="rounded-lg border border-amber-200 bg-white/60 px-2.5 py-1 text-xs font-medium text-navy-700"
              disabled={bulkBusy}
            >
              <option value="">Bulk operation...</option>
              <option value="verify">Set Status</option>
              <option value="export">Export CSV</option>
            </select>

            {bulkAction === "verify" && (
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as any)}
                className="rounded-lg border border-amber-200 bg-white/60 px-2.5 py-1 text-xs font-medium text-navy-700"
                disabled={bulkBusy}
              >
                <option value="verified">Verified</option>
                <option value="needs_review">Needs Review</option>
                <option value="escalated">Escalated</option>
                <option value="rejected">Rejected</option>
              </select>
            )}

            <Button size="sm" onClick={handleBulkAction} disabled={bulkBusy || !bulkAction}>
              {bulkBusy ? "Applying..." : "Execute"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setBulkAction(""); setSelectedIds([]); }}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {viewMode === "map" && (
        <div className="rounded-2xl border border-navy-100/60 bg-white overflow-hidden shadow-elevated">
          <IncidentMap reports={mapReports} height="h-[600px]" />
        </div>
      )}

      {viewMode === "table" && (
        <div className="rounded-2xl border border-navy-100/60 bg-white shadow-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-navy-100/60 bg-navy-50/50 text-navy-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="w-10 px-4 py-2.5">
                    <Checkbox checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)} aria-label="Select all" />
                  </th>
                  <th className="px-4 py-2.5">Incident</th>
                  <th className="px-4 py-2.5">Severity</th>
                  <th className="px-4 py-2.5">Priority</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Location</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/40">
                {rows.map((r) => {
                  const band = priorityBand(r.priority_score);
                  const isSelected = selectedIds.includes(r.id);
                  const sev = (r.final_severity as Severity) ?? "unclear";

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors duration-150 hover:bg-navy-50/30 ${isSelected ? "bg-amber-50/40" : ""}`}
                    >
                      <td className="px-4 py-2.5">
                        <Checkbox checked={isSelected} onChange={(e) => handleSelectOne(r.id, e.target.checked)} aria-label={`Select ${r.id}`} />
                      </td>
                      <td className="px-4 py-2.5">
                        <Link href={`/authority/incidents/${r.id}`} className="block group">
                          <span className="font-bold text-navy-900 capitalize group-hover:text-amber-600 transition-colors">
                            {r.disaster_type.replace("_", " ")}
                          </span>
                          <span className="text-navy-400 block text-[11px] capitalize">
                            {r.asset_type || "Property"}
                          </span>
                          {r.description && (
                            <p className="text-[11px] text-navy-500 line-clamp-1 max-w-xs mt-0.5">{r.description}</p>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Badge className={SEVERITY_COLOR[sev]}>{SEVERITY_LABEL[sev]}</Badge>
                          {r.ai_confidence != null && (
                            <span className="text-[10px] text-navy-400 font-mono">{Math.round(r.ai_confidence * 100)}%</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <Badge className={band.color}>{band.label} ({r.priority_score ?? "—"})</Badge>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="rounded-full bg-navy-50 border border-navy-100 px-2 py-0.5 text-[10px] font-semibold text-navy-600">
                          {VERIFICATION_LABEL[r.verification_status as VerificationStatus] || r.verification_status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-navy-500 text-[11px]">
                        <p className="font-mono">{r.location_lat && r.location_lng ? `${r.location_lat.toFixed(4)}, ${r.location_lng.toFixed(4)}` : "—"}</p>
                        <p className="text-[10px] text-navy-400">{new Date(r.submitted_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        <Link href={`/authority/incidents/${r.id}`}>
                          <span className="rounded-lg border border-navy-200 bg-white px-2.5 py-1 text-[11px] font-medium text-navy-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all duration-150 active:scale-[0.97]">
                            View →
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-navy-400">
                      No incidents match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
