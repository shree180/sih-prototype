import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getProfile } from "@/lib/auth/local";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function CitizenLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const userId = headersList.get("x-user-id");
  const userRole = headersList.get("x-user-role");

  if (!userId) redirect("/auth/sign-in");
  if (userRole === "authority" || userRole === "analyst" || userRole === "admin") {
    redirect("/authority");
  }

  const profile = await getProfile(userId);
  if (!profile) redirect("/auth/sign-in");

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      {/* Glass Header */}
      <header className="sticky top-0 z-50 glass-light border-b border-white/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/citizen" className="flex items-center gap-2.5">
              <span className="text-base font-bold tracking-tight text-navy-900">DisasterDamage.AI</span>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Citizen</span>
            </Link>
            <nav className="hidden md:flex items-center gap-0.5">
              <Link href="/citizen" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-navy-600 hover:bg-navy-100/80 hover:text-navy-900 transition-all duration-150">
                Dashboard
              </Link>
              <Link
                href="/citizen/report"
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-amber-400 transition-all duration-150 active:scale-[0.97]"
              >
                + Report
              </Link>
              <Link href="/citizen/my-reports" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-navy-600 hover:bg-navy-100/80 hover:text-navy-900 transition-all duration-150">
                My Reports
              </Link>
              <Link href="/citizen/profile" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-navy-600 hover:bg-navy-100/80 hover:text-navy-900 transition-all duration-150">
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs font-medium text-navy-600 border-l border-navy-200 pl-3">
              {profile.display_name || "Citizen"}
            </span>
            <SignOutButton />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden border-t border-navy-100/80 px-4 py-2 bg-white/50 justify-around">
          {[
            { href: "/citizen", label: "Home" },
            { href: "/citizen/report", label: "+ Report" },
            { href: "/citizen/my-reports", label: "Reports" },
            { href: "/citizen/profile", label: "Profile" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] font-medium text-navy-500 hover:text-amber-600 py-1 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">{children}</main>

      <footer className="border-t border-navy-100 bg-white py-5 text-center text-[11px] text-navy-400">
        <p>Smart India Hackathon · DRM04</p>
      </footer>
    </div>
  );
}
