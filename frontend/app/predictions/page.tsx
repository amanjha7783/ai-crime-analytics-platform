import { DashboardShell } from "@/components/dashboard-shell";
import { getPredictions } from "@/lib/api";
import { PredictionsDashboard } from "./predictions-dashboard";

export default async function PredictionsPage() {
  const predictions = await getPredictions();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Predictions</h1>
          <p className="text-muted-foreground">
            Machine learning forecasts, hotspot detection, and feature explainability.
          </p>
        </div>
        
        <PredictionsDashboard predictions={predictions} />
      </div>
    </DashboardShell>
  );
}
