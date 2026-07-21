import { DashboardShell } from "@/components/dashboard-shell";
import { getRepeatOffenders } from "@/lib/api";
import { RepeatOffendersDashboard } from "./repeat-offenders-dashboard";

export default async function RepeatOffendersPage() {
  const offenders = await getRepeatOffenders();
  const rows = offenders.map((item) => ({
    offender_id: item.offender_id,
    crime_count: item.crime_count,
    last_seen: item.last_seen,
    districts: item.districts.join(", "),
    crime_types: item.crime_types.join(", "),
    risk_score: item.risk_score
  }));

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Repeat Offenders Tracking</h1>
          <p className="text-muted-foreground">
            Monitor high-risk individuals, their criminal history, and geographical movement.
          </p>
        </div>
        
        <RepeatOffendersDashboard offenders={rows} />
      </div>
    </DashboardShell>
  );
}
