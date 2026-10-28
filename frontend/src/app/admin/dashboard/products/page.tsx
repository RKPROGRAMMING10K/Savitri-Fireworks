"use client";

import React, { useState, useEffect, useCallback } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/notifications";
import { productService } from "@/services/products/productService";
import { categoryService } from "@/services/categories/categoryService";
import { ProductDto } from "@/services/products/dto/product.dto";
import { CategoryDto } from "@/services/categories/dto/category.dto";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // New product form states
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategoryId, setNewProductCategoryId] = useState("");
  const [newProductShortDesc, setNewProductShortDesc] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // New category form states
  const [newCatName, setNewCatName] = useState("");
  const [newCatPrefix, setNewCatPrefix] = useState("");
  const [newCatParentId, setNewCatParentId] = useState("");
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  // 1. Fetch Categories dynamically on mount
  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
      // Set default selected category id for the add modal
      if (data && data.length > 0) {
        const firstWithChild = data.find((c) => c.children && c.children.length > 0);
        if (firstWithChild && firstWithChild.children && firstWithChild.children[0]) {
          setNewProductCategoryId(firstWithChild.children[0].id);
        } else {
          setNewProductCategoryId(data[0].id);
        }
      }
    } catch (err: any) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  // 2. Fetch Products dynamically from Backend API
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts({
        category: activeCategory !== "All" ? activeCategory : undefined,
        search: searchTerm.trim() || undefined,
      });
      setProducts(res.items || []);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      showErrorToast("Load Failed", err.message || "Failed to fetch catalog products.");
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductCategoryId) {
      showErrorToast("Validation Error", "Please provide product title and select a category.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", newProductName);
      formData.append("categoryId", newProductCategoryId);
      formData.append("shortDesc", newProductShortDesc);
      formData.append("description", newProductDesc);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const created = await productService.createProduct(formData);
      showSuccessToast(
        "Product Added",
        `"${created.name}" saved with SKU code ${created.code}.`
      );

      // Reset Form states
      setNewProductName("");
      setNewProductShortDesc("");
      setNewProductDesc("");
      setSelectedFile(null);
      setImagePreview("");
      setIsAddModalOpen(false);

      // Reload products
      await loadProducts();
    } catch (err: any) {
      showErrorToast("Error Creating Product", err.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showErrorToast("Validation Error", "Please provide category name.");
      return;
    }

    setIsCategorySubmitting(true);
    try {
      const created = await categoryService.createCategory({
        name: newCatName.trim(),
        codePrefix: newCatPrefix.trim() ? newCatPrefix.trim().toUpperCase() : undefined,
        parentId: newCatParentId.trim() ? newCatParentId : undefined,
      });

      showSuccessToast(
        "Category Created",
        `Category "${created.name}" created successfully.`
      );

      setNewCatName("");
      setNewCatPrefix("");
      setNewCatParentId("");
      setIsAddCategoryModalOpen(false);

      await loadCategories();
    } catch (err: any) {
      showErrorToast("Category Creation Failed", err.message || "Failed to create category.");
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteProduct = async (p: ProductDto) => {
    if (!confirm(`Are you sure you want to delete "${p.name}" (${p.code})?`)) {
      return;
    }

    try {
      await productService.deleteProduct(p.id);
      showSuccessToast("Product Deleted", `"${p.name}" has been removed from catalog database.`);
      await loadProducts();
    } catch (err: any) {
      showErrorToast("Delete Failed", err.message || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up">
      {/* Visual Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            Catalog <span className="text-orange-500 font-black">Management</span>
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Configure, update, or append items to the fireworks showcase catalog
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-3.5 sm:px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white rounded-2xl transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span>New Category</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-3.5 sm:px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
              <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.25H18a.75.75 0 010 1.5h-7.25V18a.75.75 0 01-1.5 0v-7.25H2a.75.75 0 010-1.5h7.25V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
            </svg>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with Dynamic Categories */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 bg-zinc-900/50 p-3 sm:p-4 border border-zinc-800/80 rounded-3xl backdrop-blur-sm">
        <div className="max-w-full overflow-x-auto scrollbar-hide py-0.5">
          <div className="inline-flex border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 select-none text-[10px] font-black uppercase tracking-wider">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-3 py-2.5 transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === "All"
                  ? "bg-orange-500 text-white font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug || cat.name)}
                className={`px-3 py-2.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.slug || activeCategory === cat.name
                    ? "bg-orange-500 text-white font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search code, category or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
          <div className="h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Loading Catalog...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <div
              key={p.id}
              className="relative group bg-zinc-900 border border-zinc-800 rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between overflow-hidden"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/5 blur-2xl rounded-full transition-all group-hover:bg-orange-500/10 pointer-events-none" />

              <div>
                {/* Product Image Area */}
                <div className="relative h-40 w-full rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800/80 mb-4 shrink-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-8 w-8 text-zinc-600"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0Z" />
                      </svg>
                    </div>
                  )}
                  {/* Dynamic Category Tag */}
                  <span className="absolute top-2.5 left-2.5 inline-block text-[8px] uppercase font-black tracking-widest bg-zinc-950/80 backdrop-blur-md text-orange-500 border border-orange-500/20 px-2.5 py-0.5 rounded-full select-none">
                    {p.category?.name || "Firework"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-zinc-500 tracking-wider">
                      {p.code}
                    </span>
                    {p.tag && (
                      <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide group-hover:text-orange-400 transition-colors truncate">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-extrabold line-clamp-1">
                    {p.shortDesc}
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold line-clamp-2 pt-1 border-t border-zinc-800/30">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => handleDeleteProduct(p)}
                  className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-red-500/20 hover:bg-red-500/5 rounded-xl text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                  title="Delete Item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.842 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.74-2.533l.842-10.518.149.022a.75.75 0 00.23-1.482 44.478 44.478 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4.753a43.518 43.518 0 014 0V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v1.003zM9.75 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zm3.25-.75a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full py-16 text-center text-zinc-500 font-bold tracking-wide bg-zinc-900/30 rounded-3xl border border-zinc-900">
          <p className="text-sm text-zinc-400 font-black uppercase tracking-wider mb-1">
            No firework items in catalog yet.
          </p>
          <p className="text-xs text-zinc-600 font-semibold">
            {categories.length === 0
              ? 'Click "New Category" to create a category, then click "Add New Product" to start building your catalog.'
              : 'Click "Add New Product" to add your first firework listing.'}
          </p>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleAddCategorySubmit}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/80 animate-fade-in-up"
          >
            <button
              type="button"
              onClick={() => setIsAddCategoryModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="text-base font-black uppercase text-white tracking-wider">
                Create Dynamic Category
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                Define a category or subcategory for catalog organization
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sparklers or Elite Series"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                  SKU Code Prefix (3 Letters, Optional)
                </label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="e.g. SPK, CAK, FNT (auto-generated if empty)"
                  value={newCatPrefix}
                  onChange={(e) => setNewCatPrefix(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                  Parent Category (Optional)
                </label>
                <select
                  value={newCatParentId}
                  onChange={(e) => setNewCatParentId(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold cursor-pointer"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                disabled={isCategorySubmitting}
                className="py-2.5 px-5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-xs font-black uppercase text-white tracking-widest rounded-2xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCategorySubmitting}
                className="py-2.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isCategorySubmitting && (
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isCategorySubmitting ? "Creating..." : "Save Category"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Product Modal with Dynamic Categories */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleAddProductSubmit}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/80 animate-fade-in-up"
          >
            {/* Modal Close */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <h3 className="text-base font-black uppercase text-white tracking-wider">
                Create Catalog Listing
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                Append a new firework item to the showcase index
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Row 1: Title and Dynamic Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50-Shot Magic Fountain"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Category</label>
                  {categories.length > 0 ? (
                    <select
                      value={newProductCategoryId}
                      onChange={(e) => setNewProductCategoryId(e.target.value)}
                      className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold cursor-pointer"
                    >
                      {categories.map((cat) => {
                        if (cat.children && cat.children.length > 0) {
                          return (
                            <optgroup key={cat.id} label={cat.name}>
                              {cat.children.map((child) => (
                                <option key={child.id} value={child.id}>
                                  {child.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        }
                        return (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <div className="text-[10px] text-zinc-500 p-2.5 border border-zinc-800 rounded-xl bg-zinc-950">
                      No categories yet.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          setIsAddCategoryModalOpen(true);
                        }}
                        className="text-orange-400 underline font-bold"
                      >
                        Create one first
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Short Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golden palm effects with crackling sparks."
                  value={newProductShortDesc}
                  onChange={(e) => setNewProductShortDesc(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              {/* Row 3: Full Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Detailed Description</label>
                <textarea
                  required
                  placeholder="Summarize product burst effects, colors, height limits, safety parameters, or packaging details..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 leading-relaxed"
                />
              </div>

              {/* Row 4: Image Upload Area (Uploaded to MinIO via backend) */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Product Image (MinIO S3)</label>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2 relative border border-dashed border-zinc-800 rounded-xl p-3 bg-zinc-950 text-center hover:border-orange-500/30 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5 text-zinc-500"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                      </svg>
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Select Firework Image</span>
                    </div>
                  </div>

                  {/* Thumbnail preview */}
                  <div className="relative h-16 w-full rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest text-center px-1">No Image Selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
                className="py-2.5 px-5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-xs font-black uppercase text-white tracking-widest rounded-2xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || categories.length === 0}
                className="py-2.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isSubmitting ? "Uploading & Saving..." : "Save Listing"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
