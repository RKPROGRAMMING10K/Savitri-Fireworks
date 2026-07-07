"use client";

import React, { useEffect, useRef, useState } from "react";

interface PopularProductCardProps {
  name: string;
  image: string;
  desc: string;
  tag?: string;
  rating?: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

export default function PopularProductCard({ name, image, desc, tag = "Bestseller", rating = 5 }: PopularProductCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sparklesRef = useRef<Sparkle[]>([]);

  const sparkColors = [
    "rgba(251, 191, 36, ", // Amber/Gold
    "rgba(249, 115, 22, ",  // Orange
    "rgba(255, 255, 255, " // White
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 320;
      canvas.height = canvas.parentElement?.clientHeight || 448;
    };
    resizeCanvas();

    const observer = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const spawnSparkles = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        sparklesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.1,
          alpha: 1.0,
          decay: Math.random() * 0.035 + 0.02,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          size: Math.random() * 1.5 + 0.8,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnSparkles(x, y, 1);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHovered && Math.random() < 0.25) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * (canvas.height * 0.8);
        spawnSparkles(rx, ry, 2);
      }

      const sparkles = sparklesRef.current;
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.015;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color + `${s.alpha})`;
        ctx.fill();

        if (Math.random() < 0.2) {
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
        sparklesRef.current = [];
      }}
      className="flex-shrink-0 w-80 h-[28rem] rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2 select-none relative"
    >
      {/* 1. Local Canvas Sparks overlay (At z-10) */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 2. Top Image Area */}
      <div className="h-52 w-full overflow-hidden relative z-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Soft dark vignette on image bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Floating Tag */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
          {tag}
        </div>
      </div>

      {/* 3. Bottom Content Panel */}
      <div className="p-6 flex-grow flex flex-col justify-between relative bg-white dark:bg-zinc-950 transition-colors duration-300 z-20 border-t border-zinc-100 dark:border-white/5">
        <div className="space-y-2">
          {/* Star Ratings */}
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: rating }).map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ))}
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white transition-colors duration-300 group-hover:text-orange-500">
            {name}
          </h3>

          {/* Product Description */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            {desc}
          </p>
        </div>

        {/* Quick Contact Link */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-4">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
            Premium Choice
          </span>
          <span className="text-xs font-bold text-orange-500 dark:text-orange-400 group-hover:underline flex items-center gap-1">
            Enquire Now
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 transition-transform group-hover:translate-x-1">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.63l-3.01-3.01a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l3.01-3.01H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
