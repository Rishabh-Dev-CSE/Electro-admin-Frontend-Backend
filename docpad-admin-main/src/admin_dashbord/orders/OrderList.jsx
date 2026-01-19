import { useEffect, useState } from "react";
import { apiGet, apiUpdate } from "../../utils/api";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [hoverAddress, setHoverAddress] = useState(null);


  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    const res = await apiGet("/api/orders/");
    setOrders(res.data || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, newStatus) => {
    await apiUpdate(`/api/orders/${orderId}/status/`, {
      status: newStatus,
    });
    fetchOrders();
    setOpenMenuId(null);
  };

  return (
    <div className="rounded-xl bg-white shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Product</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>QTY</th>
            <th>Address</th>
            <th>Status</th>
            <th>Order Date</th>
            <th className="text-right pr-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders
            .filter((o) => o.status === "Pending")
            .map((o) => {
              const firstItem = o.items?.[0];

              return (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  {/* PRODUCT */}
                  <td className="p-2">
                    <img src={o.product_image} className="h-[10vmin] w-[10vmin] border border-black" alt="" srcset="" />
                  </td>

                  {/* ORDER ID */}
                  <td className="font-semibold">#{o.order_id}</td>

                  {/* CUSTOMER */}
                  <td>{o.customer}</td>

                  {/* QTY */}
                  <td>{o.total_qty}</td>

                  {/* ADDRESS */}
                  <td className="relative max-w-xs">
                    <div
                      className="flex items-center gap-2 truncate cursor-pointer"

                    >
                      {o.address.slice(0, 20)}...
                      <span
                        className="text-blue-600"
                        onMouseEnter={() => setHoverAddress(o.address)}
                        onMouseLeave={() => setHoverAddress(null)}
                      >👁️</span>
                    </div>

                    {/* HOVER CARD */}
                    {hoverAddress === o.address && (
                      <div className="absolute left-40 top-8 z-50 w-[38vmin]
                    bg-white border shadow-xl rounded-lg p-2">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {o.address}
                        </p>
                      </div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                      {o.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td>{o.date}</td>

                  {/* ACTION */}
                  <td className="text-right pr-4 relative">
                    <button
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        setMenuPos({ x: r.right, y: r.bottom });
                        setOpenMenuId(openMenuId === o.id ? null : o.id);
                      }}
                      className="text-xl px-2"
                    >
                      ⋮
                    </button>

                    {openMenuId === o.id && (
                      <div
                        className="fixed inset-0 z-[9999]"
                        onClick={() => setOpenMenuId(null)}
                      >
                        <div
                          className="fixed bg-white border rounded-xl shadow-xl w-40"
                          style={{
                            top: menuPos.y + 6,
                            left: menuPos.x - 160,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* ACCEPT */}
                          <button
                            onClick={() =>
                              updateStatus(o.id, "Accept")
                            }
                            className="block w-full px-4 py-2 text-left hover:bg-blue-50 text-blue-600"
                          >
                            ✔ Accept
                          </button>

                          {/* CANCEL */}
                          <button
                            onClick={() =>
                              updateStatus(o.id, "Cancelled")
                            }
                            className="block w-full px-4 py-2 text-left hover:bg-red-50 text-red-600"
                          >
                            ✖ Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

          {!orders.length && (
            <tr>
              <td colSpan="8" className="p-6 text-center text-gray-400">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
