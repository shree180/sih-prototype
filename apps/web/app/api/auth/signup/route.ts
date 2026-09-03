import { NextRequest, NextResponse } from "next/server";
import { createUser, createSession } from "@/lib/auth/local";
import { authRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimitResponse = await authRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse as NextResponse;
  try {
    const { email, password, displayName, role } = await req.json();
    
    if (!email || !password || !displayName) {
      return NextResponse.json({ error: "Email, password, and display name required" }, { status: 400 });
    }
    
    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    
    // Only allow citizen/volunteer for self-registration
    const allowedRoles = ["citizen", "volunteer"];
    const userRole = allowedRoles.includes(role) ? role : "citizen";
    
    const result = await createUser(email, password, displayName, userRole);
    
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    const token = await createSession(result.userId, result.profile.role);
    
    const response = NextResponse.json({
      ok: true,
      token,
      role: result.profile.role,
      userId: result.userId,
    });
    
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    
    return response;
  } catch (err) {
    console.error("Sign up error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}