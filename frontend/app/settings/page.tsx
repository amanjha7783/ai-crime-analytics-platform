import { DashboardShell } from "@/components/dashboard-shell";
import { SectionPanel } from "@/components/section-panel";

const roles = ["Admin", "Police Officer", "Investigator", "Analyst"];

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-2">
        <SectionPanel title="Role Access">
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role} className="flex items-center justify-between rounded border border-black/10 px-4 py-3">
                <span className="font-medium">{role}</span>
                <span className="rounded bg-signal/10 px-3 py-1 text-sm text-signal">Enabled</span>
              </div>
            ))}
          </div>
        </SectionPanel>
        <SectionPanel title="Deployment Targets">
          <div className="grid gap-3 text-sm">
            <div className="rounded border border-black/10 px-4 py-3">Frontend: Vercel</div>
            <div className="rounded border border-black/10 px-4 py-3">Backend: Render or Railway</div>
            <div className="rounded border border-black/10 px-4 py-3">Database: PostgreSQL + PostGIS</div>
            <div className="rounded border border-black/10 px-4 py-3">Cache: Redis</div>
          </div>
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
