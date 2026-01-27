import { useEffect, useState } from "react";
import { apiGet, apiUpdate } from "../../utils/api";
import OrderDetailsModal from "./OrderDetails";
import { Navigate } from "react-router-dom";

export default function ReadyToShip() {
    const [orders, setOrders] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    /* ================= FETCH ORDERS ================= */
    const fetchOrders = async () => {
        try {
            const res = await apiGet("/api/orders/");
            setOrders(res?.data || []);
        } catch (e) {
            console.error("Fetch failed", e);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    /* ================= UPDATE STATUS ================= */
    const updateStatus = async (orderId, status) => {
        try {
            await apiUpdate(`/api/orders/${orderId}/status/`, { status });
            fetchOrders();
            setOpenMenuId(null);
            window.location.href = "/admin/orders/shipped"
            
        } catch (e) {
            alert("Status update failed");
        }
    };

    /* ================= DOWNLOAD LABEL ================= */
    const downloadLabel = async (orderId, status = "Packed") => {
        try {
            // 1️⃣ Download label (PDF)
            window.open(
                `http://localhost:8000/api/orders/${orderId}/parcel-label/`,
                "_blank"
            );

            // 2️⃣ Update status in backend
            await apiUpdate(`/api/orders/${orderId}/status/`, {
                status,
            });

            // 3️⃣ Refresh orders from backend
            fetchOrders();

        } catch (error) {
            console.error("Label download / status update failed", error);
            alert("Something went wrong while updating order status");
        }
    };


    /* ================= FILTER ================= */
    const filteredOrders = orders.filter(
        (o) => o.status === "Accept" || o.status === "Packed"
    );

    return (
        <div className="bg-white rounded-xl shadow">
            <table className="w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Order ID</th>
                        <th className="text-left">Customer</th>
                        <th className="text-left">Status</th>
                        <th className="text-left">Parcel Label</th>
                        <th className="text-right pr-4">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredOrders.map((o) => (
                        <tr key={o.id} className="border-t hover:bg-gray-50">
                            <td className="p-3 font-semibold">#{o.order_id}</td>
                            <td>{o.customer}</td>

                            <td>
                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                    {o.status}
                                </span>
                            </td>

                            {/* DOWNLOAD LABEL */}
                            <td>
                                <button
                                    onClick={() => downloadLabel(o.id)}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    🏷 Download Label
                                </button>
                            </td>

                            {/* ================= ACTION ================= */}
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
                                            className="fixed bg-white border rounded-xl shadow-xl w-48"
                                            style={{
                                                top: menuPos.y + 6,
                                                left: menuPos.x - 190,
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* VIEW DETAILS */}
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(o);
                                                    setShowDetails(true);
                                                    setOpenMenuId(null);
                                                }}
                                                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                            >
                                                👁 View Details
                                            </button>

                                            {/* MARK AS PACKED */}
                                            {o.status === "Accept" || o.status === "Packed" && (
                                                <button
                                                    onClick={() => updateStatus(o.id, "Shipped")}
                                                    className="block w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-600"
                                                >
                                                    📦 Mark as Packed
                                                </button>
                                            )}


                                            {/* CANCEL */}
                                            <button
                                                onClick={() => updateStatus(o.id, "Cancelled")}
                                                className="block w-full px-4 py-2 text-left hover:bg-red-50 text-red-600"
                                            >
                                                ✖ Cancel Order
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}

                    {!filteredOrders.length && (
                        <tr>
                            <td colSpan="5" className="p-6 text-center text-gray-400">
                                No orders ready to ship
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* DETAILS MODAL */}
            {showDetails && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
}
