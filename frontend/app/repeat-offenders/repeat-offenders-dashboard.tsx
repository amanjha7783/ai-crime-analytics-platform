"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, AlertTriangle, Crosshair, ShieldAlert } from "lucide-react";

export function RepeatOffendersDashboard({ offenders }: { offenders: { offender_id: string, risk_score: number, crime_count: number, last_seen?: string, districts?: string, crime_types?: string }[] }) {
  const stats = useMemo(() => {
    const total = offenders.length;
    let highRisk = 0;
    let totalCrimes = 0;
    
    // Sort offenders by risk score for chart
    const chartData = [...offenders]
      .sort((a, b) => b.risk_score - a.risk_score)
      .slice(0, 10)
      .map(o => ({
        name: o.offender_id,
        score: o.risk_score,
        crimes: o.crime_count
      }));

    offenders.forEach(o => {
      if (o.risk_score > 70) highRisk++;
      totalCrimes += o.crime_count;
    });

    return { total, highRisk, totalCrimes, chartData };
  }, [offenders]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Known Offenders</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">High Risk Watchlist</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.highRisk}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Linked Crimes</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{stats.totalCrimes}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Crosshair className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tracking Status</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">Active</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionPanel title="Top 10 Most Dangerous Offenders">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip 
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
                />
                <Bar dataKey="score" name="Risk Score" radius={[0, 4, 4, 0]} barSize={20}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 70 ? "#ef4444" : "#f97316"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel title="Repeat Offender Registry">
          <DataTable 
            columns={["offender_id", "crime_count", "last_seen", "districts", "crime_types", "risk_score"]} 
            rows={offenders} 
          />
        </SectionPanel>
      </div>
    </div>
  );
}
