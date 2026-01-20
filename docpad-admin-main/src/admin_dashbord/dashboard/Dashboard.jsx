import { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";

import StatCard from "./StatCard";
import SalesChart from "./SalesCart";
import RecentOrders from "./ResentOrders";
import LowStock from "./LowStock";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await apiGet("/api/dashboard/overview/");
      setData(res);
    };
    fetchDashboard();
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6 lg:space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Ecommerce Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Sales, orders & performance overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Orders"
          value={data.stats.total_orders}
          icon="🛒"
        />
        <StatCard
          title="Total Sales"
          value={`₹${data.stats.total_sales.toLocaleString()}`}
          icon="💰"
          type="delivered"
        />
        <StatCard
          title="Customers"
          value={data.stats.customers}
          icon="👤"
        />
        <StatCard
          title="Products"
          value={data.stats.products}
          icon="📦"
        />
        <StatCard
          title="Low Stock"
          value={data.stats.low_stock}
          icon="⚠️"
          type="cancelled"
        />
      </div>

      {/* CHART */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <SalesChart chart={data.chart} />
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 text-black xl:grid-cols-2 gap-6">
        <RecentOrders orders={data.recent_orders} />
        <LowStock items={data.low_stock_products} />
      </div>
    </div>
  );
}
