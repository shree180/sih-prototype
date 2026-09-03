"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Severity } from "@/lib/types";
import { SEVERITY_COLOR } from "@/lib/rbac";

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};

export interface MapReport {
  id: string;
  lat: number;
  lng: number;
  severity: Severity | null;
  disaster_type: string;
}

export function IncidentMap({
  reports,
  height = "h-[480px]",
}: {
  reports: MapReport[];
  height?: string;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapEl.current,
      style: OSM_STYLE as any,
      center: [72.8777, 18.9667],
      zoom: 10,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // clear previous markers
    const existing = document.querySelectorAll(".drml-marker");
    existing.forEach((e) => e.remove());
    const color = (s: Severity | null) =>
      SEVERITY_COLOR[s ?? "unclear"].replace("bg-", "#").replace("500", "500") ?? "#6b7280";
    const colorHex: Record<string, string> = {
      "#gray-500": "#6b7280",
      "#green-500": "#22c55e",
      "#yellow-500": "#eab308",
      "#orange-500": "#f97316",
      "#red-500": "#ef4444",
    };
    reports.forEach((r) => {
      const el = document.createElement("div");
      el.className = "drml-marker";
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "9999px";
      el.style.border = "2px solid white";
      el.style.cursor = "pointer";
      el.style.background = colorHex[SEVERITY_COLOR[r.severity ?? "unclear"]] ?? "#6b7280";
      el.addEventListener("click", () => router.push(`/authority/incidents/${r.id}`));
      new maplibregl.Marker({ element: el }).setLngLat([r.lng, r.lat]).addTo(map!);
    });
  }, [reports, router]);

  return <div ref={mapEl} className={`${height} w-full rounded-md border`} />;
}
