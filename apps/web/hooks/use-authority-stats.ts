'use client';

import { useEffect, useState } from 'react';

export interface AuthorityStats {
  total: number;
  critical: number;
  needsReview: number;
  verified: number;
  escalated: number;
  inProgress: number;
  priorityQueue: Array<{
    id: string;
    disaster_type: string;
    asset_type: string | null;
    description: string | null;
    final_severity: string | null;
    priority_score: number | null;
    verification_status: string;
    operational_status: string;
    submitted_at: Date;
  }>;
  mapReports: Array<{
    id: string;
    lat: number;
    lng: number;
    severity: string | null;
    disaster_type: string;
  }>;
  velocity: number;
  avgResponseTime: number;
  verificationRate: number;
  systemHealth: number;
  lastUpdated: string | null;
}

export function useAuthorityStats() {
  const [data, setData] = useState<AuthorityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/authority/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const json = await response.json();
      setData({
        ...json,
        priorityQueue: json.priorityQueue.map((r: any) => ({
          ...r,
          submitted_at: new Date(r.submitted_at),
        })),
        lastUpdated: new Date().toISOString(),
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