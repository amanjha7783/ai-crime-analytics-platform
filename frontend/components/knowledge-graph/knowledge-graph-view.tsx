"use client";

import React, { useState, useEffect } from "react";
import ForceGraph from "./index";
import { NodeDetailsPanel } from "./node-details-panel";
import { GraphToolbar } from "./graph-toolbar";
import { getNetwork, NetworkData } from "@/lib/api";
import { Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function KnowledgeGraphView({ initialData }: { initialData: NetworkData }) {
  const [data, setData] = useState<NetworkData>(initialData);
  const [selectedNode, setSelectedNode] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNodeClick = async (node: unknown) => {
    setSelectedNode(node);
    
    // Progressive Loading Strategy: Fetch neighbors for this node
    setLoading(true);
    try {
      const moreData = await getNetwork((node as any).id, 200);
      
      // Merge nodes and edges
      const newNodes = [...data.nodes];
      const newEdges = [...data.edges];
      
      moreData.nodes.forEach((n) => {
        if (!newNodes.find(existing => existing.id === n.id)) {
          newNodes.push(n);
        }
      });
      
      moreData.edges.forEach((e) => {
        const edgeId = `${e.source}-${e.target}-${e.type}`;
        const exists = newEdges.find(existing => `${existing.source}-${existing.target}-${existing.type}` === edgeId);
        if (!exists) {
          newEdges.push(e);
        }
      });
      
      setData({ ...data, nodes: newNodes, edges: newEdges });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  // Calculate Node Type Distribution for the Chart
  const typeCounts: Record<string, number> = {};
  data.nodes.forEach(n => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });
  const chartData = Object.keys(typeCounts).map(type => ({
    name: type.replace("_", " ").toUpperCase(),
    count: typeCounts[type]
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] bg-slate-50 overflow-hidden rounded-xl border border-slate-200 shadow-inner">
      {/* Search Bar */}
      <div className="absolute top-6 left-6 right-96 z-40 max-w-lg">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search FIR, Criminal Name, or Vehicle..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </form>
      </div>

      {/* KPI Overlay */}
      <div className="absolute top-6 right-6 z-40 flex gap-4 mr-[400px]">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow border border-slate-200 text-center">
          <div className="text-2xl font-bold text-slate-800">{data.nodes.length}</div>
          <div className="text-xs text-slate-500 uppercase">Total Nodes</div>
        </div>
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow border border-slate-200 text-center">
          <div className="text-2xl font-bold text-slate-800">{data.edges.length}</div>
          <div className="text-xs text-slate-500 uppercase">Relationships</div>
        </div>
      </div>

      {/* Analytics Chart Overlay */}
      <div className="absolute bottom-6 right-6 z-40 bg-white/90 backdrop-blur shadow-lg rounded-xl border border-slate-200 p-4 w-72">
        <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3">Entity Distribution</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading && (
        <div className="absolute top-24 left-6 z-40 bg-blue-500 text-white px-3 py-1 text-sm rounded-full animate-pulse shadow">
          Fetching connections...
        </div>
      )}

      {/* Graph Area */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <ForceGraph 
          data={data} 
          onNodeClick={handleNodeClick} 
        />
      </div>

      {/* Controls & Details */}
      <GraphToolbar />
      <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
