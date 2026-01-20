import "../../utils/chartConfig";
import { useEffect, useState, useMemo } from "react";
import { apiGet } from "../../utils/api";
import { Line } from "react-chartjs-2";
import ReportFilters from "./ReportFilters";

export default function AccountingReport() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ month: "", year: "" });

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      const q = `?month=${filters.month}&year=${filters.year}`;
      const res = await apiGet(`/api/reports/accounting/dashboard/${q}`);
      setData(res);
    };
    fetchData();
  }, [filters]);

  /* ================= SAFE KEY (FOR CHART RESET) ================= */
  const chartKey = `${filters.month}-${filters.year}`;

  /* ================= MEMOIZED CHART DATA ================= */
  const chartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.monthly_profit.labels,
      datasets: [
        {
          label: "Profit (₹)",
          data: data.monthly_profit.data,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.18)",
          tension: 0.45,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#2563eb",
        },
      ],
    };
  }, [data]);

  /* ================= CHART OPTIONS ================= */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹ ${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
          color: "#6b7280",
        },
      },
    },
  };

  /* ================= SAFE RETURN ================= */
  if (!data) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading accounting report...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* FILTER + EXPORT */}
      <div className="flex justify-between items-center">
        <ReportFilters filters={filters} setFilters={setFilters} />

        <div className="flex gap-2">
          <a
            href={`http://localhost:8000/api/reports/accounting/export-csv/?month=${filters.month}&year=${filters.year}`}
            className="px-3 py-2 bg-gray-800 text-white rounded text-sm"
          >
            Export CSV
          </a>
          <a
            href={`http://localhost:8000/api/reports/accounting/export-pdf/?month=${filters.month}&year=${filters.year}`}
            className="px-3 py-2 bg-red-600 text-white rounded text-sm"
          >
            Export PDF
          </a>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPI title="Gross Sales" value={data.kpis.gross_sales} color="blue" />
        <KPI title="Discount" value={data.kpis.discount} color="yellow" />
        <KPI title="Tax" value={data.kpis.tax} color="purple" />
        <KPI title="Net Profit" value={data.kpis.net_profit} color="green" />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">Monthly Profit Trend</h3>

        <div className="overflow-x-auto">
          <div
            style={{
              width: data.monthly_profit.labels.length * 110,
              height: 320,
            }}
          >
            <Line
              key={chartKey}
              data={chartData}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */
function KPI({ title, value, color }) {
  const map = {
    blue: "from-blue-600 to-blue-500",
    green: "from-green-600 to-green-500",
    yellow: "from-yellow-500 to-yellow-400",
    purple: "from-purple-600 to-purple-500",
  };

  return (
    <div
      className={`bg-gradient-to-r ${map[color]} text-white p-5 rounded-xl shadow`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-xl font-bold mt-1">
        ₹{Number(value).toLocaleString()}
      </h2>
    </div>
  );
}
