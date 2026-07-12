import { DashboardShell } from "@/components/dashboard-shell";
import { SectionPanel } from "@/components/section-panel";
import { getReports } from "@/lib/api";

export default async function ReportsPage() {
  const report = await getReports();

  return (
    <DashboardShell>
      <SectionPanel title={report.title}>
        <div className="space-y-5">
          <div className="rounded border border-black/10 bg-black/[0.03] p-4">
            <p className="text-sm font-semibold text-signal">{report.generated_for}</p>
            <p className="mt-2 text-lg leading-7">{report.summary}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {report.sections.map((section: { heading: string; data: unknown }) => (
              <article key={section.heading} className="rounded border border-black/10 p-4">
                <h3 className="font-semibold">{section.heading}</h3>
                <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-black/70">
                  {JSON.stringify(section.data, null, 2)}
                </pre>
              </article>
            ))}
          </div>
        </div>
      </SectionPanel>
    </DashboardShell>
  );
}
