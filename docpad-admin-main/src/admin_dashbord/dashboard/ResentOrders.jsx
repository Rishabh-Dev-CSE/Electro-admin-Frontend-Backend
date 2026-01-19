export default function RecentOrders() {
  const orders = [
    { id: "#1023", name: "Rahul Sharma", amount: "₹4,200", status: "Delivered" },
    { id: "#1024", name: "Amit Verma", amount: "₹1,250", status: "Pending" },
    { id: "#1025", name: "Sneha Patel", amount: "₹9,800", status: "Shipped" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="font-semibold text-gray-700 mb-4">Recent Orders</h3>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Order</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              <td className="py-3 font-medium">{o.id}</td>
              <td>{o.name}</td>
              <td className="font-semibold">{o.amount}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      o.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : o.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
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
