"use client";

import React, { useState } from "react";
import { showSuccessToast } from "@/utils/notifications";

interface MediaItem {
  id: string;
  type: "Photo" | "Video";
  title: string;
  shortDesc: string;
  tags: string[];
  image?: string; // for Photo uploads
  videoPlatform?: "Instagram Reels" | "Youtube Shorts";
  videoUrl?: string; // for Video entries
  date: string;
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "MED-001",
      type: "Photo",
      title: "Diwali Sparklers Close-Up",
      shortDesc: "Vibrant golden spark emission captured in macro.",
      tags: ["Sparklers"],
      image: "/assets/firework.png",
      date: "Today, 11:30 AM",
    },
    {
      id: "MED-002",
      type: "Video",
      title: "120-Shot Crackling Willow",
      shortDesc: "Full aerial display demonstration video.",
      tags: ["GrandShow", "Willow", "Cakes"],
      videoPlatform: "Youtube Shorts",
      videoUrl: "https://www.youtube.com/shorts/demo123",
      date: "Yesterday, 3:00 PM",
    },
    {
      id: "MED-003",
      type: "Photo",
      title: "Mega Flower Pot Spark Shower",
      shortDesc: "Showcasing the 5-meter height climb.",
      tags: ["Fountains"],
      image: "/assets/firework.png",
      date: "July 05, 2026",
    },
    {
      id: "MED-004",
      type: "Video",
      title: "Golden Aura Reel",
      shortDesc: "Aesthetic slow-motion background sparkler capture.",
      tags: ["Aesthetic", "Sparklers", "SlowMo"],
      videoPlatform: "Instagram Reels",
      videoUrl: "https://www.instagram.com/reel/demo456",
      date: "July 04, 2026",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"Photo" | "Video">("Photo");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [mediaType, setMediaType] = useState<"Photo" | "Video">("Photo");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  
  // Photo form states
  const [photoImage, setPhotoImage] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  // Video form states
  const [videoPlatform, setVideoPlatform] = useState<"Instagram Reels" | "Youtube Shorts">("Instagram Reels");
  const [videoUrl, setVideoUrl] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset all form inputs
    setTitle("");
    setShortDesc("");
    setTagsInput("");
    setPhotoImage("");
    setPhotoPreview("");
    setVideoUrl("");
    setVideoPlatform("Instagram Reels");
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setPhotoImage(previewUrl);
    }
  };

  const handleAddMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc) return;

    let tagsList: string[] = [];
    if (mediaType === "Photo") {
      tagsList = tagsInput.trim() ? [tagsInput.trim()] : ["General"];
    } else {
      tagsList = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      if (tagsList.length === 0) tagsList = ["Shorts"];
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = `Today, ${timeString}`;

    const newMedia: MediaItem = {
      id: `MED-0${mediaItems.length + 1}`,
      type: mediaType,
      title,
      shortDesc,
      tags: tagsList,
      date: dateString,
      image: mediaType === "Photo" ? (photoImage || "/assets/firework.png") : undefined,
      videoPlatform: mediaType === "Video" ? videoPlatform : undefined,
      videoUrl: mediaType === "Video" ? (videoUrl || "https://example.com/mockvideo") : undefined,
    };

    setMediaItems((prev) => [newMedia, ...prev]);
    showSuccessToast(
      "Media Uploaded",
      `"${title}" successfully saved inside ${mediaType} gallery.`
    );
    
    setActiveTab(mediaType);
    setIsModalOpen(false);

    // Reset Form
    setTitle("");
    setShortDesc("");
    setTagsInput("");
    setPhotoImage("");
    setPhotoPreview("");
    setVideoUrl("");
    setVideoPlatform("Instagram Reels");
  };

  const filteredItems = mediaItems.filter((item) => item.type === activeTab);

  return (
    <div className="relative w-full min-h-screen">
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

      {/* Main Content Area (Animated) */}
      <div className="space-y-6 md:space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
              Media <span className="text-orange-500 font-black">Library</span>
            </h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Browse and manage files, product images, and social video shorts
            </p>
          </div>
          
          <button
            onClick={() => {
              setMediaType(activeTab);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
              <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.25H18a.75.75 0 010 1.5h-7.25V18a.75.75 0 01-1.5 0v-7.25H2a.75.75 0 010-1.5h7.25V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
            </svg>
            <span>Add New Media</span>
          </button>
        </div>

        {/* Segment Tabs Navigation */}
        <div className="flex border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/50 p-1 w-fit select-none text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("Photo")}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "Photo"
                ? "bg-orange-500 text-white font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab("Video")}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "Video"
                ? "bg-orange-500 text-white font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Videos
          </button>
        </div>

        {/* Media Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="relative group bg-zinc-900 border border-zinc-800 rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between overflow-hidden"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div>
                  <div className="relative h-44 w-full rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800/80 mb-4 shrink-0 flex items-center justify-center">
                    {item.type === "Photo" ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative h-full w-full bg-zinc-950 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="h-11 w-11 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300 z-20">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 ml-0.5">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                        <span className="absolute top-2.5 left-2.5 z-20 inline-flex px-2 py-0.5 rounded-full text-[8px] uppercase font-black tracking-widest bg-zinc-950/80 backdrop-blur-md text-orange-500 border border-orange-500/20">
                          {item.videoPlatform}
                        </span>
                      </div>
                    )}

                    {item.type === "Photo" && (
                      <span className="absolute top-2.5 left-2.5 inline-flex px-2 py-0.5 rounded-full text-[8px] uppercase font-black tracking-widest bg-zinc-950/80 backdrop-blur-md text-orange-500 border border-orange-500/20">
                        {item.tags[0]}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase select-none tracking-wider block">
                      {item.date}
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-wide text-white group-hover:text-orange-400 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed line-clamp-2">
                      {item.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide py-0.5">
                    {item.type === "Video" ? (
                      item.tags.map((tag) => (
                        <span key={tag} className="inline-block text-[8px] uppercase font-bold text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded-md border border-zinc-800/60 shrink-0">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="inline-block text-[8px] uppercase font-bold text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded-md border border-zinc-800/60">
                        #{item.tags[0]}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete this media item: ${item.title}?`)) {
                        setMediaItems((prev) => prev.filter((med) => med.id !== item.id));
                        showSuccessToast("Media Deleted", `"${item.title}" successfully removed from gallery.`);
                      }
                    }}
                    className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-red-500/20 hover:bg-red-500/5 rounded-xl text-zinc-500 hover:text-red-400 transition-all cursor-pointer shrink-0"
                    title="Remove Media"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.842 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.74-2.533l.842-10.518.149.022a.75.75 0 00.23-1.482 44.478 44.478 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4.753a43.518 43.518 0 014 0V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v1.003zM9.75 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zm3.25-.75a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-zinc-500 font-bold tracking-wide">
              No media uploads found in this category.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD MEDIA MODAL (Outside the animated parent wrapper to escape clipping context) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <form
            onSubmit={handleAddMediaSubmit}
            className="my-auto mx-auto relative w-full max-w-md bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col gap-5"
          >
            {/* Modal Close */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer select-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            {/* Modal Title */}
            <div className="border-b border-zinc-800 pb-3 select-none">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Upload Media Item
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                Append a new photo highlight or video short to the public gallery
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Media Type Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Media Type</label>
                <div className="flex border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 select-none text-[10px] font-black uppercase tracking-wider p-0.5 w-full">
                  {["Photo", "Video"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMediaType(type as any)}
                      className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                        mediaType === type
                          ? "bg-orange-500 text-white font-black"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                      }`}
                    >
                      {type}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Media Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival Light Sequence"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all font-semibold"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slow motion capture of sparkling effects."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* DYNAMIC FIELDS FOR VIDEO */}
              {mediaType === "Video" && (
                <div className="space-y-4">
                  {/* Platform Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Social Video Platform</label>
                    <div className="relative">
                      <select
                        value={videoPlatform}
                        onChange={(e) => setVideoPlatform(e.target.value as any)}
                        className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer font-semibold appearance-none"
                      >
                        <option value="Instagram Reels" className="bg-zinc-950 text-white">Instagram Reels</option>
                        <option value="Youtube Shorts" className="bg-zinc-950 text-white">Youtube Shorts</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Video Link */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Video Link / URL</label>
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://www.instagram.com/reel/abc"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Video Tags */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Video Tags (Comma-Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Diwali, Sparklers, Safety, Show"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                    />
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block mt-1 select-none">Separate multiple tags with a comma</span>
                  </div>
                </div>
              )}

              {/* DYNAMIC FIELDS FOR PHOTO */}
              {mediaType === "Photo" && (
                <div className="space-y-4">
                  {/* Photo Tags */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Single Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sparklers"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Photo File upload */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Media Image File</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div className="sm:col-span-2 relative border border-dashed border-zinc-800 hover:border-orange-500/30 rounded-xl p-4 bg-zinc-950 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[72px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-zinc-500">
                          <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                        </svg>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Select Image File</span>
                      </div>
                      
                      {/* Preview thumbnail */}
                      <div className="relative h-[72px] w-full rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[8px] text-zinc-650 font-bold uppercase tracking-widest text-center px-1">No Image</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 select-none">
              <button
                type="button"
                onClick={handleCloseModal}
                className="py-2.5 px-5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-xs font-black uppercase text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                Save Media
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
