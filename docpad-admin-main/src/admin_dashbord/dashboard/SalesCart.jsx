import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SalesChart({ chart }) {
  const data = {
    labels: chart.labels,
    datasets: [
      {
        label: "Sales (₹)",
        data: chart.data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.45,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 100,                 // 🔥 100 se start
        ticks: {
          stepSize: 100,
          callback: (v) => `₹${v}`,
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <div className="flex justify-between mb-4 ">
        <h2 className="text-lg font-semibold text-black">
          Weekly Sales Analytics
        </h2>
        <span className="text-sm text-gray-400">Last 7 Days</span>
      </div>

      <Line className="text-black bg-black" data={data} options={options} />
    </>
  );
}
