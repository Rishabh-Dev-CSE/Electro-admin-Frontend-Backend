import StatCard from "./StatCard";
import SalesChart from "./SalesCart";
import RecentOrders from "./ResentOrders";
import LowStock from "./LowStock";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Ecommerce Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Sales, orders & performance overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Orders" value="12,450" icon="🛒" />
        <StatCard title="Total Sales" value="₹8,45,230" icon="💰" />
        <StatCard title="Customers" value="4,820" icon="👤" />
        <StatCard title="Products" value="1,280" icon="📦" />
        <StatCard title="Low Stock" value="23" icon="⚠️" className="text-red-500" />
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <SalesChart />
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentOrders />
        <LowStock />
      </div>

    </div>
  );
}
