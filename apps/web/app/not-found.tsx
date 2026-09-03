import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 border border-navy-100 mb-6">
          <FileX className="h-7 w-7 text-navy-400" />
        </div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-navy-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
