"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

interface MediaItem {
  id: string;
  storage_path: string;
  media_type: string | null;
  is_original: boolean;
  signed_url?: string;
}

export function ImageGallery({
  media,
  reportId,
}: {
  media: MediaItem[];
  reportId: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const redactedMedia = media.filter((m) => !m.is_original);
  const originalMedia = media.filter((m) => m.is_original);

  const currentRedacted = redactedMedia[selectedIndex];

  useEffect(() => {
    if (imgRef.current && containerRef.current) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [selectedIndex]);

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((prev) => {
      const newZoom = Math.min(Math.max(prev - e.deltaY * 0.001, 1), 5);
      return newZoom;
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (zoom <= 1) return;
    e.preventDefault();
    const startX = e.clientX - pan.x;
    const startY = e.clientY - pan.y;

    function handleMouseMove(e: MouseEvent) {
      setPan({ x: e.clientX - startX, y: e.clientY - startY });
    }

    function handleMouseUp() {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (zoom <= 1) return;
    const touch = e.touches[0];
    const startX = touch.clientX - pan.x;
    const startY = touch.clientY - pan.y;

    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      setPan({ x: touch.clientX - startX, y: touch.clientY - startY });
    }

    function handleTouchEnd() {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  if (!redactedMedia.length) {
    return (
      <Card>
        <CardTitle className="mb-2">Evidence (Redacted)</CardTitle>
        <p className="text-sm text-gray-400">No redacted media available.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Evidence (Redacted)</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetView} disabled={zoom <= 1}>
              Reset View
            </Button>
          </div>
        </div>

        <div
            ref={containerRef}
            className="relative aspect-square rounded border overflow-hidden bg-gray-100"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <img
              ref={imgRef}
              src={currentRedacted.signed_url}
              alt="Redacted evidence"
              className={`w-full h-full object-contain transition-transform duration-100 ${
                zoom > 1 ? "cursor-grab" : ""
              }`}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "top left",
              }}
            />
            {zoom > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {Math.round(zoom * 100)}%
              </div>
            )}
          </div>

        <div className="mt-2 flex gap-2 overflow-x-auto">
          {redactedMedia.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setSelectedIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                i === selectedIndex ? "border-amber-500" : "border-transparent"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              {m.signed_url && (
                <img src={m.signed_url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Original images are restricted. Redaction is a safety measure, not a guarantee.
          {zoom > 1 && " — Scroll to zoom, drag to pan"}
        </p>
      </Card>

      {originalMedia.length > 0 && (
        <Card>
          <CardTitle className="mb-2">Original Media (Restricted Access)</CardTitle>
          <p className="text-sm text-gray-500 mb-2">
            Original files require elevated permissions. Use comparison view above.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {originalMedia.map((m, i) => (
              <div key={m.id} className="rounded border p-2 bg-gray-50">
                <p className="text-xs font-medium">Original #{i + 1}</p>
                <p className="text-xs text-gray-500">{m.storage_path}</p>
                <p className="text-xs text-gray-400">Access requires admin approval</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
