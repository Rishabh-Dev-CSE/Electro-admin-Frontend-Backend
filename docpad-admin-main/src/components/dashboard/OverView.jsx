import React from "react";
import DashboardLayout from "./DashboardLayout";
import { FiTrendingUp, FiClock, FiCheckCircle } from "react-icons/fi";

const stats = [
  { title: "Today Revenue", value: "₹12,450", icon: <FiTrendingUp className="text-2xl text-blue-600" /> },
  { title: "Active Orders", value: 8, icon: <FiClock className="text-2xl text-yellow-500" /> },
  { title: "Orders Completed", value: 156, icon: <FiCheckCircle className="text-2xl text-green-500" /> },
];

const recentOrders = [
  { id: "ORD-1023", table: "T3", items: 3, total: "₹540", time: "2m ago", status: "preparing" },
  { id: "ORD-1022", table: "T1", items: 2, total: "₹340", time: "7m ago", status: "ready" },
  { id: "ORD-1021", table: "T5", items: 1, total: "₹120", time: "15m ago", status: "served" },
];

export default function OverviewPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>{s.icon}</div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{s.title}</div>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-3 font-medium">Revenue (Last 7 days)</div>
            <div className="h-48 flex items-center justify-center text-gray-400">
              {/* Replace with a chart component (Recharts/Chart.js) */}
              <div>Chart placeholder — integrate Recharts here</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Orders</h3>
              <button className="text-sm text-blue-600">View all</button>
            </div>

            <ul className="space-y-3">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{o.id} • Table {o.table}</div>
                    <div className="text-xs text-gray-500">{o.items} items • {o.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{o.total}</div>
                    <div className="text-xs text-gray-500">{o.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
