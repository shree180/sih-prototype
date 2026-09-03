"use client";

import React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  if (!token) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy-950 items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/30 blur-[120px]" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">Invalid Link</h1>
            <p className="mt-2 text-sm text-navy-500">No reset token provided. Please request a new password reset.</p>
            <Button onClick={() => router.push("/auth/forgot-password")} className="mt-6">
              Request Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(pwd)) errors.push("One special character");
    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordErrors(validatePassword(value));
  };

  const getStrengthLabel = () => {
    const errors = passwordErrors.length;
    if (password.length === 0) return "";
    if (errors >= 4) return "Very weak";
    if (errors === 3) return "Weak";
    if (errors === 2) return "Fair";
    if (errors === 1) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    const errors = passwordErrors.length;
    if (password.length === 0) return "bg-navy-200";
    if (errors >= 4) return "bg-red-500";
    if (errors === 3) return "bg-orange-500";
    if (errors === 2) return "bg-amber-500";
    if (errors === 1) return "bg-lime-500";
    return "bg-emerald-500";
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    
    if (passwordErrors.length > 0) {
      return setError(`Password must have: ${passwordErrors.join(", ")}`);
    }
    
    setLoading(true);
    
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    
    const data = await res.json();
    setLoading(false);
    
    if (!res.ok) {
      return setError(data.error || "Failed to reset password");
    }
    
    setSuccess(true);
    setTimeout(() => router.push("/auth/sign-in"), 2000);
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy-950 items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/30 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-400/20 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="mt-4 text-navy-300 text-sm leading-relaxed">
            Create a new strong password for your account.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-xl font-bold tracking-tight text-navy-900">DisasterDamage.AI</span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">Reset Password</h2>
          </div>

          <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-elevated">
            {success ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy-900">Password Reset</h3>
                <p className="mt-1 text-sm text-navy-500">Redirecting to sign in...</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="mb-1.5 block">New Password</Label>
                  <Input id="password" type="password" value={password} onChange={handlePasswordChange} required />
                  {password.length > 0 && (
                    <div className="mt-2 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${getStrengthColor()}`}
                        style={{ width: `${Math.max(0, 100 - passwordErrors.length * 20)}%` }}
                      />
                    </div>
                  )}
                  <p className="text-[11px] text-navy-400 mt-1.5">
                    Strength: <span className="font-medium text-navy-600">{getStrengthLabel()}</span>
                  </p>
                  {passwordErrors.length > 0 && (
                    <ul className="text-[11px] text-red-500 space-y-0.5 mt-1.5">
                      {passwordErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="mb-1.5 block">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1.5">Passwords do not match</p>
                  )}
                </div>
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700 animate-fade-in-scale">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  Reset Password
                </Button>
              </form>
            )}
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

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 text-navy-500">Loading...</div>}>
      <ResetPasswordPageContent />
    </React.Suspense>
  );
}
