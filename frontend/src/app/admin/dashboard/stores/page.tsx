"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { indianStates, StateItem } from "@/utils/statesData";
import { showSuccessToast, showErrorToast } from "@/utils/notifications";
import { storeService } from "@/services/stores/storeService";
import { StoreDto } from "@/services/stores/dto/store.dto";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [storeName, setStoreName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [hours, setHours] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [mapInput, setMapInput] = useState("");

  // State Search Dropdown states
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Fetch stores dynamically from Backend API
  const loadStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await storeService.getStores({
        search: searchTerm.trim() || undefined,
      });
      setStores(res.items || []);
    } catch (err: any) {
      console.error("Failed to load stores:", err);
      showErrorToast("Load Failed", err.message || "Failed to fetch store listings.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStores();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadStores]);

  // Close state dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStateSelect = (selectedState: StateItem) => {
    setState(selectedState.name);
    setCountry(selectedState.country);
    setIsStateDropdownOpen(false);
    setStateSearch("");
  };

  /**
   * Parse map input (iframe HTML, link, or address) into an embeddable Google Maps URL
   */
  const parseMapUrl = (input: string, fallbackAddress?: string): string => {
    const text = input ? input.trim() : "";

    // 1. If iframe tag
    if (text.includes("<iframe")) {
      const match = text.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        let src = match[1];
        if (src.startsWith("//")) src = `https:${src}`;
        return src;
      }
    }

    // 2. If direct URL
    if (text.startsWith("http")) {
      if (text.includes("google.com/maps/embed") || text.includes("output=embed")) {
        return text;
      }
      return `https://maps.google.com/maps?q=${encodeURIComponent(text)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }

    // 3. Fallback to location text
    const query = text || fallbackAddress || "";
    return query ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed` : "";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStoreName("");
    setFullAddress("");
    setCity("");
    setState("");
    setCountry("India");
    setHours("");
    setContactDetails("");
    setMapInput("");
    setIsStateDropdownOpen(false);
    setStateSearch("");
    setIsSubmitting(false);
  };

  const handleAddStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !fullAddress.trim() || !city.trim() || !state.trim()) {
      showErrorToast("Validation Failed", "Please fill in all required fields including State and City.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fallbackAddress = `${fullAddress.trim()}, ${city.trim()}, ${state.trim()}, ${country || 'India'}`;
      const finalMapUrl = parseMapUrl(mapInput, fallbackAddress);

      const created = await storeService.createStore({
        name: storeName.trim(),
        address: fullAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim() || "India",
        hours: hours.trim() || "9:00 AM - 8:00 PM (Daily)",
        contact: contactDetails.trim() || "+91 2597 293 116",
        mapUrl: finalMapUrl,
      });

      showSuccessToast(
        "Store Added",
        `"${created.name}" (${created.code}) has been successfully saved.`
      );

      handleCloseModal();
      await loadStores();
    } catch (err: any) {
      showErrorToast("Save Failed", err.message || "Failed to create store listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStore = async (store: StoreDto) => {
    if (!confirm(`Are you sure you want to delete store listing "${store.name}" (${store.code})?`)) {
      return;
    }

    try {
      await storeService.deleteStore(store.id);
      showSuccessToast("Store Removed", `"${store.name}" listing was removed successfully.`);
      await loadStores();
    } catch (err: any) {
      showErrorToast("Delete Failed", err.message || "Failed to delete store listing.");
    }
  };

  // Filter state list for modal dropdown
  const filteredStates = indianStates.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Live preview URL for modal
  const livePreviewMapUrl = parseMapUrl(
    mapInput,
    fullAddress && city ? `${fullAddress}, ${city}, ${state}` : ""
  );

  return (
    <div className="relative w-full min-h-screen">
      {/* Visual entrance keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Main Grid View */}
      <div className="space-y-6 md:space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
              Store <span className="text-orange-500 font-black">Listings</span>
            </h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Configure public store locations, addresses, and Google Maps widgets
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer self-start sm:self-auto w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
              <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.25H18a.75.75 0 010 1.5h-7.25V18a.75.75 0 01-1.5 0v-7.25H2a.75.75 0 010-1.5h7.25V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
            </svg>
            <span>Add New Store</span>
          </button>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between bg-zinc-900 border border-zinc-800 rounded-3xl p-3 sm:p-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search stores by name, city, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider select-none text-right sm:text-left">
            Displaying {stores.length} Location(s)
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <div className="h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Loading Store Listings...</span>
          </div>
        ) : stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="group relative bg-zinc-900 border border-zinc-800 hover:border-orange-500/20 rounded-3xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between overflow-hidden gap-5"
              >
                <div className="space-y-4">
                  {/* Title & Code Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-black text-zinc-500 tracking-wider">
                          {store.code}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-zinc-650" />
                        <span className="text-[9px] uppercase font-black text-orange-400 tracking-wider">
                          {store.state}
                        </span>
                      </div>
                      <h3 className="text-sm font-black uppercase text-white tracking-wide group-hover:text-orange-400 transition-colors mt-1">
                        {store.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteStore(store)}
                      className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-red-500/20 hover:bg-red-500/5 rounded-xl text-zinc-500 hover:text-red-400 transition-all cursor-pointer flex-shrink-0"
                      title="Remove Listing"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.842 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.74-2.533l.842-10.518.149.022a.75.75 0 00.23-1.482 44.478 44.478 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4.753a43.518 43.518 0 014 0V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v1.003zM9.75 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zm3.25-.75a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Core parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/60 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-black tracking-wider text-zinc-500">Store Address</span>
                      <p className="font-semibold text-zinc-300 leading-relaxed">
                        {store.address}, {store.city}, {store.state}, {store.country}
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-black tracking-wider text-zinc-500 block">Operational Hours</span>
                        <p className="font-bold text-zinc-300">{store.hours}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-black tracking-wider text-zinc-500 block">Contact Details</span>
                        <p className="font-bold text-orange-400">{store.contact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Embedded Interactive Google Map */}
                  {store.mapUrl && (
                    <div className="relative w-full h-48 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950 shadow-inner">
                      <iframe
                        src={store.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${store.name} Map Location`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full py-16 text-center text-zinc-500 font-bold tracking-wide bg-zinc-900/30 rounded-3xl border border-zinc-900">
            <p className="text-sm text-zinc-400 font-black uppercase tracking-wider mb-1">
              No store listings found in database.
            </p>
            <p className="text-xs text-zinc-600 font-semibold">
              Click &quot;Add New Store&quot; above to create your first official location and Google Map pin.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD STORE MODAL WITH LIVE GOOGLE MAP PREVIEW                             */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <form
            onSubmit={handleAddStoreSubmit}
            className="my-auto mx-auto relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800/80 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col gap-4 sm:gap-5 animate-fade-in-up"
          >
            {/* Modal Close */}
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            {/* Modal Title */}
            <div className="border-b border-zinc-800 pb-3 select-none">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Create Store Listing
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                Configure brand store addresses and Google Map iframe embeds
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Store Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Savitri Fireworks Mumbai Outlet"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* Full Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  Full Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Shop No. 12, Link Road, Andheri West"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* State Search Custom Dropdown */}
              <div className="space-y-1 relative" ref={dropdownRef}>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  State *
                </label>
                <button
                  type="button"
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs text-left text-white focus:outline-none transition-all cursor-pointer font-semibold flex items-center justify-between"
                >
                  <span className={state ? "text-white" : "text-zinc-500"}>
                    {state || "Select State..."}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-zinc-500">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isStateDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 p-2 space-y-1.5 max-h-52 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Type state name to filter..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/40"
                    />
                    <div className="divide-y divide-zinc-900/60 max-h-36 overflow-y-auto">
                      {filteredStates.length > 0 ? (
                        filteredStates.map((st) => (
                          <button
                            key={st.name}
                            type="button"
                            onClick={() => handleStateSelect(st)}
                            className="w-full text-left px-3 py-2 text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-orange-500/10 rounded-md transition-all cursor-pointer"
                          >
                            {st.name}
                          </button>
                        ))
                      ) : (
                        <div className="text-[10px] text-zinc-600 font-bold uppercase text-center py-2">
                          No states found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* Operational Hours */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  Operational Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9:00 AM - 8:00 PM (Daily)"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* Contact Details */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  Contact Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 2597 293 116"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* Google Map Link / Code (URL or <iframe> tag) */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  Google Map URL or Embed Code (&lt;iframe src=&quot;...&quot;&gt;)
                </label>
                <input
                  type="text"
                  placeholder='Paste Google Map link or full <iframe src="https://..."> embed tag'
                  value={mapInput}
                  onChange={(e) => setMapInput(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all font-mono"
                />
                <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block mt-1">
                  Accepts Google Maps share link, full iframe embed code, or auto-generates from address
                </span>
              </div>

              {/* Real-time Map Preview inside Modal */}
              {livePreviewMapUrl && (
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-orange-400 block">
                    Live Map Display Preview
                  </span>
                  <div className="relative w-full h-40 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                    <iframe
                      src={livePreviewMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      title="Live Google Map Preview"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 select-none">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="py-2.5 px-5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-black uppercase text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isSubmitting ? "Saving..." : "Save Location"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
