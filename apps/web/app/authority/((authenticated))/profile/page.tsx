import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/local";
import { ProfileForm } from "@/components/auth/ProfileForm";

export default async function AuthorityProfilePage() {
  const headersList = headers();
  const userId = headersList.get("x-user-id");
  const userRole = headersList.get("x-user-role");

  if (!userId) redirect("/auth/sign-in");
  if (userRole !== "authority" && userRole !== "analyst" && userRole !== "admin") {
    redirect("/citizen");
  }

  const profile = await getProfile(userId);
  if (!profile) redirect("/auth/sign-in");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Profile</h1>
        <p className="text-xs text-navy-500 mt-1">Manage your account settings</p>
      </div>
      <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-elevated">
        <ProfileForm
          initialDisplayName={profile.display_name || ""}
          initialEmail={profile.email || ""}
          userRole={profile.role}
        />
      </div>
    </div>
  );
}
