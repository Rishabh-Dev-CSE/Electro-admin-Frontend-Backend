import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  /* ================= FETCH REPORT ================= */
  const fetchReport = async () => {
    const query = new URLSearchParams();
    if (month) query.append("month", month);
    if (year) query.append("year", year);

    const res = await apiGet(`/api/reports/dashboard/?${query}`);
    setDashboard(res);
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const query = new URLSearchParams();
    if (month) query.append("month", month);
    if (year) query.append("year", year);

    window.open(
      `http://localhost:8000/api/reports/export-csv/?${query}`,
      "_blank"
    );
  };

  if (!dashboard) return null;

  const salesData = {
    labels: dashboard.monthly_sales.labels,
    datasets: [
      {
        label: "Sales (₹)",
        data: dashboard.monthly_sales.data,
        backgroundColor: "#3b82f6",
        borderRadius: 10,
      },
    ],
  };

  const revenueData = {
    labels: dashboard.weekly_revenue.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: dashboard.weekly_revenue.data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">

      {/* FILTER BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div className="flex gap-3">
          <select
            className="border px-3 py-2 rounded"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Gross Sales" value={dashboard.kpis.gross_sales} color="blue" />
        <KPICard title="Net Profit" value={dashboard.kpis.net_profit} color="green" />
        <KPICard title="Discount" value={dashboard.kpis.discount} color="yellow" />
        <KPICard title="Tax Collected" value={dashboard.kpis.tax} color="purple" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <Bar
            key={`bar-${month}-${year}`}
            data={salesData}
            options={chartOptions}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <Line
            key={`line-${month}-${year}`}
            data={revenueData}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */
function KPICard({ title, value, color }) {
  const colors = {
    blue: "from-blue-600 to-blue-500",
    green: "from-green-600 to-green-500",
    yellow: "from-yellow-500 to-yellow-400",
    purple: "from-purple-600 to-purple-500",
  };

  return (
    <div className={`bg-gradient-to-r ${colors[color]} text-white p-5 rounded-xl shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold mt-2">
        ₹{Number(value).toLocaleString()}
      </h2>
    </div>
  );
}
