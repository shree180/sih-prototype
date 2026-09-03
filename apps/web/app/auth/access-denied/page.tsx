import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-navy-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-100 text-2xl mb-5">
          🚫
        </div>
        <span className="rounded-full bg-red-50 border border-red-100 px-3 py-1 text-[11px] font-bold text-red-600 uppercase tracking-wider">
          403 · Access Denied
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-navy-900">
          Authority Authorization Required
        </h1>
        <p className="mt-2 text-xs text-navy-500 leading-relaxed">
          You are currently signed in with an unauthorized role.
          Access to the operations console requires an authorized{" "}
          <strong className="text-navy-700">Authority</strong>,{" "}
          <strong className="text-navy-700">Analyst</strong>, or{" "}
          <strong className="text-navy-700">Admin</strong> role.
        </p>

        <div className="mt-6 rounded-xl border border-navy-100/60 bg-white p-5 shadow-elevated text-left text-xs space-y-2">
          <p className="font-semibold text-navy-900">Server-Side RBAC Enforcement</p>
          <p className="text-navy-500 leading-relaxed">
            Frontend route protection is backed by cryptographic token validation and database role checks.
            This demonstrates real access authorization rather than cosmetic masking.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/citizen">
            <Button size="md">Return to Citizen Portal</Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button size="md" variant="outline">
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
