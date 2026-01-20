export default function ReportFilters({ filters, setFilters }) {
  return (
    <div className="flex gap-3 items-center">
      <select
        value={filters.month}
        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Months</option>
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i + 1}>
            {new Date(0, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      <select
        value={filters.year}
        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Years</option>
        {[2024, 2025, 2026].map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
