import { DashboardShell } from "@/components/dashboard-shell";
import { LoginPanel } from "@/components/login-panel";
import { SectionPanel } from "@/components/section-panel";

export default function LoginPage() {
  return (
    <DashboardShell>
      <div className="max-w-xl">
        <SectionPanel title="User Authentication">
          <LoginPanel />
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
