import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const checks = {
    database: { status: "unknown", latencyMs: 0, error: null as string | null },
    aiService: { status: "unknown", latencyMs: 0, error: null as string | null },
    supabase: { status: "unknown", latencyMs: 0, error: null as string | null },
  };

  const startTotal = Date.now();

  // Check Database (Supabase)
  try {
    const dbStart = Date.now();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase.from("profiles").select("count").limit(1).single();
    checks.database.latencyMs = Date.now() - dbStart;
    checks.database.status = error ? "fail" : "ok";
    if (error) checks.database.error = error.message;
  } catch (e) {
    checks.database.status = "fail";
    checks.database.error = e instanceof Error ? e.message : "Unknown error";
  }

  // Check AI Service
  try {
    const aiStart = Date.now();
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    const aiKey = process.env.AI_SERVICE_KEY;

    const response = await fetch(`${aiUrl}/health/live`, {
      method: "GET",
      headers: aiKey ? { "X-API-Key": aiKey } : {},
      signal: AbortSignal.timeout(5000),
    });

    checks.aiService.latencyMs = Date.now() - aiStart;
    checks.aiService.status = response.ok ? "ok" : "fail";
    if (!response.ok) checks.aiService.error = `HTTP ${response.status}`;
  } catch (e) {
    checks.aiService.status = "fail";
    checks.aiService.error = e instanceof Error ? e.message : "Unknown error";
  }

  // Check Supabase Auth
  try {
    const authStart = Date.now();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.getSession();
    checks.supabase.latencyMs = Date.now() - authStart;
    checks.supabase.status = error ? "fail" : "ok";
    if (error) checks.supabase.error = error.message;
  } catch (e) {
    checks.supabase.status = "fail";
    checks.supabase.error = e instanceof Error ? e.message : "Unknown error";
  }

  const allHealthy = Object.values(checks).every((c) => c.status === "ok");
  const totalLatencyMs = Date.now() - startTotal;

  const status = allHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: allHealthy ? "ready" : "not_ready",
      timestamp: new Date().toISOString(),
      totalLatencyMs,
      checks,
    },
    { status }
  );
}