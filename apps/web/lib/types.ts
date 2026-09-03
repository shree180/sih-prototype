export type Role = "citizen" | "volunteer" | "authority" | "analyst" | "admin";

export type Severity = "unclear" | "minor" | "moderate" | "severe" | "critical";

export type VerificationStatus =
  | "unverified"
  | "verified"
  | "rejected"
  | "needs_review"
  | "escalated";

export type OperationalStatus = "new" | "in_progress" | "resolved" | "archived";

export interface Profile {
  user_id: string;
  email?: string | null;
  display_name?: string | null;
  organization?: string | null;
  jurisdiction_id?: string | null;
  role: Role;
  status: string;
}

export interface ReportMedia {
  id: string;
  report_id: string;
  storage_path: string;
  media_type?: string | null;
  file_size?: number | null;
  perceptual_hash?: string | null;
  privacy_processed: boolean;
  privacy_status: string;
  is_original: boolean;
  created_at: string;
}

export interface AiAssessment {
  id: string;
  report_id: string;
  provider?: string | null;
  model_name?: string | null;
  predicted_severity?: Severity | null;
  confidence?: number | null;
  indicators: string[];
  explanation?: string | null;
  status: string;
  processing_time_ms?: number | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  disaster_type: string;
  asset_type?: string | null;
  description?: string | null;
  observed_severity?: Severity | null;
  ai_severity?: Severity | null;
  ai_confidence?: number | null;
  final_severity?: Severity | null;
  priority_score?: number | null;
  verification_status: VerificationStatus;
  operational_status: OperationalStatus;
  affected_people?: number | null;
  infrastructure_impact?: boolean | null;
  accessibility_blocked?: boolean | null;
  location?: { lng: number; lat: number } | null;
  location_accuracy_m?: number | null;
  location_source?: string | null;
  occurred_at?: string | null;
  submitted_at: string;
  updated_at: string;
}
export interface TeamMember {
  user_id: string;
  display_name: string | null;
  email: string | null;
  role: string;
}

export interface Assignment {
  assignee_id: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
}

export interface Note {
  id: string;
  author_name: string | null;
  content: string;
  created_at: string;
}
