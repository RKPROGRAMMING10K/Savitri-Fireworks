"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoginCanvas from "@/components/LoginCanvas";
import { showSuccessToast, showErrorToast } from "@/utils/notifications";
import { authService } from "@/services/auth/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If session is already active, redirect directly to dashboard
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Programmatically trigger firework burst at the submit button
    const rect = (e.target as HTMLFormElement)
      .querySelector("button[type='submit']")
      ?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    const blastEvent = new CustomEvent("trigger-login-firecracker", {
      detail: { x, y },
    });
    window.dispatchEvent(blastEvent);

    try {
      const response = await authService.login({ email, password });

      showSuccessToast(
        "Access Granted",
        `Welcome to Savitri Fireworks Control Panel, ${response.admin.name || "Super Admin"}.`
      );

      // Redirect after a brief moment so celebration sparks and toast are experienced
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (error: any) {
      showErrorToast(
        "Access Denied",
        error.message || "Invalid administrative email or password."
      );

      // Secondary failure sparks event
      window.dispatchEvent(
        new CustomEvent("trigger-login-firecracker", {
          detail: {
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 150,
            y: window.innerHeight / 2 - 100,
          },
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 overflow-hidden select-none font-sans px-4">
      {/* Background Lanterns and Fountains Canvas */}
      <LoginCanvas />

      {/* Glassmorphic Login Form Wrapper */}
      <div className="relative z-10 w-full max-w-[430px] animate-slide-up">
        {/* Glowing aura background behind card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 opacity-25 blur-xl pointer-events-none" />

        <div className="relative bg-zinc-900/60 dark:bg-black/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl text-center">
          {/* Brand Logo & Title */}
          <div className="mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full overflow-hidden mb-4 transition-transform hover:scale-105 active:scale-95 duration-300">
              <img
                src="/assets/logo.png"
                alt="Savitri Fireworks Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">
              Savitri <span className="text-orange-500">Admin</span>
            </h2>
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-1">
              Control Panel Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@savitrifireworks.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/5 text-xs font-semibold text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 shadow-inner"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500"
                >
                  <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.117 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/40 border border-white/5 text-xs font-semibold text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 shadow-inner"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500"
                >
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                      <path d="M13.5 13a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                      <path fillRule="evenodd" d="M10 17a6.97 6.97 0 0 0 4.95-2.05l-1.42-1.42a4.97 4.97 0 0 1-7.06 0l-1.42 1.42A6.97 6.97 0 0 0 10 17Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                      <path d="M3.25 4.25a.75.75 0 0 1 1.06 0l11.5 11.5a.75.75 0 1 1-1.06 1.06l-11.5-11.5a.75.75 0 0 1 0-1.06Z" />
                      <path d="M12.44 11.38a3.5 3.5 0 0 1-4.82-4.82l-1.54-1.54a5.5 5.5 0 0 0 7.9 7.9l-1.54-1.54Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer mt-2"
            >
              {isLoading ? "Authenticating with Server..." : "Secure Access"}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
              Authorized access only. Savitri Fireworks secure node dashboard. System usage monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
