"use client";

import React, { useRef, useEffect, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import * as d3 from "d3-force";

interface GraphData {
  nodes: any[];
  edges: any[];
}

interface ForceGraphProps {
  data: GraphData;
  onNodeClick?: (node: any) => void;
  width?: number;
  height?: number;
}

export default function NoSSRForceGraph({ data, onNodeClick, width, height }: ForceGraphProps) {
  const fgRef = useRef<ForceGraphMethods>();

  useEffect(() => {
    // Add custom collision force to prevent node overlap
    const fg = fgRef.current;
    if (fg) {
      fg.d3Force("collide", d3.forceCollide(20));
      fg.d3Force("charge", d3.forceManyBody().strength(-150));
    }
  }, []);

  const handleNodeClick = useCallback(
    (node: any) => {
      // Center and zoom on node
      if (fgRef.current) {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(4, 2000);
      }
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  return (
    <ForceGraph2D
      ref={fgRef}
      width={width}
      height={height}
      graphData={{ nodes: data.nodes, links: data.edges }}
      nodeId="id"
      nodeLabel="label"
      nodeColor={(node: any) => {
        switch (node.type) {
          case "offender":
            return node.risk_score > 0.7 ? "#ef4444" : "#f97316";
          case "fir":
            return "#3b82f6";
          case "station":
            return "#8b5cf6";
          case "district":
            return "#10b981";
          case "crime_type":
            return "#64748b";
          case "weapon":
            return "#3f3f46";
          default:
            return "#a1a1aa";
        }
      }}
      nodeRelSize={6}
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.label || node.id;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        
        // Draw Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
        
        // Color based on type
        switch (node.type) {
          case "offender": ctx.fillStyle = node.risk_score > 0.7 ? "#ef4444" : "#f97316"; break;
          case "fir": ctx.fillStyle = "#3b82f6"; break;
          case "station": ctx.fillStyle = "#8b5cf6"; break;
          case "district": ctx.fillStyle = "#10b981"; break;
          case "crime_type": ctx.fillStyle = "#64748b"; break;
          case "weapon": ctx.fillStyle = "#3f3f46"; break;
          default: ctx.fillStyle = "#a1a1aa"; break;
        }
        ctx.fill();

        // Draw Text Label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.fillText(label, node.x, node.y + 10 + (2 / globalScale));
      }}
      linkColor={(link: any) => {
        return link.type === "involved_in" ? "#ef4444" : "#94a3b8";
      }}
      linkWidth={(link: any) => (link.type === "involved_in" ? 2 : 1)}
      onNodeClick={handleNodeClick}
      cooldownTicks={100}
      onEngineStop={() => {
        if (fgRef.current) fgRef.current.zoomToFit(400, 20);
      }}
    />
  );
}
