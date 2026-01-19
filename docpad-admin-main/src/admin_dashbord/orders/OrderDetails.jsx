import OrderStatusTracker from "./OrderTracker";
export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[720px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          Order #{order.order_id}
        </h2>

        {/* TRACKER */}
        <OrderStatusTracker status={order.status} />

        {/* CUSTOMER */}
        <div className="grid grid-cols-2 gap-4 text-sm mt-6">
          <p><b>Customer:</b> {order.customer}</p>
          <p><b>Email:</b> {order.customer_email}</p>
          <p><b>Payment:</b> {order.payment_status}</p>
          <p><b>Status:</b> {order.status}</p>
          <p className="col-span-2">
            <b>Address:</b> {order.address}
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Products</h3>

          {order.items.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>{i.product_name}</span>
              <span>
                {i.quantity} × ₹{i.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
