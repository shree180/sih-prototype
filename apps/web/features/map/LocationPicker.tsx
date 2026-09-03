"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";

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

export interface PickedLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  source: string;
}

export function LocationPicker({
  value,
  onChange,
}: {
  value?: PickedLocation | null;
  onChange: (loc: PickedLocation) => void;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const initialLat = value?.lat ?? 19.0728;
    const initialLng = value?.lng ?? 72.8797;

    const map = new maplibregl.Map({
      container: mapEl.current,
      style: OSM_STYLE as any,
      center: [initialLng, initialLat],
      zoom: 11,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("click", (e) => {
      setPin(e.lngLat.lat, e.lngLat.lng);
      onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng, source: "manual" });
      setStatus(`Pinned: ${e.lngLat.lat.toFixed(5)}, ${e.lngLat.lng.toFixed(5)}`);
    });

    mapRef.current = map;

    if (value?.lat && value?.lng) {
      setPin(value.lat, value.lng);
    }

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setPin(lat: number, lng: number) {
    if (!mapRef.current) return;
    const ll = new maplibregl.LngLat(lng, lat);
    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ color: "#ef4444" }).setLngLat(ll).addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat(ll);
    }
    mapRef.current.flyTo({ center: ll, zoom: 14 });
  }

  function useMyLocation() {
    setStatus("Acquiring GPS fix…");
    if (!navigator.geolocation) return setStatus("Geolocation not supported on device");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setPin(latitude, longitude);
        onChange({ lat: latitude, lng: longitude, accuracy, source: "gps" });
        setStatus(`GPS Locked (±${Math.round(accuracy)}m accuracy)`);
      },
      () => {
        setStatus("GPS is unavailable. Select the location on the map to continue.");
      }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={useMyLocation}
            className="rounded-full px-4 text-xs font-semibold shadow-sm"
          >
            📍 Use My Device GPS
          </Button>
          <span className="text-xs text-neutral-500 font-medium">{status}</span>
        </div>

      </div>

      <div ref={mapEl} className="h-72 w-full rounded-2xl border border-neutral-200 shadow-inner overflow-hidden" />

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <p>
          Click map to adjust pin. Coordinates:{" "}
          <strong className="text-neutral-800 font-mono">
            {value ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)} (${value.source})` : "None selected"}
          </strong>
        </p>
        <span className="text-[11px] text-neutral-400">Confirm the final pin before continuing.</span>
      </div>
    </div>
  );
}
