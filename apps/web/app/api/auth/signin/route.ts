import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createSession, getProfile } from "@/lib/auth/local";
import { authRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimitResponse = await authRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse as NextResponse;
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    
    const result = await authenticateUser(email, password);
    
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    
    // Check if email is verified
    const profile = await getProfile(result.userId);
    if (profile && profile.status === 'pending') {
      return NextResponse.json({ 
        error: "Please verify your email before signing in",
        code: "EMAIL_NOT_VERIFIED",
        email: profile.email
      }, { status: 403 });
    }
    
    const token = await createSession(result.userId, result.profile.role);
    
    const response = NextResponse.json({
      ok: true,
      token,
      role: result.profile.role,
      userId: result.userId,
    });
    
    // Set HTTP-only cookie
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    return response;
  } catch (err) {
    console.error("Sign in error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}