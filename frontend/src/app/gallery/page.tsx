"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";

interface PhotoItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  category: string;
}

interface VideoItem {
  id: string;
  title: string;
  desc: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
}

const mockPhotos: PhotoItem[] = [
  {
    id: "p1",
    title: "Diwali Sparkler Joy",
    caption: "Family lighting up chemical-safe gold sparklers in Sivakasi.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    category: "Diwali Celebrations",
  },
  {
    id: "p2",
    title: "Golden Willow Canopy",
    caption: "A 120-shot high-altitude display shell bursting over a lake.",
    image: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=800&auto=format&fit=crop",
    category: "Aerial Displays",
  },
  {
    id: "p3",
    title: "Peacock Tail Fountain",
    caption: "Dense silver and gold fountain spray reaching 10 feet high.",
    image: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=800&auto=format&fit=crop",
    category: "Fountain Blasts",
  },
  {
    id: "p4",
    title: "Wedding Sparkler Path",
    caption: "Bride and groom walking through a pathway of cold sparklers.",
    image: "https://images.unsplash.com/photo-1533230898524-651547ec48f1?q=80&w=800&auto=format&fit=crop",
    category: "Weddings",
  },
  {
    id: "p5",
    title: "Ground Spinner Rings",
    caption: "Concentric rings of bright whistling chakras spinning on concrete.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    category: "Ground Chakras",
  },
  {
    id: "p6",
    title: "Rocket Launch Trial",
    caption: "A vertical sky rocket taking off with a whistling heat trail.",
    image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?q=80&w=800&auto=format&fit=crop",
    category: "Aerial Displays",
  },
  {
    id: "p7",
    title: "Child-Safe Sparkler Fun",
    caption: "Children enjoying gold wire sparklers under parent supervision.",
    image: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=800&auto=format&fit=crop",
    category: "Diwali Celebrations",
  },
  {
    id: "p8",
    title: "Midnight Starburst",
    caption: "Sky burst shell scattering ruby red strobe points.",
    image: "https://images.unsplash.com/photo-1547841243-eacb14453cd9?q=80&w=800&auto=format&fit=crop",
    category: "Aerial Displays",
  },
  {
    id: "p9",
    title: "Curated Gift Selections",
    caption: "Premium assortment box packed in moisture-resistant seals.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    category: "Gift Sets",
  },
  {
    id: "p10",
    title: "Festive Sparkler Night",
    caption: "Close-up of a slow-burning green sparkler throwing bright flares.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
    category: "Weddings",
  },
  {
    id: "p11",
    title: "Silver Volcanic Spray",
    caption: "Volcano cone pot erupting in bright silver crackles.",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=800&auto=format&fit=crop",
    category: "Fountain Blasts",
  },
  {
    id: "p12",
    title: "Corporate Skyline Show",
    caption: "Public aerial fireworks show lighting up a harbor skyline.",
    image: "https://images.unsplash.com/photo-1547841243-eacb14453cd9?q=80&w=800&auto=format&fit=crop",
    category: "Aerial Displays",
  },
];

