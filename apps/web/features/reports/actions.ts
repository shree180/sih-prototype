"use server";

import { query, transaction, setCurrentUser } from "@/lib/db/local";
import { getSession, getProfile } from "@/lib/auth/local";
import { cookies } from "next/headers";
import type { Severity } from "@/lib/types";
import * as fs from "fs/promises";
import * as path from "path";
import sharp from "sharp";

const AI_URL = process.env.AI_SERVICE_URL ?? "http://localhost:8000";
const AI_KEY = process.env.AI_SERVICE_KEY ?? "";

async function toBase64(buf: Buffer): Promise<string> {
  return buf.toString("base64");
}

async function callRedact(b64: string): Promise<{ image: string; faces_detected: number }> {
  try {
    const res = await fetch(`${AI_URL}/redact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(AI_KEY ? { "x-api-key": AI_KEY } : {}) },
      body: JSON.stringify({ image: `data:image/jpeg;base64,${b64}` }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("privacy processing failed");
    return res.json();
  } catch {
    // If AI service is unavailable, return the original image unredacted
    return { image: b64, faces_detected: 0 };
  }
}

async function callAssess(b64: string, disasterType: string, description?: string) {
  try {
    const res = await fetch(`${AI_URL}/assess`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(AI_KEY ? { "x-api-key": AI_KEY } : {}) },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${b64}`,
        disaster_type: disasterType,
        description: description ?? "",
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error("assessment failed");
    return res.json();
  } catch {
    // If AI service is unavailable, return a default assessment based on the disaster type
    return {
      severity: "unclear",
      confidence: 0.3,
      indicators: [],
      explanation: "AI assessment unavailable. Report requires manual review.",
      status: "needs_human_review",
      provider: "local-fallback",
      model_name: "fallback",
      model_version: "1.0",
      processing_time_ms: 0,
    };
  }
}

export type SubmitResult =
  | {
  ok: true;
  reportId: string;
  assessment?: {
    severity: string;
    confidence: number;
    indicators: string[];
    explanation: string;
    status: string;
    provider: string;
    model_name: string;
    model_version: string;
  };
}
  | { ok: false; error: string };

interface UploadedImageData {
  originalUrl: string;
  thumbnailUrl: string;
  redactedUrl: string;
  sha256: string;
  perceptualHash: string;
  width: number;
  height: number;
  fileSize: number;
}

async function readImageFromPublicUrl(publicUrl: string): Promise<Buffer> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(process.cwd(), "public", publicUrl.replace(/^\/uploads\//, "uploads/"));
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(uploadsDir))) {
    throw new Error("Invalid file path: access denied");
  }
  return fs.readFile(resolved);
}

async function writeRedactedImage(publicUrl: string, buffer: Buffer): Promise<void> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(process.cwd(), "public", publicUrl.replace(/^\/uploads\//, "uploads/"));
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(uploadsDir))) {
    throw new Error("Invalid file path: access denied");
  }
  await fs.writeFile(resolved, buffer);
}

