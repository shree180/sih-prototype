import { createClient } from "./supabase/server";
import type { Profile, Role } from "./types";

export async function getCurrentProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return { user: { id: user.id, email: user.email }, profile: (profile as Profile) ?? null };
}

export async function requireRole(roles: Role[]): Promise<Profile> {
  const { profile } = await getCurrentProfile();
  if (!profile || !roles.includes(profile.role)) {
    throw new Error("UNAUTHORIZED");
  }
  return profile;
}
