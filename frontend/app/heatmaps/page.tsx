import { DashboardShell } from "@/components/dashboard-shell";
import { LeafletCrimeMap } from "@/components/leaflet-crime-map";
import { SectionPanel } from "@/components/section-panel";
import { getCrimes, getHotspots } from "@/lib/api";

export default async function HeatmapsPage() {
  const [crimes, hotspots] = await Promise.all([getCrimes(), getHotspots()]);

  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionPanel title="Crime Heatmap">
          <LeafletCrimeMap crimes={crimes} hotspots={hotspots} />
        </SectionPanel>
        <SectionPanel title="Heatmap Layers">
          <div className="space-y-3 text-sm">
            {["Crime Density", "Hotspot Confidence", "Police Station Radius", "Repeat Offender Activity"].map((layer) => (
              <label key={layer} className="flex items-center justify-between rounded border border-black/10 px-4 py-3">
                <span>{layer}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </label>
            ))}
          </div>
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
