import { DashboardShell } from "@/components/dashboard-shell";
import { SettingsDashboard } from "./settings-dashboard";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Manage your command center configuration, roles, and connected infrastructure.
          </p>
        </div>
        
        <SettingsDashboard />
      </div>
    </DashboardShell>
  );
}
