import { useEffect, useState } from "react";
import { apiGet, apiPostForm } from "../../utils/api";
import SuccessErrorCard from "../../components/Success_Error_model";

export default function AddProduct() {
  /* ================= STATES ================= */
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    sku: "",
    part_number: "",
    category: "",
    subcategory: "",
    description: "",
    short_description: "",
    datasheet_url: "",
    is_active: true,
  });

  const [images, setImages] = useState([]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    apiGet("/api/categories/").then((res) =>
      setCategories(res?.data || [])
    );
    apiGet("/api/subcategories/").then((res) =>
      setSubCategories(res?.data || [])
    );
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------- Specs ---------- */
  const addSpec = () =>
    setSpecs([...specs, { key: "", value: "" }]);

  const updateSpec = (i, field, value) => {
    const copy = [...specs];
    copy[i][field] = value;
    setSpecs(copy);
  };

  const removeSpec = (i) =>
    setSpecs(specs.filter((_, idx) => idx !== i));

  /* ---------- Images ---------- */
  const handleImageChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const removeImage = (i) => {
    setImages(images.filter((_, idx) => idx !== i));
  };

  /* ================= SUBCATEGORY FILTER ================= */
  const filteredSubCategories = subCategories.filter((s) => {
    const catId =
      typeof s.category === "object" ? s.category.id : s.category;
    return catId === Number(form.category);
  });

  /* ================= SUBMIT ================= */
  const submitProduct = async () => {
    if (!form.name || !form.category || !form.subcategory) {
      setModal({
        open: true,
        type: "error",
        message: "Name, Category & SubCategory required",
      });
      return;
    }

    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) =>
      fd.append(k, v)
    );

    fd.append("is_active", form.is_active);

    if (specs.some((s) => s.key && s.value)) {
      fd.append("specifications", JSON.stringify(specs));
    }

    images.forEach((img) => fd.append("images", img));

    try {
      const res = await apiPostForm("/api/products/add/", fd);
      setModal({
        open: true,
        type: "success",
        message: res?.message || "Product added",
      });

      /* RESET */
      setForm({
        name: "",
        price: "",
        stock: "",
        sku: "",
        part_number: "",
        category: "",
        subcategory: "",
        description: "",
        short_description: "",
        datasheet_url: "",
        is_active: true,
      });
      setImages([]);
      setSpecs([{ key: "", value: "" }]);
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err?.message || "Failed",
      });
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen py-10">
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

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-600">
          Add New Product
        </h1>

        <div className="grid grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Product Info */}
            <div className="bg-white border p-6 rounded">
              <h2 className="font-semibold mb-4">
                Product Information
              </h2>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border p-3 rounded mb-3"
              />

              <input
                name="part_number"
                value={form.part_number}
                onChange={handleChange}
                placeholder="Part Number"
                className="w-full border p-3 rounded mb-3"
              />

              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="Short Description"
                className="w-full border p-3 rounded mb-3 h-20"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Full Description"
                className="w-full border p-3 rounded h-32"
              />
            </div>

            {/* Pricing */}
            <div className="bg-white border p-6 rounded">
              <h2 className="font-semibold mb-4">
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  className="border p-3 rounded"
                />
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="border p-3 rounded"
                />
                <input
                  name="sku"
                  placeholder="SKU"
                  value={form.sku}
                  onChange={handleChange}
                  className="border p-3 rounded"
                />
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white border p-6 rounded">
              <h2 className="font-semibold mb-4">
                Specifications
              </h2>

              {specs.map((s, i) => (
                <div key={i} className="flex gap-3 mb-3">
                  <input
                    value={s.key}
                    onChange={(e) =>
                      updateSpec(i, "key", e.target.value)
                    }
                    placeholder="Key"
                    className="border p-2 w-1/2 rounded"
                  />
                  <input
                    value={s.value}
                    onChange={(e) =>
                      updateSpec(i, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="border p-2 w-1/2 rounded"
                  />
                  <button
                    onClick={() => removeSpec(i)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={addSpec}
                className="text-blue-600 text-sm"
              >
                + Add Specification
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Organization */}
            <div className="bg-white border p-6 rounded">
              <h2 className="font-semibold mb-4">
                Organization
              </h2>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-3 rounded mb-3"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="">Select SubCategory</option>
                {filteredSubCategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="bg-white border p-6 rounded">
              <h2 className="font-semibold mb-4">Status</h2>
              <select
                value={form.is_active}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_active: e.target.value === "true",
                  })
                }
                className="w-full border p-3 rounded"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Datasheet */}
            <div className="bg-white border p-6 rounded">
              <h2 className="font-semibold mb-4">Datasheet</h2>
              <input
                name="datasheet_url"
                value={form.datasheet_url}
                onChange={handleChange}
                placeholder="Datasheet URL"
                className="w-full border p-3 rounded"
              />
            </div>

            {/* Images */}
            <div className="bg-white border p-6 rounded">
              <h2 className="font-semibold mb-4">Images</h2>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />

              {images.map((img, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm mt-2"
                >
                  <span>{img.name}</span>
                  <button
                    onClick={() => removeImage(i)}
                    className="text-red-500"
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={submitProduct}
            className="px-8 py-3 bg-blue-600 text-white rounded-md"
          >
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}
