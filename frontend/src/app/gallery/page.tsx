"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";
import { mediaService } from "@/services/media/mediaService";
import { MediaDto } from "@/services/media/dto/media.dto";

// Helper to extract YouTube embed URL if a third-party link is used
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=0&rel=0&modestbranding=1`
    : null;
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [mediaItems, setMediaItems] = useState<MediaDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<MediaDto | null>(null);

  // 1. Fetch Media dynamically from Backend API based on activeTab
  useEffect(() => {
    let isMounted = true;
    async function loadMedia() {
      setIsLoading(true);
      try {
        const targetType = activeTab === "photos" ? "Photo" : "Video";
        const res = await mediaService.getMedia({
          type: targetType,
          limit: 100,
        });
        if (isMounted) {
          setMediaItems(res.items || []);
        }
      } catch (err) {
        console.error("Failed to load gallery media:", err);
        if (isMounted) {
          setMediaItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMedia();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // 2. Lightbox Keyboard Navigation (Esc, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
        setActiveVideo(null);
      } else if (e.key === "ArrowLeft" && lightboxIndex !== null && mediaItems.length > 0) {
        setLightboxIndex((prev) =>
          prev !== null ? (prev === 0 ? mediaItems.length - 1 : prev - 1) : null
        );
      } else if (e.key === "ArrowRight" && lightboxIndex !== null && mediaItems.length > 0) {
        setLightboxIndex((prev) =>
          prev !== null ? (prev === mediaItems.length - 1 ? 0 : prev + 1) : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, mediaItems.length]);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null || mediaItems.length === 0) return;
    setLightboxIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : (prev as number) - 1
    );
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null || mediaItems.length === 0) return;
    setLightboxIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : (prev as number) + 1
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative">
      {/* Background canvas floating sparks */}
      <FireworksCanvas />

      {/* SECTION 1: BREADCRUMB HERO (z-20, transparent bg, locked cinematic dark backdrop overlay) */}
      <section className="relative w-full py-32 flex items-center justify-center overflow-hidden z-20 bg-zinc-950">
        <BreadcrumbCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-0" />

        {/* Animated ambient background particles */}
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

        {/* Content Overlay */}
        <div className="max-w-[1600px] mx-auto w-full text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10 relative">
          {/* Styled Floating Glassmorphic Breadcrumb Pill */}
          <div className="flex justify-center animate-slide-up-fade">
            <nav className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/5 dark:bg-black/40 border border-white/10 dark:border-zinc-800 backdrop-blur-md rounded-full shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-500 select-none group">
              {/* Home link */}
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

              {/* Chevron */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="h-3.5 w-3.5 text-zinc-600 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>

              {/* Active navigation indicator */}
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span>Gallery</span>
              </div>
            </nav>
          </div>

          <h1
            className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade"
            style={{ animationDelay: "100ms" }}
          >
            Our Gallery{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              of Light
            </span>
          </h1>
          <p
            className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade"
            style={{ animationDelay: "200ms" }}
          >
            Experience spectacular celebrations through our visual collection of high-resolution festival photographs and loopable video reels.
          </p>
        </div>
      </section>

      {/* SECTION 2: GALLERY GRID (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-16 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Navigation Tabs - Centered Toggle Pill */}
          <div className="flex justify-center relative z-30 animate-fade-in">
            <div className="inline-flex p-1 bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-full shadow-lg">
              <button
                onClick={() => {
                  setActiveTab("photos");
                  setLightboxIndex(null);
                  setActiveVideo(null);
                }}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  activeTab === "photos"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/15"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => {
                  setActiveTab("videos");
                  setLightboxIndex(null);
                  setActiveVideo(null);
                }}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  activeTab === "videos"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/15"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Videos
              </button>
            </div>
          </div>

          {/* GRID CONTENT DISPLAY */}
          <div className="relative z-30">
            {isLoading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-[2rem] bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 p-3 shadow-lg animate-pulse"
                  >
                    <div
                      className={`w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800 ${
                        activeTab === "photos" ? "h-60" : "aspect-[9/16]"
                      }`}
                    />
                    <div className="pt-4 pb-2 px-1.5 space-y-2">
                      <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                      <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : mediaItems.length === 0 ? (
              /* Clean Dynamic Empty State */
              <div className="text-center py-20 px-4 max-w-lg mx-auto bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md rounded-[2.5rem] border border-zinc-200/80 dark:border-white/10 shadow-xl">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 mb-4 border border-orange-500/20 shadow-inner">
                  {activeTab === "photos" ? (
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
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  ) : (
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
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                  {activeTab === "photos" ? "No Photographs Uploaded Yet" : "No Videos Uploaded Yet"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-sm mx-auto mb-6">
                  {activeTab === "photos"
                    ? "Our celebration captures and festival photos are being curated. Check back soon for high-resolution visual displays!"
                    : "Our fireworks demonstration reels and event highlights are being prepared. Stay tuned for stunning spectacle videos!"}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <span>Browse Fireworks Catalog</span>
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
              </div>
            ) : activeTab === "photos" ? (
              /* Photos Grid with staggered entrance fade animations */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {mediaItems.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="group rounded-[2rem] bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-3 shadow-lg hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-slide-up-fade relative overflow-hidden"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Visual 3D Offset Border */}
                    <div className="absolute top-4 -left-4 w-full h-full bg-orange-500/5 rounded-[1.6rem] border border-orange-500/5 pointer-events-none group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 z-0" />
                    <div className="absolute inset-0 border border-orange-500/10 rounded-[2.8rem] pointer-events-none group-hover:scale-[1.01] group-hover:border-orange-500/30 transition-all duration-500 z-0" />

                    <div className="relative h-60 w-full rounded-2xl overflow-hidden z-10 bg-zinc-950 flex items-center justify-center">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Zoom Indicator Icon Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
                            />
                          </svg>
                        </span>
                      </div>

                      {/* Photo tag/category badge */}
                      {photo.tags && photo.tags.length > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
                          {photo.tags[0]}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 pb-2 text-left px-1.5 relative z-10">
                      <h3 className="text-md font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug line-clamp-1">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-1 line-clamp-2">
                        {photo.shortDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Videos Grid (Reels & Shorts Proportioned Vertical Cards 9:16) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {mediaItems.map((video, idx) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className="group rounded-[2rem] bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-3 shadow-lg hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-slide-up-fade relative overflow-hidden"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* Visual 3D Offset Border */}
                    <div className="absolute top-4 -left-4 w-full h-full bg-orange-500/5 rounded-[1.6rem] border border-orange-500/5 pointer-events-none group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 z-0" />
                    <div className="absolute inset-0 border border-orange-500/10 rounded-[2.8rem] pointer-events-none group-hover:scale-[1.01] group-hover:border-orange-500/30 transition-all duration-500 z-0" />

                    {/* Vertical Aspect ratio display (9:16) matching Reels/Shorts */}
                    <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden z-10 bg-zinc-950">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 opacity-80 group-hover:opacity-60 transition-all duration-700"
                        />
                      ) : (
                        <video
                          src={`${video.url}#t=0.5`}
                          preload="metadata"
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-700"
                        />
                      )}

                      {/* Dark overlay with play triggers */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 flex flex-col justify-between p-4 text-left">
                        {/* Top: Tag & duration */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[8px] font-black uppercase tracking-wider backdrop-blur-sm">
                            {video.tags?.[0] || "Shorts / Video"}
                          </span>
                          <span className="text-[10px] font-black text-white/80">Play In-Page</span>
                        </div>

                        {/* Center: Glowing play pulse button */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                          {/* Inner pulse */}
                          <div className="absolute inset-0 rounded-full border border-orange-500 animate-ping opacity-60 group-hover:hidden" />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6 text-white translate-x-0.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>

                        {/* Bottom text descriptions */}
                        <div className="space-y-1">
                          <h3 className="text-sm md:text-base font-black text-white leading-tight line-clamp-1">
                            {video.title}
                          </h3>
                          <p className="text-[10px] text-zinc-300 font-semibold line-clamp-2 leading-relaxed">
                            {video.shortDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {lightboxIndex !== null && mediaItems[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
        >
          {/* Top Row: Close and Index info */}
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto py-2 z-10 relative">
            <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">
              Photo {lightboxIndex + 1} of {mediaItems.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 shadow-md cursor-pointer"
              aria-label="Close lightbox"
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
          </div>

          {/* Center Content: Image & Navigation */}
          <div className="flex-1 flex items-center justify-center relative w-full z-0 my-4">
            {/* Prev Trigger */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 md:left-10 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
              aria-label="Previous Photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Main Image View */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[75vh] max-w-full md:max-w-4xl p-2 bg-zinc-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative group"
            >
              <img
                src={mediaItems[lightboxIndex].url}
                alt={mediaItems[lightboxIndex].title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl animate-scale-up"
              />
            </div>

            {/* Next Trigger */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 md:right-10 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
              aria-label="Next Photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Bottom Row: Text Caption */}
          <div className="w-full max-w-2xl mx-auto text-center py-4 space-y-1.5 z-10 relative">
            {mediaItems[lightboxIndex].tags && mediaItems[lightboxIndex].tags.length > 0 && (
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
                {mediaItems[lightboxIndex].tags.join(" • ")}
              </span>
            )}
            <h2 className="text-xl font-black text-white leading-tight">
              {mediaItems[lightboxIndex].title}
            </h2>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-lg mx-auto">
              {mediaItems[lightboxIndex].shortDesc}
            </p>
          </div>
        </div>
      )}

      {/* FULLSCREEN WATERMARK-FREE DIRECT VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 shadow-md cursor-pointer z-50"
            aria-label="Close video player"
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

          {/* Player Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-slide-up-fade flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/60 select-none">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {activeVideo.title}
                </h3>
                <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                  {activeVideo.shortDesc}
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider">
                Direct In-Page Player
              </span>
            </div>

            {/* Video Canvas / Player Area */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {getYouTubeEmbedUrl(activeVideo.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.url)!}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={activeVideo.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Video Footer Info */}
            <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {activeVideo.tags &&
                  activeVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Watermark-Free
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
