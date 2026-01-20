import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPost, apiDelete } from "../../utils/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mode, setMode] = useState(""); // view | edit

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await apiGet("/api/products/");
      setProducts(res?.data || []);
    } catch (err) {
      console.error("Product fetch error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiDelete(`/api/products/delete/${id}/`, {}, "DELETE");
      alert("Product deleted");
      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= SEARCH ================= */
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-black space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize your ecommerce catalog
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow">
        <input
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="text-left">Category</th>
              <th className="text-left">Price</th>
              <th className="text-left">Stock</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">

                  {/* PRODUCT */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={"http://localhost:8000" + p.image}
                      className="w-12 h-12 rounded-lg object-cover border"
                      alt={p.name}
                    />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-500">ID: {p.id}</p>
                    </div>
                  </td>

                  <td>{p.category?.name}</td>

                  <td className="font-semibold">
                    ₹{Number(p.price).toLocaleString()}
                  </td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${p.stock < 5
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"}`}
                    >
                      {p.stock}
                    </span>
                  </td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${p.is_active
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"}`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-center">
                    <div className="flex justify-center gap-3">
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {mode === "view" && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6 relative">

            <button
              onClick={() => setMode("")}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <img
              src={"http://localhost:8000" + selectedProduct.image}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
            <p className="text-gray-500 text-sm mb-3">
              {selectedProduct.category?.name}
            </p>

            <div className="space-y-2 text-sm">
              <p><b>Price:</b> ₹{selectedProduct.price}</p>
              <p><b>Stock:</b> {selectedProduct.stock}</p>
              <p>
                <b>Status:</b>{" "}
                <span className={`px-2 py-1 rounded-full text-xs
                  ${selectedProduct.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"}`}
                >
                  {selectedProduct.is_active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
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

/* ================= EDIT MODAL COMPONENT ================= */
function EditProductModal({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    is_active: product.is_active,
  });

  const updateProduct = async () => {
    try {
      await apiPost(`/api/products/update/${product.id}/`, form);
      alert("Product updated");
      onSuccess();
      onClose();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6 relative space-y-4">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold">Edit Product</h2>

        <input
          className="w-full border px-4 py-2 rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          className="w-full border px-4 py-2 rounded-lg"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          className="w-full border px-4 py-2 rounded-lg"
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
