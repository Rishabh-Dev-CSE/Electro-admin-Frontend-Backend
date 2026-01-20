export default function RecentOrders({ orders }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="font-semibold text-gray-700 mb-4">
        Recent Orders
      </h3>

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-2">Order</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, i) => (
            <tr key={i} className="border-b last:border-none">
              <td className="py-3 font-medium">#{o.order_id}</td>
              <td>{o.customer}</td>
              <td className="font-semibold">₹{o.amount}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      o.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : o.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : o.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
