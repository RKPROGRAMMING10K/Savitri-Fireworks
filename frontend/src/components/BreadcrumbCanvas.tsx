"use client";

import React, { useEffect, useRef } from "react";

export default function BreadcrumbCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    interface Rocket {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      trail: { x: number; y: number }[];
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      fade: number;
      color: string;
      size: number;
    }

    let rockets: Rocket[] = [];
    let particles: Particle[] = [];

    const launchRocket = () => {
      const x = Math.random() * (width - 100) + 50;
      const y = height + 10;
      // Explosions occur around the vertical center of the breadcrumb hero
      const targetY = Math.random() * (height * 0.3) + height * 0.15;
      const speed = Math.random() * 2 + 3.5;

      const hues = [25, 45, 350, 190, 120]; // Gold, Orange, Crimson, Cyan, Lime
      const hue = hues[Math.floor(Math.random() * hues.length)];
      const color = `hsla(${hue}, 100%, 65%, `;

      rockets.push({
        x,
        y,
        targetY,
        vy: -speed,
        color,
        trail: [],
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const count = Math.floor(Math.random() * 12) + 12;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          fade: Math.random() * 0.015 + 0.012,
          color,
          size: Math.random() * 1.2 + 0.6,
        });
      }
    };

    let launchTimer = 0;

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      // Launch rocket every 2 seconds (120 frames)
      launchTimer++;
      if (launchTimer > 110) {
        launchRocket();
        launchTimer = 0;
      }

      // Update & Draw active rockets
      rockets = rockets.filter((r) => {
        r.y += r.vy;

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();

        // Draw rocket path trail
        ctx.beginPath();
        for (let i = 0; i < r.trail.length; i++) {
          const pt = r.trail[i];
          const tAlpha = ((i + 1) / r.trail.length) * 0.45;
          ctx.lineTo(pt.x, pt.y);
          ctx.strokeStyle = r.color + tAlpha + ")";
        }
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Draw small fireball head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = r.color + "1)";
        ctx.fill();

        // Check if target height has been reached to detonate
        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      // Update & Draw spark fragments
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025; // Gravity pull
        p.alpha -= p.fade;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();

        return p.alpha > 0;
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    // Spawn initial rocket immediately on component load
    launchRocket();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
