import { DashboardShell } from "@/components/dashboard-shell";
import { getNetwork } from "@/lib/api";
import { KnowledgeGraphView } from "@/components/knowledge-graph/knowledge-graph-view";

export default async function NetworkAnalysisPage() {
  // Fetch initial graph data
  const network = await getNetwork();

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Police Intelligence Knowledge Graph</h1>
            <p className="text-muted-foreground">
              Interactive network analysis of {network.nodes?.length || 0} entities and relationships.
            </p>
          </div>
        </div>
        
        {/* Fullscreen Graph Container */}
        <div className="mt-2 -mx-4 sm:-mx-6 lg:-mx-8">
          <KnowledgeGraphView initialData={network} />
        </div>
      </div>
    </DashboardShell>
  );
}
