"use client";

import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Record<string, string | number>>;
}) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const rowsPerPage = 50;

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const lowerSearch = search.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => String(row[col] || "").toLowerCase().includes(lowerSearch))
    );
  }, [rows, search, columns]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  
  // Ensure we don't end up on an empty page if search changes
  if (page >= totalPages && totalPages > 0) {
    setPage(0);
  }

  const displayedRows = filteredRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleExportCSV = () => {
    if (filteredRows.length === 0) return;
    const headers = columns.join(",");
    const csvRows = filteredRows.map(row => 
      columns.map(col => `"${String(row[col] || '').replace(/"/g, '""')}"`).join(",")
    );
    const csvString = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "fir_records_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search table..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold capitalize whitespace-nowrap">
                  {column.replaceAll("_", " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 text-slate-700">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRows.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            {rows.length === 0 ? "No data available" : "No results found for search"}
          </div>
        )}
      </div>
      
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-4">
          <div>
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
