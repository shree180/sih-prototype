import { getAuditLogs } from "@/lib/db/queries";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs(100);

  const actionColors: Record<string, string> = {
    report_created: "bg-amber-500",
    verification: "bg-emerald-500",
    severity_override: "bg-amber-500",
    escalated: "bg-red-500",
    rejected: "bg-neutral-500",
    export_generated: "bg-indigo-500",
    original_image_access: "bg-purple-500",
    auth_signin: "bg-teal-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-navy-900">Audit Trail</h1>
          <p className="text-xs text-navy-500">Complete accountability log for all events</p>
        </div>
        <Badge variant="default">{logs.length} Events</Badge>
      </div>

      <div className="glass-light rounded-xl p-4 flex items-start gap-3 border border-white/40">
        <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-navy-600 leading-relaxed">
          <p className="font-semibold text-navy-800 mb-0.5">Audit Integrity</p>
          <p>Every change answers: Who, What, When, Which resource, What changed. Overrides cannot be performed silently.</p>
        </div>
      </div>

      <div className="rounded-xl border border-navy-100/60 bg-white shadow-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-navy-100 bg-navy-50/50 text-navy-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Actor</th>
                <th className="px-4 py-2.5">Action</th>
                <th className="px-4 py-2.5">Resource</th>
                <th className="px-4 py-2.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100/60">
              {logs.map((log: any) => {
                const badgeColor = actionColors[log.action] || "bg-navy-500";
                let metaStr = "";
                try {
                  metaStr = typeof log.metadata === "object" ? JSON.stringify(log.metadata) : String(log.metadata);
                } catch {
                  metaStr = String(log.metadata || "");
                }

                return (
                  <tr key={log.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap text-navy-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="font-semibold text-navy-800">{log.actor_name || log.actor_email || "System"}</div>
                      <span className="text-[10px] text-navy-400 uppercase font-mono">{log.actor_role || "service"}</span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <Badge className={`${badgeColor} text-[10px] text-white`}>{log.action}</Badge>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-mono text-[11px] text-navy-600">
                      <span className="capitalize font-sans text-navy-400 mr-1">{log.resource_type}:</span>
                      {log.resource_id ? `${String(log.resource_id).slice(0, 8)}...` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-navy-600 max-w-xs font-mono text-[11px] truncate">{metaStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && (
          <EmptyState icon={<ShieldCheck className="h-7 w-7" />} title="No audit logs yet" />
        )}
      </div>
    </div>
  );
}
