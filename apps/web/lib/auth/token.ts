import { createHmac } from 'crypto';

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

export interface SessionPayload {
  userId: string;
  role: string;
  expiresAt: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function hmacSign(data: string): string {
  const hmac = createHmac('sha256', getSecret());
  hmac.update(data);
  return hmac.digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function createSessionToken(userId: string, role: string = 'citizen'): string {
  const payload: SessionPayload = {
    userId,
    role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = hmacSign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;

  const expectedSignature = hmacSign(encoded);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    if (!payload.userId || !payload.expiresAt) return null;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}