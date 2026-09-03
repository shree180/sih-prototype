"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        try {
          await fetch("/api/auth/signout", { method: "POST" });
        } catch (err) {
          console.error("Sign out error:", err);
        }
        router.push("/auth/sign-in");
        router.refresh();
      }}
      className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-navy-500 transition-all duration-150 hover:bg-navy-100/80 hover:text-navy-700 active:scale-[0.97]"
    >
      Sign out
    </button>
  );
}
