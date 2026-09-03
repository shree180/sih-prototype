// Session validation for middleware (Edge runtime compatible)
// Uses signed tokens (async Web Crypto API) that can be verified without database access

import { verifySessionToken, createSessionToken, type SessionPayload } from './token';

// Re-export for compatibility (now async)
export { createSessionToken as createSession, verifySessionToken as getSession };

export function deleteSession(_token: string): void {
  // No-op for stateless HMAC tokens — revocation requires a blocklist
}