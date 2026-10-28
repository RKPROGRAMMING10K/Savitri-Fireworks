"use client";

import React, { useState, useEffect, useCallback } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/notifications";
import { mediaService } from "@/services/media/mediaService";
import { MediaDto } from "@/services/media/dto/media.dto";

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Photo" | "Video">("Photo");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeVideoToPlay, setActiveVideoToPlay] = useState<MediaDto | null>(null);

  // Form states
  const [mediaType, setMediaType] = useState<"Photo" | "Video">("Photo");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Media dynamically from Backend API
  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await mediaService.getMedia({
        type: activeTab,
        search: searchTerm.trim() || undefined,
      });
      setMediaItems(res.items || []);
    } catch (err: any) {
      console.error("Failed to load media:", err);
      showErrorToast("Load Failed", err.message || "Failed to fetch media assets.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMedia();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadMedia]);

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setTitle("");
    setShortDesc("");
    setTagsInput("");
    setSelectedFile(null);
    setFilePreview("");
    setDirectUrl("");
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handleAddMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      showErrorToast("Validation Error", "Title and short description are required.");
      return;
    }

    if (!selectedFile && !directUrl.trim()) {
      showErrorToast("Validation Error", `Please select a ${mediaType.toLowerCase()} file to upload or provide a direct URL.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", mediaType);
      formData.append("title", title.trim());
      formData.append("shortDesc", shortDesc.trim());
      formData.append("tags", tagsInput.trim());

      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (directUrl.trim()) {
        formData.append("url", directUrl.trim());
      }

      const created = await mediaService.createMedia(formData);
      showSuccessToast(
        "Media Uploaded",
        `"${created.title}" successfully added to ${created.type} gallery.`
      );

      handleCloseModal();
      await loadMedia();
    } catch (err: any) {
      showErrorToast("Upload Failed", err.message || "Failed to upload media item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedia = async (item: MediaDto) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.title}"?`)) {
      return;
    }

    try {
      await mediaService.deleteMedia(item.id);
      showSuccessToast("Media Deleted", `"${item.title}" removed from database and storage.`);
      await loadMedia();
    } catch (err: any) {
      showErrorToast("Delete Failed", err.message || "Failed to delete media item.");
    }
  };

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

      {/* Main Content Area */}
      <div className="space-y-6 md:space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-zinc-900 pb-4 sm:pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
              Media <span className="text-orange-500 font-black">Library</span>
            </h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Direct showcase photos and watermark-free video shorts
            </p>
          </div>

          <button
            onClick={() => {
              setMediaType(activeTab);
              setIsUploadModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer self-start sm:self-auto w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
              <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.25H18a.75.75 0 010 1.5h-7.25V18a.75.75 0 01-1.5 0v-7.25H2a.75.75 0 010-1.5h7.25V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
            </svg>
            <span>Add New {activeTab}</span>
          </button>
        </div>

        {/* Tab Selector & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-zinc-900/50 p-3 sm:p-4 border border-zinc-800/80 rounded-3xl backdrop-blur-sm">
          <div className="flex border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 select-none text-xs font-black uppercase tracking-wider p-0.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("Photo")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                activeTab === "Photo"
                  ? "bg-orange-500 text-white font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("Video")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                activeTab === "Video"
                  ? "bg-orange-500 text-white font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Videos
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}s by title or tag...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <div className="h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">Loading Media...</span>
          </div>
        ) : mediaItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaItems.map((item, idx) => (
              <div
                key={item.id}
                className="relative group bg-zinc-900 border border-zinc-800 rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between overflow-hidden"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div>
                  {/* Media Preview Box */}
                  <div className="relative h-44 w-full rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800/80 mb-4 shrink-0 flex items-center justify-center">
                    {item.type === "Photo" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      /* Clean Watermark-Free Direct Video Card */
                      <div
                        onClick={() => setActiveVideoToPlay(item)}
                        className="relative h-full w-full bg-zinc-950 flex items-center justify-center cursor-pointer group/video"
                      >
                        <video
                          src={item.url}
                          preload="metadata"
                          muted
                          playsInline
                          className="h-full w-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Play button overlay */}
                        <div className="absolute h-12 w-12 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover/video:scale-110 transition-transform duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 ml-0.5">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>

                        <span className="absolute bottom-2.5 left-2.5 text-[8px] font-black uppercase tracking-widest text-zinc-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          Direct Video
                        </span>
                      </div>
                    )}

                    {/* Tag badge */}
                    {item.tags && item.tags.length > 0 && (
                      <span className="absolute top-2.5 left-2.5 inline-flex px-2 py-0.5 rounded-full text-[8px] uppercase font-black tracking-widest bg-zinc-950/80 backdrop-blur-md text-orange-500 border border-orange-500/20">
                        {item.tags[0]}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase select-none tracking-wider block">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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
                    {item.tags && item.tags.map((tag) => (
                      <span key={tag} className="inline-block text-[8px] uppercase font-bold text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded-md border border-zinc-800/60 shrink-0">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleDeleteMedia(item)}
                    className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-red-500/20 hover:bg-red-500/5 rounded-xl text-zinc-500 hover:text-red-400 transition-all cursor-pointer shrink-0"
                    title="Remove Media"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
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
              No {activeTab.toLowerCase()} uploads in database yet.
            </p>
            <p className="text-xs text-zinc-600 font-semibold">
              Click &quot;Add New {activeTab}&quot; to upload your first {activeTab.toLowerCase()} asset to MinIO storage.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DIRECT INLINE VIDEO PLAYER MODAL (Watermark-Free, Plays In-Page Directly) */}
      {/* ========================================================================= */}
      {activeVideoToPlay && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  {activeVideoToPlay.title}
                </h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  {activeVideoToPlay.shortDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoToPlay(null)}
                className="h-8 w-8 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            {/* Native HTML5 Video Player - Zero Watermark, Zero Third-Party Branding */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={activeVideoToPlay.url}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            </div>

            {/* Video Footer Info */}
            <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex gap-1.5">
                {activeVideoToPlay.tags && activeVideoToPlay.tags.map((tag) => (
                  <span key={tag} className="text-[9px] uppercase font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                Direct In-Website Player
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UPLOAD MEDIA MODAL (Uploads to MinIO S3 Object Storage)                  */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <form
            onSubmit={handleAddMediaSubmit}
            className="my-auto mx-auto relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800/80 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col gap-4 sm:gap-5 animate-fade-in-up"
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
                Upload New {mediaType}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                Save directly to MinIO storage for watermark-free showcase
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Media Type Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Media Type</label>
                <div className="flex border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 select-none text-[10px] font-black uppercase tracking-wider p-0.5 w-full">
                  {(["Photo", "Video"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setMediaType(type);
                        setSelectedFile(null);
                        setFilePreview("");
                      }}
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
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${mediaType === "Video" ? "Aerial Fireworks Finale Display" : "Diwali Sparklers Close-Up"}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High altitude sparkling shells bursting over Sivakasi."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  Tags (Comma-Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sparklers, Aerial, Sivakasi"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 rounded-xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* File Upload Section */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block mb-1">
                  {mediaType === "Video" ? "Video File (.mp4, .webm, .mov)" : "Image File (.png, .jpg, .webp)"}
                </label>
                <div className="relative border border-dashed border-zinc-800 hover:border-orange-500/30 rounded-xl p-4 bg-zinc-950 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[80px]">
                  <input
                    type="file"
                    accept={mediaType === "Video" ? "video/mp4,video/webm,video/ogg,video/quicktime" : "image/*"}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-orange-500">
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                    {selectedFile ? selectedFile.name : `Select ${mediaType} from Computer`}
                  </span>
                  <span className="text-[8px] text-zinc-600 font-semibold">
                    Saved directly into MinIO storage
                  </span>
                </div>

                {/* Preview Box */}
                {filePreview && (
                  <div className="mt-2 relative rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center max-h-36">
                    {mediaType === "Photo" ? (
                      <img src={filePreview} alt="Preview" className="h-36 w-full object-cover" />
                    ) : (
                      <video src={filePreview} controls muted className="h-36 w-full object-contain" />
                    )}
                  </div>
                )}
              </div>
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
                <span>{isSubmitting ? "Uploading..." : `Save ${mediaType}`}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
