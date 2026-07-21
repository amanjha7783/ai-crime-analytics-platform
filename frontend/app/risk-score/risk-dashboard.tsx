"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ShieldAlert, Activity, Hash, AlertTriangle } from "lucide-react";

const COLORS = {
  High: "#ef4444",   // Red
  Medium: "#f97316", // Orange
  Low: "#10b981",    // Green
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RiskDashboard({ data }: { data: any[] }) {
  const stats = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    let totalScore = 0;
    const typeScores: Record<string, { total: number, count: number }> = {};
    
    data.forEach((row) => {
      if (row.risk_level === "High") high++;
      else if (row.risk_level === "Medium") medium++;
      else low++;
      
      totalScore += row.risk_score;
      
      if (!typeScores[row.crime_type]) typeScores[row.crime_type] = { total: 0, count: 0 };
      typeScores[row.crime_type].total += row.risk_score;
      typeScores[row.crime_type].count++;
    });

    const averageRisk = data.length ? Math.round(totalScore / data.length) : 0;
    
    const chartData = [
      { name: "High", value: high, color: COLORS.High },
      { name: "Medium", value: medium, color: COLORS.Medium },
      { name: "Low", value: low, color: COLORS.Low }
    ];

    const barData = Object.keys(typeScores)
      .map(type => ({
        name: type,
        avgScore: Math.round(typeScores[type].total / typeScores[type].count)
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    return { high, averageRisk, chartData, barData };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Assessed</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{data.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Hash className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">High Risk Cases</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.high}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Risk Score</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.averageRisk}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionPanel title="Risk Score Distribution">
          <div className="h-72 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "#333", fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-800">{data.length}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase">Cases</span>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Avg Risk by Crime Type">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip 
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
                />
                <Bar dataKey="avgScore" name="Avg Score" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.avgScore > 70 ? "#ef4444" : entry.avgScore > 40 ? "#f97316" : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>
      </div>

      <SectionPanel title="Detailed Risk Assessment">
        <DataTable 
          columns={["fir_id", "district", "crime_type", "risk_score", "risk_level"]} 
          rows={data} 
        />
      </SectionPanel>
    </div>
  );
}
