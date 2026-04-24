// Banner.jsx
import React, { useEffect, useState } from "react";
import { apiGet, apiDelete, apiPost } from "../../utils/api";
import SuccessErrorCard from "../../components/Success_Error_model";

const BASE_IMG = "https://electro-admin-frontend-backend-k4c5.onrender.com";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  const fetchBanners = async () => {
    try {
      const res = await apiGet("/api/get/banner/");
      console.log("Fetched banners:", res);
      setBanners(res?.banners || res?.data || []);
    } catch (err) {
      console.error("Fetch banners error:", err);
      setModal({
        open: true,
        type: "error",
        message: err?.error || "Failed to fetch banners",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await apiGet("/api/products/");
      console.log("Fetched products:", res);
      setProducts(res?.data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  const deleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      const res = await apiDelete(`/api/banner/delete/${id}/`);
      console.log("Delete response:", res);
      setModal({
        open: true,
        type: "success",
        message: res?.message || "Banner deleted successfully",
      });
      fetchBanners();
    } catch (err) {
      console.error("Delete error:", err);
      setModal({
        open: true,
        type: "error",
        message: err?.error || "Failed to delete banner",
      });
    }
  };

  const filtered = banners.filter((b) =>
    b.category?.toLowerCase().includes(search.toLowerCase()) ||
    b.subcategory?.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      {modal.open && (
        <SuccessErrorCard
          type={modal.type}
          title={modal.type === "success" ? "Success" : "Error"}
          message={modal.message}
          buttonText="OK"
          onClick={() => setModal({ open: false, type: "", message: "" })}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sale Banners</h1>
          <p className="text-gray-500 mt-1">Manage your promotional banners</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition text-white px-6 py-2.5 rounded-xl shadow-lg"
        >
          + Create Banner
        </button>
      </div>

      <div className="relative">
        <input
          className="w-full bg-white border border-gray-200 shadow-sm px-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Search by category, subcategory or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-5 text-left">Image</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((banner) => (
                <tr key={banner.id} className="border-b last:border-none hover:bg-gray-50 transition">
                  <td className="p-5">
                    <img
                      src={BASE_IMG + banner.image}
                      className="w-16 h-16 rounded-xl object-cover shadow-sm"
                      alt={banner.category}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                  </td>
                  <td className="font-semibold text-gray-800">{banner.category || "N/A"}</td>
                  <td className="text-gray-600">{banner.subcategory || "N/A"}</td>
                  <td className="text-gray-600 max-w-md">
                    {banner.description?.length > 60 ? banner.description.slice(0, 60) + "..." : banner.description}
                  </td>
                  <td className="text-center space-x-3">
                    <button onClick={() => setSelectedBanner(banner)} className="text-blue-600 hover:underline">
                      View
                    </button>
                    <button onClick={() => deleteBanner(banner.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateBannerModal
          products={products}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchBanners}
          setModal={setModal}
        />
      )}

      {selectedBanner && (
        <ViewBannerModal banner={selectedBanner} onClose={() => setSelectedBanner(null)} />
      )}
    </div>
  );
}

/* ================= CREATE BANNER MODAL ================= */
function CreateBannerModal({ products, onClose, onSuccess, setModal }) {
  const [form, setForm] = useState({
    product_id: "",
    description: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetails(null);

    // Prepare payload
    const payload = {
      product_id: parseInt(form.product_id),
      description: form.description,
      is_active: form.is_active
    };

    console.log("Sending payload:", payload);
    console.log("To endpoint: /api/banner/create/");

    try {
      const res = await apiPost("/api/banner/create/", payload);
      console.log("Create response:", res);
      
      setModal({
        open: true,
        type: "success",
        message: res?.message || "Banner created successfully",
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create error FULL:", err);
      console.error("Error response:", err?.response);
      console.error("Error data:", err?.response?.data);
      
      // Show detailed error
      setErrorDetails(err);
      setModal({
        open: true,
        type: "error",
        message: err?.error || err?.message || "Failed to create banner. Check console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === parseInt(form.product_id));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg z-10"
        >
          ✕
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Banner</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product *
              </label>
              <select
                required
                value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Select a product --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price} (ID: {product.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Preview */}
            {selectedProduct && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Product:</p>
                <div className="flex gap-4">
                  {selectedProduct.image && (
                    <img
                      src={BASE_IMG + selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-600">ID: {selectedProduct.id}</p>
                    <p className="text-sm text-green-600 font-medium">₹{selectedProduct.price}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                rows="3"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter banner description (e.g., Big Sale Today, 50% Off, etc.)"
                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                Active (Show on website)
              </label>
            </div>

            {/* Error Details (for debugging) */}
            {errorDetails && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 font-medium">Error Details:</p>
                <pre className="text-xs text-red-600 mt-1 overflow-auto">
                  {JSON.stringify(errorDetails, null, 2)}
                </pre>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !form.product_id}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition text-white py-3 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Banner"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= VIEW BANNER MODAL ================= */
function ViewBannerModal({ banner, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg z-10"
        >
          ✕
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Banner Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Banner Image</label>
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={BASE_IMG + banner.image}
                  alt={banner.category}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Banner ID</label>
                <p className="font-mono text-gray-800 mt-1">{banner.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Category</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">{banner.category || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Subcategory</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">{banner.subcategory || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="text-gray-700 mt-1 leading-relaxed">{banner.description || "No description"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 transition text-gray-800 py-2.5 rounded-xl">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}