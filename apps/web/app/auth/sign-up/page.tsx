"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ShieldAlert, CheckCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: name, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      if (data.role === "authority" || data.role === "analyst" || data.role === "admin") {
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
          <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-amber-500/30 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-amber-400/20 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <ShieldAlert className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Join the Response Network
          </h1>
          <p className="mt-4 text-navy-300 text-sm leading-relaxed">
            Help build the most comprehensive disaster damage dataset. 
            Every report strengthens community resilience.
          </p>
          <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
            {["Privacy-first image handling", "AI-assisted severity triage", "Verified by authorities"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-navy-300">
                <CheckCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Sign up form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-xl font-bold tracking-tight text-navy-900">DisasterDamage.AI</span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">Create account</h2>
            <p className="mt-1.5 text-sm text-navy-500">Start reporting damage in your area</p>
          </div>

          <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-elevated">
            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-700 animate-fade-in-scale">
                <span className="text-red-500 text-base">!</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-1.5 block">Display name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
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
                <Label htmlFor="password" className="mb-1.5 block">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label htmlFor="role" className="mb-1.5 block">I am a</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 transition-all duration-150 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="citizen">Citizen</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Create Account
              </Button>
            </form>

            <div className="mt-5 text-center">
              <span className="text-xs text-navy-500">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="font-semibold text-amber-600 hover:text-amber-500 transition-colors">
                  Sign in
                </Link>
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-navy-50 border border-navy-100 p-4">
            <p className="text-xs font-semibold text-navy-700 mb-2">Demo Accounts</p>
            <div className="space-y-1.5 text-xs text-navy-500">
              <p>Citizen: <code className="bg-white px-1.5 py-0.5 rounded border border-navy-100 font-mono text-navy-600">demo@example.com</code> / <code className="bg-white px-1.5 py-0.5 rounded border border-navy-100 font-mono text-navy-600">demo1234</code></p>
              <p>Authority: <code className="bg-white px-1.5 py-0.5 rounded border border-navy-100 font-mono text-navy-600">authority@example.com</code> / <code className="bg-white px-1.5 py-0.5 rounded border border-navy-100 font-mono text-navy-600">demo1234</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
