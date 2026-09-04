'use client';

import { useEffect, useState } from 'react';

export interface SessionStats {
  reports: Array<{
    id: string;
    disaster_type: string;
    description: string | null;
    final_severity: string | null;
    ai_confidence: number | null;
    priority_score: number | null;
    verification_status: string;
    operational_status: string;
    submitted_at: Date;
  }>;
  totalReports: number;
  verifiedCount: number;
  pendingCount: number;
  lastUpdated: Date | null;
}

export function useSessionStats() {
  const [data, setData] = useState<SessionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/citizen/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const json = await response.json();
      setData({
        ...json,
        reports: json.reports.map((r: any) => ({
          ...r,
          submitted_at: new Date(r.submitted_at),
        })),
        lastUpdated: new Date(),
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, error, refetch: fetchStats };
}