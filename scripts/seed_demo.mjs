// Demo seed script — creates demo users via the Supabase Admin API.
// The DB trigger (0005_profiles_trigger.sql) auto-creates the matching profile
// using the `role` passed in user_metadata.
//
// Run from the web app dir so `@supabase/supabase-js` resolves:
//   cd apps/web && node ../../scripts/seed_demo.mjs
//
// Requires env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

const demoUsers = [
  { email: "demo-citizen@example.com", password: "demo-citizen-123", role: "citizen", display_name: "Demo Citizen" },
  { email: "demo-authority@example.com", password: "demo-authority-123", role: "authority", display_name: "Demo Authority" },
];

for (const u of demoUsers) {
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { role: u.role, display_name: u.display_name },
  });
  if (error && !error.message.includes("already")) {
    console.error(`Failed ${u.email}:`, error.message);
  } else {
    console.log(`OK ${u.email} (${u.role}) — profile auto-created`);
  }
}

console.log("\nNext: run supabase/seed/0003_seed.sql in the SQL editor to add the demo jurisdiction + sample report.");
