import { useState } from "react";

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      product: "Men T-Shirt",
      user: "Amit",
      rating: 4,
      comment: "Good quality product",
      status: "pending",
    },
    {
      id: 2,
      product: "Running Shoes",
      user: "Ravi",
      rating: 5,
      comment: "Excellent, very comfortable",
      status: "approved",
    },
  ]);

  const updateStatus = (id, status) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Product Reviews
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Moderate and manage customer feedback
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left font-semibold">Product</th>
              <th className="text-left font-semibold">User</th>
              <th className="text-left font-semibold">Rating</th>
              <th className="text-left font-semibold">Review</th>
              <th className="text-left font-semibold">Status</th>
              <th className="text-center font-semibold w-40">Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {review.product}
                  </td>

                  <td className="text-gray-700">{review.user}</td>

                  {/* RATING */}
                  <td>
                    <div className="flex gap-1 text-yellow-400">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </div>
                  </td>

                  <td className="text-gray-600 max-w-sm">
                    {review.comment}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                        ${
                          review.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : review.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-center space-x-2">
                    <button
                      onClick={() =>
                        updateStatus(review.id, "approved")
                      }
                      disabled={review.status === "approved"}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-green-600 text-white hover:bg-green-700
                                 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(review.id, "rejected")
                      }
                      disabled={review.status === "rejected"}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-red-600 text-white hover:bg-red-700
                                 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500"
                >
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}
