import { DashboardShell } from "@/components/dashboard-shell";
import { HeatMapClient } from "@/components/heat-map-client";

export default function HeatmapsPage() {
  return (
    <DashboardShell>
      <HeatMapClient />
    </DashboardShell>
  );
}
