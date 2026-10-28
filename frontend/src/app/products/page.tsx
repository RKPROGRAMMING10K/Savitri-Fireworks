"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";
import { productService } from "@/services/products/productService";
import { categoryService } from "@/services/categories/categoryService";
import { ProductDto } from "@/services/products/dto/product.dto";
import { CategoryDto } from "@/services/categories/dto/category.dto";

interface LocalProductCardProps {
  product: ProductDto;
  onClick: (e: React.MouseEvent) => void;
}

function LocalProductCard({ product, onClick }: LocalProductCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let sparks: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }[] = [];
    let isHovering = false;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const createSpark = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      const maxLife = Math.random() * 20 + 15;
      const color = `hsla(${Math.floor(Math.random() * 30) + 15}, 100%, 65%, `;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        color,
      });
    };

    const parent = canvas.parentElement;
    const handleMouseEnter = () => {
      isHovering = true;
    };
    const handleMouseLeave = () => {
      isHovering = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      const rect = canvas.getBoundingClientRect();
      createSpark(e.clientX - rect.left, e.clientY - rect.top);
    };

    if (parent) {
      parent.addEventListener("mouseenter", handleMouseEnter);
      parent.addEventListener("mouseleave", handleMouseLeave);
      parent.addEventListener("mousemove", handleMouseMove);
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHovering && Math.random() < 0.25) {
        createSpark(Math.random() * canvas.width, Math.random() * canvas.height);
      }

      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        const alpha = s.life / s.maxLife;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = s.color + alpha + ")";
        ctx.fill();

        return s.life > 0;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mouseenter", handleMouseEnter);
        parent.removeEventListener("mouseleave", handleMouseLeave);
        parent.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="rounded-3xl bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-4 shadow-lg hover:shadow-2xl hover:border-orange-500/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-[430px] select-none group relative overflow-hidden cursor-pointer"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="space-y-4 relative z-10">
        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-10 w-10 text-orange-500/50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
              </svg>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Savitri Pyro</span>
            </div>
          )}

          {product.tag && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
              {product.tag}
            </div>
          )}
          {product.code && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-orange-400 font-mono text-[9px] font-bold backdrop-blur-sm">
              {product.code}
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none">
                {product.category?.name || "Firework"}
              </span>
              {product.category?.parent?.name && (
                <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mt-0.5">
                  {product.category.parent.name}
                </span>
              )}
            </div>
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: Math.min(5, Math.max(1, Math.round(product.rating || 5))) }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2">
            {product.shortDesc}
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-end">
        <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-300">
          View & Enquire
        </span>
      </div>
    </div>
  );
}

