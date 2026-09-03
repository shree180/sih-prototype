import { query } from "@/lib/db/local";
import { IncidentsClient } from "./IncidentsClient";

export const dynamic = "force-dynamic";

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ disaster?: string; severity?: string; verify?: string }>;
}) {
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
    `SELECT id, disaster_type, asset_type, description, final_severity, ai_severity,
            ai_confidence, priority_score, verification_status, operational_status,
            location_lat, location_lng, submitted_at
     FROM reports 
     ORDER BY submitted_at DESC`
  );
  let rows = result.rows as Array<Record<string, any>>;

  const params = await searchParams;
  if (params.disaster) rows = rows.filter((r) => r.disaster_type === params.disaster);
  if (params.severity) rows = rows.filter((r) => r.final_severity === params.severity);
  if (params.verify) rows = rows.filter((r) => r.verification_status === params.verify);

  return <IncidentsClient rows={rows} />;
}