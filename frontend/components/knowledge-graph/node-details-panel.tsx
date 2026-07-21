import { X, ShieldAlert, Folder, MapPin, Target, Hash } from "lucide-react";
import { format } from "date-fns";

interface NodeDetailsPanelProps {
  node: Record<string, unknown> | null;
  onClose: () => void;
}

export function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  if (!node) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/95 backdrop-blur shadow-2xl border-l border-slate-200 z-50 transform transition-transform duration-300 overflow-y-auto">
      <div className="sticky top-0 bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {node.type === "offender" && <Target className="w-5 h-5 text-red-400" />}
          {node.type === "fir" && <Folder className="w-5 h-5 text-blue-400" />}
          {node.type === "district" && <MapPin className="w-5 h-5 text-green-400" />}
          {node.type === "station" && <ShieldAlert className="w-5 h-5 text-purple-400" />}
          {node.type === "crime_type" && <Hash className="w-5 h-5 text-slate-400" />}
          {node.label || node.id}
        </h2>
        <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Risk Score for Offenders */}
        {node.type === "offender" && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Risk Analysis</h3>
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-black ${node.risk_score > 0.7 ? "text-red-600" : "text-orange-500"}`}>
                {Math.round(node.risk_score * 100)}
              </span>
              <span className="text-slate-600 mb-1 font-medium">Risk Score</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on historical pattern analysis and repeat offense probability.
            </p>
          </div>
        )}

        {/* Metadata */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Entity Details</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col">
              <dt className="text-slate-500">ID</dt>
              <dd className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800 break-all">{node.id}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-slate-500">Type</dt>
              <dd className="capitalize font-medium">{node.type.replace("_", " ")}</dd>
            </div>
            {node.risk_level && (
              <div className="flex flex-col">
                <dt className="text-slate-500">Risk Level</dt>
                <dd className="font-medium">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    node.risk_level === "High" ? "bg-red-100 text-red-800" :
                    node.risk_level === "Medium" ? "bg-orange-100 text-orange-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {node.risk_level}
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <button className="w-full bg-slate-900 text-white py-2 rounded-md font-medium hover:bg-slate-800 transition-colors shadow-sm">
            Expand Connections
          </button>
          <button className="w-full mt-2 bg-white text-slate-700 border border-slate-200 py-2 rounded-md font-medium hover:bg-slate-50 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
