import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiDelete, apiUpdate } from "../../utils/api";
import SuccessErrorCard from "../../components/Success_Error_model";

/* ================= TEXT SLICE ================= */
const sliceText = (text, limit = 60) => {
  if (!text) return "-";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

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

  /* ================= FETCH ================= */
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

  /* ================= DELETE ================= */
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

  /* ================= SEARCH ================= */
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen space-y-6">

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
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500 text-sm">Manage your catalog</p>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-blue-600 text-white px-5 py-2 rounded-xl w-fit"
        >
          + Add Product
        </Link>
      </div>

      {/* SEARCH */}
      <input
        className="w-full border px-4 py-3 rounded-lg"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ================= DESKTOP TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left w-[45%]">Product</th>
              <th className="w-[15%]">Category</th>
              <th className="w-[10%]">Price</th>
              <th className="w-[10%]">Stock</th>
              <th className="w-[10%]">Status</th>
              <th className="w-[10%] text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length ? (
              filtered.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  {/* PRODUCT */}
                  <td className="p-4 flex gap-4 items-start">
                    <img
                      src={"https://www.lab.arthkarya.com" + p.image}
                      className="w-12 h-12 rounded-lg object-cover border"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-400">ID: {p.id}</p>

                      <p
                        className="text-xs text-gray-500 mt-1 max-w-[420px] overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {p.description}
                      </p>
                    </div>
                  </td>

                  <td>{p.category?.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="text-center whitespace-nowrap space-x-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setMode("view");
                      }}
                      className="text-blue-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setMode("edit");
                      }}
                      className="text-green-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex gap-3">
              <img
                src={"https://www.lab.arthkarya.com" + p.image}
                className="w-14 h-14 rounded object-cover"
                alt=""
              />
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {sliceText(p.description, 80)}
                </p>
                <p className="text-sm mt-1">₹{p.price}</p>

                <div className="flex gap-4 mt-2 text-sm">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setMode("view");
                    }}
                    className="text-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setMode("edit");
                    }}
                    className="text-green-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
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

/* ================= VIEW MODAL ================= */
function ViewModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3">✕</button>
        <img
          src={"https://www.lab.arthkarya.com" + product.image}
          className="w-full h-48 rounded-lg object-cover mb-3"
          alt=""
        />
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-gray-500">{product.category?.name}</p>
        <p className="text-sm mt-2">{product.description}</p>
        <div className="flex justify-between mt-3 text-sm">
          <span>₹{product.price}</span>
          <span>Stock: {product.stock}</span>
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

  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  const updateProduct = async () => {
    try {
      const res = await apiUpdate(
        `/api/products/update/${product.id}/`,
        form
      );
      setModal({
        open: true,
        type: "success",
        message: res?.message || "Updated successfully",
      });
      onSuccess();
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err?.error || "Update failed",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      {modal.open && (
        <SuccessErrorCard
          type={modal.type}
          title={modal.type}
          message={modal.message}
          buttonText="OK"
          onClick={() => {
            setModal({ open: false, type: "", message: "" });
            if (modal.type === "success") onClose();
          }}
        />
      )}

      <div className="bg-white w-full max-w-md rounded-xl p-6 relative space-y-3">
        <button onClick={onClose} className="absolute top-3 right-3">✕</button>

        <h2 className="text-xl font-bold">Edit Product</h2>

        <input
          className="w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <label className="flex gap-2 text-sm">
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
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
