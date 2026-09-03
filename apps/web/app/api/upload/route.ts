import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, getProfile } from "@/lib/auth/local";
import {
  validateImage,
  saveUploadedImage,
  cleanupUploadedFiles,
  getPublicUrl,
  UploadResult,
} from "@/lib/image/process";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const session = getSession(token);
    if (!session) {
      return NextResponse.json({ ok: false, error: "session expired" }, { status: 401 });
    }

    const profile = await getProfile(session.userId);
    if (!profile) {
      return NextResponse.json({ ok: false, error: "user not found" }, { status: 404 });
    }
    const userId = profile.user_id;

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    const reportId = formData.get("reportId") as string || crypto.randomUUID();

    if (!files || files.length === 0) {
      return NextResponse.json({ ok: false, error: "No files provided" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { ok: false, error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    const results: UploadResult[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 10MB limit`);
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const validation = await validateImage(buffer);
      
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      try {
        const result = await saveUploadedImage(userId, reportId, buffer);
        results.push(result);
      } catch (err) {
        errors.push(`${file.name}: ${err instanceof Error ? err.message : "Processing failed"}`);
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No valid images uploaded", details: errors },
        { status: 400 }
      );
    }

    const uploadedFiles = results.map((r) => ({
      originalUrl: getPublicUrl(r.originalPath),
      thumbnailUrl: getPublicUrl(r.thumbnailPath),
      redactedUrl: getPublicUrl(r.redactedPath),
      sha256: r.sha256,
      perceptualHash: r.perceptualHash,
      width: r.width,
      height: r.height,
      fileSize: r.fileSize,
    }));

    return NextResponse.json({
      ok: true,
      reportId,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const session = getSession(token);
    if (!session) {
      return NextResponse.json({ ok: false, error: "session expired" }, { status: 401 });
    }

    const profile = await getProfile(session.userId);
    if (!profile) {
      return NextResponse.json({ ok: false, error: "user not found" }, { status: 404 });
    }
    const userId = profile.user_id;

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId");
    const sha256 = searchParams.get("sha256");

    if (!reportId) {
      return NextResponse.json({ ok: false, error: "reportId required" }, { status: 400 });
    }

    if (sha256) {
      await cleanupUploadedFiles(userId, reportId, sha256);
    } else {
      const { cleanupReportUploads } = await import("@/lib/image/process");
      await cleanupReportUploads(userId, reportId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Cleanup failed" },
      { status: 500 }
    );
  }
}