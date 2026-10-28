"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  image?: string | null;
  desc: string;
  code?: string;
  categoryName?: string;
  href?: string;
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

export default function ProductCard({
  name,
  image,
  desc,
  code,
  categoryName,
  href,
}: ProductCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const sparklesRef = useRef<Sparkle[]>([]);

  // Gold, amber, and red sparkles for cards
  const sparkColors = [
    "rgba(255, 215, 0, ",  // Gold
    "rgba(255, 140, 0, ",  // Orange
    "rgba(255, 69, 0, ",   // OrangeRed
    "rgba(255, 255, 255, ", // White star
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 288;
      canvas.height = canvas.parentElement?.clientHeight || 384;
    };
    resizeCanvas();

    const observer = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const spawnSparkles = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.6;
        sparklesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.02,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          size: Math.random() * 1.5 + 1.0,
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
        const ry = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.2);
        spawnSparkles(rx, ry, 3);
      }

      const sparkles = sparklesRef.current;
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02;
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
          ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = s.color + `${s.alpha * 0.3})`;
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

  const targetHref = href || `/products?search=${encodeURIComponent(name)}`;

  return (
    <Link
      href={targetHref}
      draggable={false}
      className="block flex-shrink-0 focus:outline-none"
    >
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          sparklesRef.current = [];
        }}
        className="relative w-72 h-96 rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 group shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 select-none"
      >
        {/* Background Image or Pyro Fallback */}
        {image && !imgFailed ? (
          <img
            src={image}
            alt={name}
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 z-0"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-zinc-900 to-black flex flex-col items-center justify-center p-6 text-center opacity-90 group-hover:opacity-75 transition-opacity z-0">
            <div className="h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8 animate-pulse"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.859 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
              </svg>
            </div>
          </div>
        )}

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300 z-10" />

        {/* Card Fireworks Canvas (At z-20) */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Top Badges (Category & Code) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
          {categoryName ? (
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              {categoryName}
            </span>
          ) : (
            <span />
          )}
          {code && (
            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-zinc-300 font-mono text-[10px] font-semibold">
              {code}
            </span>
          )}
        </div>

        {/* Product Content (At z-30) */}
        <div className="absolute bottom-6 left-6 right-6 text-left z-30 pointer-events-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-400 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 animate-pulse"
            >
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.859 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 font-medium leading-relaxed line-clamp-2">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}
