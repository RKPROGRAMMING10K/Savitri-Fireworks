"use client";

import React, { useEffect, useRef, useState } from "react";

interface ProductCardProps {
  name: string;
  image: string;
  desc: string;
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

export default function ProductCard({ name, image, desc }: ProductCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sparklesRef = useRef<Sparkle[]>([]);

  // Gold, amber, and red sparkles for cards
  const sparkColors = [
    "rgba(255, 215, 0, ",  // Gold
    "rgba(255, 140, 0, ",  // Orange
    "rgba(255, 69, 0, ",   // OrangeRed
    "rgba(255, 255, 255, " // White star
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

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        sparklesRef.current = [];
      }}
      className="flex-shrink-0 relative w-72 h-96 rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 group shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 select-none"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 z-0"
      />

      {/* Dark Overlay Gradient (always dark to keep text readable on top of images) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300 z-10" />

      {/* Card Fireworks Canvas (At z-20) */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

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
        <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
