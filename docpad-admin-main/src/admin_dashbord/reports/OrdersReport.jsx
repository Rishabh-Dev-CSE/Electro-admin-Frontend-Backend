import "../../utils/chartConfig";
import { useEffect, useState, useMemo } from "react";
import { apiGet } from "../../utils/api";
import { Line } from "react-chartjs-2";
import ReportFilters from "./ReportFilters";

export default function OrdersReport() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ month: "", year: "" });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const q = `?month=${filters.month}&year=${filters.year}`;
      const res = await apiGet(`/api/reports/orders/dashboard/${q}`);
      setData(res);
    };
    fetchData();
  }, [filters]);

  /* ================= SAFE CHART KEY ================= */
  const chartKey = `${filters.month}-${filters.year}`;

  /* ================= MEMO CHART DATA ================= */
  const chartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.daily_sales.labels,
      datasets: [
        {
          label: "Daily Sales (₹)",
          data: data.daily_sales.data,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.15)",
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: "#2563eb",
        },
      ],
    };
  }, [data]);

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
      x: { grid: { display: false } },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: { callback: (v) => v.toLocaleString() },
      },
    },
  };

  /* ================= DOWNLOAD HANDLERS ================= */
  const downloadCSV = () => {
    const url = `http://localhost:8000/api/reports/orders/export-csv/?month=${filters.month}&year=${filters.year}`;
    window.open(url, "_blank");
  };

  const downloadPDF = () => {
    const url = `http://localhost:8000/api/reports/orders/export-pdf/?month=${filters.month}&year=${filters.year}`;
    window.open(url, "_blank");
  };

  /* ================= LOADING ================= */
  if (!data) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading orders report...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* FILTER + EXPORT */}
      <div className="flex justify-between items-center">
        <ReportFilters filters={filters} setFilters={setFilters} />

        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-gray-800 text-white rounded text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Stat title="Total Orders" value={data.kpis.total_orders} gradient="yellow" />
        <Stat title="Delivered" value={data.kpis.delivered} gradient="green" />
        <Stat title="Pending" value={data.kpis.pending} gradient="purple" />
        <Stat title="Cancelled" value={data.kpis.cancelled} gradient="red" />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Daily Sales Trend</h3>

        <div className="h-[320px]">
          <Line
            key={chartKey}   // 🔥 IMPORTANT: force re-render on filter change
            data={chartData}
            options={chartOptions}
          />
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-6 rounded-xl text-black shadow">
        <h3 className="font-semibold mb-4">Top Products</h3>
        <ul className="space-y-2">
          {data.top_products.map((p, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{p.product_name}</span>
              <span className="font-semibold">{p.qty} sold</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ title, value, gradient }) {
  const gradients = {
    yellow: "from-yellow-600 to-yellow-500",
    purple: "from-purple-600 to-purple-500",
    red: "from-red-600 to-red-500",
    green: "from-green-600 to-green-500",
  };

  return (
    <div
      className={`bg-gradient-to-r ${gradients[gradient]} p-5 rounded-xl shadow-lg text-white`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
