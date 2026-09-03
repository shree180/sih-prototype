// First-run checklist — verifies the DRM04 environment is wired correctly.
//
// Run from the web app dir so `@supabase/supabase-js` resolves:
//   cd apps/web && node ../../scripts/first-run.mjs
//
// Reads apps/web/.env.local if present, falling back to process.env.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../apps/web/.env.local");

function loadEnv() {
  const env = { ...process.env };
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

const env = loadEnv();
let pass = 0;
let fail = 0;
function check(name, ok, hint = "") {
  if (ok) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.log(`  ❌ ${name}${hint ? ` — ${hint}` : ""}`); }
}

console.log("\nDRM04 first-run checklist\n" + "─".repeat(40));

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const svc = env.SUPABASE_SERVICE_ROLE_KEY;
const ai = env.AI_SERVICE_URL || "http://localhost:8000";

check("NEXT_PUBLIC_SUPABASE_URL set", !!url);
check("NEXT_PUBLIC_SUPABASE_ANON_KEY set", !!anon);
check("SUPABASE_SERVICE_ROLE_KEY set", !!svc);
check("AI_SERVICE_URL set", !!env.AI_SERVICE_URL, "defaults to http://localhost:8000");

if (url && anon) {
  const supabase = createClient(url, anon, { auth: { persistSession: false } });
  // 1) Auth reachable
  try {
    const { error } = await supabase.auth.getSession();
    check("Supabase reachable (auth)", !error, error?.message);
  } catch (e) {
    check("Supabase reachable (auth)", false, e.message);
  }
  // 2) Migrations applied — reports_list() RPC exists
  try {
    const { error } = await supabase.rpc("reports_list");
    check("Migrations applied (reports_list RPC)", !error || /does not exist|schema cache/.test(error.message) === false,
      error ? "run supabase/migrations/*.sql" : "");
    if (error) check("  ↳ reports_list present", false, error.message);
  } catch (e) {
    check("Migrations applied (reports_list RPC)", false, e.message);
  }
  // 3) Demo users / profiles exist
  if (svc) {
    try {
      const admin = createClient(url, svc, { auth: { persistSession: false } });
      const { data } = await admin.from("profiles").select("role").limit(1);
      check("profiles table readable (service role)", Array.isArray(data), "seed demo users if empty");
    } catch (e) {
      check("profiles table readable (service role)", false, e.message);
    }
  }
}

// 4) AI service reachable
try {
  const r = await fetch(`${ai}/health`);
  check("AI service /health reachable", r.ok, `${ai} not responding — start uvicorn app.main:app`);
} catch (e) {
  check("AI service /health reachable", false, `${ai} not responding — start uvicorn app.main:app`);
}

console.log("\n" + "─".repeat(40));
console.log(`Result: ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
