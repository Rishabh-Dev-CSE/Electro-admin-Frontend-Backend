export default function StatCard({ title, value, icon, type = "default" }) {
  const gradients = {
    default: "from-blue-600 to-blue-500",          // Total Orders
    pending: "from-yellow-500 to-yellow-400",      // Pending
    ready: "from-purple-600 to-purple-500",        // Ready to Ship
    shipped: "from-indigo-600 to-indigo-500",      // Shipped
    delivered: "from-green-600 to-green-500",      // Delivered
    cancelled: "from-red-600 to-red-500",          // Cancelled
  };

  return (
    <div
      className={`bg-gradient-to-r ${gradients[type]} rounded-xl p-5 text-white shadow-lg`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
