import { DashboardShell } from "@/components/dashboard-shell";
import { SearchConsole } from "@/components/search-console";
import { SectionPanel } from "@/components/section-panel";

export default function SearchPage() {
  return (
    <DashboardShell>
      <SectionPanel title="Unified Crime Search">
        <SearchConsole />
      </SectionPanel>
    </DashboardShell>
  );
}
