"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";

interface PieDataPoint {
  name: string;
  value: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  unclear: "#6b7280",
  minor: "#22c55e",
  moderate: "#eab308",
  severe: "#f97316",
  critical: "#ef4444",
};

const SEVERITY_LABELS: Record<string, string> = {
  unclear: "Unclear",
  minor: "Minor",
  moderate: "Moderate",
  severe: "Severe",
  critical: "Critical",
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }> }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white p-2 rounded shadow border">
      {payload.map((entry, index) => (
        <div key={index} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
}

export function SeverityDistributionChart({ data }: { data: PieDataPoint[] }) {
  if (!data.length) return <Card><CardTitle className="mb-2">Severity Distribution</CardTitle><p className="text-sm text-gray-400">No data</p></Card>;

  const formattedData = data.map((d) => ({
    name: SEVERITY_LABELS[d.name] || d.name,
    value: Number(d.value),
    color: SEVERITY_COLORS[d.name] || "#6b7280",
  }));

  return (
    <Card>
      <CardTitle className="mb-2">Severity Distribution</CardTitle>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              labelLine={false}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function VerificationFunnelChart({ data }: { data: PieDataPoint[] }) {
  if (!data.length) return <Card><CardTitle className="mb-2">Verification Funnel</CardTitle><p className="text-sm text-gray-400">No data</p></Card>;

  const statusOrder = ["unverified", "needs_review", "verified", "rejected", "escalated"];
  const statusColors: Record<string, string> = {
    unverified: "#6b7280",
    needs_review: "#f97316",
    verified: "#22c55e",
    rejected: "#ef4444",
    escalated: "#8b5cf6",
  };
  const statusLabels: Record<string, string> = {
    unverified: "Unverified",
    needs_review: "Needs Review",
    verified: "Verified",
    rejected: "Rejected",
    escalated: "Escalated",
  };

  const formattedData = statusOrder
    .filter((s) => data.some((d) => d.name === s))
    .map((s) => {
      const item = data.find((d) => d.name === s);
      return {
        name: statusLabels[s] || s,
        value: Number(item?.value) || 0,
        color: statusColors[s] || "#6b7280",
      };
    });

  return (
    <Card>
      <CardTitle className="mb-2">Verification Funnel</CardTitle>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              labelLine={false}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}