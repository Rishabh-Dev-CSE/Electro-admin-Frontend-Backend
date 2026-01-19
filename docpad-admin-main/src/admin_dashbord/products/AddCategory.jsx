import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete, apiUpdate } from "../../utils/api";
import StatCard from "../dashboard/StatCard";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [newSub, setNewSub] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const totalCategories = categories.length;
  const totalSubCategories = subCategories.length;
  const [activeCategory, setActiveCategory] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  // { type: "category" | "subcategory", id: number }




  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await apiGet("/api/categories/");
      const list = Array.isArray(res) ? res : res?.data || [];
      setCategories(list);
    } catch (err) {
      console.error("CATEGORY FETCH ERROR 👉", err);
    }
  };

  /* ================= FETCH SUBCATEGORIES ================= */
  const fetchSubCategories = async () => {
    try {
      const res = await apiGet("/api/subcategories/");
      const list = Array.isArray(res) ? res : res?.data || [];
      setSubCategories(list);
    } catch (err) {
      console.error("SUBCATEGORY FETCH ERROR 👉", err);
    }
  };

  /* ================= ON LOAD ================= */
  useEffect(() => {
    fetchCategories();
    fetchSubCategories(); // 🔥 THIS WAS MISSING
  }, []);

  /* ================= ADD CATEGORY ================= */
  const addCategory = async () => {
    if (!newCat.trim()) {
      alert("Category name required");
      return;
    }

    try {
      const res = await apiPost("/api/add/category/", { name: newCat });
      alert(res?.message || "Category added successfully");
      setNewCat("");
      fetchCategories();
    } catch (err) {
      alert(err?.message || "Category add failed");
    }
  };

  /* ================= ADD SUB CATEGORY ================= */
  const addSubCategory = async () => {
    if (!newSub.trim() || !selectedCat) {
      alert("Select category & enter sub-category");
      return;
    }

    try {
      const res = await apiPost("/api/subcategories/", {   // ✅ FIXED URL
        name: newSub,
        category: selectedCat,
      });

      alert(res?.message || "Subcategory added successfully");
      setNewSub("");
      fetchSubCategories(); // 🔥 refresh list
    } catch (err) {
      alert(err?.message || "Failed to add subcategory");
    }
  };


  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredSubCategories = activeCategory
    ? subCategories.filter(
      (sub) =>
        sub.category.id === activeCategory.id &&
        sub.name.toLowerCase().includes(subCategorySearch.toLowerCase())
    )
    : [];

  const openMenu = (type, id) => {
    setMenuOpen({ type, id });
  };

  const closeMenu = () => {
    setMenuOpen(null);
  };


  // delete category 

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await apiDelete(`/api/category/delete/${id}/`, {}, "DELETE");
      alert(res?.message || "Category deleted");
      fetchCategories();
      fetchSubCategories();
      setMenuOpen(null);
    } catch (err) {
      alert(err?.message || "Delete failed");
    }
  };

  const deleteSubCategory = async (id) => {
    if (!window.confirm("Delete this sub-category?")) return;

    try {
      const res = await apiDelete(`/api/subcategory/delete/${id}/`, {}, "DELETE");
      alert(res?.message || "SubCategory deleted");
      fetchSubCategories();
      setMenuOpen(null);
    } catch (err) {
      alert(err?.message || "Delete failed");
    }
  };




  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-500 text-sm">
          Manage product categories & sub-categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon="🗂️"
        />

        <StatCard
          title="Total Sub-Categories"
          value={totalSubCategories}
          icon="📁"
        />

        <StatCard
          title="Total Brands"
          value="300"
          icon="🏷️"
        />
      </div>


      {/* FORMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ADD CATEGORY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-4">Add Category</h3>

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Category name"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />

          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>

        {/* ADD SUB CATEGORY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-4">Add Sub-Category</h3>

          <select
            className="w-full border p-3 rounded-lg mb-4"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Sub-category name"
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
          />

          <button
            onClick={addSubCategory}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            Add Sub-Category
          </button>
        </div>
      </div>

      {/* CATEGORY + SUBCATEGORY WINDOWS-STYLE LIST */}
      <div className="bg-[#f3f3f3] p-4 border border-gray-300 shadow-inner flex gap-4">

        {/* LEFT: CATEGORY LIST (Windows Menu Style) */}
        <div className="w-1/3 bg-white border border-gray-300 shadow-sm">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat)}
              className={`relative flex justify-between items-center px-3 py-2 text-sm cursor-pointer
          ${activeCategory?.id === cat.id
                  ? "bg-[#e5f1fb] border-l-4 border-blue-600"
                  : "hover:bg-[#e5f1fb]"
                }`}
            >
              <span className="truncate">{cat.name}</span>

              {/* THREE DOTS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMenu("category", cat.id);
                }}
                className="text-gray-600 hover:text-black px-1"
              >
                ⋮
              </button>

              {/* CATEGORY CONTEXT MENU */}
              {menuOpen?.type === "category" && menuOpen?.id === cat.id && (
                <div
                  onMouseLeave={closeMenu}
                  className="absolute left-full top-0 ml-1 w-44 bg-white border border-gray-300 shadow-lg z-30"
                >
                  <div
                    onClick={() => deleteCategory(cat.id)}
                    className="px-3 py-2 text-sm hover:bg-[#e5f1fb] text-red-600 cursor-pointer"
                  >
                    🗑️ Delete Category
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: SUBCATEGORY PANEL (Windows Sub Menu) */}
        <div className="w-2/3 bg-white border border-gray-300 shadow-sm p-2">
          {activeCategory ? (
            filteredSubCategories.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {filteredSubCategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="relative flex justify-between items-center px-3 py-2 text-sm border border-gray-200 cursor-pointer hover:bg-[#e5f1fb]"
                  >
                    <span className="truncate">{sub.name}</span>

                    {/* THREE DOTS */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMenu("subcategory", sub.id);
                      }}
                      className="text-gray-600 hover:text-black px-1"
                    >
                      ⋮
                    </button>

                    {/* SUBCATEGORY CONTEXT MENU */}
                    {menuOpen?.type === "subcategory" && menuOpen?.id === sub.id && (
                      <div
                        onMouseLeave={closeMenu}
                        className="absolute left-full top-0 ml-1 w-48 bg-white border border-gray-300 shadow-lg z-30"
                      >
                        <div
                          onClick={() => deleteSubCategory(sub.id)}
                          className="px-3 py-2 text-sm hover:bg-[#e5f1fb] text-red-600 cursor-pointer"
                        >
                          🗑️ Delete Sub-Category
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 px-2">
                No sub-categories found
              </p>
            )
          ) : (
            <p className="text-sm text-gray-500 px-2">
              Select a category to view sub-categories
            </p>
          )}
        </div>

      </div>


    </div>
  );
}
