"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import TypingFireQuote from "@/components/TypingFireQuote";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative">
      
      {/* 1. Viewport-Fixed Fireworks Canvas (At z-10, spans the entire scroll) */}
      <FireworksCanvas />

      {/* 2. SECTION 1: ABOUT BREADCRUMB HERO (z-20, transparent bg, locked cinematic dark backdrop overlay) */}
      <section className="relative w-full py-32 flex items-center justify-center overflow-hidden z-20 bg-zinc-950">
        
        {/* Real-time pyrotechnic banner fireworks */}
        <BreadcrumbCanvas />

        {/* Edge overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-0" />

        {/* Animated background embers inside the banner overlay */}
        <div className="absolute inset-0 overflow-hidden z-0 opacity-40 pointer-events-none">
          <div className="absolute bottom-10 left-1/4 h-2 w-2 rounded-full bg-orange-500 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute top-1/4 right-1/3 h-3 w-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDuration: "2s" }} />
          <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" style={{ animationDuration: "4s" }} />
        </div>

        {/* Content Overlay */}
        <div className="max-w-7xl mx-auto w-full text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10 relative">
          
          {/* Styled Floating Glassmorphic Breadcrumb Pill */}
          <div className="flex justify-center animate-slide-up-fade">
            <nav className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/5 dark:bg-black/40 border border-white/10 dark:border-zinc-800 backdrop-blur-md rounded-full shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-500 select-none group">
              {/* Home Link with SVG Icon */}
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
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                <span>Home</span>
              </Link>
              
              {/* Chevron Separator */}
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
              
              {/* Active Item with pulsating ping dot */}
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span>About Us</span>
              </div>
            </nav>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
            Light Up Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Moments
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade" style={{ animationDelay: "200ms" }}>
            Discover the passion, craftsmanship, and safety engineering that goes into every Savitri celebration sparkler.
          </p>
        </div>
      </section>

      {/* 3. SECTION 2: ABOUT US DETAIL (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Column 1: Left - Narrative Content */}
            <div className="space-y-6 text-left relative z-30">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                About Our Journey
              </div>
              
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-tight">
                Crafting Sparks of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                  Joy & Wonder
                </span>
              </h2>

              <div className="space-y-5 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 font-semibold">
                  At Savitri, our journey is defined by a commitment to brilliant colors, stable ignition, and family trust.
                </p>
                <p>
                  What started as a dedicated local workshop has evolved into one of the country's most reliable suppliers of high-altitude display shells, sparklers, and kid-safe fountains. We blend traditional handcrafting with strict chemical laboratory tests to ensure stable performance every single time.
                </p>
                <p>
                  Each product in our catalog undergoes multiple quality checks before leaving the facility, ensuring uniform delays and rich color drop patterns that bring your family gatherings to life.
                </p>
              </div>
            </div>

            {/* Column 2: Right - 3D Offset Parallax Celebration Image */}
            <div className="relative z-30 flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-3xl pointer-events-none" />

              <div className="relative group animate-float-slow max-w-md md:max-w-lg w-full p-4">
                {/* 3D Offset shadow layer */}
                <div className="absolute top-8 -left-8 w-full h-full bg-orange-500/5 dark:bg-orange-500/5 rounded-[2.5rem] border border-orange-500/10 dark:border-orange-500/5 pointer-events-none group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 z-0" />
                
                {/* Outer frame */}
                <div className="absolute inset-0 border border-orange-500/20 dark:border-orange-500/10 rounded-[2.5rem] pointer-events-none group-hover:scale-[1.02] group-hover:border-orange-500/40 transition-all duration-500 z-0" />
                
                {/* Main Image Frame */}
                <div className="p-3 bg-white dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10">
                  <div className="relative h-96 w-full rounded-[2rem] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1533230898524-651547ec48f1?q=80&w=800&auto=format&fit=crop"
                      alt="Festive Celebrations with Savitri Fireworks"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION 3: WELCOME & DYNAMIC STAT COUNTERS (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Column 1: Left - Factory / Crafting image with reversed 3D offset */}
            <div className="relative z-30 flex justify-center lg:justify-start">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-red-500/10 dark:bg-red-500/5 blur-3xl pointer-events-none" />

              <div className="relative group animate-float-slow max-w-md md:max-w-lg w-full p-4">
                <div className="absolute top-8 -right-8 w-full h-full bg-red-500/5 dark:bg-red-500/5 rounded-[2.5rem] border border-red-500/10 dark:border-red-500/5 pointer-events-none group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 z-0" />
                <div className="absolute inset-0 border border-red-500/20 dark:border-red-500/10 rounded-[2.5rem] pointer-events-none group-hover:scale-[1.02] group-hover:border-red-500/40 transition-all duration-500 z-0" />
                <div className="p-3 bg-white dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10">
                  <div className="relative h-96 w-full rounded-[2rem] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
                      alt="Artisanal Hand-rolling at Sivakasi"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Right - Welcome message and Counters */}
            <div className="space-y-8 text-left relative z-30">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                  Welcome to Savitri
                </div>
                
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-tight">
                  Vibrant Colors &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-amber-500">
                    High Performance
                  </span>
                </h2>
                
                <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  We design our fireworks to achieve maximum height and visual brilliance while maintaining standard safety thresholds. By combining certified materials with rigorous product designs, we ensure every burst is a memorable highlight.
                </p>
              </div>

              {/* Dynamic Counters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                {[
                  { count: "150+", label: "Premium Products", desc: "A massive variety of sky shells, sparklers, and kid-safe fountains." },
                  { count: "500+", label: "Licensed Dealers", desc: "Certified retail partners ensuring official, safe distribution." },
                  { count: "1M+", label: "Happy Customers", desc: "Milestones lit up across wedding halls and family homes." }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 shadow-md hover:shadow-lg hover:border-orange-500/30 transition-all duration-300 text-left group"
                  >
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-500 group-hover:scale-105 transition-transform duration-300">
                      {stat.count}
                    </div>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white mt-1 group-hover:text-orange-500 transition-colors">
                      {stat.label}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed font-medium">
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECTION 4: SAFE TO USE GUIDELINES (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Column 1: Left - Safe to use Details */}
            <div className="space-y-6 text-left relative z-30">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                Certified Safety First
              </div>
              
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-tight">
                Our Safety Standards &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500">
                  Quality Controls
                </span>
              </h2>

              <div className="space-y-4 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 font-semibold">
                  At Savitri, quality control is a science. We test every formulation strictly to meet official safety standards.
                </p>
                
                {/* Checkpoint list */}
                <div className="space-y-3.5 pt-2">
                  {[
                    "Certified Manufacturing Standards: Our production follows official industrial guidelines for explosive material blending.",
                    "Eco-Friendly Sparkler Recipes: Utilizing lower emission compounds that reduce particulate smoke by up to 30%.",
                    "Thermal Protection Shells: Custom humidity barrier wrapping prevents chemical dampness and ensures stable lighting.",
                    "Labor-Free Fair Practices: We strictly implement legal, fair, and safe working conditions across all our packing units."
                  ].map((tip, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-xs md:text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Right - Safety Badge Display image */}
            <div className="relative z-30 flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />

              <div className="relative group animate-float-slow max-w-md md:max-w-lg w-full p-4">
                <div className="absolute top-8 -left-8 w-full h-full bg-emerald-500/5 dark:bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-500/5 pointer-events-none group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 z-0" />
                <div className="absolute inset-0 border border-emerald-500/20 dark:border-emerald-500/10 rounded-[2.5rem] pointer-events-none group-hover:scale-[1.02] group-hover:border-emerald-500/40 transition-all duration-500 z-0" />
                <div className="p-3 bg-white dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10">
                  <div className="relative h-96 w-full rounded-[2rem] overflow-hidden bg-zinc-950 flex flex-col justify-center items-center p-8 text-center border border-white/5">
                    {/* Big shield icon */}
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5 mb-6 group-hover:scale-110 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-lg font-black tracking-widest uppercase">
                      PESO SAFETY STAMP
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-2 max-w-xs">
                      Certified by the Petroleum and Explosives Safety Organisation (PESO), Department for Promotion of Industry and Internal Trade, Government of India.
                    </p>
                    <div className="mt-6 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest">
                      License Active 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SECTION 5: WHY CHOOSE US (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Heading */}
          <div className="text-center space-y-3 relative z-30">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
              Our Core Strengths
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-none animate-slide-up-fade">
              Why Choose Savitri
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              We stand apart in our commitment to quality, eco-conscious pyrotechnics, and seamless logistical execution.
            </p>
          </div>

          {/* Core Strengths 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-30">
            {[
              {
                title: "Vast Product Variety",
                desc: "Offering over 150 unique items including multi-shot sky shell cakes, ground chakras, sparklers, and kid-safe fountains.",
                color: "from-amber-500 via-orange-500 to-red-500",
                svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                  </svg>
                )
              },
              {
                title: "Lower Smoke Emissions",
                desc: "We strictly adopt CSIR-NEERI recipes. By substituting toxic chemical formulas, we deliver brilliant sparks with 30% lower smoke.",
                color: "from-emerald-500 via-teal-500 to-cyan-500",
                svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6 text-emerald-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5a1.5 1.5 0 001.5 1.5H18M3 9.75L12 3l9 6.75M4.5 19.5h15" />
                  </svg>
                )
              },
              {
                title: "Secure Distribution Network",
                desc: "Secure door-to-door delivery handled through officially certified explosive cargo transit agents, keeping transactions 100% legal.",
                color: "from-blue-500 via-indigo-500 to-purple-500",
                svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75M3.75 14.25h16.5M3.75 14.25V4.875A1.125 1.125 0 014.875 3.75h9.75a1.125 1.125 0 011.125 1.125V14.25m-12 0V4.875" />
                  </svg>
                )
              }
            ].map((strength, sIdx) => (
              <div
                key={sIdx}
                className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-orange-500/40 hover:-translate-y-2 transition-all duration-300 select-none group relative overflow-hidden"
              >
                {/* Visual side-border matching the theme */}
                <div className={`absolute top-0 left-0 bottom-0 w-[4px] bg-gradient-to-b ${strength.color}`} />
                
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-white/5 transition-transform duration-300 group-hover:scale-110 shadow-inner">
                    {strength.svg}
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {strength.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {strength.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. SECTION 6: WHO WE ARE - FIREWORK MANUFACTURING PROCESS (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Heading */}
          <div className="text-center space-y-3 relative z-30">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
              Our Craft
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-none">
              Our Production Steps
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              We combine traditional manual hand-crafting methods with strict laboratory safety science. Here is how we build the magic:
            </p>
          </div>

          {/* Staggered Timeline Grid representing Step-by-Step process */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-30">
            {[
              {
                step: "01",
                title: "Material Blending",
                desc: "We inspect chemical raw materials to select high-purity metallic salts that emit rich colors and low smoke.",
                color: "border-amber-500/30 text-amber-500",
                svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v17.792m0-17.792L5.438 7.417m4.312-4.313L14.06 7.42M3 18h18" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Casing Hand-Rolling",
                desc: "Artisans roll the outer casing by hand, keeping thickness symmetrical to guarantee vertical launches.",
                color: "border-orange-500/30 text-orange-500",
                svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Batch Field Testing",
                desc: "Samples from every production run are fired at our testing yards to verify burn rates and height standards.",
                color: "border-red-500/30 text-red-500",
                svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 006.1 2.323z" />
                  </svg>
                )
              },
              {
                step: "04",
                title: "Moisture-Proof Packaging",
                desc: "Products are enclosed in humidity seals and shipped in thick cardboard layers with barcoded tracing stamps.",
                color: "border-pink-500/30 text-pink-500",
                svg: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                )
              }
            ].map((process, pIdx) => (
              <div
                key={pIdx}
                className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-orange-500/40 hover:-translate-y-2 transition-all duration-300 select-none group text-left relative"
                style={{ animationDelay: `${pIdx * 150}ms` }}
              >
                {/* Big Step Number on top-right */}
                <div className="absolute top-6 right-8 text-4xl font-black text-zinc-200 dark:text-zinc-800/60 select-none tracking-tight group-hover:text-orange-500/20 transition-colors">
                  {process.step}
                </div>

                <div className="space-y-4 pt-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border group-hover:scale-110 transition-transform duration-300 bg-zinc-50 dark:bg-black shadow-inner ${process.color}`}>
                    {process.svg}
                  </div>
                  <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {process.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. SECTION 7: PRODUCTION STANDARDS & CORE ETHICS (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Column 1: Left - Narrative & Quote */}
            <div className="space-y-6 text-left relative z-30">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                Our Foundation
              </div>
              
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-tight">
                Production Standards &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                  Core Ethics
                </span>
              </h2>

              <div className="space-y-4 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                <p>
                  Located in a spacious, safety-zone layout, our Sivakasi manufacturing plant features isolated compounding units, drying yards, and secure storage spaces designed to protect our team and the surrounding environment.
                </p>
                <p>
                  Our corporate values are simple: **Safety** (zero-compromise manufacturing checks), **Integrity** (licensed materials and transparent labeling), and **Eco-consciousness** (investing in NEERI green cracker recipes).
                </p>
              </div>

              {/* Animated Lit-Fuse Typing Manifesto Quote */}
              <div className="pt-4 border-t border-zinc-200/30 dark:border-white/5">
                <TypingFireQuote />
              </div>
            </div>

            {/* Column 2: Right - Values Cards Stack */}
            <div className="space-y-6 relative z-30">
              {[
                { title: "Rigorous Safety Protocols", desc: "No chemical mixing is performed without double-shielded protective barriers." },
                { title: "Artisan Livelihood Support", desc: "Creating safe, legal, and fair employment programs for Sivakasi craftsmen." },
                { title: "Clean Tech Research", desc: "Investing in modern formulas to decrease emissions and eliminate toxic residues." }
              ].map((value, vIdx) => (
                <div
                  key={vIdx}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 shadow-md hover:shadow-lg hover:border-orange-500/30 transition-all duration-300 text-left group"
                >
                  <h4 className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-medium">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 9. SECTION 8: SHAREABLE ANIMATED FOOTER */}
      <Footer />

    </div>
  );
}
