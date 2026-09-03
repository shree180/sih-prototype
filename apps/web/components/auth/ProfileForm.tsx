"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ProfileFormProps {
  initialDisplayName: string;
  initialEmail: string;
  userRole: string;
}

export function ProfileForm({ initialDisplayName, initialEmail, userRole }: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
    return errors;
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordErrors(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (showPasswordFields) {
      if (!currentPassword) {
        setMessage({ type: "error", text: "Current password is required" });
        return;
      }
      if (!newPassword) {
        setMessage({ type: "error", text: "New password is required" });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        return;
      }
      if (passwordErrors.length > 0) {
        setMessage({ type: "error", text: `Password must have: ${passwordErrors.join(", ")}` });
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          password: showPasswordFields ? newPassword : undefined,
          currentPassword: showPasswordFields ? currentPassword : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
        return;
      }

      setMessage({ type: "success", text: "Profile updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
      setPasswordErrors([]);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthLabel = () => {
    const errors = passwordErrors.length;
    if (newPassword.length === 0) return "";
    if (errors >= 4) return "Very weak";
    if (errors === 3) return "Weak";
    if (errors === 2) return "Fair";
    if (errors === 1) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    const errors = passwordErrors.length;
    if (newPassword.length === 0) return "bg-gray-200";
    if (errors >= 4) return "bg-red-500";
    if (errors === 3) return "bg-orange-500";
    if (errors === 2) return "bg-yellow-500";
    if (errors === 1) return "bg-lime-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={initialEmail}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">Leave blank to keep current password</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
              >
                {showPasswordFields ? "Cancel" : "Change Password"}
              </Button>
            </div>

            {showPasswordFields && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                    required
                  />
                  {newPassword.length > 0 && (
                    <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${getStrengthColor()}`}
                        style={{ width: `${Math.max(0, 100 - passwordErrors.length * 20)}%` }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Strength: <span className="font-medium">{getStrengthLabel()}</span>
                  </p>
                  {passwordErrors.length > 0 && (
                    <ul className="text-xs text-red-500 space-y-1">
                      {passwordErrors.map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}