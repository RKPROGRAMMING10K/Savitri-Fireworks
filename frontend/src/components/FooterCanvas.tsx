"use client";

import React, { useEffect, useRef } from "react";

export default function FooterCanvas() {
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

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }

    interface Lantern {
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      swaySpeed: number;
      swayRange: number;
      phase: number;
      life: number;
      maxLife: number;
      color: string;
    }

    let sparks: Spark[] = [];
    let lanterns: Lantern[] = [];

    const createSpark = (x: number, y: number, isMouse = false) => {
      const angle = isMouse
        ? Math.random() * Math.PI * 2
        : -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
      const speed = isMouse ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.8;
      const maxLife = isMouse ? Math.random() * 30 + 20 : Math.random() * 70 + 50;

      // Warm fire colors: 15 (orange) to 45 (yellow/gold)
      const hue = Math.floor(Math.random() * 30) + 15;
      const color = `hsla(${hue}, 100%, 65%, `;

      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: isMouse ? Math.sin(angle) * speed : -speed,
        life: maxLife,
        maxLife,
        color,
        size: Math.random() * 1.5 + 0.5,
      });
    };

    const createLantern = () => {
      // Scale between 0.6 (distance) and 1.4 (foreground)
      const sizeScale = Math.random() * 0.8 + 0.6; 
      const w = 28 * sizeScale;
      const h = 42 * sizeScale;
      const x = Math.random() * width;
      const y = height + h;
      const maxLife = Math.random() * 400 + 500; // Float longer to drift off the top screen

      // Soft glowing candle envelope color
      const color = `rgba(${255}, ${110 + Math.random() * 50}, ${30}, `;

      lanterns.push({
        x,
        y,
        vx: 0,
        vy: -(Math.random() * 0.3 + 0.25), // Serene, slower rising speed
        w,
        h,
        swaySpeed: Math.random() * 0.008 + 0.004,
        swayRange: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        life: maxLife,
        maxLife,
        color,
      });
    };

    // Auto-spawning spark fountains from the bottom edge
    const spawnRate = 2; // Particles spawned per frame

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mX = e.clientX - rect.left;
      const mY = e.clientY - rect.top;
      // Spawn small burst on cursor hover
      for (let i = 0; i < 4; i++) {
        createSpark(mX, mY, true);
      }
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
    }

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      // Auto-emit base sparks from bottom edge
      for (let i = 0; i < spawnRate; i++) {
        createSpark(Math.random() * width, height);
      }

      // Auto-emit sky lanterns (limit max active lanterns to 10)
      if (Math.random() < 0.015 && lanterns.length < 10) {
        createLantern();
      }

      // Update & Draw base sparks
      sparks = sparks.filter((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.008; // Subtle gravity curve
        spark.life--;

        const alpha = spark.life / spark.maxLife;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = spark.color + alpha + ")";
        ctx.fill();

        return (
          spark.life > 0 &&
          spark.x >= 0 &&
          spark.x <= width &&
          spark.y >= 0 &&
          spark.y <= height
        );
      });

      // Update & Draw candle balloon lanterns
      lanterns = lanterns.filter((lantern) => {
        lantern.phase += lantern.swaySpeed;
        lantern.x += Math.sin(lantern.phase) * lantern.swayRange;
        lantern.y += lantern.vy;
        lantern.life--;

        // Clean alpha transitions: fade in at bottom, fade out at top
        const alpha =
          Math.min(1, lantern.life / 60) *
          Math.min(1, (lantern.maxLife - lantern.life) / 60);

        ctx.save();
        // Glow shadow surrounding the paper lantern envelope
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(249, 115, 22, ${0.65 * alpha})`;

        const x = lantern.x;
        const y = lantern.y;
        const w = lantern.w;
        const h = lantern.h;

        // Custom curve representing Kongming lantern shape (wider top, tapered bottom opening)
        ctx.beginPath();
        // Start at bottom-left corner opening
        ctx.moveTo(x - w / 2.8, y + h / 2);
        // Line up to wide top-left shoulder
        ctx.lineTo(x - w / 2, y - h / 4);
        // Rounded dome top curve
        ctx.quadraticCurveTo(x, y - h / 1.5, x + w / 2, y - h / 4);
        // Line down to bottom-right corner opening
        ctx.lineTo(x + w / 2.8, y + h / 2);
        // Gently curved bottom frame opening
        ctx.quadraticCurveTo(x, y + h / 2 + 2, x - w / 2.8, y + h / 2);
        ctx.closePath();

        ctx.fillStyle = lantern.color + alpha + ")";
        ctx.fill();

        ctx.restore();

        // Draw glowing inner candle flame core (white hot center)
        ctx.beginPath();
        ctx.arc(x, y + h / 2.2, 3.5 * (w / 28), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Draw yellow outer flame core halo
        ctx.beginPath();
        ctx.arc(x, y + h / 2.2, 7 * (w / 28), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 224, 71, ${0.85 * alpha})`;
        ctx.fill();

        return lantern.life > 0 && lantern.y > -h;
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
