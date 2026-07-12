import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { LeafletCrimeMap } from "@/components/leaflet-crime-map";
import { SectionPanel } from "@/components/section-panel";
import { getCrimes, getHotspots } from "@/lib/api";

export default async function HotspotsPage() {
  const [crimes, hotspots] = await Promise.all([getCrimes(), getHotspots()]);

  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionPanel title="Predicted Hotspot Map">
          <LeafletCrimeMap crimes={crimes} hotspots={hotspots} />
        </SectionPanel>
        <SectionPanel title="Hotspot Confidence">
          <DataTable columns={["district", "crime_count", "confidence", "risk_level"]} rows={hotspots} />
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
