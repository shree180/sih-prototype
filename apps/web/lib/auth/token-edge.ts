/**
 * Edge-safe session token verification for Next.js middleware.
 * Token creation remains server-only in token.ts; this module deliberately
 * avoids Node's crypto and Buffer APIs so protected-route redirects work.
 */
export interface EdgeSessionPayload {
  userId: string;
  role: string;
  expiresAt: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SESSION_SECRET environment variable is required in production. ' +
        'Set it to a strong, random string (at least 32 characters).'
      );
    }
    return 'drm04-dev-secret-change-in-production-2026';
  }
  return secret;
}

const encoder = new TextEncoder();

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

export async function verifySessionTokenAtEdge(token: string | null | undefined): Promise<EdgeSessionPayload | null> {
  if (!token) return null;
  const [encoded, signature, ...extra] = token.split(".");
  if (!encoded || !signature || extra.length) return null;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(getSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature) as unknown as BufferSource,
      encoder.encode(encoded)
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded))) as EdgeSessionPayload;
    if (!payload.userId || !payload.role || !Number.isFinite(payload.expiresAt) || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
