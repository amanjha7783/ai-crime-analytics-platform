import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { getPredictions } from "@/lib/api";

export default async function RiskScorePage() {
  const predictions = await getPredictions();
  const highRisk = predictions.risk_scores.filter((row) => row.risk_level === "High");

  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <SectionPanel title="Risk Score Bands">
          <div className="space-y-4">
            {[
              { label: "High", value: highRisk.length, color: "bg-danger" },
              { label: "Medium", value: predictions.risk_scores.filter((row) => row.risk_level === "Medium").length, color: "bg-warning" },
              { label: "Low", value: predictions.risk_scores.filter((row) => row.risk_level === "Low").length, color: "bg-signal" }
            ].map((band) => (
              <div key={band.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{band.label}</span>
                  <span>{band.value}</span>
                </div>
                <div className="h-2 rounded bg-black/10">
                  <div className={`h-2 rounded ${band.color}`} style={{ width: `${Math.min(100, band.value * 12)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>
        <SectionPanel title="FIR Risk Scores">
          <DataTable columns={["fir_id", "district", "crime_type", "risk_score", "risk_level"]} rows={predictions.risk_scores} />
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
