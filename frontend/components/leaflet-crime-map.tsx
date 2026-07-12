"use client";

import { useEffect, useRef } from "react";

import type { CrimeRecord, Hotspot } from "@/lib/api";

export function LeafletCrimeMap({
  crimes,
  hotspots
}: {
  crimes: CrimeRecord[];
  hotspots: Hotspot[];
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup = () => {};

    async function initializeMap() {
      if (!mapRef.current) {
        return;
      }
      const L = await import("leaflet");
      const map = L.map(mapRef.current, {
        center: [14.5204, 75.7224],
        zoom: 7,
        scrollWheelZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);

      hotspots.forEach((hotspot) => {
        L.circle([hotspot.latitude, hotspot.longitude], {
          radius: 12000 + hotspot.confidence * 28000,
          color: hotspot.risk_level === "High" ? "#b91c1c" : "#b7791f",
          fillColor: hotspot.risk_level === "High" ? "#b91c1c" : "#b7791f",
          fillOpacity: 0.22,
          weight: 2
        })
          .bindPopup(`${hotspot.district}: ${Math.round(hotspot.confidence * 100)}% confidence`)
          .addTo(map);
      });

      crimes.slice(0, 100).forEach((crime) => {
        L.circleMarker([crime.latitude, crime.longitude], {
          radius: 6,
          color: crime.risk_level === "High" ? "#b91c1c" : "#0f766e",
          fillColor: crime.risk_level === "High" ? "#b91c1c" : "#0f766e",
          fillOpacity: 0.82,
          weight: 1
        })
          .bindPopup(`${crime.fir_id} · ${crime.crime_type} · ${crime.police_station}`)
          .addTo(map);
      });

      cleanup = () => map.remove();
    }

    initializeMap();
    return () => cleanup();
  }, [crimes, hotspots]);

  return <div ref={mapRef} className="h-96 w-full overflow-hidden rounded border border-black/10 bg-[#eef2e8]" />;
}
