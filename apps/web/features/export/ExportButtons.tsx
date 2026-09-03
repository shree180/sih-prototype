"use client";

import { Button } from "@/components/ui/button";

export interface ExportRow {
  id: string;
  disaster_type: string;
  asset_type: string | null;
  ai_severity: string | null;
  ai_confidence: number | null;
  final_severity: string | null;
  priority_score: number | null;
  verification_status: string;
  operational_status: string;
  lat: number | null;
  lng: number | null;
  submitted_at: string;
}

function toCsv(rows: ExportRow[]): string {
  const headers = [
    "report_id", "submitted_at", "disaster_type", "asset_type",
    "latitude", "longitude", "ai_severity", "ai_confidence",
    "final_severity", "priority_score", "verification_status", "operational_status",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push([
      r.id, r.submitted_at, r.disaster_type, r.asset_type ?? "",
      r.lat ?? "", r.lng ?? "", r.ai_severity ?? "", r.ai_confidence ?? "",
      r.final_severity ?? "", r.priority_score ?? "", r.verification_status, r.operational_status,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  }
  return lines.join("\n");
}

export function ExportButtons({ rows }: { rows: ExportRow[] }) {
  function downloadCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incidents-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPdf() {
    const w = window.open("", "_blank");
    if (!w) return;
    const body = rows
      .map(
        (r) =>
          `<tr><td>${r.disaster_type}</td><td>${r.final_severity ?? ""}</td><td>${r.priority_score ?? ""}</td><td>${r.verification_status}</td><td>${r.submitted_at}</td></tr>`
      )
      .join("");
    w.document.write(`<html><head><title>Incident Export</title></head><body>
      <h2>Disaster Damage — Incident Export</h2>
      <p>Generated ${new Date().toLocaleString()}</p>
      <table border="1" cellpadding="4" cellspacing="0">
        <thead><tr><th>Disaster</th><th>Severity</th><th>Priority</th><th>Verification</th><th>Submitted</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
      <script>window.onload=()=>window.print()</script>
    </body></html>`);
    w.document.close();
  }

  return (
    <div className="flex gap-3">
      <Button onClick={downloadCsv} disabled={rows.length === 0}>Download CSV</Button>
      <Button variant="secondary" onClick={downloadPdf} disabled={rows.length === 0}>Print / PDF</Button>
    </div>
  );
}
