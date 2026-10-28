"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";
import DealersCanvas from "@/components/DealersCanvas";
import { storeService } from "@/services/stores/storeService";
import { StoreDto } from "@/services/stores/dto/store.dto";

interface LocalDealerCardProps {
  store: StoreDto;
  onClick: (e: React.MouseEvent) => void;
}

function LocalDealerCard({ store, onClick }: LocalDealerCardProps) {
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

      if (isHovering && Math.random() < 0.2) {
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
      className="group rounded-3xl bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-6 shadow-md hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-1.5 transition-all duration-500 select-none relative overflow-hidden cursor-pointer flex flex-col justify-between min-h-[220px] text-left"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="space-y-3.5 relative z-10">
        {/* Header tags */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-wider">
            {store.city}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
              {store.state}
            </span>
            {store.code && (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                {store.code}
              </span>
            )}
          </div>
        </div>

        {/* Title & Info */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
            {store.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2">
            {store.address}
          </p>
        </div>
      </div>

      {/* Action Row */}
      <div className="relative z-10 pt-3.5 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
          Open: {store.hours || "9:00 AM - 8:00 PM"}
        </span>
        <span className="text-xs font-black text-orange-500 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View Depot Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/**
 * Resolves embeddable Google Maps iframe URL from stored mapUrl or falls back to address query
 */
function getMapEmbedUrl(store: StoreDto): string {
  if (store.mapUrl) {
    const text = store.mapUrl.trim();
    if (text.includes("<iframe")) {
      const match = text.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        let src = match[1];
        if (src.startsWith("//")) src = `https:${src}`;
        return src;
      }
    }
    if (text.startsWith("http")) {
      if (text.includes("google.com/maps/embed") || text.includes("output=embed")) {
        return text;
      }
      return `https://maps.google.com/maps?q=${encodeURIComponent(text)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // Fallback to location query
  const query = `${store.name}, ${store.address}, ${store.city}, ${store.state}, ${store.country || "India"}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

function WhereToBuyCatalog() {
  const searchParams = useSearchParams();

  // Dynamic live stores state - ZERO mock data
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeState, setActiveState] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDealer, setSelectedDealer] = useState<StoreDto | null>(null);

  // 1. Fetch stores dynamically from Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadStores() {
      setIsLoading(true);
      try {
        const res = await storeService.getStores({ limit: 100 });
        if (isMounted) {
          setStores(res.items || []);
        }
      } catch (err) {
        console.error("Failed to load stores for where-to-buy:", err);
        if (isMounted) {
          setStores([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStores();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Derive dynamic list of states with store counts
  const statesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stores.forEach((s) => {
      if (s.state) {
        counts[s.state] = (counts[s.state] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [stores]);

  // Capture URL parameters if state is pre-selected
  useEffect(() => {
    const urlState = searchParams.get("state");
    if (urlState) {
      const decodedState = decodeURIComponent(urlState);
      const match = statesWithCounts.find(
        (s) => s.name.toLowerCase() === decodedState.toLowerCase()
      );
      if (match) {
        setActiveState(match.name);
      }
    }
  }, [searchParams, statesWithCounts]);

  // Handle activeState toggle & trigger background mesh lasers
  const handleStateChange = (state: string, e: React.MouseEvent) => {
    setActiveState(state);

    // Dispatch coordinate laser shot event to DealersCanvas
    window.dispatchEvent(
      new CustomEvent("state-selected", {
        detail: {
          x: e.clientX,
          y: e.clientY,
        },
      })
    );

    // Dispatch cracker click sparkles
    window.dispatchEvent(
      new CustomEvent("trigger-firework", {
        detail: {
          x: e.clientX,
          y: e.clientY,
          type: "sparkler",
        },
      })
    );
  };

  // Filter Stores dynamically
  const filteredDealers = useMemo(() => {
    return stores.filter((dealer) => {
      const matchesState = activeState === "All" || dealer.state === activeState;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dealer.city.toLowerCase().includes(q) ||
        dealer.name.toLowerCase().includes(q) ||
        dealer.address.toLowerCase().includes(q) ||
        (dealer.code && dealer.code.toLowerCase().includes(q));
      return matchesState && matchesSearch;
    });
  }, [stores, activeState, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative overflow-hidden">
      {/* Background canvas signals */}
      <FireworksCanvas />
      <DealersCanvas />

      {/* SECTION 1: BREADCRUMB HERO */}
      <section className="relative w-full py-32 flex items-center justify-center overflow-hidden z-20 bg-zinc-950">
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
          <div className="flex justify-center animate-slide-up-fade">
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
                <span>Where to Buy</span>
              </div>
            </nav>
          </div>

          <h1
            className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade"
            style={{ animationDelay: "100ms" }}
          >
            Official{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Distributors
            </span>
          </h1>
          <p
            className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade"
            style={{ animationDelay: "200ms" }}
          >
            Find licensed retail depots and official outlets in your state. Authenticity and safe factory testing guaranteed at every location.
          </p>
        </div>
      </section>

      {/* SECTION 2: MAP SELECTOR & DEALERS GRID */}
      <section className="relative w-full py-16 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Grid: Left (Dealers & Search) vs Right (States Selector List) */}
          <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-10 relative z-30">
            {/* COLUMN 1: LEFT SIDEBAR DEALERS DISPLAY (3/4 Width) */}
            <div className="flex-1 space-y-8 text-left">
              {/* Search Box Header */}
              <div className="bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                    {activeState === "All" ? "All Outlets & Depots" : `${activeState} Outlets`}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                    {filteredDealers.length} authorized dealer{filteredDealers.length === 1 ? "" : "s"} listed
                  </p>
                </div>

                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search by city, store name, code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
                    />
                  </svg>
                </div>
              </div>

              {/* Cards Grid */}
              <div>
                {isLoading ? (
                  /* Loading Skeletons */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 p-6 shadow-md animate-pulse h-[220px] flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                          </div>
                          <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                          <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        </div>
                        <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-md pt-2 border-t border-zinc-100 dark:border-white/5" />
                      </div>
                    ))}
                  </div>
                ) : stores.length === 0 ? (
                  /* Clean Dynamic Empty State when no stores are in DB */
                  <div className="py-20 text-center space-y-4 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-zinc-200/80 dark:border-white/10 max-w-lg mx-auto shadow-xl">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 mb-2 border border-orange-500/20 shadow-inner">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.75"
                        stroke="currentColor"
                        className="h-8 w-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25A2.25 2.25 0 010 18.75V10.5m18 10.5h2.25A2.25 2.25 0 0022.5 18.75V10.5m-18 0V6a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0119.5 6v4.5m-15 0h15"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
                      Store Network Being Updated
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium leading-relaxed">
                      Our authorized retail depots and official outlets are currently being cataloged. Place an order or get in touch with our central team for licensed transit delivery.
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-3">
                      <Link
                        href="/enquiry"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:scale-105 active:scale-95"
                      >
                        <span>Contact Central Dispatch</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-3.5 w-3.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 01.75-.75h10.63l-3.01-3.01a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l3.01-3.01H3.75A.75.75 0 013 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-zinc-800 dark:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-white/10 hover:scale-105 active:scale-95"
                      >
                        <span>Explore Products</span>
                      </Link>
                    </div>
                  </div>
                ) : filteredDealers.length === 0 ? (
                  /* No filter matches */
                  <div className="py-20 text-center space-y-3 bg-white/40 dark:bg-zinc-900/10 backdrop-blur-sm rounded-3xl border border-zinc-200/50 dark:border-white/5 max-w-md mx-auto">
                    <div className="text-3xl">🔍</div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                      No Outlets Found
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto font-medium">
                      No depots match your search criteria. Please adjust your search or state filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveState("All");
                      }}
                      className="text-xs font-bold text-orange-500 hover:underline cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredDealers.map((store, idx) => (
                      <div
                        key={store.id}
                        className="animate-slide-up-fade"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <LocalDealerCard
                          store={store}
                          onClick={() => setSelectedDealer(store)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: RIGHT STATE SELECTOR (1/4 Width, Sticky) */}
            <div className="w-full lg:w-[280px] flex-shrink-0">
              <div className="bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-3xl p-6 space-y-6 lg:sticky lg:top-28 h-fit shadow-lg text-left animate-fade-in">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                    Select State
                  </h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal font-medium">
                    Filter stores by region or view all authorized hubs.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* All States Pill */}
                  <button
                    onClick={(e) => handleStateChange("All", e)}
                    className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                      activeState === "All"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-md shadow-orange-500/10 scale-[1.01]"
                        : "bg-zinc-50/50 dark:bg-black/20 border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300/80 dark:hover:border-white/10 hover:scale-[1.005]"
                    }`}
                  >
                    <span>All States</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        activeState === "All"
                          ? "bg-white/20 text-white"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {stores.length}
                    </span>
                  </button>

                  {/* Dynamic States */}
                  {statesWithCounts.map((stateItem, idx) => {
                    const isActive = activeState === stateItem.name;

                    return (
                      <button
                        key={idx}
                        onClick={(e) => handleStateChange(stateItem.name, e)}
                        className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                          isActive
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500/20 text-white shadow-md shadow-orange-500/10 scale-[1.01]"
                            : "bg-zinc-50/50 dark:bg-black/20 border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300/80 dark:hover:border-white/10 hover:scale-[1.005]"
                        }`}
                      >
                        <span className="truncate pr-2">{stateItem.name}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          {stateItem.count} {stateItem.count === 1 ? "Hub" : "Hubs"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOT DETAILS MODAL WITH LIVE GOOGLE MAP */}
      {selectedDealer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          {/* Main Card Container */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] max-w-3xl w-full p-6 md:p-10 relative overflow-hidden shadow-2xl animate-slide-up-fade text-left max-h-[92vh] overflow-y-auto">
            {/* Ambient glows behind modal columns */}
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setSelectedDealer(null)}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer z-50 shadow-sm"
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

            <div className="space-y-6 relative z-40">
              {/* Header Titles */}
              <div className="space-y-1.5 pr-12">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-wider">
                    {selectedDealer.city}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                    {selectedDealer.state}
                  </span>
                  {selectedDealer.code && (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                      {selectedDealer.code}
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                  {selectedDealer.name}
                </h2>
              </div>

              {/* Address details & Google Map block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Info Text Column */}
                <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Full Address
                    </h4>
                    <p className="leading-relaxed font-semibold">{selectedDealer.address}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Operational Hours
                    </h4>
                    <p className="font-semibold">{selectedDealer.hours || "9:00 AM - 8:00 PM (Daily)"}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Contact Details
                    </h4>
                    <p className="font-semibold">{selectedDealer.contact || "Contact via Central Dispatch"}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                      Location Region
                    </h4>
                    <p className="font-semibold">
                      {selectedDealer.city}, {selectedDealer.state}, {selectedDealer.country || "India"}
                    </p>
                  </div>
                </div>

                {/* Live Google Map Iframe block */}
                <div className="h-64 md:h-full min-h-[240px] rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 overflow-hidden relative shadow-inner">
                  <iframe
                    src={getMapEmbedUrl(selectedDealer)}
                    title={`${selectedDealer.name} Location Map`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0 rounded-2xl"
                  />
                </div>
              </div>

              {/* Action Row */}
              <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Authorized Licensed Depot
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedDealer(null)}
                    className="px-6 py-2.5 rounded-full text-xs font-black uppercase border border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    href={`/enquiry?dealer=${encodeURIComponent(selectedDealer.name)}`}
                    className="inline-flex items-center justify-center px-8 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-md hover:shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Request Transit Order
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

export default function WhereToBuyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500" />
        </div>
      }
    >
      <WhereToBuyCatalog />
    </Suspense>
  );
}
