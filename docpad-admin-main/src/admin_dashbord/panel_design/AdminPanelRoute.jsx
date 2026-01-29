import React, { useContext, useState } from "react";
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
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";


const EcomAdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon },
    { name: "Users", path: "/admin/users/list", icon: UserCircleIcon },
    { name: "Categories", path: "/admin/categories/add", icon: ClipboardDocumentCheckIcon },
    { name: "Products", path: "/admin/products", icon: UserGroupIcon },
    { name: "Orders", path: "/admin/orders", icon: DocumentTextIcon },
    { name: "Reports", path: "/admin/reports", icon: DocumentTextIcon },
    { name: "Reviews", path: "/admin/reviews", icon: UsersIcon },
    // { name: "Settings", path: "/admin/settings", icon: Cog6ToothIcon },
  ];

  const active =
    menu.find((m) => location.pathname.startsWith(m.path))?.name || "Dashboard";

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#0B1220] text-gray-200 overflow-hidden">

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed lg:static z-40 h-full w-64
        bg-gradient-to-b from-[#0F172A] to-[#020617]
        border-r border-white/10 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-extrabold tracking-wide
            bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Arthkarya Admin 
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-2.5
                  rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-500" />
                )}
                <Icon className="h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* USER + LOGOUT */}
        <div className="p-4 border-t border-white/10">
          {user && (
            <div className="flex items-center gap-3 mb-4">
              {user.image ? (
                <img
                  src={"http://localhost:8000"+user.image}
                  alt="profile"
                  className="w-10 h-10 rounded-full border border-blue-500/40"
                />
              ) : (
                <UserCircleIcon className="h-10 w-10 text-blue-400" />
              )}

              <div>
                <p className="text-sm font-semibold text-white">
                  {user.username}
                </p>
                <p className="text-xs text-red-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center gap-2
              px-4 py-2 rounded-md text-sm font-medium
              bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between
          bg-white/5 backdrop-blur-xl
          px-4 lg:px-6 py-4 border-b border-white/10">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <h2 className="text-lg font-bold text-white">
              {active}
            </h2>
          </div>

          {user && (
            <p className="hidden sm:block text-sm text-gray-300">
              <span className="text-blue-400 font-semibold">
                Name:- {user.username} <span className="text-red-500"> Role:- {user.role} </span>
              </span>
            
            </p>
          )}
        </header>

        {/* CONTENT */}
        <section className="flex-1 text-black bg-white overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default EcomAdminPanel;
