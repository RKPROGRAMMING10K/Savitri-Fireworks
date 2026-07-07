"use client";

import React, { useEffect, useRef } from "react";

interface Lantern {
  x: number;
  y: number;
  size: number;
  speed: number;
  swaySpeed: number;
  swayAmp: number;
  phase: number;
  alpha: number;
  flameFlicker: number;
}

interface Shell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

interface Cracker {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  trail: { x: number; y: number }[];
}

export default function LoginCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lanternsRef = useRef<Lantern[]>([]);
  const shellsRef = useRef<Shell[]>([]);
  const crackersRef = useRef<Cracker[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 1. Initialize Sky Lanterns (diwali balloon candles)
    const initLanterns = () => {
      const lanterns: Lantern[] = [];
      const count = 12; // Moderate amount for premium subtle look
      for (let i = 0; i < count; i++) {
        lanterns.push({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + Math.random() * window.innerHeight * 0.8,
          size: Math.random() * 14 + 10, // width of lantern
          speed: Math.random() * 0.5 + 0.35,
          swaySpeed: Math.random() * 0.02 + 0.01,
          swayAmp: Math.random() * 15 + 8,
          phase: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.5 + 0.4,
          flameFlicker: Math.random(),
        });
      }
      lanternsRef.current = lanterns;
    };
    initLanterns();

    // 2. Active event listener to spark on clicks (firecrackers)
    const handleCanvasClick = (e: MouseEvent) => {
      createFirecracker(e.clientX, e.clientY);
    };
    window.addEventListener("click", handleCanvasClick);

    // Custom event to allow programmatic trigger (e.g. on form submission)
    const handleSubmitTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const x = customEvent.detail?.x || window.innerWidth / 2;
      const y = customEvent.detail?.y || window.innerHeight / 2;
      // Massive burst
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createFirecracker(
            x + (Math.random() - 0.5) * 100,
            y + (Math.random() - 0.5) * 100
          );
        }, i * 150);
      }
    };
    window.addEventListener("trigger-login-firecracker", handleSubmitTrigger);

    const createFirecracker = (x: number, y: number) => {
      const crackerCount = 45;
      const colors = [
        "rgba(255, 60, 60, ",   // crimson
        "rgba(255, 160, 30, ",  // bright gold
        "rgba(255, 230, 80, ",  // gold-white
        "rgba(0, 240, 255, ",   // neon sky
      ];
      for (let i = 0; i < crackerCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        crackersRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.5 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.015,
          trail: [],
        });
      }
    };

    // 3. Animation Loop
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- A. UPDATE & DRAW SKY BALLOON LANTERNS ---
      lanternsRef.current.forEach((l) => {
        l.y -= l.speed;
        l.phase += l.swaySpeed;
        const currentX = l.x + Math.sin(l.phase) * l.swayAmp;
        l.flameFlicker += 0.15;

        // Reset when moving off-screen
        if (l.y < -l.size * 2) {
          l.y = canvas.height + l.size * 2;
          l.x = Math.random() * canvas.width;
          l.alpha = Math.random() * 0.5 + 0.4;
        }

        // Draw ambient lantern outer glow
        const glowRad = l.size * 3.5;
        const glowGrad = ctx.createRadialGradient(
          currentX, l.y, 2,
          currentX, l.y, glowRad
        );
        glowGrad.addColorStop(0, `rgba(255, 120, 30, ${l.alpha * 0.28})`);
        glowGrad.addColorStop(0.4, `rgba(255, 80, 0, ${l.alpha * 0.08})`);
        glowGrad.addColorStop(1, "rgba(255, 80, 0, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(currentX, l.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Draw lantern balloon envelope body (rounded shield or hot air balloon capsule)
        ctx.fillStyle = `rgba(255, 90, 20, ${l.alpha * 0.85})`;
        ctx.strokeStyle = `rgba(255, 150, 50, ${l.alpha * 0.95})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Drawing a paper lantern shape
        ctx.moveTo(currentX - l.size * 0.6, l.y + l.size * 0.8); // bottom left
        ctx.quadraticCurveTo(currentX - l.size * 1.1, l.y - l.size * 0.4, currentX - l.size * 0.7, l.y - l.size * 0.9); // top-left curve
        ctx.lineTo(currentX + l.size * 0.7, l.y - l.size * 0.9); // top flat line
        ctx.quadraticCurveTo(currentX + l.size * 1.1, l.y - l.size * 0.4, currentX + l.size * 0.6, l.y + l.size * 0.8); // top-right curve
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw collar details at base of envelope
        ctx.fillStyle = `rgba(180, 50, 10, ${l.alpha * 0.9})`;
        ctx.fillRect(currentX - l.size * 0.4, l.y + l.size * 0.8, l.size * 0.8, l.size * 0.15);

        // Draw candle fire flame glow (flickering orange-yellow bulb)
        const flicker = Math.sin(l.flameFlicker) * 1.5;
        const flameY = l.y + l.size * 0.9;
        const flameRad = l.size * 0.28 + flicker;

        ctx.fillStyle = "rgba(255, 230, 100, 1)";
        ctx.beginPath();
        ctx.arc(currentX, flameY, flameRad * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 140, 0, 0.8)";
        ctx.beginPath();
        ctx.moveTo(currentX - flameRad, flameY);
        ctx.quadraticCurveTo(currentX, flameY - flameRad * 2.2, currentX, flameY - flameRad * 2.5);
        ctx.quadraticCurveTo(currentX, flameY - flameRad * 2.2, currentX + flameRad, flameY);
        ctx.closePath();
        ctx.fill();
      });

      // --- B. SPAWN & UPDATE FLOWER-POT FOUNTAINS ---
      // --- B. SPAWN & UPDATE SKY SHELLS ---
      // Launch occasional rockets from the bottom of the screen that soar up and detonate
      if (Math.random() < 0.015 && shellsRef.current.length < 4) {
        const x = Math.random() * (canvas.width - 200) + 100;
        const targetY = Math.random() * (canvas.height * 0.45) + canvas.height * 0.15;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.12; // vertical with slight variance
        const speed = Math.random() * 6 + 9;
        shellsRef.current.push({
          x,
          y: canvas.height + 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          targetY,
          color: `rgba(${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, 255, `,
          size: Math.random() * 1.8 + 1.2,
          trail: [],
        });
      }

      // Update shells
      for (let i = shellsRef.current.length - 1; i >= 0; i--) {
        const s = shellsRef.current[i];
        
        // Track trail path
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 25) s.trail.shift();

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // small air drag/gravity

        // Draw shell rocket exhaust trail (sparkling particle line)
        if (s.trail.length > 1) {
          for (let t = 0; t < s.trail.length - 1; t++) {
            const p1 = s.trail[t];
            const p2 = s.trail[t + 1];
            const alpha = t / s.trail.length; // fade trail towards the bottom
            
            // Draw core golden smoke
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 174, 25, ${alpha * 0.75})`;
            ctx.lineWidth = s.size * (0.3 + alpha * 0.7);
            ctx.stroke();

            // Extra sparks dripping off the trail randomly
            if (Math.random() < 0.15) {
              ctx.fillStyle = `rgba(255, 230, 150, ${alpha * 0.9})`;
              ctx.beginPath();
              ctx.arc(
                p1.x + (Math.random() - 0.5) * 6,
                p1.y + (Math.random() - 0.5) * 6,
                Math.random() * 1.5,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        }

        // Draw bright glowing shell rocket tip
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.2, "rgba(255, 200, 50, 0.9)");
        gradient.addColorStop(0.6, "rgba(255, 100, 0, 0.4)");
        gradient.addColorStop(1, "rgba(255, 100, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Trigger detonate explosion when height goal is reached
        if (s.vy >= 0 || s.y <= s.targetY) {
          createFirecracker(s.x, s.y);
          shellsRef.current.splice(i, 1);
        }
      }

      // --- C. UPDATE & DRAW INTERACTIVE FIRECRACKERS ---
      for (let i = crackersRef.current.length - 1; i >= 0; i--) {
        const c = crackersRef.current[i];
        c.vx *= 0.98;
        c.vy *= 0.98;
        c.vy += 0.05; // tiny gravity
        c.x += c.vx;
        c.y += c.vy;
        c.alpha -= c.decay;

        // Keep trail
        c.trail.push({ x: c.x, y: c.y });
        if (c.trail.length > 5) c.trail.shift();

        if (c.alpha <= 0) {
          crackersRef.current.splice(i, 1);
          continue;
        }

        // Draw trail path
        if (c.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(c.trail[0].x, c.trail[0].y);
          for (let t = 1; t < c.trail.length; t++) {
            ctx.lineTo(c.trail[t].x, c.trail[t].y);
          }
          ctx.strokeStyle = c.color + `${c.alpha * 0.8})`;
          ctx.lineWidth = c.size * 0.7;
          ctx.stroke();
        }

        // Flash spark core
        ctx.fillStyle = c.color + `${c.alpha})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("trigger-login-firecracker", handleSubmitTrigger);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none block bg-zinc-950"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
