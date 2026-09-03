"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_LABEL, VERIFICATION_LABEL, SEVERITY_COLOR } from "@/lib/rbac";
import type { Severity, VerificationStatus } from "@/lib/types";

export interface VerificationEvent {
  id: string;
  created_at: string;
  reviewer_name: string | null;
  previous_severity: string | null;
  new_severity: string | null;
  previous_status: string | null;
  new_status: string | null;
  reason: string | null;
  notes: string | null;
}

export function VerificationTimeline({ events }: { events: VerificationEvent[] }) {
  if (!events.length) return null;

  return (
    <Card>
      <CardTitle className="mb-2">Verification History</CardTitle>
      <ul className="space-y-4">
        {events.map((event, index) => (
          <li key={event.id} className="relative pl-6 border-l-2 border-gray-200 last:border-transparent">
            <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-amber-500 border-2 border-white -ml-1.5" />
            <div className="flex flex-wrap items-start gap-2 mb-1">
              <span className="text-xs font-medium text-gray-700">
                {new Date(event.created_at).toLocaleString()}
              </span>
              {event.reviewer_name && (
                <span className="text-xs text-gray-500">by {event.reviewer_name}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mb-1">
              {event.previous_severity !== event.new_severity && event.new_severity && (
                <Badge className={SEVERITY_COLOR[event.new_severity as Severity]}>
                  {SEVERITY_LABEL[event.new_severity as Severity]}
                </Badge>
              )}
              {event.new_status && (
                <Badge variant="muted">
                  {VERIFICATION_LABEL[event.new_status as VerificationStatus]}
                </Badge>
              )}
            </div>
            {event.reason && (
              <p className="text-sm text-gray-600">Reason: {event.reason}</p>
            )}
            {event.notes && (
              <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
            )}
            {index < events.length - 1 && (
              <div className="absolute left-[6px] top-8 bottom-0 w-0.5 bg-gray-200" />
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}