"use client";

import { useEffect, useRef, useState } from "react";
import type { CrimeRecord, Hotspot } from "@/lib/api";

export function LeafletHeatMap({
  crimes,
  activeLayers = [],
}: {
  crimes: CrimeRecord[];
  activeLayers?: string[];
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      
      const L = await import("leaflet");
      if (!active) return;

      // Fix Leaflet icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Load CSS dynamically for Leaflet
      if (!document.getElementById("leaflet-css")) {
        const link3 = document.createElement("link");
        link3.id = "leaflet-css";
        link3.rel = "stylesheet";
        link3.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link3);
      }

      // Load leaflet-heat script dynamically
      if (!document.getElementById("leaflet-heat-js")) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.id = "leaflet-heat-js";
          script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (!mapRef.current) {
        if ((mapContainerRef.current as any)._leaflet_id) {
          mapRef.current = (mapContainerRef.current as any)._leaflet_map;
        } else {
          const map = L.map(mapContainerRef.current, {
            center: [14.5204, 75.7224],
            zoom: 7,
            scrollWheelZoom: false,
            preferCanvas: true
          });
          
          (mapContainerRef.current as any)._leaflet_map = map;

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(map);

          mapRef.current = map;
        }
      }
      
      setIsLeafletReady(true);
    }

    initMap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !mapRef.current || !(window as any).L || !(window as any).L.heatLayer) return;

    const L = (window as any).L;
    const map = mapRef.current;

    // Clear existing heat layers
    map.eachLayer((layer: any) => {
      if (!layer._url && layer !== map) {
        map.removeLayer(layer);
      }
    });

    if (crimes.length === 0) {
      map.flyTo([14.5204, 75.7224], 7, { duration: 1.5 });
      return;
    }

    const showHeat = activeLayers.includes("Crime Density (Heat)");
    const showHighRisk = activeLayers.includes("High-Risk Zones");
    const showPredictive = activeLayers.includes("Predictive Spread");
    const showTemporal = activeLayers.includes("Temporal Decay");

    // 1. Predictive Spread (Magenta halos around hotspots)
    if (showPredictive) {
      const hotspots = crimes.filter((c, i) => i % 50 === 0 && c.risk_level === "High");
      hotspots.forEach(hotspot => {
        L.circle([hotspot.latitude, hotspot.longitude], {
          radius: 6000,
          color: "#d946ef", // Neon Magenta/Pink
          fillColor: "#e879f9",
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "5, 10"
        }).addTo(map);
      });
    }

    // 2. High-Risk Zones (Neon Cyan circles)
    if (showHighRisk) {
      const highRisk = crimes.filter(c => c.risk_level === "High");
      highRisk.forEach((crime) => {
        L.circleMarker([crime.latitude, crime.longitude], {
          radius: 4,
          color: "#06b6d4", // Neon Cyan
          fillColor: "#22d3ee",
          fillOpacity: 0.9,
          weight: 1,
        }).bindPopup(`High Risk FIR: ${crime.fir_id}`).addTo(map);
      });
    }
    
    // 3. Temporal Decay (Neon Yellow circles for older crimes)
    if (showTemporal) {
      const now = new Date();
      const olderCrimes = crimes.filter(c => {
        const daysOld = (now.getTime() - new Date(c.reported_at).getTime()) / (1000 * 3600 * 24);
        return daysOld > 180; // Older than 6 months
      });
      
      olderCrimes.forEach((crime) => {
        L.circleMarker([crime.latitude, crime.longitude], {
          radius: 3,
          color: "#eab308", // Neon Yellow
          fillColor: "#fde047",
          fillOpacity: 0.5,
          weight: 1,
        }).addTo(map);
      });
    }

    // 4. Crime Density Heatmap
    if (showHeat) {
      const heatData = crimes.map((crime) => [crime.latitude, crime.longitude, 1.0]);
      
      const heatLayer = L.heatLayer(heatData, {
        radius: 22,
        blur: 18,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.4: '#3b82f6', // blue
          0.6: '#22c55e', // green
          0.8: '#eab308', // yellow
          1.0: '#ef4444'  // red
        }
      });
      
      heatLayer.addTo(map);
    }
    
    // Auto-Zoom & FlyTo
    const bounds = L.latLngBounds(crimes.map((c) => [c.latitude, c.longitude]));
    map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 16 });

  }, [crimes, isLeafletReady, activeLayers]);

  return <div ref={mapContainerRef} className="h-full w-full bg-[#eef2e8] transition-opacity duration-300" />;
}
