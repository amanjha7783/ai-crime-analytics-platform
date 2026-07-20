"use client";

import React, { useState, useMemo } from "react";
import { LeafletCrimeMap } from "@/components/leaflet-crime-map";
import { DataTable } from "@/components/data-table";
import { getCrimes, getHotspots } from "@/lib/api";
import type { CrimeRecord, Hotspot } from "@/lib/api";
import { Layers, MapPin, Search, Calendar, Activity, X } from "lucide-react";

const isBrowser = typeof window !== "undefined";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (isBrowser ? "" : "http://127.0.0.1:8000");

function parseYear(dateString: string) {
  if (!dateString) return null;
  return new Date(dateString).getFullYear();
}

function inDateRange(dateString: string, range: string) {
  if (range === "All") return true;
  const d = new Date(dateString);
  const now = new Date();
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
  if (range === "Last 7 days") return diffDays <= 7;
  if (range === "Last 30 days") return diffDays <= 30;
  if (range === "This Year") return d.getFullYear() === now.getFullYear();
  return true;
}

export function CrimeMapClient() {
  const [initialCrimes, setInitialCrimes] = useState<CrimeRecord[]>([]);
  const [initialHotspots, setInitialHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  
  React.useEffect(() => {
    let active = true;
    
    const loadInitial = async () => {
      try {
        setLoading(true);
        const [crimesData, hotspotsData] = await Promise.all([
            getCrimes(),
            getHotspots()
        ]);
        
        if (active) {
          setInitialCrimes(crimesData);
          setInitialHotspots(hotspotsData);
        }
        
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
                    console.warn("Chunk loading stopped:", e);
                    break;
                }
            }
            if (active) setLoadingMore(false);
        }
        
      } catch (err) {
        console.error(err);
        if (active) setFetchError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    loadInitial();
    
    return () => { active = false; };
  }, []);

  const [district, setDistrict] = useState("All");
  const [crimeType, setCrimeType] = useState("All");
  const [policeStation, setPoliceStation] = useState("All");
  const [status, setStatus] = useState("All");
  const [year, setYear] = useState("All");
  const [dateRange, setDateRange] = useState("All");

  const isFiltered = district !== "All" || crimeType !== "All" || policeStation !== "All" || status !== "All" || year !== "All" || dateRange !== "All";

  // Precompute aggregations for premium dynamic dropdowns
  const aggregations = useMemo(() => {
    const districts = new Map<string, number>();
    const crimeTypes = new Map<string, number>();
    const policeStations = new Map<string, number>();
    const statuses = new Map<string, number>();
    const years = new Map<string, number>();

    initialCrimes.forEach(c => {
      districts.set(c.district, (districts.get(c.district) || 0) + 1);
      crimeTypes.set(c.crime_type, (crimeTypes.get(c.crime_type) || 0) + 1);
      policeStations.set(c.police_station, (policeStations.get(c.police_station) || 0) + 1);
      statuses.set(c.status, (statuses.get(c.status) || 0) + 1);
      const y = parseYear(c.reported_at);
      if (y) {
        years.set(String(y), (years.get(String(y)) || 0) + 1);
      }
    });

    const sortMap = (map: Map<string, number>) => Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return {
      districts: sortMap(districts),
      crimeTypes: sortMap(crimeTypes),
      policeStations: sortMap(policeStations),
      statuses: sortMap(statuses),
      years: sortMap(years),
    };
  }, [initialCrimes]);

  const dateRanges = ["All", "Last 7 days", "Last 30 days", "This Year"];

  const filteredCrimes = useMemo(() => {
    return initialCrimes.filter((c) => {
      if (district !== "All" && c.district !== district) return false;
      if (crimeType !== "All" && c.crime_type !== crimeType) return false;
      if (policeStation !== "All" && c.police_station !== policeStation) return false;
      if (status !== "All" && c.status !== status) return false;
      if (year !== "All") {
        const y = parseYear(c.reported_at);
        if (String(y) !== year) return false;
      }
      if (!inDateRange(c.reported_at, dateRange)) return false;
      return true;
    });
  }, [initialCrimes, district, crimeType, policeStation, status, year, dateRange]);

  const filteredHotspots = useMemo(() => {
    if (district === "All") return initialHotspots;
    return initialHotspots.filter((h) => h.district === district);
  }, [initialHotspots, district]);

  const clearFilters = () => {
    setDistrict("All");
    setCrimeType("All");
    setPoliceStation("All");
    setStatus("All");
    setYear("All");
    setDateRange("All");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col">
          <div className="mb-4 h-[650px] relative rounded-xl overflow-hidden shadow-lg border border-slate-200/60 bg-white group">
            {loading && initialCrimes.length === 0 ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <span className="text-slate-600 font-medium">Initializing Map Data...</span>
                </div>
            ) : null}
            <LeafletCrimeMap crimes={filteredCrimes} hotspots={filteredHotspots} isFiltered={isFiltered} />
            
            {/* Overlay Statistics Pill on Map */}
            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md shadow-lg rounded-full px-5 py-2.5 flex items-center gap-4 text-sm font-medium border border-slate-200/50 transition-all hover:bg-white">
              <div className="flex items-center gap-1.5 text-blue-700">
                <MapPin className="w-4 h-4" />
                <span>{filteredCrimes.length.toLocaleString()} <span className="text-slate-500 font-normal">FIRs</span></span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-1.5 text-orange-600">
                <Activity className="w-4 h-4" />
                <span>{filteredHotspots.length} <span className="text-slate-500 font-normal">Hotspots</span></span>
              </div>
              {loadingMore && (
                <>
                  <div className="w-px h-4 bg-slate-300"></div>
                  <span className="animate-pulse text-blue-500 text-xs flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Syncing...</span>
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
                  Map Filters
                </h3>
                <p className="text-xs text-slate-500 mt-1">Refine {initialCrimes.length > 0 ? initialCrimes.length.toLocaleString() : '...'} total records</p>
              </div>
              
              {isFiltered && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                >
                  <X className="w-3 h-3" />
                  Reset All
                </button>
              )}
            </div>
            
            <div className="grid gap-5 text-sm flex-1 content-start">
              <label className="grid gap-1.5 group">
                <span className="font-medium text-slate-700 text-xs uppercase tracking-wider">District</span>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                  <option value="All">All Districts</option>
                  {aggregations.districts.map(([d, count]) => (
                    <option key={d} value={d}>{d} ({count.toLocaleString()})</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 group">
                <span className="font-medium text-slate-700 text-xs uppercase tracking-wider">Police Station</span>
                <select value={policeStation} onChange={(e) => setPoliceStation(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                  <option value="All">All Stations</option>
                  {aggregations.policeStations.map(([p, count]) => (
                    <option key={p} value={p}>{p} ({count.toLocaleString()})</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 group">
                <span className="font-medium text-slate-700 text-xs uppercase tracking-wider">Crime Type</span>
                <select value={crimeType} onChange={(e) => setCrimeType(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                  <option value="All">All Categories</option>
                  {aggregations.crimeTypes.map(([t, count]) => (
                    <option key={t} value={t}>{t} ({count.toLocaleString()})</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1.5 group">
                  <span className="font-medium text-slate-700 text-xs uppercase tracking-wider">Year</span>
                  <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                    <option value="All">All</option>
                    {aggregations.years.map(([y, count]) => (
                      <option key={y} value={y}>{y} ({count.toLocaleString()})</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 group">
                  <span className="font-medium text-slate-700 text-xs uppercase tracking-wider">Status</span>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                    <option value="All">All</option>
                    {aggregations.statuses.map(([s, count]) => (
                      <option key={s} value={s}>{s} ({count.toLocaleString()})</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-1.5 group mt-2">
                <span className="font-medium text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Quick Date</span>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 outline-none transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                  {dateRanges.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>
            
            {fetchError && (
              <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-800 flex items-start gap-2">
                <div className="mt-0.5">⚠️</div>
                <p><strong>Offline Mode:</strong> Could not reach live backend. Displaying local fallback dataset.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-xl border border-slate-200/60 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              FIR Data Directory
            </h3>
            <p className="text-sm text-slate-500">Explore, search, and export filtered incidents</p>
          </div>
          <DataTable columns={["fir_id", "crime_type", "district", "police_station", "status", "risk_level"]} rows={filteredCrimes} />
        </div>
      </div>
    </div>
  );
}

export default CrimeMapClient;
