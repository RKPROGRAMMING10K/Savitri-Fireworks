"use client";

import React, { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  path: Point[];
  pathLength: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  friction: number;
  brightness: number;
}

interface Shell {
  x: number;
  y: number;
  path: Point[];
  pathLength: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  type: "willow" | "chrysanthemum" | "crackle";
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shellsRef = useRef<Shell[]>([]);

  // Highly saturated, vibrant firework colors that pop against any backdrop
  const palettes = [
    "rgba(255, 110, 0, ",   // Electric Orange
    "rgba(255, 220, 0, ",   // Brilliant Gold
    "rgba(255, 30, 30, ",   // Intense Crimson
    "rgba(255, 50, 180, ",  // Hot Pink
    "rgba(50, 150, 255, ",  // Deep Sky Blue
    "rgba(0, 255, 120, ",   // Neon Emerald
    "rgba(200, 80, 255, ",  // Royal Violet
  ];

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

    // Create a realistic burst with path-based trail rendering
    const createBurst = (x: number, y: number, colorPrefix: string, type: "willow" | "chrysanthemum" | "crackle") => {
      let count = 80 + Math.floor(Math.random() * 40);
      
      let gravity = 0.05;
      let friction = 0.965;
      let baseDecay = 0.009;
      let pathLength = 6;
      
      if (type === "willow") {
        count = 90 + Math.floor(Math.random() * 30);
        gravity = 0.022;   // floats longer
        friction = 0.98;   // hangs longer in air
        baseDecay = 0.006; // long weeping trails
        pathLength = 16;   // long visible trail length
        colorPrefix = "rgba(255, 205, 50, "; // Gold willow
      } else if (type === "crackle") {
        count = 100;
        gravity = 0.07;
        friction = 0.94;
        baseDecay = 0.02; // quick crackling pops
        pathLength = 4;
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speedMultiplier = type === "willow" ? 5.5 : type === "crackle" ? 6 : 8.5;
        const speed = (Math.random() * 0.85 + 0.25) * speedMultiplier;
        
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        let size = Math.random() * 2.5 + 1.8;
        if (type === "willow") size = Math.random() * 3.2 + 2.2;
        if (type === "crackle") size = Math.random() * 2 + 1.2;

        particlesRef.current.push({
          x,
          y,
          path: [],
          pathLength,
          vx,
          vy,
          color: colorPrefix,
          alpha: 1.0,
          decay: baseDecay + Math.random() * 0.004,
          size,
          gravity,
          friction,
          brightness: Math.random() * 0.3 + 0.7,
        });
      }

      // Crackles burst ring
      if (type === "crackle") {
        for (let j = 0; j < 20; j++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2.5 + 0.5;
          particlesRef.current.push({
            x,
            y,
            path: [],
            pathLength: 3,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: "rgba(255, 255, 255, ",
            alpha: 1.0,
            decay: 0.025,
            size: 2.0,
            gravity: 0.03,
            friction: 0.95,
            brightness: 1.0,
          });
        }
      }
    };

    // Launch a shell with path-based trail rendering
    const launchShell = () => {
      const startX = Math.random() * (canvas.width * 0.7) + (canvas.width * 0.15);
      const startY = canvas.height;
      const targetX = startX + (Math.random() * 200 - 100);
      const targetY = Math.random() * (canvas.height * 0.35) + 60;
      
      const typeRand = Math.random();
      const type = typeRand < 0.35 ? "willow" : typeRand < 0.75 ? "chrysanthemum" : "crackle";
      const color = palettes[Math.floor(Math.random() * palettes.length)];

      const dx = targetX - startX;
      const dy = targetY - startY;
      const vy = -Math.sqrt(2 * 0.09 * (startY - targetY));
      const duration = (targetY - startY) / (vy / 2);
      const vx = dx / duration;

      shellsRef.current.push({
        x: startX,
        y: startY,
        path: [],
        pathLength: 8,
        targetX,
        targetY,
        vx,
        vy,
        color,
        size: Math.random() * 1.5 + 2.5,
        type,
      });
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const types: ("willow" | "chrysanthemum" | "crackle")[] = ["willow", "chrysanthemum", "crackle"];
      const type = types[Math.floor(Math.random() * types.length)];
      const color = palettes[Math.floor(Math.random() * palettes.length)];
      
      createBurst(x, y, color, type);
    };

    const handleTriggerFirework = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; color?: string; type?: "willow" | "chrysanthemum" | "crackle" }>;
      if (!customEvent.detail) return;
      const { x, y, color, type } = customEvent.detail;
      const sparkColor = color || palettes[Math.floor(Math.random() * palettes.length)];
      const burstType = type || (Math.random() < 0.35 ? "willow" : Math.random() < 0.5 ? "crackle" : "chrysanthemum");
      createBurst(x, y, sparkColor, burstType);
    };

    window.addEventListener("mousedown", handleGlobalClick);
    window.addEventListener("trigger-firework", handleTriggerFirework);

    // Auto launch
    let autoLaunchTimer = setInterval(() => {
      if (document.hidden) return;
      launchShell();
      if (Math.random() < 0.5) {
        setTimeout(launchShell, 400);
      }
    }, 2400);

    let animationFrameId: number;
    const animate = () => {
      // Clear the canvas COMPLETELY so it remains transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & Draw Rising Shells
      const shells = shellsRef.current;
      for (let i = shells.length - 1; i >= 0; i--) {
        const s = shells[i];
        
        // Push last position to path
        s.path.push({ x: s.x, y: s.y });
        if (s.path.length > s.pathLength) {
          s.path.shift();
        }

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.09;

        // Draw path trail
        if (s.path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(s.path[0].x, s.path[0].y);
          for (let j = 1; j < s.path.length; j++) {
            ctx.lineTo(s.path[j].x, s.path[j].y);
          }
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = s.color + "0.6)";
          ctx.lineWidth = s.size;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Spawn ascent sparks
        if (Math.random() < 0.5) {
          particlesRef.current.push({
            x: s.x,
            y: s.y,
            path: [],
            pathLength: 4,
            vx: (Math.random() - 0.5) * 2.0,
            vy: (Math.random() - 0.2) * 1.5,
            color: "rgba(255, 190, 50, ",
            alpha: 0.9,
            decay: 0.03,
            size: 1.8,
            gravity: 0.02,
            friction: 0.97,
            brightness: 1.0,
          });
        }

        if (s.vy >= -0.2 || s.y <= s.targetY) {
          createBurst(s.x, s.y, s.color, s.type);
          shells.splice(i, 1);
        }
      }

      // Update & Draw Exploding Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.path.push({ x: p.x, y: p.y });
        if (p.path.length > p.pathLength) {
          p.path.shift();
        }

        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle path line (trail)
        if (p.path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.path[0].x, p.path[0].y);
          for (let j = 1; j < p.path.length; j++) {
            ctx.lineTo(p.path[j].x, p.path[j].y);
          }
          ctx.lineTo(p.x, p.y);

          const currentAlpha = p.alpha * p.brightness * (Math.random() * 0.25 + 0.75);
          ctx.strokeStyle = p.color + `${currentAlpha})`;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Willow particles sparkle effect
        if (p.friction > 0.98 && p.alpha < 0.6 && Math.random() < 0.15) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousedown", handleGlobalClick);
      window.removeEventListener("trigger-firework", handleTriggerFirework);
      clearInterval(autoLaunchTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 w-full h-full pointer-events-none block"
    />
  );
}
