import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { LeafletCrimeMap } from "@/components/leaflet-crime-map";
import { SectionPanel } from "@/components/section-panel";
import { getCrimes, getHotspots } from "@/lib/api";

export default async function CrimeMapPage() {
  const [crimes, hotspots] = await Promise.all([getCrimes(), getHotspots()]);

  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionPanel title="Crime Density Map">
          <LeafletCrimeMap crimes={crimes} hotspots={hotspots} />
        </SectionPanel>
        <SectionPanel title="Map Filters">
          <div className="grid gap-3 text-sm">
            {["District", "Crime Type", "Police Station", "Date Range", "Status", "Year"].map((filter) => (
              <label key={filter} className="grid gap-1">
                <span className="font-medium text-black/70">{filter}</span>
                <select className="rounded border border-black/10 bg-white px-3 py-2">
                  <option>All</option>
                </select>
              </label>
            ))}
          </div>
        </SectionPanel>
      </div>
      <div className="mt-6">
        <SectionPanel title="Geocoded FIR Feed">
          <DataTable columns={["fir_id", "crime_type", "district", "police_station", "status", "risk_level"]} rows={crimes} />
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
