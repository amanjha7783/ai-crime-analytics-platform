import { DashboardShell } from "@/components/dashboard-shell";
import { getCrimes, getHotspots } from "@/lib/api";
import { HotspotsDashboard } from "./hotspots-dashboard";

export default async function HotspotsPage() {
  const [crimes, hotspots] = await Promise.all([getCrimes(), getHotspots()]);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Predictive Hotspot Mapping</h1>
          <p className="text-muted-foreground">
            Geo-spatial intelligence and AI-driven identification of high-risk crime zones.
          </p>
        </div>
        
        <HotspotsDashboard crimes={crimes} hotspots={hotspots} />
      </div>
    </DashboardShell>
  );
}
