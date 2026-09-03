import { NextRequest } from "next/server";
import { getSession, getProfile } from "@/lib/auth/local";
import { DbProfile } from "@/lib/db/local";

export interface AuthenticatedUser {
  userId: string;
  profile: DbProfile;
}

export async function authenticateApiRequest(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;

  const session = getSession(token);
  if (!session) return null;

  const profile = await getProfile(session.userId);
  if (!profile) return null;

  return { userId: session.userId, profile };
}

export function requireAuthorityRole(user: AuthenticatedUser): boolean {
  return ["authority", "analyst", "admin"].includes(user.profile.role);
}
