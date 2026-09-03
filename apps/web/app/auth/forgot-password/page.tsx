"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Failed to send reset email");
      setMessageType("error");
      return;
    }

    setMessage("If an account exists with that email, a reset link has been sent.");
    setMessageType("success");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link href="/auth/sign-in" className="inline-flex items-center gap-1.5 text-xs text-navy-500 hover:text-navy-700 transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Reset password</h1>
          <p className="mt-1.5 text-sm text-navy-500">Enter your email for a reset link</p>
        </div>

        <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-elevated">
          {message && (
            <div className={`mb-5 rounded-xl p-3.5 text-sm animate-fade-in-scale ${
              messageType === "success"
                ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                : "bg-red-50 border border-red-100 text-red-700"
            }`}>
              {messageType === "success" && <Mail className="h-4 w-4 inline mr-2" />}
              {message}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1.5 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Send Reset Link
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
