"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface FeaturedCardProps {
  title: string;
  desc: string;
  href: string;
  type: "aerial" | "gift" | "new" | "safety";
  delay?: number; // Optional delay in milliseconds for staggered animation
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

export default function FeaturedCard({ title, desc, href, type, delay }: FeaturedCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sparksRef = useRef<Spark[]>([]);

  // Card themes configuration
  const themes = {
    aerial: {
      accentColor: "rgba(255, 191, 0, ",
      colors: ["rgba(255, 191, 0, ", "rgba(255, 140, 0, ", "rgba(255, 255, 255, "],
      shadowClass: "hover:shadow-amber-500/20",
      borderClass: "hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-500",
      buttonBg: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 006.1 2.323z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l3-3 3 3m-6 3h6" />
        </svg>
      )
    },
    gift: {
      accentColor: "rgba(249, 115, 22, ",
      colors: ["rgba(249, 115, 22, ", "rgba(253, 186, 116, ", "rgba(255, 255, 255, "],
      shadowClass: "hover:shadow-orange-500/20",
      borderClass: "hover:border-orange-500/40",
      iconBg: "bg-orange-500/10 border-orange-500/20 text-orange-500",
      buttonBg: "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      )
    },
    new: {
      accentColor: "rgba(239, 68, 68, ",
      colors: ["rgba(239, 68, 68, ", "rgba(244, 63, 94, ", "rgba(255, 255, 255, "],
      shadowClass: "hover:shadow-red-500/20",
      borderClass: "hover:border-red-500/40",
      iconBg: "bg-red-500/10 border-red-500/20 text-red-500",
      buttonBg: "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    },
    safety: {
      accentColor: "rgba(34, 197, 94, ",
      colors: ["rgba(34, 197, 94, ", "rgba(74, 222, 128, ", "rgba(255, 220, 100, "],
      shadowClass: "hover:shadow-green-500/20",
      borderClass: "hover:border-green-500/40",
      iconBg: "bg-green-500/10 border-green-500/20 text-green-500",
      buttonBg: "from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    }
  };

  const currentTheme = themes[type];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 288;
      canvas.height = canvas.parentElement?.clientHeight || 320;
    };
    resizeCanvas();

    const observer = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const spawnSparks = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          alpha: 1.0,
          decay: Math.random() * 0.04 + 0.02,
          color: currentTheme.colors[Math.floor(Math.random() * currentTheme.colors.length)],
          size: Math.random() * 1.5 + 0.8,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnSparks(x, y, 1);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHovered && Math.random() < 0.2) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.2);
        spawnSparks(rx, ry, 2);
      }

      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.015;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color + `${s.alpha})`;
        ctx.fill();

        if (Math.random() < 0.15) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = s.color + `${s.alpha * 0.25})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        sparksRef.current = [];
      }}
      className={`relative rounded-3xl p-8 bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-2 select-none group shadow-lg ${
        currentTheme.shadowClass
      } ${currentTheme.borderClass} ${delay !== undefined ? "animate-slide-up" : ""}`}
      style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}
    >
      {/* 1. Local Canvas Sparks overlay */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 2. Content */}
      <div className="space-y-4 relative z-20 pointer-events-none">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${currentTheme.iconBg}`}
        >
          {currentTheme.icon}
        </div>
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-zinc-900 group-hover:to-zinc-600 dark:group-hover:from-white dark:group-hover:to-zinc-300">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
          {desc}
        </p>
      </div>

      {/* 3. CTA Explore Button */}
      <div className="mt-6 relative z-20">
        <Link
          href={href}
          className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${currentTheme.buttonBg} shadow-md transition-all duration-300 hover:scale-105 active:scale-95 group-hover:shadow-lg`}
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
