import { NextResponse, type NextRequest } from "next/server";
import { verifySessionTokenAtEdge } from "@/lib/auth/token-edge";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  
  // For API routes and auth pages, skip auth check
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api/") || path.startsWith("/auth/") || path === "/") {
    return response;
  }
  
  // Check session cookie
  const token = request.cookies.get("session")?.value;
  if (!token) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(signInUrl);
  }
  
  // Verify the signed token (uses Web Crypto API, Edge-compatible)
  const session = await verifySessionTokenAtEdge(token);
  if (!session) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(signInUrl);
  }
  
  // Add user info to headers for server components
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("x-user-id", session.userId);
  responseHeaders.set("x-user-role", session.role);
  
  return NextResponse.next({
    request: {
      headers: responseHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
