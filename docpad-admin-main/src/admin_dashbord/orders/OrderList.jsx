import { useEffect, useState } from "react";
import { apiGet, apiUpdate } from "../../utils/api";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    const res = await apiGet("/api/orders/");
    const pendingOrders =
      res.data?.filter((o) => o.status === "Pending") || [];
    setOrders(pendingOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE ORDER STATUS ================= */
  const updateOrderStatus = async (orderId, newStatus) => {
    await apiUpdate(`/api/orders/${orderId}/status/`, {
      status: newStatus,
    });
    setOpenMenuId(null);
    fetchOrders();
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4 text-left">Products</th>
            <th className="text-left">Order</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Address</th>
            <th>Status</th>
            <th>Date</th>
            <th className="text-right pr-6">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" className="p-8 text-center text-gray-400">
                No pending orders
              </td>
            </tr>
          )}

          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-t align-top hover:bg-gray-50 transition"
            >
              {/* PRODUCTS */}
              <td className="p-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="h-11 w-11 rounded border bg-white object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </td>

              {/* ORDER */}
              <td className="font-semibold text-gray-800">
                #{order.order_id}
              </td>

              {/* CUSTOMER */}
              <td className="text-gray-700">{order.customer}</td>

              {/* ADDRESS */}
              <td className="max-w-xs text-gray-600">
                <div className="line-clamp-2">{order.address}</div>
              </td>

              {/* STATUS */}
              <td>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  {order.status}
                </span>
              </td>

              {/* DATE */}
              <td className="text-gray-600">{order.date}</td>

              {/* ACTION */}
              <td className="relative text-right pr-6">
                <button
                  className="h-8 w-8 rounded-full hover:bg-gray-200 text-lg"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setMenuPos({ x: r.right, y: r.bottom });
                    setOpenMenuId(
                      openMenuId === order.id ? null : order.id
                    );
                  }}
                >
                  ⋮
                </button>

                {openMenuId === order.id && (
                  <div
                    className="fixed inset-0 z-[9999]"
                    onClick={() => setOpenMenuId(null)}
                  >
                    <div
                      className="fixed w-44 bg-white border rounded-lg shadow-lg"
                      style={{
                        top: menuPos.y + 6,
                        left: menuPos.x - 180,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, "Accept")
                        }
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-blue-600"
                      >
                        ✔ Accept Order
                      </button>

                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, "Cancelled")
                        }
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600"
                      >
                        ✖ Cancel Order
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
