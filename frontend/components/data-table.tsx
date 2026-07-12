export function DataTable({
  columns,
  rows
}: {
  columns: string[];
  rows: Array<Record<string, string | number>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-black/[0.03] text-left">
            {columns.map((column) => (
              <th key={column} className="px-3 py-3 font-semibold">
                {column.replaceAll("_", " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-black/10">
              {columns.map((column) => (
                <td key={column} className="px-3 py-3 text-black/72">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
