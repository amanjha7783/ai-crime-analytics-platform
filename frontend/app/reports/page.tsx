import { DashboardShell } from "@/components/dashboard-shell";
import { getReports } from "@/lib/api";
import { ReportsDashboard } from "./reports-dashboard";

export default async function ReportsPage() {
  const report = await getReports();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Intelligence Reports</h1>
          <p className="text-muted-foreground">
            Generate, view, and export detailed intelligence briefs and situation reports.
          </p>
        </div>
        
        <ReportsDashboard report={report} />
      </div>
    </DashboardShell>
  );
}
