"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { ExportRow } from "@/features/export/ExportButtons";

interface ExportFilters {
  disaster_type: string;
  final_severity: string;
  verification_status: string;
  operational_status: string;
  date_from: string;
  date_to: string;
  search: string;
  has_location: boolean;
}

export function EnhancedExportButtons({ rows }: { rows: ExportRow[] }) {
  const [filters, setFilters] = useState<ExportFilters>({
    disaster_type: "",
    final_severity: "",
    verification_status: "",
    operational_status: "",
    date_from: "",
    date_to: "",
    search: "",
    has_location: false,
  });
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");

  async function downloadCsv() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });
      params.set("action", "export");
      params.set("format", "csv");

      const response = await fetch(`/api/authority/reports?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `incidents-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("CSV export failed:", error);
    } finally {
      setExporting(false);
    }
  }

  async function downloadPdf() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });
      params.set("action", "export");
      params.set("format", "json");

      const response = await fetch(`/api/authority/reports?${params.toString()}`);
      if (response.ok) {
        const reports = await response.json();
        generatePdf(reports);
      }
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setExporting(false);
    }
  }

  function generatePdf(reports: ExportRow[]) {
    const doc = new jsPDF("landscape");
    
    // Title
    doc.setFontSize(18);
    doc.text("Disaster Damage - Incident Export", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Reports: ${reports.length}`, 14, 36);

    // Summary stats
    const bySeverity = reports.reduce((acc, r) => {
      acc[r.final_severity ?? "unknown"] = (acc[r.final_severity ?? "unknown"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDisaster = reports.reduce((acc, r) => {
      acc[r.disaster_type] = (acc[r.disaster_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    doc.setFontSize(12);
    doc.text("Summary", 14, 46);
    doc.setFontSize(10);
    let y = 52;
    Object.entries(bySeverity).forEach(([sev, count]) => {
      doc.text(`${sev}: ${count}`, 14, y);
      y += 6;
    });
    y += 4;
    Object.entries(byDisaster).slice(0, 5).forEach(([disaster, count]) => {
      doc.text(`${disaster}: ${count}`, 14, y);
      y += 6;
    });

    // Table
    const tableData = reports.map((r) => [
      r.id.slice(0, 8),
      r.submitted_at?.split("T")[0] ?? "",
      r.disaster_type,
      r.asset_type ?? "",
      r.final_severity ?? "",
      r.priority_score ?? "",
      r.verification_status,
      r.operational_status,
      r.lat && r.lng ? `${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}` : "—",
    ]);

    autoTable(doc, {
      startY: y + 10,
      head: [["ID", "Date", "Disaster", "Asset", "Severity", "Priority", "Verification", "Operational", "Location"]],
      body: tableData,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 22 },
        2: { cellWidth: 25 },
        8: { cellWidth: 35 },
      },
    });

    doc.save(`incidents-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardTitle className="mb-2">Export Filters</CardTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Disaster</label>
            <Select value={filters.disaster_type} onChange={(e) => setFilters({ ...filters, disaster_type: e.target.value })}>
              <option value="">All</option>
              {["flood", "earthquake", "cyclone", "fire", "landslide", "drought", "industrial", "building_collapse", "other"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Severity</label>
            <Select value={filters.final_severity} onChange={(e) => setFilters({ ...filters, final_severity: e.target.value })}>
              <option value="">All</option>
              {["unclear", "minor", "moderate", "severe", "critical"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Verification</label>
            <Select value={filters.verification_status} onChange={(e) => setFilters({ ...filters, verification_status: e.target.value })}>
              <option value="">All</option>
              {["unverified", "needs_review", "verified", "rejected", "escalated"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Operational</label>
            <Select value={filters.operational_status} onChange={(e) => setFilters({ ...filters, operational_status: e.target.value })}>
              <option value="">All</option>
              {["new", "in_progress", "resolved", "archived"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">From Date</label>
            <input
              type="date"
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">To Date</label>
            <input
              type="date"
              className="w-full rounded-md border px-2 py-1 text-sm"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Search</label>
            <input
              type="text"
              className="w-full rounded-md border px-2 py-1 text-sm"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.has_location}
                onChange={(e) => setFilters({ ...filters, has_location: e.target.checked })}
              />
              <span className="text-xs">Has location</span>
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-2">Filtered incident set ({rows.length})</CardTitle>
        <div className="flex gap-3">
          <Button onClick={downloadCsv} disabled={rows.length === 0 || exporting}>
            {exporting ? "Exporting..." : "Download CSV"}
          </Button>
          <Button variant="secondary" onClick={downloadPdf} disabled={rows.length === 0 || exporting}>
            {exporting ? "Generating..." : "Download PDF"}
          </Button>
          <ScheduledExportStub />
        </div>
      </Card>
    </div>
  );
}

function ScheduledExportStub() {
  return (
    <Button variant="outline" onClick={() => alert("Scheduled exports - cron job stub. Configure in infrastructure.")}>
      Schedule Export
    </Button>
  );
}