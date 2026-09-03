"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";

interface DataPoint {
  date: string;
  count: number;
}

interface SeverityDataPoint {
  date: string;
  [key: string]: string | number;
}

export function ReportsOverTimeChart({ data }: { data: DataPoint[] }) {
  if (!data.length) return <Card><CardTitle className="mb-2">Reports Over Time</CardTitle><p className="text-sm text-gray-400">No data</p></Card>;

  const formattedData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString(),
    count: Number(d.count),
  }));

  return (
    <Card>
      <CardTitle className="mb-2">Reports Over Time</CardTitle>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function SeverityOverTimeChart({ data }: { data: SeverityDataPoint[] }) {
  if (!data.length) return <Card><CardTitle className="mb-2">Severity Over Time</CardTitle><p className="text-sm text-gray-400">No data</p></Card>;

  const severityOrder = ["unclear", "minor", "moderate", "severe", "critical"];
  const colors: Record<string, string> = {
    unclear: "#6b7280",
    minor: "#22c55e",
    moderate: "#eab308",
    severe: "#f97316",
    critical: "#ef4444",
  };

  const formattedData = data.map((d) => {
    const obj: Record<string, string | number> = { date: new Date(d.date).toLocaleDateString() };
    severityOrder.forEach((s) => {
      obj[s] = Number(d[s]) || 0;
    });
    return obj;
  });

  return (
    <Card>
      <CardTitle className="mb-2">Severity Over Time</CardTitle>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            {severityOrder.map((severity) => (
              <Line
                key={severity}
                type="monotone"
                dataKey={severity}
                stroke={colors[severity]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name={severity.charAt(0).toUpperCase() + severity.slice(1)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}