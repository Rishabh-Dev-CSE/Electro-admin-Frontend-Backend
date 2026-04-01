import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete, apiUpdate, apiPostForm } from "../../utils/api";
import StatCard from "../dashboard/StatCard";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [newSub, setNewSub] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const totalCategories = categories.length;
  const totalSubCategories = subCategories.length;
  const totalBrands = brands.length;
  const [activeCategory, setActiveCategory] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  
  // State for category image
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);

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

  /* ================= FETCH BRANDS ================= */
  const fetchBrands = async () => {
    try {
      const res = await apiGet("/api/brands/");
      const list = Array.isArray(res) ? res : res?.data || [];
      setBrands(list);
    } catch (err) {
      console.error("BRANDS FETCH ERROR 👉", err);
    }
  };

  /* ================= ON LOAD ================= */
  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
  }, []);

  /* ================= ADD CATEGORY WITH IMAGE ================= */
  const addCategory = async () => {
    if (!newCat.trim()) {
      alert("Category name required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newCat);
      if (categoryImage) {
        formData.append("image", categoryImage);
      }

      const res = await apiPostForm("/api/add/category/", formData);
      alert(res?.message || "Category added successfully");
      setNewCat("");
      setCategoryImage(null);
      setCategoryImagePreview(null);
      fetchCategories();
    } catch (err) {
      alert(err?.message || "Category add failed");
    }
  };

  /* ================= UPDATE CATEGORY IMAGE ================= */
  const updateCategoryImage = async (categoryId, imageFile) => {
    if (!imageFile) return;
    
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const res = await apiPostForm(`/api/category/${categoryId}/update-image/`, formData);
      alert(res?.message || "Category image updated successfully");
      fetchCategories();
      setMenuOpen(null);
    } catch (err) {
      alert(err?.message || "Failed to update image");
    }
  };

  /* ================= HANDLE CATEGORY IMAGE SELECTION ================= */
  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCategoryImagePreview(previewUrl);
    }
  };

  /* ================= ADD SUB CATEGORY ================= */
  const addSubCategory = async () => {
    if (!newSub.trim() || !selectedCat) {
      alert("Select category & enter sub-category");
      return;
    }

    try {
      const res = await apiPost("/api/add/subcategories/", {
        name: newSub,
        category: selectedCat,
      });

      alert(res?.message || "Subcategory added successfully");
      setNewSub("");
      fetchSubCategories();
    } catch (err) {
      alert(err?.message || "Failed to add subcategory");
    }
  };

  /*===================== Add Brands ==================== */
  const addNewBrand = async () => {
    if (!newBrand.trim() || !selectedCat) {
      alert("Select category & enter brands name");
      return;
    }

    try {
      const res = await apiPost("/api/add/brand/", {
        name: newBrand,
        category: selectedCat,
      });

      alert(res?.message || "Brand added successfully");
      setNewBrand("");
      fetchBrands();
    } catch (err) {
      alert(err?.message || "Failed to add Brands");
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

  const filteredBrands = activeCategory
    ? brands.filter(
        (brd) =>
          brd.category.id === activeCategory.id &&
          brd.name.toLowerCase().includes(brandSearch.toLowerCase())
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
      fetchBrands();
      setMenuOpen(null);
    } catch (err) {
      alert(err?.message || "Delete failed");
    }
  };

  // delete subcategory
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

  // delete brands
  const deleteBrand = async (id) => {
    if (!window.confirm("Delete this Brand?")) return;

    try {
      const res = await apiDelete(`/api/delete/brand/${id}/`, {}, 'DELETE');
      alert(res?.message);
      fetchBrands();
      setMenuOpen(null);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="min-h-screen text-black space-y-8 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-500 text-sm">
          Manage product categories, sub-categories & brands
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon="🗂️"
          type="pending"
        />
        <StatCard
          title="Total Sub-Categories"
          value={totalSubCategories}
          icon="📁"
        />
        <StatCard
          title="Total Brands"
          value={totalBrands}
          icon="🏷️"
          type="ready"
        />
      </div>

      {/* FORMS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADD CATEGORY WITH IMAGE */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <span className="mr-2">🗂️</span> Add Category
          </h3>

          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Category name *"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleCategoryImageChange}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {categoryImagePreview && (
                <div className="relative">
                  <img 
                    src={categoryImagePreview} 
                    alt="Preview" 
                    className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={() => {
                      setCategoryImage(null);
                      setCategoryImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Recommended: 500x500px, max 2MB</p>
          </div>

          <button
            onClick={addCategory}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
          >
            Add Category
          </button>
        </div>

        {/* ADD SUB CATEGORY */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <span className="mr-2">📁</span> Add Sub-Category
          </h3>

          <select
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Select Category *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Sub-category name *"
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
          />

          <button
            onClick={addSubCategory}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
          >
            Add Sub-Category
          </button>
        </div>

        {/* ADD BRAND */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <span className="mr-2">🏷️</span> Add Brand
          </h3>

          <select
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Select Category *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brand name *"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
          />

          <button
            onClick={addNewBrand}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
          >
            Add Brand
          </button>
        </div>
      </div>

      {/* SEARCH BARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Search categories..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="🔍 Search sub-categories..."
          value={subCategorySearch}
          onChange={(e) => setSubCategorySearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={!activeCategory}
        />
        <input
          type="text"
          placeholder="🔍 Search brands..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={!activeCategory}
        />
      </div>

      {/* CATEGORY + SUBCATEGORY + BRANDS LIST */}
      <div className="bg-[#f3f3f3] p-4 border border-gray-300 shadow-inner flex gap-4 rounded-xl">
        {/* LEFT: CATEGORY LIST */}
        <div className="w-1/3 bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
          <div className="text-center text-xl font-semibold bg-gradient-to-r from-gray-200 to-gray-300 py-3 border-b">
            Categories
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveCategory(cat)}
                className={`relative flex justify-between items-center px-4 py-3 text-sm cursor-pointer border-b border-gray-100 transition-all
                  ${activeCategory?.id === cat.id
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded-lg" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📁</span>
                    </div>
                  )}
                  <span className="truncate font-medium">{cat.name}</span>
                </div>

                {/* THREE DOTS */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openMenu("category", cat.id);
                  }}
                  className="text-gray-600 hover:text-black px-2 py-1 rounded hover:bg-gray-200"
                >
                  ⋮
                </button>

                {/* CATEGORY CONTEXT MENU */}
                {menuOpen?.type === "category" && menuOpen?.id === cat.id && (
                  <div
                    onMouseLeave={closeMenu}
                    className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-300 shadow-xl rounded-lg z-30 overflow-hidden"
                  >
                    <div className="py-1">
                      <label className="block px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer text-gray-700">
                        📷 Update Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              updateCategoryImage(cat.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <div
                        onClick={() => deleteCategory(cat.id)}
                        className="px-4 py-2 text-sm hover:bg-red-50 text-red-600 cursor-pointer border-t"
                      >
                        🗑️ Delete Category
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: SUBCATEGORY PANEL */}
        <div className="w-1/3 bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
          <div className="text-center text-xl font-semibold bg-gradient-to-r from-gray-200 to-gray-300 py-3 border-b">
            Sub-Categories
          </div>
          <div className="max-h-96 overflow-y-auto p-3">
            {activeCategory ? (
              filteredSubCategories.length > 0 ? (
                <div className="space-y-2">
                  {filteredSubCategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="relative flex justify-between items-center px-3 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all"
                    >
                      <span className="truncate">{sub.name}</span>

                      {/* THREE DOTS */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenu("subcategory", sub.id);
                        }}
                        className="text-gray-600 hover:text-black px-2 py-1 rounded hover:bg-gray-200"
                      >
                        ⋮
                      </button>

                      {/* SUBCATEGORY CONTEXT MENU */}
                      {menuOpen?.type === "subcategory" && menuOpen?.id === sub.id && (
                        <div
                          onMouseLeave={closeMenu}
                          className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 shadow-xl rounded-lg z-30 overflow-hidden"
                        >
                          <div
                            onClick={() => deleteSubCategory(sub.id)}
                            className="px-4 py-2 text-sm hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            🗑️ Delete Sub-Category
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No sub-categories found
                </p>
              )
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Select a category to view sub-categories
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: BRANDS PANEL */}
        <div className="w-1/3 bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
          <div className="text-center text-xl font-semibold bg-gradient-to-r from-gray-200 to-gray-300 py-3 border-b">
            Brands
          </div>
          <div className="max-h-96 overflow-y-auto p-3">
            {activeCategory ? (
              filteredBrands.length > 0 ? (
                <div className="space-y-2">
                  {filteredBrands.map((brd) => (
                    <div
                      key={brd.id}
                      className="relative flex justify-between items-center px-3 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all"
                    >
                      <span className="truncate">{brd.name}</span>

                      {/* THREE DOTS */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenu("brands", brd.id);
                        }}
                        className="text-gray-600 hover:text-black px-2 py-1 rounded hover:bg-gray-200"
                      >
                        ⋮
                      </button>

                      {/* BRAND CONTEXT MENU */}
                      {menuOpen?.type === "brands" && menuOpen?.id === brd.id && (
                        <div
                          onMouseLeave={closeMenu}
                          className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 shadow-xl rounded-lg z-30 overflow-hidden"
                        >
                          <div
                            onClick={() => deleteBrand(brd.id)}
                            className="px-4 py-2 text-sm hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            🗑️ Delete Brand
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No brands found
                </p>
              )
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Select a category to view brands
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}