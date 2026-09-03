"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { verifyReport } from "./actions";
import { SEVERITY_LABEL, SEVERITY_COLOR, VERIFICATION_LABEL } from "@/lib/rbac";
import type { Severity, VerificationStatus, OperationalStatus } from "@/lib/types";

const SEVS: Severity[] = ["unclear", "minor", "moderate", "severe", "critical"];
const STATS: VerificationStatus[] = ["verified", "needs_review", "escalated", "rejected", "unverified"];
const OPS: OperationalStatus[] = ["new", "in_progress", "resolved", "archived"];

export function VerificationPanel({
  reportId,
  severity,
  aiSeverity,
  status,
  operational,
}: {
  reportId: string;
  severity: Severity | null;
  aiSeverity?: Severity | null;
  status: VerificationStatus;
  operational: OperationalStatus;
}) {
  const router = useRouter();
  const [sev, setSev] = useState<Severity | "">((severity as Severity) ?? "");
  const [stat, setStat] = useState<VerificationStatus>(status);
  const [op, setOp] = useState<OperationalStatus>(operational);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleExecuteAction(actionType: "confirm" | "override" | "escalate" | "reject") {
    setBusy(true);
    setMsg(null);

    let targetSeverity = sev || aiSeverity || "moderate";
    let targetStatus = stat;
    let actionReason = reason;

    if (actionType === "confirm") {
      targetSeverity = aiSeverity || severity || "moderate";
      targetStatus = "verified";
      actionReason = reason || "Authority confirmed AI preliminary visual triage assessment.";
    } else if (actionType === "escalate") {
      targetStatus = "escalated";
      actionReason = reason || "Escalated to NDRF/SDRF rapid disaster response command.";
    } else if (actionType === "reject") {
      targetStatus = "rejected";
      actionReason = reason || "Marked as false positive / insufficient damage evidence.";
    } else if (actionType === "override") {
      if (!reason) {
        setBusy(false);
        return setMsg({ type: "error", text: "Please enter an operational reason for severity override." });
      }
      targetStatus = "verified";
    }

    const fd = new FormData();
    fd.append("report_id", reportId);
    fd.append("final_severity", targetSeverity);
    fd.append("verification_status", targetStatus);
    fd.append("operational_status", op);
    fd.append("reason", actionReason);
    fd.append("notes", notes);

    const res = await verifyReport(fd);
    setBusy(false);

    if (!res.ok) {
      return setMsg({ type: "error", text: res.error ?? "Verification action failed" });
    }

    setMsg({ type: "success", text: "Verification event successfully recorded into immutable audit trail." });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-elevated space-y-5">
      <div className="flex items-center justify-between border-b border-navy-100/60 pb-3">
        <div>
          <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <span>Human Verification Workbench</span>
          </h3>
          <p className="text-xs text-navy-400">
            AI assists triage; authorized human makes the accountable decision.
          </p>
        </div>
        <Badge variant="success">Auditable Trail Active</Badge>
      </div>

      {msg && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium border ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{msg.type === "success" ? "✓" : "⚠️"}</span>
          <span>{msg.text}</span>
        </div>
      )}

      {/* Quick 1-Click Operational Action Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block">
          Quick Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Button
            type="button"
            onClick={() => handleExecuteAction("confirm")}
            disabled={busy}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 shadow-sm"
          >
            ✓ Confirm AI Triage
          </Button>

          <Button
            type="button"
            onClick={() => handleExecuteAction("escalate")}
            disabled={busy}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2.5 shadow-sm"
          >
            ⚡ Escalate (NDRF)
          </Button>

          <Button
            type="button"
            onClick={() => handleExecuteAction("reject")}
            disabled={busy}
            variant="secondary"
            className="rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold py-2.5"
          >
            ✕ Mark False Positive
          </Button>

          <Button
            type="button"
            onClick={() => handleExecuteAction("override")}
            disabled={busy}
            variant="outline"
            className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-semibold py-2.5"
          >
            ✎ Apply Override
          </Button>
        </div>
      </div>

      {/* Structured Override Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-navy-100/60">
        <div>
          <Label className="text-xs font-semibold uppercase text-navy-500">
            Override Final Severity
          </Label>
          <Select
            value={sev}
            onChange={(e) => setSev(e.target.value as Severity)}
            className="mt-1 font-medium"
          >
            {SEVS.map((s) => (
              <option key={s} value={s}>
                {SEVERITY_LABEL[s]} (Level {s === "unclear" ? 0 : s === "minor" ? 1 : s === "moderate" ? 2 : s === "severe" ? 3 : 4})
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase text-navy-500">
            Verification Status
          </Label>
          <Select
            value={stat}
            onChange={(e) => setStat(e.target.value as VerificationStatus)}
            className="mt-1 font-medium"
          >
            {STATS.map((s) => (
              <option key={s} value={s}>
                {VERIFICATION_LABEL[s]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase text-navy-500">
            Operational Response State
          </Label>
          <Select
            value={op}
            onChange={(e) => setOp(e.target.value as OperationalStatus)}
            className="mt-1 font-medium"
          >
            {OPS.map((o) => (
              <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1).replace("_", " ")}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase text-navy-500">
          Operational Override Reason (Mandatory)
        </Label>
        <Textarea
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Field inspection reveals ground-floor structural water intrusion was deeper than image angle suggested; upgraded to Critical."
          className="mt-1 text-xs"
        />
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase text-navy-500">
          Internal Officer Notes
        </Label>
        <Textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Contacted District Emergency Operations Center (DEOC). 2 rescue dinghies dispatched."
          className="mt-1 text-xs"
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-navy-100/60 text-[11px] text-navy-400">
        <span>Every change logs an immutable audit event.</span>
        <Button
          type="button"
          onClick={() => handleExecuteAction("override")}
          disabled={busy}
        >
          {busy ? "Saving Verification..." : "Save Custom Verification"}
        </Button>
      </div>
    </div>
  );
}
