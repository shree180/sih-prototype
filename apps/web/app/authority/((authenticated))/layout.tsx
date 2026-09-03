import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getProfile } from "@/lib/auth/local";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV_ITEMS = [
  { href: "/authority", label: "Overview" },
  { href: "/authority/incidents", label: "Incidents" },
  { href: "/authority/analytics", label: "Analytics" },
  { href: "/authority/exports", label: "Exports" },
  { href: "/authority/audit-logs", label: "Audit" },
  { href: "/authority/profile", label: "Profile" },
];

export default async function AuthorityLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const userId = headersList.get("x-user-id");
  const userRole = headersList.get("x-user-role");

  if (!userId) redirect("/auth/sign-in");
  if (userRole !== "authority" && userRole !== "analyst" && userRole !== "admin") {
    redirect("/auth/access-denied");
  }

  const profile = await getProfile(userId);
  if (!profile) redirect("/auth/sign-in");

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      {/* Dark Glass Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/authority" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs shadow-sm">
                D
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-white block leading-tight">DisasterDamage.AI</span>
                <span className="text-[10px] text-navy-400 block leading-tight">Authority Operations</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 text-xs">
              <span className="text-navy-300 font-medium">{profile.display_name || "Officer"}</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-navy-400 uppercase font-mono">{profile.role}</span>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Glass Sub-Navigation */}
        <div className="border-t border-white/5 bg-white/5 backdrop-blur-md px-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center gap-0.5 overflow-x-auto py-1.5 scrollbar-none">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium text-navy-400 transition-all duration-150 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>

      <footer className="border-t border-navy-100 bg-white py-4 text-center text-[11px] text-navy-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SIH DRM04 · Disaster Damage Assessment</span>
          <span className="font-mono text-navy-300">Audit Trail: Active</span>
        </div>
      </footer>
    </div>
  );
}
