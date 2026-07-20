"use client";

import React, { useState, useMemo } from "react";
import { LeafletHeatMap } from "@/components/leaflet-heat-map";
import { getCrimes } from "@/lib/api";
import type { CrimeRecord } from "@/lib/api";
import { Layers, Activity, Flame, Loader2 } from "lucide-react";

const isBrowser = typeof window !== "undefined";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (isBrowser ? "" : "http://127.0.0.1:8000");

export function HeatMapClient() {
  const [initialCrimes, setInitialCrimes] = useState<CrimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeLayers, setActiveLayers] = useState<string[]>(["Crime Density (Heat)", "High-Risk Zones"]);
  
  React.useEffect(() => {
    let active = true;
    
    const loadInitial = async () => {
      try {
        setLoading(true);
        // Direct fetch to bypass Next.js cache
        const res = await fetch(`${API_BASE_URL}/api/crimes?limit=5000`, { cache: 'no-store' });
        const crimesData = await res.json();
        
        if (active) {
          setInitialCrimes(crimesData);
        }
        
        // Next.js client-side chunk loading
        if (crimesData.length === 5000) {
            setLoadingMore(true);
            let skip = 5000;
            let allCrimes = [...crimesData];
            
            while (active) {
                try {
                    const cRes = await fetch(`${API_BASE_URL}/api/crimes?limit=5000&skip=${skip}`);
                    if (!cRes.ok) break;
                    const chunk = await cRes.json();
                    if (chunk.length === 0) break;
                    
                    allCrimes = [...allCrimes, ...chunk];
                    if (active) setInitialCrimes(allCrimes);
                    
                    if (chunk.length < 5000) break;
                    skip += 5000;
                } catch (e) {
                    break;
                }
            }
            if (active) setLoadingMore(false);
        }
        
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    loadInitial();
    return () => { active = false; };
  }, []);

  const [district, setDistrict] = useState("All");
  
  // Precompute districts for dynamic dropdown
  const districts = useMemo(() => {
    const map = new Map<string, number>();
    initialCrimes.forEach(c => map.set(c.district, (map.get(c.district) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [initialCrimes]);

  const filteredCrimes = useMemo(() => {
    if (district === "All") return initialCrimes;
    return initialCrimes.filter(c => c.district === district);
  }, [initialCrimes, district]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="flex flex-col">
        {/* Added fixed height and overflow-hidden to fix the map escaping bug */}
        <div className="relative h-[650px] rounded-xl border border-slate-200/60 bg-white overflow-hidden shadow-lg">
          {loading && initialCrimes.length === 0 ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
              <span className="text-slate-600 font-medium">Computing Heat Densities...</span>
            </div>
          ) : null}
          
          <LeafletHeatMap crimes={filteredCrimes} activeLayers={activeLayers} />
          
          <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md shadow-lg rounded-full px-5 py-2.5 flex items-center gap-4 text-sm font-medium border border-slate-200/50">
            <div className="flex items-center gap-1.5 text-red-600">
              <Flame className="w-4 h-4" />
              <span>{filteredCrimes.length.toLocaleString()} <span className="text-slate-500 font-normal">Data Points</span></span>
            </div>
            {loadingMore && (
              <>
                <div className="w-px h-4 bg-slate-300"></div>
                <span className="animate-pulse text-blue-500 text-xs flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Syncing...
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-6 rounded-xl shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Heatmap Settings
              </h3>
              <p className="text-xs text-slate-500 mt-1">Focus on specific intensity regions</p>
            </div>
          </div>
          
          <div className="grid gap-5 text-sm">
            <label className="grid gap-1.5 group">
              <span className="font-medium text-slate-700 text-xs uppercase tracking-wider">Region Focus</span>
              <select 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)} 
                className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All of Karnataka (Statewide Density)</option>
                {districts.map(([d, count]) => (
                  <option key={d} value={d}>{d} ({count.toLocaleString()} points)</option>
                ))}
              </select>
            </label>

            <div className="mt-4 border-t border-slate-100 pt-5">
              <span className="font-medium text-slate-700 text-xs uppercase tracking-wider mb-3 block">Display Layers</span>
              <div className="space-y-3">
                {["Crime Density (Heat)", "High-Risk Zones", "Predictive Spread", "Temporal Decay"].map((layer) => (
                  <label key={layer} className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50/50 hover:bg-white transition-colors px-4 py-3 cursor-pointer">
                    <span className="text-slate-700">{layer}</span>
                    <input 
                      type="checkbox" 
                      checked={activeLayers.includes(layer)} 
                      onChange={(e) => {
                        if (e.target.checked) setActiveLayers(prev => [...prev, layer]);
                        else setActiveLayers(prev => prev.filter(l => l !== layer));
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatMapClient;