function ProductsCatalog() {
  const searchParams = useSearchParams();

  // Dynamic state loaded from live backend API - ZERO mock data
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter and pagination states
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const itemsPerPage = 12;

  // 1. Fetch Dynamic Categories from backend API
  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 2. Fetch Products dynamically from backend API based on activeCategory, search, and page
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // If a subcategory is selected, use that; otherwise use the active category if not "All"
      const categoryFilter =
        activeSubcategoryId || (activeCategory !== "All" ? activeCategory : undefined);

      const res = await productService.getProducts({
        category: categoryFilter,
        search: searchQuery.trim() || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      setProducts(res.items || []);
      setTotalProducts(res.total || 0);
      setTotalPages(Math.max(1, res.totalPages || 1));
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeSubcategoryId, searchQuery, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  // Handle URL query parameters on initial mount or URL updates
  useEffect(() => {
    const cat = searchParams.get("category");
    const subcat = searchParams.get("subcategory");
    const search = searchParams.get("search");

    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory("All");
    }

    if (subcat) {
      setActiveSubcategoryId(subcat);
    } else {
      setActiveSubcategoryId(null);
    }

    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Reset page when category or search changes
  const handleCategorySelect = (catName: string) => {
    setActiveCategory(catName);
    setActiveSubcategoryId(null);
    setCurrentPage(1);
  };

  const handleSubcategorySelect = (subcat: CategoryDto) => {
    setActiveSubcategoryId(subcat.id || subcat.name);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveCategory("All");
    setActiveSubcategoryId(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCardClick = (product: ProductDto, e: React.MouseEvent) => {
    window.dispatchEvent(
      new CustomEvent("trigger-firework", {
        detail: {
          x: e.clientX,
          y: e.clientY,
          type: "crackle",
        },
      })
    );
    setSelectedProduct(product);
  };

  // Find active category object for subcategory rendering
  const currentCategoryObj = categories.find(
    (c) => c.name.toLowerCase() === activeCategory.toLowerCase() || c.slug === activeCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative">
      <FireworksCanvas />

      {/* SECTION 1: BREADCRUMB HERO */}
      <section className="relative w-full py-24 sm:py-32 flex items-center justify-center overflow-hidden z-20 bg-zinc-950">
        <BreadcrumbCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-0" />

        <div className="absolute inset-0 overflow-hidden z-0 opacity-40 pointer-events-none">
          <div
            className="absolute bottom-10 left-1/4 h-2 w-2 rounded-full bg-orange-500 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute top-1/4 right-1/3 h-3 w-3 rounded-full bg-amber-400 animate-pulse"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"
            style={{ animationDuration: "4s" }}
          />
        </div>

        <div className="max-w-[1600px] mx-auto w-full text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10 relative">
          <div className="flex justify-center">
            <nav className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/5 dark:bg-black/40 border border-white/10 dark:border-zinc-800 backdrop-blur-md rounded-full shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-500 select-none group">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-orange-400 transition-colors group/home"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-orange-500 transition-all duration-300 group-hover/home:scale-110 group-hover/home:rotate-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Home</span>
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="h-3.5 w-3.5 text-zinc-600 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span>Products</span>
              </div>
            </nav>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-xl leading-tight">
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Pyro Catalog
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none">
            Browse through our extensive range of safe, certified, and eco-friendly fireworks. Search, filter, and
            enquire to light up your special events.
          </p>
        </div>
      </section>

      {/* SECTION 2: SEARCH, FILTER, AND PRODUCTS PANEL */}
      <section className="relative w-full py-10 sm:py-16 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex-1 py-2.5 px-4 bg-zinc-900 border border-zinc-800 text-xs font-black uppercase tracking-wider text-white rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
              </svg>
              <span>{isMobileFiltersOpen ? "Hide Filters" : `Filter Categories (${categories.length})`}</span>
            </button>
            {(activeCategory !== "All" || activeSubcategoryId || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="py-2.5 px-4 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-2xl cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 relative z-30">
            {/* COLUMN 1: LEFT SIDEBAR FILTERS (Sticky) */}
            <div className={`w-full lg:w-[280px] flex-shrink-0 ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}>
              <div className="bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-3xl p-5 sm:p-6 space-y-6 sm:space-y-8 lg:sticky lg:top-28 h-fit shadow-lg text-left">
                {/* Search Bar Block */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                    Search Products
                  </h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search code or title..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 shadow-inner"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Vertical Categories Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Dynamic Categories
                    </h4>
                    {(activeCategory !== "All" || activeSubcategoryId) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-[9px] font-bold text-orange-500 uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* All Products Option */}
                    <button
                      onClick={() => handleCategorySelect("All")}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                        activeCategory === "All" && !activeSubcategoryId
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-md shadow-orange-500/10"
                          : "bg-zinc-50/50 dark:bg-black/20 border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300/80 dark:hover:border-white/10"
                      }`}
                    >
                      <span>All Products</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          activeCategory === "All" && !activeSubcategoryId
                            ? "bg-white/20 text-white"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {totalProducts}
                      </span>
                    </button>

                    {/* Dynamically Loaded Categories */}
                    {categories.map((cat) => {
                      const isActive =
                        activeCategory.toLowerCase() === cat.name.toLowerCase() ||
                        activeCategory.toLowerCase() === cat.slug?.toLowerCase();

                      const hasSubcategories = cat.children && cat.children.length > 0;

                      return (
                        <div key={cat.id} className="space-y-1">
                          <button
                            onClick={() => handleCategorySelect(cat.name)}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                              isActive && !activeSubcategoryId
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-md shadow-orange-500/10"
                                : "bg-zinc-50/50 dark:bg-black/20 border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300/80 dark:hover:border-white/10"
                            }`}
                          >
                            <span className="truncate pr-2">{cat.name}</span>
                            {hasSubcategories && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className={`h-3.5 w-3.5 transition-transform duration-200 shrink-0 ${
                                  isActive ? "rotate-90 text-white" : "text-zinc-500"
                                }`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>

                          {/* Accordion Subcategories if category is active and has children */}
                          {hasSubcategories && isActive && (
                            <div className="pl-4 pt-1 pb-2 space-y-1 border-l-2 border-orange-500/30 ml-4 mt-1">
                              {cat.children!.map((sub) => {
                                const isSubActive =
                                  activeSubcategoryId === sub.id ||
                                  activeSubcategoryId?.toLowerCase() === sub.name.toLowerCase();

                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleSubcategorySelect(sub)}
                                    className={`block w-full text-left py-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                                      isSubActive
                                        ? "text-orange-500 bg-orange-500/10 font-black"
                                        : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                                    }`}
                                  >
                                    • {sub.name}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {categories.length === 0 && (
                      <div className="text-[11px] text-zinc-500 p-3 text-center border border-dashed border-zinc-800 rounded-2xl">
                        No categories configured yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: RIGHT DISPLAY GRID */}
            <div className="flex-1 space-y-8 sm:space-y-10">
              {/* Product Cards Grid */}
              <div>
                {isLoading ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-500">
                    <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Loading Pyro Showcase...
                    </span>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-20 sm:py-24 text-center space-y-4 bg-white/40 dark:bg-zinc-900/10 backdrop-blur-sm rounded-3xl border border-zinc-200/50 dark:border-white/5 max-w-xl mx-auto px-6">
                    <div className="text-4xl">🎆</div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                      {searchQuery || activeCategory !== "All"
                        ? "No Matching Products Found"
                        : "Pyro Catalog Being Updated"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium leading-relaxed">
                      {searchQuery || activeCategory !== "All"
                        ? "We couldn't find any items matching your selected category or keywords. Try resetting your search filter."
                        : "Products added by the administrator in the control dashboard will be displayed here in real-time."}
                    </p>
                    {(searchQuery || activeCategory !== "All" || activeSubcategoryId) && (
                      <button
                        onClick={handleClearFilters}
                        className="py-2 px-5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500 text-white hover:bg-orange-600 transition-all cursor-pointer shadow-md"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                    {products.map((product) => (
                      <LocalProductCard
                        key={product.id}
                        product={product}
                        onClick={(e) => handleCardClick(product, e)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && products.length > 0 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/5 bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-orange-500 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }).map((_, pageIdx) => {
                    const pageNum = pageIdx + 1;
                    const isSelected = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm border cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-orange-500/10"
                            : "bg-white dark:bg-zinc-900/40 border-zinc-200/80 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-zinc-200/80 dark:border-white/5 bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-orange-500 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                    aria-label="Next Page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-2xl animate-slide-up-fade text-left">
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer z-50 shadow-sm"
              aria-label="Close details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center relative z-40">
              <div className="relative group max-w-sm w-full mx-auto md:p-3">
                <div className="absolute top-6 -left-6 w-full h-full bg-orange-500/5 rounded-[1.8rem] border border-orange-500/10 pointer-events-none z-0" />
                <div className="absolute inset-0 border border-orange-500/20 rounded-[1.8rem] pointer-events-none z-0" />
                <div className="p-2 bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 rounded-[1.8rem] shadow-xl relative overflow-hidden z-10">
                  <div className="relative h-60 sm:h-72 md:h-80 w-full rounded-[1.4rem] overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-14 w-14 text-orange-500/50"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                          />
                        </svg>
                        <span className="text-xs uppercase font-bold tracking-widest text-zinc-500">Savitri Fireworks</span>
                      </div>
                    )}
                    {selectedProduct.tag && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
                        {selectedProduct.tag}
                      </div>
                    )}
                    {selectedProduct.code && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-orange-400 font-mono text-[9px] font-bold backdrop-blur-sm">
                        {selectedProduct.code}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
                      {selectedProduct.category?.name || "Firework"}
                    </span>
                    {selectedProduct.category?.parent?.name && (
                      <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mt-1">
                        {selectedProduct.category.parent.name}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex gap-0.5 text-amber-400 pt-1">
                    {Array.from({ length: Math.min(5, Math.max(1, Math.round(selectedProduct.rating || 5))) }).map(
                      (_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-100 dark:border-white/5 pt-3">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-600 tracking-widest">
                    Quick Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                    {selectedProduct.shortDesc}
                  </p>
                </div>

                {selectedProduct.description && (
                  <div className="space-y-2 border-t border-zinc-100 dark:border-white/5 pt-3">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-600 tracking-widest">
                      Product Details & Specifications
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold whitespace-pre-wrap">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <Link
                    href={`/enquiry?product=${encodeURIComponent(selectedProduct.name)}`}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500" />
        </div>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
