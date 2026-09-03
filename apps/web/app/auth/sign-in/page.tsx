"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ShieldAlert } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(targetEmail: string, targetPass: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed");
        setLoading(false);
        return;
      }

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (data.role === "authority" || data.role === "analyst" || data.role === "admin") {
        router.push("/authority");
      } else {
        router.push("/citizen");
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy-950 items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/30 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-400/20 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <ShieldAlert className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Disaster Damage Assessment
          </h1>
          <p className="mt-4 text-navy-300 text-sm leading-relaxed">
            Privacy-conscious, AI-assisted triage for citizen-reported disaster damage. 
            From scattered reports to verified operational intelligence.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-navy-400">
            <span>SIH DRM04</span>
            <span className="h-1 w-1 rounded-full bg-navy-600" />
            <span>Privacy-First</span>
            <span className="h-1 w-1 rounded-full bg-navy-600" />
            <span>AI-Assisted</span>
          </div>
        </div>
      </div>

      {/* Right: Sign in form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-xl font-bold tracking-tight text-navy-900">DisasterDamage.AI</span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-navy-500">Sign in to your account</p>
          </div>

          <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-elevated">
            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-700 animate-fade-in-scale">
                <span className="text-red-500 text-base">!</span>
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(email, password);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="email" className="mb-1.5 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-amber-600 hover:text-amber-500 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-5 text-center">
              <span className="text-xs text-navy-500">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="font-semibold text-amber-600 hover:text-amber-500 transition-colors">
                  Create one
                </Link>
              </span>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-navy-400">
            AI-assisted preliminary assessment — not a substitute for professional inspection
          </p>
        </div>
      </div>
    </div>
  );
}
