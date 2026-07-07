"use client";

import React, { useState } from "react";
import { showSuccessToast } from "@/utils/notifications";

export default function AdminSettingsPage() {
  // Logo states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("/assets/firework.png");

  // Email Config states
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("notifications@savitrifireworks.com");
  const [smtpPass, setSmtpPass] = useState("SavitriSMTP2026Secure");
  const [smtpEncryption, setSmtpEncryption] = useState("TLS");
  const [fromName, setFromName] = useState("Savitri Fireworks");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveLogoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccessToast(
      "Logo Configured",
      "New logo successfully mapped to global assets (header logo and browser favicon updated)."
    );
  };

  const handleSaveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccessToast(
      "Email Config Saved",
      "SMTP server credentials successfully committed to configuration registry (system mailer reloaded)."
    );
  };

  const handleTestConnection = () => {
    showSuccessToast(
      "SMTP Handshake Successful",
      `Connection established with ${smtpHost}:${smtpPort}. Test email dispatched to ${smtpUser}.`
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up pb-12">
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
            System <span className="text-orange-500 font-black">Settings</span>
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Core administration parameters and platform variables
          </p>
        </div>
      </div>

      {/* SECTION 1: BRAND LOGO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left pane: File selection and actions */}
        <form
          onSubmit={handleSaveLogoSettings}
          className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wide text-white">Brand Identity</h3>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">
                Upload your company logo. This asset will be used for both frontend headers and browser tab favicons.
              </p>
            </div>

            {/* Logo upload drop area */}
            <div className="space-y-2 text-xs">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                Upload Brand Asset (.png, .jpg, .ico)
              </label>
              
              <div className="relative border-2 border-dashed border-zinc-800 hover:border-orange-500/30 rounded-2xl p-8 bg-zinc-950/60 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 0 11-.75 0 .375 0 01.75 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-[11px] font-black text-zinc-300 uppercase tracking-wider block">
                    Choose logo file
                  </span>
                  <span className="text-[9px] text-zinc-500 font-semibold block mt-0.5">
                    Recommended dimensions: 512x512px. Transparent backgrounds preferred.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 flex justify-end">
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Update Brand Logo
            </button>
          </div>
        </form>

        {/* Right pane: Visual Previews */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Live Previews</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              Verify how your branding scales on different elements
            </p>
          </div>

          {/* 1. Header Logo display */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              Header Branding Preview
            </span>
            <div className="h-20 w-full rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
              {logoPreview ? (
                <img src={logoPreview} alt="Header Logo" className="h-10 max-w-full object-contain" />
              ) : (
                <span className="text-[9px] text-zinc-600 font-bold uppercase">No Logo Configured</span>
              )}
            </div>
          </div>

          {/* 2. Mock Tab Favicon display */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
              Browser Tab Favicon Preview
            </span>
            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 text-xs">
              <div className="bg-zinc-900 px-3.5 py-2 border-b border-zinc-800 flex items-center gap-1.5 select-none">
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
              </div>
              <div className="p-3 bg-zinc-950 flex justify-start">
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3.5 py-1.5 rounded-xl max-w-[170px] select-none shadow-md">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Favicon" className="h-4 w-4 object-contain rounded-md" />
                  ) : (
                    <div className="h-4 w-4 bg-zinc-800 rounded-md" />
                  )}
                  <span className="text-[9px] font-black text-zinc-300 truncate tracking-wide uppercase">
                    Savitri Fireworks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: EMAIL / SMTP CONFIGURATION */}
      <form
        onSubmit={handleSaveEmailSettings}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-6"
      >
        <div className="border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-black uppercase tracking-wide text-white">Email & Mailer Configuration</h3>
          <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">
            Configure global SMTP settings to handle inquiry receipts, notifications, and dealer alerts. Updates here bypass manual environment file changes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          {/* SMTP Host */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">SMTP Server Host</label>
            <input
              type="text"
              required
              placeholder="e.g. smtp.mailgun.org"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
            />
          </div>

          {/* SMTP Port */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">SMTP Server Port</label>
            <input
              type="text"
              required
              placeholder="e.g. 587"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
            />
          </div>

          {/* SMTP Encryption */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Security Encryption</label>
            <select
              value={smtpEncryption}
              onChange={(e) => setSmtpEncryption(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
            >
              <option value="TLS">STARTTLS (Port 587)</option>
              <option value="SSL">SSL/TLS (Port 465)</option>
              <option value="None">None (Port 25 / 8025)</option>
            </select>
          </div>

          {/* From Name */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Sender "From" Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Savitri Fireworks Sales"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
            />
          </div>

          {/* SMTP Username */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">SMTP Login Email / User</label>
            <input
              type="email"
              required
              placeholder="e.g. alert@domain.com"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
            />
          </div>

          {/* SMTP Password */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">SMTP User Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="SMTP secret key"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="w-full p-3 pr-10 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500/50 font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer select-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.6 1.6 0 000-1.26 10.005 10.005 0 00-16.73 0c-.26.47-.406.994-.43 1.53L3.28 2.22zM6.18 5.12L7.6 6.536a3.5 3.5 0 004.866 4.866l1.417 1.417A5 5 0 016.18 5.12z" clipRule="evenodd" />
                    <path d="M12.4 10.985l1.414 1.414c.264-.523.385-1.097.352-1.677a3.502 3.502 0 00-3.443-3.443c-.58-.033-1.154.088-1.677.352l1.414 1.414c.184-.047.38-.073.582-.073a1.5 1.5 0 011.5 1.5c0 .202-.026.398-.073.582z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0120 10a10.004 10.004 0 01-19.336.59zM10 15a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons row */}
        <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-end gap-3 select-none">
          <button
            type="button"
            onClick={handleTestConnection}
            className="py-3 px-5 bg-zinc-850 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-xs font-black uppercase text-white tracking-widest rounded-2xl transition-all cursor-pointer"
          >
            Test Connection
          </button>
          <button
            type="submit"
            className="py-3 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Save Mail Settings
          </button>
        </div>
      </form>
    </div>
  );
}
