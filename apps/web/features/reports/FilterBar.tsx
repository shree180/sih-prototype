"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DISASTER_TYPES } from "@/lib/rbac";

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.push(`/authority/incidents?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border bg-white p-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Disaster</label>
        <Select value={params.get("disaster") ?? ""} onChange={(e) => update("disaster", e.target.value)}>
          <option value="">All</option>
          {DISASTER_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Severity</label>
        <Select value={params.get("severity") ?? ""} onChange={(e) => update("severity", e.target.value)}>
          <option value="">All</option>
          {["unclear", "minor", "moderate", "severe", "critical"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Verification</label>
        <Select value={params.get("verify") ?? ""} onChange={(e) => update("verify", e.target.value)}>
          <option value="">All</option>
          {["unverified", "needs_review", "verified", "rejected", "escalated"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      <Button variant="secondary" onClick={() => router.push("/authority/incidents")}>Clear</Button>
    </div>
  );
}
