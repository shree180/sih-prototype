import type { Role, Severity, VerificationStatus } from "./types";

export const SEVERITY_ORDER: Record<Severity, number> = {
  unclear: 0,
  minor: 1,
  moderate: 2,
  severe: 3,
  critical: 4,
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  unclear: "Unclear",
  minor: "Minor",
  moderate: "Moderate",
  severe: "Severe",
  critical: "Critical",
};

// Semantic color plus text — never color alone (spec NFR-004 / §32).
export const SEVERITY_COLOR: Record<Severity, string> = {
  unclear: "bg-gray-500",
  minor: "bg-green-500",
  moderate: "bg-yellow-500",
  severe: "bg-orange-500",
  critical: "bg-red-500",
};

export function priorityBand(score?: number | null): {
  label: string;
  color: string;
} {
  if (score == null) return { label: "—", color: "bg-gray-400" };
  if (score >= 80) return { label: "Critical", color: "bg-red-500" };
  if (score >= 60) return { label: "High", color: "bg-orange-500" };
  if (score >= 35) return { label: "Medium", color: "bg-yellow-500" };
  return { label: "Low", color: "bg-green-500" };
}

export const DISASTER_TYPES = [
  "flood",
  "earthquake",
  "cyclone",
  "fire",
  "landslide",
  "drought",
  "industrial",
  "building_collapse",
  "other",
];

export const ASSET_TYPES = [
  "building",
  "road",
  "bridge",
  "vehicle",
  "utility",
  "farmland",
  "other",
];

export function isStaff(role?: Role | null): boolean {
  return role === "authority" || role === "analyst" || role === "admin";
}

export function isAdmin(role?: Role | null): boolean {
  return role === "admin";
}

export const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  unverified: "Unverified",
  verified: "Verified",
  rejected: "Rejected",
  needs_review: "Needs Review",
  escalated: "Escalated",
};
