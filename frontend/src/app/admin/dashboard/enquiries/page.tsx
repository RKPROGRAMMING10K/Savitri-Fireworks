"use client";

import React, { useState } from "react";
import { showSuccessToast } from "@/utils/notifications";

interface ReplyItem {
  date: string;
  message: string;
}

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  enquiryType: string;
  subject: string;
  message: string;
  date: string;
  status: "Pending" | "Contacted" | "Resolved";
  hasAttachments: boolean;
  replies: ReplyItem[];
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: "ENQ-001",
      name: "Rohit Sharma",
      phone: "+91 98765 43210",
      email: "rohit.sharma@retailer.com",
      enquiryType: "Wholesale Dealership",
      subject: "Bulk sparkler supply & dealership request",
      message: "We are expanding our retail outlets in Mumbai and would like to obtain bulk pricing for the 10cm electric sparklers and giant flower pots. We are looking to order around 500 boxes for the Diwali pre-season.",
      date: "Today, 10:15 AM",
      status: "Pending",
      hasAttachments: true,
      replies: [],
    },
    {
      id: "ENQ-002",
      name: "Priya Patel",
      phone: "+91 87654 32109",
      email: "priya.patel@weddingplanners.in",
      enquiryType: "Custom Fireworks",
      subject: "Custom aerial shell sequence for corporate gala",
      message: "We need a custom pyrotechnic display sequence for a grand wedding reception in Ahmedabad. The client wants color-coordinated aerial shell sequences in gold, orange, and purple. I have attached the floor plan and hazard map of the venue.",
      date: "Yesterday, 4:30 PM",
      status: "Contacted",
      hasAttachments: true,
      replies: [
        {
          date: "Yesterday, 6:00 PM",
          message: "Thank you for reaching out. We can arrange gold, orange, and purple display sequences. Let us schedule a phone call to finalize safety distances.",
        }
      ],
    },
    {
      id: "ENQ-003",
      name: "Anand Verma",
      phone: "+91 76543 21098",
      email: "anand.verma@fireworksbuzz.com",
      enquiryType: "General Query",
      subject: "Safety certifications and eco-green compliance documentation",
      message: "Could you send the green crackers compliance certificate issued by CSIR-NEERI for your sparklers and flower pots? Some state authorities require us to display these documents in our stores.",
      date: "July 04, 2026",
      status: "Resolved",
      hasAttachments: false,
      replies: [
        {
          date: "July 04, 2026",
          message: "Certificate copy sent via email attachment. Let us know if you require additional state permissions.",
        }
      ],
    },
    {
      id: "ENQ-004",
      name: "Sanjay Dutt",
      phone: "+91 65432 10987",
      email: "sanjay.d@fiestaevents.com",
      enquiryType: "Custom Fireworks",
      subject: "Low-smoke ground wheel products inquiry",
      message: "Are there low-smoke ground wheels (Chakkars) available? We have an indoor stage celebration event and want to verify if the smoke density is suitable for enclosed venues with proper exhaust systems.",
      date: "July 03, 2026",
      status: "Pending",
      hasAttachments: false,
      replies: [],
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Pending" | "Contacted" | "Resolved">("All");
  const [replyText, setReplyText] = useState("");

  const selectedEnquiry = enquiries.find((e) => e.id === selectedId);

  // Status Change handlers (Contacted or Resolved only)
  const setStatus = (id: string, newStatus: "Contacted" | "Resolved") => {
    showSuccessToast("Status Updated", `Enquiry marked as ${newStatus}.`);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  // Submit reply handler
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedId) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = `Today, ${timeString}`;

    // Dispatches toast notification directly inside the event handler scope
    const target = enquiries.find((item) => item.id === selectedId);
    if (target) {
      showSuccessToast(
        "Reply Dispatched",
        `Your email response has been successfully sent to ${target.email}.`
      );
    }

    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === selectedId) {
          return {
            ...item,
            status: "Contacted", // Auto set to contacted when replied
            replies: [...item.replies, { date: dateString, message: replyText }],
          };
        }
        return item;
      })
    );

    setReplyText("");
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.enquiryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = filterType === "All" || e.status === filterType;
    return matchesSearch && matchesType;
  });

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
            Manage submissions, review attachments, dispatch email replies, and update logs
          </p>
        </div>
      </div>

      {/* Split Pane Container */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-h-[500px]">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: LIST */}
        {/* ========================================================================= */}
        <div
          className={`lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 space-y-4 h-[calc(100vh-16rem)] min-h-[580px] flex flex-col
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
              {["All", "Pending", "Contacted", "Resolved"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t as any)}
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
            {filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((e) => (
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
                    <span className="text-[9px] text-zinc-500 font-semibold">{e.date}</span>
                  </div>

                  <div className="mt-1">
                    <h4 className="text-xs font-black uppercase tracking-wide text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                      {e.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-zinc-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                      {e.hasAttachments && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-zinc-500 shrink-0">
                          <title>Contains attachments</title>
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
                Inbox empty
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DETAIL VIEW */}
        {/* ========================================================================= */}
        <div
          className={`lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 h-[calc(100vh-16rem)] min-h-[580px] flex flex-col justify-between
            ${selectedId ? "flex" : "hidden lg:flex"}
          `}
        >
          {selectedEnquiry ? (
            <div className="h-full flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-hide">
                {/* Back button on mobile */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden flex items-center gap-1.5 text-xs text-orange-500 font-black tracking-wider uppercase mb-4 cursor-pointer select-none"
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
                      <span>ID: {selectedEnquiry.id}</span>
                      <span>•</span>
                      <span>Received: {selectedEnquiry.date}</span>
                    </div>
                  </div>

                  {/* Actions to Set Status (Contacted / Resolved only) */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatus(selectedEnquiry.id, "Contacted")}
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
                      onClick={() => setStatus(selectedEnquiry.id, "Resolved")}
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
                  </div>
                </div>

                {/* Sender card detail details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl select-all text-xs">
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Contact Person</span>
                    <p className="font-extrabold text-white mt-0.5">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Email Address</span>
                    <p className="font-extrabold text-orange-500 mt-0.5 truncate hover:underline">
                      <a href={`mailto:${selectedEnquiry.email}`} className="pointer-events-auto">{selectedEnquiry.email}</a>
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Phone contact</span>
                    <p className="font-extrabold text-white mt-0.5">
                      <a href={`tel:${selectedEnquiry.phone}`} className="pointer-events-auto">{selectedEnquiry.phone}</a>
                    </p>
                  </div>
                </div>

                {/* Attachment Note Warning */}
                {selectedEnquiry.hasAttachments && (
                  <div className="bg-amber-500/5 border border-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase tracking-wider p-3 rounded-xl flex items-center gap-2 select-none select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5 animate-pulse">
                      <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.242 4.243l7-7a1 1 0 00-1.414-1.414l-7 7a1 1 0 01-1.414-1.414l7-7a1 1 0 011.414 0l7 7a3 3 0 01-4.242 4.242l-7-7a5 5 0 017.07-7.07l7 7a1 1 0 001.415-1.415l-7-7z" clipRule="evenodd" />
                    </svg>
                    <span>Note: This email contains image attachments. Please check your email inbox to view them.</span>
                  </div>
                )}

                {/* Original Message */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider select-none">Original Email Message</span>
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-300 leading-relaxed font-semibold font-sans">
                    "{selectedEnquiry.message}"
                  </div>
                </div>

                {/* Threaded Replies History list */}
                {selectedEnquiry.replies.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider select-none">Response Thread ({selectedEnquiry.replies.length})</span>
                    <div className="space-y-3 pl-4 border-l border-zinc-800/80">
                      {selectedEnquiry.replies.map((reply, index) => (
                        <div key={index} className="bg-zinc-950/40 border border-zinc-800/60 p-3.5 rounded-2xl space-y-1">
                          <div className="flex items-center justify-between text-[8px] font-bold text-zinc-500 select-none">
                            <span className="uppercase text-orange-500">Super Admin Dispatch</span>
                            <span>{reply.date}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed">
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
                  <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 select-none">Dispatch Email Response</label>
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
                    className="py-2 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-[10px] font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    Send Response
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none">
              <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 relative">
                {/* Glowing glow effect */}
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
