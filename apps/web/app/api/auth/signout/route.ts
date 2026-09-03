import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/local";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;
    
    if (token) {
      deleteSession(token);
    }
    
    const response = NextResponse.json({ ok: true });
    
    // Clear the session cookie
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    
    return response;
  } catch (err) {
    console.error("Sign out error:", err);
    return NextResponse.json({ error: "Sign out failed" }, { status: 500 });
  }
}