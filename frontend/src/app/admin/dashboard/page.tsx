"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "@/utils/notifications";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: "Dealer" | "Customer";
  interest: string;
  message: string;
  date: string;
  status: "Pending" | "Contacted";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mock recent enquiries summary data
  const [enquiries] = useState<Enquiry[]>([
    {
      id: "ENQ-001",
      name: "Rohit Sharma",
      email: "rohit.sharma@retailer.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      type: "Dealer",
      interest: "Sparklers & Flower Pots",
      message: "Interested in bulk dealership for upcoming Diwali season. Please send the pricing catalog.",
      date: "Today, 10:15 AM",
      status: "Pending",
    },
    {
      id: "ENQ-002",
      name: "Priya Patel",
      email: "priya.patel@weddingplanners.in",
      phone: "+91 87654 32109",
      location: "Ahmedabad, Gujarat",
      type: "Customer",
      interest: "Aerial Shells & Fancy Crackers",
      message: "We need custom color-coordinated fireworks for a grand wedding event on November 20th.",
      date: "Yesterday, 4:30 PM",
      status: "Contacted",
    },
    {
      id: "ENQ-003",
      name: "Anand Verma",
      email: "anand.verma@fireworksbuzz.com",
      phone: "+91 76543 21098",
      location: "Sivakasi, Tamil Nadu",
      type: "Dealer",
      interest: "Sound Crackers & Rockets",
      message: "Looking to establish long term distribution hub. Already have warehouse ready.",
      date: "July 04, 2026",
      status: "Contacted",
    },
  ]);

  // Stats Counters
  const totalEnquiries = 148;
  const pendingEnquiries = 25;
  const activeProducts = 42;
  const systemUptime = "99.98%";

  // Canvas Firework Sparks Effect on Mouse Clicks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      decay: number;
      gravity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = ["#f59e0b", "#f97316", "#ef4444", "#fbbf24", "#ffffff"];

    const createSparks = (x: number, y: number) => {
      const count = 18;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (0.4 + Math.random() * 1.6),
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 1.2 + Math.random() * 2.2,
          alpha: 1.0,
          decay: 0.02 + Math.random() * 0.03,
          gravity: 0.06 + Math.random() * 0.06,
        });
      }
      
      if (particles.length === count) {
        tick();
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const handleWindowClick = (e: MouseEvent) => {
      createSparks(e.clientX, e.clientY);
    };
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleWindowClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 select-text relative">
      {/* Click Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Dynamic Keyframes Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growBar {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-grow-bar {
          transform-origin: bottom;
          animation: growBar 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-5 animate-fade-in-up">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
            Control <span className="text-orange-500 font-black">Dashboard</span>
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Realtime Analytics & Enquiry Monitoring Node
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 border border-zinc-800 bg-zinc-900 px-3 py-1.5 rounded-xl">
            Live Connection: Active
          </span>
        </div>
      </div>

      {/* Stats tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Queries */}
        <div 
          className="relative group overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 animate-fade-in-up"
          style={{ animationDelay: "75ms" }}
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/5 blur-2xl rounded-full transition-all group-hover:bg-orange-500/10" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Total Queries</span>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+14% wk</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-white">{totalEnquiries}</span>
            <span className="text-[10px] text-zinc-500 font-bold">Enquiries</span>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-400">
              <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.75 1.25a.75.75 0 01.53.919l-1.25 4.75a.75.75 0 11-1.45-.38l.685-2.607-11.026 11.027a.75.75 0 11-1.06-1.06L14.73 7.227l-2.684-.706a.75.75 0 01-.468-.643z" clipRule="evenodd" />
            </svg>
            <span>Increasing dealer demand</span>
          </div>
        </div>

        {/* Pending Action */}
        <div 
          className="relative group overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-red-500/5 blur-2xl rounded-full transition-all group-hover:bg-red-500/10" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Pending Action</span>
            <span className="text-[10px] font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Urgent</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-white">{pendingEnquiries}</span>
            <span className="text-[10px] text-zinc-500 font-bold">Unattended</span>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-red-400 animate-pulse">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.63-1.515 2.63H3.72c-1.345 0-2.188-1.463-1.515-2.63L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Follow-up action required</span>
          </div>
        </div>

        {/* Active Products */}
        <div 
          className="relative group overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 animate-fade-in-up"
          style={{ animationDelay: "225ms" }}
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 blur-2xl rounded-full transition-all group-hover:bg-amber-500/10" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Catalog Items</span>
            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Standard</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-white">{activeProducts}</span>
            <span className="text-[10px] text-zinc-500 font-bold">Fireworks</span>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-amber-500">
              <path d="M12 9a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6 4a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>Fully indexed products catalog</span>
          </div>
        </div>

        {/* System Uptime */}
        <div 
          className="relative group overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 blur-2xl rounded-full transition-all group-hover:bg-emerald-500/10" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">System Node</span>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Secure</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-black text-white">{systemUptime}</span>
            <span className="text-[10px] text-zinc-500 font-bold">Uptime</span>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-400">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.13-5.69z" clipRule="evenodd" />
            </svg>
            <span>Stable background servers</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Statistics Chart */}
        <div 
          className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 flex flex-col justify-between animate-fade-in-up"
          style={{ animationDelay: "375ms" }}
        >
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Monthly Demands Summary</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Dealer vs customer enquiry traffic statistics</p>
          </div>

          {/* Staggered grow chart */}
          <div className="h-60 mt-6 flex items-end justify-between gap-2.5 md:gap-4 select-none pb-2 border-b border-zinc-800/60 pr-1">
            {/* Jan */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex justify-center gap-0.5 h-[95%] items-end">
                <div className="w-3 md:w-4 rounded-t-sm h-[45%] relative transition-all group-hover:brightness-110 shadow-lg shadow-orange-500/10">
                  <div className="absolute inset-0 bg-orange-500 rounded-t-sm animate-grow-bar" style={{ animationDelay: "500ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">24</div>
                </div>
                <div className="w-3 md:w-4 rounded-t-sm h-[25%] relative transition-all group-hover:bg-zinc-600">
                  <div className="absolute inset-0 bg-zinc-700 rounded-t-sm animate-grow-bar" style={{ animationDelay: "550ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">12</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Jan</span>
            </div>

            {/* Feb */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex justify-center gap-0.5 h-[95%] items-end">
                <div className="w-3 md:w-4 rounded-t-sm h-[60%] relative transition-all group-hover:brightness-110 shadow-lg shadow-orange-500/10">
                  <div className="absolute inset-0 bg-orange-500 rounded-t-sm animate-grow-bar" style={{ animationDelay: "600ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">36</div>
                </div>
                <div className="w-3 md:w-4 rounded-t-sm h-[30%] relative transition-all group-hover:bg-zinc-600">
                  <div className="absolute inset-0 bg-zinc-700 rounded-t-sm animate-grow-bar" style={{ animationDelay: "650ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">18</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Feb</span>
            </div>

            {/* Mar */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex justify-center gap-0.5 h-[95%] items-end">
                <div className="w-3 md:w-4 rounded-t-sm h-[50%] relative transition-all group-hover:brightness-110 shadow-lg shadow-orange-500/10">
                  <div className="absolute inset-0 bg-orange-500 rounded-t-sm animate-grow-bar" style={{ animationDelay: "700ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">28</div>
                </div>
                <div className="w-3 md:w-4 rounded-t-sm h-[40%] relative transition-all group-hover:bg-zinc-600">
                  <div className="absolute inset-0 bg-zinc-700 rounded-t-sm animate-grow-bar" style={{ animationDelay: "750ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">22</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Mar</span>
            </div>

            {/* Apr */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex justify-center gap-0.5 h-[95%] items-end">
                <div className="w-3 md:w-4 rounded-t-sm h-[70%] relative transition-all group-hover:brightness-110 shadow-lg shadow-orange-500/10">
                  <div className="absolute inset-0 bg-orange-500 rounded-t-sm animate-grow-bar" style={{ animationDelay: "800ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">42</div>
                </div>
                <div className="w-3 md:w-4 rounded-t-sm h-[50%] relative transition-all group-hover:bg-zinc-600">
                  <div className="absolute inset-0 bg-zinc-700 rounded-t-sm animate-grow-bar" style={{ animationDelay: "850ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">29</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Apr</span>
            </div>

            {/* May */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex justify-center gap-0.5 h-[95%] items-end">
                <div className="w-3 md:w-4 rounded-t-sm h-[80%] relative transition-all group-hover:brightness-110 shadow-lg shadow-orange-500/15">
                  <div className="absolute inset-0 bg-orange-500 rounded-t-sm animate-grow-bar" style={{ animationDelay: "900ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">52</div>
                </div>
                <div className="w-3 md:w-4 rounded-t-sm h-[35%] relative transition-all group-hover:bg-zinc-600">
                  <div className="absolute inset-0 bg-zinc-700 rounded-t-sm animate-grow-bar" style={{ animationDelay: "950ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">20</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">May</span>
            </div>

            {/* Jun */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex justify-center gap-0.5 h-[95%] items-end">
                <div className="w-3 md:w-4 rounded-t-sm h-[75%] relative transition-all group-hover:brightness-110 shadow-lg shadow-orange-500/15">
                  <div className="absolute inset-0 bg-orange-500 rounded-t-sm animate-grow-bar" style={{ animationDelay: "950ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">48</div>
                </div>
                <div className="w-3 md:w-4 rounded-t-sm h-[50%] relative transition-all group-hover:bg-zinc-600">
                  <div className="absolute inset-0 bg-zinc-700 rounded-t-sm animate-grow-bar" style={{ animationDelay: "950ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">30</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Jun</span>
            </div>

            {/* Jul */}
            <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex justify-center gap-0.5 h-[95%] items-end">
                <div className="w-3 md:w-4 rounded-t-sm h-[100%] relative transition-all group-hover:brightness-110 shadow-lg shadow-orange-500/20">
                  <div className="absolute inset-0 bg-orange-500 rounded-t-sm animate-grow-bar" style={{ animationDelay: "1000ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">64</div>
                </div>
                <div className="w-3 md:w-4 rounded-t-sm h-[60%] relative transition-all group-hover:bg-zinc-600">
                  <div className="absolute inset-0 bg-zinc-700 rounded-t-sm animate-grow-bar" style={{ animationDelay: "1050ms" }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 font-black z-10">38</div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Jul</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 flex flex-col justify-between animate-fade-in-up"
          style={{ animationDelay: "450ms" }}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Quick Shortcuts</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Fast execution and system control actions</p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => router.push("/admin/dashboard/products")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 hover:border-orange-500/30 transition-all hover:bg-zinc-800/20 group text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                      <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.25H18a.75.75 0 010 1.5h-7.25V18a.75.75 0 01-1.5 0v-7.25H2a.75.75 0 010-1.5h7.25V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black tracking-wide text-zinc-200">Manage Products</h4>
                    <p className="text-[8px] text-zinc-500 font-semibold mt-0.5">Configure stock & catalog items</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-orange-500">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                onClick={() => router.push("/admin/dashboard/enquiries")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 hover:border-orange-500/30 transition-all hover:bg-zinc-800/20 group text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                      <path fillRule="evenodd" d="M2.166 4.9L10 9.554L17.834 4.9A2 2 0 0016 3H4a2 2 0 00-1.834 1.9z" />
                      <path d="M18 6.666v7.334a2 2 0 01-2 2H4a2 2 0 01-2-2V6.666l8 4.778l8-4.778z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black tracking-wide text-zinc-200">Enquiries Inbox</h4>
                    <p className="text-[8px] text-zinc-500 font-semibold mt-0.5">Review dealership submissions</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-zinc-650 transition-transform group-hover:translate-x-1 group-hover:text-orange-500">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                onClick={() => router.push("/admin/dashboard/media")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 hover:border-orange-500/30 transition-all hover:bg-zinc-800/20 group text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5.5 w-5.5">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black tracking-wide text-zinc-200">Media Gallery</h4>
                    <p className="text-[8px] text-zinc-500 font-semibold mt-0.5">Manage images & social reels</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-zinc-650 transition-transform group-hover:translate-x-1 group-hover:text-orange-500">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                onClick={() => router.push("/admin/dashboard/stores")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 hover:border-orange-500/30 transition-all hover:bg-zinc-800/20 group text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.655 7.587a15.223 15.223 0 002.573 1.938 5.568 5.568 0 00.462.208zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black tracking-wide text-zinc-200">Store Listings</h4>
                    <p className="text-[8px] text-zinc-500 font-semibold mt-0.5">Manage store locations & map cards</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-zinc-650 transition-transform group-hover:translate-x-1 group-hover:text-orange-500">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                onClick={() => router.push("/admin/dashboard/settings")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 hover:border-orange-500/30 transition-all hover:bg-zinc-800/20 group text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-black tracking-wide text-zinc-200">Portal Settings</h4>
                    <p className="text-[8px] text-zinc-500 font-semibold mt-0.5">Configure SMTP & brand parameters</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-zinc-650 transition-transform group-hover:translate-x-1 group-hover:text-orange-500">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-500 font-semibold leading-relaxed select-none">
            Authorized node console active. Use shortcuts above to trigger direct action across Savitri database indices.
          </div>
        </div>
      </div>

      {/* Simplified Recent Enquiries Table */}
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 animate-fade-in-up"
        style={{ animationDelay: "525ms" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Recent Customer Enquiries</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              Overview of the latest client dealership queries. Use the button to open full enquiries manager.
            </p>
          </div>
          
          <button
            onClick={() => router.push("/admin/dashboard/enquiries")}
            className="py-2.5 px-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-orange-500 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-2 select-none"
          >
            <span>Open Enquiries Inbox</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.63l-3-3a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l3-3H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] font-black uppercase text-zinc-500 tracking-wider select-none bg-zinc-900/50">
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Enquiry Type</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs">
              {enquiries.slice(0, 3).map((enq) => (
                <tr key={enq.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-white">{enq.name}</div>
                    <div className="text-[10px] text-zinc-500 font-semibold mt-0.5">{enq.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/10">
                      {enq.type === "Dealer" ? "Dealer Request" : "Customer Query"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-zinc-300 max-w-[200px] truncate" title={enq.interest}>
                    {enq.interest}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500 font-semibold">{enq.date}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-wider border ${
                      enq.status === "Pending"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right select-none">
                    <button
                      onClick={() => router.push("/admin/dashboard/enquiries")}
                      className="py-1.5 px-3 bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 text-[10px] uppercase font-black text-white tracking-widest rounded-xl transition-all cursor-pointer"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
