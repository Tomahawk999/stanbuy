"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Map as MapLibreMap, Marker, LngLatBounds, setWorkerUrl, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CENTER } from "@/lib/data";
import { Item } from "@/lib/types";

const INK = "#0F1A1C";
const ORANGE = "#0B0B0C";
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "esri-imagery": {
      type: "raster",
      tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 19,
    },
    "esri-labels": {
      type: "raster",
      tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    { id: "imagery", type: "raster", source: "esri-imagery" },
    { id: "labels", type: "raster", source: "esri-labels" },
  ],
};

if (typeof window !== "undefined") {
  setWorkerUrl("https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl-worker.mjs");
}

function markerElement(active: boolean, label: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cursor = "pointer";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.gap = "5px";
  el.style.padding = active ? "6px 12px" : "5px 10px";
  el.style.borderRadius = "999px";
  el.style.background = active ? ORANGE : "#ffffff";
  el.style.border = `1.5px solid ${active ? ORANGE : "#E5EBEE"}`;
  el.style.boxShadow = active ? "0 4px 12px rgba(251,68,2,0.35)" : "0 2px 6px rgba(15,26,28,0.18)";
  el.style.boxSizing = "border-box";
  el.style.fontSize = "12px";
  el.style.fontWeight = "700";
  el.style.color = active ? "#ffffff" : INK;
  el.style.whiteSpace = "nowrap";
  el.style.fontFamily = "var(--font-brand), sans-serif";

  const dot = document.createElement("span");
  dot.style.width = "6px";
  dot.style.height = "6px";
  dot.style.borderRadius = "999px";
  dot.style.background = active ? "#ffffff" : ORANGE;
  dot.style.flex = "none";
  el.appendChild(dot);

  const text = document.createElement("span");
  text.textContent = label;
  text.style.overflow = "hidden";
  text.style.textOverflow = "ellipsis";
  text.style.maxWidth = "160px";
  el.appendChild(text);

  return el;
}

export default function NeighborhoodMap({
  items,
  highlightedId,
  onHover,
  countLabel,
  satellite = false,
}: {
  items: Item[];
  highlightedId?: string | null;
  onHover?: (id: string | null) => void;
  countLabel?: string;
  satellite?: boolean;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: satellite ? SATELLITE_STYLE : STYLE_URL,
      center: [CENTER[1], CENTER[0]],
      zoom: 14,
      pitch: satellite ? 45 : 0,
      attributionControl: false,
      scrollZoom: false,
      dragRotate: satellite,
      pitchWithRotate: satellite,
      touchPitch: satellite,
    });
    map.on("load", () => setReady(true));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fitToItems = () => {
    const map = mapRef.current;
    if (!map || items.length === 0) return;
    if (items.length === 1) {
      map.easeTo({ center: [items[0].lng, items[0].lat], zoom: 15.5, duration: 300 });
      return;
    }
    const bounds = new LngLatBounds();
    items.forEach((i) => bounds.extend([i.lng, i.lat]));
    const camera = map.cameraForBounds(bounds, { padding: 44, maxZoom: 16 });
    const zoom = Math.max(camera?.zoom ?? 15, 14.5);
    map.easeTo({ center: camera?.center ?? bounds.getCenter(), zoom, duration: 300 });
  };

  useEffect(() => {
    if (!ready) return;
    fitToItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, items.map((i) => i.id).join(",")]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const currentIds = new Set(items.map((i) => i.id));

    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    items.forEach((item) => {
      const active = item.id === highlightedId;
      const existing = markersRef.current[item.id];
      if (existing) {
        existing.remove();
      }
      const shortTitle = item.title.length > 22 ? `${item.title.slice(0, 21)}…` : item.title;
      const el = markerElement(active, `${shortTitle} · ${item.distanceMin} min`);
      el.addEventListener("click", () => router.push(`/item/${item.id}`));
      el.addEventListener("mouseenter", () => onHover?.(item.id));
      el.addEventListener("mouseleave", () => onHover?.(null));
      const marker = new Marker({ element: el, anchor: "center" })
        .setLngLat([item.lng, item.lat])
        .addTo(map);
      markersRef.current[item.id] = marker;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, items, highlightedId]);

  const BTN: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "#ffffff",
    color: INK,
    boxShadow: "0 2px 8px rgba(15,26,28,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" style={{ background: "#EFF1F0" }} />

      <div className="absolute flex flex-col" style={{ right: 12, bottom: 12, gap: 8, zIndex: 10 }}>
        <button
          type="button"
          aria-label="Recenter map"
          style={BTN}
          onClick={(e) => {
            e.stopPropagation();
            fitToItems();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="7.5" />
            <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
          </svg>
        </button>
        <div style={{ background: "#ffffff", borderRadius: 999, boxShadow: "0 2px 8px rgba(15,26,28,0.18)", overflow: "hidden" }}>
          <button
            type="button"
            aria-label="Zoom in"
            style={{ ...BTN, boxShadow: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              mapRef.current?.zoomIn({ duration: 200 });
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div style={{ height: 1, background: "#EDEDEA" }} />
          <button
            type="button"
            aria-label="Zoom out"
            style={{ ...BTN, boxShadow: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              mapRef.current?.zoomOut({ duration: 200 });
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {countLabel && (
        <div
          className="pointer-events-none absolute flex items-center"
          style={{ top: 12, right: 12, zIndex: 10, height: 30, borderRadius: 999, padding: "0 12px", background: "#ffffff", boxShadow: "0 2px 8px rgba(15,26,28,0.18)", fontSize: 12, fontWeight: 700, color: INK }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 999, background: ORANGE, marginRight: 7 }} />
          {countLabel}
        </div>
      )}
    </div>
  );
}
