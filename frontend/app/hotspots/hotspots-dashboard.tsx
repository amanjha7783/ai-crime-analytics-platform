"use client";

import React from "react";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { LeafletCrimeMap } from "@/components/leaflet-crime-map";
import { Map, AlertTriangle, ShieldCheck, Radar } from "lucide-react";
import { CrimeRecord, Hotspot } from "@/lib/api";

export function HotspotsDashboard({ crimes, hotspots }: { crimes: CrimeRecord[], hotspots: Hotspot[] }) {
  const highRiskCount = hotspots.filter(h => h.risk_level === "High").length;
  const avgConfidence = hotspots.length > 0 
    ? Math.round(hotspots.reduce((acc, curr) => acc + curr.confidence, 0) / hotspots.length * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Detected Hotspots</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{hotspots.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Map className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Critical Zones</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{highRiskCount}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Prediction Confidence</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{avgConfidence}%</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Geo-Spatial Scan</p>
            <p className="text-xl font-bold text-slate-800 mt-1">Active</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Radar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionPanel title="AI-Predicted Hotspot Map">
          <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-inner h-[500px]">
            <LeafletCrimeMap crimes={crimes} hotspots={hotspots} isFiltered={false} />
            
            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Heat Tracking
            </div>
          </div>
        </SectionPanel>

        <div className="space-y-5 flex flex-col">
          <SectionPanel title="Hotspot Threat Levels" className="flex-1">
            <DataTable columns={["district", "crime_count", "confidence", "risk_level"]} rows={hotspots} />
          </SectionPanel>
        </div>
      </div>
    </div>
  );
}
