import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { SectionPanel } from "@/components/section-panel";
import { getNetwork } from "@/lib/api";

export default async function NetworkAnalysisPage() {
  const network = await getNetwork();

  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionPanel title="Criminal Network Graph">
          <div className="relative h-96 overflow-hidden rounded border border-black/10 bg-[#eef2e8]">
            {network.nodes.slice(0, 10).map((node, index) => (
              <div
                key={node.id}
                className={`absolute flex items-center justify-center rounded-full border-2 border-white px-3 text-xs font-semibold shadow ${
                  node.type === "offender" ? "bg-danger text-white" : "bg-signal text-white"
                }`}
                style={{
                  left: `${18 + (index % 5) * 18}%`,
                  top: `${24 + Math.floor(index / 5) * 38}%`,
                  minWidth: 72,
                  height: 44
                }}
              >
                {node.label}
              </div>
            ))}
          </div>
        </SectionPanel>
        <SectionPanel title="Central Criminals">
          <DataTable columns={["id", "centrality"]} rows={network.central_criminals} />
        </SectionPanel>
      </div>
      <div className="mt-6">
        <SectionPanel title="Detected Relationships">
          <DataTable columns={["source", "target", "type", "weight"]} rows={network.edges} />
        </SectionPanel>
      </div>
    </DashboardShell>
  );
}
