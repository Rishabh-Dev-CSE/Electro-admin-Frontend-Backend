import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPostForm } from "../../utils/api";

export default function AddProduct() {

  /* ================= STATES ================= */
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    stock: "",
    sku: "",
    status: "Active",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  /* ================= FETCH APIs ================= */
  const fetchCategories = async () => {
    try {
      const res = await apiGet("/api/categories/");
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await apiGet("/api/subcategories/");
      setSubCategories(res?.data || []);
    } catch (err) {
      console.error("SubCategory fetch error", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------- Specs ---------- */
  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const updateSpec = (i, field, value) => {
    const copy = [...specs];
    copy[i][field] = value;
    setSpecs(copy);
  };

  const removeSpec = (i) => {
    setSpecs(specs.filter((_, idx) => idx !== i));
  };

  /* ---------- Images ---------- */
  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selected]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img));
    };
  }, [images]);

  /* ================= SUBCATEGORY FILTER ================= */
  const filteredSubCategories = subCategories.filter((s) => {
    const catId =
      typeof s.category === "object" ? s.category.id : s.category;
    return catId === Number(form.category);
  });

  /* ================= SUBMIT PRODUCT ================= */
  const submitProduct = async () => {
    if (!form.name || !form.category || !form.subcategory) {
      alert("Name, Category and SubCategory are required");
      return;
    }

    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value);
    });

    if (specs.some((s) => s.key && s.value)) {
      fd.append("specifications", JSON.stringify(specs));
    }

    images.forEach((img) => {
      fd.append("images", img);
    });

    try {
      const res = await apiPostForm("/api/products/add/", fd);
      alert(res.message);

      // reset form
      setForm({
        name: "",
        category: "",
        subcategory: "",
        brand: "",
        price: "",
        stock: "",
        sku: "",
        status: "Active",
        description: "",
      });
      setImages([]);
      setSpecs([{ key: "", value: "" }]);

    } catch (err) {
      alert(err?.error || err?.message || "Product add failed");
    }
  };


  /* ================= UI ================= */
  return (
    <div className="min-h-screen text-black py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-gray-500">Add New Product</h1>

        <div className="grid grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* BASIC INFO */}
            <div className="bg-white border rounded-md p-6">
              <h2 className="font-semibold mb-4">Product Information</h2>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full border p-3 rounded mb-4"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product description"
                className="w-full border p-3 rounded h-28"
              />
            </div>

            {/* PRICING */}
            <div className="bg-white border rounded-md p-6">
              <h2 className="font-semibold mb-4">Pricing & Inventory</h2>

              <div className="grid grid-cols-3 gap-4">
                <input name="price" type="number" placeholder="Price" onChange={handleChange} value={form.price} required className="border p-3 rounded" />
                <input name="stock" type="number" placeholder="Stock" onChange={handleChange} value={form.stock} required className="border p-3 rounded" />
                <input name="sku" placeholder="SKU" onChange={handleChange} value={form.sku} className="border p-3 rounded" />
              </div>
            </div>

            {/* SPECIFICATIONS */}
            <div className="bg-white border rounded-md p-6">
              <h2 className="font-semibold mb-4">Specifications (Optional)</h2>

              {specs.map((s, i) => (
                <div key={i} className="flex gap-3 mb-3">
                  <input placeholder="Key" value={s.key} onChange={(e) => updateSpec(i, "key", e.target.value)} className="border p-2 w-1/2 rounded" />
                  <input placeholder="Value" value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} className="border p-2 w-1/2 rounded" />
                  <button onClick={() => removeSpec(i)} className="text-red-500">✕</button>
                </div>
              ))}

              <button onClick={addSpec} className="text-blue-600 text-sm">
                + Add Specification
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* CATEGORY */}
            <div className="bg-white border rounded-md p-6">
              <h2 className="font-semibold mb-4">Organization</h2>

              <select name="category" value={form.category} onChange={handleChange} className="w-full border p-3 rounded mb-3">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select name="subcategory" value={form.subcategory} onChange={handleChange} className="w-full border p-3 rounded">
                <option value="">Select SubCategory</option>
                {filteredSubCategories.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div className="bg-white border rounded-md p-6">
              <h2 className="font-semibold mb-4">Status</h2>

              <select name="status" value={form.status} onChange={handleChange} className="w-full border p-3 rounded">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* IMAGES */}
            <div className="bg-white border rounded-md p-6">
              <h2 className="font-semibold mb-4">Product Images</h2>

              <input type="file" multiple accept="image/*" onChange={handleImageChange} />

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative border rounded overflow-hidden">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTION */}
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
