"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/data-table";

type SearchResult = Record<string, string | number>;

export function SearchConsole() {
  const [query, setQuery] = useState("Bengaluru Urban");
  const [rows, setRows] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function submitSearch() {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`);
      const body = await response.json();
      setRows(body.results ?? []);
      setTotal(body.total ?? 0);
    } catch {
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-11 flex-1 rounded border border-black/10 px-3"
          aria-label="Search query"
        />
        <button
          type="button"
          onClick={submitSearch}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-command px-4 font-semibold text-white"
        >
          <Search aria-hidden="true" size={18} />
          Search
        </button>
      </div>
      <p className="text-sm text-black/60">{loading ? "Searching" : `${total} records matched`}</p>
      <DataTable
        columns={["fir_id", "crime_type", "district", "police_station", "offender_id", "risk_level"]}
        rows={rows}
      />
    </div>
  );
}
