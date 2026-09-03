import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateProfile, validatePasswordStrength, verifyPasswordByUserId } from "@/lib/auth/local";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const session = getSession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { displayName, password, currentPassword } = body;
    
    // Validate password strength if updating password
    if (password !== undefined) {
      const strength = validatePasswordStrength(password);
      if (!strength.isStrong) {
        return NextResponse.json(
          { error: `Password too weak: ${strength.feedback.join(", ")}` },
          { status: 400 }
        );
      }
      
      // If changing password, require current password
      if (currentPassword === undefined) {
        return NextResponse.json(
          { error: "Current password required to change password" },
          { status: 400 }
        );
      }
      
      // Verify current password
      const valid = await verifyPasswordByUserId(session.userId, currentPassword);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }
    
    const result = await updateProfile(session.userId, { displayName, password });
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      profile: result.profile,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}