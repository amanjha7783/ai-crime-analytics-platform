import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { TrendChart } from "@/components/trend-chart";
import { getPredictions } from "@/lib/api";

export default async function PredictionsPage() {
  const predictions = await getPredictions();

  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionPanel title="Trend Forecasting">
          <TrendChart data={predictions.trend_forecast} />
        </SectionPanel>
        <SectionPanel title="Explainable AI">
          <DataTable columns={["feature", "importance"]} rows={predictions.explainability.global_importance} />
        </SectionPanel>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <SectionPanel title="Hotspot Prediction">
          <DataTable columns={["district", "crime_count", "confidence", "risk_level"]} rows={predictions.hotspots} />
        </SectionPanel>
        <SectionPanel title="Risk Scores">
          <DataTable columns={["fir_id", "district", "crime_type", "risk_score", "risk_level"]} rows={predictions.risk_scores} />
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
