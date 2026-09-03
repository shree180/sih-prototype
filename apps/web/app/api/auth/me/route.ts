import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProfile } from "@/lib/auth/local";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;
    
    if (!token) {
      return NextResponse.json({ user: null, profile: null }, { status: 401 });
    }
    
    const session = getSession(token);
    if (!session) {
      return NextResponse.json({ user: null, profile: null }, { status: 401 });
    }
    
    const profile = await getProfile(session.userId);
    if (!profile) {
      return NextResponse.json({ user: null, profile: null }, { status: 401 });
    }
    
    return NextResponse.json({
      user: {
        id: profile.user_id,
        email: profile.email,
      },
      profile: {
        user_id: profile.user_id,
        email: profile.email,
        display_name: profile.display_name,
        organization: profile.organization,
        jurisdiction_id: profile.jurisdiction_id,
        role: profile.role,
        status: profile.status,
      },
    });
  } catch (err) {
    console.error("Get me error:", err);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}