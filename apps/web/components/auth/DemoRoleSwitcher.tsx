"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_USERS = [
  { role: "citizen", label: "Citizen", email: "demo@example.com", icon: "👤", desc: "Report & track damage" },
  { role: "volunteer", label: "Volunteer", email: "volunteer@example.com", icon: "🤝", desc: "Field reporting" },
  { role: "authority", label: "Authority", email: "authority@example.com", icon: "🛡️", desc: "Triage & verification" },
  { role: "analyst", label: "Analyst", email: "analyst@example.com", icon: "📊", desc: "GIS trends & analytics" },
  { role: "admin", label: "Admin", email: "admin@example.com", icon: "⚡", desc: "System & audit logs" },
];

export function DemoRoleSwitcher({ currentRole }: { currentRole?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function switchRole(email: string, targetRole: string) {
    setLoading(targetRole);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo1234" }),
      });
      if (res.ok) {
        setOpen(false);
        if (targetRole === "authority" || targetRole === "analyst" || targetRole === "admin") {
          router.push("/authority");
        } else {
          router.push("/citizen");
        }
        router.refresh();
      }
    } catch (err) {
      console.error("Role switch error:", err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-700 transition-all duration-150 hover:bg-navy-50 active:scale-[0.97]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-navy-400">Role:</span>
        <span className="font-semibold text-navy-900 capitalize">{currentRole || "Demo"}</span>
        <svg className="h-3.5 w-3.5 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-navy-100/60 bg-white p-2 shadow-elevated-lg animate-fade-in-scale">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-400">
              Demo Role Switcher
            </div>
            <div className="mt-1.5 space-y-0.5">
              {DEMO_USERS.map((user) => {
                const isActive = currentRole === user.role;
                return (
                  <button
                    key={user.role}
                    disabled={loading !== null}
                    onClick={() => switchRole(user.email, user.role)}
                    className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 ${
                      isActive
                        ? "bg-amber-50 border border-amber-100 text-navy-900"
                        : "hover:bg-navy-50 text-navy-700"
                    }`}
                  >
                    <span className="text-base">{user.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{user.label}</span>
                        {isActive && <span className="text-[10px] text-amber-600 font-semibold">Active</span>}
                        {loading === user.role && <span className="text-[10px] text-navy-400">Switching...</span>}
                      </div>
                      <p className="text-[11px] text-navy-400 truncate">{user.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
