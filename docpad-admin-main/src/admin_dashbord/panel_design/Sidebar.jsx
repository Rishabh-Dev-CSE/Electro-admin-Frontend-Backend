export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 w-64 bg-white h-full shadow
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4 font-bold text-lg border-b">
          Admin Panel
        </div>

        <nav className="p-4 space-y-3 text-sm">
          <a href="/admin/dashboard" className="block hover:text-blue-600">
            Dashboard
          </a>
          <a href="/admin/orders/pending" className="block hover:text-blue-600">
            Orders
          </a>
        </nav>
      </aside>
    </>
  );
}