const mockVideos: VideoItem[] = [
  {
    id: "v1",
    title: "120 Shots Cake Test",
    desc: "Testing our premium high-altitude aerial display cake at Sivakasi.",
    youtubeId: "T55vW3q309w",
    thumbnail: "https://images.unsplash.com/photo-1536746803623-cef87080bfc8?q=80&w=600",
    duration: "0:30",
  },
  {
    id: "v2",
    title: "Whistling Chakra Spin",
    desc: "Demonstrating concentric gold rings and whistlers.",
    youtubeId: "Zt4S0lVvWp0",
    thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600",
    duration: "0:15",
  },
  {
    id: "v3",
    title: "Safe Kids Sparkler Guide",
    desc: "Parent tutorial on safe usage of wire sparklers.",
    youtubeId: "9h7LupM0Y_I",
    thumbnail: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=600",
    duration: "0:45",
  },
  {
    id: "v4",
    title: "Peacock Pot Eruption",
    desc: "Close-up of a 10-foot gold volcanic spray fountain.",
    youtubeId: "P5v71t8lI_Y",
    thumbnail: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=600",
    duration: "0:20",
  },
  {
    id: "v5",
    title: "Garland String Chain Crackle",
    desc: "Firing our 1000 Wala garland chain cracker in testing grounds.",
    youtubeId: "y9wT5_w81qY",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600",
    duration: "0:35",
  },
  {
    id: "v6",
    title: "Pencil Candle Color Shifts",
    desc: "Watch standard pencil candles shift colors slowly.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=600",
    duration: "0:18",
  },
  {
    id: "v7",
    title: "Multi-Shot Aerial Comet",
    desc: "Watch comets soar up and explode in sequence.",
    youtubeId: "zZt4Sw0p9W0",
    thumbnail: "https://images.unsplash.com/photo-1547841243-eacb14453cd9?q=80&w=600",
    duration: "0:25",
  },
  {
    id: "v8",
    title: "Traditional Laxmi Bomb report",
    desc: "Listen to the sharp report of Laxmi Bombs.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600",
    duration: "0:12",
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === 0 ? mockPhotos.length - 1 : (prev as number) - 1
    );
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === mockPhotos.length - 1 ? 0 : (prev as number) + 1
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
          <div className="absolute bottom-10 left-1/4 h-2 w-2 rounded-full bg-orange-500 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute top-1/4 right-1/3 h-3 w-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDuration: "2s" }} />
          <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" style={{ animationDuration: "4s" }} />
        </div>

        {/* Content Overlay */}
        <div className="max-w-[1600px] mx-auto w-full text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10 relative">
          
          {/* Styled Floating Glassmorphic Breadcrumb Pill */}
          <div className="flex justify-center animate-slide-up-fade">
            <nav className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/5 dark:bg-black/40 border border-white/10 dark:border-zinc-800 backdrop-blur-md rounded-full shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-500 select-none group">
              {/* Home link */}
              <Link href="/" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-orange-400 transition-colors group/home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500 transition-all duration-300 group-hover/home:scale-110 group-hover/home:rotate-12">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                <span>Home</span>
              </Link>
              
              {/* Chevron */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5 text-zinc-600 transition-transform duration-300 group-hover:translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
            Our Gallery{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              of Light
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade" style={{ animationDelay: "200ms" }}>
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
                onClick={() => setActiveTab("photos")}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  activeTab === "photos"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/15"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveTab("videos")}
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
            {activeTab === "photos" ? (
              
              /* Photos Grid with staggered entrance fade animations */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {mockPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="group rounded-[2rem] bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-3 shadow-lg hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-slide-up-fade relative overflow-hidden"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* Visual 3D Offset Border */}
                    <div className="absolute top-4 -left-4 w-full h-full bg-orange-500/5 rounded-[1.6rem] border border-orange-500/5 pointer-events-none group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 z-0" />
                    <div className="absolute inset-0 border border-orange-500/10 rounded-[2.8rem] pointer-events-none group-hover:scale-[1.01] group-hover:border-orange-500/30 transition-all duration-500 z-0" />

                    <div className="relative h-60 w-full rounded-2xl overflow-hidden z-10 bg-zinc-100 dark:bg-zinc-950">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Zoom Indicator Icon Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                          </svg>
                        </span>
                      </div>
                      
                      {/* Photo category badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
                        {photo.category}
                      </span>
                    </div>

                    <div className="pt-4 pb-2 text-left px-1.5 relative z-10">
                      <h3 className="text-md font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mt-1">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              
              /* Videos Grid (Reels & Shorts Proportioned Vertical Cards 9:16) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {mockVideos.map((video, idx) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className="group rounded-[2rem] bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 p-3 shadow-lg hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-slide-up-fade relative overflow-hidden"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    {/* Visual 3D Offset Border */}
                    <div className="absolute top-4 -left-4 w-full h-full bg-orange-500/5 rounded-[1.6rem] border border-orange-500/5 pointer-events-none group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 z-0" />
                    <div className="absolute inset-0 border border-orange-500/10 rounded-[2.8rem] pointer-events-none group-hover:scale-[1.01] group-hover:border-orange-500/30 transition-all duration-500 z-0" />

                    {/* Vertical Aspect ratio display (9:16) matching Reels/Shorts */}
                    <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden z-10 bg-zinc-950">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 opacity-80 group-hover:opacity-60 transition-all duration-700"
                      />
                      
                      {/* Dark overlay with play triggers */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 flex flex-col justify-between p-4 text-left">
                        {/* Top: Tag & duration */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[8px] font-black uppercase tracking-wider backdrop-blur-sm">
                            Shorts / Reels
                          </span>
                          <span className="text-[10px] font-black text-white/80">{video.duration}</span>
                        </div>

                        {/* Center: Glowing play pulse button */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                          {/* Inner pulse */}
                          <div className="absolute inset-0 rounded-full border border-orange-500 animate-ping opacity-60 group-hover:hidden" />
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white translate-x-0.5">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                          </svg>
                        </div>

                        {/* Bottom text descriptions */}
                        <div className="space-y-1">
                          <h3 className="text-sm md:text-base font-black text-white leading-tight">
                            {video.title}
                          </h3>
                          <p className="text-[10px] text-zinc-300 font-semibold line-clamp-2 leading-relaxed">
                            {video.desc}
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
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
        >
          {/* Top Row: Close and Index info */}
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto py-2 z-10 relative">
            <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">
              Photo {lightboxIndex + 1} of {mockPhotos.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 shadow-md cursor-pointer"
              aria-label="Close lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Main Image View */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[75vh] max-w-full md:max-w-4xl p-2 bg-zinc-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative group"
            >
              <img
                src={mockPhotos[lightboxIndex].image}
                alt={mockPhotos[lightboxIndex].title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl animate-scale-up"
              />
            </div>

            {/* Next Trigger */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 md:right-10 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
              aria-label="Next Photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

          </div>

          {/* Bottom Row: Text Caption */}
          <div className="w-full max-w-2xl mx-auto text-center py-4 space-y-1.5 z-10 relative">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
              {mockPhotos[lightboxIndex].category}
            </span>
            <h2 className="text-xl font-black text-white leading-tight">
              {mockPhotos[lightboxIndex].title}
            </h2>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-lg mx-auto">
              {mockPhotos[lightboxIndex].caption}
            </p>
          </div>
        </div>
      )}

      {/* FULLSCREEN VIDEO REELS LIGHTBOX */}
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Vertical Aspect frame 9:16 mimicking YouTube Shorts player */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="aspect-[9/16] h-[85vh] w-full max-w-[430px] rounded-[2rem] border border-white/10 bg-black shadow-2xl relative overflow-hidden animate-slide-up-fade"
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=0&loop=1&playlist=${activeVideo.youtubeId}`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}
