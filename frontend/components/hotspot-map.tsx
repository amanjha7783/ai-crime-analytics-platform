import type { Hotspot } from "@/lib/api";

export function HotspotMap({ hotspots }: { hotspots: Hotspot[] }) {
  return (
    <div className="map-grid relative h-96 overflow-hidden rounded border border-black/10 bg-[#eef2e8]">
      <div className="absolute left-4 top-4 rounded bg-white/90 px-3 py-2 text-xs font-semibold text-black/70 shadow">
        Karnataka operational grid
      </div>
      {hotspots.map((hotspot, index) => (
        <div
          key={hotspot.district}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${28 + index * 21}%`,
            top: `${34 + (index % 3) * 18}%`
          }}
        >
          <div
            className={`flex items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white shadow-panel ${
              hotspot.risk_level === "High" ? "bg-danger" : "bg-warning"
            }`}
            style={{
              width: `${48 + hotspot.confidence * 52}px`,
              height: `${48 + hotspot.confidence * 52}px`
            }}
          >
            {Math.round(hotspot.confidence * 100)}%
          </div>
          <p className="mt-2 whitespace-nowrap rounded bg-command px-2 py-1 text-xs text-white shadow">{hotspot.district}</p>
        </div>
      ))}
    </div>
  );
}
