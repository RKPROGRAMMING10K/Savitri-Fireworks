"use client";

import React, { useEffect, useRef } from "react";

export default function DealersCanvas() {
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

    interface Node {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
    }

    interface LightLine {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      progress: number;
      speed: number;
      color: string;
    }

    const nodes: Node[] = [];
    const maxNodes = 25;
    let activeLines: LightLine[] = [];

    // Initialize nodes representing coordinates
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        pulse: Math.random(),
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Trigger electrical discharge lines on state click
    const handleStateSelected = (e: Event) => {
      const customEvent = e as CustomEvent;
      const originX = customEvent.detail?.x || width * 0.75; // Left click or default state position
      const originY = customEvent.detail?.y || height * 0.5;

      // Shoot lines towards random nodes
      const targetCount = Math.min(8, nodes.length);
      const shuffledNodes = [...nodes].sort(() => 0.5 - Math.random());

      for (let i = 0; i < targetCount; i++) {
        activeLines.push({
          startX: originX,
          startY: originY,
          endX: shuffledNodes[i].x,
          endY: shuffledNodes[i].y,
          progress: 0,
          speed: Math.random() * 0.03 + 0.02,
          color: `hsla(${Math.floor(Math.random() * 30) + 15}, 100%, 65%, `,
        });
      }
    };

    window.addEventListener("state-selected", handleStateSelected);

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint grid gridline pattern
      ctx.strokeStyle = "rgba(255,255,255,0.015)";
      if (document.documentElement.classList.contains("dark") === false) {
        ctx.strokeStyle = "rgba(0,0,0,0.02)";
      }
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and Draw Nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce borders
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        n.pulse += n.pulseSpeed;
        if (n.pulse > Math.PI) n.pulse = 0;

        const pulseRad = n.radius + Math.sin(n.pulse) * 4;
        const pulseAlpha = 0.15 * (1 - Math.sin(n.pulse));

        // Draw pulsing coordinates radar rings
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseRad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${pulseAlpha})`;
        ctx.fill();

        // Draw node center point
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.4)";
        ctx.fill();
      });

      // Draw connection lines between close nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.08;
            ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and Draw active electric lightning discharge lines
      activeLines = activeLines.filter((line) => {
        line.progress += line.speed;

        const currentX = line.startX + (line.endX - line.startX) * line.progress;
        const currentY = line.startY + (line.endY - line.startY) * line.progress;

        // Draw laser connection lines
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = line.color + (1 - line.progress) * 0.7 + ")";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Draw spark splash point at the head
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fillStyle = line.color + "1)";
        ctx.fill();

        return line.progress < 1;
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("state-selected", handleStateSelected);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
