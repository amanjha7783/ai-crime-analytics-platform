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

    // 1. Predictive Spread (Orange halos around hotspots)
    if (showPredictive) {
      const hotspots = crimes.filter((c, i) => i % 50 === 0 && c.risk_level === "High"); // Mocking hotspot centers for spread
      hotspots.forEach(hotspot => {
        L.circle([hotspot.latitude, hotspot.longitude], {
          radius: 8000,
          color: "#f97316",
          fillColor: "#fb923c",
          fillOpacity: 0.1,
          weight: 1,
          dashArray: "5, 10"
        }).addTo(map);
      });
    }

    // 2. High-Risk Zones (Red circles on high-risk crimes)
    if (showHighRisk) {
      const highRisk = crimes.filter(c => c.risk_level === "High");
      highRisk.forEach((crime) => {
        L.circleMarker([crime.latitude, crime.longitude], {
          radius: 5,
          color: "#ef4444",
          fillColor: "#b91c1c",
          fillOpacity: 0.8,
          weight: 1,
        }).bindPopup(`High Risk FIR: ${crime.fir_id}`).addTo(map);
      });
    }

    // 3. Crime Density Heatmap with optional Temporal Decay
    if (showHeat) {
      const now = new Date();
      const heatData = crimes.map((crime) => {
        let intensity = 1.0;
        
        // Temporal decay: Older crimes have lower intensity
        if (showTemporal) {
          const crimeDate = new Date(crime.reported_at);
          const daysOld = (now.getTime() - crimeDate.getTime()) / (1000 * 3600 * 24);
          // Decrease intensity by 0.1 for every 100 days old, minimum 0.2
          intensity = Math.max(0.2, 1.0 - (daysOld / 1000));
        }
        
        return [crime.latitude, crime.longitude, intensity];
      });
      
      const heatLayer = L.heatLayer(heatData, {
        radius: 25, // Increased radius for better visibility
        blur: 20,   // Increased blur for a smoother thermal effect
        maxZoom: 17,
        max: 1.0,
        gradient: showTemporal ? {
          0.4: '#3b82f6', // blue
          0.6: '#a855f7', // purple
          0.8: '#ec4899', // pink
          1.0: '#ef4444'  // red (focus on recent/intense)
        } : {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
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