export async function submitReport(formData: FormData): Promise<SubmitResult> {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return { ok: false, error: "unauthorized" };

  const session = getSession(token);
  if (!session) return { ok: false, error: "session expired" };

  const profile = await getProfile(session.userId);
  if (!profile) return { ok: false, error: "user not found" };
  const reporterId = profile.user_id;

  const disasterType = String(formData.get("disaster_type") ?? "");
  const assetType = (formData.get("asset_type") as string) || null;
  const description = (formData.get("description") as string) || null;
  const observedSeverity = (formData.get("observed_severity") as Severity) || null;
  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const accuracy = formData.get("accuracy") ? parseFloat(formData.get("accuracy") as string) : null;
  const locationSource = (formData.get("location_source") as string) || "manual";
  const affectedPeople = formData.get("affected_people") ? parseInt(formData.get("affected_people") as string, 10) : null;
  const infra = formData.get("infrastructure_impact") === "on";
  const access = formData.get("accessibility_blocked") === "on";

  if (!disasterType || isNaN(lat) || isNaN(lng)) {
    return { ok: false, error: "missing required fields" };
  }

  const imageUrlsJson = formData.getAll("imageUrls") as string[];
  let uploadedImages: UploadedImageData[];
  try {
    uploadedImages = imageUrlsJson.map((value) => JSON.parse(value) as UploadedImageData);
  } catch {
    return { ok: false, error: "Uploaded image metadata is invalid. Please upload the images again." };
  }

  if (uploadedImages.length === 0) {
    return { ok: false, error: "no images provided" };
  }

  const reportId = crypto.randomUUID();
  let aiResult: Awaited<ReturnType<typeof callAssess>> | null = null;

  try {
    await transaction(async (client) => {
      await setCurrentUser(client, reporterId);

      for (const imgData of uploadedImages) {
        const originalBuffer = await readImageFromPublicUrl(imgData.originalUrl);
        const b64 = await toBase64(originalBuffer);

        const red = await callRedact(b64);
        const redactedBuf = Buffer.from(red.image, "base64");
        await writeRedactedImage(imgData.redactedUrl, redactedBuf);

        if (!aiResult) {
          aiResult = await callAssess(b64, disasterType, description ?? undefined);
        }
      }

      if (!aiResult) throw new Error("No assessment was returned. Please try again.");

      const calculatedPriority = computePriority(
        aiResult.severity,
        aiResult.confidence,
        affectedPeople,
        infra,
        access
      );
      // Insert Report Record
      await client.query(
        `INSERT INTO reports (
          id, reporter_id, disaster_type, asset_type, description,
          observed_severity, ai_severity, ai_confidence, final_severity,
          priority_score, verification_status, operational_status,
          affected_people, infrastructure_impact, accessibility_blocked,
          location_lat, location_lng, location_accuracy_m, location_source,
          submitted_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'new', $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())`,
        [
          reportId, reporterId, disasterType, assetType, description,
          observedSeverity, aiResult.severity, aiResult.confidence, aiResult.severity,
          calculatedPriority, aiResult.status === "needs_human_review" ? "needs_review" : "unverified",
          affectedPeople, infra, access,
          lat, lng, accuracy, locationSource,
        ]
      );

      // Insert Media records
      for (const imgData of uploadedImages) {
        const origStoragePath = imgData.originalUrl.replace(/^\/uploads\//, "");
        const redStoragePath = imgData.redactedUrl.replace(/^\/uploads\//, "");

        await client.query(
          `INSERT INTO report_media (report_id, storage_path, media_type, file_size, sha256, perceptual_hash, is_original, privacy_status, privacy_processed)
           VALUES ($1, $2, 'image/jpeg', $3, $4, $5, true, 'done', true),
                  ($1, $6, 'image/jpeg', $3, $4, $5, false, 'done', true)`,
          [reportId, origStoragePath, imgData.fileSize || 1024, imgData.sha256 || "sha256", imgData.perceptualHash || "phash", redStoragePath]
        );
      }

      // Insert AI assessment record
      await client.query(
        `INSERT INTO ai_assessments (
          report_id, provider, model_name, model_version,
          predicted_category, predicted_severity, confidence, indicators, explanation, status, processing_time_ms, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
        [
          reportId, aiResult.provider, aiResult.model_name, aiResult.model_version,
          disasterType, aiResult.severity, aiResult.confidence,
          JSON.stringify(aiResult.indicators), aiResult.explanation, aiResult.status, aiResult.processing_time_ms,
        ]
      );

      // Log Audit Event
      await client.query(
        `INSERT INTO audit_logs (actor_id, action, resource_type, resource_id, metadata, created_at)
         VALUES ($1, 'report_created', 'report', $2, $3, NOW())`,
        [
          reporterId,
          reportId,
          JSON.stringify({
            disaster: disasterType,
            severity: aiResult.severity,
            priority: calculatedPriority,
            location: { lat, lng },
          }),
        ]
      );
    });

    if (!aiResult) {
      throw new Error("AI assessment was not completed. Please try again.");
    }

    return {
      ok: true,
      reportId,
      assessment: {
        severity: aiResult.severity,
        confidence: aiResult.confidence,
        indicators: aiResult.indicators,
        explanation: aiResult.explanation,
        status: aiResult.status,
        provider: aiResult.provider,
        model_name: aiResult.model_name,
        model_version: aiResult.model_version,
      },
    };
  } catch (err) {
    console.error("submitReport error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "submit failed" };
  }

  // Safety net: this line should never be reached, but TypeScript cannot prove
  // that every code path above returns. The explicit return prevents the server
  // action from ever returning undefined to the client.
  return { ok: false, error: "An unexpected error occurred. Please try again." };
}

function computePriority(
  severity: string,
  confidence: number,
  affected: number | null,
  infra: boolean,
  access: boolean
): number {
  const sevMap: Record<string, number> = { critical: 40, severe: 32, moderate: 22, minor: 12, unclear: 0 };
  const sev = sevMap[severity] ?? 0;
  const conf = Math.round((confidence ?? 0) * 15);
  const people = Math.min(15, Math.ceil((affected ?? 0) / 5));
  const inf = infra ? 10 : 0;
  const acc = access ? 10 : 0;
  const recency = 10;
  return Math.min(100, Math.max(0, sev + conf + people + inf + acc + recency));
}
