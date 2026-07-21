"use client";

import React from "react";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { BrainCircuit, Eye, Target, AlertOctagon } from "lucide-react";
import { PredictionData } from "@/lib/api";

export function PredictionsDashboard({ predictions }: { predictions: PredictionData }) {
  const avgConfidence = predictions.hotspots.length > 0 
    ? Math.round(predictions.hotspots.reduce((acc, curr) => acc + curr.confidence, 0) / predictions.hotspots.length * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">AI Forecast</p>
            <p className="text-xl font-bold text-slate-800 mt-1">Active</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg Confidence</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{avgConfidence}%</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Top Features</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{predictions.explainability.global_importance.length}</p>
          </div>
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6 text-teal-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">High Risk Preds</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {predictions.risk_scores.filter(r => r.risk_level === "High").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertOctagon className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionPanel title="Future Trend Forecasting (Next 6 Months)">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictions.trend_forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Area type="monotone" dataKey="crime_count" name="Predicted Crimes" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel title="Explainable AI (Feature Importance)">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictions.explainability.global_importance.slice(0, 5)} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip 
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
                />
                <Bar dataKey="importance" name="Importance Score" radius={[0, 4, 4, 0]} barSize={20}>
                  {predictions.explainability.global_importance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#0ea5e9" : "#14b8a6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionPanel title="Predicted Hotspots">
          <DataTable columns={["district", "crime_count", "confidence", "risk_level"]} rows={predictions.hotspots} />
        </SectionPanel>
        
        <SectionPanel title="Individual Risk Scores">
          <DataTable columns={["fir_id", "district", "crime_type", "risk_score", "risk_level"]} rows={predictions.risk_scores} />
        </SectionPanel>
      </div>
    </div>
  );
}
