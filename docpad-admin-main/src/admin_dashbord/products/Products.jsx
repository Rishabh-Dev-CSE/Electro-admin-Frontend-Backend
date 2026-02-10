import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiDelete, apiUpdate } from "../../utils/api";
import SuccessErrorCard from "../../components/Success_Error_model";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mode, setMode] = useState("");

  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await apiGet("/api/products/");
      setProducts(res?.data || []);
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err?.error || "Failed to fetch products",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const res = await apiDelete(`/api/products/delete/${id}/`);
      setModal({
        open: true,
        type: "success",
        message: res?.message || "Product deleted successfully",
      });
      fetchProducts();
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err?.error || "Failed to delete product",
      });
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">

      {modal.open && (
        <SuccessErrorCard
          type={modal.type}
          title={modal.type === "success" ? "Success" : "Error"}
          message={modal.message}
          buttonText="OK"
          onClick={() =>
            setModal({ open: false, type: "", message: "" })
          }
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage your catalog easily</p>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition text-white px-6 py-2.5 rounded-xl shadow-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <input
          className="w-full bg-white border border-gray-200 shadow-sm px-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-5 text-left">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="p-5 flex gap-4 items-center">
                    <img
                      src={"https://electro-admin-frontend-backend.onrender.com" + p.image}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {p.name.length > 60
                          ? p.name.slice(0, 60) + "..."
                          : p.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ID: {p.id}
                      </p>
                    </div>
                  </td>

                  <td className="text-gray-600">{p.category?.name}</td>
                  <td className="font-medium text-gray-800">₹{p.price}</td>
                  <td>{p.stock}</td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${p.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="text-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setMode("view");
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setMode("edit");
                      }}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mode === "view" && selectedProduct && (
        <ViewModal product={selectedProduct} onClose={() => setMode("")} />
      )}

      {mode === "edit" && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setMode("")}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}

/* ================= PREMIUM VIEW MODAL ================= */
function ViewModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      {/* MODAL CONTAINER */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">

          {/* LEFT SIDE - IMAGE */}
          <div className="flex flex-col items-center">

            <div className="w-full h-[320px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={"https://www.lab.arthkarya.com" + product.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Optional small preview (if later you add multiple images) */}
            <div className="flex gap-3 mt-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={"https://www.lab.arthkarya.com" + product.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - DETAILS */}
          <div className="flex flex-col justify-center">

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name.slice(0,100)}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {product.category?.name}
            </p>

            <div className="text-2xl font-semibold text-gray-900 mb-4">
              ₹{product.price}
            </div>

            {/* STOCK BADGE */}
            <div className="mb-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${product.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                  }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* DESCRIPTION (if available) */}
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description.slice(0,100)}...
              </p>
            )}

            {/* EXTRA INFO SECTION */}
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p><strong>Product ID:</strong> {product.id}</p>
              <p>
                <strong>Status:</strong>{" "}
                {product.is_active ? "Active" : "Inactive"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= EDIT MODAL ================= */
function EditProductModal({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    is_active: product.is_active,
  });

  const updateProduct = async () => {
    await apiUpdate(`/api/products/update/${product.id}/`, form);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[450px] rounded-2xl p-6 shadow-2xl relative space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>

        <input
          className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.checked })
            }
          />
          Active
        </label>

        <button
          onClick={updateProduct}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition text-white py-2.5 rounded-xl shadow-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
