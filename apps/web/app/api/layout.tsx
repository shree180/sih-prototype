// Every API endpoint is request-scoped: authentication, rate limits, and live
// operational data must never be evaluated or cached during static generation.
export const dynamic = "force-dynamic";

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
