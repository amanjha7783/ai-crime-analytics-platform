import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { getRepeatOffenders } from "@/lib/api";

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
      <SectionPanel title="Repeat Offender Risk Timeline">
        <DataTable columns={["offender_id", "crime_count", "last_seen", "districts", "crime_types", "risk_score"]} rows={rows} />
      </SectionPanel>
    </DashboardShell>
  );
}
