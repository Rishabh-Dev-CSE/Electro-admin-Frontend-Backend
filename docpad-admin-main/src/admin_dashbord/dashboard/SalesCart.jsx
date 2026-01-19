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

export default function SalesChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales (₹)",
        data: [12000, 19000, 14000, 22000, 26000, 31000, 28000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.45,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: "#e5e7eb" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Weekly Sales Analytics
        </h2>
        <span className="text-sm text-gray-500">Last 7 Days</span>
      </div>

      <Line data={data} options={options} />
    </>
  );
}
