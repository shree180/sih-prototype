import { query } from "@/lib/db/local";
import { EnhancedExportButtons } from "@/features/export/EnhancedExportButtons";
import type { ExportRow } from "@/features/export/ExportButtons";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExportsPage() {
  const result = await query<ExportRow>(
    `SELECT id, disaster_type, asset_type, ai_severity, ai_confidence, 
            final_severity, priority_score, verification_status, operational_status,
            location_lat as lat, location_lng as lng, submitted_at
     FROM reports 
     ORDER BY submitted_at DESC`
  );
  const rows = result.rows;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-navy-900">Exports & Reports</h1>
        <p className="text-xs text-navy-500">Export incident data as CSV or PDF</p>
      </div>

      <div className="glass-tinted rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-navy-700 leading-relaxed">
          <p className="font-semibold mb-1">Data Governance</p>
          <p className="text-navy-600">
            Exports follow role-based authorization. Original photographic evidence remains in encrypted storage and is never included in downloads.
          </p>
        </div>
      </div>

      <EnhancedExportButtons rows={rows} />
    </div>
  );
}
