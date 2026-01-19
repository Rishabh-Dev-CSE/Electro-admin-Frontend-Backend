import React from "react";

const STEPS = [
  { key: "Pending", label: "Order Placed" },
  { key: "Accept", label: "Order Accepted" },
  { key: "Packed", label: "Order Packed" },
  { key: "Shipped", label: "Out for Delivery" },
  { key: "Delivered", label: "Delivered" },
];

export default function OrderStatusTracker({ status }) {

  /* ❌ CANCELLED CASE */
  if (status === "Cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 text-xl font-bold mb-2">
          ❌ Order Cancelled
        </div>
        <p className="text-sm text-red-500">
          This order was cancelled by admin
        </p>
      </div>
    );
  }

  /* ✅ DELIVERED SUCCESS CASE */
  if (status === "Delivered") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-green-600 text-xl font-bold mb-2">
          ✅ Order Delivered Successfully
        </div>
        <p className="text-sm text-green-600">
          This order has been delivered to the customer
        </p>
      </div>
    );
  }

  const activeIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">

        {/* BASE LINE */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10" />

        {/* ACTIVE LINE */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 transition-all duration-500"
          style={{
            width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step, index) => {
          const completed = index <= activeIndex;

          return (
            <div key={step.key} className="flex flex-col items-center w-full">
              {/* CIRCLE */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${
                    completed
                      ? "bg-blue-600 text-white scale-110"
                      : "bg-gray-300 text-gray-500"
                  }`}
              >
                {completed ? "✓" : index + 1}
              </div>

              {/* LABEL */}
              <span
                className={`mt-2 text-xs text-center
                  ${completed ? "text-blue-700" : "text-gray-400"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
