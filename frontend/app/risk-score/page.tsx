import { DashboardShell } from "@/components/dashboard-shell";
import { getPredictions } from "@/lib/api";
import { RiskDashboard } from "./risk-dashboard";

export default async function RiskScorePage() {
  const predictions = await getPredictions();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Risk Assessment</h1>
          <p className="text-muted-foreground">
            Predictive risk scoring and threat level analysis for recorded cases.
          </p>
        </div>
        
        <RiskDashboard data={predictions.risk_scores || []} />
      </div>
    </DashboardShell>
  );
}
