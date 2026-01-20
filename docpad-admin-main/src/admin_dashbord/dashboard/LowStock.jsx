export default function LowStock({ items }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="font-semibold text-gray-700 mb-4">
        Low Stock Alerts
      </h3>

      <ul className="space-y-3">
        {items.map((i, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center
                       border rounded-lg p-3 hover:bg-red-50 transition"
          >
            <span className="font-medium text-gray-700">
              {i.name}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold
                             bg-red-100 text-red-700">
              {i.stock} left
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
