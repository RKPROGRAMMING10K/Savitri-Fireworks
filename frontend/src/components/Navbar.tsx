"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  // Track scroll position to adjust navbar styles on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Synchronize theme and fullscreen on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Product", href: "/products", isDropdown: true },
    { name: "Gallery", href: "/gallery" },
    { name: "Where to Buy?", href: "/where-to-buy" },
  ];

  // Placeholder submenu items for Products
  const productSubmenu = [
    { name: "Sparklers", href: "/products#sparklers" },
    { name: "Crackers & Bombs", href: "/products#crackers" },
    { name: "Rockets", href: "/products#rockets" },
    { name: "Aerial Multi-Shots", href: "/products#multi-shots" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 transition-all duration-300 sm:px-6 lg:px-8 ${
        isScrolled ? "pb-2" : "pb-4"
      }`}
    >
      <nav
        className={`mx-auto max-w-7xl rounded-3xl border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md shadow-md transition-all duration-300 ${
          isScrolled
            ? "shadow-lg bg-white/80 dark:bg-zinc-950/80 scale-[0.99] border-white/30 dark:border-zinc-800/90"
            : ""
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                {/* Firework Logo Icon */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 animate-pulse"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 font-sans leading-none">
                    SAVITRI
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 font-sans uppercase leading-none mt-0.5">
                    FIREWORKS
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                if (link.isDropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setIsProductDropdownOpen(true)}
                      onMouseLeave={() => setIsProductDropdownOpen(false)}
                    >
                      <button
                        onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                          pathname.startsWith(link.href)
                            ? "bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white font-semibold"
                            : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        {link.name}
                        <svg
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isProductDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 mt-1 w-52 rounded-2xl border border-white/20 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-2 shadow-xl transition-all duration-200 origin-top-left ${
                          isProductDropdownOpen
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                        }`}
                      >
                        {productSubmenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block rounded-xl px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all duration-150"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white font-semibold"
                        : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action & Control Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 shadow-sm active:scale-95 cursor-pointer relative overflow-hidden group"
                aria-label="Toggle Fullscreen"
              >
                <div className="relative h-5 w-5">
                  {/* Enter Fullscreen Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-300 ease-in-out ${
                      isFullscreen ? "scale-0 opacity-0 rotate-45" : "scale-100 opacity-100 rotate-0"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15"
                    />
                  </svg>
                  {/* Exit Fullscreen Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-300 ease-in-out ${
                      isFullscreen ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-45"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 3.75v3c0 .414-.336.75-.75.75h-3m3-3.75L5.25 6.75m13.5-3v3c0 .414-.336.75-.75.75h-3m3.75-3.75L15.75 6.75M9 20.25v-3c0-.414-.336-.75-.75-.75h-3m3 3.75L5.25 17.25m13.5 3v-3c0-.414-.336-.75-.75-.75h-3m3.75 3.75L15.75 17.25"
                    />
                  </svg>
                </div>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white transition-all duration-500 shadow-sm active:scale-95 cursor-pointer relative overflow-hidden group"
                aria-label="Toggle Theme"
              >
                <div className="relative h-5 w-5">
                  {/* Moon Icon (show on light) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-500 ease-in-out ${
                      isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                  {/* Sun Icon (show on dark) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-500 ease-in-out ${
                      isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m0 13.5V21M4.95 4.95l1.59 1.59m10.92 10.92l1.59 1.59M3 12h2.25m13.5 0H21m-2.23-7.07l-1.59 1.59m-10.92 10.92l-1.59 1.59M12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
                    />
                  </svg>
                </div>
              </button>

              {/* Enquiry Now CTA */}
              <Link
                href="/enquiry"
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-bold text-gray-900 rounded-full group bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 transition-all duration-200"
              >
                <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-zinc-950 rounded-full group-hover:bg-opacity-0 text-zinc-900 dark:text-white group-hover:text-white">
                  Enquiry Now
                </span>
              </Link>
            </div>

            {/* Mobile Actions & Menu button */}
            <div className="flex md:hidden items-center gap-2">
              {/* Fullscreen Button (Mobile) */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 cursor-pointer relative"
                aria-label="Toggle Fullscreen"
              >
                <div className="relative h-5 w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-300 ease-in-out ${
                      isFullscreen ? "scale-0 opacity-0 rotate-45" : "scale-100 opacity-100 rotate-0"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-300 ease-in-out ${
                      isFullscreen ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-45"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 3.75v3c0 .414-.336.75-.75.75h-3m3-3.75L5.25 6.75m13.5-3v3c0 .414-.336.75-.75.75h-3m3.75-3.75L15.75 6.75M9 20.25v-3c0-.414-.336-.75-.75-.75h-3m3 3.75L5.25 17.25m13.5 3v-3c0-.414-.336-.75-.75-.75h-3m3.75 3.75L15.75 17.25"
                    />
                  </svg>
                </div>
              </button>

              {/* Theme Toggle Button (Mobile) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 cursor-pointer relative"
                aria-label="Toggle Theme"
              >
                <div className="relative h-5 w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-500 ease-in-out ${
                      isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`h-5 w-5 absolute inset-0 transition-all duration-500 ease-in-out ${
                      isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m0 13.5V21M4.95 4.95l1.59 1.59m10.92 10.92l1.59 1.59M3 12h2.25m13.5 0H21m-2.23-7.07l-1.59 1.59m-10.92 10.92l-1.59 1.59M12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
                    />
                  </svg>
                </div>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0 pointer-events-none"
          }`}
          id="mobile-menu"
        >
          <div className="space-y-1 px-3 pt-2 pb-3 border-t border-zinc-100 dark:border-zinc-800/80 mt-2">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.name} className="space-y-1">
                    <button
                      onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        pathname.startsWith(link.href)
                          ? "bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900"
                      }`}
                    >
                      {link.name}
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isProductDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isProductDropdownOpen && (
                      <div className="pl-6 space-y-1">
                        {productSubmenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className="block rounded-xl px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900/5 dark:bg-white/10 text-zinc-900 dark:text-white font-semibold"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile CTA Button */}
            <div className="pt-4 px-4">
              <Link
                href="/enquiry"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-3 text-center text-base font-bold text-white shadow-md hover:from-amber-600 hover:to-red-600 transition-colors"
              >
                Enquiry Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
