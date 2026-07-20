"use client";

import { useEffect, useRef, useState } from "react";
import type { CrimeRecord, Hotspot } from "@/lib/api";

export function LeafletCrimeMap({
  crimes,
  hotspots,
  isFiltered,
}: {
  crimes: CrimeRecord[];
  hotspots: Hotspot[];
  isFiltered: boolean;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null); // Store Leaflet map instance
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      
      const L = await import("leaflet");
      if (!active) return;

      // Fix for Leaflet default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Load marker cluster
      await import("leaflet.markercluster");
      
      // Load CSS dynamically for marker cluster so we don't break Next.js SSR
      if (!document.getElementById("leaflet-cluster-css")) {
        const link1 = document.createElement("link");
        link1.id = "leaflet-cluster-css";
        link1.rel = "stylesheet";
        link1.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
        document.head.appendChild(link1);
        
        const link2 = document.createElement("link");
        link2.id = "leaflet-cluster-default-css";
        link2.rel = "stylesheet";
        link2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
        document.head.appendChild(link2);
        
        const link3 = document.createElement("link");
        link3.id = "leaflet-css";
        link3.rel = "stylesheet";
        link3.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link3);
      }

      if (!mapRef.current) {
        // Safe check to ensure we don't double initialize
        if ((mapContainerRef.current as any)._leaflet_id) {
          mapRef.current = (mapContainerRef.current as any)._leaflet_map;
        } else {
          const map = L.map(mapContainerRef.current, {
            center: [14.5204, 75.7224],
            zoom: 7,
            scrollWheelZoom: false,
            preferCanvas: true // Significant performance boost for large numbers of markers
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
      // We don't destroy the map on unmount to prevent 'Map container is already initialized'
      // when React StrictMode double-invokes useEffect. We just leave it and reuse it.
    };
  }, []);

  // Update markers when crimes or hotspots change
  useEffect(() => {
    if (!isLeafletReady || !mapRef.current) return;

    let active = true;

    async function renderData() {
      const L = await import("leaflet");
      if (!active) return;
      
      const map = mapRef.current;

      // Clear existing data layers
      map.eachLayer((layer: any) => {
        if (!layer._url && layer !== map) {
          map.removeLayer(layer);
        }
      });

      // Render Hotspots (always drawn directly)
      hotspots.forEach((hotspot) => {
        L.circle([hotspot.latitude, hotspot.longitude], {
          radius: 12000 + hotspot.confidence * 28000,
          color: hotspot.risk_level === "High" ? "#b91c1c" : "#b7791f",
          fillColor: hotspot.risk_level === "High" ? "#b91c1c" : "#b7791f",
          fillOpacity: 0.22,
          weight: 2,
        })
          .bindPopup(`<b>${hotspot.district}</b><br>Risk: ${hotspot.risk_level}<br>Confidence: ${Math.round(hotspot.confidence * 100)}%`)
          .addTo(map);
      });

      // Render Crimes using MarkerClusterGroup for performance
      const markers = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
      });

      crimes.forEach((crime) => {
        const marker = L.circleMarker([crime.latitude, crime.longitude], {
          radius: 6,
          color: crime.risk_level === "High" ? "#b91c1c" : (crime.risk_level === "Medium" ? "#ea580c" : "#0f766e"),
          fillColor: crime.risk_level === "High" ? "#b91c1c" : (crime.risk_level === "Medium" ? "#ea580c" : "#0f766e"),
          fillOpacity: 0.8,
          weight: 1,
        });
        marker.bindPopup(`<b>${crime.fir_id}</b><br>${crime.crime_type}<br>${crime.police_station}<br>Risk: ${crime.risk_level}`);
        markers.addLayer(marker);
      });

      map.addLayer(markers);

      // Auto-Zoom & FlyTo Logic
      if (isFiltered && crimes.length > 0) {
        const bounds = L.latLngBounds(crimes.map((c) => [c.latitude, c.longitude]));
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 16 });
      } else if (!isFiltered) {
        map.flyTo([14.5204, 75.7224], 7, { duration: 1.5 });
      }

    }

    renderData();

    return () => {
      active = false;
    };
  }, [crimes, hotspots, isLeafletReady, isFiltered]);

  return <div ref={mapContainerRef} className="h-full w-full bg-[#eef2e8] transition-opacity duration-300" />;
}
