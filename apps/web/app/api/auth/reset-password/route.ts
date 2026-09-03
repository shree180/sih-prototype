import { NextRequest, NextResponse } from "next/server";
import { resetPassword, validatePasswordStrength } from "@/lib/auth/local";
import { passwordResetRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimitResponse = await passwordResetRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse as NextResponse;
  try {
    const { token, password } = await req.json();
    
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    }
    
    // Validate password strength
    const strength = validatePasswordStrength(password);
    if (!strength.isStrong) {
      return NextResponse.json(
        { error: `Password too weak: ${strength.feedback.join(", ")}` },
        { status: 400 }
      );
    }
    
    const result = await resetPassword(token, password);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}