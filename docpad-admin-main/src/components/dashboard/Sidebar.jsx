import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMenu,
  FiMap,
  FiShoppingCart,
  FiCreditCard,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const links = [
  { key: "overview", label: "Overview", to: "/restaurant/dashboard", icon: <FiHome /> },
  { key: "menu", label: "Menu", to: "/restaurant/menu", icon: <FiMenu /> },
  { key: "tables", label: "Tables & QR", to: "/restaurant/tables", icon: <FiMap /> },
  { key: "orders", label: "Orders", to: "/restaurant/orders", icon: <FiShoppingCart /> },
  { key: "payments", label: "Payments", to: "/restaurant/payments", icon: <FiCreditCard /> },
  { key: "settings", label: "Settings", to: "/restaurant/settings", icon: <FiSettings /> },
];

export default function Sidebar({ collapsed, onToggle }) {
  const loc = useLocation();

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-[95vh] fixed md:static top-0 left-0 z-40 transition-all duration-200
        ${collapsed ? "w-16" : "w-64"} shadow-sm`}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-md" />
            {!collapsed && <h2 className="font-bold text-lg">QraMg</h2>}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={onToggle}
            className="ml-auto md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="close"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1">
            {links.map((l) => {
              const active = loc.pathname.startsWith(l.to);
              return (
                <li key={l.key}>
                  <Link
                    to={l.to}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg hover:bg-gray-50 transition-colors
                      ${active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"}`}
                  >
                    <span className="text-xl">{l.icon}</span>
                    {!collapsed && <span>{l.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <button className="flex items-center gap-3 w-full text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-md">
            <FiLogOut /> {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
