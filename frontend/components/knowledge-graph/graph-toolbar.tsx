import { ZoomIn, ZoomOut, Maximize, GitMerge, ListFilter } from "lucide-react";

export function GraphToolbar() {
  return (
    <div className="absolute left-6 bottom-6 bg-white/90 backdrop-blur shadow-lg rounded-lg border border-slate-200 p-2 flex gap-2 z-40">
      <div className="flex flex-col gap-2 border-r border-slate-200 pr-2">
        <button className="p-2 hover:bg-slate-100 rounded text-slate-700 tooltip-trigger" title="Zoom In">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded text-slate-700" title="Zoom Out">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded text-slate-700" title="Reset View">
          <Maximize className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-2 pl-2">
        <button className="p-2 hover:bg-slate-100 rounded text-slate-700" title="Force Directed Layout">
          <GitMerge className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded text-slate-700" title="Filter Nodes">
          <ListFilter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
