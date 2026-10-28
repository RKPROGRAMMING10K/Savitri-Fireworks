"use client";

import React, { useState, useEffect, useCallback } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/notifications";
import { enquiryService } from "@/services/enquiries/enquiryService";
import { EnquiryDto } from "@/services/enquiries/dto/enquiry.dto";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Pending" | "Contacted" | "Resolved">("All");
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // 1. Fetch Enquiries dynamically from Backend API
  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await enquiryService.getEnquiries({
        status: filterType !== "All" ? filterType : undefined,
        search: searchTerm.trim() || undefined,
      });
      const items = res.items || [];
      setEnquiries(items);

      // If currently selected item is not in new items, or if nothing selected yet on desktop
      if (items.length > 0 && !selectedId && typeof window !== "undefined" && window.innerWidth >= 1024) {
        setSelectedId(items[0].id);
      }
    } catch (err: any) {
      console.error("Failed to load enquiries:", err);
      showErrorToast("Load Failed", err.message || "Failed to fetch enquiries.");
    } finally {
      setIsLoading(false);
    }
  }, [filterType, searchTerm, selectedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEnquiries();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadEnquiries]);

  const selectedEnquiry = enquiries.find((e) => e.id === selectedId);

  // Status Change handler
  const handleSetStatus = async (id: string, newStatus: "Contacted" | "Resolved") => {
    try {
      await enquiryService.updateStatus(id, newStatus);
      showSuccessToast("Status Updated", `Enquiry marked as ${newStatus}.`);
      await loadEnquiries();
    } catch (err: any) {
      showErrorToast("Update Failed", err.message || "Failed to update status.");
    }
  };

  // Submit reply handler
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedId) return;

    setIsSendingReply(true);
    try {
      await enquiryService.addReply(selectedId, replyText.trim());
      showSuccessToast(
        "Reply Dispatched",
        `Your reply has been saved and logged in the response thread.`
      );
      setReplyText("");
      await loadEnquiries();
    } catch (err: any) {
      showErrorToast("Reply Failed", err.message || "Failed to dispatch reply.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // Delete enquiry handler
  const handleDeleteEnquiry = async (item: EnquiryDto) => {
    if (!confirm(`Are you sure you want to permanently delete enquiry "${item.code}" from ${item.name}?`)) {
      return;
    }

    try {
      await enquiryService.deleteEnquiry(item.id);
      showSuccessToast("Enquiry Deleted", `Enquiry "${item.code}" removed successfully.`);
      if (selectedId === item.id) {
        setSelectedId(null);
      }
      await loadEnquiries();
    } catch (err: any) {
      showErrorToast("Delete Failed", err.message || "Failed to delete enquiry.");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up h-full flex flex-col">
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
            Enquiries <span className="text-orange-500 font-black">Inbox</span>
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Real-time customer messages, dealer enquiries, and email correspondence
          </p>
        </div>
      </div>

      {/* Split Pane Container */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-h-[500px]">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: LIST */}
        {/* ========================================================================= */}
        <div
          className={`lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-[480px] lg:h-[calc(100vh-14rem)] flex flex-col
            ${selectedId ? "hidden lg:flex" : "flex"}
          `}
        >
          {/* Search and Filters */}
          <div className="space-y-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inbox..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 select-none text-[9px] font-black uppercase tracking-wider">
              {(["All", "Pending", "Contacted", "Resolved"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-2 transition-all cursor-pointer text-center ${
                    filterType === t
                      ? "bg-orange-500 text-white font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Inbox List Scroll Pane */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-hide">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
                <div className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Loading Inbox...</span>
              </div>
            ) : enquiries.length > 0 ? (
              enquiries.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedId(e.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between select-none cursor-pointer group
                    ${
                      selectedId === e.id
                        ? "bg-orange-500/10 border-orange-500/30 text-white"
                        : "bg-zinc-950/40 border-zinc-800/60 hover:bg-zinc-800/20 text-zinc-300"
                    }
                  `}
                >
                  <div className="w-full flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider group-hover:text-zinc-400">
                      {e.enquiryType}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-semibold">
                      {new Date(e.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="mt-1">
                    <h4 className="text-xs font-black uppercase tracking-wide text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                      {e.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-zinc-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                      {e.hasAttachments && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-orange-400 shrink-0">
                          <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.242 4.243l7-7a1 1 0 00-1.414-1.414l-7 7a1 1 0 01-1.414-1.414l7-7a1 1 0 011.414 0l7 7a3 3 0 01-4.242 4.242l-7-7a5 5 0 017.07-7.07l7 7a1 1 0 001.415-1.415l-7-7z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>{e.subject}</span>
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-zinc-800/30 pt-2 shrink-0">
                    <span className="text-[9px] font-bold text-zinc-500 select-all">{e.phone}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] uppercase font-black tracking-wider border ${
                      e.status === "Pending"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : e.status === "Contacted"
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {e.status}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-16 text-zinc-600 text-xs font-bold select-none">
                Inbox empty. No customer enquiries received yet.
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DETAIL VIEW */}
        {/* ========================================================================= */}
        <div
          className={`lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 md:p-6 min-h-[480px] lg:h-[calc(100vh-14rem)] flex flex-col justify-between
            ${selectedId ? "flex" : "hidden lg:flex"}
          `}
        >
          {selectedEnquiry ? (
            <div className="h-full flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 pr-1 scrollbar-hide">
                {/* Back button on mobile */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-orange-400 font-bold tracking-wider uppercase mb-3 cursor-pointer select-none self-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                  <span>Back to Inbox</span>
                </button>

                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800/80 pb-4 select-none">
                  <div>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-2">
                      {selectedEnquiry.enquiryType}
                    </span>
                    <h2 className="text-base font-black uppercase text-white tracking-wide leading-tight">
                      {selectedEnquiry.subject}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-zinc-500 mt-2">
                      <span>ID: {selectedEnquiry.code}</span>
                      <span>•</span>
                      <span>
                        Received: {new Date(selectedEnquiry.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Mark Status / Delete */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSetStatus(selectedEnquiry.id, "Contacted")}
                      disabled={selectedEnquiry.status === "Contacted"}
                      className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none border cursor-pointer
                        ${
                          selectedEnquiry.status === "Contacted"
                            ? "bg-orange-500/10 text-orange-500 border-orange-500/30 font-bold opacity-60 cursor-not-allowed"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }
                      `}
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => handleSetStatus(selectedEnquiry.id, "Resolved")}
                      disabled={selectedEnquiry.status === "Resolved"}
                      className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none border cursor-pointer
                        ${
                          selectedEnquiry.status === "Resolved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold opacity-60 cursor-not-allowed"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }
                      `}
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleDeleteEnquiry(selectedEnquiry)}
                      className="p-2 bg-zinc-950 border border-zinc-800 hover:border-red-500/20 hover:bg-red-500/5 rounded-xl text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Enquiry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.842 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.74-2.533l.842-10.518.149.022a.75.75 0 00.23-1.482 44.478 44.478 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4.753a43.518 43.518 0 014 0V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v1.003zM9.75 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zm3.25-.75a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Sender contact details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl select-all text-xs">
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Contact Person</span>
                    <p className="font-extrabold text-white mt-0.5">{selectedEnquiry.name}</p>
                    {selectedEnquiry.companyName && (
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-semibold">{selectedEnquiry.companyName}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Email Address</span>
                    <p className="font-extrabold text-orange-500 mt-0.5 truncate hover:underline">
                      <a href={`mailto:${selectedEnquiry.email}`} className="pointer-events-auto">{selectedEnquiry.email}</a>
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Phone Contact</span>
                    <p className="font-extrabold text-white mt-0.5">
                      <a href={`tel:${selectedEnquiry.phone}`} className="pointer-events-auto">{selectedEnquiry.phone}</a>
                    </p>
                  </div>
                </div>

                {/* Extra Metadata Details if available */}
                {(selectedEnquiry.productName || selectedEnquiry.dealerName || selectedEnquiry.pesoLicense) && (
                  <div className="flex flex-wrap gap-3 bg-zinc-950/40 border border-zinc-800/60 p-3 rounded-xl text-[10px]">
                    {selectedEnquiry.productName && (
                      <span className="text-zinc-400">
                        <strong className="text-zinc-500 uppercase">Product:</strong> {selectedEnquiry.productName}
                      </span>
                    )}
                    {selectedEnquiry.dealerName && (
                      <span className="text-zinc-400">
                        <strong className="text-zinc-500 uppercase">Dealer:</strong> {selectedEnquiry.dealerName}
                      </span>
                    )}
                    {selectedEnquiry.pesoLicense && (
                      <span className="text-zinc-400">
                        <strong className="text-zinc-500 uppercase">PESO / GST:</strong> {selectedEnquiry.pesoLicense}
                      </span>
                    )}
                  </div>
                )}

                {/* Attachment Section */}
                {selectedEnquiry.hasAttachments && selectedEnquiry.attachmentUrl && (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                        <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.242 4.243l7-7a1 1 0 00-1.414-1.414l-7 7a1 1 0 01-1.414-1.414l7-7a1 1 0 011.414 0l7 7a3 3 0 01-4.242 4.242l-7-7a5 5 0 017.07-7.07l7 7a1 1 0 001.415-1.415l-7-7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] uppercase tracking-wider">File Attachment Uploaded by Customer</span>
                    </div>
                    <a
                      href={selectedEnquiry.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                    >
                      View / Download File
                    </a>
                  </div>
                )}

                {/* Original Message */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider select-none">Original Customer Message</span>
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-300 leading-relaxed font-semibold font-sans whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>

                {/* Threaded Replies History list */}
                {selectedEnquiry.replies && selectedEnquiry.replies.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider select-none">
                      Response Thread ({selectedEnquiry.replies.length})
                    </span>
                    <div className="space-y-3 pl-4 border-l border-zinc-800/80">
                      {selectedEnquiry.replies.map((reply, index) => (
                        <div key={index} className="bg-zinc-950/40 border border-zinc-800/60 p-3.5 rounded-2xl space-y-1">
                          <div className="flex items-center justify-between text-[8px] font-bold text-zinc-500 select-none">
                            <span className="uppercase text-orange-500">{reply.sender || "Admin Dispatch"}</span>
                            <span>{reply.date}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed whitespace-pre-wrap">
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Email Composition Form */}
              <form onSubmit={handleSendReply} className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 shrink-0">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 select-none">
                    Dispatch Email Response to {selectedEnquiry.name} ({selectedEnquiry.email})
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder={`Compose email reply to ${selectedEnquiry.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 leading-relaxed"
                  />
                </div>
                <div className="flex justify-end select-none">
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="py-2 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-[10px] font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSendingReply && (
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{isSendingReply ? "Sending..." : "Send Response"}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none">
              <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 relative">
                <div className="absolute inset-0 rounded-2xl bg-orange-500/5 blur-md" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6 relative z-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Review Submissions
                </h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                  Select an enquiry log from the inbox column to inspect details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
