"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { showErrorToast } from "@/utils/notifications";
import { authService } from "@/services/auth/authService";
import { AdminProfileDto } from "@/services/auth/dto/auth.dto";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5.5 w-5.5">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.001 8.001 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      name: "Products",
      href: "/admin/dashboard/products",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5.5 w-5.5">
          <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.25H18a.75.75 0 010 1.5h-7.25V18a.75.75 0 01-1.5 0v-7.25H2a.75.75 0 010-1.5h7.25V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Enquiries",
      href: "/admin/dashboard/enquiries",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5.5 w-5.5">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.25 4a.75.75 0 000 1.5h9.5a.75.75 0 000-1.5h-9.5zm0 3.5a.75.75 0 000 1.5h9.5a.75.75 0 000-1.5h-9.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Media",
      href: "/admin/dashboard/media",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5.5 w-5.5">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Store Listing",
      href: "/admin/dashboard/stores",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5.5 w-5.5">
          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.655 7.587a15.223 15.223 0 002.573 1.938 5.568 5.568 0 00.462.208zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    const cleanPathname = pathname.replace(/\/$/, "");
    const cleanHref = href.replace(/\/$/, "");
    if (cleanHref === "/admin/dashboard") {
      return cleanPathname === "/admin/dashboard";
    }
    return cleanPathname.startsWith(cleanHref);
  };

  const getPathIndicator = () => {
    if (pathname === "/admin/dashboard/products") return "Products";
    if (pathname === "/admin/dashboard/enquiries") return "Enquiries";
    if (pathname === "/admin/dashboard/media") return "Media";
    if (pathname === "/admin/dashboard/stores") return "Store Listing";
    return "Dashboard";
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminProfileDto | null>(null);

  // Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Strict backend authentication check on mount
  useEffect(() => {
    let isMounted = true;

    async function verifyAdminSession() {
      if (!authService.isAuthenticated()) {
        router.replace("/admin/login");
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (isMounted) {
          setAdminUser(profile);
          setIsAuthenticated(true);
          setCheckingAuth(false);
        }
      } catch {
        if (isMounted) {
          authService.clearSession();
          router.replace("/admin/login");
        }
      }
    }

    verifyAdminSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Click outside profile dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout handler calling authService
  const handleLogout = async () => {
    await authService.logout();
    router.push("/admin/login");
  };

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "SA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Loading Screen (prevents flash of dashboard content before auth is verified)
  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 text-white font-sans">
        <div className="text-center space-y-4">
          <div className="relative inline-flex h-12 w-12 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          </div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold animate-pulse">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex overflow-hidden">
      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ease-in-out md:static
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isSidebarCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center px-4 border-b border-zinc-800 gap-3 shrink-0">
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full overflow-hidden">
            <img
              src="/assets/logo.png"
              alt="Savitri Fireworks"
              className="h-full w-full object-contain"
            />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col select-none overflow-hidden whitespace-nowrap">
              <span className="text-sm font-black uppercase tracking-wider text-white">
                Savitri <span className="text-orange-500">Admin</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                Control Node
              </span>
            </div>
          )}
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden ml-auto h-8 w-8 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            title="Close Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu Scroll Area */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
          <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider px-3 mb-2 h-4 overflow-hidden select-none">
            {!isSidebarCollapsed ? "Core Portal" : "•"}
          </div>

          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-3.5 py-3 px-3.5 rounded-2xl transition-all duration-200 group relative
                  ${
                    active
                      ? "bg-gradient-to-r from-orange-500/15 via-orange-500/5 to-transparent text-orange-500 font-bold border-l-3 border-orange-500"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                  }
                `}
              >
                <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-xs uppercase font-extrabold tracking-wider whitespace-nowrap">
                    {item.name}
                  </span>
                )}

                {/* Hover Tooltip in collapsed mode */}
                {isSidebarCollapsed && (
                  <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 text-white text-[10px] uppercase tracking-wider font-black py-2 px-3.5 rounded-xl opacity-0 scale-95 origin-left pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50 whitespace-nowrap shadow-xl shadow-black/40">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 select-none text-center shrink-0">
          {!isSidebarCollapsed ? (
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wide">
              Savitri Dashboard v1.0
            </p>
          ) : (
            <span className="text-zinc-600 font-bold text-xs">v1</span>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* NAVBAR */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
          {/* Navbar Left: Sidebar Toggles */}
          <div className="flex items-center gap-3">
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSidebarCollapsed ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Path indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-wider select-none text-zinc-500">
              <span>Admin</span>
              <span className="text-zinc-700">/</span>
              <span className="text-orange-500">{getPathIndicator()}</span>
            </div>
          </div>

          {/* Navbar Right: Fullscreen + Profile */}
          <div className="flex items-center gap-3">
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4.5 w-4.5"
                >
                  <path d="M12.5 5.75a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0V7.06L12.53 9.53a.75.75 0 01-1.06-1.06L13.94 6H13.25a.75.75 0 01-.75-.75zM4.25 12.5a.75.75 0 01.75.75v.69l2.47-2.47a.75.75 0 011.06 1.06l-2.47 2.47h.69a.75.75 0 010 1.5H4.25a.75.75 0 01-.75-.75V13.25a.75.75 0 01.75-.75zM12.5 14.25a.75.75 0 01.75.75v.69l2.47-2.47a.75.75 0 111.06 1.06l-2.47 2.47h.69a.75.75 0 010 1.5H13.25a.75.75 0 01-.75-.75V15a.75.75 0 01.75-.75zM4.25 4.25h2.5a.75.75 0 010 1.5H6.06l2.47 2.47a.75.75 0 01-1.06 1.06L5 6.81v.69a.75.75 0 01-1.5 0V5a.75.75 0 01.75-.75z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4.5 w-4.5"
                >
                  <path d="M3.25 4A2.25 2.25 0 001 6.25v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 01.75-.75h2.5a.75.75 0 000-1.5h-2.5zM14.25 4a.75.75 0 000 1.5h2.5a.75.75 0 01.75.75v2.5a.75.75 0 001.5 0v-2.5A2.25 2.25 0 0016.75 4h-2.5zM2.5 11.25a.75.75 0 00-1.5 0v2.5A2.25 2.25 0 003.25 16h2.5a.75.75 0 000-1.5h-2.5a.75.75 0 01-.75-.75v-2.5zM17.5 11.25a.75.75 0 00-1.5 0v2.5a.75.75 0 01-.75.75h-2.5a.75.75 0 000 1.5h2.5A2.25 2.25 0 0019 13.75v-2.5z" />
                </svg>
              )}
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 pr-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/30 transition-all select-none cursor-pointer"
                title="Profile Menu"
              >
                {/* Glowing Avatar Initials */}
                <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-orange-500/10">
                  {getInitials(adminUser?.name)}
                </div>
                <span className="hidden sm:block text-xs font-bold text-zinc-300">
                  {adminUser?.name || "Super Admin"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-zinc-900 border border-zinc-800 p-2 shadow-2xl shadow-black/80 animate-slide-up z-50">
                  {/* User Profile Summary */}
                  <div className="px-3 py-2.5 select-none">
                    <p className="text-xs font-black text-white uppercase tracking-wide">
                      {adminUser?.name || "Super Admin"}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-semibold truncate">
                      {adminUser?.email || "admin@savitrifireworks.com"}
                    </p>
                  </div>

                  <div className="h-px bg-zinc-800 my-1.5" />

                  {/* Options */}
                  <button
                    onClick={() => {
                      showErrorToast("Feature Locked", "Admin profile configuration features are locked for the Super Admin.");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-all cursor-pointer text-left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-zinc-500"
                    >
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM8 8a5 5 0 00-1 1v3h6V9a5 5 0 00-5-5z" />
                    </svg>
                    <span>My Profile</span>
                  </button>

                  <div className="h-px bg-zinc-800 my-1.5" />

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-black text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer text-left uppercase tracking-wider"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Logout Portal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-3 sm:p-5 md:p-6 lg:p-8 select-text">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
