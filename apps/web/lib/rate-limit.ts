// Rate limiting using in-memory store (use Redis in production)

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitConfigV2 {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  reset: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();
const rateLimitStoreV2 = new Map<string, RateLimitEntry>();

export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  return memoryRateLimit(key, config, now, windowStart);
}

function memoryRateLimit(
  key: string,
  config: RateLimitConfig,
  now: number,
  windowStart: number
): RateLimitResult {
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + config.windowMs });
    return { limited: false, remaining: config.limit - 1, reset: now + config.windowMs };
  }

  entry.count++;
  memoryStore.set(key, entry);

  return {
    limited: entry.count > config.limit,
    remaining: Math.max(0, config.limit - entry.count),
    reset: entry.resetAt,
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (entry.resetAt <= now) {
      memoryStore.delete(key);
    }
  }
  for (const [key, entry] of rateLimitStoreV2.entries()) {
    if (entry.resetAt < now) {
      rateLimitStoreV2.delete(key);
    }
  }
}, 60_000);

// V2 API for route-level rate limiting
export function createRateLimiter(config: RateLimitConfigV2) {
  const { windowMs, maxRequests, keyPrefix = "ratelimit" } = config;
  
  return async function rateLimiter(req: Request): Promise<Response | null> {
    // For Next.js API routes, we can get the request info from headers
    // In production, use the real IP from x-forwarded-for
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "127.0.0.1";
    const url = new URL(req.url);
    const path = url.pathname;
    const key = `${keyPrefix}:${ip}:${path}`;
    
    const now = Date.now();
    const entry = rateLimitStoreV2.get(key);
    
    if (!entry || entry.resetAt < now) {
      rateLimitStoreV2.set(key, { count: 1, resetAt: now + windowMs });
      return null;
    }
    
    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { 
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
          }
        }
      );
    }
    
    entry.count++;
    return null;
  };
}

// Pre-configured rate limiters for auth endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window
  keyPrefix: "auth",
});

export const strictAuthRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 requests per hour
  keyPrefix: "auth-strict",
});

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 requests per hour
  keyPrefix: "password-reset",
});