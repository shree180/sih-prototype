// Content Security Policy configuration

export const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://cdn.tailwindcss.com",
    "https://unpkg.com",
    "https://cdn.jsdelivr.net",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://cdn.tailwindcss.com",
    "https://unpkg.com",
  ],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "connect-src": [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://api.mapbox.com",
    "https://tiles.example.com",
  ],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "upgrade-insecure-requests": [],
  "block-all-mixed-content": [],
} as const;

export function buildCSPHeader(directives: typeof CSP_DIRECTIVES = CSP_DIRECTIVES): string {
  return Object.entries(directives)
    .map(([directive, values]) => {
      if (values.length === 0) return directive;
      return `${directive} ${values.join(" ")}`;
    })
    .join("; ");
}

export const CSP_HEADER = buildCSPHeader();

export const CSP_REPORT_ONLY_HEADER = buildCSPHeader({
  ...CSP_DIRECTIVES,
  "report-uri": ["/api/csp-report"],
  "report-to": ["csp-endpoint"],
} as any);

export function getCSPHeader(reportOnly = false): string {
  return reportOnly ? CSP_REPORT_ONLY_HEADER : CSP_HEADER;
}

export const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
} as const;

export function applySecurityHeaders(headers: Headers): Headers {
  const newHeaders = new Headers(headers);
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  newHeaders.set("Content-Security-Policy", CSP_HEADER);
  return newHeaders;
}

export function applySecurityHeadersToResponse(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  newHeaders.set("Content-Security-Policy", CSP_HEADER);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}