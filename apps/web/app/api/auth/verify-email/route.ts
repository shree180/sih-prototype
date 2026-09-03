import { NextRequest, NextResponse } from "next/server";
import { verifyEmail, getProfileByEmail, createEmailVerificationToken, sendVerificationEmail } from "@/lib/auth/local";
import { authRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimitResponse = await authRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse as NextResponse;
  try {
    const { token, email } = await req.json();
    
    if (token) {
      // Verify email with token
      const result = await verifyEmail(token);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }
    
    if (email) {
      // Resend verification email
      const profile = await getProfileByEmail(email);
      if (!profile) {
        // Always return success to prevent email enumeration
        return NextResponse.json({ ok: true });
      }
      
      const newToken = await createEmailVerificationToken(profile.user_id);
      await sendVerificationEmail(email, newToken);
      return NextResponse.json({ ok: true });
    }
    
    return NextResponse.json({ error: "Token or email required" }, { status: 400 });
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 });
  }
}