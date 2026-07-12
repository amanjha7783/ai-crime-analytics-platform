import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { TrendChart } from "@/components/trend-chart";
import { getDashboard, getPredictions, getSocioEconomic } from "@/lib/api";

export default async function AnalyticsPage() {
  const [dashboard, predictions, socioEconomic] = await Promise.all([getDashboard(), getPredictions(), getSocioEconomic()]);

  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionPanel title="Crime Trends">
          <TrendChart data={dashboard.trend} />
        </SectionPanel>
        <SectionPanel title="Crime Classification">
          <DataTable
            columns={["district", "predicted_crime_type", "confidence", "average_risk"]}
            rows={predictions.classifications}
          />
        </SectionPanel>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <SectionPanel title="Crime Mix">
          <DataTable columns={["crime_type", "count"]} rows={dashboard.crime_mix} />
        </SectionPanel>
        <SectionPanel title="Socio-Economic Correlation">
          <p className="mb-4 rounded border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black/70">
            {socioEconomic.insight} Correlation: {socioEconomic.correlation}
          </p>
          <DataTable columns={["district", "crime_count", "population_density", "income_category", "risk_score"]} rows={socioEconomic.factors} />
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
