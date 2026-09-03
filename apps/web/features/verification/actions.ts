"use server";

import { query, transaction, setCurrentUser } from "@/lib/db/local";
import { getSession, getProfile } from "@/lib/auth/local";
import { cookies } from "next/headers";
import type { Severity, VerificationStatus, OperationalStatus } from "@/lib/types";

export interface VerifyResult {
  ok: boolean;
  error?: string;
}

export async function verifyReport(formData: FormData): Promise<VerifyResult> {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return { ok: false, error: "unauthorized" };

  const session = getSession(token);
  if (!session) return { ok: false, error: "session expired" };

  const profile = await getProfile(session.userId);
  if (!profile) return { ok: false, error: "user not found" };
  const reviewerId = profile.user_id;

  if (!["authority", "analyst", "admin"].includes(profile.role)) {
    return { ok: false, error: "insufficient permissions" };
  }

  const reportId = String(formData.get("report_id") ?? "");
  const newSeverity = (formData.get("final_severity") as Severity) || null;
  const newStatus = (formData.get("verification_status") as VerificationStatus) || "unverified";
  const newOperational = (formData.get("operational_status") as OperationalStatus) || null;
  const reason = (formData.get("reason") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  try {
    await transaction(async (client) => {
      await setCurrentUser(client, reviewerId);

      // Get current values for audit diff
      const currentResult = await client.query(
        `SELECT final_severity, verification_status, operational_status FROM reports WHERE id = $1`,
        [reportId]
      );
      const current = currentResult.rows[0];

      // Insert verification event
      await client.query(
        `INSERT INTO verification_events (report_id, reviewer_id, previous_severity, new_severity,
         previous_status, new_status, reason, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [reportId, reviewerId, current?.final_severity ?? null, newSeverity,
         current?.verification_status ?? null, newStatus, reason, notes]
      );

      // Update report
      await client.query(
        `UPDATE reports SET
          final_severity = $1,
          verification_status = $2,
          operational_status = $3
         WHERE id = $4`,
        [newSeverity, newStatus, newOperational ?? current?.operational_status, reportId]
      );

      // Audit log
      await client.query(
        `INSERT INTO audit_logs (actor_id, action, resource_type, resource_id, metadata)
         VALUES ($1, 'verification', 'report', $2, $3)`,
        [reviewerId, reportId, JSON.stringify({ new_severity: newSeverity, new_status: newStatus })]
      );
    });

    return { ok: true };
  } catch (err) {
    console.error("verifyReport error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "verification failed" };
  }
}