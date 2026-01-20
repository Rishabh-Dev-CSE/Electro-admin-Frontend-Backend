import { useEffect, useState } from "react";
import { apiGet, apiUpdate } from "../../utils/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  /* ================= FETCH REVIEWS ================= */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/api/admin/reviews/");

      // 🔥 FILTER: only pending & rejected
      const filtered = (res.data || []).filter(
        r => r.status !== "approved"
      );

      setReviews(filtered);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await apiUpdate(`/api/admin/reviews/${id}/status/`, { status });

      // 🔥 Remove review after approve / reject
      setReviews(prev => prev.filter(r => r.id !== id));

    } catch (err) {
      console.error("Failed to update status", err);
      fetchReviews(); // fallback
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 text-black">
      <h2 className="text-xl font-bold mb-4">Product Reviews</h2>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Product</th>
              <th className="p-2">User</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Comment</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No pending reviews 🎉
                </td>
              </tr>
            ) : (
              reviews.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.product}</td>
                  <td className="p-2">{r.user}</td>
                  <td className="p-2 text-yellow-500">
                    {"★".repeat(r.rating)}
                  </td>
                  <td className="p-2">{r.comment}</td>
                  <td className="p-2 capitalize">{r.status}</td>
                  <td className="p-2 space-x-2">
                    <button
                      disabled={updatingId === r.id}
                      onClick={() => updateStatus(r.id, "approved")}
                      className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      disabled={updatingId === r.id}
                      onClick={() => updateStatus(r.id, "rejected")}
                      className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
