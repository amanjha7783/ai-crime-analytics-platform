"use client";

import { useRef, useEffect, useState } from "react";

// Using dynamic import inside the parent page is usually better for SSR,
// but we'll try to require it conditionally here.
export default function ForceDirectedGraph({ data }: { data: any }) {
  const fgRef = useRef<any>();
  const [ForceGraph2D, setForceGraph2D] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to prevent SSR issues with canvas
    import("react-force-graph-2d").then((module) => {
      setForceGraph2D(() => module.default);
    });
  }, []);

  if (!ForceGraph2D) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f4f7f6]">
        <div className="animate-spin text-teal-700">Loading Network Physics Engine...</div>
      </div>
    );
  }

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      nodeLabel="label"
      nodeColor={(node: any) => `hsl(${(node.gang_id * 137.5) % 360}, 70%, 50%)`}
      nodeVal="val"
      linkColor={() => "#cbd5e1"}
      linkWidth={(link: any) => Math.min(link.weight, 5)}
      onEngineStop={() => {
        if (fgRef.current) {
          fgRef.current.zoomToFit(400, 20);
        }
      }}
      cooldownTicks={100}
      backgroundColor="#f4f7f6"
    />
  );
}
