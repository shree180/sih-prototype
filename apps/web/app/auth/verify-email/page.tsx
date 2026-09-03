"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("resend");
      setMessage("Enter your email to resend the verification link");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed");
          return;
        }
        
        setStatus("success");
        setMessage("Email verified successfully! You can now sign in.");
      } catch {
        setStatus("error");
        setMessage("Verification failed. Please try again.");
      }
    }

    verify();
  }, [token]);

  async function resendVerification() {
    if (!email) return;
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to send verification email");
      } else {
        setMessage("Verification email sent! Please check your inbox.");
      }
    } catch {
      setMessage("Failed to send verification email");
    } finally {
      setResendLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-navy-500">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === "resend") {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy-950 items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/30 blur-[120px]" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center lg:text-left">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <span className="text-xl font-bold tracking-tight text-navy-900">DisasterDamage.AI</span>
              </Link>
              <h2 className="text-2xl font-bold tracking-tight text-navy-900">Verify Email</h2>
              <p className="mt-1.5 text-sm text-navy-500">Enter your email to resend the verification link.</p>
            </div>
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-elevated">
              <form onSubmit={(e) => { e.preventDefault(); resendVerification(); }} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="mb-1.5 block">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {message && (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-700 animate-fade-in-scale">
                    {message}
                  </div>
                )}
                <Button type="submit" className="w-full" size="lg" loading={resendLoading}>
                  Resend Verification
                </Button>
              </form>
            </div>
            <p className="mt-6 text-center text-xs text-navy-400">
              <Link href="/auth/sign-in" className="font-semibold text-amber-600 hover:text-amber-500 transition-colors">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className={`mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center ${
          status === "success" ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"
        }`}>
          {status === "success" ? (
            <svg className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-7 w-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">
          {status === "success" ? "Email Verified" : "Verification Failed"}
        </h1>
        <p className="mt-2 text-sm text-navy-500">{message}</p>
        <div className="mt-6 flex flex-col gap-3">
          {status === "success" && (
            <Button onClick={() => router.push("/auth/sign-in")} className="w-full">
              Go to Sign In
            </Button>
          )}
          {status === "error" && (
            <>
              <Button onClick={() => router.push("/auth/sign-in")} className="w-full">
                Back to Sign In
              </Button>
              <Button variant="outline" onClick={() => setStatus("resend")} className="w-full">
                Resend Verification
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 text-center text-navy-500">Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
