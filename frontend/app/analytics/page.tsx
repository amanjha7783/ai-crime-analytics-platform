import { DashboardShell } from "@/components/dashboard-shell";
import { getDashboard, getPredictions, getSocioEconomic } from "@/lib/api";
import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function AnalyticsPage() {
  const [dashboard, predictions, socioEconomic] = await Promise.all([getDashboard(), getPredictions(), getSocioEconomic()]);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive breakdown of crime statistics, socio-economic factors, and regional distribution.
          </p>
        </div>
        
        <AnalyticsDashboard dashboard={dashboard} predictions={predictions} socioEconomic={socioEconomic} />
      </div>
    </DashboardShell>
  );
}
