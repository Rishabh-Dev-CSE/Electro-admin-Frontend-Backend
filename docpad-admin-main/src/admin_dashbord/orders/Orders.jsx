import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import StatCard from "../dashboard/StatCard";
import { apiGet } from "../../utils/api";

const orderTabs = [
  { path: "pending", label: "Pending" },
  { path: "ready-to-ship", label: "Ready to Ship" },
  { path: "shipped", label: "Shipped Orders" },
  { path: "delivered", label: "Delivered" },
  { path: "cancelled", label: "Cancelled" },
];

export default function OrdersLayout() {
  const [orders, setOrders] = useState([]);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await apiGet("/api/orders/");
      setOrders(res?.data || []);
    } catch (e) {
      console.error("Fetch failed", e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= COUNTS ================= */
  const totalOrders = orders.length;

  const pendingCount = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const readyToShipCount = orders.filter(
    (o) => o.status === "Accept"
  ).length;

  const shippedCount = orders.filter(
    (o) => o.status === "Shipped"
  ).length;

  const deliveredCount = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const cancelledCount = orders.filter(
    (o) => o.status === "Cancelled"
  ).length;

  return (
    <div className="text-black min-h-screen">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 stat-card">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon="🛒"
          type="default"
        />

        <StatCard
          title="Pending Orders"
          value={pendingCount}
          icon="⏳"
          type="pending"
        />

        <StatCard
          title="Ready To Ship"
          value={readyToShipCount}
          icon="📦"
          type="ready"
        />

        <StatCard
          title="Shipped"
          value={shippedCount}
          icon="🚚"
          type="shipped"
        />

        <StatCard
          title="Cancelled"
          value={cancelledCount}
          icon="❌"
          type="cancelled"
        />

        <StatCard
          title="Delivered"
          value={deliveredCount}
          icon="✔️"
          type="delivered"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-gray-500">Orders</h1>

      {/* ================= TOP TABS ================= */}
      <div className="flex gap-6 border-b bg-white px-4 rounded-t-xl">
        {orderTabs.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            className={({ isActive }) =>
              `py-3 text-sm font-semibold ${isActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      {/* ================= ORDERS CONTENT ================= */}
      <div className="py-3 w-full">
        <Outlet />
      </div>
    </div>
  );
}
