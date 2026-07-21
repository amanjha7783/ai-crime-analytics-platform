"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from "recharts";
import { TrendingUp, Users, MapPin, Activity } from "lucide-react";
import { DashboardData, PredictionData, SocioEconomicData } from "@/lib/api";

export function AnalyticsDashboard({ 
  dashboard, 
  predictions, 
  socioEconomic 
}: { 
  dashboard: DashboardData, 
  predictions: PredictionData, 
  socioEconomic: SocioEconomicData 
}) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Crimes</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{dashboard.kpis.total_crimes}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Cases</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{dashboard.kpis.active_cases}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Top District</p>
            <p className="text-xl font-bold text-slate-800 mt-1 truncate max-w-[120px]" title={dashboard.kpis.top_district}>
              {dashboard.kpis.top_district}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">High Risk Zones</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{dashboard.kpis.high_risk_zones}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionPanel title="Crime Trends Overview">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Area type="monotone" dataKey="crime_count" name="Crimes" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel title="Crime Mix Distribution">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.crime_mix} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="crime_type" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip 
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
                />
                <Bar dataKey="count" name="Incidents" radius={[0, 4, 4, 0]} barSize={20}>
                  {dashboard.crime_mix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8b5cf6" : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionPanel title="Socio-Economic Correlation">
          <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-indigo-900">AI Insight (Correlation: {socioEconomic.correlation})</h4>
                <p className="text-sm text-indigo-800 mt-1">{socioEconomic.insight}</p>
              </div>
            </div>
          </div>
          <DataTable columns={["district", "crime_count", "population_density", "income_category", "risk_score"]} rows={socioEconomic.factors} />
        </SectionPanel>
        
        <SectionPanel title="Crime Classification">
          <DataTable
            columns={["district", "predicted_crime_type", "confidence", "average_risk"]}
            rows={predictions.classifications}
          />
        </SectionPanel>
      </div>
    </div>
  );
}
