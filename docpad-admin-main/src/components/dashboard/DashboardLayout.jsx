import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = () => {
    // collapse for desktop, close for mobile
    if (window.innerWidth >= 768) setCollapsed((s) => !s);
    else setMobileOpen((s) => !s);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
        <Sidebar collapsed={collapsed} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Topbar */}
      <Topbar onToggleSidebar={toggle} />

      {/* Page Content */}
      <main className="pt-4 md:pt-6 px-4 md:px-8 md:ml-64 transition-all">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
