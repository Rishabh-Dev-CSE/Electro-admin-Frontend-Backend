import { useState } from "react";
import AccountingReport from "./AccountingReport";
import OrdersReport from "./OrdersReport";

export default function Reports() {
  const [tab, setTab] = useState("accounting");

  return (
    <div className=" space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>

        <div className="flex bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => setTab("accounting")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "accounting"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Accounting
          </button>

          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === "orders"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {tab === "accounting" ? <AccountingReport /> : <OrdersReport />}
    </div>
  );
}
