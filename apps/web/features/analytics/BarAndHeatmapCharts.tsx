"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";

interface BarDataPoint {
  name: string;
  value: number;
}

export function DisasterTypeBreakdownChart({ data }: { data: BarDataPoint[] }) {
  if (!data.length) return <Card><CardTitle className="mb-2">Disaster Type Breakdown</CardTitle><p className="text-sm text-gray-400">No data</p></Card>;

  const formattedData = data
    .map((d) => ({ name: d.name, value: Number(d.value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <Card>
      <CardTitle className="mb-2">Disaster Type Breakdown</CardTitle>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

interface HeatmapDataPoint {
  disaster_type: string;
  final_severity: string;
  count: number;
  avg_priority: number;
}

const SEVERITY_ORDER = ["unclear", "minor", "moderate", "severe", "critical"];
const SEVERITY_LABELS: Record<string, string> = {
  unclear: "Unclear",
  minor: "Minor",
  moderate: "Moderate",
  severe: "Severe",
  critical: "Critical",
};

export function PriorityHeatmapChart({ data }: { data: HeatmapDataPoint[] }) {
  if (!data.length) return <Card><CardTitle className="mb-2">Priority Heatmap</CardTitle><p className="text-sm text-gray-400">No data</p></Card>;

  const disasterTypes = [...new Set(data.map((d) => d.disaster_type))].sort();
  
  const cellData = disasterTypes.flatMap((disaster) =>
    SEVERITY_ORDER.map((severity) => {
      const item = data.find((d) => d.disaster_type === disaster && d.final_severity === severity);
      return {
        disaster,
        severity,
        severityLabel: SEVERITY_LABELS[severity],
        count: item ? Number(item.count) : 0,
        avgPriority: item ? Math.round(Number(item.avg_priority)) : 0,
      };
    })
  );

  const maxCount = Math.max(1, ...cellData.map((d) => d.count));
  const maxPriority = Math.max(1, ...cellData.map((d) => d.avgPriority));

  return (
    <Card>
      <CardTitle className="mb-2">Priority Heatmap (Count / Avg Priority)</CardTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 font-medium">Disaster Type</th>
              {SEVERITY_ORDER.map((s) => (
                <th key={s} className="text-center p-2 font-medium">
                  {SEVERITY_LABELS[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {disasterTypes.map((disaster) => (
              <tr key={disaster}>
                <td className="p-2 font-medium">{disaster}</td>
                {SEVERITY_ORDER.map((severity) => {
                  const cell = cellData.find((d) => d.disaster === disaster && d.severity === severity);
                  const intensity = cell && cell.count > 0 ? Math.min(cell.count / maxCount, 1) : 0;
                  const priorityIntensity = cell && cell.avgPriority > 0 ? Math.min(cell.avgPriority / maxPriority, 1) : 0;
                  const bgColor = intensity > 0
                    ? `rgba(239, 68, 68, ${0.1 + intensity * 0.5})`
                    : "transparent";
                  return (
                    <td key={severity} className="text-center p-2" style={{ backgroundColor: bgColor }}>
                      {cell && cell.count > 0 ? (
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{cell.count}</span>
                          <span className="text-xs text-gray-500">Ø{cell.avgPriority}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}