import React, { useContext } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../../module/content/AuthContext";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  UsersIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const EcomAdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon className="h-5 w-5" /> },
    { name: "Users", path: "/admin/users/list", icon: <UserCircleIcon className="h-5 w-5" /> },
    { name: "Categories", path: "/admin/categories/add", icon: <ClipboardDocumentCheckIcon className="h-5 w-5" /> },
    { name: "Products", path: "/admin/products", icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: "Orders", path: "/admin/orders", icon: <DocumentTextIcon className="h-5 w-5" /> },
    { name: "Reports", path: "/admin/reports", icon: <DocumentTextIcon className="h-5 w-5" /> },
    { name: "Reviews", path: "/admin/reviews", icon: <UsersIcon className="h-5 w-5" /> },
    { name: "Settings", path: "/admin/settings", icon: <Cog6ToothIcon className="h-5 w-5" /> },
  ];

  console.log(user)
  const active =
    menu.find((m) => location.pathname.startsWith(m.path))?.name || "Dashboard";

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <h2 className="px-6 py-5 text-xl font-bold border-b bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          Ecom Admin
        </h2>

        {/* MENU */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto" >
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
                ${
                  active === item.name
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                style={{cursor:"pointer"}}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* USER INFO + LOGOUT */}
        <div className="p-4 border-t">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-10 w-10 text-blue-600" />
              )}

              <div>
                <p className="font-semibold text-sm">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600
              text-white rounded-md text-sm"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b shadow-sm">
          <h2 className="font-bold text-lg">{active}</h2>

          {user && (
            <p className="text-sm text-gray-700 font-semibold">
              Logged in as:{" "}
              <span className="text-blue-600">
                {user.username}
              </span>{" "}
              <span className="text-gray-500 text-xs capitalize">
                ({user.role})
              </span>
            </p>
          )}
        </header>

        {/* CONTENT */}
        <section className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default EcomAdminPanel;
