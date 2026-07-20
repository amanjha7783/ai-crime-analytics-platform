import { Suspense } from "react";
import { CrimeMapClient } from "@/components/crime-map-client";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata = {
  title: "Crime Map | AI Crime Analytics",
  description: "Interactive visualization of crime incidents",
};

export default function CrimeMapPage() {
  return (
    <DashboardShell>
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Crime Map</h2>
        </div>
        
        <div className="w-full border rounded-xl shadow-sm relative">
          <Suspense fallback={<div className="w-full h-[600px] flex items-center justify-center">Loading map interface...</div>}>
            <CrimeMapClient />
          </Suspense>
        </div>
      </div>
    </DashboardShell>
  );
}
