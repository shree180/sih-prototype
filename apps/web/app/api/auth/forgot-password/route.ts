import { NextRequest, NextResponse } from "next/server";
import { getProfileByEmail, createPasswordResetToken, sendPasswordResetEmail } from "@/lib/auth/local";
import { passwordResetRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimitResponse = await passwordResetRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse as NextResponse;
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    
    // Find user by email
    const profile = await getProfileByEmail(email);
    
    // Always return success to prevent email enumeration
    if (!profile) {
      return NextResponse.json({ ok: true });
    }
    
    // Generate reset token
    const token = await createPasswordResetToken(profile.user_id);
    
    // Send reset email
    await sendPasswordResetEmail(email, token);
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}