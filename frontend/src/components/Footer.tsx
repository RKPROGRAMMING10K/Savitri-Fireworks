"use client";

import React from "react";
import Link from "next/link";
import FooterCanvas from "@/components/FooterCanvas";

export default function Footer() {
  return (
    <footer className="relative w-full py-20 bg-zinc-950 text-zinc-400 overflow-hidden z-30">
      
      {/* Animated 2px high Spark Fuse Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] animate-spark-border" />
      
      {/* Soft glowing ambient circles behind the columns */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

      {/* Local Pyrotechnics Emitter Canvas */}
      <FooterCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand details */}
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-xl shadow-lg transition-transform duration-500 group-hover:rotate-[360deg]">
                S
              </span>
              <span className="text-white text-lg font-black tracking-widest uppercase transition-colors duration-300 group-hover:text-orange-400">
                Savitri <span className="text-orange-500">Fireworks</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              India's premier manufacturer of high-altitude display shells, eco-friendly green sparklers, and child-safe celebration novelties. Lighting up memories since 1990.
            </p>
            
            {/* Social Media Link Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {["facebook", "twitter", "instagram", "youtube"].map((social, sIdx) => (
                <a
                  key={sIdx}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md group"
                  aria-label={`Savitri Fireworks on ${social}`}
                >
                  <span className="text-xs font-black capitalize group-hover:rotate-12 transition-transform duration-300">
                    {social.charAt(0)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-widest relative pb-2 border-b border-white/10 w-24">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Gallery", href: "/gallery" },
                { name: "Where to Buy", href: "/where-to-buy" }
              ].map((link, lIdx) => (
                <li key={lIdx}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-400 transition-colors footer-link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4 text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-widest relative pb-2 border-b border-white/10 w-36">
              Contact Details
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold">
              <li className="flex items-start gap-3 group text-zinc-400 hover:text-white transition-colors duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-colors duration-300 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500 transition-transform duration-300 group-hover:scale-110">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.655 7.587a15.223 15.223 0 002.573 1.938 5.568 5.568 0 00.462.208zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="leading-relaxed">Amlner road.parola SH 48, Bodarde, Maharashtra 425111, India</span>
              </li>
              <li className="flex items-center gap-3 group text-zinc-400 hover:text-white transition-colors duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-colors duration-300 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500 transition-transform duration-300 group-hover:scale-110">
                    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.222a1.5 1.5 0 01-1.004 1.707l-1.9.633a12.045 12.045 0 005.653 5.653l.633-1.9a1.5 1.5 0 011.707-1.004l3.222.716A1.5 1.5 0 0118 13.852V15a1.5 1.5 0 01-1.5 1.5h-1.15a13.5 13.5 0 01-13-13z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>+91 2597 293 116</span>
              </li>
              <li className="flex items-center gap-3 group text-zinc-400 hover:text-white transition-colors duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-colors duration-300 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500 transition-transform duration-300 group-hover:scale-110">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </div>
                <span>info@savitrifireworks.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Certifications & Safety */}
          <div className="space-y-4 text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-widest relative pb-2 border-b border-white/10 w-36">
              Factory Licenses
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold text-zinc-400">
              {[
                "PESO Factory License: Exp-4039/TN",
                "CSIR-NEERI Green License: 382/2026",
                "ISO 9001:2015 Safety Certified",
                "100% Child-Labor-Free Guarantee"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 group hover:text-white transition-colors duration-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 group-hover:scale-150 transition-transform duration-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-zinc-500 space-y-4 md:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Savitri Fireworks Private Limited. All rights reserved.
          </div>
          <div className="flex gap-6">
            {[
              { name: "Terms of Service", href: "/terms-of-service" },
              { name: "Privacy Policy", href: "/privacy-policy" },
            ].map((subLink, sIdx) => (
              <Link
                key={sIdx}
                href={subLink.href}
                className="hover:text-orange-500 transition-colors footer-link-underline"
              >
                {subLink.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
