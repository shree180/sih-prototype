"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Supercluster from "supercluster";
import type { MapReport } from "@/features/map/IncidentMap";
import { SEVERITY_COLOR } from "@/lib/rbac";
import type { Severity } from "@/lib/types";

interface ClusteredMapReport extends MapReport {
  cluster_id?: number;
  point_count?: number;
}

export function ClusteredIncidentMap({ reports, height = "h-[480px]" }: { reports: MapReport[]; height?: string }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const clusterRef = useRef<Supercluster<MapReport> | null>(null);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    
    const map = new maplibregl.Map({
      container: mapEl.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      } as any,
      center: [72.8777, 18.9667],
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    // Initialize supercluster
    const points = reports.map((r) => ({
      type: "Feature" as const,
      properties: r,
      geometry: { type: "Point" as const, coordinates: [r.lng, r.lat] },
    }));

    clusterRef.current = new Supercluster({
      radius: 60,
      maxZoom: 16,
      minZoom: 0,
    });

    clusterRef.current.load(points);

    // Add cluster layers
    map.on("load", () => {
      updateMapData(map, 10);
    });

    map.on("zoomend", () => {
      const newZoom = map.getZoom();
      setZoom(newZoom);
      updateMapData(map, newZoom);
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !clusterRef.current) return;
    
    const points = reports.map((r) => ({
      type: "Feature" as const,
      properties: r,
      geometry: { type: "Point" as const, coordinates: [r.lng, r.lat] },
    }));

    clusterRef.current.load(points);
    updateMapData(map, zoom);
  }, [reports, zoom]);

  function updateMapData(map: maplibregl.Map, currentZoom: number) {
    if (!clusterRef.current) return;

    const clusters = clusterRef.current.getClusters([-180, -90, 180, 90], Math.floor(currentZoom));
    
    const clusterFeatures = clusters.map((cluster) => {
      const count = (cluster.properties as any)?.point_count ?? 1;
      const isCluster = count > 1;
      const severity = isCluster ? null : ((cluster.properties as any)?.severity as Severity | null);
      
      return {
        ...cluster,
        properties: {
          ...cluster.properties,
          isCluster,
          count,
          severity,
        },
      };
    });

    const source = map.getSource("clusters") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({ type: "FeatureCollection", features: clusterFeatures });
    } else {
      map.addSource("clusters", {
        type: "geojson",
        data: { type: "FeatureCollection", features: clusterFeatures },
      });

      // Cluster circles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "clusters",
        filter: ["has", "point_count"],
        paint: {
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            10,
            30,
            100,
            40,
          ],
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#3b82f6",
            10,
            "#f97316",
            100,
            "#ef4444",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Cluster count labels
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "clusters",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff",
        },
      });

      // Unclustered points
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "clusters",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 10,
          "circle-color": [
            "match",
            ["get", "severity"],
            "critical", "#ef4444",
            "severe", "#f97316",
            "moderate", "#eab308",
            "minor", "#22c55e",
            "#6b7280",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Point labels
      map.addLayer({
        id: "unclustered-label",
        type: "symbol",
        source: "clusters",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": "{disaster_type}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 10,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#000",
          "text-halo-color": "#fff",
          "text-halo-width": 1,
        },
      });
    }

    // Click handler for clusters
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!features.length) return;
      
      const cluster = features[0].properties as any;
      if (cluster.point_count) {
        const expansionZoom = clusterRef.current!.getClusterExpansionZoom(cluster.cluster_id);
        map.easeTo({
          center: e.lngLat,
          zoom: expansionZoom,
        });
      }
    });

    map.on("click", "unclustered-point", (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["unclustered-point"] });
      if (!features.length) return;
      
      const props = features[0].properties as MapReport;
      window.location.href = `/authority/incidents/${props.id}`;
    });

    map.getCanvas().style.cursor = "default";
    map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = "default"; });
    map.on("mouseenter", "unclustered-point", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "unclustered-point", () => { map.getCanvas().style.cursor = "default"; });
  }

  return <div ref={mapEl} className={`${height} w-full rounded-md border`} />;
}