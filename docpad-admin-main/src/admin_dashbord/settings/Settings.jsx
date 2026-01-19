import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { path: "general", label: "General" },
  { path: "payment", label: "Payments" },
  { path: "shipping", label: "Shipping" },
  { path: "tax", label: "Tax" },
  { path: "orders", label: "Orders" }, 
  { path: "notifications", label: "Notifications" },
  { path: "security", label: "Security" },
  { path: "roles", label: "Roles & Permissions" },
];

export default function SettingsLayout() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="flex gap-6">
        <aside className="w-64 bg-white rounded-xl shadow p-4">
          {tabs.map((t) => (
            <NavLink
              key={t.path}
              to={t.path}
              className={({ isActive }) =>
                `block px-4 py-2 mb-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </aside>

        <main className="flex-1 bg-white rounded-xl shadow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
